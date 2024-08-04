<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email|unique:verification_codes,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid information',
                'errors' => $validator->errors()
            ], 200);
        }

        $verificationCode = rand(100000,999999);

        $isCreated = VerificationCode::createCode($request->email, $verificationCode, 'register');
        if ($isCreated) {
            return response()->json([
                'success' => true,
                'message' => 'Verification code created. Please check your code.',
            ], 200);
        }
    }

    public function verifyCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => 'required|email',
                'code' => 'required',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid information',
                    'errors' => $validator->errors()
                ], 200);
            }

            $codeEntry = VerificationCode::codeEntry($request->email, $request->code, 'register');

            if ($codeEntry) {
                User::createUser($request->name, $request->email, $request->password);

                return response()->json([
                    'success' => true,
                    'message' => 'User successfully created.',
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code.',
                ], 400);
            }

        } catch (\Exception $e) {
            \Log::error('Verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred.',
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::checkUser($request->email);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['errors' => 'Invalid email address or password.'], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'user' => $user
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $verificationCode = Str::random(6);

        $isCreated = VerificationCode::createCode($request->email, $verificationCode, 'password');
        if ($isCreated) {
            return response()->json([
                'success' => true,
                'message' => 'Verification code created. Please check your code.',
            ], 200);
        }
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => true,
                'message' => $validator->errors(),
            ], 200);
        }

        $codeEntry = VerificationCode::codeEntry($request->email, $request->code, 'password');

        if ($codeEntry) {
            User::updatePassword($request->email, $request->password);

            return response()->json([
                'success' => true,
                'message' => 'Password changed.',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.',
            ], 400);
        }
    }
}
