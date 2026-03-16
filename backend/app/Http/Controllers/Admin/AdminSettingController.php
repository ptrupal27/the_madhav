<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class AdminSettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully'
        ]);
    }

    public function getMaintenanceMode()
    {
        $maintenance = Setting::where('key', 'maintenance_mode')->first();
        return response()->json(['enabled' => $maintenance ? (bool) $maintenance->value : false]);
    }

    public function toggleMaintenanceMode(Request $request)
    {
        $setting = Setting::updateOrCreate(
            ['key' => 'maintenance_mode'],
            ['value' => $request->enabled ? '1' : '0']
        );

        return response()->json([
            'message' => 'Maintenance mode ' . ($request->enabled ? 'enabled' : 'disabled')
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('home', 'public');
            return response()->json([
                'url' => \Illuminate\Support\Facades\Storage::url($path)
            ]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }
}
