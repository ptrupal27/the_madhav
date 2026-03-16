<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'user']);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token']);
    }

    public function test_user_can_browse_products_and_add_to_cart()
    {
        $category = Category::create(['name' => 'Seeds', 'slug' => 'seeds']);
        $product = Product::create([
            'name' => 'Wheat Seeds',
            'slug' => 'wheat-seeds',
            'price' => 100,
            'category_id' => $category->id,
            'description' => 'Best seeds'
        ]);

        $response = $this->getJson('/api/products');
        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Wheat Seeds']);

        // Add to Cart
        $response = $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 2
        ]);

        $response->assertStatus(200);
    }

    public function test_user_can_checkout()
    {
        $user = User::factory()->create();
        $this->actingAs($user); // Sanctum actingAs

        $category = Category::create(['name' => 'Seeds', 'slug' => 'seeds']);
        $product = Product::create([
            'name' => 'Wheat Seeds',
            'slug' => 'wheat-seeds',
            'price' => 100,
            'category_id' => $category->id
        ]);

        // Add to Cart
        $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 1
        ]);

        // Checkout
        $response = $this->postJson('/api/checkout', [
            'shipping_address' => '123 Farm Lane',
            'phone' => '1234567890',
            'payment_method' => 'cod'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'order' => ['id']]);

        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'total_amount' => 100]);
    }
}
