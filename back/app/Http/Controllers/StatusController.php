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
            'id_api' => 'required|integer', // Ajustamos a 'id_api'
            'estados' => 'required|json',  // Asegurarse de que 'estados' es una cadena JSON
        ]);

        try {
            // Crear el nuevo registro de estado
            $status = new StatusClient();
            $status->id_api = $validated['id_api']; // Cambiado de 'id' a 'id_api'
            $status->estados = $validated['estados'];  // Asume que este campo está en formato JSON
            $status->save();

            return response()->json([
                'message' => 'Estado de flujo guardado con éxito.',
                'data' => $status,
            ], 201); // Código 201 para éxito al crear un nuevo recurso
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar el estado.',
                'error' => $e->getMessage(),
            ], 500); // Código 500 para errores internos
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
