<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Exception;

class OrderController extends Controller
{
    public function placeOrder(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required', // can be string or array
            'payment_method' => 'required|string',
            'phone' => 'required|string'
        ]);

        $user = $request->user();
        
        $cartItemsProcessing = collect();
        $dbCart = null;

        if ($request->has('cart_items') && is_array($request->cart_items) && count($request->cart_items) > 0) {
            foreach ($request->cart_items as $clientItem) {
                $productId = $clientItem['product_id'] ?? null;
                $isRealProduct = is_numeric($productId) || (is_string($productId) && preg_match('/^[0-9a-f-]{32,36}$/i', $productId));
                
                if ($isRealProduct) {
                    $product = Product::find($productId);
                } else {
                    $product = Product::whereRaw('LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, "$.en"))) = ?', [strtolower($clientItem['name'])])->first();
                    if (!$product) {
                        try {
                            $product = Product::create([
                                'name' => ['en' => $clientItem['name']],
                                'slug' => Str::slug($clientItem['name']) . '-' . uniqid(),
                                'sku' => 'MOCK-' . strtoupper(substr(md5(uniqid()), 0, 6)),
                                'description' => ['en' => 'Auto-generated mock product from frontend'],
                                'price' => floatval($clientItem['price']),
                                'stock' => 100,
                                'is_active' => true,
                                'image' => $clientItem['img'] ?? null
                            ]);
                        } catch (\Exception $e) {
                            continue;
                        }
                    }
                }

                if ($product) {
                    $cartItemsProcessing->push((object)[
                        'product_id' => $product->id,
                        'product' => $product,
                        'quantity' => $clientItem['quantity'] ?? 1,
                    ]);
                }
            }
            
            // Also try to grab the DB cart so we can clear it afterwards
            if ($user) {
                $dbCart = Cart::where('user_id', $user->id)->first();
            } elseif ($sessionId = $request->header('X-Session-ID')) {
                $dbCart = Cart::where('session_id', $sessionId)->first();
            }
            
        } else {
            if ($user) {
                $dbCart = Cart::where('user_id', $user->id)->with('items.product')->first();
            } else {
                $sessionId = $request->header('X-Session-ID');
                if ($sessionId) {
                    $dbCart = Cart::where('session_id', $sessionId)->with('items.product')->first();
                }
            }
            
            if ($dbCart) {
                $cartItemsProcessing = $dbCart->items;
            }
        }

        if ($cartItemsProcessing->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Calculate Total
        $totalAmount = collect($cartItemsProcessing)->map(function ($item) {
            return $item->quantity * $item->product->price;
        })->sum();

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_status' => 'unpaid', // Default to unpaid
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
            ]);

            foreach ($cartItemsProcessing as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);
            }

            // Clear Cart if it exists
            if ($dbCart) {
                $dbCart->items()->delete();
                $dbCart->delete();
            }

            $cashfreeOrder = null;
            if ($request->payment_method === 'online') {
                $response = Http::withHeaders([
                    'x-client-id' => env('CASHFREE_APP_ID'),
                    'x-client-secret' => env('CASHFREE_SECRET_KEY'),
                    'x-api-version' => env('CASHFREE_API_VERSION', '2023-08-01'),
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post(env('CASHFREE_API_URL') . '/orders', [
                    'order_id' => $order->order_number,
                    'order_amount' => $totalAmount,
                    'order_currency' => 'INR',
                    'customer_details' => [
                        'customer_id' => 'cust_' . $user->id,
                        'customer_name' => $request->full_name ?? 'Customer',
                        'customer_email' => $request->email ?? 'customer@example.com',
                        'customer_phone' => $request->phone ?? '9999999999',
                    ],
                    'order_meta' => [
                        'return_url' => env('FRONTEND_URL') . '/user/dashboard?order_id={order_id}',
                    ]
                ]);

                if ($response->successful()) {
                    $cashfreeOrder = $response->json();
                    $order->update(['transaction_id' => $cashfreeOrder['order_id'] ?? null]);
                } else {
                    throw new Exception("Payment gateway error: " . $response->body());
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created',
                'order' => $order,
                'cashfree_order' => $cashfreeOrder
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required'
        ]);

        try {
            $orderNumber = $request->order_id;
            
            $response = Http::withHeaders([
                'x-client-id' => env('CASHFREE_APP_ID'),
                'x-client-secret' => env('CASHFREE_SECRET_KEY'),
                'x-api-version' => env('CASHFREE_API_VERSION', '2023-08-01'),
            ])->get(env('CASHFREE_API_URL') . '/orders/' . $orderNumber . '/payments');

            if ($response->successful()) {
                $payments = $response->json();
                
                $isPaid = false;
                $paymentId = null;
                
                // Handle cases where payments might be directly the array or inside an array
                if (isset($payments[0]) && is_array($payments[0])) {
                    foreach($payments as $payment) {
                        if(isset($payment['payment_status']) && $payment['payment_status'] === 'SUCCESS') {
                            $isPaid = true;
                            $paymentId = $payment['cf_payment_id'] ?? null;
                            break;
                        }
                    }
                } elseif (isset($payments['payment_status']) && $payments['payment_status'] === 'SUCCESS') {
                    $isPaid = true;
                    $paymentId = $payments['cf_payment_id'] ?? null;
                }

                $order = Order::where('order_number', $orderNumber)->firstOrFail();
                
                if ($isPaid) {
                    $order->update([
                        'payment_status' => 'paid',
                        'payment_id' => $paymentId,
                        'status' => 'confirmed'
                    ]);
                    return response()->json(['message' => 'Payment verified successfully']);
                }
            }

            return response()->json(['message' => 'Payment verification failed', 'details' => $response->json()], 400);

        } catch (Exception $e) {
            return response()->json(['message' => 'Payment verification error', 'error' => $e->getMessage()], 400);
        }
    }
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with('items.product')->get());
    }

    public function trackOrder($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'order_number' => $order->order_number,
            'status' => $order->status,
            'shipping_status' => $order->shipping_status,
            'tracking_number' => $order->tracking_number,
            'courier_name' => $order->courier_name,
            'estimated_delivery_date' => $order->estimated_delivery_date,
            'created_at' => $order->created_at,
            'items' => $order->items->map(function ($item) {
                return [
                    'product_name' => $item->product->name['en'] ?? 'Product',
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ];
            }),
            'total_amount' => $order->total_amount
        ]);
    }
}
