<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

use Illuminate\Support\Facades\DB;

try {
    DB::connection()->getPdo();
    echo "Connected successfully to " . DB::connection()->getDatabaseName() . "\n";
    
    $productsCount = DB::table('products')->count();
    echo "Total products: " . $productsCount . "\n";
    
    $usersCount = DB::table('users')->count();
    echo "Total users: " . $usersCount . "\n";
} catch (\Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
