app.controller('authController', function($timeout, $auth, $state, $http, $rootScope, $scope, API_URL) {
    $scope.name = '';
    $scope.email = '';
    $scope.password = '';
    $scope.newUser = {};
    $scope.loginError = true;
    $scope.loginErrorText = '';

    /**
     * [login login function returns an $hhtp reuquest for the now authenticated
    		user so that promises can be flattened
    		if no result matching the passeed credentials, don't provide a token
    		echo out result]
     * @return {[localStorage JSon]} [description]
     */
    $scope.login = function() {
        var credentials = {
            email: $scope.email,
            password: $scope.password
        }
        $auth.login(credentials).then(function() {
            return $http.get(API_URL + '/authenticate/user');
        }, function(error) {
            $scope.loginError = false;
            $scope.loginErrorText = error.data.error;
            $timeout(function() {
                $scope.loginError = true;
            }, 5000);
        }).then(function(response) {
            var user = JSON.stringify(response.data.user);
            localStorage.setItem('currentUser', user);
            localStorage.setItem('authenticated', true);
            $state.go('home');
        });
    }

    /**
     * [register registeration function post an $hhtp request to store user in the
    		database, create a token then redirect to login to test out the token]
     * @return {[type]} [description]
     */
    $scope.register = function() {
            $http.post(API_URL + '/register', $scope.newUser)
                .success(function(response) {
                    $scope.email = $scope.newUser.email;
                    $scope.password = $scope.newUser.password;
                    $scope.login();

                }).error(function(error) {
                    $scope.alert_type = "danger";
                    $scope.errorText = "Name is not Valid";
                    $scope.regError = false;
                    $timeout(function() {
                        $scope.regError = true;
                    }, 5000);

                });
        }
        /**
         * [signup route is triggered when this scope is called]
         * @return {[signup state]} [description]
         */
    $scope.signup = function() {
        return $state.go('register');
    }
})