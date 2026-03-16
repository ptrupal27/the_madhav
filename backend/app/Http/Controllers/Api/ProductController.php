<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $slug = $request->category;
            $query->whereHas('category', function ($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name->en', 'like', "%{$search}%")
                    ->orWhere('name->gu', 'like', "%{$search}%")
                    ->orWhere('name->hi', 'like', "%{$search}%")
                    ->orWhere('description->en', 'like', "%{$search}%")
                    ->orWhere('description->gu', 'like', "%{$search}%")
                    ->orWhere('description->hi', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($catQuery) use ($search) {
                        $catQuery->where('name->en', 'like', "%{$search}%")
                            ->orWhere('name->gu', 'like', "%{$search}%")
                            ->orWhere('name->hi', 'like', "%{$search}%");
                    });
            });
        }

        $products = $query->paginate(12);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product);
    }
}
