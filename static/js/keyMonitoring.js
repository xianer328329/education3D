/* 公共变量 */
var gWndId = 0; //固定值
var bLogin = 0; //登录回执状态码
var nWndCount = 1; //设置窗口数量
var platformType = 1; //默认初始化化海康平台
var IP = ""; //视频服务器Ip地址
var port = ""; //端口号
var UserName = ""; //视频系统用户名
var Password = ""; //视频系统登录密码
var URL = "";
var MLoginPlat = function() {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "post",
		url: OHTTP + "home/getPlatform/" + UNITID,
		success: function(data) {
			var datas = eval('(' + data + ')')
			if(datas.code == 200) {
				let data = datas.data;
				IP = data.videoPlatformIp; //视频服务器Ip地址
				port = data.videoPlatformPort; //端口号
				UserName = data.videoPlatformName; //视频系统用户名
				Password = data.videoPlatformPassword; //视频系统登录密码
				platformType = data.videoPlatformType;
				var div = document.getElementById("vlcVideo");
				var classid = "clsid:BE020CC9-521F-4641-85E1-3B631B7ADDD9";
				var width = "100%";
				var height = "100%";
				var name = "preview6";
				var ipname = "IP";
				var pname = "UserName";
				var PrivilegeCode = "PrivilegeCode";
				var val = "0401,0402,";
				if(platformType == 1) { //海康控件
					div.innerHTML = '<object classid="' + classid + '" name="' + name + '" width="' + width + '" height="' + height + '"><PARAM NAME="' + ipname + '" VALUE="' + IP + '"/><PARAM  NAME="' + pname + '" VALUE="' + UserName + '"/><PARAM  NAME="' + PrivilegeCode + '" VALUE="' + val + '"/></object>';
					var v = "<?xml version=\"1.0\" encoding=\"utf-8\"?><LoginInfo><LoginType>2</LoginType><SynLogin>1</SynLogin><IP>" + IP + "</IP><Port>" + port +
						"</Port><UserName>" + UserName + "</UserName><Password>" + Password + "</Password></LoginInfo>";
					try {
						var v1 = preview6.LoginPlat(v);
						MsetLayout();
						setToolVisible();
					} catch(e) {

					}
				}
				if(platformType == 3) {
					//宇视控件

				}
				if(platformType == 2) { //大华控件
					var codebase = "DpsdkOcx.cab#version=1.0.0.0";
					var classid2 = "CLSID:D3E383B6-765D-448D-9476-DFD8B499926D";
					var ids = "DPSDK_OCX";
					var codebase = "codebase";
					div.innerHTML = '<object id="' + ids + '"classid="' + classid2 + '"style="width:' + width + '; height:' + height + '"codebase="' + codebase + '"></object>';
					try {
						var obj = new ActiveXObject("DPSDK_OCX.DPSDK_OCXCtrl.1");
					} catch(e) {
						//alert("控件未注册，请先注册控件！");
						//return;
					}
					var obj = document.getElementById("DPSDK_OCX");
					gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100);
					obj.DPSDK_SetWndCount(gWndId, nWndCount);
					obj.DPSDK_SetSelWnd(gWndId, 0);
					var nRet = obj.DPSDK_Login(IP, port, UserName, Password);
				}

			}

		},
		error: function() {}
	});

}
/*播放默认重点监控视频*/
var MplayFirstV = function(id) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "/fire/fire/listVedioUrl",
		data: {
			partId: id
		},
		success: function(data) {
			var datas = eval('(' + data + ')')
			var data = datas.data;
			if(data) {
				var len = data.length;
				$('#Z-numberf').html(len);
				var Code = data[0];
				if(platformType == 1) {
					MaddVlc(Code);
				}

				if(platformType == 2) {
					var obj = document.getElementById("DPSDK_OCX");
					var nStreamType = "1"; //1：主码流 2：副码流
					var nMediaType = "1"; //1：视频  2：音频 3：视频+音频
					var nTransType = "1"; //1：tcp 2：UDP
					var szCameraId = Code;
					var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
					var net = obj.DPSDK_StartRealplayByWndNo(gWndId, nWndNo,
						szCameraId, nStreamType, nMediaType, nTransType);
					if(net) {}

				}
				if(platformType == 3) {
					/*					var div = document.getElementById("vlcVideo");
										URL = Code;
										var srt = "<iframe id='ifrname' width='100%' height='100%' frameborder='none' src='" + URL + "'></iframe>";
										div.innerHTML = srt;*/

					var play = $('#vlcVideo');
					var urlV = Code;
					if(urlV) {
						var srt = "<iframe id='Unviframe' width='100%' height='100%' frameborder='none' src='" + urlV + "'></iframe>";
						play.eq(0).html(srt);
					}
				}

				MclickChangeV(len, data)
			}

		},
		error: function() {}
	})
}

