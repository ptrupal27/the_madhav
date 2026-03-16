<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->paginate(20);
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'image' => 'nullable|image|max:1024',
            'image_url' => 'nullable|string',
        ]);

        $category = new Category();
        $category->name = $request->name;
        $category->slug = $request->slug ?? Str::slug($request->name['en']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $category->image = Storage::url($path);
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            $category->image = $request->image_url;
        }

        $category->save();

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|array',
            'name.en' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug,' . $id,
            'image' => 'nullable|image|max:1024',
            'image_url' => 'nullable|string',
        ]);

        if ($request->has('name')) {
            $category->name = $request->name;
            if (!$request->has('slug')) {
                $category->slug = Str::slug($request->name['en']);
            }
        }

        if ($request->has('slug')) {
            $category->slug = $request->slug;
        }

        if ($request->hasFile('image')) {
            if ($category->image && strpos($category->image, 'http') === false) {
                $oldPath = str_replace('/storage/', '', $category->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('categories', 'public');
            $category->image = Storage::url($path);
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            $category->image = $request->image_url;
        }

        $category->save();

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->image) {
            $path = str_replace('/storage/', '', $category->image);
            Storage::disk('public')->delete($path);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
