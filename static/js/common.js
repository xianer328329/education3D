var aMapVersion=1;//高德地图版本1:1.4.15,2:2.0
var moduleType = null; // 模块类型 0：首页，1：消防管控，2：车辆管控，3：门禁管控，4：报警信息，5：安防运维，6：消防 7:其他
var oMAPsrc = "";
var AuthList = [];
var Campussecurity = [];
var allCharts=[];//所有echarts图表
var fontSize=20;//字体大小
var oMaxmap=null;
var mapLatJson=null;
GetRequest();
scale(); // 页面缩放

var OHTTPC = localStorage.getItem("OHTTPC");
var OHTTP = localStorage.getItem("OHTTP");
var UNITID = localStorage.getItem('unitid');
var TOKEN = localStorage.getItem('TOKEN');
var UNITName = localStorage.getItem('UNITName');
var realAlarmConfig={};//实时告警推送配置

window.setUserdata = function(UNITIDs, UNITNames, TOKENs) {
	/**
	 * 更新数据
	 */
	window.UNITID = UNITIDs;
	window.UNITName = UNITNames;
	window.TOKEN = TOKENs;
}

function GetRequest() {
	var url = window.location.href; //获取url中"?"符后的字串
	var str = url.slice(url.indexOf("?") + 1);
	if(str.indexOf("TYPE=SHELTER") == "-1"){
		if(url.indexOf("?") && url.indexOf("?") != "-1") {
		var arr = str.split("&");
		localStorage.setItem('TOKEN',  arr[0]&&arr[0].split("=")[1]);
		localStorage.setItem('unitid', arr[1]&&arr[1].split("=")[1]);
		localStorage.setItem('UNITName', arr[2]&&decodeURI(arr[2].split("=")[1]));
		} else {
			return
		}
	}else{
		return
	}
	

}
$(function() {
	$(window).resize(scale)
	getpageAuthList()
	addAuthList(); //权限
	//GetRequest();
})

function toDub(n) {
	
	if(n < 10) {
		return '0' + n;
	} else {
		return '' + n;
	}

}
/*应急保障页面当日告警，历史告警 高度*/
function setHistoryAlarmHeight() {
	$(".Z-DayAlarmList .Z-right").each(function() {
		var oh = $(this).parent('.Z-li').height();
		$(this).css('height', oh);

	});

}
/*
 * js由毫秒数得到年月日 使用： (new Date(arg)).Format("yyyy-MM-dd hh:mm:ss.S")
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds() // 毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/*最近30天X轴日期数据整理*/
function day30DataC(data, time, data1, data2, obj) {
	var sDate = new Date();
	var eDate = new Date();
	eDate.setDate(eDate.getDate());
	sDate.setDate(sDate.getDate() - 29);
	sDate = new Date(sDate);
	for(var vdate = new Date(sDate); vdate <= eDate; vdate.setDate(vdate.getDate() + 1)) {
		var vtime = vdate.Format("yyyy-MM-dd");
		var oData1 = 0;
		var oData2 = 0;
		for(var idx = 0, len = data.length; idx < len; idx++) {
			if(vtime == data[idx][time]) {
				oData1 = data[idx][data1];
				oData2 = data[idx][data2];
				break;
			}
		}
		obj.oxAxis.push(vdate.Format("MM-dd"));
		obj.data1.push(oData1);
		obj.data2.push(oData2);
	}
}

/*最近24小时X轴日期数据整理*/
function hours24DataC(data, time, data1, data2, obj) {
	var sDate = new Date();
	var eDate = new Date();
	eDate.setHours(eDate.getHours() + 1);
	sDate.setHours(sDate.getHours() - 22);
	sDate = new Date(sDate);
	for(var vdate = new Date(sDate); vdate < eDate; vdate.setHours(vdate.getHours() + 1)) {
		var vtime = vdate.Format("yyyy-MM-dd hh");
		var oData1 = 0;
		var oData2 = 0;
		for(var idx = 0, len = data.length; idx < len; idx++) {
			if(vtime == data[idx][time]) {
				oData1 = data[idx][data1];
				oData2 = data[idx][data2];
				break;
			}
		}
		obj.oxAxis.push(vdate.Format("hh") + "时");
		obj.data1.push(oData1);
		obj.data2.push(oData2);
	}
}

