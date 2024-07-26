<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;


class ReservationService extends Model
{
    protected $primaryKey = 'rs_id';

    protected $fillable = [
        'reservation_id',
        'additional_service_id',
    ];

    public static function addServiceToReservation($reservation_id, $additional_service_id)
    {
        $isAvailable = ReservationService::checkAvailability($reservation_id, $additional_service_id);
        if ($isAvailable) {
            return DB::table('reservation_services')->insert([
                'reservation_id' => $reservation_id,
                'additional_service_id' => $additional_service_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            return null;
        }
    }

    public static function checkAvailability($reservation_id, $additional_service_id)
    {
        $reservationExists = DB::table('reservations')->where('reservation_id', $reservation_id)->exists();
        if (!$reservationExists) {
            return false;
        }

        $serviceExists = DB::table('reservation_services')
            ->where('reservation_id', $reservation_id)
            ->where('additional_service_id', $additional_service_id)
            ->exists();

        return !$serviceExists;
    }

    public static function getReservationServices($reservation_id)
    {
        return DB::table('reservation_services')->where('reservation_id', $reservation_id)
        ->select('*')
        ->get();
    }
}
