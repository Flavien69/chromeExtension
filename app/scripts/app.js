'use strict';

angular
  .module('testyoApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'UserService'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/setting', {
        templateUrl: 'views/setting.html',
        controller: 'SettingCtrl'
      })
      .otherwise({
        redirectTo: '/not-found'
      });
  });
