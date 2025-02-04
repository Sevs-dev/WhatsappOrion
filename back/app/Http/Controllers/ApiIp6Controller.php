<?php

namespace App\Http\Controllers;

use App\Models\ClientApi;
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

    public function getClientDataApi()
    {
        // Consumir el API externo
        $response = Http::get('http://129.146.151.238/whatsapp_api/clientes.php?lista_clientes'); // Cambia esta URL por la de tu API

        if ($response->successful()) {
            $data = $response->json(); // Obtener los datos de la API externa

            // Crear un array separado para los clientes
            $clientsArray = [];
            foreach ($data as $client) {
                // Añadir los datos al array estructurado
                $clientsArray[] = [
                    'codigo_cliente' => $client['codigo_cliente'],
                    'descripcion_cliente' => $client['descripcion_cliente'],
                ];

                // Guardar los datos en la base de datos
                ClientApi::create([
                    'nombre' => $client['descripcion_cliente'],
                    'codigo' => $client['codigo_cliente'],
                ]);
            }

            // Retornar la respuesta con los datos organizados en un array
            return response()->json([
                'message' => 'Clients saved successfully',
                'data' => $clientsArray // Incluir los datos estructurados
            ], 200);
        }

        // Si la solicitud falla, retornar un error
        return response()->json(['error' => 'Failed to fetch data'], 500);
    }

    
    public function getClientByCodigo($codigo)
    {
        $client = ClientApi::where('codigo', $codigo)->first();
        if ($client) {
            return response()->json($client, 200); // Si se encuentra el cliente, devolverlo en formato JSON
        }
        return response()->json(['error' => 'Client not found'], 404); // Si no se encuentra, devolver error
    }
}
