<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flujo_Ip6 extends Model
{
    use HasFactory;

    protected $table = 'flujos_ip6';
    public $timestamps = false;
    protected $fillable = [
        'id_flujo',
        'nombre',
    ];

    public function flujos_procesos_ip6(): HasMany
    {
        return $this->hasMany(Flujo_Proceso_Ip6::class);
    }
}
