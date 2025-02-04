<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('status_clients', function (Blueprint $table) {
            $table->id();
            $table->json('estados'); 
            $table->unsignedBigInteger('id_api');
            $table->foreign('id_api')->references('id')->on('client_apis')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_clients');
    }
};
