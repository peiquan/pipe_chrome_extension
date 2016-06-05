// Set variables
$(document).ready(function() {
	chrome.extension.sendMessage({name: "getIP"}, function(info) {
		console.log(info);
		var ip = info.details.ip;
		var isCanShow = info.isCanShow;
		if (isCanShow === true) {
			$("body").append('<div id="pipe_show" class="pipe_show_right">' + ip + '</div>');
		}
	});
		
	
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
	

});


// popup button clicked
document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.sendMessage({name: "getOptions"}, function(response) {
		$("#EnableDisableIP").val(response.enableDisableIP);
	});
	
	document.querySelector('input').addEventListener('click', function() {
		if ($('#EnableDisableIP').val() == "Disable") {
			// save to localstore
			chrome.extension.sendMessage({name: "setOptions", status: 'Enable'}, function(response) {});
			$('#EnableDisableIP').val('Enable')	
		}
		else if ($('#EnableDisableIP').val() == "Enable") {
			// save to localstore
			chrome.extension.sendMessage({name: "setOptions", status: 'Disable'}, function(response) {});
			$('#EnableDisableIP').val('Disable')
		}
	});
});
