<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        $email = $request->input('email', 'sebastian.ramirez@logismart.com.co');
        $codigo_cliente = $request->input('codigo_cliente', 'C-12345');
        $estado_pedido = $request->input('estado_pedido', 'En camino');
        $titulo = $request->input('titulo', 'Tu pedido está en camino');
        $descripcion = $request->input('descripcion', 'Pronto recibirás tu compra. ¡Gracias por confiar en nosotros!');
    
        // Obtén la URL y el token desde el archivo .env
        $url = 'https://graph.facebook.com/v22.0/570059472856868/messages';   // Ahora se obtiene correctamente el valor desde el .env
        $token = 'EAAQ2QSoMSZCUBO1GP77tgMGCZAG49huEJg5pAvjNkRNMoHYEoztvqHshcwiuyiPQgZAfZAzTv1sChBTwNQZC3Wa4nM217QDPbnK8Hw3gL91RZAjDuQL7xkqDSjJZBEnajBo9dUJ93s7twGjFyBq0KsuPHvM7nBUp9apXtEHb04PfUZAoVqu53icQ9j4j7RjF2tVxGAZDZD'; // Se obtiene el token de la variable de entorno
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
                "name"     => "test",
                "language" => [
                    "code" => "en_US"
                ],
                "components" => [
                    [
                        "type"       => "body",
                        "parameters" => [
                            ["type" => "text", "text" => $nombre],           // {{1}} - Nombre del cliente
                            ["type" => "text", "text" => $codigo_cliente],   // {{2}} - Código del cliente
                            ["type" => "text", "text" => $estado_pedido],    // {{3}} - Estado del pedido
                            ["type" => "text", "text" => $titulo],           // {{4}} - Título del mensaje
                            ["type" => "text", "text" => $descripcion]       // {{5}} - Descripción
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

    /**
     * Método para procesar el webhook.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleWebhook(Request $request)
    {
        try {
            // Verificar si es una solicitud GET (Verificación de Webhook)
            if ($request->isMethod('get')) {
                $verifyToken = 'EAAQ2QSoMSZCUBO1GP77tgMGCZAG49huEJg5pAvjNkRNMoHYEoztvqHshcwiuyiPQgZAfZAzTv1sChBTwNQZC3Wa4nM217QDPbnK8Hw3gL91RZAjDuQL7xkqDSjJZBEnajBo9dUJ93s7twGjFyBq0KsuPHvM7nBUp9apXtEHb04PfUZAoVqu53icQ9j4j7RjF2tVxGAZDZD';
                $query = $request->query();

                $mode = $query['hub_mode'] ?? null;
                $token = $query['hub_verify_token'] ?? null;
                $challenge = $query['hub_challenge'] ?? null;

                if (!$mode || !$token) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Missing parameters'
                    ], 400);
                }

                if ($mode === 'subscribe' && $token === $verifyToken) {
                    return response($challenge, 200);
                }

                return response()->json([
                    'success' => false,
                    'error' => 'Invalid request'
                ], 403);
            }

            // Manejar los mensajes entrantes (POST)
            $tokenEsperado = 'EAAQ2QSoMSZCUBO1GP77tgMGCZAG49huEJg5pAvjNkRNMoHYEoztvqHshcwiuyiPQgZAfZAzTv1sChBTwNQZC3Wa4nM217QDPbnK8Hw3gL91RZAjDuQL7xkqDSjJZBEnajBo9dUJ93s7twGjFyBq0KsuPHvM7nBUp9apXtEHb04PfUZAoVqu53icQ9j4j7RjF2tVxGAZDZD';
 
            if (!$tokenEsperado ) {
                return response()->json(['error' => 'Token inválido'], 403);
            }

            $data = $request->all();

            // Log solo en modo debug
            if (config('app.debug')) {
                Log::debug('Webhook recibido: ' . json_encode($data));
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en Webhook: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Error interno del servidor',
            ], 500);
        }
    }

    public function enviarConfigWhatsApp(Request $request)
    {
        try { 
            $datos = $request->all(); 
            $response = Http::post('http://129.146.161.23/Api/config_whatsapp.php', $datos); 
            if ($response->successful()) {
                return response()->json($response->json(), 200);
            } else {
                return response()->json(['error' => 'No se pudo enviar la configuración'], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la solicitud: ' . $e->getMessage()], 500);
        }
    }
}