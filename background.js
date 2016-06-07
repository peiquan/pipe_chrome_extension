var config = {
	"isCanShow":true,	// 插件是否启动，本质就是是否展示信息
	"isLeftRightAble":false	// 信息是否在左右下角移动
};
window.localStorage["config"] = JSON.stringify(config);

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
				if(request.isCanShow !== undefined){
					config.isCanShow = request.isCanShow;
				}
				if (request.isLeftRightAble !== undefined) {
					config.isLeftRightAble = request.isLeftRightAble;
				}
				window.localStorage.setItem("config",JSON.stringify(config));
				sendResponse(config);
			break;
			
			case "getOptions":
				var configTemp = JSON.parse(window.localStorage.getItem("config"));
				sendResponse(configTemp);
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

