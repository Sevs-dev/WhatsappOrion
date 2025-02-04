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
        Schema::create('status_whatsapps', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cliente_id');
            $table->string('estado');
            $table->unsignedBigInteger('mensaje_id')->nullable();  // Si puede ser nulo
            $table->timestamps();

            // Relación con la tabla de clientes
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');

            // Relación con la tabla de mensajes (si corresponde)
            $table->foreign('mensaje_id')->references('id')->on('mensajes')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_whatsapps');
    }
};