// 页面缩放
// function scale() {
// 	var oW = $(window).width();
// 	var oH = $(window).height();
// 	var oX = oW / 1920;
// 	var oY = oH / 1080;
// 	var oo=0.88;
// 	if(oX >= oY) {
// 		var moveX = (oW - 1920 * oY) / 2;
// 		$('.bgZoom').css('transform', 'scale(' + oY + ',' + oY + ') translateX(' + moveX + 'px) translateY(0px)');

// 	} else {
// 		var moveY = (oH - 1080 * oX) / 2
// 		$('.bgZoom').css('transform', 'scale(' + oX + ',' + oX + ') translateX(0px) translateY(' + moveY + 'px) ');
// 	}
// }
function scale() {
	var oW = $(window).width();
	var oH = $(window).height();
	var oX = oW / 1920;
	var oY = oH / 1080;
	var scale=1;
	if(oX >= oY) {
		fontSize=oY*20;
		scale=oY;		
	} else {
		fontSize=oX*20;
		scale=oX;
	}
	$('.scaleZoom:first')?$('.scaleZoom:first').css('transform', 'scale(' + scale+')'):null;
	fontSize=fontSize>20?20:fontSize;
	$('html').css('font-size', fontSize+'px');
	resizeChart();
}
// 图表重置大小
function resizeChart(){
	var existsCharts={};
	for(var index=0;index<allCharts.length;index++){
		try{
			var item=allCharts[index];
			var k=item._dom.id||item.id;
			if(existsCharts[k]==undefined){
				existsCharts[k]=index;
			}else{
				allCharts[existsCharts[k]]=item;
				allCharts.splice(index,1);
				index--;				
			}
			item.resize();	
		}catch(e){}
	}
}
/*数据初始化*/
function initData(obj) {
	if(obj || obj == 0) {
		return obj
	} else {
		return "--"
	}
}
/*秒转变天*/
function secToTime(sec) {
	try{
		if(sec > 0) {
			var day = parseInt(sec / 60 / 60 / 24);
			var hour = parseInt(sec / 60 / 60 % 24);
			var min = parseInt(sec / 60 % 60);
			var s = parseInt(sec % 60);
			sec = "";
			if(day > 0) {    
				sec = day + "天";
			}
			if(hour > 0) {    
				sec += hour + "小时";
			}
			if(min > 0) {    
				sec += parseFloat(min) + "分钟";
			}
			if(s > 0) {    
				sec += s + "秒";
			} 
		}
	}catch(e){}
	return sec
}

