<template>
	<div class="emergency">
	<Basic-infor></Basic-infor>
	<div class="Z-DayAlarmList flex flex-column" v-cloak id="Z-DayAlarmList">
		<div class="rightRect" :class="{btnRotate:!modelShow,btnRotateRe:modelShow}"  @click="changemodelShow">
			<div class="hienBtn" ></div>
		</div>
		<transition-group enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
			<h6 class="Z-Btitle2" v-show="modelShow" key="1">当日告警</h6>
			<div class="Z-DayAlarmUl" v-show="modelShow" key="2">
				<!--消防模块-->
				<emergency-fire :sum="fire"   class="NO_Auth" authName="al_emergency_home_alarminfo" authDesc="消防"></emergency-fire>
				<!--方舱模块-->
				<emergency-shelter :sum="shelter"  class="NO_Auth" authName="al_emergency_home_shelter" authDesc="方舱"></emergency-shelter>
				<!--安防模块-->
				<emergency-security :sum="security"  ref="security" class="NO_Auth"  authName="al_emergency_home_monitorinfo" authDesc="安防"></emergency-security>
				<!--车辆模块-->
				<emergency-traffic :sum="trafficInfo"  class="NO_Auth"  authName="al_emergency_traffic_pass_trafficinfo" authDesc="车辆"></emergency-traffic>
				<!--人脸以图搜图-->
				<searchForPictures   class="NO_Auth"  authName="al_emergency_home_monitorinfo" authDesc="人脸以图搜图"></searchForPictures>
			
				
				<!--医药高专演示需注释-->
				<!--网管工作站模块-->
				<!-- <emergency-blackbox :sum="blackbox"  class="NO_Auth"  authName="al_emergency_traffic_pass_trafficinfo" authDesc="网管"></emergency-blackbox> -->
					
				<!--<emergency-energy v-show="modelShow"></emergency-energy>-->
				<!--能源安全模块 authName="al_emergency_energy" authDesc="能源安全"-->
				<!--<emergency-lab v-show="modelShow"></emergency-lab>-->
				<!--实验室模块 authName="al_emergency_lab" authDesc="实验室"-->
				<!--医药高专演示需注释 完-->
			
				<!--<emergency-food v-show="modelShow"></emergency-food>-->
				<!--食品模块 authName="al_emergency_food" authDesc="食品"-->
				<!--<emergency-personnel></emergency-personnel>-->
				<!--人员模块-->
				<!--<emergency-schoolbus></emergency-schoolbus>-->
				<!--校车模块 authName="al_emergency_schoolbus" authDesc="校车"-->
				
			</div>
		</transition-group>
	</div>
	<!--<emergency-departmentphone ></emergency-departmentphone>-->
			<!--部门电话-->
	<div id="Popout">		
		
		<!--1级弹框-->
	</div>
</div>
</template>

