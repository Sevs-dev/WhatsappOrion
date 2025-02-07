<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WhatsappController extends Controller
{
    /**
     * Envía un mensaje de plantilla vía WhatsApp.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendTemplateMessage(Request $request)
    {
        // Puedes obtener estos valores desde el request o definirlos de manera fija.
        $nombre = $request->input('nombre', 'Sebastian');
        $telefono = $request->input('to', '573204627207');

        // Obtén la URL y el token desde el archivo .env
        $url = env('WHATSAPP_API_URL');   // Ahora se obtiene correctamente el valor desde el .env
        $token = env('WHATSAPP_API_TOKEN'); // Se obtiene el token de la variable de entorno

        // Verificar que la URL no esté vacía
        if (!$url) {
            return response()->json(['error' => 'La URL de la API de WhatsApp no está configurada en el archivo .env.'], 500);
        }

        // Construir el array de datos que se enviará en la petición
        $data = [
            "messaging_product" => "whatsapp",
            "recipient_type"    => "individual",
            "to"                => $telefono,
            "type"              => "template",
            "template"          => [
                "name"     => "prueba",
                "language" => [
                    "code" => "es_CO"
                ],
                "components" => [
                    [
                        "type"       => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => $nombre
                            ]
                        ]
                    ]
                ]
            ]
        ];

        // Realizar la petición POST utilizando el cliente HTTP de Laravel
        $response = Http::withToken($token)
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post($url, $data);

        // Manejar la respuesta
        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente.',
                'data'    => $response->json(),
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje.',
                'error'   => $response->body(),
            ], $response->status());
        }
    }
}
