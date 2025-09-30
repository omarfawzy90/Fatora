<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// In routes/api.php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Authentication routes
Route::post('register', [UserController::class,'register']);
Route::post('login',[UserController::class, 'login']);
Route::post('logout',[UserController::class, 'logout'])->middleware('auth:sanctum');


//products routes
Route::get('products/{product:barcode}',[ProductController::class, 'show']);
Route::post('products',[ProductController::class, 'create'])->middleware('auth:sanctum');



