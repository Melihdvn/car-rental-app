<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    public function changeMail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'email' => 'required|email|unique:users,email|unique:verification_codes,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid information',
                'errors' => $validator->errors()
            ], 200);
        }

        User::updateMail($request->user_id, $request->email);

        return response()->json([
            'success' => true,
            'message' => 'E-mail successfully changed.',
        ], 200);
    }

    public function changeName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid information',
                'errors' => $validator->errors()
            ], 200);
        }

        User::updateName($request->user_id, $request->name);

        return response()->json([
            'success' => true,
            'message' => 'Name successfully changed.',
        ], 200);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'password' => 'min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid information',
                'errors' => $validator->errors()
            ], 200);
        }

        User::updatePassword($request->user_id, $request->password);

        return response()->json([
            'success' => true,
            'message' => 'Password successfully changed.',
        ], 200);
    }
}
