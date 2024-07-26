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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Geçersiz bilgiler',
                'errors' => $validator->errors()
            ], 200);
        }

        $result = ReservationService::addServiceToReservation($request->reservation_id, $request->service_id);

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Hizmet başarıyla rezerve edildi.',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Hizmet zaten rezerve edilmiş.',
            ], 200);
        }
    }

    public function getServices(Request $request){
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,reservation_id',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false,$validator->errors()], 200);
        }

        $reservations = ReservationService::getReservationServices($request->reservation_id);

        if($reservations)
        {
            return response()->json($reservations, 200);
        }
        else {
            return response()->json([
                'message' => 'Reservation does\'nt have any additional services.',
            ], 200);
        }
    }

}
