<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class VerificationCode extends Model
{
    protected $fillable = ['email', 'code'];

    public static function createCode($email, $code, $type) {
        $result = DB::table('verification_codes')->insert([
            'email' => $email,
            'code' => $code,
            'type' => $type,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $result ? true : false;
    }

    public static function codeEntry($email, $code, $type){
        return DB::table('verification_codes')
                ->where('email', $email)
                ->where('code', $code)
                ->where('type', $type)
                ->first();
    }
}
