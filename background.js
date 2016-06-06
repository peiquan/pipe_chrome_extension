var isCanShow = true;
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
				isCanShow = request.isCanShow;
				sendResponse({"isCanShow":isCanShow});
			break;
			
			case "getOptions":
				sendResponse({
					isCanShow : isCanShow
				});
			break;
		
			case "getInfo":
				var currentURL = sender.tab.url;
				if (currentDetailList[currentURL] !== undefined) {
					sendResponse({
						"isCanShow":isCanShow,
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
			sendResponse({});
		}
	}
);

