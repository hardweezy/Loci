<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Http\Requests;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;

use App\User;

class AuthenticateController extends Controller
{
    //
    public function index()
    {
    	$users = User::all();
    	return response()->json($users);
    }

    /*
    register will parse the request and create a new User in the database
    encrypting the password as the standard Laravel Authentication require.
    */
    public function register(Request $req)
    {
    	$this->validate($req,[
    		'name' => 'required|max:255',
    		'email' => 'required|email|max:255|unique:users',
    		'password' => 'required|min:6']);

    	$newUser = new User();
    	$newUser->name = $req->name;
    	$newUser->email = $req->email;
    	$newUser->password = Hash::make($req->password);
    	$newUser->save();

    	return response()->json(["success" => 'added new user'],200);
    }
    /*
	This is  we serve the authentication. 
	It takes the email and password from the request 
	and generate a token for the given user credential.
	If error is raised, exception catches it and return response. Else a JSON token is returned
    */
    public function authenticate(Request $req)
    {
    	$credentials = $req->only('email','password');
    	try{
    		if(!$token = JWTAuth::attempt($credentials))
    		{
    			return response()->json(["error" => 'Invalid Email/Password'],401);
    		}
    	}catch (JWTException $e)
    	{
    		return response()->json(["error" => 'Could not create token'],500);
    	}

    	return response()->json(compact('token'));
    }

    /*
    parse the token in the request and if the token is valid and the user is present 
    it return the user itself, 
    otherwise also in this case an exception is raised 
    and the appropriate response will be returned.
    */
    public function getAuthenticatedUser()
    {
    	try{
    		if(! $user = JWTAuth::parseToken()->authenticate())
    		{
    			return response()->json(['user_not_found'],404);
    		}
    	}catch(Tymon\JWTAuth\Exceptions\TokenExpiredException $e)
    	{
    		return response()->json(['token_expired'],$e->getStatusCode());

    	}
    	catch(Tymon\JWTAuth\Exceptions\TokenInvalidException $e)
    	{
    		return response()->json(['token_invalid'],$e->getStatusCode());

    	}
    	catch(Tymon\JWTAuth\Exceptions\JWTException $e)
    	{
    		return response()->json(['token_absent'],$e->getStatusCode());

    	}

    	return response()->json(compact('user'));
    }
}
