<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Reservation extends Model
{
    protected $primaryKey = 'reservation_id';

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'total_price',
    ];

    public static function createReservation($user_id, $vehicle_id, $start_date, $end_date, $total_price)
    {
        $isAvailable = Reservation::checkAvailability($vehicle_id, $start_date, $end_date);
        if ($isAvailable) {
            return DB::table('reservations')->insert([
                'user_id' => $user_id,
                'is_rented' => 0,
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

    public static function getExactReservation($user_id, $vehicle_id, $start_date, $end_date)
    {
        return DB::table('reservations')
            ->where('user_id', $user_id)
            ->where('vehicle_id', $vehicle_id)
            ->where('start_date', $start_date)
            ->where('end_date',  $end_date)
            ->select('*')
            ->get();
    }


    public static function checkAvailability($vehicle_id, $start_date, $end_date) {
        return !DB::table('reservations')
            ->where('vehicle_id', $vehicle_id)
            ->where(function($query) use ($start_date, $end_date) {
                $query->where(function($query) use ($start_date, $end_date) {
                    $query->whereBetween('start_date', [$start_date, $end_date])
                          ->orWhereBetween('end_date', [$start_date, $end_date]);
                })
                ->orWhere(function($query) use ($start_date, $end_date) {
                    $query->where('start_date', '<', $end_date)
                          ->where('end_date', '>', $start_date);
                });
            })
            ->exists();
    }

    public static function getAvailableVehiclesOnDates($start_date, $end_date)
    {
        $reservedVehicles = DB::table('reservations')
            ->where(function ($query) use ($start_date, $end_date) {
                $query->whereBetween('start_date', [$start_date, $end_date])
                    ->orWhereBetween('end_date', [$start_date, $end_date])
                    ->orWhere(function ($query) use ($start_date, $end_date) {
                        $query->where('start_date', '<', $start_date)
                              ->where('end_date', '>', $end_date);
                    });
            })
            ->select('vehicle_id')
            ->pluck('vehicle_id')
            ->toArray();

        $availableVehicles = DB::table('vehicles')
            ->whereNotIn('vehicle_id', $reservedVehicles)
            ->where('is_active', 1) // Optional: to ensure the vehicle is active
            ->select('*')
            ->get();

        return $availableVehicles;
    }

    public static function rentCar($reservation_id) {
        $isRented = DB::table('reservations')
            ->where('reservation_id', $reservation_id)
            ->pluck('is_rented')
            ->first();

        if ($isRented == 0) {
            DB::table('reservations')
                ->where('reservation_id', $reservation_id)
                ->update([
                    'is_rented' => 1,
                    'updated_at' => now(),
                ]);
            return true;
        } else {
            return false;
        }
    }

}
