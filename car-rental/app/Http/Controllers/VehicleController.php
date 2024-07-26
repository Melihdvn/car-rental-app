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
}
