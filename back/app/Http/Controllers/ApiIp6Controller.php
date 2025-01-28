<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiIp6Controller extends Controller
{
    public function getClientData()
    {
        // Consumir el API externo
        $response = Http::get('http://129.146.151.238/whatsapp_api/clientes.php?lista_clientes'); // Cambia esta URL por la de tu API
        
        if ($response->successful()) {
            return response()->json($response->json(), 200);
        }

        return response()->json(['error' => 'Failed to fetch data'], 500);
    }
}
