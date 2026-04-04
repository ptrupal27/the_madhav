<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(100);
        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image',
            'slug' => 'required|unique:products,slug',
        ]);

        $data = $request->except(['image', 'name_en', 'name_hi', 'name_gu', 'description_en', 'description_hi', 'description_gu']);

        $data['name'] = [
            'en' => $request->name_en,
            'hi' => $request->name_hi,
            'gu' => $request->name_gu,
        ];

        $data['description'] = [
            'en' => $request->description_en,
            'hi' => $request->description_hi,
            'gu' => $request->description_gu,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name_en' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'slug' => 'required|unique:products,slug,' . $product->id,
        ]);

        $data = $request->except(['image', 'name_en', 'name_hi', 'name_gu', 'description_en', 'description_hi', 'description_gu']);

        $data['name'] = [
            'en' => $request->name_en,
            'hi' => $request->name_hi,
            'gu' => $request->name_gu,
        ];

        $data['description'] = [
            'en' => $request->description_en,
            'hi' => $request->description_hi,
            'gu' => $request->description_gu,
        ];

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
