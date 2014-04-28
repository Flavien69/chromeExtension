angular.module('Services',[])
	.factory('UserService', function($q, $http){
	
		  var defaults = {
			timeout: 200,
			number : 3
		  };
	
		  var service = {
			user: {},
			save: function() {
			  localStorage.presently = angular.toJson(service.user);
			},
			restore: function() {
			  // Pull from sessionStorage
			  service.user = angular.fromJson(localStorage.presently) || defaults;

			  return service.user;
			}
		  };
		  // Immediately call restore from the session storage
		  // so we have our user data available immediately
		  service.restore();
		  return service;
  
	})
        
        .factory('NotificationService',function(){
            var defaults = 0;
            
            var service = {
                notificationNumber : {},
                getNotification: function(){
                    service.notificationNumber = localStorage.notification || defaults; 
                }
            };
            service.getNotification();
            return service.notificationNumber;
        })
        
        .factory('VocabularyService',function(){
            
            var service = {
                vocabularyList : [],
                vocabularyListToDisplay : [],
                setVocabulary: function(vocabulary){
                    service.vocabularyList = vocabulary;
                    localStorage.vocabulary = angular.toJson(service.vocabularyList);
                },
                getVocabulary: function(){
                    if (localStorage.vocabulary !== "undefined")
                        service.vocabularyList = angular.fromJson(localStorage.vocabulary) || []; 
                    else
                        service.vocabularyList = []; 
                    
                    return service.vocabularyList;
                },
                getVocabularyToDisplay:function(){
                    for (var i = 0; i< service.vocabularyList.length; i++){
                        if (service.vocabularyList[i].timeDisplay <= new Date().getTime()){
                            service.vocabularyListToDisplay.push(service.vocabularyList[i]);
                        }
                    }
                }
            };
            service.getVocabulary();
            service.getVocabularyToDisplay();
            
            return service;
        })
        
    .service('pageInfoService', function() {
    this.getInfo = function(callback) {
        var model = {};
        var urlParsed = {}; 
        
        function parseURL(url) {
			var parser = document.createElement('a'),
				searchObject = {},
				queries, split, i;

			// Let the browser do the work
			parser.href = url;

			// Convert query string to object
			queries = parser.search.replace(/^\?/, '').split('&');
			for( i = 0; i < queries.length; i++ ) {
				split = queries[i].split('=');
				searchObject[split[0]] = split[1];
			}

			return {
				protocol: parser.protocol,
				host: parser.host,
				hostname: parser.hostname,
				port: parser.port,
				pathname: parser.pathname,
				search: parser.search,
				searchObject: searchObject,
				hash: parser.hash
			};

		}

        chrome.tabs.query({'active': true},
        function (tabs) {
            if (tabs.length > 0)
            {
                model.title = tabs[0].title;
                model.url = tabs[0].url;
                
                urlParsed = parseURL(tabs[0].url);
                model.url = urlParsed.host;
                
                if (urlParsed.host === "www.wordreference.com"){
		            var regexPath = urlParsed.pathname.match("^/(.*)/(.*)$");
		            if (regexPath !== null){
						model.lang = regexPath[1];
						model.searchWord = regexPath[2];
					}		
                }

                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                    model.pageInfos = response;
                    callback(model);
                });
            }

        });
    };
});
	
	
