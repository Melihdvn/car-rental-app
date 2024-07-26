<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class User extends Model
{
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    public static function createUser($email, $password){
        DB::table('users')->insert([
            'email' => $email,
            'password' => bcrypt($password),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public static function checkUser($email){
        return DB::table('users')
                ->where('email', $email)
                ->first();
    }


    public static function updatePassword($email, $password){
        DB::table('users')
            ->where('email', $email)
            ->update([
                'password' => bcrypt($password),
                'updated_at' => now()
            ]);
    }

    public static function updateMail($user_id, $email){
        DB::table('users')
            ->where('user_id', $user_id)
            ->update([
                'email' => $email,
                'updated_at' => now(),
            ]);
    }

    public static function updateName($user_id, $name){
        DB::table('users')
            ->where('user_id', $user_id)
            ->update([
                'name' => $name,
                'updated_at' => now(),
            ]);
    }
}
