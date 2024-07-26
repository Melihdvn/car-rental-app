<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Reservation extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'total_price',
    ];

    public static function createReservation($user_id, $vehicle_id, $start_date, $end_date, $total_price)
    {
        if ($isAvailable) {
            return DB::table('reservations')->insert([
                'user_id' => $user_id,
                'vehicle_id' => $vehicle_id,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'total_price' => $total_price,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            return null;
        }
    }


    public static function getUserReservations($user_id)
    {
        return DB::table('reservations')->where('user_id', $user_id)
        ->select('*')
        ->get();
    }

    public static function checkAvailability($vehicle_id, $start_date, $end_date){
        return DB::table('reservations')
            ->where('vehicle_id', $vehicle_id)
            ->whereBetween('start_date', [$start_date, $end_date])
            ->orWhereBetween('end_date', [$start_date, $end_date])
            ->exists();
    }

    public static function getAvailableVehiclesOnDates($start_date, $end_date){
        $reservedVehicles = DB::table('reservations')
            ->whereBetween('start_date', [$start_date, $end_date])
            ->orWhereBetween('end_date', [$start_date, $end_date])
            ->select('vehicle_id')
            ->pluck('vehicle_id')
            ->toArray();

            $availableVehicles = DB::table('vehicles')
            ->whereNotIn('vehicle_id', $reservedVehicles)
            ->select('*')
            ->get();

        return $availableVehicles;
    }
}
