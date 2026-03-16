<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    protected function getCart(Request $request)
    {
        $user = $request->user('sanctum');
        $sessionId = $request->header('X-Session-ID');

        if ($user) {
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        } elseif ($sessionId) {
            $cart = Cart::firstOrCreate(['session_id' => $sessionId]);
        } else {
            // Create a new session based cart
            $sessionId = Str::uuid()->toString();
            $cart = Cart::create(['session_id' => $sessionId]);
        }

        return $cart;
    }

    public function index(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->load('items.product');
        return response()->json([
            'cart' => $cart,
            'session_id' => $cart->session_id // Return session ID for guest users to store in local storage
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $this->getCart($request);

        $cartItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        $cart->load('items.product');

        return response()->json([
            'message' => 'Item added to cart',
            'cart' => $cart,
            'session_id' => $cart->session_id
        ]);
    }

    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $this->getCart($request);
        $item = $cart->items()->where('id', $itemId)->firstOrFail();

        $item->quantity = $request->quantity;
        $item->save();

        return response()->json(['message' => 'Cart updated', 'cart' => $cart->load('items.product')]);
    }

    public function removeItem(Request $request, $itemId)
    {
        $cart = $this->getCart($request);
        $cart->items()->where('id', $itemId)->delete();

        return response()->json(['message' => 'Item removed', 'cart' => $cart->load('items.product')]);
    }
}
