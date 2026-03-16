<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'sub_category_id',
        'name',
        'slug',
        'sku',
        'description',
        'price',
        'discount_price',
        'image',
        'images',
        'is_active',
        'stock'
    ];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'images' => 'array',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }
}
