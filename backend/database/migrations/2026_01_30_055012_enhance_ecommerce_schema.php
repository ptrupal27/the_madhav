<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Brands Table
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Sub-Categories Table
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->json('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // 3. Enhance Products Table
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('brand_id')->nullable()->after('category_id')->constrained()->onDelete('set null');
            $table->foreignId('sub_category_id')->nullable()->after('brand_id')->constrained()->onDelete('set null');
            $table->decimal('discount_price', 10, 2)->nullable()->after('price');
            $table->json('images')->nullable()->after('image'); // For multiple images
            $table->string('sku')->nullable()->unique()->after('slug');
        });

        // 4. Enhance Orders Table
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->nullable()->unique()->after('id');
            $table->string('shipping_status')->default('pending')->after('status'); // pending, confirmed, packed, shipped, out_for_delivery, delivered, cancelled, returned
            $table->string('payment_status')->default('unpaid')->after('shipping_status'); // unpaid, paid, failed, refunded
            $table->decimal('shipping_charge', 10, 2)->default(0)->after('total_amount');
            $table->string('courier_name')->nullable()->after('transaction_id');
            $table->string('tracking_number')->nullable()->after('courier_name');
            $table->timestamp('delivered_at')->nullable()->after('tracking_number');
            $table->text('admin_note')->nullable()->after('delivered_at');
        });

        // 5. Settings Table for GST, Currency, etc.
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['order_number', 'shipping_status', 'payment_status', 'shipping_charge', 'courier_name', 'tracking_number', 'delivered_at', 'admin_note']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['products_brand_id_foreign']);
            $table->dropForeign(['products_sub_category_id_foreign']);
            $table->dropColumn(['brand_id', 'sub_category_id', 'discount_price', 'images', 'sku']);
        });

        Schema::dropIfExists('sub_categories');
        Schema::dropIfExists('brands');
    }
};
