<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'amount' => 'required',
            'credit_card_number' => 'required|min:16',
            'cvv' => 'required',
            'expire_date' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid information',
                'errors' => $validator->errors()
            ], 200);
        }

        $isSuccess = Payment::createPayment($request->user_id, $request->amount, 'Credit Card', 'Completed');

        if ($isSuccess) {
            return response()->json([
                'success' => true,
                'message' => 'Payment completed successfully.',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'An error occured.',
            ], 200);
        }
    }
}
