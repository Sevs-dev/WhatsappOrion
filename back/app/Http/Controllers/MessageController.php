<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mensaje;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos
        $rules = [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'check_url' => 'nullable|boolean',
            'id_url' => 'nullable|integer',
            'estado_flujo_activacion' => 'required|boolean',
            'id_cliente_whatsapp' => 'required|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mensaje = Mensaje::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'check_url' => $request->check_url,
            'id_url' => $request->id_url,
            'estado_flujo_activacion' => $request->estado_flujo_activacion,
            'id_cliente_whatsapp' => $request->id_cliente_whatsapp,
            'fecha' => Carbon::now(), 
            'usuario' => 'admin'
        ]);

        return response()->json(['message' => 'Registro creado con éxito', 'data' => $mensaje], 201);
    }

    /**
     * Actualizar un registro existente.
     */
    public function update(Request $request, $id)
    {
        // Validar los datos
        $rules = [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'check_url' => 'nullable|boolean',
            'id_url' => 'nullable|integer',
            'estado_flujo_activacion' => 'required|boolean',
            'id_cliente_whatsapp' => 'required|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mensaje = Mensaje::findOrFail($id);
        $mensaje->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'check_url' => $request->check_url,
            'id_url' => $request->id_url,
            'estado_flujo_activacion' => $request->estado_flujo_activacion,
            'id_cliente_whatsapp' => $request->id_cliente_whatsapp,
            'fecha' => Carbon::now(), 
            'usuario' => 'admin'
        ]);

        return response()->json(['message' => 'Registro actualizado con éxito', 'data' => $mensaje]);
    }

    /**
     * Eliminar un registro por su ID.
     */
    public function delete($id)
    {
        $mensaje = Mensaje::findOrFail($id);
        $mensaje->delete();

        return response()->json(['message' => 'Registro eliminado con éxito']);
    }

    /**
     * Consultar todos los registros filtrando por id_cliente_whatsapp.
     */
    public function index($id)
    {
      
        $mensajes = Mensaje::where('id_cliente_whatsapp', $id)->get();

        return response()->json(['data' => $mensajes]);
    }

    /**
     * Consultar un registro por id_mensaje_whatsapp.
     */
    public function consultById($id)
    {
        $mensaje = Mensaje::findOrFail($id);

        return response()->json(['data' => $mensaje]);
    }
}
