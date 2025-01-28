<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes_whatsapp';
    protected $primaryKey = 'id_mensaje_whatsapp';
    public $timestamps = false;
    protected $fillable = [
        'id_cliente_whatsapp',
        'nombre',
        'estado',
        'fecha',
        'usuario'
    ];

    public function mensajes(): HasMany
    {
        return $this->hasMany(Mensaje::class, 'id_cliente_whatsapp', 'id_cliente_whatsapp');
    }

}
