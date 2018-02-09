<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Http\Requests;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;

use App\User;
use App\Picture;

class PictureController extends Controller
{
    //
    public function __construct()
    {
    	$this->middleware('jwt.auth');
    }


    /**
     * [storePicture gets all JSON array with headers from Frontend
     * loop through each object and check if any exist in Picture Table
     * if no create a new picture entry against Logged in User]
     * @param  Request $req [JSON data from AngularJS $http.post]
     * @return [JSON array]       [return all picture against logged user]
     */
    public function storePicture(Request $req)
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
            $check_if_id_exist = Picture::where('photo_id',$d['picture_id'])
                                 ->where('user_id',$user->id)->first();
            
            if((count($check_if_id_exist) == 0 )){
                $pic = new Picture();
                $pic->user_id = $user->id;
                $pic->venue_id = $d['venue_id'];
                $pic->photo_id = $d['picture_id'];

                if(isset($d['caption'])):
                $pic->caption = $d['caption'];
            	endif;

                if(isset($d['thumbUrl'])):
                $pic->thumbUrl = $d['thumbUrl'];
            	endif;

                if(isset($d['venue_name'])):
                $pic->venue_name = $d['venue_name'];
                endif;

                if(isset($d['url'])):
                $pic->url = $d['url'];
            	endif;

                if(empty($check_if_id_exist)){
                    $pic->save();
                }
            }
        endforeach;
        $pictures = Picture::where('user_id',$user->id)->orderBy('id','desc')->get();
        return response()->json(compact('pictures'));

    }

    public function fetchPicture()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $pictures = Picture::where('user_id',$user->id)->orderBy('id','desc')->get();
        return response()->json(compact('pictures'));
    }
}
