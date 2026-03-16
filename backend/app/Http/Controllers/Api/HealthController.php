<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function hello(): JsonResponse
    {
        return response()->json(['message' => 'hello']);
    }

    public function up(): JsonResponse
    {
        return response()->json(['status' => 'up']);
    }
}

