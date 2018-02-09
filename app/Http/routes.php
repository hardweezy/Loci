<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

Route::group(array('prefix' => 'api/v1/'),
	function () {
	Route::get('fetch/locations','LocationController@fetchLocation');
	Route::post('store/location','LocationController@storeLocation');
	Route::get('fetch/pictures','PictureController@fetchPicture');
	Route::post('store/picture','PictureController@storePicture');
	Route::get('authenticate/user','AuthenticateController@getAuthenticatedUser');
	Route::post('authenticate','AuthenticateController@authenticate');
	Route::post('register','AuthenticateController@register');

});

