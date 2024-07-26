<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Reservation;
use App\Models\Vehicle;


class ReservationController extends Controller
{
    public function getReservations(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false,$validator->errors()], 200);
        }

        $reservations = Reservation::getUserReservations($request->user_id);

        if($reservations)
        {
            return response()->json($reservations, 200);
        }
        else {
            return response()->json([
                'message' => 'User does\'nt have reservations.',
            ], 200);
        }
    }
    public function createReservation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'total_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false,$validator->errors()], 200);
        }

        Vehicle::updateAvailability($request->vehicle_id, 0);
        $result = Reservation::createReservation($request->user_id, $request->vehicle_id, $request->start_date, $request->end_date, $request->total_price);

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully.',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to create reservation.',
        ], 500);
    }

    public function getAvailableVehiclesOnDates(Request $request){
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false,$validator->errors()], 200);
        }

        $vehicles = Reservation::getAvailableVehiclesOnDates($request->start_date, $request->end_date);

        if($vehicles)
        {
            return response()->json($vehicles, 200);
        }
        else {
            return response()->json([
                'message' => 'There is no vehicles available at that dates.',
            ], 200);
        }
    }

}
