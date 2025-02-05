<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DropStatus extends Model
{
    use HasFactory;

    protected $fillable = ['estado', 'message', 'id_cliente'];

    protected $casts = [
        'estado' => 'array',
    ];
}

