<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordOtpController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminSubCategoryController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\User\UserDashboardController;
use Illuminate\Support\Facades\Mail;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password/send-otp', [ForgotPasswordOtpController::class, 'sendOtp']);
Route::post('/forgot-password/verify-otp', [ForgotPasswordOtpController::class, 'verifyOtp']);
Route::post('/forgot-password/reset', [ForgotPasswordOtpController::class, 'resetPassword']);


Route::get('/test-mail', function () {
    Mail::raw('OTP Test Mail', function ($message) {
        $message->to('dharmeshkatriya512@gmail.com')
                ->subject('Laravel Test');
    });

    return 'Mail Sent';
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/home-settings', [\App\Http\Controllers\Api\SettingController::class, 'getHomeSettings']);
Route::get('/track-order/{orderNumber}', [OrderController::class, 'trackOrder']);
Route::post('/checkout', [OrderController::class, 'placeOrder']);
Route::post('/verify-payment', [OrderController::class, 'verifyPayment']);

// Cart routes - accessible by public (session based) and auth users
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart/add', [CartController::class, 'addToCart']);
Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);

        // Dashboard & Users
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/dashboard/users', [AdminDashboardController::class, 'users']);
        Route::get('/dashboard/users/{id}/orders', [AdminDashboardController::class, 'userOrders']);
        Route::post('/dashboard/users/{id}/block', [AdminDashboardController::class, 'blockUser']);
        Route::delete('/dashboard/users/{id}', [AdminDashboardController::class, 'deleteUser']);


        // Categories Management
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::post('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

        // Sub-Categories Management
        Route::get('/sub-categories', [AdminSubCategoryController::class, 'index']);
        Route::get('/sub-categories/category/{categoryId}', [AdminSubCategoryController::class, 'getByCategory']);
        Route::post('/sub-categories', [AdminSubCategoryController::class, 'store']);
        Route::put('/sub-categories/{id}', [AdminSubCategoryController::class, 'update']);
        Route::delete('/sub-categories/{id}', [AdminSubCategoryController::class, 'destroy']);

        // Products Management
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::post('/products/{id}', [AdminProductController::class, 'update']); // POST for multipart/form-data support in Laravel for updates
        Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);
        Route::post('/products/{id}/remove-image', [AdminProductController::class, 'removeImage']);

        // Orders Management
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::delete('/orders/{id}', [AdminOrderController::class, 'delete']);

        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::post('/settings', [AdminSettingController::class, 'update']);
        Route::post('/settings/upload-image', [AdminSettingController::class, 'uploadImage']);
        Route::post('/settings/maintenance', [AdminSettingController::class, 'toggleMaintenanceMode']);
    });
});

// Import necessary controllers at the top

// User Dashboard Routes (Protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Orders
    Route::get('/user/orders', [UserDashboardController::class, 'myOrders']);
    Route::get('/user/orders/{id}', [UserDashboardController::class, 'orderDetails']);

    // User Profile
    Route::get('/user/profile', [UserDashboardController::class, 'profile']);
    Route::put('/user/profile', [UserDashboardController::class, 'updateProfile']);

    // Checkout
    Route::get('/orders', [OrderController::class, 'index']);
});