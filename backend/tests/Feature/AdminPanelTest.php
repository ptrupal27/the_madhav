<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_and_access_dashboard()
    {
        $admin = User::factory()->create(['role' => 'admin', 'email' => 'admin@example.com']);

        $response = $this->post('/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password' // Assuming factory sets password to 'password'
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($admin);
    }

    public function test_non_admin_cannot_access_dashboard()
    {
        $user = User::factory()->create(['role' => 'customer']);
        $this->actingAs($user);

        $response = $this->get(route('admin.dashboard'));
        $response->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_create_product()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $category = Category::create(['name' => 'Tools', 'slug' => 'tools']);

        $response = $this->post(route('admin.products.store'), [
            'name_en' => 'New Tool',
            'slug' => 'new-tool',
            'price' => 500,
            'category_id' => $category->id
        ]);

        $response->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', ['slug' => 'new-tool']);
    }
}
