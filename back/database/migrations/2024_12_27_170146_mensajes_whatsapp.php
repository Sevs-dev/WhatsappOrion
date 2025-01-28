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
        Schema::create('mensajes_whatsapp', function (Blueprint $table) {
            $table->id('id_mensaje_whatsapp')->primary();
            $table->longText('titulo');
            $table->longText('descripcion');
            $table->integer('check_url')->nullable();
            $table->integer('id_url');
            $table->integer('estado_flujo_activacion')->nullable();
            $table->string('id_cliente_whatsapp');
            $table->dateTime('fecha')->nullable();
            $table->string('usuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes_whatsapp');
    }
};
