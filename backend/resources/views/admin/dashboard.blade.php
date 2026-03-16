@extends('admin.layouts.app')

@section('content')
    <h2>Dashboard</h2>
    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <h5 class="card-title">Total Orders</h5>
                    <p class="card-text fs-2">{{ $totalOrders }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-white bg-success">
                <div class="card-body">
                    <h5 class="card-title">Products</h5>
                    <p class="card-text fs-2">{{ $totalProducts }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-white bg-warning">
                <div class="card-body">
                    <h5 class="card-title">Customers</h5>
                    <p class="card-text fs-2">{{ $totalUsers }}</p>
                </div>
            </div>
        </div>
    </div>

    <h3>Recent Orders</h3>
    <table class="table bg-white">
        <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($recentOrders as $order)
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>{{ $order->user ? $order->user->name : 'Guest' }}</td>
                    <td>₹{{ $order->total_amount }}</td>
                    <td><span class="badge bg-secondary">{{ $order->status }}</span></td>
                    <td>{{ $order->created_at->format('d M Y') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection