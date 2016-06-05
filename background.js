// get IP using webRequest
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
				// request from the content script to set the options.
				//localStorage["websiteIP_status"] = websiteIP_status;
				localStorage.setItem("websiteIP_status", request.status);
			break;
			
			case "getOptions":
				// request from the content script to get the options.
				sendResponse({
					enableDisableIP : localStorage["websiteIP_status"]
				});
			break;
		
			case "getIP":
				var currentURL = sender.tab.url;
				var isCanShow = request.status || true;
				if (currentDetailList[currentURL] !== undefined) {
					sendResponse({
						"isCanShow":isCanShow,
						"details":currentDetailList[currentURL]
					});
				} else {
					sendResponse(null);
				}
				
			break;
			
			default:
			sendResponse({});
		}
	}
);

// Add icon to URL bar
function checkForValidUrl(tabId, changeInfo, tab) {
	chrome.pageAction.show(tab.id);
};

// Listen for any changes to the URL of any tab
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Set the item in the localstorage
function setItem(key, value) {
	window.localStorage.removeItem(key);
	window.localStorage.setItem(key, value);
}

// Get the item from local storage with the specified key
function getItem(key) {
	var value;
	try {
		value = window.localStorage.getItem(key);
	}catch(e) {
		value = "null";
	}
	return value;
}
