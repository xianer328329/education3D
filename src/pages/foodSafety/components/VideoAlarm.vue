<template>
	<div class="v">
		<div class="v-video">
			<ul class="Z-VDList">
				<div v-show="isBrowser!='Chrome'" class="video-container">
					<li id="AlarmkVideo" class='hikli' v-show="isplayback==1"></li>
					<li id="backVideo" class='hikli' v-show="isplayback==2"></li>
				</div>
				<div id="hlsvideoalarm" v-show="isBrowser=='Chrome'&&chrome" class="video-container">
					<video id="videoalarm" height="275" width="485" class="video-js vjs-default-skin" controls autoplay muted preload="auto"></video>
				</div>
			</ul>
		</div>
		<div class="v-select">
			<div class="v-titel">视频告警</div>
			<div class="v-butt clearfix">
				<el-select v-model="alarmType" :clearable="true" placeholder="请选择告警类型">
					<el-option v-for="item in options" :key="item.alarmType" :label="item.alarmName" :value="item.alarmType">
					</el-option>
				</el-select>
			</div>
			<div class="v-input clearfix">
				<el-input v-model="selectdeviceName" placeholder="请输入设备位置"></el-input>
			</div>
			<div class="fl v-button clearfix">
				<el-button @click="getmoniorAlarmList(1)">查询</el-button>
			</div>
		</div>
		<div class="v-table">
			<el-table :data="moniorlist" size="mini" height="16.5rem" :border="false" @row-click="rowClick" @row-dblclick="switchvideo" :row-class-name="tableRowClassName">
				<el-table-column label="告警类别" :show-overflow-tooltip="true" prop="alarmTypeName">
					<template slot-scope="scope">
						<i class="new-type" v-if="scope.row.viewFlag==0"></i>
						<span>{{ scope.row.alarmTypeName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="设备位置" :show-overflow-tooltip="true" prop="deviceName">
				</el-table-column>
				<el-table-column label="告警时间" :show-overflow-tooltip="true" prop="alarmTime">
				</el-table-column>
				<el-table-column label="操作" :show-overflow-tooltip="true" width="80" prop="handleName">
					<template slot-scope="scope">
						<div @click.stop="opense(scope.$index, scope.row,$event)" class="ml20">
							<div class="fontzie fl">
								{{scope.row.handleName}}
							</div>
							<div class="fl">
								<img src="../../../../static/images/operation.png" class="imgselect" v-if="scope.row.handleStatus !=1"></img>
							</div>
						</div>
						<div class="opendiao" v-show="scope.$index==showopen&&isopen">
							<ul>
								<li class="nextli bule" @click.stop="handelalarm(2,scope.row)">误报</li>
								<li class="nextli yell" @click.stop="handelalarm(1,scope.row)">归档</li>
							</ul>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="Z-lyPage fr clearFix">
				<img id="LYfirst_page" src="../../../../static/images/first_page.png" /> <img id="LYlast" src="../../../../static/images/last.png" />
				<p>
					第<input type="text" value="1" id="intPage">页 共<span id="SumPage">0</span>页 <i id="goPage">跳转</i>
				</p>
				<img id="Lynext" src="../../../../static/images/next.png" /><img id="LYlast_page" src="../../../../static/images/last_page.png" />
			</div>
		</div>
	</div>
</template>

<script>
	import Browser from "../../../util/IsBrowser"; //判断浏览器
	export default {
		data() {
			return {
				isplayback: 0, //1实时 2回放
				videotype: null, //当前视频平台类型：1海康 2大华 3宇视
				yushiflag: false, //宇视视频
				Dahuaflag: false, //大华视频
				Hikfalg: false, //海康视频
				paramsData: {
					videoPlatformIp: "", //视频服务器Ip地址
					videoPlatformPort: "", //端口号
					videoPlatformName: "", //视频系统用户名
					videoPlatformPassword: "", //视频系统登录密码
					videoPlatformType: "",
				},
				isBrowser: Browser(),
				options: [],
				moniorlist: [], //监控国报警列表
				alarmType: '', //告警类型
				selectdeviceName: '', //输入设备位置
				dailyAlarm: "0", //是否当日报警
				currentPage: "1", //当前页
				pageSize: '8', //数据条数
				showopen: null, //table行下标
				isopen: false, //是否显示处理监控报警
				ciclkcount: 0, //点击次数，第二次点击关闭
				temporarylist: [], //暂存table点击行数据
				cickunmber: 0,
				paramsIP: {}, //平台IP等
				bLogin: 0,
				chrome:false,

			}
		},
		mounted() {
			var _this = this;
			this.getplatformIP();
			this.paging(); //加载分页事件
			this.getalarmType(); //获取告警类型
			this.bus.$on('changehandleFun', function(mes) {
				var type = mes.type;
				_this.handelalarm(type, _this.temporarylist);
			})
		},
		methods: {
			//点击行
			rowClick(row, column, event) {
				//4：移动侦测，5：本校布控，6：联动报警（手抱+报警柱） 7：视频遮挡 ，8 云端布控'
				this.temporarylist = row; //点击行数据存入
				if(row.alarmType == 5) {
					var selfParmas = {
						title: '人脸本校布控',
						//					"butCenter": ["抓拍图片", "视频回放"],
						rows: {
							'被布控人': row.blackName,
							'人员编号': row.blackCode,
							'相似度': row.blackSimilary,
							'设备位置': row.deviceName,
							'设备编号': row.deviceCode,
						}
					}
				} else if(row.alarmType == 4) {
					var selfParmas = {
						title: '移动侦测',
						//					"butCenter": ["视频回放"],
						rows: {
							'设备位置': row.deviceName,
							'设备编号': row.deviceCode,
							'告警时间': row.alarmTime,
						}
					}
				} else {
					var selfParmas = {
						title: row.alarmTypeName,
						//					"butCenter": ["视频回放"],
						rows: {
							'设备位置': row.deviceName,
							'设备编号': row.deviceCode,
							'告警时间': row.alarmTime,
						}
					}
				}
				var params = {
					title: row.alarmTypeName,
					type: "security",
					lon: row.longitude,
					lat: row.latitude,
					index: 1,
					"handleName": row.handleName,
					rows: {}
				}
				params = Object.assign(params, selfParmas);
				this.bus.$emit('addMapPop', params)
				this.handelalarm(0, row); //去除new
			},
			opense(index, rows, event) {
				/*
				 * viewFlag 1已查看 0未查看
				 */
				if(index > 5) {
					var divcla = document.getElementsByClassName('opendiao');
					var thediv = divcla[index];
					thediv.style.top = "-50px"
					thediv.style.right = "70px"
				}
				if(rows.handleStatus != 0) {
					this.isopen = false;
				} else {
					this.showopen = index;
					this.isopen = (this.ciclkcount % 2) == 0 ? true : false;
					this.ciclkcount++;
				}

			},
			handelalarm(type, row) { //处理监控报警
				/* type
				 * 0、出去new
				 * 1、归档
				 * 2、误报
				 */
				this.isopen = false;
				this.ciclkcount = 0;
				var parasm = new FormData();
				parasm.append('alarmId', row.alarmId);
				parasm.append('handleStatus', type);
				this.$axios.post('monitor/alarmProcessing/' + UNITID, parasm).then((res) => {
					this.getmoniorAlarmList(1); //刷新数据
				})
			},
			switchvideo(row, event, column) { //双击切换视频
				var falg = this.videotype;
				if(this.isBrowser == "Chrome") {
					this.inithls(row);
				} else {
					if(falg == 1) {
						this.Hikstart(row, 2);
					}
					if(falg == 2) {
						this.Dhuavideo(row, 2);
					}
					if(falg == 3) {
						this.Unvstart(row, 2);

					}
				}

			},
			Unvstart(row, isplayback) { //默认播放宇视第一个视频
				this.isplayback = isplayback;
				var rows = row;
				var devicename = rows.deviceName;
				var Ounvsrc = "";
				var alarmdivs = document.getElementById('AlarmkVideo');
				var Unvif = document.getElementById('AlarmUnv');
				if(isplayback == 1) {
					Ounvsrc = row.playUrl;
					if(Unvif == null) {
						alarmdivs.innerHTML = "<iframe id='AlarmUnv' width='100%' height='100%' frameborder='none' src='" + Ounvsrc + "'></iframe>";
					} else {
						$("#AlarmkVideo iframe").attr("src", Ounvsrc);
					}
				} else if(isplayback == 2) {
					Ounvsrc = row.playUrl;
					var otime = (row.alarmTime).replace(/-/g, '/');
					var alarmTime = new Date(otime).getTime();
					var strStartTime = new Date(alarmTime - 15000).Format("yyyy-MM-dd hh:mm:ss");
					var strEndTime = new Date(alarmTime + 15000).Format("yyyy-MM-dd hh:mm:ss");
					var rePlay = Ounvsrc.replace(/livePlay.php/g, 'rePlay.php')
					var oUrlPlay = rePlay + "&camname=" + devicename + "&strStartTime=" + strStartTime + "&strEndTime=" + strEndTime;
					if(Unvif == null) {
						document.getElementById('backVideo').innerHTML = "<iframe id='AlarmUnv' width='100%' height='100%' frameborder='none' src='" + oUrlPlay +
							"'></iframe>";
					} else {
						$("#backVideo iframe").attr("src", oUrlPlay)
					}

				}

			},
			Dhuavideo(rows, isplayback) {
				this.isplayback = isplayback;
				var gWndId = 0;
				var rows = row;
				var szCameraId = "";
				var nStreamType = 1;
				if(isplayback == 1) {
					szCameraId = rows.playUrl; //要播放的视频ID;
					var obj = document.getElementById("ADPSDK_OCX");
					var nMediaType = 1;
					var nTransType = 1;
					var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
					var nRet = obj.DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId,
						nStreamType, nMediaType, nTransType);
					if(nRet == 0) {
						console.log("播放大华视频成功！")
					} else {
						console.log("播放大华视频失败！")
					}
				} else if(isplayback == 2) {
					szCameraId = rows.playUrl; //要播放的视频ID;
					var obj = document.getElementById("ADPSDK_OCX");
					gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100);
					var nRecordSource = 3;
					var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
					var otime = (row.alarmTime).replace(/-/g, '/');
					var alarmTime = new Date(otime).getTime();
					var nStartTime = (alarmTime - 15000) / 1000;
					var nEndTime = (alarmTime + 15000) / 1000;
					var timeend = obj.DPSDK_StartTimePlaybackByWndNo(gWndId, nWndNo, szCameraId, nRecordSource, nStartTime, nEndTime);
					if(timeend == 0) {
						console.log("回放放大华视频成功！")
					} else {
						console.log("回放大华视频失败！")
					}
				}

			},
			getalarmType() { //获取下拉选择框
				this.$axios.post('monitor/alarmType/' + UNITID).then((res) => {
					var alarmdata = res || [];
					this.options = alarmdata;
				})
			},
			getmoniorAlarmList(currentPage) { //获取数据
				this.currentPage = currentPage;
				var params = new FormData();
				params.append("alarmType", this.alarmType);
				params.append("deviceName", this.selectdeviceName);
				params.append("dailyAlarm", this.dailyAlarm);
				params.append("currentPage", this.currentPage);
				params.append("pageSize", this.pageSize);
				this.$axios.post('monitor/moniorAlarmList/' + UNITID, params).then((res) => {
					var data = res || [];
					$('#SumPage').html(Math.ceil(data.total / this.pageSize));
					var pagei = $('#intPage').val();
					if(pagei > Math.ceil(data.total / this.pageSize)) {
						$('#intPage').val(Math.ceil(data.total / this.pageSize));
					}
					this.moniorlist = data.rows;
					if(data.rows.length == 0) {
						return
					}
					if(this.isBrowser == "Chrome") {
						console.log(data.rows);
						this.inithls(data.rows[0]);
					} else {
						if(this.isplayback == 0) {
							if(this.videotype == 1) {
								//海康视频
								this.Hikstart(data.rows[0], 1);

							} else if(this.videotype == 2) {
								//大华视频
								this.Dhuavideo(data.rows[0].rows, 1);

							} else if(this.videotype == 3) {
								//宇视视频
								this.Unvstart(data.rows[0], 1);

							}
						}
					}
				})
			},
			inithls(videoObj) {
				var vm = this;
				vm.deviceM3u8 = videoObj.deviceM3u8;
				vm.chrome=true;
				var options = {};
				if(typeof(videoPlayer) != "undefined") {
					var myPlayer = videojs('videoalarm');
					myPlayer.src({
						src: vm.deviceM3u8,
						type: "application/x-mpegURL"
					});
				} else {
					var myPlayer = videojs('videoalarm');
					videojs("videoalarm", options, function onPlayerReady() {
						myPlayer.src({
							src: vm.deviceM3u8,
							type: "application/x-mpegURL"
						});
						myPlayer.play();
					});
				}

			},
			Hikstart(row, isplayback) { //初始化海康控件并播放第一个默认视频
				/* 
					type=1为实时视频 2为回放
				 */
				this.isplayback = isplayback;
				var Code = "";
				if(isplayback == 1) {
					Code = row.playUrl;
					var _paramvideo = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Preview><CamIndexCode>" + Code +
						"</CamIndexCode></Preview>";
					setTimeout(() => {
						Astarvideo.StartPreview(_paramvideo);
					}, 0);
				} else if(isplayback == 2) {
					Code = row.playUrl;
					var idx = Astarvideo.GetSelWnd();
					Astarvideo.StopPreview(idx);

					var newdate = row.alarmTime;
					newdate = Date.parse(newdate.replace(/-/g, "/"));
					var N1 = new Date(newdate - 15000).Format("yyyy-MM-dd");
					var H1 = new Date(newdate - 15000).Format("hh:mm:ss");
					var N2 = new Date(newdate + 15000).Format("yyyy-MM-dd");
					var H2 = new Date(newdate + 15000).Format("hh:mm:ss");
					var beginTime = N1 + 'T' + H1 + 'Z';
					var endTime = N2 + 'T' + H2 + 'Z';
					var _param = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" +
						"<PlaybackBasicInfo><CameraIndexCode>" + Code +
						"</CameraIndexCode>" +
						"<StoreDeviceType>0</StoreDeviceType>" + "<BeginTime>" +
						beginTime + "</BeginTime><EndTime>" + endTime +
						"</EndTime>" + "</PlaybackBasicInfo>";
					setTimeout(() => {
						var a = Avideoplayback.SetFitLayout(1 * 1); //设置窗口为1*1
						var d = Avideoplayback.SetBasicInfoEx(_param);
					}, 0)

				}
			},
			getplatformIP() { //获取平台账号密码
				this.$axios.post('/home/getPlatform/' + UNITID).then((res) => {
					this.paramsData = res;
					this.getmoniorAlarmList(1); //调取接口
					if(this.isBrowser != "Chrome") {
						this.Distinguishvideotype(res);
					}
				})
			},
			Distinguishvideotype(Platform) { //区分OCX控件类型
				var videotype = Platform.videoPlatformType;
				this.videotype = videotype;
				if(videotype == 1) { //海康
					this.initializeHik(Platform); //初始化OCX控件
				}
				if(videotype == 2) { //大华
					this.initializeDhua(Platform);
				}
				if(videotype == 3) { //宇视
					/* 宇视 使用的时 iframe标签不需要初始化 */
				}
			},
			initializeHik(Platform) {
				var IP = Platform.videoPlatformIp;
				var port = Platform.videoPlatformPort;
				var UserName = Platform.videoPlatformName;
				var Password = Platform.videoPlatformPassword;
				/* 实时视频和回放视频的控件不一样 */
				/* 初始化控件实时OCX控件 */
				var divs = document.getElementById('AlarmkVideo');
				var Hikif = document.getElementById('Astarvideo');
				if(Hikif == null) { //如果！=null，表示存在控件 不进行第二次初始化
					divs.innerHTML =
						'<object classid="clsid:BE020CC9-521F-4641-85E1-3B631B7ADDD9" id="Astarvideo" name="Astarvoid" width="100%" height="100%"><PARAM NAME="IP" VALUE="' +
						IP + '"/><PARAM  NAME="UserName" VALUE="' + UserName +
						'"/><PARAM  NAME="PrivilegeCode" VALUE="0401,0402,"/></object>';
					//填入用户名密码
					var v =
						"<?xml version=\"1.0\" encoding=\"utf-8\"?><LoginInfo><LoginType>2</LoginType><SynLogin>1</SynLogin><IP>" + IP +
						"</IP><Port>" + port +
						"</Port><UserName>" + UserName +
						"</UserName><Password>" + Password +
						"</Password></LoginInfo>";
					var v1 = Astarvideo.LoginPlat(v);
					if(v1 != 0) {
						console.log("初始化实时OCX失败!");
					} else {
						console.log("初始化shisOCX成功");
					}
				}
				/* 初始化回放控件 */
				var divs = document.getElementById('backVideo');
				var playHik = document.getElementById('Avideoplayback');
				if(playHik == null) {
					//初始化回放控件
					divs.innerHTML =
						'<object classid="clsid:88F0ADA4-0B55-49EE-BD4E-FC87AD058DEF" id="Avideoplayback"  width="100%" height="100%" name="ocx" ></object>';
					var vi =
						"<?xml version=\"1.0\" encoding=\"utf-8\"?><LoginInfo><LoginType>2</LoginType><SynLogin>1</SynLogin><IP>" + IP +
						"</IP><Port>" + port +
						"</Port><UserName>" + UserName +
						"</UserName><Password>" + Password +
						"</Password></LoginInfo>";
					//登录回放控件
					var vfalg = Avideoplayback.LoginPlat(vi);
					if(vfalg != 0) {
						console.log("初始化回放OCX失败!");
					} else {
						console.log("初始化回放OCXsecc");
					}
				}

			},

			initializeDhua(Platform) {
				var divs = document.getElementById('AlarmkVideo');
				var szIp = Platform.videoPlatformIp;
				var nPort = Platform.videoPlatformPort;
				var szUsername = Platform.videoPlatformName;
				var szPassword = Platform.videoPlatformPassword;
				var gWndId = 0; //固定值
				var bLogin = this.bLogin; //是否登录 1已登录 0 未登录
				var nWndCount = 1; //设置窗口数量
				if(bLogin == 0) { // 判断是否初始化控件
					divs.innerHTML =
						'<object id="ADPSDK_OCX" classid="CLSID:D3E383B6-765D-448D-9476-DFD8B499926D"style="width: 100%; height: 100%"codebase="DpsdkOcx.cab#version=1.0.0.0"></object>';
					try {
						var obj = new ActiveXObject("ADPSDK_OCX.DPSDK_OCXCtrl.1");
					} catch(e) {
						alert("控件未注册，请先注册控件！");
						return;
					}
					var obj = document.getElementById("ADPSDK_OCX");
					gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100);
					for(var i = 1; i <= 4; i++)
						obj.DPSDK_SetToolBtnVisible(i, false);
					obj.DPSDK_SetToolBtnVisible(7, false);
					obj.DPSDK_SetToolBtnVisible(9, false);
					obj.DPSDK_SetControlButtonShowMode(1, 0);
					obj.DPSDK_SetControlButtonShowMode(2, 0);
					obj.DPSDK_SetWndCount(gWndId, nWndCount);
					obj.DPSDK_SetSelWnd(gWndId, 0);
					var nRet = obj.DPSDK_Login(szIp, nPort, szUsername, szPassword);
					if(nRet == 0) {
						console.log("登录大华平台成功！")
						this.bLogin = 1;
					} else {
						console.log("登录大华平台失败！")
					}
				}
			},
			/*分页栏按钮事件*/
			paging() {
				var _this = this;
				/*第一页 */
				$('#LYfirst_page').on('click', function() {
					_this.currentPage = 1;
					$('#intPage').val('1')
					_this.getmoniorAlarmList(_this.currentPage);
				})
				/*最后一页*/
				$('#LYlast_page').on('click', function() {
					_this.currentPage = $('#SumPage').html();
					$('#intPage').val(_this.currentPage)
					_this.getmoniorAlarmList(_this.currentPage)
				})
				/*上一页*/
				$('#LYlast').on('click', function() {
					_this.currentPage = $('#intPage').val();
					_this.currentPage--;
					if(_this.currentPage <= 0) {
						_this.currentPage = 1;
					}
					$('#intPage').val(_this.currentPage)
					_this.getmoniorAlarmList(_this.currentPage)
				})
				/*下一页 */
				$('#Lynext').on('click', function() {
					_this.currentPage = parseInt($('#intPage').val());
					_this.currentPage++;
					var oMax = $('#SumPage').html();
					if(_this.currentPage >= oMax) {
						_this.currentPage = oMax;
					}
					$('#intPage').val(_this.currentPage);
					_this.getmoniorAlarmList(_this.currentPage)
				})
				/*跳页 */
				$('#goPage').on('click', function() {
					var a = parseInt($('#intPage').val())
					var b = $('#SumPage').html();
					if(a >= b) {
						_this.currentPage = b;
					} else {
						_this.currentPage = a;
					}
					_this.getmoniorAlarmList(_this.currentPage)
				})
			},
			tableRowClassName({ //行颜色
				row,
				rowIndex
			}) {
				if((rowIndex % 2) == 1) {
					return 'warning-row';
				} else if((rowIndex % 2) == 0) {
					return 'success-row';
				}
				return '';
			}
		},
		beforeDestroy: function() {
			var myPlayer = videojs('videoalarm')
				myPlayer.dispose();

		},

	}
