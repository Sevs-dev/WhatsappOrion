<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('whatsapp_interactions', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number')->unique();
            $table->dateTime('last_interaction')->nullable();
            $table->timestamps();
        });
        
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_interactions');
    }
};