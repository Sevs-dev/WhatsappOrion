<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos
        $rules = [
            'id_cliente_whatsapp' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'estado' => 'required|integer'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cliente = Cliente::create([
            'id_cliente_whatsapp' => $request->id_cliente_whatsapp,
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'fecha' => Carbon::now(), 
            'usuario' => 'admin'
        ]);

        return response()->json(['message' => 'Cliente creado con éxito', 'data' => $cliente], 201);
    }

    /**
     * Actualizar un cliente existente.
     */
    public function update(Request $request, $id)
    {
        // Validar los datos
        $rules = [
            'id_cliente_whatsapp' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'estado' => 'required|integer'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cliente = Cliente::findOrFail($id);
        $cliente->update([
            'id_cliente_whatsapp' => $request->id_cliente_whatsapp,
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'fecha' => Carbon::now(), 
            'usuario' => 'admin'
        ]);

        return response()->json(['message' => 'Cliente actualizado con éxito', 'data' => $cliente]);
    }

    /**
     * Cambiar el estado de un cliente a 0 (no eliminar físicamente).
     */
    public function delete($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update(['estado' => 0]);

        return response()->json(['message' => 'Cliente marcado como inactivo']);
    }

    /**
     * Consultar todos los clientes con sus mensajes relacionados.
     */
    public function index()
    {
        $clientes = Cliente::with('mensajes')->get();

        return response()->json(['data' => $clientes]);
    }

    /**
     * Consultar un cliente específico con sus mensajes relacionados.
     */
    public function consultById($id)
    {
        $cliente = Cliente::with('mensajes')->findOrFail($id);

        return response()->json(['data' => $cliente]);
    }
}
