<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('shipping_status')) {
            $query->where('shipping_status', $request->shipping_status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->input('per_page', 20);
        $orders = $query->paginate($perPage);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.product', 'items.product.category'])->findOrFail($id);
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'sometimes|required|in:pending,confirmed,cancelled,completed',
            'shipping_status' => 'sometimes|required|in:pending,confirmed,packed,shipped,out_for_delivery,delivered,cancelled,returned',
            'payment_status' => 'sometimes|required|in:unpaid,paid,failed,refunded',
            'tracking_number' => 'nullable|string',
            'courier_name' => 'nullable|string',
            'estimated_delivery_date' => 'nullable|date',
            'admin_note' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);

        $updateData = $request->only(['status', 'shipping_status', 'payment_status', 'tracking_number', 'courier_name', 'estimated_delivery_date', 'admin_note']);

        if (isset($request->shipping_status) && $request->shipping_status === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        $order->update($updateData);

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }

    public function delete($id)
    {
        $order = Order::findOrFail($id);
        $order->items()->delete();
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
}
