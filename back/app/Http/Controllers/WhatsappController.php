<?php

namespace App\Http\Controllers;

use App\Models\WhatsappApi;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappController extends Controller
{
    public function store(Request $request)
    {
        // Validar los campos
        $request->validate([
            'api_url' => 'required|url',
            'estado'  => 'required|boolean',  // Asegurarse de que el estado sea un valor booleano
            'number_test'  => 'required',  // Asegurarse de que el estado sea un valor booleano
        ]);

        // Guardar la nueva API URL, asegurándote de que 'estado' es un booleano
        $whatsappApi = WhatsappApi::create([
            'api_url' => $request->input('api_url'),
            'estado'  => (bool) $request->input('estado'),
            'number_test' => $request->input('number_test'),
        ]);

        // Responder con un mensaje de éxito
        return response()->json([
            'success' => true,
            'message' => 'API URL guardada correctamente',
            'data'    => $whatsappApi,
        ]);
    }

    public function getAll()
    {
        $apis = WhatsappApi::all();
        return response()->json($apis);
    }
    public function getwhatsappId($id){
        $whatsapp = WhatsappApi::find($id);
        return response()->json($whatsapp);
    }
    /**
     * Envía un mensaje de plantilla vía WhatsApp.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendTemplateMessage1(Request $request)
    {
        try {
            // Obtener datos del request o usar valores por defecto
            $nombre = $request->input('nombre', 'Sebastian');
            $telefono = $request->input('to', '573204627207');
            $pedido = $request->input('pedido', '12345');

            // Obtener la URL y el token desde el archivo .env
            $url = config('app.whatsapp_api_url');
            $token = config('app.whatsapp_webhook_token');

            if (!$url || !$token) {
                return response()->json(['error' => 'Falta configuración en el archivo .env.'], 500);
            }

            // Mensaje a enviar
            $mensaje = "¡Hola, $nombre!\n\n" .
                "Agradecemos tu compra en Loto del Sur🌴.\n\n"
                . "Te informamos que tu pedido número *$pedido* se encuentra en proceso de alistamiento.\n\n"
                . "Una vez finalice este proceso te estaremos informando por este medio. 📬";

            // Construir el array de datos para la API de WhatsApp
            $data = [
                "messaging_product" => "whatsapp",
                "recipient_type"    => "individual",
                "to"                => $telefono,
                "type"              => "text",
                "text"              => [
                    "body" => $mensaje
                ]
            ];

            // Realizar la petición POST con Laravel HTTP Client
            $response = Http::withToken($token)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $data);

            // Verificar la respuesta de la API de WhatsApp
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
        } catch (\Exception $e) {
            Log::error('Error al enviar mensaje: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error'   => 'Error interno del servidor',
            ], 500);
        }
    }

    public function sendTemplateMessage2(Request $request)
    {
        try {
            // Obtener datos del request o usar valores por defecto
            $nombre = $request->input('nombre', 'Sebastian');
            $telefono = $request->input('to', '573204627207');
            $direccion = $request->input('direccion', 'No especificada');
            $fecha = $request->input('fecha', 'Pendiente');
            $hora = $request->input('hora', 'Pendiente');
            $sitio_web = $request->input('sitio_web', 'https://www.tusitio.com');

            // Obtener la URL y el token desde el archivo .env
            $url = config('app.whatsapp_api_url');
            $token = config('app.whatsapp_webhook_token');

            if (!$url || !$token) {
                return response()->json(['error' => 'Falta configuración en el archivo .env.'], 500);
            }

            // Mensaje a enviar
            $mensaje = "¡Hola, $nombre! 🌴\n\n" .
                "¡Tu pedido ya fue alistado! y está siendo entregado a nuestro aliado en transporte para que lo recibas en: 📍 *$direccion.*\n\n"
                . "Fecha estimada de entrega: *$fecha*\n"
                . "Hora estimada: *$hora*\n\n"
                . "Recuerda estar disponible para recibir tu pedido y verificar que los productos se encuentren en perfectas condiciones antes de firmar el soporte de entrega.\n\n"
                . "Si deseas conocer más detalles, consulta el estado de tu pedido aquí. 👇"
                . "*$sitio_web*";

            // Construir el array de datos para la API de WhatsApp
            $data = [
                "messaging_product" => "whatsapp",
                "recipient_type"    => "individual",
                "to"                => $telefono,
                "type"              => "text",
                "text"              => [
                    "body" => $mensaje
                ]
            ];

            // Realizar la petición POST con Laravel HTTP Client
            $response = Http::withToken($token)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $data);

            // Verificar la respuesta de la API de WhatsApp
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
        } catch (\Exception $e) {
            Log::error('Error al enviar mensaje: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error'   => 'Error interno del servidor',
            ], 500);
        }
    }

    public function sendTemplateMessage3(Request $request)
    {
        try {
            // Obtener datos del request o usar valores por defecto
            $nombre = $request->input('nombre', 'Sebastian');
            $telefono = $request->input('to', '573204627207');
            $pedido = $request->input('pedido', 'asdfas');
            $sitio_web = 'https://wa.link/722xb0';

            // Obtener la URL y el token desde el archivo .env
            $url = config('app.whatsapp_api_url');
            $token = config('app.whatsapp_webhook_token');

            if (!$url || !$token) {
                return response()->json(['error' => 'Falta configuración en el archivo .env.'], 500);
            }

            // Mensaje a enviar
            $mensaje = "¡Hola, $nombre! 🌴\n\n"
                . "Tu pedido número *$pedido* ha sido entregado correctamente en la dirección confirmada.\n\n"
                . "Gracias por elegir *Loto del Sur*. ¡Esperamos verte pronto! 💚\n\n"
                . "Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos a través de nuestra línea de servicio al cliente: *$sitio_web*";

            // Construir el array de datos para la API de WhatsApp
            $data = [
                "messaging_product" => "whatsapp",
                "recipient_type"    => "individual",
                "to"                => $telefono,
                "type"              => "text",
                "text"              => [
                    "body" => $mensaje
                ]
            ];

            // Realizar la petición POST con Laravel HTTP Client
            $response = Http::withToken($token)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $data);

            // Verificar la respuesta de la API de WhatsApp
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
        } catch (\Exception $e) {
            Log::error('Error al enviar mensaje: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error'   => 'Error interno del servidor',
            ], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        try {
            if ($request->isMethod('get')) {
                $verifyToken = config('app.whatsapp_webhook_token');
                $query = $request->query();

                if (($query['hub_mode'] ?? null) === 'subscribe' && ($query['hub_verify_token'] ?? null) === $verifyToken) {
                    return response($query['hub_challenge'] ?? '', 200);
                }

                return response()->json(['success' => false, 'error' => 'Invalid request'], 403);
            }

            $tokenEsperado = config('app.whatsapp_webhook_token');
            $data = $request->all();

            Log::debug('Datos recibidos en Webhook: ' . json_encode($data));

            // Obtener el número de teléfono correctamente
            $telefono = $data['entry'][0]['changes'][0]['value']['contacts'][0]['wa_id'] ??
                $data['entry'][0]['changes'][0]['value']['statuses'][0]['recipient_id'] ?? null;
            $nombre = $data['entry'][0]['changes'][0]['value']['contacts'][0]['profile']['name'] ?? 'Usuario';

            if (!$telefono) {
                Log::error('Número de teléfono no encontrado en el Webhook.');
                return response()->json(['success' => false, 'error' => 'Número de teléfono no encontrado'], 400);
            }

            // Verifica si el mensaje recibido es de un usuario o es un estado de WhatsApp (solo manejar los mensajes)
            $mensajeRecibido = $data['entry'][0]['changes'][0]['value']['messages'][0]['text']['body'] ?? null;

            // Si no se ha recibido un mensaje, no hacer la consulta de la interacción ni enviarla
            if (!$mensajeRecibido) {
                return response()->json([
                    'success' => true,
                    'message' => 'No se recibió mensaje nuevo, por lo tanto no se realiza consulta.'
                ], 200);
            }

            // Si se recibe un mensaje, validamos el tiempo desde la última interacción
            $ultimaInteraccion = DB::table('whatsapp_interactions')
                ->where('phone_number', $telefono)
                ->value('last_interaction');

            Log::info("Última interacción obtenida para $telefono: " . json_encode($ultimaInteraccion));

            if ($ultimaInteraccion && Carbon::parse($ultimaInteraccion)->diffInMinutes(Carbon::now()) < 120) {
                Log::info("Interacción reciente con $telefono, no se enviará mensaje.");
                return response()->json([
                    'success' => true,
                    'message' => 'Respuesta no enviada, aún dentro de las 2 horas'
                ], 200);
            }

            // Insertar o actualizar la última interacción
            DB::table('whatsapp_interactions')->updateOrInsert(
                ['phone_number' => $telefono],
                ['last_interaction' => Carbon::now(), 'updated_at' => Carbon::now(), 'created_at' => Carbon::now()]
            );

            Log::info("Última interacción actualizada para $telefono.");

            // Enviar mensaje de respuesta
            $whatsappData = [
                "messaging_product" => "whatsapp",
                "recipient_type"    => "individual",
                "to"                => $telefono,
                "type"              => "text",
                "text"              => [
                    "body" => "¡Hola, $nombre!\n\n"
                        . "Si deseas comunicarte con nosotros, por favor escríbenos\na nuestra línea de atención al cliente en WhatsApp \n👉 https://wa.link/vgqpia.\n\nQuedo atenta."
                ]
            ];

            $whatsappResponse = Http::withToken($tokenEsperado)
                ->post(config('app.whatsapp_api_url'), $whatsappData);

            Log::debug('Respuesta de WhatsApp API: ' . $whatsappResponse->body());

            return response()->json([
                'success' => true,
                'data' => $data,
                'whatsapp_response' => $whatsappResponse->json(),
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

    public function sendPrueba(Request $request, $id)
    {
        try {

            $prueba = WhatsappApi::find($id);
            if (!$prueba) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recurso no encontrado.',
                ], 404);
            }
            $telefono = $request->input('to',  $prueba->number_test);
            $estado = $request->input('estado', $prueba->estado);

            // Obtener la URL y el token desde el archivo .env
            $url = $prueba->api_url;
            $token = config('app.whatsapp_webhook_token');

            if (!$url || !$token) {
                return response()->json(['error' => 'Falta configuración en el archivo .env.'], 500);
            }
            if($estado == 0){
                $estado = 'Inactivo';
            }else{
                $estado = 'Activo';
            }
            // Mensaje a enviar
            $mensaje =
                "Mensaje de prueba\n"
                . "*URL:* $prueba->api_url\n"
                . "*En estado:* $estado\n"
                . "*Número de prueba:* $telefono\n" 
                . "*Ignore este mensaje si lo recibe*";

            // Construir el array de datos para la API de WhatsApp
            $data = [
                "messaging_product" => "whatsapp",
                "recipient_type"    => "individual",
                "to"                => $telefono,
                "type"              => "text",
                "text"              => [
                    "body" => $mensaje
                ]
            ];

            // Realizar la petición POST con Laravel HTTP Client
            $response = Http::withToken($token)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $data);

            // Verificar la respuesta de la API de WhatsApp
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
        } catch (\Exception $e) {
            Log::error('Error al enviar mensaje: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error'   => 'Error interno del servidor',
            ], 500);
        }
    }
    
}