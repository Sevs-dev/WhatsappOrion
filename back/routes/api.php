<?php

use App\Http\Controllers\ApiIp6Controller;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\WhatsappController;
use App\Models\DropStatus;
use Illuminate\Support\Facades\Route;


Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');

    Route::post('/useradd', 'addUser'); // Nueva ruta para agregar usuarios
    Route::get('/users', 'getAllUsers');  // Listar todos los usuarios
    Route::get('/users/{id}', 'getUser'); // Obtener un usuario específico
    Route::put('/users/update/{id}', action: 'updateUser'); // Actualizar usuario ✅ (antes estaba mal con GET)
    Route::delete('/users/{id}', 'deleteUser'); // Eliminar usuario

});


Route::get('/clients', [ApiIp6Controller::class, 'getClientData']);
Route::get('/dato/{codigo}', [ApiIp6Controller::class, 'getClientByCodigo']);

Route::prefix('config')->group(function () {
    Route::post('/create', [ConfigController::class, 'store']);
    Route::put('/update/{id}', [ConfigController::class, 'update']);
    Route::get('/delete/{id}', [ConfigController::class, 'delete']);
    Route::get('/list', [ConfigController::class, 'index']);
    Route::get('/search/{id}', [ConfigController::class, 'consultById']);
});

Route::prefix('message')->group(function () {
    Route::post('/create', [MessageController::class, 'store']);
    Route::put('/update/{id}', [MessageController::class, 'update']);
    Route::delete('/delete/{id}', [MessageController::class, 'delete']);
    Route::get('/list', [MessageController::class, 'index']);
    Route::get('/{id}', [MessageController::class, 'show']);
    Route::get('/search/{id}', [MessageController::class, 'getMessagesByClientId']); 
});

Route::prefix('parametros')->group(function () { 
    Route::post('/params', [MessageController::class, 'createParams']);
    Route::get('/parametros', [MessageController::class, 'parametros']);
});

Route::prefix('client')->group(function () {
    Route::post('/create', [ClientController::class, 'store']);
    Route::put('/update/{id}', [ClientController::class, 'update']);
    Route::delete('/delete/{id}', [ClientController::class, 'delete']);
    Route::get('/info', [ClientController::class, 'index']);
    Route::get('/search/{id}', [ClientController::class, 'consultById']);
    Route::get('/states', [ClientController::class, 'getStates']);
});

Route::prefix('status')->group(function () {
    Route::post('/create', [StatusController::class, 'store']);
    Route::get('/{clientId}/estados', [StatusController::class, 'show']);
});

Route::prefix('drop')->group(function () {
    Route::post('/create', [StatusController::class, 'saveDropStatus']);
    Route::get('/data/{id_cliente}', [StatusController::class, 'getMessageStatus']);
});
 
Route::prefix('whatsapp')->group(function () {
    Route::post('/whatsapp-api', [WhatsappController::class, 'store']);
    Route::get('/whatsapp-api', [WhatsappController::class, 'getAll']);
    Route::get('/whatsapp-api-id/{id}', [WhatsappController::class, 'getwhatsappId']);
    Route::post('/send-prueba/{id}', [WhatsappController::class, 'sendPrueba']);
    Route::post('/send-whatsapp-message', [WhatsappController::class, 'sendTemplateMessage']);
    Route::get('/webhook', [WhatsappController::class, 'handleWebhook']);
    Route::post('/webhook', [WhatsappController::class, 'handleWebhook']);
    Route::post('/config-whatsapp', [WhatsappController::class, 'enviarConfigWhatsApp']);
});