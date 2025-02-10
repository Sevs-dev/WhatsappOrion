<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Config;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class ConfigController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos
        $rules = [
            'token_api' => 'required|string|max:255',
            'numero_verificacion' => 'required|numeric'
        ];
        $validator = Validator::make($request->all(), $rules);
        // Comprobar si la validación falla
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        // Crear el usuario
        $config = Config::create([
            'token_api' => bcrypt($request->token_api),
            'numero_verificacion' => $request->numero_verificacion,
            'fecha' => Carbon::now(),
            'usuario' => 'admin',
            'estado' => 1
        ]);
        return response()->json(['message' => 'Configuración creada correctamente', 'config' => $config], 201);
    }
    public function update(Request $request, $id)
    {
        // Validar los datos
        $rules = [
            'token_api' => 'required|string|max:255',
            'numero_verificacion' => 'required|numeric'
        ];
        $validator = Validator::make($request->all(), $rules);
        // Comprobar si la validación falla
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        // Buscar el usuario por su ID
        $config = Config::findOrFail($id);
        // Actualizar los datos del usuario
        $config->token_api = $request->token_api;
        $config->numero_verificacion = $request->numero_verificacion;
        $config->save();
        // Retornar respuesta en formato JSON
        return response()->json([
            'message' => 'Configuración actualizada correctamente.',
            'user' => $config,
        ], 200);
    }
    public function delete($id)
    {
        // Buscar el usuario por su ID
        $config = Config::findOrFail($id);
        // Actualizar los datos del usuario
        $config->estado = 0;
        $config->save();
        // Retornar respuesta en formato JSON
        return response()->json([
            'message' => 'Configuración eliminada correctamente.',
            'user' => $config,
        ], 200);
    }
    public function index(Request $request)
    {
        // Obtener usuarios con estado = 1
        $config = Config::where('estado', 1)->get();
        // Retornar los usuarios en formato JSON
        return response()->json([
            'message' => 'Lista de configuraciones',
            'configurations' => $config
        ], 200);
    }
    public function consultById(Request $request, $id)
    {
        // Obtener usuarios con estado = 1
        $config = Config::where('estado', 1)
            ->where('id_configuracion', $id)
            ->get();
        // Retornar los usuarios en formato JSON
        return response()->json([
            'message' => 'Lista de configuraciones',
            'configurations' => $config
        ], 200);
    }
}
