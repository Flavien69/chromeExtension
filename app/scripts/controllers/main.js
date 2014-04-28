'use strict';

angular.module('testyoApp')
  .controller('MainCtrl', function ($scope, $location, UserService, VocabularyService, pageInfoService) {
  var test = $location.path();
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma Flavien',
      test
    ];
    
    $scope.user = UserService.user;
    
    $scope.trytest = function(){
    	localStorage.notification = $scope.test;
    };
    
    $scope.vocabulary = VocabularyService.vocabularyList;
    
    $scope.element = {
      "value":"tesdfst",
      "timeDisplay":898556585655,
      "fail":2
    };
    
    //$scope.vocabulary.push($scope.element);
        
    $scope.vocabularyToDisplay = VocabularyService.vocabularyListToDisplay;
    VocabularyService.setVocabulary($scope.vocabulary);
    
    pageInfoService.getInfo(function (info) {
        $scope.searchWord = info.searchWord;
        $scope.lang = info.lang;     
        
        if (info.searchWord !== ""){
            $scope.element.value = info.searchWord;
            //$scope.vocabulary.push($scope.element);
        }
        $scope.$apply();
        VocabularyService.setVocabulary($scope.vocabulary);

    });

  });