function BiglinkMap(result, areaData) {
	const DATA = areaData;

	//mapTop = mapTop || 10;
	//mapBottom = mapBottom || 80;
	var mapTop = 10;
	var mapBottom = 80;
	var mapDistance = 80;
	var myChart = echarts.init(document.getElementById('linkMap'));
	myChart.clear();
	myChart.showLoading();
	myChart.hideLoading();
	echarts.registerMap('重庆', result);

	var option = {
		baseOption: {
			animationDurationUpdate: 1000,
			animationEasingUpdate: 'quinticInOut',
			timeline: {
				axisType: 'category',
				//currentIndex: 3,
				autoPlay: true,
				//inverse: true,
				playInterval: 5000,
				left: 5,
				right: 572,
				bottom: 15,
				width: 800,
				currentIndex: 2,
				label: {
					normal: {
						textStyle: {
							color: '#cccfd2',
							fontSize: 22
						}
					},
					emphasis: {
						textStyle: {
							color: '#00ffff',
							fontSize: 22
						}
					}
				},
				symbol: 'none',
				lineStyle: {
					color: '#b5bfc6'
				},
				checkpointStyle: {
					color: 'red',
					borderColor: 'red',
					borderWidth: 1
				},
				controlStyle: {
					showNextBtn: false,
					showPrevBtn: false,
					normal: {
						color: '#b5bfc6',
						borderColor: '#b5bfc6'
					},
					emphasis: {
						color: 'red',
						borderColor: 'red'
					}
				},
				data: DATA.map(function(ele) {
					return ele.title
				})
			},

			grid: {
				width: 340,
				height: 320,
				right: 80,
				bottom: 55
			},
			xAxis: {},
			yAxis: {},
			series: [{
				id: 'map',
				type: 'map',
				mapType: '重庆',
				top: mapTop,
				bottom: mapBottom,
				left: mapDistance,
				//right:700,

				itemStyle: {
					normal: {
						label: {
							show: true,
							color: '#d5dbde'
						},
						borderColor: 'rgba(2,227,230,1)',
						areaColor: 'rgba(0,0,0,0)',
						borderWidth: 1,
						shadowBlur: 20,
						shadowColor: 'rgba(0,255,255,0.3)',
					}
				},

				data: []
			}, {
				id: 'bar',
				type: 'bar',
				barWidth: 25,
				tooltip: {
					show: false
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						textStyle: {
							color: '#ddd'
						}
					}
				},
				data: []
			}]
		},
		options: []
	}

	for(var i = 0; i < DATA.length; i++) {
		var arr = [];
		var arrmax = null;
		var arrmin = null;
		var oData = DATA[i].data;
		for(var j = 0; j < oData.length; j++) {
			arr.push(oData[j].value)
		}
		arrmax = Math.max.apply(null, arr);
		arrmin = Math.min.apply(null, arr);
		option.options.push({
			visualMap: [{
				dimension: 0,
				realtime: false,
				calculable: true,
				right: 530,
				bottom: 60,
				range: [arrmin, arrmax],
				min: arrmin,
				max: arrmax,
				text: ['高', '低'],
				textStyle: {
					color: '#fff'
				},
				inRange: {
					color: DATA[i].color,
				}
			}],
			title: {
				text: DATA[i].Yname,
				left: 971,
				bottom: 420,
				textStyle: {
					fontSize: 20,
					color: '#fff',
					fontWeight: "normal",
				}
			},

			xAxis: {
				type: 'value',
				position: 'top',
				boundaryGap: [0, 0.1],
				name: DATA[i].Xname,
				nameGap: 20,
				nameTextStyle: {
					color: "#a4a5b2",
					fontSize: 18,
				},
				axisLine: {
					show: false,
				},

				axisLabel: {
					interval: 1,
					textStyle: {
						color: "#a4a5b2",
						fontSize: 18,
						fontFamily: "DIN Medium"

					},
					formatter: function(params) {
						if(params >= 10000) {
							return params / 10000 + '万';
						} else {
							return params;
						}

					},
				},
			},

			yAxis: {
				type: 'category',
				axisLabel: {
					textStyle: {
						color: '#ddd',
						fontSize: 18,
					},
					formatter: function(params) {
						/*if(params.length>=6){
							 return  '{a|'+params+'}';
						}else if(params.length>4&&params.length<6){
							 return  '{b|'+params+'}';
						}else{
							return  '{c|'+params+'}';
							}*/

						if(params.length >= 5) {
							var a = params.substring(0, 4);
							var b = params.substring(4);
							return '{c|' + a + '\n' + b + '}';
						} else {
							return '{c|' + params + '}';
						}
					},
					rich: {
						a: {
							fontSize: 14,
						},
						b: {
							fontSize: 16,
						},
						c: {
							fontSize: 18,
						},
					}
				},
				data: DATA[i].data.map(function(ele) {
					return ele.name

				})
			},
			series: [{
				id: 'map',
				data: DATA[i].data
			}, {
				id: 'bar',
				data: DATA[i].data.map(function(ele) {
					return ele.value
				}).sort(function(a, b) {
					return a > b
				})
			}]
		})
	}
	myChart.setOption(option);
	$('#alarmTypesBtn').show();
	$('#mapBarTab').show();
	myChart.on('timelinechanged', function(timeLineIndex) {
		if(timeLineIndex.currentIndex == 2) {
			$('#alarmTypesBtn').show();
			$('#mapBarTab').show();
		} else {
			$('#alarmTypesBtn').hide();
			$('#mapBarTab').hide();
		}

	});

}

