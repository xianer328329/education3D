var websocket = null;
function openVoic() {
	
	var WS = OHTTP.slice(OHTTP.indexOf(":"))
	// 判断当前浏览器是否支持WebSocket
	if ('WebSocket' in window) {
		websocket = new WebSocket("ws" + WS + "websocket/3645?token=123");
	} else {
		alert('当前浏览器不支持语音功能')
	}
	// 连接发生错误的回调方法
	websocket.onerror = function() {
		console.log("连接发生错误");
	};
	// 连接成功建立的回调方法
	websocket.onopen = function(event) {
		console.log("成功");
	}
	// 接收到消息的回调方法
	websocket.onmessage = function(event) {
		if (event.data.indexOf("xiaoyuanshenghuo") != -1 || event.data.indexOf("XYSH") != -1) {
			window.location.href = "index.html#/SchoolLife";
		} else if (event.data.indexOf("shujuzonglan") != -1 || event.data.indexOf("SJZL") != -1 || event.data.indexOf("SJZN") != -1) {
			window.location.href = "index.html#/Index";
		} else if (event.data.indexOf("renyuanguankong") != -1 || event.data.indexOf("RYGK") != -1) {
			window.location.href = "index.html#/PersonnelControl";
		} else if (event.data.indexOf("xiaoyuanxiaofang") != -1 || event.data.indexOf("XYXF") != -1) {
			window.location.href = "index.html#/SchoolFire";
		} else if (event.data.indexOf("xiaoyuananfang") != -1 || event.data.indexOf("XYAF") != -1) {
			window.location.href = "index.html#/Campussecurity";
		} else if (event.data.indexOf("cheliangjianguan") != -1 || event.data.indexOf("CLJG") != -1) {
			window.location.href = "index.html#/TrafficRegulation";
		} else if (event.data.indexOf("anfangyunwei") != -1 || event.data.indexOf("AFYW") != -1) {
			window.location.href = "index.html#/SecurityMintenance";
		} else if (event.data.indexOf("xiaofangyunwei") != -1 || event.data.indexOf("XFYW") != -1) {
			window.location.href = "index.html#/FireMintenance";
		} else if (event.data.indexOf("yingjibaozhang") != -1 || event.data.indexOf("YJBZ") != -1) {
			window.location.href = "index.html#/EmergencySafeguard";
		}
	}
	// 连接关闭的回调方法
	websocket.onclose = function() {
	}
	// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	window.onbeforeunload = function() {
		websocket.close();
	}
}
// 关闭连接
function closeWebSocket() {
	websocket.close();
}
