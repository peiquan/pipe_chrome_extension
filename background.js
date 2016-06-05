var isCanShow = true;
var currentDetailList	= {};
chrome.webRequest.onCompleted.addListener(
  function(details) {
	  currentDetailList[details.url] = details;
	return;
  },
  {
	urls: ["http://*.zhiniu8.com/*","http://*.yy.com/*"],
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
				isCanShow = request.isCanShow;
				console.log('isCanShow ' + isCanShow);
				sendResponse({"isCanShow":isCanShow});
			break;
			
			case "getOptions":
				// request from the content script to get the options.
				sendResponse({
					isCanShow : isCanShow
				});
			break;
		
			case "getIP":
				var currentURL = sender.tab.url;
				console.log('isCanShow ' + isCanShow);
				if (currentDetailList[currentURL] !== undefined) {
					sendResponse({
						"isCanShow":true,
						"detail":currentDetailList[currentURL]
					});
				} else {
					sendResponse({
						"isCanShow":false,
						"detail":null
					});
				}
				
			break;
			
			default:
			sendResponse({"isCanShow":isCanShow});
		}
	}
);

