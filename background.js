var config = {
	"isCanShow":true,
	"isLeftRightAble":false
};

var currentDetailList	= {};
chrome.webRequest.onCompleted.addListener(
  function(details) {
	  currentDetailList[details.url] = details;
	return;
  },
  {
	urls: [],
	types: []
  },
  ['responseHeaders']
);


// Listeners
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse)
	{
		switch (request.name)
		{
			case "setOptions":
				config = request.config;
				sendResponse(config);
			break;
			
			case "getOptions":
				sendResponse(config);
			break;
		
			case "getInfo":
				var currentURL = sender.tab.url;
				if (currentDetailList[currentURL] !== undefined) {
					sendResponse({
						"config":config,
						"detail":currentDetailList[currentURL]
					});
				} else {
					sendResponse({
						"config":{"isCanShow":false},
						"detail":null
					});
				}
				
			break;
			
			default:
			sendResponse({});
		}
	}
);

