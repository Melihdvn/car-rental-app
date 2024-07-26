<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Vehicle extends Model
{
    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'total_price',
    ];

    public static function getVehicles()
    {
        return DB::table('vehicles')
        ->select('*')
        ->get();
    }
}
