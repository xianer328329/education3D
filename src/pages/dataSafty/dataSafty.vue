<template>
	<div class="module h-CLEFT-self">
		<div class="section-left half-left">
			<back-box class="visible">
				<alarmInfo></alarmInfo>
			</back-box>
			<back-box class="border-anim">
				<blackBox></blackBox>
			</back-box>
		</div>
		<div class="section-bottom">
			<back-box class="visible">
				<alarmAna></alarmAna>
			</back-box>
		</div>
	</div>
</template>

<script>
	import alarmInfo from './components/alarmInfo';
	import blackBox from './components/blackBox';
	import alarmAna from './components/alarmAna.vue';
	export default {
		name: '',
		components: {//引入模块
			alarmInfo,//告警信息
			blackBox,//黑箱
			alarmAna,//告警分析
		},
		mounted: function() {
			var vm=this;
			this.openWebsocket();
//			setTimeout(function(){
//				vm.handleSocket();
//			},10000)
		},
		methods:{
			openWebsocket(){
				var vm=this;
				if(window.ws){
					ws.close();
				}
//				var http='http://192.168.0.134:9090/';
				var http=process.env.API_BLACKBOX;
				var WS = http.slice(http.indexOf(":"));
				// 判断当前浏览器是否支持WebSocket
				if ('WebSocket' in window) {
					if(http.indexOf('https')>-1){
						var webSocket = new WebSocket("wss" + WS + "websocket/bbox/"+UNITID+"?token="+TOKEN);
					}else{
						var webSocket = new WebSocket("ws" + WS + "websocket/bbox/"+UNITID+"?token="+TOKEN);
					}
					window.ws=webSocket;
				} else {
					alert('当前浏览器不支持webSocket');
					return;
				}
				// 连接发生错误的回调方法
				ws.onerror = function() {
					console.log("连接发生错误");
				};
				// 连接成功建立的回调方法
				ws.onopen = function(event) {
					console.log("连接成功");
				}
				// 接收到消息的回调方法
				ws.onmessage = function(e) {
//					console.log(e.data)
					if(e.data) {
						var data = JSON.parse(e.data);	
						vm.handleSocket(data);
					}
				}// 连接关闭的回调方法
				ws.onclose = function() {
					console.log('连接关闭')
				}
				// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
				window.onbeforeunload = function() {
					ws.close();
				}
		},
		//处理实时告警
		handleSocket(data){
			var vm=this;
			try {
//				var data = {
//					"deviceUuid": "12365446",
//					"deviceName": "学生A公寓 1号井 2层",
//					"alarmTime": "2019-11-06 11:06:00",
//					"alarmDesc": "柜门超时未关闭",
//					"unituuid": "3645",
//					"buildname": "艺术楼",
//					"floorName": "艺术楼",
//					"devicecode": "FF565",
//					"lng": "106.57937545435257",
//					"lat": "29.50764851119978",
//					"uuid": "3645",
//					"alarmType": "1",
//					"alarmClass": "0"
//				}
				//alarmType 报警类型：1：告警，2：预警
				//alarmClass 告警分类(0动环监测1非法接入|2设备离线|3巡检巡查)
				vm.showMapInfoBox(data);				
			}catch(e){
				
			}
		},
		showMapInfoBox(data){
			var vm=this;
			var row = {
				"alarmType": 'blackBox',
				"alarmTime": data.alarmTime,
				"latitude": data.lat,
				"alarmTypeName": "",
				"devicePosition":(data.buildname||data.floorName)?((data.buildname||'')+(data.floorName||'')):'暂无告警位置',
				"alarmDesc":data.alarmDesc,
				"longitude": data.lng,
				buildName:data.buildname,
				"deviceCode": data.devicecode,
				"uuid": data.uuid,//告警id
			}
			if(data.alarmClass==0){
				row.alarmTypeName='动环监测'
			}else if(data.alarmClass==1){
				row.alarmTypeName='非法接入'
			}else if(data.alarmClass==2){
				row.alarmTypeName='设备离线'
			}else{
				row.alarmTypeName='巡检巡查'
			}
			vm.bus.$emit('checkBoxAlarm',row);
			vm.bus.$emit('refreshAlarm');
		},
		closeSocket(){
			ws.close();
		}
	   }
	}
</script>

<style>
	/*.amap-container,.amap-layers,.amap-maps,.amap-drags{
		overflow: visible !important;
	}*/
</style>