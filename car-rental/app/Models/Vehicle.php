<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Vehicle extends Model
{

    protected $table = 'vehicles';

    protected $primaryKey = 'vehicle_id';

    public $timestamps = true;

    protected $fillable = [
        'make',
        'model',
        'fuel',
        'transmission',
        'year',
        'kilometers',
        'is_active',
        'daily_rate',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'daily_rate' => 'decimal:2',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public static function getVehicles()
    {
        return DB::table('vehicles')
        ->select('*')
        ->get();
    }
}
