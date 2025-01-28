<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flujo_Proceso_Ip6 extends Model
{
    use HasFactory;

    protected $table = 'flujos_procesos_ip6';
    public $timestamps = false;
    protected $fillable = [
        'id_flujo_proceso',
        'nombre',
        'numero_estado',
        'id_flujo'
    ];

}