function startPlay() {
	// oUnv.startPlay(oUnv.szCamCode);
}

var MaddVlc = function(urlV) {
	if(platformType == 1) {
		var _param1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Preview><CamIndexCode>" + urlV + "</CamIndexCode></Preview>";
		preview6.StartPreview(_param1);
	}
	if(platformType == 2) {
		var obj = document.getElementById("DPSDK_OCX");
		var nRet = obj.DPSDK_StartRealplayByWndNo(gWndId, nWndNo,
			urlV, nStreamType, nMediaType, nTransType);
	}
	if(platformType == 3) {
		$("#vlcVideo iframe").attr("src", urlV)
	}

}
//设置布局
var MsetLayout = function() {
	preview6.MsetLayoutType(1);
}

//隐藏工具栏
var MsetToolVisible = function() {
	preview6.SetMainToolBarShow(0);
}

//重点监控导航栏

var Mtabulate = function() {
	$('#Z-tabulate').not($('.monitorTitle')).on('click', 'p', function() {
		$('#Z-tabulate li').removeClass('Z-on');
		$(this).parent('li').addClass('Z-on');
		var oid = $(this).parent('li').attr('oid');
		MlistVedioUrl(oid);
	})

}
//重点监测导航栏添加/删除视频
var MaddVideo = function() {
	$('#addVideo').on('click', function() {
		$('.Z-addVideopop').slideUp();
		$('#Z-addVideopop').slideDown();
		$('.Z-videoType h6').html('监控总览');
		$('#seekInt').val("");

	})
	$('.Z-slideUp').on('click', function() {
		$('.Z-videoTypeList').slideUp();
		$('.Z-addVideopop').slideUp();
		$('#seekInt').val("");

	})
	$('#addNamebtn').on('click', function() {
		MaddMonitoringType();
	})
	$('.Z-videoType h6').on('click', function() {
		$('.Z-videoTypeList').slideDown();
	})
	$('.Z-videoTypeList').on('click', 'li', function() {
		$(this).siblings('li').removeClass('Z-on');
		$(this).addClass('Z-on');
		$('.Z-videoTypeList').slideUp();
		$('.Z-videoType h6').html($(this).html());
		var oid = $(this).attr('oid')
		$('.Z-videoType h6').attr('oid', oid)
	})
	$('#delVideo').on('click', function() {
		$('.Z-addVideopop').slideUp();
		$('#Z-delVideopop').slideDown();

		$('.Z-videoType h6').html('监控总览');
		$('#delPartList').html("");

	})
	$('#addVideo').on('click', function() {
		MlistAllMonitoring();
	})
	$('#addVideo2').on('click', function() {
		MaddVideoPart();
	})

	$('#delPartVedio').on('click', function() {
		MdelPartVedio();
	})
	$('.Z-delList').on('click', 'li', function() {
		$(this).toggleClass('Z-on');
	})
	$('#Z-tabulate').on('click', '.monitorTitle', function() {
		$('.Z-addVideopop').slideUp();
		$('#Z-addNamepop').slideDown();

	})
	$('#Z-tabulate').on('click', 'i', function() {
		$('.Z-addVideopop').slideUp();
		$('#Z-delNamepop').slideDown();

		var oid = $(this).parent('li').attr('oid');
		$('#delNamebtn').on('click', function() {
			MdeleteImportantPart(oid);
			$('#Z-delNamepop').slideUp();

		})

	})
}
/*重点监控分页*/
var MmListpage = function() {
	var p = 0;
	$('#pageNext').on('click', function() {
		p++;
		$('#pageLast').css('opacity', '1');
		if(p >= monitoringType.length - 1) {
			p = monitoringType.length - 1;
			$(this).css('opacity', '0.5');
		}
		$('#Z-tabulate').html(monitoringType[p].join(''));
	})
	$('#pageLast').on('click', function() {
		p--;
		$('#pageNext').css('opacity', '1');
		if(p <= 0) {
			p = 0;
			$(this).css('opacity', '0.5');
		}
		$('#Z-tabulate').html(monitoringType[p].join(''));
	})

}
/*添加监控总览类别*/

