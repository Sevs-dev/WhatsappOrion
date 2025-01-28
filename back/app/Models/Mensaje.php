<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mensaje extends Model
{
    use HasFactory;

    protected $table = 'mensajes_whatsapp';
    public $timestamps = false;
    protected $primaryKey = 'id_mensaje_whatsapp';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'id_mensaje_whatsapp',
        'titulo',
        'descripcion',
        'check_url',
        'id_url',
        'estado_flujo_activacion',
        'id_cliente_whatsapp',
        'fecha',
        'usuario'
    ];
}
