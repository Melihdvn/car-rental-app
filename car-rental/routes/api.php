<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VehicleController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgotpassword', [AuthController::class, 'forgotPassword']);
Route::post('/changepassword', [AuthController::class, 'changePassword']);

Route::post('/changename', [UserController::class, 'changeName']);

Route::post('/createreservation', [ReservationController::class, 'createReservation']);
Route::post('/getreservations', [ReservationController::class, 'getReservations']);

Route::get('/getvehicles', [VehicleController::class, 'getVehicles']);

Route::post('/getvehiclesondate', [ReservationController::class, 'getAvailableVehiclesOnDates']);

