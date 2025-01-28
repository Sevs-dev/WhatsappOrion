<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    use HasFactory;

    protected $table = 'configuracion_api';
    public $timestamps = false;
    protected $primaryKey = 'id_configuracion';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'id_configuracion',
        'token_api',
        'numero_verificacion',
        'fecha',
        'usuario',
        'estado'
    ];
}
