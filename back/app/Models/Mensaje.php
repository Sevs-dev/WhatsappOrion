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
    protected $guarded = [];
}