</script>

<style lang="scss" scoped>
	.ml20{
		margin-left: 1rem;
	}
	.v{
		display: flex;
		flex-direction: column;
	}
	.opendiao {
		width: 71px;
		/*height: 88px;*/
		background: rgba(0, 78, 129, 1);
		position: absolute;
		border: 1px solid rgba(0, 255, 255, 1);
		border-radius: 6px;
		z-index: 1;
		margin-top: 23px;
	}
	
	.imgselect {
		display: flex;
		margin-top: 6px;
	}
	
	.new-type {
		background: url(../../../../static/images/new2.png) no-repeat center;
		position: absolute;
		top: 0px;
		left: 0px;
		width: 20px;
		height: 10px;
	}
	
	.v-table {
		width: 100%;
		margin-top: 1rem;
		margin-left: 0.25rem;
		cursor: pointer;
	}
	
	.fontzie {
		font-size: 16px;
	}
	
	.v-input {
		float: left;
	}
	
	.v-butt {
		float: left;
	}
	
	.v-titel {
		font-size: 0.9rem;
		color: rgba(117, 203, 242, 1);
		float: left;
	}
	
	.v-select {
		padding: 1rem 0px 0px 0.35rem;
	}
	
	.nextli {
		height: 20px;
		line-height: 20px;
		width: 45px;
		color: #FFFFFF;
		border-radius: 6px;
		margin: 5px 10px;
	}
	
	.bule {
		border: solid 1px rgb(0, 179, 179);
		background: rgb(0, 179, 179);
	}
	
	.yell {
		border: solid 1px #db7202;
		background: #db7202;
	}
	
	.red {
		border: solid 1px #d04a4a;
		background: #d04a4a;
	}
	
	.v-video {
		border: 1px solid rgba(74, 172, 219, 1);
		opacity: 0.5;
		flex: 1;
		.Z-VDList,#hlsvideoalarm,.video-js{
			width: 100%;
			height: 100%;
		}
		.video-container{
			width: 100%;
			height: 100%;
		}
	}
	
	.Z-lyPage * {
		font-size: 0.7rem;
		letter-spacing: 0.1rem;
	}
	
	.Z-lyPage {
		position: relative;
		bottom: 0px !important;
		right: 0px !important;
	}
	
	.Z-top3 {
		position: absolute;
	}
	
	.Z-lyPage input {
		width: 1.75rem !important;
		margin: 0 0.25rem;
	}
	
	.hikli {
		width: 100%;
		height: 100%;
	}
