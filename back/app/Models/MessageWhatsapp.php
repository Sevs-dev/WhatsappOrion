<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MessageWhatsapp extends Model
{
    use HasFactory;

    protected $table = 'message_whatsapps';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];

    // Relación: Definimos una relación "pertenece a" (belongsTo) con el modelo ClientsWhatsapp.
    // Esto significa que cada mensaje de WhatsApp pertenece a un cliente específico de WhatsApp.
    public function clienteWhatsapp()
    {
        return $this->belongsTo(ClientsWhatsapp::class, 'id_cliente_whatsapp');
    }

}