<script>
	/* eslint-disable */
	import EmergencyFire from './fire/fire' //消防模块
	import EmergencyShelter from './shelter/shelter' //方舱模块
	import EmergencySecurity from './security/security' //安防	
	import EmergencyTraffic from './traffic/traffic' //车辆
	import searchForPictures from './searchForPictures/searchForPictures' //人脸以图搜图
	
	// import EmergencyEnergy from './components/energy' //能源安全
	// import EmergencyLab from './components/lab' //实验室
	// import EmergencyBlackbox from './blackBox/blackBox' //网管工作站
	// import EmergencyPersonnel from './components/personnel' //人员
	// import EmergencySchoolbus from './components/SchoolBus' //校车
	//import EmergencyFood from './components/food' //食品
	//import EmergencyDepartmentphone from './components/department' //校内应急联动部门
	import BasicInfor from './components/BasicInformation'//应急事件
	export default {
		name: 'EmergencySafeguard',
		components: {
			EmergencyShelter,
			EmergencyFire,
			EmergencySecurity,
			EmergencyTraffic,
			BasicInfor,
			searchForPictures,
			// EmergencyEnergy,
			// EmergencyLab,
			// EmergencyBlackbox,
			// EmergencyPersonnel,
			// EmergencySchoolbus,
//			EmergencyFood,
//			EmergencyPop2t,
//			EmergencyPop3imgt,
//			EmergencyPop3videot,
//			EmergencyPop3tablet,
			
		},
		data() {
			return {
				intervalid:null,//定时器
				modelShow:true,
				fire: {
					alarmTotal: "--", //告警总数
					historyUntreatedAll: "--", //告警未处理总数
					todayUntreatedEarly: "--", //当日未处理预警
					todayUntreatedFault: "--", //当日未处理故障
					todayUntreatedFire: "--", //当日未处理火警
					todayUntreatedOther: "--" //当日未处理其他
				},
				security:{
					alarmTotal:"--", //历史告警（包含当天）
					historyUntreatedAll:"--",//历史未处理（包含当天未处理）
				},
				trafficInfo:{
	                alarmTotal:"--",//历史告警（包含当天）
	                notReported:"--",//历史未处理（包含当天未处理）
	                todayUnion:"--",//联防布控
	                todaySchool:"--",//本地布控
	                todaySensitive:"--",//敏感车辆驶入
	                todayOther:"--",//高频违法驶入
	                todayLocal:"--",//校内违法车辆
	            },
	            shelter:{
	            	emerHelp:"--",//紧急求助
					deviceError:"--",//设备异常
					equeInsu:"--",//装备不足
					alarmTotal:"--",//告警总数
					noHand:"--",//未处理总数
	            },
	            blackbox:{
	            	monitor:"--",//动环监测
					offline:"--",//设备离线
					access:"--",//非法接入	
					total:"--",//总数
					untreated:"--",//未处理
				}
			}
		},
		
		methods: {
			alarmInfo() { //单日告警信息获取接口
				this.$axios.post('/home/alarmInfo')//消防接口请求
					.then(this.fireInfoSucc);
				this.$axios.post('/home/monitorInfo')//安防接口请求
					.then(this.monitorInfoSucc);
				this.$axios.post('/traffic/pass/trafficInfo')//车辆接口请求
					.then(this.trafficInfoSucc)	
				this.$axios.post('edu/home/dqueryAlarmTotal',{unitUuid:UNITID})//方舱接口请求
					.then(this.shelterSucc)		
				this.$axios.post('edu/home/zbboxTodayAlarm',{unitUuid:UNITID})//黑箱接口请求
					.then(this.boxTodayAlarmSucc)			
			},
			addJsonData (data,obj) {//循环Json加载数据
				for(var key in data) {
					if(data[key] || data[key] == "0") {
						obj[key] = data[key];
					}
				}
//				console.log(this.trafficInfo)
			},
			fireInfoSucc(res) {//消防接口接收函数
				this.addJsonData(res,this.fire)
			},
			monitorInfoSucc(res) {//安防接口接收函数
				this.security=res;
			},
			trafficInfoSucc(res) {//车辆接口接收函数
				this.addJsonData(res,this.trafficInfo)
			},
			shelterSucc(res){//方舱接口接收函数
				this.addJsonData(res,this.shelter)
			},
			boxTodayAlarmSucc(res){//黑箱接口接收函数
				this.addJsonData(res,this.blackbox)
			},
			changemodelShow(){
				this.modelShow=!this.modelShow;
				if(this.modelShow){
					$('#app').removeClass('map-emergency-big');
				}else{
					$('#app').addClass('map-emergency-big');
				}
				
				
				
			}
		},
		created: function() {
			moduleType = 0;
			oMAPsrc = "c";
			this.alarmInfo();
		},
		destroyed: function() {
			clearInterval(this.timer)
		},
		mounted: function() {
			var _this=this
			
			setHistoryAlarmHeight(); //当日告警，历史告警 高度
			this.bus.$on('changeAlarmList', function(mes) {
				_this.$axios.post('/home/monitorInfo')//安防接口请求
					.then(_this.monitorInfoSucc);
			});
			this.intervalid = setInterval(() => {
				_this.alarmInfo();
			}, 10000)
			addAuthList(AuthList)
		},
		beforeDestroy: function() {
			clearInterval(this.intervalid)
		},
		
	}
