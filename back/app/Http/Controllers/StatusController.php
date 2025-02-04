<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\StatusClient;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * Guardar un nuevo estado de flujo.
     */
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'id_api' => 'required|integer',
            'estados' => 'required|json',
            'message' => 'required',
        ]);
    
        try {
            // Buscar si ya existe un registro con el mismo id_api
            $status = StatusClient::where('id_api', $validated['id_api'])->first();
    
            if ($status) {
                // Si existe, actualizar los datos
                $status->estados = $validated['estados'];
                $message = 'Estado de flujo actualizado con éxito.';
            } else {
                // Si no existe, crear un nuevo registro
                $status = new StatusClient();
                $status->id_api = $validated['id_api'];
                $status->estados = $validated['estados'];
                $status->message = $validated['message'];
                $message = 'Estado de flujo guardado con éxito.';
            }
    
            $status->save();
    
            return response()->json([
                'message' => $message,
                'data' => $status,
            ], 200); // Código 200 para actualización o 201 si es un nuevo registro
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar/actualizar el estado.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }    

    /**
     * Obtener los estados de un cliente por ID.
     */
    public function show($clientId)
    {
        try {
            $statusClient = StatusClient::where('id_api', $clientId)->first();

            if (!$statusClient) {
                return response()->json([
                    'message' => 'Estado de cliente no encontrado'
                ], 404);
            }

            return response()->json([
                'message' => 'Estados de cliente obtenidos correctamente',
                'data' => $statusClient
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los estados del cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
