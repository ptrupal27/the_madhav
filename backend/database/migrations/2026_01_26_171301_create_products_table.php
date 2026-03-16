<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->timestamps();

            // Modified for multi-language and additional features
            $table->json('name'); // JSON for multi-language names
            $table->json('description')->nullable(); // JSON for multi-language descriptions
            $table->boolean('is_active')->default(true);
            $table->integer('stock')->default(0);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