var MaddMonitoringType = function() {
	var val = $('#addNameint').val();
	if(val == "") {
		alert("请输入监控类别名称");
	} else {
		$.ajax({
			headers: {
				"token": TOKEN //此处放置请求到的用户token
			},
			type: "POST",
			url: OHTTP + "/fire/fire/addKeyPart",
			data: {
				partName: val
			},
			success: function(data) {
				var data = eval('(' + data + ')');
				if(data.code == "0") {
					$('#Z-addNamepop').slideUp();
					$('#addNameint').val("");
					var Oadd = true;
					MlistPartIdAndName(Oadd);

				}
			},
			error: function() {},
		})
	}
}
/*删除监控总览类别*/
var MdeleteImportantPart = function(id) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "/fire/fire/deleteImportantPart",
		data: {
			partId: id
		},
		success: function(data) {
			var data = eval('(' + data + ')');
			if(data.code == "0") {
				MlistPartIdAndName()
			}
		},
		error: function() {}
	})
}
/*获取本单位重点监控部位信息*/
var monitoringType = [];
var urlList = [];
var VedioPlayNum = 0;
var firstoID = "";

var MlistPartIdAndName = function(Oadd) {
	Oadd = Oadd || false;
	VedioPlayNum++;
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "fire/fire/listPartIdAndName",
		success: function(data) {
			var data = JSON.parse(data);
			data = data.data
			if(data && data.length > 0) {
				var len = data.length;
				var page = Math.ceil(len / 12);
				var str = [];
				for(var j = 0; j < page; j++) {
					monitoringType[j] = ["<li class='monitorTitle'>监控总览 </li>"];
					for(var i = j * 12; i < (j + 1) * 12; i++) {
						if(i >= len) {
							break
						}
						if(i == 0) {
							firstoID = data[i].partId;
							monitoringType[j].push("<li class='Z-on clearFix' oid='" + data[i].partId + "'><p class='fl' title='" + data[i].partName + "'>" + data[i].partName + "</p><i class='fr minus'></i></li>");
						} else {
							monitoringType[j].push("<li class='clearFix' oid='" + data[i].partId + "'><p class='fl' title='" + data[i].partName + "'>" + data[i].partName + "</p><i class='fr minus'></i></li>");
						}
						str.push("<li oid='" + data[i].partId + "'>" + data[i].partName + "</li>")
					}
				}
				if(Oadd) {
					$('#Z-tabulate').html(monitoringType[page - 1].join(''))
				} else {
					$('#Z-tabulate').html(monitoringType[0].join(''))
				}

				$('.Z-videoTypeList ul').html(str.join(''));
				MlistVedioUrl(data[0].partId);
				if(VedioPlayNum == 1) {
					MplayFirstV(data[0].partId)
				}
			} else {
				$('#Z-tabulate').html("<li class='monitorTitle'>监控总览 </li>")
			}
		},
		error: function() {},
	})
}
/*获取所有监控部位信息*/
var MlistAllMonitoring = function(name) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "fire/fire/listAllMonitoring",
		data: {
			channelName: name
		},
		success: function(data) {
			var data = eval('(' + data + ')');
			var data = data.data;
			var obj = MaddAllList(data);
			$('#addAllList').html(obj.join(''))
		},
		error: function() {}
	})
}

var MaddAllList = function(data) {
	var str = [];
	for(var i = 0; i < data.length; i++) {
		str.push("<li id='" + data[i].id + "' ourl='" + data[i].url + "' class='video" + data[i].vid + "'><p title=" + data[i].firstName + data[i].secondName + ">" + data[i].firstName + data[i].secondName + "</p></li>")
	}
	return str
}

var MvideoSeek = function() {
	$('#videoSeek').on("click", function() {
		var name = $('#seekInt').val();
		MlistAllMonitoring(name)
	})
}
/*添加重点监控部位以及其关联的视频*/
var MaddImportantPart = function(data) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "fire/fire/updateImportantPartVedio",
		data: JSON.stringify(data),
		contentType: "application/json;charset=utf-8",
		success: function(data) {
			var data = eval('(' + data + ')');
			if(data.code == "0") {
				$('#Z-addVideopop').slideUp();

				//listVedioUrl();

			}
		},
		error: function() {}
	})
}

