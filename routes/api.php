<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SocketController;
use Illuminate\Support\Facades\View;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|v
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/test', function () {
    return response()->json(['message' => 'API test successful']);
});
Route::get('/article', [\App\Http\Controllers\ArticleController::class,'index']);
// Route::get('/online-users', [\App\Http\Controllers\Api\SocketController::class,'getOnlineUsers']);
Route::get('/online-users', function () {
    return View::make('welcome'); // Oluşturduğunuz Blade dosyasının adını burada kullanın
});
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/update-user-status', [SocketController::class, 'updateUserStatus']);
});
Route::post('/login', [SocketController::class, 'login']);
