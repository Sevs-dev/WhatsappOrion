<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\MessageWhatsapp;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{

    // Método para almacenar un nuevo mensaje
    public function store(Request $request)
    {
        $fecha = Carbon::parse($request->fecha)->format('Y-m-d H:i:s');

        // Definir reglas de validación
        $rules = [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'check_url' => 'nullable|boolean',
            'id_url' => 'nullable|integer',
            'estado_flujo_activacion' => 'required|boolean',
        ];

        // Validar los datos de la petición
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Convertir valores booleanos correctamente
        $request->merge([
            'check_url' => filter_var($request->check_url, FILTER_VALIDATE_BOOLEAN),
            'estado_flujo_activacion' => filter_var($request->estado_flujo_activacion, FILTER_VALIDATE_BOOLEAN),
        ]);

        $mensaje = MessageWhatsapp::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'nombre' => $request->nombre,
            'usuario' => $request->usuario,
            'codigo' => $request->codigo,
            'estado_flujo_activacion' => $request->estado_flujo_activacion,
            'check_url' => $request->check_url,
            'id_url' => $request->id_url,
            'fecha' => $fecha,
            'id_cliente_whatsapp' => $request->id_cliente_whatsapp,
        ]);

        return response()->json(['message' => 'Registro creado con éxito', 'data' => $mensaje], 201);
    }

    // Método para actualizar un mensaje existente
    public function update(Request $request, $id)
    {
        // Definir reglas de validación
        $rules = [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'check_url' => 'nullable|boolean',
            'id_url' => 'nullable|integer',
            'estado_flujo_activacion' => 'required|boolean',
        ];

        // Validar los datos de la petición
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buscar el mensaje en la base de datos
        $mensaje = MessageWhatsapp::find($id);
        if (!$mensaje) {
            return response()->json(['error' => 'Mensaje no encontrado'], 404);
        }

        // Convertir valores booleanos correctamente
        $request->merge([
            'check_url' => filter_var($request->check_url, FILTER_VALIDATE_BOOLEAN),
            'estado_flujo_activacion' => filter_var($request->estado_flujo_activacion, FILTER_VALIDATE_BOOLEAN),
        ]);

        // Actualizar los datos del mensaje
        $mensaje->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'check_url' => $request->check_url,
            'id_url' => $request->id_url,
            'estado_flujo_activacion' => $request->estado_flujo_activacion,
            'usuario' => 'admin',
        ]);

        return response()->json(['message' => 'Registro actualizado con éxito', 'data' => $mensaje]);
    }

    // Método para eliminar un mensaje
    public function delete($id)
    {
        // Buscar el mensaje en la base de datos
        $mensaje = MessageWhatsapp::find($id);
        if (!$mensaje) {
            return response()->json(['error' => 'Mensaje no encontrado'], 404);
        }

        // Eliminar el mensaje
        $mensaje->delete();
        return response()->json(['message' => 'Registro eliminado con éxito']);
    }

    // Método para obtener todos los mensajes
    public function index()
    {
        $mensajes = MessageWhatsapp::all();
        return response()->json(['data' => $mensajes]);
    }

    // Método para obtener un mensaje específico por su ID
    public function show($id)
    {
        $mensaje = MessageWhatsapp::find($id);
        if (!$mensaje) {
            return response()->json(['error' => 'Mensaje no encontrado'], 404);
        }

        return response()->json(['data' => $mensaje]);
    }
}
