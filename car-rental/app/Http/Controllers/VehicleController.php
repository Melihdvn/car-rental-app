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
            return response()->json(['success' => true,'vehicles' => $vehicles], 200);
        }
        else
        {
            return response()->json([
                'success' => false,
                'message' => 'There are no cars available at the moment.',
            ], 200);
        }
    }
}
