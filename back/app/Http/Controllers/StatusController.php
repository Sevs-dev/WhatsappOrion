<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DropStatus;
use App\Models\StatusClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'codigo' => 'required',
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
                $status->codigo = $validated['codigo'];
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

    public function saveDropStatus(Request $request)
    {
        // Validación
        $validated = $request->validate([
            'id_cliente' => 'required|integer',
            'codigo' => 'required|string',
            'estados' => 'required|array',
        ]);

        $cliente_id = $validated['id_cliente'];
        $codigo = $validated['codigo'];
        $datos = $validated['estados']; // Lista de estados

        try {
            // Obtener todos los estados actuales del cliente
            $currentStatuses = DropStatus::where('id_cliente', $cliente_id)->get();

            // Eliminar estados que ya no están en la nueva lista
            foreach ($currentStatuses as $status) {
                $estadoFound = false;
                foreach ($datos as $estadoData) {
                    $estadoActual = json_decode($status->estado)->estado;
                    if ($estadoData['estado'] == $estadoActual) {
                        $estadoFound = true;
                        // Actualizar si los datos han cambiado
                        if (
                            $estadoData['titulo'] !== json_decode($status->estado)->titulo ||
                            $estadoData['descripcion'] !== json_decode($status->estado)->descripcion ||
                            $estadoData['api_url'] !== json_decode($status->estado)->api_url  
                        ) {
                            $status->estado = json_encode([
                                'estado' => $estadoData['estado'],
                                'titulo' => $estadoData['titulo'],
                                'descripcion' => $estadoData['descripcion'],
                                'api_url' => $estadoData['api_url'], 
                            ]);
                            $status->codigo = $codigo;
                            $status->save();
                        }
                        break;
                    }
                }

                // Si el estado no está en la nueva lista, eliminarlo
                if (!$estadoFound) {
                    $status->delete();
                }
            }

            // Agregar los nuevos estados que no existen
            foreach ($datos as $estadoData) {
                $estadoExistente = DropStatus::where('id_cliente', $cliente_id)
                    ->where('estado', json_encode([
                        'estado' => $estadoData['estado'],
                        'titulo' => $estadoData['titulo'],
                        'descripcion' => $estadoData['descripcion'],
                        'api_url' => $estadoData['api_url'], 
                    ]))
                    ->first();

                if (!$estadoExistente) {
                    $dropStatus = new DropStatus();
                    $dropStatus->estado = json_encode([
                        'estado' => $estadoData['estado'],
                        'titulo' => $estadoData['titulo'],
                        'descripcion' => $estadoData['descripcion'],
                        'api_url' => $estadoData['api_url'], 
                    ]);
                    $dropStatus->id_cliente = $cliente_id;
                    $dropStatus->codigo = $codigo;
                    $dropStatus->save();
                }
            }

            return response()->json(['message' => 'Datos guardados correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar los datos.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    // En el controlador
    public function getMessageStatus($id_cliente)
    {
        $datos = DropStatus::where('id_cliente', $id_cliente)->get();
        if ($datos->isEmpty()) {
            return response()->json(['error' => 'No se encontraron datos para este cliente.'], 404);
        }

        $messagesByState = [];
        foreach ($datos as $status) {
            $estado = json_decode($status->estado, true);
            $estadoName = $estado['estado'];  // Aseguramos que utilizamos el nombre del estado

            $messagesByState[$estadoName] = $estado;
        }

        return response()->json(['datos' => $messagesByState])->header('Content-Type', 'application/json');
    }
}