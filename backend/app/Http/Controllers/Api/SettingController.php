<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function getHomeSettings()
    {
        $keys = [
            'home_featured_products',
            'home_arrivals_products',
            'home_sale_products',
            'home_bestselling_products'
        ];

        $settings = Setting::whereIn('key', $keys)->get()->pluck('value', 'key');
        
        // Decode JSON values
        $decodedSettings = $settings->map(function ($value) {
            $decoded = json_decode($value, true);
            return is_null($decoded) ? $value : $decoded;
        });

        return response()->json($decodedSettings);
    }
}
