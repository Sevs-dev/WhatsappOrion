<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClientsWhatsapp;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{

    public function store(Request $request)
    {
        // Validar los datos
        $rules = [
            'codigo' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'estado' => 'required|integer'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cliente = ClientsWhatsapp::create([
            'codigo' => $request->codigo,
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'fecha' => Carbon::now(),
            'usuario' => 'admin'
        ]);

        return response()->json(['message' => 'ClientsWhatsapp creado con éxito', 'data' => $cliente], 201);
    }

    /**
     * Actualizar un cliente existente.
     */
    public function update(Request $request, $id)
    {
        // Validar los datos
        $rules = [
            'codigo' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'estado' => 'required|integer'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cliente = ClientsWhatsapp::findOrFail($id);
        $cliente->update([
            'codigo' => $request->codigo,
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'fecha' => Carbon::now(),
            'usuario' => 'admin'
        ]);

        return response()->json(['message' => 'ClientsWhatsapp actualizado con éxito', 'data' => $cliente]);
    }

    /**
     * Cambiar el estado de un cliente a 0 (no eliminar físicamente).
     */
    public function delete($id)
    {
        $cliente = ClientsWhatsapp::findOrFail($id);
        $cliente->update(['estado' => 0]);

        return response()->json(['message' => 'ClientsWhatsapp marcado como inactivo']);
    }

    /**
     * Consultar todos los clientes con sus mensajes relacionados.
     */
    public function index()
    {
        try {
            $clients = ClientsWhatsapp::all();
            return response()->json($clients, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Consultar un cliente específico con sus mensajes relacionados.
     */
    public function consultById($id)
    {
        $cliente = ClientsWhatsapp::with('mensajes')->find($id);
        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }
        return response()->json(['data' => $cliente]);
    }

    //Estados
    public function getStates()
    {
        $states = [
            'activo',
            'inactivo',
            'pendiente',
            'en_proceso',
            'entregado',
            'cancelado',
        ];

        return response()->json($states);
    }
}
