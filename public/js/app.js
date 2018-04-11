'use strict';
/**
 * [app bootstrap my application here]
 * @type {[ng-app]}
 */
var app = angular.module('locApp', ['angularUtils.directives.dirPagination', 'ui.bootstrap', 'ngAnimate', 'ngTouch', 'bootstrapLightbox', 'ngDropdowns', 'ui.router', 'satellizer'])

/**
 * [description]
 * @param  API_URL                       [returns a constant variable to be used throughout the app]
 */
.constant('API_URL', 'https://loci.dev/api/v1')
    /**
     * [description]
     * @param  $stateProvider                    [configure my views]
     * @param  $urlRouterProvider                [default view to be returned]
     * @param  $authProvider                     [URL to authenticate credentials to]
     * @param  $httpProvider                     [attach my interceptor to this]
     * @param  $provide                          [make a factory able]
     * @param  API_URL                       [returns a constant variable to be used throughout the app]
     * @return                                   [localStorage data that contains satellizer_token, user data, authenticated status]
     */
    .config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, API_URL) {
        $authProvider.loginUrl = API_URL + "authenticate";
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '../views/login.html',
                controller: 'authController as auth'
            })
            .state('register', {
                url: '/register',
                templateUrl: '../views/register.html',
                controller: 'authController as auth'
            })
            .state('home', {
                url: '/',
                templateUrl: '../views/home.html',
                controller: 'homeController as home'
            });

        function redirectWhenLoggedOut($q, $injector) {
            return {
                responseError: function(rejection) {
                    var $state = $injector.get('$state');
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    angular.forEach(rejectionReasons, function(value, key) {
                        if (rejection.data.error === value) {
                            localStorage.removeItem('user');
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('authenticated');
                            $state.go('login');
                        }

                    });
                    return $q.reject(rejection);
                }
            }
        }
        $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
        $httpProvider.interceptors.push('redirectWhenLoggedOut');
        $authProvider.loginUrl = API_URL + '/authenticate';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

    })
    .run(function($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            var user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                localStorage.setItem('authenticated', true);
                localStorage.setItem('currentUser', user);
                if (toState.name === "auth") {
                    event.preventDefault();
                    $state.go('home');

                }

            }
        })

    })