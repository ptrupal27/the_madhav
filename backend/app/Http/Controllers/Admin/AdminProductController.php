<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'subCategory']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name->en', 'like', "%{$search}%")
                    ->orWhere('name->gu', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate(20);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:products,sku',
            'description' => 'nullable|array',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
            'additional_images.*' => 'nullable|image|max:2048',
        ]);

        $product = new Product();
        $product->category_id = $request->category_id;
        $product->sub_category_id = $request->sub_category_id;
        $product->name = $request->name;
        $product->slug = Str::slug($request->name['en']);
        $product->sku = $request->sku ?? 'SKU-' . Str::upper(Str::random(8));
        $product->description = $request->description;
        $product->price = $request->price;
        $product->discount_price = $request->discount_price;
        $product->stock = $request->stock;
        $product->is_active = $request->input('is_active', true);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->image = Storage::url($path);
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            $product->image = $request->image_url;
        }

        if ($request->hasFile('additional_images')) {
            $images = [];
            foreach ($request->file('additional_images') as $file) {
                $path = $file->store('products/gallery', 'public');
                $images[] = Storage::url($path);
            }
            $product->images = $images;
        }

        $product->save();

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'name' => 'sometimes|required|array',
            'sku' => 'nullable|string|unique:products,sku,' . $id,
            'description' => 'nullable|array',
            'price' => 'sometimes|required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
            'additional_images.*' => 'nullable|image|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        $data = $request->except(['image', 'image_url', 'additional_images']);

        if ($request->has('name') && isset($request->name['en'])) {
            $data['slug'] = Str::slug($request->name['en']);
        }

        if ($request->hasFile('image')) {
            if ($product->image && strpos($product->image, 'http') === false) {
                $oldPath = str_replace('/storage/', '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = Storage::url($path);
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            $data['image'] = $request->image_url;
        }

        if ($request->hasFile('additional_images')) {
            $images = $product->images ?? [];
            foreach ($request->file('additional_images') as $file) {
                $path = $file->store('products/gallery', 'public');
                $images[] = Storage::url($path);
            }
            $data['images'] = $images;
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            $path = str_replace('/storage/', '', $product->image);
            Storage::disk('public')->delete($path);
        }

        if ($product->images) {
            foreach ($product->images as $img) {
                $path = str_replace('/storage/', '', $img);
                Storage::disk('public')->delete($path);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    public function removeImage(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $imageUrl = $request->image_url;

        $images = $product->images;
        if (($key = array_search($imageUrl, $images)) !== false) {
            unset($images[$key]);
            $path = str_replace('/storage/', '', $imageUrl);
            Storage::disk('public')->delete($path);
            $product->images = array_values($images);
            $product->save();
        }

        return response()->json(['message' => 'Image removed successfully', 'product' => $product]);
    }
}