</style>
<style lang="scss">
	.v {
		.popper__arrow::after {
			border-bottom-color: #002037;
		}
		.el-scrollbar {
			background: #002037;
		}
		.el-select-dropdown {
			background: #002037;
			width: 5rem !important;
			border: 1px solid rgba(74, 172, 219, 1);
		}
		.el-select-dropdown__item.hover,
		.el-select-dropdown__item:hover {
			background: #002037;
		}
		.v-table {
			.el-table__empty-block {
				min-height: 14rem;
			}
			.el-table .warning-row {
				background: #001C2E;
			}
			.el-table .success-row {
				background: #00243C;
			}
			.el-table th {
				background: #014674;
				font-size: 0.9rem;
				color: rgba(117, 203, 242, 1);
			}
			.el-table td {
				padding: 0.2rem 0px;
			}
			.el-table td .cell {
				font-size: 0.8rem !important;
			}
			.el-table td span {
				font-size: 0.8rem !important;
			}
			.el-table .cell {
				padding-left:0px;
				padding-right: 0.25rem;
			}
			.select-texe {
				display: block;
				width: 4rem;
				font-size: 0.8rem;
				text-align: left;
			}
		}
		.v-button {
			height: 1.2rem;
			text-align: center;
			margin-left: 0.25rem;
			span {
				font-size: 0.9rem;
			}
			.el-button {
				border: 1px solid rgba(0, 255, 255, 1);
				padding: 0.2rem 0.6rem;
			}
			.el-button--default,
			.el-button--default:focus,
			.el-button--default:hover {
				font-size: 0.8rem;
				color: rgba(254, 254, 254, 1);
			}
		}
		.v-input {
			border: 1px solid rgba(74, 172, 219, 1);
			border-radius: 4px;
			margin-left: 0.5rem;
			.el-input__inner {
				height: 1.2rem;
				line-height: 1.2rem;
				background: #021a2c;
				width: 7rem;
				font-size: 0.8rem;
				color: rgba(153, 153, 153, 1);
				padding: 0px 0.25rem;
				text-align: center;
			}
		}
		.v-butt {
			margin-left: 0.5rem;
			.el-input {
				width: 7.5rem;
			}
			.el-input--suffix .el-input__inner {
				padding-right: 0px;
			}
			.el-input__suffix {
				padding: 0px;
			}
			.el-input__inner {
				height: 1.2rem;
				line-height: 1.2rem;
				background: #021a2c;
				width: 6.3rem;
				font-size: 0.8rem;
				color: rgba(153, 153, 153, 1);
				padding: 0px 0.25rem;
				text-align: center;
			}
			.el-input__suffix {
				background: #021a2c;
			}
			.el-input__icon {
				height: 1.2rem;
			}
			.el-select {
				border: 1px solid rgba(74, 172, 219, 1);
				border-radius: 4px;
			}
			.el-select-dropdown {}
		}
	}
</style>