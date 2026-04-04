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
use App\Models\Setting;

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
            $defaultCategory = DB::table('categories')->first();
            $defaultCategoryId = $defaultCategory ? $defaultCategory->id : 1;

            foreach ($request->cart_items as $clientItem) {
                $productId = $clientItem['product_id'] ?? null;
                $product = null;

                // 1. Try finding by ID if it looks like a real ID (numeric or UUID)
                if ($productId && (is_numeric($productId) || preg_match('/^[0-9a-f-]{32,36}$/i', $productId))) {
                    $product = Product::find($productId);
                }

                // 2. Fallback: Search by name if ID failed or was a mock ID (like "h9")
                if (!$product && !empty($clientItem['name'])) {
                    $searchName = strtolower($clientItem['name']);
                    $product = Product::where(function($q) use ($searchName) {
                        $q->whereRaw('LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, "$.en"))) = ?', [$searchName])
                          ->orWhereRaw('LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, "$.hi"))) = ?', [$searchName])
                          ->orWhereRaw('LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, "$.gu"))) = ?', [$searchName]);
                    })->first();
                }

                // 3. Last Resort: Create a temporary mock product so the order doesn't fail
                if (!$product && !empty($clientItem['name'])) {
                    try {
                        // Find ANY valid category to satisfy the foreign key constraint
                        $anyCategory = DB::table('categories')->first();
                        if (!$anyCategory) {
                            throw new Exception("Please create at least one category in admin panel before placing orders.");
                        }

                        $imagePath = $clientItem['img'] ?? null;
                        // Avoid saving long base64 strings to the 'image' column (VARCHAR)
                        if ($imagePath && str_starts_with($imagePath, 'data:')) {
                            $imagePath = null; 
                        }

                        $product = Product::create([
                            'category_id' => $anyCategory->id,
                            'name' => ['en' => $clientItem['name']],
                            'slug' => Str::slug($clientItem['name']) . '-' . uniqid(),
                            'sku' => 'MOCK-' . strtoupper(substr(md5(uniqid()), 0, 6)),
                            'description' => ['en' => 'Auto-generated mock product'],
                            'price' => floatval($clientItem['price'] ?? 0),
                            'stock' => 100,
                            'is_active' => true,
                            'image' => $imagePath
                        ]);
                    } catch (\Exception $e) {
                        throw new Exception("Could not create mock product: " . $e->getMessage());
                    }
                }

                if ($product) {
                    $cartItemsProcessing->push((object)[
                        'product_id' => $product->id,
                        'product' => $product,
                        'quantity' => $clientItem['quantity'] ?? 1,
                        'price' => $clientItem['price'] ?? ($product ? $product->price : 0)
                    ]);
                } else {
                    // Fail-safe: Even if product lookup/creation fails, we can't create an OrderItem without a product_id.
                    // However, we already have a Mock Product creation above. If it STILL fails, there's a DB issue.
                    throw new Exception("Could not process product: " . ($clientItem['name'] ?? 'Unknown'));
                }
            }
            
            if ($user) {
                $dbCart = Cart::where('user_id', $user->id)->first();
            } elseif ($sessionId = $request->header('X-Session-ID')) {
                $dbCart = Cart::where('session_id', $sessionId)->first();
            }
            
        } else {
            // Logic for when no cart_items are passed (uses backend session cart)
            if ($user) {
                $dbCart = Cart::where('user_id', $user->id)->with('items.product')->first();
            } else {
                $sessionId = $request->header('X-Session-ID');
                if ($sessionId) {
                    $dbCart = Cart::where('session_id', $sessionId)->with('items.product')->first();
                }
            }
            
            if ($dbCart && $dbCart->items->isNotEmpty()) {
                foreach($dbCart->items as $item) {
                     $cartItemsProcessing->push((object)[
                        'product_id' => $item->product_id,
                        'product' => $item->product,
                        'quantity' => $item->quantity,
                        'price' => $item->product->price
                    ]);
                }
            }
        }

        if ($cartItemsProcessing->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
                'debug' => [
                    'received_cart_items' => $request->cart_items,
                    'is_user_logged_in' => $user ? true : false,
                    'has_db_cart' => $dbCart ? true : false
                ]
            ], 400);
        }

        // Calculate Total
        $totalAmount = $cartItemsProcessing->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        // Get Settings for Payment Keys
        $settings = Setting::all()->pluck('value', 'key');

        DB::beginTransaction();
        try {
            $orderData = [
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
            ];

            if ($user) {
                $orderData['user_id'] = $user->id;
            } else {
                // For guest checkout, we need to make sure the database allows user_id to be null.
                // If the user's migration hasn't run yet, this will fail.
                $orderData['user_id'] = null; // Ensuring explicit null for guest
            }

            $order = Order::create($orderData);

            foreach ($cartItemsProcessing as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }

            // Clear Cart if it exists
            if ($dbCart) {
                $dbCart->items()->delete();
                $dbCart->delete();
            }

            $cashfreeOrder = null;
            if ($request->payment_method === 'online') {
                // Cashfree Order Creation logic
                // Get Settings with fallback to ENV if setting is empty string or null
                $cfAppId = !empty($settings['cashfree_app_id']) ? trim($settings['cashfree_app_id']) : env('CASHFREE_APP_ID');
                $cfSecret = !empty($settings['cashfree_secret_key']) ? trim($settings['cashfree_secret_key']) : env('CASHFREE_SECRET_KEY');
                $cfVersion = !empty($settings['cashfree_api_version']) ? trim($settings['cashfree_api_version']) : env('CASHFREE_API_VERSION', '2023-08-01');
                
                $mode = !empty($settings['cashfree_mode']) ? $settings['cashfree_mode'] : (str_contains(env('CASHFREE_API_URL', ''), 'sandbox') ? 'sandbox' : 'production');
                $cfUrl = ($mode === 'sandbox')
                    ? 'https://sandbox.cashfree.com/pg' 
                    : 'https://api.cashfree.com/pg';

                // Clean phone number: take only digits and ensure it's the last 10 digits
                $cleanPhone = preg_replace('/[^0-9]/', '', $request->phone);
                $cleanPhone = strlen($cleanPhone) > 10 ? substr($cleanPhone, -10) : $cleanPhone;

                $frontendUrl = env('FRONTEND_URL', 'https://themadhav.com');
                // Ensure it starts with http
                if (!str_starts_with($frontendUrl, 'http')) {
                    $frontendUrl = 'https://themadhav.com';
                }
                $returnUrl = rtrim($frontendUrl, '/') . '/user/dashboard?order_id={order_id}';

                $response = Http::withHeaders([
                    'x-client-id' => $cfAppId,
                    'x-client-secret' => $cfSecret,
                    'x-api-version' => $cfVersion,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post($cfUrl . '/orders', [
                    'order_id' => $order->order_number,
                    'order_amount' => round($totalAmount, 2),
                    'order_currency' => 'INR',
                    'customer_details' => [
                        'customer_id' => 'cust_' . ($user->id ?? uniqid()),
                        'customer_name' => substr($request->full_name ?? 'Customer', 0, 50),
                        'customer_email' => $request->email ?? 'customer@example.com',
                        'customer_phone' => $cleanPhone ?: '9999999999',
                    ],
                    'order_meta' => [
                        'return_url' => $returnUrl,
                    ]
                ]);

                if ($response->successful()) {
                    $cashfreeOrder = $response->json();
                    $order->update(['transaction_id' => $cashfreeOrder['order_id'] ?? null]);
                } else {
                    $errorData = $response->json();
                    $errorMsg = $errorData['message'] ?? $response->body();
                    $debugInfo = " Mode: $mode, Source: " . (!empty($settings['cashfree_app_id']) ? 'Admin Settings' : 'ENV File') . ", Key Prefix: " . substr($cfSecret, 0, 10);
                    throw new Exception("Cashfree Payment Error: " . $errorMsg . " ($debugInfo)");
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created',
                'order' => $order,
                'cashfree_order' => $cashfreeOrder,
                'cashfree_mode' => $settings['cashfree_mode'] ?? (str_contains(env('CASHFREE_API_URL', ''), 'sandbox') ? 'sandbox' : 'production')
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
            
            // Verify with Cashfree
            $settings = Setting::all()->pluck('value', 'key');
            $cfAppId = trim($settings['cashfree_app_id'] ?? env('CASHFREE_APP_ID'));
            $cfSecret = trim($settings['cashfree_secret_key'] ?? env('CASHFREE_SECRET_KEY'));
            $cfVersion = trim($settings['cashfree_api_version'] ?? env('CASHFREE_API_VERSION', '2023-08-01'));
            
            $mode = $settings['cashfree_mode'] ?? (str_contains(env('CASHFREE_API_URL', ''), 'sandbox') ? 'sandbox' : 'production');
            $cfUrl = ($mode === 'sandbox')
                ? 'https://sandbox.cashfree.com/pg' 
                : 'https://api.cashfree.com/pg';

            $response = Http::withHeaders([
                'x-client-id' => $cfAppId,
                'x-client-secret' => $cfSecret,
                'x-api-version' => $cfVersion,
            ])->get($cfUrl . '/orders/' . $orderNumber . '/payments');

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
