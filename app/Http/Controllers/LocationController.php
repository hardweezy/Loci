<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Http\Requests;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;

use App\User;
use App\Location;

class LocationController extends Controller
{
    //
    public function __construct()
    {
    	$this->middleware('jwt.auth');
    }

    /**
     * [storeLocation gets all JSON array with headers from Frontend
     * loop through each object and check if any exist in Location Table
     * if no create a new location entry against Logged in User]
     * @param  Request $req [JSON data from AngularJS $http.post]
     * @return [JSON array]       [return all location against logged user]
     */
    public function storeLocation(Request $req)
    {
        /**
         * [$user get Authenticated User details from User table that matches the passed token]
         * @var [string]
         */
        $user = JWTAuth::parseToken()->authenticate();
        /**
         * [$data pass all sent Array into a PHP variable]
         * @var [JSON]
         */
        $data = $req->all();

        /**
         * for  Each object in $data
         * check each venue_id of sent data against stored venues
         * if None exist, create new,
         * Else, discard
         * 
         */
        foreach($data as $d):
            $check_if_id_exist = Location::where('venue_id',$d['id'])
                                 ->where('user_id',$user->id)->first();
            
            if((count($check_if_id_exist) == 0 )){
                $newLocation = new Location();
                $newLocation->user_id = $user->id;
                $newLocation->venue_id = $d['id'];
                $newLocation->venue_name = $d['name'];
                if(isset($d['contact'])):
                $newLocation->venue_contact = $d['contact'];
                endif;
                $newLocation->venue_location = $d['location'];
                $newLocation->venue_category = $d['category'];
                $newLocation->venue_verified = $d['verified'];
                $newLocation->venue_stats = $d['checkIns'];

                if(isset($d['url'])):
                $newLocation->venue_url = $d['url'];
                endif;

                $newLocation->venue_lat = $d['lat'];
                $newLocation->venue_lng = $d['lng'];
                $newLocation->venue_ratingSignals = $d['reviews'];

                if(isset($d['picture_url'])):
                $newLocation->venue_photoURL = $d['picture_url'];
                endif;

                $newLocation->venue_hereNow = $d['hereNow'];
                if(empty($check_if_id_exist)){
                    $newLocation->save();
                }
            }
        endforeach;
        $locations = Location::where('user_id',$user->id)->orderBy('id','desc')->get();
        return response()->json(compact('locations'));

    }

    /**
     * [fetchLocation retireve stored location against authenticated user]
     * @return [JSON] [array]
     */
    public function fetchLocation()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $locations = Location::where('user_id',$user->id)->orderBy('id','desc')->get();
        return response()->json(compact('locations'));
    }
}
