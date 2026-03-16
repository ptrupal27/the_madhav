<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubCategory;
use Illuminate\Support\Str;

class AdminSubCategoryController extends Controller
{
    public function index()
    {
        $subCategories = SubCategory::with('category')->latest()->paginate(20);
        return response()->json($subCategories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|array', // {en: "", gu: ""}
            'name.en' => 'required|string|max:255',
        ]);

        $subCategory = new SubCategory();
        $subCategory->category_id = $request->category_id;
        $subCategory->name = $request->name;
        $subCategory->slug = Str::slug($request->name['en']);
        $subCategory->save();

        return response()->json([
            'message' => 'Sub-category created successfully',
            'sub_category' => $subCategory
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|array',
            'name.en' => 'sometimes|required|string|max:255',
        ]);

        if ($request->has('category_id')) {
            $subCategory->category_id = $request->category_id;
        }

        if ($request->has('name')) {
            $subCategory->name = $request->name;
            if (isset($request->name['en'])) {
                $subCategory->slug = Str::slug($request->name['en']);
            }
        }

        $subCategory->save();

        return response()->json([
            'message' => 'Sub-category updated successfully',
            'sub_category' => $subCategory
        ]);
    }

    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $subCategory->delete();

        return response()->json([
            'message' => 'Sub-category deleted successfully'
        ]);
    }

    public function getByCategory($categoryId)
    {
        $subCategories = SubCategory::where('category_id', $categoryId)->get();
        return response()->json($subCategories);
    }
}
