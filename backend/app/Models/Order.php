<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'shipping_charge',
        'status',
        'shipping_status',
        'payment_status',
        'payment_id',
        'payment_method',
        'shipping_address',
        'phone',
        'transaction_id',
        'courier_name',
        'tracking_number',
        'delivered_at',
        'estimated_delivery_date',
        'admin_note'
    ];

    protected $casts = [
        'delivered_at' => 'datetime',
        'estimated_delivery_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
