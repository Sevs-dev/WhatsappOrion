<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin Logismart',
            'email' => 'admin@logismart.com.co',
            'email_verified_at' => now(),
            'password' => Hash::make('Logismart25*'),
            'remember_token' => "",
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
