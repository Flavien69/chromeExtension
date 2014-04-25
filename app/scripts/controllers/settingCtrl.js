'use strict';

angular.module('testyoApp')
  .controller('SettingCtrl', function ($scope,$location, UserService) {
  var test = $location.path();
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma Flavien',
      test
    ];
    
    $scope.user = UserService.user;
    
    $scope.saveSettings = function(){
    	UserService.save();
    }
    
  });