</script>

<style lang="scss">	
	.emergency .rightRect{
		position:absolute;
		top:0px;
		right:-0.75rem;
		z-index:6;
		padding-left: 1rem;
		cursor: pointer;
		animation-fill-mode: forwards;		
		.hienBtn{	
			display: inline-block;
			width:0px;
			height:0px;
			border-top: 0.75rem solid transparent;
			border-right: 0.75rem solid transparent;
			border-left: 0.75rem solid rgba(0,255,255,0.9);
			border-bottom: 0.75rem solid transparent;
		}
	}
	.btnRotate{	
		animation:btnrotate 1.5s 1;
	}
	.btnRotateRe{
		animation:btnrotatere 1.5s 1;
	}
	
	@keyframes  btnrotate{
		from{
			transform: rotate(0deg);
		}
		to{
			transform: rotate(180deg);
		}
	}
	@keyframes  btnrotatere{
		from{
			transform: rotate(180deg);
		}
		to{
			transform: rotate(0deg);
		}
	}
	.emergency .delay-0-25s {
    -webkit-animation-delay: 0.25s;
    animation-delay: 0.25s;
  	}
 	.emergency .delay-0-5s {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  } 
   .emergency .delay-0-75s {
    -webkit-animation-delay: 0.75s;
    animation-delay: 0.75s;
  	} 
  	 .emergency .delay-1-25s {
    -webkit-animation-delay: 1.25s;
    animation-delay: 1.25s;
  	} 
  	 .emergency .delay-1-5s {
    -webkit-animation-delay: 1.5s;
    animation-delay: 1.5s;
  	} 
	.Z-DayAlarmList {
		position: absolute;
		right: 1rem;
		top: 4.15rem;
		bottom: 1rem;
		min-width:2rem;
		overflow-y: auto;
		overflow-x: hidden;
		&>span{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.Z-DayAlarmUl{
			flex:1
		}
	}
	
	.Z-DayAlarmList .Z-DayAlarmUl {
		width: 24.25rem;
		margin-top: 0.3rem;
	}
	
	.Z-DayAlarmList .Z-DayAlarmUl .Z-li {
		width: 100%;
		// height:100%;
		height: auto;
		position: relative;
		margin-bottom: 0.6rem;
		background: #002238;
		border-radius: 6px;
		float:left;
		min-height: 4rem;
	}
	.el-loading-spinner .circular{
		width: 2rem !important;
		height: 2rem !important;
	}
	.el-loading-spinner .el-loading-text{
		font-size: 0.7rem !important;
	}
	.Z-DayAlarmList .Z-DayAlarmUl .Z-li:last-child {
		margin-bottom: 0px;
	}
	
	.Z-DayAlarmList .Z-DayAlarmUl .Z-li .title {
		color: #999;
		position: absolute;
		width: 1.3rem;
		left: 0.35rem;
		top: 50%;
		margin-top: -1.25rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-left {
		width: 18rem;
		padding: 0.65rem 0px 0.3rem 1.65rem;
		box-sizing: border-box;
	}
	
	.Z-DayAlarmList .Z-li .Z-left li {
		position: relative;
		cursor: pointer;
		border: 1px solid #4d5e69;
		text-align: center;
		border-radius: 6px;
		height: 2.9rem;
		margin-bottom: 0.35rem;
		margin-right: 0.2rem;
		float: left;
		overflow: hidden;
	}
	
	.Z-DayAlarmList .Z-li .Z-left li i {
		font-size: 1.2rem;
		color: #666;
		display: block;
		font-family: "Helvetica-Roman-SemiB";
		line-height: 1.65rem;
		height: 1.65rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-left li span {
		font-size: 0.9rem;
		color: #999;
		display: block;
		height: 1.3rem;
		background: rgba(153, 153, 153, 0.2);
		line-height: 1.2rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child2 li {
		width: 7.6rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child3 li {
		width: 4.95rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child4 li {
		width: 3.65rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child6 li {
		width: 5.3rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child5 li {
		width: 4.95rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child5 li:nth-of-type(1) {
		width: 7.6rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-child5 li:nth-of-type(2) {
		width: 7.6rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-right {
		width: 6.75rem;
		height:auto !important;
		background: #002945;
		position: absolute;
		right: 0px;
		bottom: 0px;
		top: 0px;
	}
	
	.Z-DayAlarmList .Z-li .Z-historyAlarm {
		width: 100%;
		height: 3rem;
		text-align: center;
		position: absolute;
		left: 0px;
		top: 50%;
		margin-top: -1.5rem;
		cursor: pointer;
	}
	
	.Z-DayAlarmList .Z-li .Z-historyAlarm i {
		display: block;
		font-size: 1rem;
		color: #999;
		padding-bottom: 0.3rem;
	}
	
	.Z-DayAlarmList .Z-li .Z-historyAlarm em {
		color: #999;
		font-family: "Helvetica-Roman-SemiB";
		margin-top: 0.4rem;
		min-width:42%;
		text-align: right;
	}
	
	.Z-DayAlarmList .Z-li .Z-historyAlarm span {
		font-size: 0.8rem;
		color: #999;
		margin-top: 0.25rem;
		min-width:42%;
		margin-right: 2%;
		text-align: left;
	}
	
	.Z-DayAlarmList .Z-li .Z-historyAlarm h5 {
		font-size: 0.9rem;
		color: #999;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-left .Z-red {
		border-color: #cc1010;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-left .Z-red i {
		color: #cc1010;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-left .Z-red span {
		color: #fff;
		background: #cc1010;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-left .Z-orange {
		border-color: #ec7a00;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-left .Z-orange i {
		color: #ec7a00;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-left .Z-orange span {
		color: #fff;
		background: #ec7a00;
	}
	
	.flushDom:after {
		width: 100%;
		height: 100%;
		content: "";
		position: absolute;
		top: 0px;
		left: -35px;
		background: url(../../../static/images/sm.png) no-repeat left;
		background-size: 35px 100%;
		animation: flush 10s linear infinite;
		-webkit-backface-visibility: hidden;
		-ms-backface-visibility: hidden;
		-webkit-transform-style: preserve-3d;
		-ms-transform-style: preserve-3d
	}
	
	@keyframes flush {
		0% {
			transform: translate(0, 0);
			-ms-transform: translate(0, 0);
		}
		80% {
			transform: translate(130%, 0);
			-ms-transform: translate(130%, 0);
		}
		100% {
			transform: translate(130%, 0);
			-ms-transform: translate(130%, 0);
		}
	}
	/*已连接*/
	
	.Z-PutThrough h6 {
		color: #74d4ff !important;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-historyAlarm i {
		background: url(../../../static/images/img4.png) no-repeat bottom;
		background-size: 95%;
		color: #008893;
	}
	
	.Z-DayAlarmList .Z-PutThrough .Z-historyAlarm * {
		color: #008893 !important;
	}
	/*无权限*/
	
	.Z-DayAlarmList .Z-NoAccess {
		border-color: #484848;
		position: relative;
	}
	
	.Z-DayAlarmList .Z-NoAccess * {
		font-size: 18px !important;
		color: #999 !important;
	}
	
	.Z-DayAlarmList .Z-NoAccessStyle {
		width: 100%;
		height: 100%;
		background: rgba(17, 17, 17, 0.6);
		display: block;
		position: absolute;
		top: 0px;
		left: 0px;
		font-size: 18px;
	}
	
	.Z-DayAlarmList .Z-NoAccessStyle big {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -12px;
		margin-left: -27px;
	}
	/*未开通*/
	
	.Z-DayAlarmList .Z-NoOpened {
		position: relative;
	}
	
	.Z-DayAlarmList .Z-NoOpened * {
		font-size: 18px !important;
		color: #999 !important;
	}
	
	.Z-DayAlarmList .Z-NoOpenedStyle {
		text-align: center;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
		color: #ccc;
		font-size: 18px;
		padding-top: 12%;
		box-sizing: border-box;
		background: url(../../../static/images/weikaitong.png) no-repeat center 26% rgba(17, 17, 17, 0.6);
		z-index: 1;
	}
	
	.Z-DayAlarmList .Z-NoOpenedStyle big {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 4px;
		margin-left: -27px;
	}
	
	
	// 弹窗样式
	.rightModal .QueryParameters{
		padding-left: 0px; 
		margin-top: 0px;
		margin-bottom: 0.5rem;
	}
	/*地图弹窗*/
	.emergency-modal{
		&.border{
			.el-dialog{
				border:1px solid rgba(198,82,62,1);
			}
		}
		.el-dialog,.el-dialog__body{
			background: #171E32 !important;
		}
	}
	.rightModal.el-dialog__wrapper{
		position: fixed;
		top:9rem !important;
		right: 1rem;
		left: auto;
		bottom:auto !important;
		overflow: visible !important;
		.el-table__body-wrapper,.el-table{
			overflow: visible !important;
		}
		.el-dialog__headerbtn{
			overflow: visible;
		}
		.el-pagination{
			text-align: right;
			margin-top: 0.5rem;
		}
		.el-dialog{
			margin-top: 0px !important;
			border: 1px solid #38c1ff;
			background: #002037 !important;
			margin-bottom:0px;
			min-width: 820px;
			.el-dialog__header{
				text-align: left;
				background: transparent !important;
				.el-dialog__headerbtn{
					top: 0.5rem;
				}
				i{
					font-size: 1.1rem;
				}
			}
			.el-dialog__body{
				padding-top: 0px !important;
				background: #002037 !important;
				.table-box,.el-table__body-wrapper{
					background: #002037 !important;
				}
				.el-table__body, .el-table__footer, .el-table__header{
					background: transparent !important;
				}
				.el-table{
					.el-table__empty-text{
						color: #CCCCCC !important;
					}
					thead{
						tr{
							background: #004E81 !important;
							th{
								padding: 0.35rem 0px;
								background: #004E81 !important;
								border-color: #004E81 !important;
								.cell{
									color: #75CBF2 !important;
									font-size: 0.75rem;
								}
							}
						}
					}
					tbody{
						tr{
							background: #052D48 !important;
							cursor: pointer;
							&.current-row,&.el-table__row--striped.current-row{
								td{
									background-color:#003b62 !important;
								}
							}
							.cell{
								color: #75CBF2 !important;
								line-height: 1.1rem;
								overflow: visible;
								&,*{
									font-size: 0.8rem;
								}
								&.el-tooltip{
									overflow: hidden;
								}
								.button{
									display: inline-block;
									padding: 2px 0.75rem;
									color: white;
									border-radius: 3px;
									line-height: 1rem;
									text-align: center;
									background: transparent;
								}
							}
							td{
								padding: 0.45rem 0px;
								border-color: #4C5365 !important;
							}
							&.el-table__row--striped td{
								background: #073452 !important;
							}
							&:hover td{
								background:#003b62 !important;
							}
							.home_icon_c{
								height: 1rem;
								overflow: visible;
								margin-top: -0.25rem;
							}
							.home_icon{
								display: inline-block;
								width: 1.5rem;
								height: 1.5rem;
								background-position:center;
								background-repeat:no-repeat;
								background-size:1.5rem 1.5rem;
							}
					
							.text_icon{
								display: inline-block;
								height: 1.5rem;
								background-position:left center;
								background-repeat:no-repeat;
								background-size: 1.5rem  1.5rem;
								padding-left:  1.5rem 1.5rem;
								line-height:  1.5rem;
								margin-top: -0.25rem;
								margin-bottom: -0.25rem;
							}
							a{
								color: #7F9DE1;
							}
							.dropdown_list_c{
								height:1.5rem; 
								margin-bottom: -0.45rem;
							}
						}
					}
				}
			
			}
		}
	}
	
</style>