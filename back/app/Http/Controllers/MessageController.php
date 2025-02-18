<?php

namespace App\Http\Controllers;

use App\Models\ClientApi;
use App\Models\ClientsWhatsapp;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\MessageWhatsapp;
use App\Models\ParamsMessage;
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
            'api_url' => 'required',
            'estado_flujo_activacion' => 'required|boolean',
        ];

        // Validar los datos de la petición
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Convertir valores booleanos correctamente
        $request->merge([ 
            'estado_flujo_activacion' => filter_var($request->estado_flujo_activacion, FILTER_VALIDATE_BOOLEAN),
        ]);

        $mensaje = MessageWhatsapp::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'nombre' => $request->nombre,
            'usuario' => $request->usuario,
            'codigo' => $request->codigo,
            'estado_flujo_activacion' => $request->estado_flujo_activacion, 
            'api_url' => $request->api_url,
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
            'api_url' => 'required',
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
            'estado_flujo_activacion' => filter_var($request->estado_flujo_activacion, FILTER_VALIDATE_BOOLEAN),
        ]);
        // Actualizar los datos del mensaje
        $mensaje->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion, 
            'api_url' => $request->api_url,
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
        $mensaje = MessageWhatsapp::where('id_cliente_whatsapp', $id)->get();
        if (!$mensaje) {
            return response()->json(['error' => 'Mensaje no encontrado'], 404);
        }
        return response()->json(['data' => $mensaje]);
    }

    public function getMessagesByClientId($id)
    {
        // Find the client
        $empresa = ClientsWhatsapp::find($id);
        if (!$empresa) {
            return response()->json(['error' => 'Client not found'], 404);
        }
        // Query messages where 'codigo' matches the client's code and 'message' matches the given message
        $datos = MessageWhatsapp::where('codigo', $empresa->codigo)
            ->where('id_cliente_whatsapp', $empresa->id)
            ->get();
        return response()->json(['data' => $datos]);
    }

    public function createParams(Request $request)
    {
        // Validar los datos
        $request->validate([
            'name' => 'required',
            'label' => 'required',
        ]);

        // Crear el nuevo parámetro
        $param = ParamsMessage::create([
            'name' => $request->name,
            'label' => $request->label,
        ]);

        // Responder con el nuevo parámetro
        return response()->json($param, 201);
    }

    public function parametros()
    {
        // Obtener todos los parámetros
        $params = ParamsMessage::all();

        // Responder con los parámetros
        return response()->json($params);
    }
}