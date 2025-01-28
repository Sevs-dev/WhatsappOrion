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
        
        Schema::create('clientes_whatsapp', function (Blueprint $table) {
            $table->string('id_cliente_whatsapp')->primary();
            $table->string('nombre');
            $table->integer('estado');
            $table->dateTime('fecha')->nullable();
            $table->string('usuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes_whatsapp');
    }
};
