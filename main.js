var config;
$(document).ready(function() {
	chrome.extension.sendMessage({name: "getInfo"}, function(info) {
		// console.log(info);
		if (info == undefined) {return;}
		if (info.config == undefined) {return;}
		config = info.config;
		// console.log(config);
		var isCanShow = info.config.isCanShow;
		if (isCanShow == true) {
			var ip = info.detail.ip;
			var headerObj = {};
			var headerArray = info.detail.responseHeaders;
			for(var i = 0,len = headerArray.length;i < len;i++){
				headerObj[headerArray[i].name] = headerArray[i].value;
			}
			// console.log(headerObj);
			var t = "";
			if (headerObj.pipe_log_timestamp == undefined) {
				t += ip ;
			} else {
				t += "<table>";
				t += "<tr>";
				if( headerObj.pipe_log_timestamp != undefined && config.isShowBackTimes) {
					t += "<td>" + headerObj.pipe_log_timestamp +  "</td>";
				}
				t += "<td>&nbsp;&nbsp;" + ip +"</tr>";
				if(headerObj.pipe_front_times != undefined && config.isShowBackTimes ){
					t += "<tr><td>" + info.detail.url + "</td><td>" + headerObj.pipe_front_times +" ms</tr>";
				}	
				if(headerObj.pipe_back_times != undefined && config.isShowBackTimes ){
					var backTimes = eval('(' + headerObj.pipe_back_times +')');
					var backTimesArray =[];
					for(var key in backTimes){
						backTimesArray.push({"key":key,"time":backTimes[key]});	
					}
					backTimesArray.sort(backTimesSortOrder);
					for(var i = 0,len = backTimesArray.length;i<len;i++){
						t += "<tr><td>" + backTimesArray[i].key + "</td><td>";
						if (backTimesArray[i].time < 0) {
							if (backTimesArray[i].time == -1) {
								t += '<a target="_blank" href="http://elasticsearch-fin.yy.com/logstash-pipe-debug/logs/_search?pretty&q=pipe_log_timestamp:' + headerObj.pipe_log_timestamp +'">异常</a></tr>';	
							} else if(backTimesArray[i].time == -2){
								t += "5s超时</tr>";
							}
						} else {
							t += backTimesArray[i].time +" ms</tr>";
						}
					}
				}
				t += "</table>";
			}
			$("body").append('<div id="pipe_show" class="pipe_show_right">' + t + '</div>');
		} 

		if (config.isLeftRightAble == true) {
			$("#pipe_show").live('mouseover', function() {
				if ($(this).hasClass('pipe_show_right')) {
					$(this).removeClass("pipe_show_right");
					$(this).addClass("pipe_show_left");
				}
				else {
					$(this).removeClass("pipe_show_left");
					$(this).addClass("pipe_show_right");
				}
			});
		}
	});
	loadOptions(); //To set default value on pop-up button
		
});

function backTimesSortOrder(o1,o2) {
	return o2.time - o1.time;
}

function loadOptions() {
	chrome.extension.sendMessage({name: "getOptions"}, function(response) {
		var configTemp = response;
		if (typeof configTemp == 'undefined') {
			chrome.extension.sendMessage({name: "setOptions", "config":{"isCanShow":true,"isLeftRightAble":false,"isShowBackTimes":true}}, function(response) {
			});
		};
		
	});
}

// popup button clicked
document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.sendMessage({name: "getOptions"}, function(response) {
		$('input[name="isCanShow"][value=' + response.isCanShow + ']').attr('checked', 'checked');
		$('input[name="isLeftRightAble"][value=' + response.isLeftRightAble + ']').attr('checked', 'checked');
		$('input[name="isShowBackTimes"][value=' + response.isShowBackTimes + ']').attr('checked', 'checked');
		// alert("show " + response.isCanShow + " " + response.isLeftRightAble);
	});

	$(".radioItem").change(function() {
		var config = getConfig();
		chrome.extension.sendMessage({name: "setOptions", "config":config}, function(response) {
			// alert("set " + response.isCanShow + " " + response.isLeftRightAble);
		});
	});
});

function getConfig () {
	var config = {};
	var isCanShowStr = $('input[name="isCanShow"]:checked').val();
	var isLeftRightAbleStr = $('input[name="isLeftRightAble"]:checked').val();
	var isShowBackTimesStr = $('input[name="isShowBackTimes"]:checked').val();
	if (isCanShowStr == "false") {
		config.isCanShow = false;	
	} else {
		config.isCanShow = true;	
	}
	if (isLeftRightAbleStr == "false") {
		config.isLeftRightAble = false;	
	} else {
		config.isLeftRightAble = true;	
	}
	if (isShowBackTimesStr == "false") {
		config.isShowBackTimes = false;	
	} else {
		config.isShowBackTimes = true;	
	}
	return config;
}