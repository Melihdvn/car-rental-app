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
            'email' => 'required|email|unique:users,email|unique:verification_codes,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Geçersiz bilgiler',
                'errors' => $validator->errors()
            ], 200);
        }

        $verificationCode = Str::random(6);

        $isCreated = VerificationCode::createCode($request->email, $verificationCode, 'register');
        if (($isCreated)){
        return response()->json([
            'success' => true,
            'message' => 'Doğrulama kodu oluşturuldu. Kodunuzu kontrol edin.',
        ], 200);
    }
    }

    public function verifyCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'code' => 'required',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Geçersiz bilgiler',
                    'errors' => $validator->errors()
                ], 200);
            }

            $codeEntry = VerificationCode::codeEntry($request->email, $request->code, 'register');

            if ($codeEntry) {
                User::createUser($request->email, $request->password);

                return response()->json([
                    'success' => true,
                    'message' => 'Kullanıcı başarıyla oluşturuldu.',
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Doğrulama kodu hatalı.',
                ], 400);
            }

        } catch (\Exception $e) {
            \Log::error('Verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Bir hata oluştu.',
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
            return response()->json(['message' => 'Geçersiz e-posta adresi veya şifre.'], 401);
        }

        return response()->json([
            'message' => 'Giriş başarılı.',
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
        if (($isCreated)){
        return response()->json([
            'success' => true,
            'message' => 'Doğrulama kodu oluşturuldu. Kodunuzu kontrol edin.',
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
            return response()->json($validator->errors(), 400);
        }

        $codeEntry = VerificationCode::codeEntry($request->email, $request->code, 'password');

        if ($codeEntry) {
            User::changePassword($request->email, $request->password);

            return response()->json([
                'success' => true,
                'message' => 'Şifre değiştirildi.',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Doğrulama kodu hatalı.',
            ], 400);
        }
    }

}
