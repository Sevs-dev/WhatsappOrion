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
        Schema::create('message_whatsapps', function (Blueprint $table) {
            $table->id();
            $table->longText('titulo');
            $table->longText('descripcion');
            $table->string('nombre')->nullable();
            $table->string('usuario');
            $table->string('codigo')->nullable();
            $table->integer('estado_flujo_activacion')->nullable();
            $table->string('api_url')->nullable();
            $table->dateTime('fecha')->nullable();
            $table->unsignedBigInteger('id_cliente_whatsapp'); // Debe coincidir con la clave primaria en clientes_whatsapp
            $table->foreign('id_cliente_whatsapp')->references('id')->on('clients_whatsapps')->onDelete('cascade'); // Opcional, define qué sucede al eliminar un cliente
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_whatsapps');
    }
};