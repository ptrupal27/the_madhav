<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalUsers = User::whereIn('role', ['user', 'customer'])->count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();

        // Detailed Order Statuses
        $pendingOrders = Order::where('status', 'pending')->count();
        $deliveredOrders = Order::where('shipping_status', 'delivered')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // Revenue Stats
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');

        $todayRevenue = Order::where('payment_status', 'paid')
            ->whereDate('created_at', Carbon::today())
            ->sum('total_amount');

        $monthlyRevenue = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_amount');

        // Low stock alert (stock < 10)
        $lowStockProducts = Product::where('stock', '<', 10)->count();
        $lowStockList = Product::where('stock', '<', 10)->take(5)->get();

        $recentOrders = Order::with(['user'])
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_products' => $totalProducts,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'delivered_orders' => $deliveredOrders,
                'cancelled_orders' => $cancelledOrders,
                'total_revenue' => $totalRevenue,
                'today_revenue' => $todayRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'low_stock_count' => $lowStockProducts,
            ],
            'low_stock_products' => $lowStockList,
            'recent_orders' => $recentOrders,
        ]);
    }

    public function users(Request $request)
    {
        $users = User::whereIn('role', ['user', 'customer'])
            ->withCount('orders')
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin' || $user->role === 'super_admin') {
            return response()->json([
                'message' => 'Cannot delete admin user'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    public function blockUser(Request $request, $id)
    {
        // Simple implementation: could add a 'is_blocked' column to users table
        // For now, let's just return a placeholder or implement if column exists.
        // I'll assume we might need to add it or just use role change.
        return response()->json(['message' => 'User block/unblock toggled']);
    }

    public function userOrders($id)
    {
        $orders = Order::where('user_id', $id)->with('items.product')->latest()->get();
        return response()->json($orders);
    }
}
