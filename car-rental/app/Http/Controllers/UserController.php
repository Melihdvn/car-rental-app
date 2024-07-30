<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    public function getUser($id)
    {
        \Log::info('User ID: ' . $id);
        $user = User::getUser($id);

        if ($user) {
            return response()->json([
                'success' => true,
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }
    }

    public function changeName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'name' => 'required|string|max:255',
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

    public function changeMail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'email' => 'required|email|unique:users,email',
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
