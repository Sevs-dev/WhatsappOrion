<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientsWhatsapp extends Model
{
    use HasFactory;

    protected $table = 'clients_whatsapps';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];

    // Relación: Un cliente tiene muchos mensajes
    public function mensajes(): HasMany
    {
        return $this->hasMany(MessageWhatsapp::class, 'id_cliente_whatsapp', 'id');
    }

}
