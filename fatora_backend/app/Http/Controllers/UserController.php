<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //register
    public function register(RegisterUserRequest $request)
    {

        $user = User::create([
            'first_name'=>$request->first_name,
            'second_name'=>$request->second_name,
            'email' => $request->email,
            'password' => Hash::make($request->password)

        ]);
        
        return response()->json(['message' => 'User Created successfully', 'User'=>$user], 201);
    }

    //login
    public function login(LoginUserRequest $request)
    {  
        if(Auth::attempt($request->only('email','password'))){
            $user = User::where('email', $request->email)->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['message' => 'User Logged in successfully', 'access_token'=>$token, 'token_type'=>'Bearer', 'user'=>$user], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }


    //logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'User logged out successfully'], 200);
    }

}
