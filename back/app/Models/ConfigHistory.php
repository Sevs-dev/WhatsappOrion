<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Env;

class ConfigHistory extends Model
{
    use HasFactory;

    protected $table = 'historico_configuracion_api';
    public $timestamps = false;
    protected $fillable = [
        'id_historico_configuracion',
        'token_api',
        'numero_verificacion',
        'fecha',
        'usuario',
    ];
}
