<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReservationService;
use Illuminate\Support\Facades\Validator;

class ReservationServiceController extends Controller
{
    public function addServiceToReservation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,reservation_id',
            'service_id' => 'required|exists:additional_services,additional_service_id',
            'name' => 'required',
            'price' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid information',
                'errors' => $validator->errors()
            ], 200);
        }

        $result = ReservationService::addServiceToReservation($request->reservation_id, $request->service_id, $request->name, $request->price);

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Service successfully added to reservation.',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Service is already reserved.',
            ], 200);
        }
    }

    public function getServices(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,reservation_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 200);
        }

        $services = ReservationService::getReservationServices($request->reservation_id);

        if ($services) {
            return response()->json([
                'success' => true,
                'services' => $services,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Reservation doesn\'t have any additional services.',
            ], 200);
        }
    }

    public function getAllReservationServices(Request $request)
    {
        $services = ReservationService::getAllReservationServices();

        if ($services) {
            return response()->json([
                'success' => true,
                'services' => $services,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No services available.',
            ], 200);
        }
    }

    public function getAllServices(Request $request)
    {
        $services = ReservationService::getAllServices();

        if ($services) {
            return response()->json([
                'success' => true,
                'services' => $services,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No services available.',
            ], 200);
        }
    }
}
