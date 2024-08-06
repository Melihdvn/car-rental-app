<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Payment extends Model
{

    protected $table = 'payments';

    protected $fillable = [
        'user_id',
        'amount',
        'payment_method',
        'status',
    ];

    public static function createPayment($user_id, $amount, $payment_method, $status)
    {
        $payment = DB::table('payments')->insert([
            'user_id' => $user_id,
            'amount' => $amount,
            'payment_method' => $payment_method,
            'status' => $status,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $payment;
    }
}
