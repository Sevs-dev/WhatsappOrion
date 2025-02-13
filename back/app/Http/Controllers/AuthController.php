<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
//Crear usuario administrador
public function addUser(Request $request)
{
    try {
        // Validar los datos de entrada
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // Crear el nuevo usuario
        $usuario = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Devolver una respuesta exitosa
        return response()->json([
            'estado' => 'éxito',
            'mensaje' => 'Usuario creado con éxito',
            'usuario' => $usuario,
        ], 201); // 🔹 Código de estado 201 (Created)
    } catch (\Exception $e) {
        // Manejar errores y devolver una respuesta de error
        return response()->json([
            'estado' => 'error',
            'mensaje' => 'Error al crear el usuario',
            'error' => $e->getMessage(),
        ], 500); // 🔹 Código de estado 500 (Internal Server Error)
    }
}
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Buscar el usuario por su correo
        $usuario = User::where('email', $request->email)->first();

        if (!$usuario) {
            return response()->json([
                'estado' => 'error',
                'mensaje' => 'Correo electrónico no encontrado',
            ], 404);
        }

        $credenciales = $request->only('email', 'password');

        // Intenta autenticar al usuario con las credenciales
        $token = Auth::attempt($credenciales);

        if (!$token) {
            return response()->json([
                'estado' => 'error',
                'mensaje' => 'Contraseña incorrecta',
            ], 401);
        }

        return response()->json([
            'estado' => 'éxito',
            'usuario' => $usuario,
            'autorización' => [
                'token' => $token,
                'tipo' => 'bearer',
            ]
        ]);
    }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $usuario = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($usuario);
        return response()->json([
            'estado' => 'éxito',
            'mensaje' => 'Usuario creado con éxito',
            'usuario' => $usuario,
            'autorización' => [
                'token' => $token,
                'tipo' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'estado' => 'éxito',
            'mensaje' => 'Cierre de sesión exitoso',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'estado' => 'éxito',
            'usuario' => Auth::user(),
            'autorización' => [
                'token' => Auth::refresh(),
                'tipo' => 'bearer',
            ]
        ]);
    }
    public function updateUser(Request $request, $id)
{
    try {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json([
                'estado' => 'error',
                'mensaje' => 'Usuario no encontrado',
            ], 404);
        }

        // Validar los datos
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6'
        ]);

        // Actualizar los datos si existen en la petición
        if ($request->has('name')) {
            $usuario->name = $request->name;
        }
        if ($request->has('email')) {
            $usuario->email = $request->email;
        }
        if ($request->has('password')) {
            $usuario->password = Hash::make($request->password);
        }

        $usuario->save();

        return response()->json([
            'estado' => 'éxito',
            'mensaje' => 'Usuario actualizado correctamente',
            'usuario' => $usuario,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'estado' => 'error',
            'mensaje' => 'Error al actualizar el usuario',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function getAllUsers()
{
    $usuarios = User::all();
    return response()->json([
        'estado' => 'éxito',
        'usuarios' => $usuarios,
    ]);
}
    public function getUser($id)
    {
        $usuario = User::findOrFail($id);
        return response()->json([
            'estado' => 'éxito',
            'usuario' => $usuario,
        ]);
    }

    // Función para eliminar un usuario
    public function deleteUser($id)
    {
        $usuario = User::findOrFail($id);
        $usuario->delete();
        return response()->json([
            'estado' => 'éxito',
            'mensaje' => 'Usuario eliminado con éxito',
        ]);
    }
}
