<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracion_api', function (Blueprint $table) {
            $table->id('id_configuracion')->primary();
            $table->longText('token_api');
            $table->string('numero_verificacion');
            $table->dateTime('fecha')->nullable();
            $table->string('usuario');
            $table->integer('estado')->nullable();
        });

        Schema::create('flujos_ip6', function (Blueprint $table) {
            $table->id('id_flujo_ip6')->primary();
            $table->string('nombre_flujo');
            $table->string('id_cliente');
            $table->string('nombre_cliente');
            $table->integer('estado')->nullable();
            $table->dateTime('fecha')->nullable();
            $table->string('usuario');
        });

        Schema::create('historico_flujos_ip6', function (Blueprint $table) {
            $table->id('id_historico_flujos')->primary();
            $table->string('nombre_flujo');
            $table->string('id_cliente');
            $table->string('nombre_cliente');
            $table->integer('estado')->nullable();
            $table->dateTime('fecha')->nullable();
            $table->string('usuario');
            $table->integer('id_flujo_ip6')->unique();
        });

        Schema::create('flujos_procesos_ip6', function (Blueprint $table) {
            $table->id('id_flujo_proceso_ip6')->primary();
            $table->string('nombre_proceso');
            $table->string('codigo_proceso_ip6');
            $table->integer('estado');
            $table->string('id_flujo_ip6')->unique();
        });

        Schema::create('historico_flujos_procesos_ip6', function (Blueprint $table) {
            $table->id('id_historico_flujo_proceso_ip6')->primary();
            $table->string('id_flujo_proceso_ip6')->unique();
            $table->string('nombre_proceso');
            $table->string('codigo_proceso_ip6');
            $table->string('id_flujo_ip6')->unique();
        }); 

        Schema::create('plantillas_mensajes_lin', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        Schema::create('conexiones_nodos_flujos', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
