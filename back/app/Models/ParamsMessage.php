<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParamsMessage extends Model
{
    use HasFactory;
    protected $table = "params_messages";
    protected $guarded = [];
}