<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function getVehicles(){
        $vehicles = Vehicle::getVehicles();

        if($vehicles)
        {
            return response()->json($vehicles, 200);
        }
        else
        {
            return response()->json([
                'message' => 'There is no cars currently.',
            ], 200);
        }
    }

    public function updateAvailability(Request $request){
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required',
            'availability' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Geçersiz bilgiler',
                'errors' => $validator->errors()
            ], 200);
        }

        Vehicle::updateAvailability($request->vehicle_id, $request->availability);

        return response()->json([
            'success' => true
        ], 200);
}
}
