<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = App\Models\Product::orderBy('id', 'desc')->take(3)->get();
foreach ($products as $p) {
    echo "Product ID: {$p->id}\n";
    echo "Name: " . json_encode($p->name) . "\n";
    echo "Image: {$p->image}\n";
    echo "-----\n";
}
