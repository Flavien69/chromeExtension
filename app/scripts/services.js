angular.module('UserService',[])
	.factory('UserService', function($q, $http){
	
		  var defaults = {
			timeout: 200,
			number : 3
		  };
	
		  var service = {
			user: {},
			save: function() {
			  localStorage.presently =
				angular.toJson(service.user);
			},
			restore: function() {
			  // Pull from sessionStorage
			  service.user = 
				angular.fromJson(localStorage.presently) || defaults

			  return service.user;
			}
		  };
		  // Immediately call restore from the session storage
		  // so we have our user data available immediately
		  service.restore();
		  return service;
  
	})