var MaddVideoPart = function() {
	var partName = $('#partName').html();
	var partId = $('#partName').attr('oid');
	var data = [];
	if(partName == "监控总览") {
		alert('请选择添加视频类型')
	} else {
		$('#addAllList .Z-on').each(function() {
			var obj = {};
			obj.partId = partId;
			obj.vedioName = $(this).children('p').html();
			obj.videoUrl = $(this).attr('ourl');
			data.push(obj)
		})
	}
	MaddImportantPart(data);

}
/*列出指定重点监控部位关联视频*/
var MlistVedioInfo = function(id) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "fire/fire/listVedioInfo",
		data: {
			partId: id
		},
		success: function(data) {
			var data = eval('(' + data + ')');
			if(data.code == "0") {
				var data = data.data;
				var str = [];
				for(var i = 0; i < data.length; i++) {
					str.push("<li id='" + data[i].video_id + "'><p>" + data[i].vedio_name + "</p></li>")
				}

				$('#delPartList').html(str.join(''))
			}
		},
		error: function() {}
	})
}

var MdelPartList = function() {
	$('#delvideoType').on('click', 'li', function() {
		var oid = $(this).attr('oid');
		MlistVedioInfo(oid)
	})
}
/*删除重点监控部位关联的视频*/
var MdeleteImportantPartVedio = function(args) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + 'fire/deleteImportantPartVedio',
		dataType: 'json',
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify(args),
		success: function(data) {
			if(data.status == "1000") {
				$('#Z-delVideopop').slideUp();

			}
		},
		error: function() {}
	})
}

var MdelPartVedio = function() {
	var args = [];
	$('#delPartList .Z-on').each(function() {
		args.push($(this).attr('id'))
	})
	if(args.length > 0) {
		$('#Z-delNamepop').slideDown();
		$('#delNamebtn').on('click', function() {
			$('#Z-delNamepop').slideUp();
			$('#Z-delVideopop').slideUp();
			MdeleteImportantPartVedio(args)
		})
	} else {
		alert('请选择需要删除视频')
	}

}

/*重点监控视频获取*/
var MlistVedioUrl = function(id) {
	$.ajax({
		headers: {
			"token": TOKEN //此处放置请求到的用户token
		},
		type: "POST",
		url: OHTTP + "/fire/fire/listVedioUrl",
		data: {
			partId: id
		},
		success: function(data) {
			var data = eval('(' + data + ')')
			if(data.code == "0") {
				var data = data.data;
				if(data) {
					var len = data.length;
					$('#Z-numberf').html(len);
					MclickChangeV(len, data);
				}
			}
		},
		error: function() {}

	})
}

var MclickChangeV = function(len, data) {
	var i = 0;
	if(len == 0 || len == 1) {
		$('#Z-last').css('opacity', '0.5');
		$('#Z-next').css('opacity', '0.5');
		$('#Z-next').unbind("click");
		$('#Z-last').unbind("click");
	} else if(len > 1) {
		$('#Z-next').click(function() {
				i++;
				$('#Z-last').css('opacity', '1');
				if(i >= len - 1) {
					i = len - 1;
					$(this).css('opacity', '0.5');
				}
				MaddVlc(data[i])
			}
		);
		$('#Z-last').click(function() {
				i--;
				$('#Z-next').css('opacity', '1');
				if(i <= 0) {
					i = 0;
					$(this).css('opacity', '0.5');
				}
				MaddVlc(data[i])
			}
		);

	}

}

var MpartNameClick = function() {
	$('.Z-videoTypeList').on('click', 'li', function() {
		var id = $(this).attr('oid');
		$.ajax({
			headers: {
				"token": TOKEN //此处放置请求到的用户token
			},
			type: "POST",
			url: OHTTP + "fire/fire/listVedioInfo",
			data: {
				partId: id
			},
			success: function(data) {
				if(data.status == "1000") {
					var data = data.data;
					$('.Z-delList li').each(function() {
						var oclass = $(this).attr("class");
						var oThis = $(this);
						oThis.removeClass('Z-on');
						for(var i = 0; i < data.length; i++) {
							if(oclass == 'video' + data[i].video_id) {
								oThis.addClass('Z-on');
							}
						}
					})
				}
			},
			error: function() {}
		})

	})

}