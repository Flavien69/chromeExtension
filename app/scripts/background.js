
var pollInterval = 1000 * 1; // 1 minute, in milliseconds
var timerId;
function updateBadge() {
    var notificationNumber = getVocabularyToDisplay().length;//localStorage.notification;
    
    if (notificationNumber > 0)
        chrome.browserAction.setBadgeText({text:notificationNumber.toString()});
    else
        chrome.browserAction.setBadgeText({text:""});
}

function startRequest() {
    updateBadge();
    timerId = window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
    window.clearTimeout(timerId);
}

function getVocabularyToDisplay(){
   var vocabularyList = getVocabulary();
   var vocabularyListToDisplay = [];
   for (var i = 0; i< vocabularyList.length; i++){
       if (vocabularyList[i].timeDisplay <= new Date().getTime()){
           vocabularyListToDisplay.push(vocabularyList[i]);
       }
   }
   return vocabularyListToDisplay;
}

function getVocabulary(){
    return JSON.parse(localStorage.vocabulary);
}

startRequest();

chrome.browserAction.setBadgeBackgroundColor({
    color: "#000"
});

chrome.webNavigation.onCommitted.addListener(function(e) {
        console.log("OIIKI");
      }, {url: [{hostSuffix: 'google.com'},
                {hostSuffix: 'google.com.au'}]});


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

function getActiveUrl(){
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
            if (model.searchWord !== undefined && model.lang !== undefined){
                var vocabularyJSON = getVocabulary();
                var element = {};
                element.value = model.searchWord;
                element.lang = model.lang;
                element.timeDisplay = new Date.getTime();
                element.fail = 0 ;
                vocabularyJSON.push(element);    
                localStorage.vocabulary = JSON.stringify(vocabularyJSON);
            }
        }

    });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "reload"){
        getActiveUrl();
      sendResponse({farewell: "goodbye"});
  }
  });
