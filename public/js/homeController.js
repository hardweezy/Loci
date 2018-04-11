angular.module('locApp').controller('homeController', function(Lightbox, $auth, $rootScope, $state, $http, $scope, API_URL) {
    /**
     * [init this controls the Home View, only show this page to authenticated users]
     * @return {[boolean]} [return true if tokenizer authenticates against logged in User]
     */
    function init() {
        /**
         * [authenticated description]
         * @type {[boolean check]}
         * @return {true} [description]
         */
        var authenticated = localStorage.getItem('authenticated');
        if (authenticated) {
            $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            /**
             * [search default location to search with]
             * @type {String}
             */
            $scope.search = "Durban";
            /**
             * [state default state to init the app]
             * @type {String}
             */
            $scope.state = "isLoading";
            /**
             * Make API call to DB to fetch stored locations against the authenticated user
             * @type { http.get}
             * @return { array[]} [description]
             */
            $http.get(API_URL + '/fetch/locations')
                .success(function(data) {
                    $scope.locations = data.locations;
                });
            /**
             * Make API call to DB to fetch stored pictures against the authenticated user
             * @type { http.get}
             * @return { array[]} [description]
             */
            $http.get(API_URL + '/fetch/pictures')
                .success(function(data) {
                    $scope.pictures = data.pictures;

                });
        } else {
            /**
             * redirect user to login view if not authenticated
             * @type {routing}
             * @return {$state} [views/login]
             */
            $state.go('login');
        }
    };

    /**
     * [foursquare_clientID]
     * [foursquare_clientSecret]
     * @type {String} [read more at developer.foursquare]
     * @return { needed to make successful API calls} 
     */
    var foursquare_clientID = "OBKEDINEHY3KGRQSPX4A1OJIPYJI5EYFBRCGQWR42OAIZ3K3";
    var foursquare_clientSecret = "HHOU2X2S0TKGJIYAV0HDTF2A2KOSUBWSAZED4WZIIUG2T4CS";

    /** @type {String} [need this API key from FLickr to make calls to it] */
    var flikr_api_key = "7e1b66cdfced6b6e10a85a67e2aba08a";

    /**
     * [ddSelectOptions directive to populate dropdown on things to search]
     * @type {Array}
     * @return {text as key} [value as value]
     */
    $scope.ddSelectOptions = [

        {
            text: "Top Picks",
            value: "Top Picks"
        }, {
            text: "Monument / Landmark",
            value: "Monument / Landmark"
        }, {
            text: "Food",
            value: "Food"
        }, {
            text: "Coffee",
            value: "Coffee"
        }, {
            text: "Nightlife",
            value: "Nightlife"
        }, {
            text: "Fun",
            value: "Fun"
        }, {
            text: "Shopping",
            value: "Shopping"
        }
    ];

    /**
     * [watchGroup function to trigger fetch scope when there is any change to DropDown and Search input]
     * @param  {[ddSelected,search]}
     * @return { $scope.fetch} [trigger function after 5 seconds]
     */
    $scope.$watchGroup(['ddSelectSelected', 'search'], function() {
        setTimeout(function() {
            $scope.fetch(), 5000
        });
    });

    /**
     * [select highligh the element inside the search input]
     * @return {[select All]} 
     */
    $scope.select = function() {
        this.setSelectionRange(0, this.value.length);
    };

    /**
     * [fetch this makes a call to FourSquare venue/explore API, returns list of places against searched queries]
     * @return {[json]} 
     * @param {client_id}
     * @param {[url]} [this get request does not need authentication]
     * @param {[limit]} 
     */
    $scope.fetch = function() {

        /**
         * [state change state to Loading while API call is made in background]
         * @type {String}
         */
        $scope.state = "isLoading";


        /**
         * [https.jsonp fetch venues from foursquare that matches searched queries]
         * @type {[json]}
         */
        $http.jsonp('https://api.foursquare.com/v2/venues/explore', {
                params: {
                    near: $scope.search,
                    query: $scope.ddSelectSelected.text,
                    venuePhotos: 1,
                    limit: 50,
                    client_id: foursquare_clientID,
                    client_secret: foursquare_clientSecret,
                    v: '20160927',
                    callback: 'JSON_CALLBACK'
                }
            })
            /**
             * [if API call is successful, hold a promise to populate an array with returned data]
             * @param  {[var]} 
             * @return {[array]}  
             */
            .then(function(response) {
                var items = response.data.response.groups[0].items;
                /**
                 * [locInfo create a new Array to hold response from API]
                 * @type {Array}
                 */
                var locInfo = [];
                /**
                 * [for loop through each items returned]
                 * @param {var el}
                 * @return each
                 */
                for (var el in items) {
                    /**
                     * [for each looped item, call Scope.parseVenue to return 
                     * needed information from Array returned by Foursquare API]
                     * @type {[var]}
                     */
                    var place = $scope.parseVenue(items[el]);
                    /**
                     * push needed result into array cretaed earlier
                     */
                    locInfo.push(place);
                }

                /**
                 * [state once we are done looping, we set the program state to loaded
                 * meaning, it cn now display needed result]
                 * @type {String}
                 */
                $scope.state = 'loaded';
                /**
                 * [venues this binds the venues to our view,
                 *  this is the final DOM of the API call]
                 * @type {[type]}
                 */
                $scope.venues = locInfo;
                if ($scope.venues.length > 0) {
                    /**
                     * [Now store the retrieved results in the DB,
                     * this only works if the venues length is greater than 1,
                     * meaning there is always a result]
                     */
                    $http.post(API_URL + '/store/location', $scope.venues)
                        .success(function(data) {
                            /**
                             * [locations on success callback, refresh the locations DOM]
                             * @type {[type]}
                             */
                            $scope.locations = data.locations;
                        })
                }
            })
            .catch(function(data) {
                /**
                 * [state change state view to noReuslt to 
                 * show the No result div, if there is 
                 * error with the Foursquare API]
                 * @type {String}
                 */
                $scope.state = 'noResult';
            });
    };




    /**
     * [parseVenue trim and output the needed meta data from Foursquare API]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.parseVenue = function(data) {
        var venue = data.venue;
        if(!venue) return;
        
        return {
            id: venue.id,
            name: venue.name,
            picture_url: venue.photos.groups[0].items[0].prefix + '185x175' + venue.photos.groups[0].items[0].suffix,
            reviews: venue.ratingSignals + ' reviews',
            contact: venue.contact.formattedPhone,
            verified: venue.verified,
            checkIns: venue.stats.checkinsCount,
            location: venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1],
            category: venue.categories[0].shortName,
            url: venue.url,
            hereNow: venue.hereNow.count,
            lat: venue.location.lat,
            lng: venue.location.lng,
        };
    };

    $scope.fetchImage = function(lat, lng, name, ID) {
        /**
         * All declared scope here are retrieved from Binded model in View
         * @param longitude 
         * @param latitude
         * @param selected Venue Name
         * @param selected venue ID
         */
        $scope.lat = lat;
        $scope.lng = lng;
        $scope.selected_venue = name;
        $scope.venueID = ID;

        /**
         * [secondState initialize this view by displaying isLoading]
         * @type {String}
         */
        $scope.secondState = "isLoading";

        /**
         * [https this call gets the place_id from flickr 
         * by passing a veue's longitude and latitude]
         * @type {[$http.jsonp- get]}
         * @param flickr.places.findByLatLon
         */
        $http.jsonp('https://api.flickr.com/services/rest/', {
                params: {
                    method: 'flickr.places.findByLatLon',
                    api_key: flikr_api_key,
                    format: 'json',
                    jsoncallback: 'JSON_CALLBACK',
                    lat: $scope.lat,
                    lon: $scope.lng,
                    accuracy: 11
                }
            })
            /**
             * [on success callback, call another Flickr API method
             *  to search for photos that belong to an 
             *  identified place from the previous API call]
             * @param flickr.photos.search
             * @type {$http.jsonp - get}
             */
            .then(function(result) {
                $http.jsonp('https://api.flickr.com/services/rest/', {
                        params: {
                            method: 'flickr.photos.search',
                            api_key: flikr_api_key,
                            place_id: result.data.places.place[0].place_id,
                            format: 'json',
                            content_type: 1,
                            jsoncallback: 'JSON_CALLBACK',
                            privacy_filter: 1,
                            min_taken_date: 1454112000,
                            accuracy: 11,
                            radius: 1,
                            per_page: 30,
                            page: 1

                        }
                    })
                    /**
                     * [on success callback, call another Flickr API method
                     *  to get information about a photo retrieved from the previous API call]
                     * @param flickr.photos.getInfo
                     * @type {$http.jsonp - get}
                     */
                    .then(function(response) {
                        var items = response.data.photos.photo;
                        /**
                         * [photoGallery new Array to hold each 
                         * object reformatted from API's response]
                         * @type {Array}
                         * @return JSON Objects inside an Array
                         */
                        var photoGallery = [];

                        for (var el in items) {

                            /**
                             * [on success callback, call another Flickr API method
                             *  to get information about a photo retrieved from the previous API call]
                             * @param flickr.photos.getInfo
                             * @type {$http.jsonp - get}
                             */
                            $http.jsonp('https://api.flickr.com/services/rest/', {
                                params: {
                                    api_key: flikr_api_key,
                                    method: 'flickr.photos.getInfo',
                                    photo_id: items[el].id,
                                    format: 'json',
                                    jsoncallback: 'JSON_CALLBACK'
                                }

                            }).then(function(response) {
                                var res = response.data.photo;

                                var check = {
                                    url: 'http://farm' + res.farm + '.static.flickr.com/' + res.server + '/' + res.id + '_' + res.secret + '_b.jpg',
                                    thumbUrl: 'http://farm' + res.farm + '.static.flickr.com/' + res.server + '/' + res.id + '_' + res.secret + '_b.jpg',
                                    caption: ' Owner: ' + res.owner.username + '  Taken-On: ' + res.dates.taken,
                                };
                                photoGallery.push(check);
                            })
                        }
                        /**
                         * [state once we are done looping, we set the program state to loadedPicture
                         * meaning, it cn now display needed result]
                         * @type {String}
                         */
                        $scope.secondState = 'loadedPicture';
                        /**
                         * [photos this binds the photos to our view,
                         *  this is the final DOM of the API call]
                         * @type {[type]}
                         */
                        $scope.photos = photoGallery;

                        if (items.length > 0) {

                            /**
                             * [sendtoPictureRoute create a new Array to hold response from API]
                             * @type {Array}
                             */
                            var sendtoPictureRoute = [];
                            /**
                             * [for loop through each items returned]
                             * @param {var el}
                             * @return each
                             */
                            for (var el in items) {
                                sendtoPictureRoute.push({
                                    thumbUrl: 'http://farm' + items[el].farm + '.static.flickr.com/' + items[el].server + '/' + items[el].id + '_' + items[el].secret + '_m.jpg',
                                    url: 'http://farm' + items[el].farm + '.static.flickr.com/' + items[el].server + '/' + items[el].id + '_' + items[el].secret + '_b.jpg',
                                    picture_id: items[el].id,
                                    caption: 'Owner: ' + items[el].owner + ' Title: ' + items[el].title,
                                    venue_id: $scope.venueID,
                                    venue_name: $scope.selected_venue
                                });


                            }
                            /**
                             * [post pictures metadata retrieved from Flickr API to DB]
                             * @type {[$http.post]}
                             */
                            $http.post(API_URL + '/store/picture', sendtoPictureRoute)
                                .success(function(data) {
                                    /**
                                     * [return pictures on success callback, refresh the $scope.pictures DOM]
                                     * @type {[$scope]}
                                     * @return array[] pictures
                                     */
                                    $scope.pictures = data.pictures;
                                });

                        };

                    })
            })

    };

    /**
     * [openStoredLightboxModal Lightbox to zoom in on images retrieved from API -Foursquare]
     * @param  {[picture url]} index []
     * @return {[modal box]}      
     */
    $scope.openLightboxModal = function(index) {
        Lightbox.openModal($scope.photos, index);
    };

    /**
     * [openStoredLightboxModal Lightbox to zoom in on images stored in the databse]
     * @param  {[picture url]} index []
     * @return {[modal box]}      
     */
    $scope.openStoredLightboxModal = function(index) {
        Lightbox.openModal($scope.pictures, index);
    };


    /**
     * [lstPics list Locations Div when the Locations View All is clicked]
     * @return {[partial view]} 
     */
    $scope.lstLocs = function() {
        $scope.state = "loadedLocationonLoad"
        $scope.secondState = "noResult";
    };

    /**
     * [lstPics list Pictures Div when the Pictures View All is clicked]
     * @return {[partial view]} 
     */
    $scope.lstPics = function() {
        $scope.secondState = "loadedPicturesonLoad",
            $scope.state = "noResult"
    };

    /**
     * [ddSelectSelected default key and value
     * for the dropdown to work alongside the search input]
     * @type {Object}
     */
    $scope.ddSelectSelected = {
        text: "Top Picks",
        value: "Top Picks"
    };

    /**
     * [logout clear cookies, session and localStorage elements
     * associated with the current user]
     * @return {[view/login]} [take us to login page on success]
     */
    $scope.logout = function() {
        $auth.logout().then(function() {
            $rootScope.currentUser = null;
            localStorage.removeItem('user');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authenticated');
            $state.go('login');
        });
    };

    /**
     * Call the init function to always 
     * load up the init function when 
     * the page is refreshed/called
     */
    init();
});