//初始化执行方法
// 开始执行权限判断
function getpageAuthList() {
	var pageAuthList = [];
	jQuery("[authName]").each(function(index, value) {
		var authName = jQuery(this).attr("authName");
		var authDesc = jQuery(this).attr("authDesc");
		pageAuthList.push({
			"authName": authName,
			"authDesc": authDesc
		});
	});

	localStorage.setItem('pageAuthList', JSON.stringify(pageAuthList))

}

function addAuthList() {
	var mes = JSON.parse(localStorage.getItem('AuthList'))
	Campussecurity = [];
	if(mes && mes.length > 0) {
		for(var i = 0; i < mes.length; i++) {
			getCampussecurity(mes[i], i)
			$("[authName]").each(function() {
				var authName = $(this).attr("authName");
				if(mes[i].authName == authName) {
					$(this).removeClass("NO_Auth");
					$(this).parent().addClass("Have_Auth");
					if(mes[i].auditStatus == "T") {
						$(this).removeClass("NO_Auth");
					} else if(mes[i].auditStatus == "N") {
						$(this).addClass("No_access");
					}
				}
			})
		}
	}

	$(".No_access .acsstype").html("--") //校园安防 联防布控未接入 数据修改

}

function NavAuthList(data) {
	var mes = JSON.parse(localStorage.getItem('AuthList'))
	for(var i = 0; i < data.length; i++) {
		data[i].Auth = true;
		if(data[i].child && data[i].child.length > 0) {
			for(var t = 0; t < data[i].child.length; t++) {
				data[i].child[t].Auth = true;
				if(mes && mes.length > 0) {
					for(var j = 0; j < mes.length; j++) {
						if(data[i].child[t].authName == mes[j].authName) {
							if(mes[j].auditStatus == "T") {
								data[i].child[t].Auth = false;
							} else {
								data[i].child[t].Auth = true;
							}
							break
						}
					}
				}
			}
		}
		if(mes && mes.length > 0) {
			for(var j = 0; j < mes.length; j++) {
				if(data[i].authName == mes[j].authName) {
					if(mes[j].auditStatus == "T") {
						data[i].Auth = false;
					} else {
						data[i].Auth = true;
					}
					break
				}
			}
		}
	}
	return data
}

function getCampussecurity(data, a) {
	var arr = ["al_campussecurity_monitor_motionDetection", "al_campussecurity_monitor_schoolControl", "al_campussecurity_monitor_videoOcclusion", "al_campussecurity_monitor_manualAlarm", "al_campussecurity_monitor_jointDefenseControl"]
	for(var i = 0; i < arr.length; i++) {
		if(data.authName == arr[i] && data.auditStatus == "T") {
			Campussecurity.push(data.authDesc)
		}
	}
	//console.log(Campussecurity)	

}

function clickshrink(oIndex, event, _this) {
	var el = event.currentTarget;
	var clas = el.classList;
	if(clas.contains('NO_Auth') == true) {
		return
	} else {
		$(".shrinkNav li").not(":eq(" + oIndex + ")").removeClass("active");
		if(clas.contains('active') == true) {
			clas.remove("active")
		} else {
			clas.add("active")
		}
		var i = !_this.showSKRINK[oIndex];
		_this.showSKRINK = [false, false, false, false];
		_this.showSKRINK.splice(oIndex, 1, i);
	}
	$(document).click(function(e) {
		var target = $(e.target);
		if(!target.is('#shrinkNav *') && !target.is('#SKRINKBox *')) {
			$(".shrinkNav li").removeClass("active");
			_this.showSKRINK = [false, false, false, false];
		}
	})
}