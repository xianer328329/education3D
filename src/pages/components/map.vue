<template>
	<div class="map-container">
		<searchCamera></searchCamera>
		
		<div id="container"></div>
			
		<!-- 地图类型 -->	
		<hMapType ref="hMapType" :selectedParts.sync="selectedParts" :mapType.sync="mapType" :mold3D="mold3D"  :mapJson="mapJson" :school="school"></hMapType>
		
		<div class="Z-MAP">
			<div class="Z-MapNav">
				<transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
					<ul class="Z-mapList" v-show="show">						
						<li :title="item.title" v-for="(item,index) of ChangeList" :key="item.title" @click="chageBtnClick(item.index||index,item.title,item.type)" :class="{'Z-on':chageShow==(item.index||index)}">
							<transition enter-active-class="animated pulse">
								<img v-show="chageShow!=(item.index||index)" class="Z-MMimg"
									:src="require('../../../static/images/map/'+item.imgUrl+'.png')" alt="" />
							</transition>
							<transition enter-active-class="animated heartBeat">
								<img v-show="chageShow==(item.index||index)" class="Z-MMon"
									:src="require('../../../static/images/map/'+item.imgUrlon+'.png')" alt="" />
							</transition>
						</li>
												
						<li title="地图元素" @click="changeMapEle" :class="{'Z-on':mapEle}">
							<transition enter-active-class="animated pulse">
								<img v-show="!mapEle" class="Z-MMimg" :src="require('../../../static/images/map/mapEle.png')" alt="" />
							</transition>
							<transition enter-active-class="animated heartBeat">
								<img v-show="mapEle" class="Z-MMon" :src="require('../../../static/images/map/mapEleon.png')" alt="" />
							</transition>
						</li>
					</ul>
				</transition>
				<div class="Z-MNbtn" :class="{MNbtnActive:show}" @click="showMapNav"><img
						src="../../../static/images/map/d8_03.png" alt="导航按钮" /></div>
			</div>
			<div class="Z-FixMapL clearFix">
				<router-link to="/EmergencySafeguard">
					<div class="yjbz NO_Auth" authName="al_emergency" authDesc="应急保障">预警中心</div>
				</router-link>
				<el-dropdown placement="top" trigger="click" @command="changeSchool" v-if="schools.length>0">
					<div class="yjbz">校区切换</div>
					<el-dropdown-menu class="h-school" slot="dropdown">
						<el-dropdown-item v-for="(item,index) in schools" :class="{active:item.uuid==school.uuid}"
							:command="item" :key="index">{{item.unitName}}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<keyAreas ref="keyAreas" :oMaxmap="oMaxmap"></keyAreas>
				<!-- <div class="Z-MNbtn" :class="{voinBtn:!voicshow}" @click="openVoice" title="语音"><img src="../../../static/images/img1.png" alt="" /></div> -->
				<div class="camera Z-MNbtn NO_Auth" title="安防拓扑图" @click="showTopo(1)" authName="al_topologic_security"
					authDesc="安防拓扑图">
					<img class="Z-FMnot" src="../../../static/images/map/camera.png" alt="" />
				</div>
				<div class="camera Z-MNbtn NO_Auth" title="消防拓扑图" @click="showTopo(2)" authName="al_topologic_fire"
					authDesc="消防拓扑图">
					<img class="Z-FMnot" src="../../../static/images/map/fire.png" alt="" />
				</div>
				<div class="Z-MNbtn NO_Auth" title="学年回顾 " id="sjl" @click="yearReview" authName="al_review "authDesc="学年回顾"><img src="../../../static/images/img2.png" alt="" /></div>
				<p v-for="(item,index) of FixList" :key="item.title" :title="item.title" @click="fixBtnClick(index)">
					<transition enter-active-class="animated pulse">
						<img v-show="fixShow!=index" class="Z-FMnot" :src="require('../../../static/images/map/'+item.imgUrl+'.png')" alt="" />
					</transition>
					<transition enter-active-class="animated heartBeat">
						<img v-show="fixShow==index" class="Z-FMon" :src="require('../../../static/images/map/'+item.imgUrl+'on.png')" alt="" />
					</transition>
				</p>
			</div>
		</div>

		<div id="Popout">
			<MapMonitoring ref="mapMonitoring"></MapMonitoring>
			<emergency-pop2t @showBlackInfo="showBlackInfo"></emergency-pop2t>
			<!--2级弹框(地图)-->
			<emergency-pop3imgt></emergency-pop3imgt>
			<!--3级弹框(抓拍图片)-->
			<emergency-pop3videot></emergency-pop3videot>
			<!--3级弹框(视频回放)-->
			<emergency-pop3tablet></emergency-pop3tablet>
			<!--3级弹框(历史记录)-->
			<emergency-pop3crt ref="crt"></emergency-pop3crt>
			<!--3级弹框(crt)-->

			<!--安防拓扑图-->
			<topography ref="topography" @close="cameraShow=''"></topography>
			<!--消防拓扑图-->
			<fire-topography ref="fireTopography" @close="cameraShow=''"></fire-topography>

			<emergency-pop3BlackBox ref="blackBox"></emergency-pop3BlackBox>
			<!--3级弹框(网管工作站)-->
			<emergency-pop3BlackBoxCrt ref="blackBoxCrt"></emergency-pop3BlackBoxCrt>
			<!--3级弹框(网管工作站crt)-->
			<draw ref="draw" :icons="mapJson.oChang" @closeDraw="drawEnd"></draw>
		</div>
		<div style="display: none;">
			<ul class="drawMarker" ref="drawMarker">
				<li id="drawRanging" @click="drawStart(1)">
					<p>测距</p>
				</li>
				<li id="drawArea" @click="drawStart(2)">
					<p>面积</p>
				</li>
				<li>
					<p>电子围栏</p>
					<div class="drawdiv">
						<i><img src="../../../static/images/map/draw4.png" alt="" @click="drawStart('rectangle')" /></i>
						<i><img src="../../../static/images/map/draw5.png" alt="" @click="drawStart('circle')" /></i>
						<i><img src="../../../static/images/map/draw6.png" alt="" @click="drawStart('polygon')" /></i>
					</div>
				</li>
			</ul>

		</div>
		<port-state ref="portState"></port-state>
		<sm-inventory ref="SMinventory"></sm-inventory>
		<play-video ref="video"></play-video>
		<thermodynamic-Diagram ref="thermodynamicDiagramref" @showHeatmap="showHeatmap" @heatmapClose="heatmapClose">
		</thermodynamic-Diagram>
		<elec-Safety-Popup ref="elecSafetyPopupref"></elec-Safety-Popup>
		<elec-Safety-List ref="elecSafetyListref"></elec-Safety-List>
		<build-Dialog ref="buildDialogref"></build-Dialog>
		<realAlarmVideo ref="realAlarmVideo" :isPlayBack="true" :isSmall="isSmall"></realAlarmVideo>
		<fireEngine ref="fireEngine"></fireEngine>
		<aPerson ref="aPerson" :mapJson="mapJson" :gates.sync="gates" :shelter="shelter"></aPerson>
	</div>
</template>
<script>
	var areaPoints = [];
	var lineArr = [];
	var idex = 0;
	var sound = 0;
	import elecSafetyList from './elecSafetyList.vue' // 智能空开列表
	import elecSafetyPopup from './elecSafetyPopup.vue' //智能空开详情
	import thermodynamicDiagram from '../electricitySafety/components/thermodynamicDiagram' // 热力图
	import EmergencyPop2t from '../emergency/components/pop2trl' //告警弹框2级
	import EmergencyPop3imgt from '../emergency/components/pop3imgtrl' //告警弹框3级抓拍图片
	import EmergencyPop3videot from '../emergency/components/pop3videotrl' //告警弹框3级视频回放
	import EmergencyPop3tablet from '../emergency/components/pop3tabletrl' //告警弹框3级历史记录
	import EmergencyPop3crt from '../emergency/components/pop3crt' //crt弹窗
	import topography from './topography.vue' //安防拓扑图
	import fireTopography from './fireTopography.vue' //消防拓扑图
	import EmergencyPop3BlackBox from '../emergency/components/pop3BlackBox' //网管工作站弹窗
	import EmergencyPop3BlackBoxCrt from '../emergency/components/pop3BlackBoxCrt' //网管工作站crt弹窗

	import mapiconJson from "../../../static/mock/mapicon.js" //菜单js
	import MapMonitoring from '../../../src/pages/components/mapMonitoring.vue' //监控实时视频地图弹框
	import draw from './draw.vue' //圈显绘图

	import portState from "../../../src/pages/shelter/components/portState.vue" //方舱开门状态
	import smInventory from "../../../src/pages/shelter/components/inventory.vue" //库存装备
	import playVideo from '../../../src/pages/shelter/components/video.vue'; //方舱视频
	import buildDialog from './buildDialog.vue' // 用电安全弹窗
	import realAlarmVideo from './realAlarmVideo.vue' // 实时告警联动视频
	import fireEngine from './fireEngineModal.vue' //消防主机弹窗
	import keyAreas from './keyAreas.vue' //重点区域
	import hMapType from './mapType/mapType.vue' //地图类型
	export default {
		name: 'MapCom',
		components: {
			hMapType,
			aPerson: () => import('./aPerson.vue'), //紧急避难
			searchCamera: () => import('./searchCamera.vue'),
			MapMonitoring,
			EmergencyPop3videot,
			EmergencyPop2t,
			EmergencyPop3imgt,
			EmergencyPop3tablet,
			topography,
			fireTopography,
			EmergencyPop3crt,
			EmergencyPop3BlackBox,
			EmergencyPop3BlackBoxCrt,
			draw,
			portState,
			smInventory,
			playVideo,
			thermodynamicDiagram,
			elecSafetyPopup,
			elecSafetyList,
			buildDialog,
			realAlarmVideo,
			fireEngine,
			keyAreas
		},
		data() {
			return {
				selectedParts:[],//当前选中分区
				oMaxmap:'',
				mapEle:true,//是否显示地图元素（建筑、道路、地标等）
				gates: null, //道闸
				alarms: [], //实时告警
				heatList: [], //热力图
				heatmap: null,
				isSmall: true, //是否小屏展示联动告警
				elecSafety: {
					elecList: [],
					elecMarker: null,
				},
				interval1: null,
				interval2: null,
				box: {
					buildList: null,
					boxIcon: null
				}, //网管工作站
				shelter: {
					sheltersMarker: [],
					shelterList: null, //方舱点
					securityList: {
						staffsGroupsdot: null,
						trackArr: []
					}, //安保人员
					SMInfoWindow: null //方舱信息
				},
				builds: [], //建筑物
				Historydata: [], //历史告警
				cameraShow: '', //是否显示拓扑图
				mapType: 3, //地图模式,1普通视图，2卫星地图,3 3D视图
				mold3D: true, //是否兼容	3D模式
				rangingMouseTool: [], //测距
				areaMouseTool: [], //测面积
				schools: [], //校区
				school: {}, //当前选择校区
				show: false,
				voicshow: false, //是否开启语音功能
				chageShow: null,
				FixList: mapiconJson.FixList,
				ChangeList: mapiconJson.index,
				track: {
					markerList: [],
					polyline: null,
				},
				drawBtnShow: false,
				mapJson: {
					mapLatJson: {}, //地图中心点 经纬度
					maxmap: {},
					tileLayer: null, //地图标准图层
					satelliteLayer: null, //地图卫星图层
					roadNet: null, //地图路网
					smallpolygons: [], //地图围栏
					cluster: null, //地图聚合点  包括固定图标和变换图标
					oChangMarker: [], //地图变换点
					oplaceSearch: null, //医院搜索点
					buildingLayerAreas: [], //3D楼块颜色样式
					drawBtn: null, //测距 面积 按钮
					buildBtnmarker: [], //消防，网管工作站按钮
					fireEngineMarker: null, //消防主机marker
					oFix: [ //地图下方固定点 经纬度
						{
							type: "01",
							name: "应急避难场所",
							img: "xiaor.png", //xiaor.gif
							list: []
						},
						// {
						// 	type: "02",
						// 	name: "危险源",
						// 	img: "f1on.png",
						// 	img2: "f1two.png",
						// 	list: []
						// },
						// {
						// 	type: "03",
						// 	name: "发电组",
						// 	img: "f2on.png",
						// 	list: []
						// },
						{
							type: "04",
							name: "校医务室",
							img: "f3on.png",
							list: []
						},
						{
							type: "05",
							name: "微型消防站",
							img: "f4on.png",
							temporaryIcons: true,
							list: []
						},
						{
							type: "06",
							name: "消防控制室",
							img: "f5on.png",
							list: []
						},
						{
							type: "07",
							name: "监控控制室",
							img: "f6on.png",
							temporaryIcons: true,
							list: []
						}
					],
					oChang: [ //地图变换点
						// {
						// 	type: "52",
						// 	name: "人群分布",
						// 	img: "c1on.png",
						// 	list: []
						// },
						// {
						// 	type: "54",
						// 	name: "安保人员",
						// 	img: "c2on.png",
						// 	list: []
						// },
						{
							type: "55",
							name: "运维人员",
							img: "h1on.png",
							list: []
						},
						{
							type: "57",
							name: "抓拍设备",
							img: "c3on.png",
							img2: "c3two.png",
							temporaryIcons: true,
							list: []
						},
						{
							type: "58",
							name: "监控设备",
							img: "c4on.png",
							img2: "c4two.png",
							list: []
						},
						{
							type: "59",
							name: "存储设备",
							img: "e5on.png",
							img2: "e5two.png",
							list: []
						},
						{
							type: "60",
							name: "灭火器",
							img: "h2on.png",
							img2: "h2two.png",
							list: []
						},
						{
							type: "61",
							name: "消防栓",
							img: "c5on.png",
							img2: "c5two.png",
							list: []
						},
						{
							type: "62",
							name: "水压",
							img: "h4on.png",
							img2: "h4two.png",
							list: []
						},
						{
							type: "63",
							name: "消防水带",
							img: "h5on.png",
							list: []
						},
						{
							type: "64",
							name: "烟感",
							img: "h6on.png",
							img2: "h6two.png",
							list: []
						},
						{
							type: "65",
							name: "消防主机",
							img: "h7on.png",
							img2: "h7two.png",
							list: []
						},
						{
							type: "67",
							name: "道闸",
							img: "caron.gif",
							temporaryIcons: true,
							list: []
						},
						{
							type: "66",
							name: "门禁卡口",
							img: "e4on.png",
							list: []
						},
						{
							type: "68",
							name: "车辆分布",
							img: "e1on.png",
							list: []
						}
					]
				},
				fixShow: null,
			}
		},
		provide(){
			return{
				setmapCenter:this.setmapCenter
			}
		},
		mounted: function() {
			var vm = this;
			this.fixShow = this.mapJson.oFix.length - 1;
			this.watchLinkageVideo();
			this.getuserAgent() //判断浏览器类型
			this.getMapCenter() //获取地图中心点 缩放层级   ****************

			this.bus.$on('removePersonTrack', () => {
				this.setmapCenter();
			});

			//监听车辆轨迹方法
			this.bus.$off('getTrail').$on('getTrail', function(res) {
				var data = JSON.parse(res);
				areaPoints = [];
				if (data.type == 1) {
					vm.getTrail(data)
				}
			});
			this.bus.$off('checkBoxAlarm').$on('checkBoxAlarm', function(data) {
				vm.police(data);
			});
			this.bus.$off('setAlarmPoint').$on('setAlarmPoint', function(type, data) {
				//监听 安全用电 今日告警列表点击
				vm.$refs.elecSafetyPopupref.show(type, data, oMaxmap)
			})

			//临时需要查看视频的图标
			$('#container').on('click', '.temporaryIcons', function() {
				var oitem = JSON.parse($(this).attr('oitme'))
				console.log(oitem)
				if (mapiconJson.temporaryIcons[oitem.type + '-' + oitem.lnglat[0] + '-' + oitem.lnglat[1]]) {
					vm.bus.$emit('addpop3video', {
						temporary: true,
						deviceCode: mapiconJson.temporaryIcons[oitem.type + '-' + oitem.lnglat[0] +
							'-' + oitem.lnglat[1]]
					});
				}
			});
			$('#container').on('click', '.mapIconA61', function() { //消火栓
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.aPerson && vm.$refs.aPerson.showFire(oitme)
			});
			$('#container').on('click', '.mapIconA04', function() { //校医务室
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.aPerson && vm.$refs.aPerson.showHospital(oitme)
			});
			
			// 临时需要结束
			

			$('#container').on('click', '.mapIconA69', function() { //智能空开
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.elecSafetyListref.show('69', oitme, oMaxmap);
			});
			$('#container').on('click', '.mapIconA57', function() { //抓拍摄像头
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.mapMonitoring.getIconDeviceList("57", oitme.lnglat, oMaxmap);
			});
			$('#container').on('click', '.mapIconA67', function() { //道闸
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.mapMonitoring.getIconDeviceList("67", oitme.lnglat, oMaxmap);
			});
			$('#container').on('click', '.mapIconA58', function() { //摄像头
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.mapMonitoring.getIconDeviceList("58", oitme.lnglat, oMaxmap,oitme.searchName||'');
			});
			$('#container').on('click', '.mapIconA-10', function() { //人脸摄像机
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.mapMonitoring.getIconDeviceList("58", oitme.lnglat, oMaxmap,null,6);
			});
			$('#container').on('click', '.mapIconA06', function() { //消防监控室
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'));
				// vm.$refs.aPerson && vm.$refs.aPerson.showFireMonitorRoom(oitme)
				vm.$refs.mapMonitoring.getIconDeviceList("6", oitme.lnglat, oMaxmap);	
			});
			$('#container').on('click', '.mapIconA05', function() { //微型消防站
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'));
				vm.$refs.mapMonitoring.getIconDeviceList("5", oitme.lnglat, oMaxmap);	
			});
			
			
			
			$('#container').on('click', '.mapIconA-3', function() { //网管工作站
				if (!$(this).attr('oitme')) return;
				var oitme = JSON.parse($(this).attr('oitme'))
				vm.$refs.blackBox.handleClickBox(oitme, oMaxmap)

			});
			$('#container').on('click', '.mapIconA-2', function(e) { //网管工作站的建筑物
				vm.buildingClick(e);
			});
			$('#container').on('click', '.mapIconA-8', function(e) { //消防主机
				vm.fireEngineClick(e);
			});
		},
		methods: {
			watchLinkageVideo() { //历史火警的联动视频
				var vm = this;
				this.bus.$off('addLinkageVideo');
				this.bus.$on('addLinkageVideo', function(obj) {
					vm.isSmall = false;
					vm.$nextTick(() => {
						obj.alarmTypeName = obj.title;
						obj.devicePosition = (obj.buildName||'') + (obj.position||'');
						vm.$refs.realAlarmVideo.show(1, obj);
					})
				});
			},
			fireEngineClick(e) { //消防主机点击
				var vm = this;
				if (!$(e.currentTarget).attr('oitme')) return;
				var oitme = JSON.parse($(e.currentTarget).attr('oitme'));
				if (vm.mapJson.fireEngineMarker) {
					oMaxmap.remove(vm.mapJson.fireEngineMarker);
					vm.mapJson.fireEngineMarker = null;
				}
				this.$refs.fireEngine.show(oitme).then(content => {
					vm.mapJson.fireEngineMarker = new AMap.Marker({
						position: [oitme.longitude, oitme.latitude],
						content: content,
						offset: new AMap.Pixel(-0, 10),
						zIndex: 300,
						map: oMaxmap
					});

					$('#container').one('click', '.closeFireEngine', function() {
						oMaxmap.remove(vm.mapJson.fireEngineMarker);
						vm.mapJson.fireEngineMarker = null;
					})
				})

			},
			buildingClick(e) { //建筑物点击
				var vm = this;
				if (!$(e.currentTarget).attr('oitme')) return;
				var oitme = JSON.parse($(e.currentTarget).attr('oitme'))
				if (vm.mapJson.buildBtnmarker) {
					oMaxmap.remove(vm.mapJson.buildBtnmarker);
					$('#container').off('click', '.buildingFire');
					$('#container').off('click', '.buildingBlack');
					$('#container').off('click', '.safeElectricity');
					vm.mapJson.buildBtnmarker = []
				}
				// <p class="buildingBlack">网管工作站</p>
				var ocontent =
					'<div class="buildingsBtn"><p class="buildingFire active">消防</p><p class="safeElectricity">楼控监测</p></div>'
				let marker = new AMap.Marker({
					position: [oitme.lng, oitme.lat],
					content: ocontent,
					offset: new AMap.Pixel(-0, 10),
					zIndex: 300,
					map: oMaxmap
				});
				vm.mapJson.buildBtnmarker.push(marker);
				vm.$refs.crt.handleClickBuild(oitme, oMaxmap, vm.mapJson.buildBtnmarker);

				$('#container').on('click', '.buildingFire', function() {
					$('#container .buildingsBtn p').removeClass('active')
					$(this).addClass('active')
					vm.$refs.crt.handleClickBuild(oitme, oMaxmap, vm.mapJson.buildBtnmarker)
				})
				// $('#container').on('click', '.buildingBlack', function() {
				// 	$('#container .buildingsBtn p').removeClass('active')
				// 	$(this).addClass('active')
				// 	vm.$refs.blackBox.handleClickBuild(oitme, oMaxmap)
				// })
				$('#container').on('click', '.safeElectricity', function() {
					$('#container .buildingsBtn p').removeClass('active')
					$(this).addClass('active')
					vm.$refs.buildDialogref.handleClickBuild(oitme, oMaxmap, vm.mapJson.buildBtnmarker);
				})
			},
			heatmapClose() { // 清除热力图
				if (this.heatmap != null) {
					this.heatmap.setMap(null);
				}
				if (this.heatList.length > 0) {
					oMaxmap.remove(this.heatList);
				}
			},
			showHeatmap(data) { // 生成热力图
				var elem = document.createElement('canvas');
				var isSupportCanvas = !!(elem.getContext && elem.getContext('2d'));
				if (!isSupportCanvas) {
					return alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
				}
				this.heatmapClose();
				this.setmapCenter();
				if (data.length == 0) {
					return
				}
				var heatmap;
				oMaxmap.plugin(["AMap.Heatmap"], function() { //加载热力图插件
					heatmap = new AMap.Heatmap(oMaxmap, {
						radius: 25, //给定半径
						opacity: [0, 1],
						'3d': {
							//热度转高度的曲线控制参数，可以利用左侧的控制面板获取
							heightBezier: [0, 1.5, 0, 1],
							//取样精度，值越小，曲面效果越精细，但同时性能消耗越大
							gridSize: 2,
							heightScale: 0 //高度
						},
						gradient: {
							0.3: 'rgba(255,153,0,0.3)',
							0.4: 'rgba(255,153,0,0.4)',
							0.5: 'rgba(255,153,0,0.5)',
							0.65: 'rgba(255,153,0,0.65)',
							0.7: 'rgba(255,153,0,0.7)',
							0.9: 'rgba(255,153,0,0.9)',
							1.0: 'rgba(255,153,0,1)'
						}
					}); //在地图对象叠加热力图
					heatmap.setDataSet({
						data: data
					}); //设置热力图数据集
				});
				this.heatmap = heatmap;
				this.heatList = [];
				var ohtml =
					'<div id="warning">\
        		<div class="circle">\
        		<i class="Z-dot1"></i>\
        		<i class="Z-dot2"></i>\
        		<i class="Z-dot3"></i>\
        		</div>\
            </div>';
				data.forEach((item, index) => {
					var heat = new AMap.Marker({
						position: [item.lng, item.lat],
						content: ohtml,
						offset: new AMap.Pixel(-3, -3), //点标记显示位置偏移量
					});
					this.heatList.push(heat);
				})
				oMaxmap.add(this.heatList);
			},
			getMapCenter() { //获取地图中心点 缩放层级 *****************
				this.$axios.post("home/systemInfo")
					.then((res) => {
						var data = res;
						var zoom = 20 / (fontSize || 20);
						// zoom = zoom % 1 > 0.5 ? Math.floor(zoom) : Math.floor(zoom) - 1;
						zoom = zoom % 1 > 0.5 ? zoom : zoom - 1;
						mapLatJson = {
							bigLatitude: data.bigLatitude,
							bigLongitude: data.bigLongitude,
							bigZoom: data.bigZoom - zoom,
							uuid: data.uuid,
							unitName: data.unitName,
							isScene: data.isScene || 0
						}
						this.schools = data.campusList || [];
						this.school = mapLatJson;
						this.init();
						this.geMapIco(); //获取地图图标位置信息
						this.checkNewAlarm() //实时报警	
					})
			},
			init(mask){
				oMaxmap&&oMaxmap.destroy();
				this.mapint(mask);	
				this.getMapFence(mapLatJson.uuid,mask||null); //地图获取电子围栏
			},
			mapint(mask) { //*************
				var vm = this;
				this.mapJson.tileLayer = aMapVersion==1?new AMap.TileLayer({}):new AMap.createDefaultLayer();
				this.mapJson.satelliteLayer = new AMap.TileLayer.Satellite({});
				this.mapJson.roadNet = new AMap.TileLayer.RoadNet();
				oMaxmap = new AMap.Map("container", {
					mask:mask||null,
					resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
					rotateEnable: true,
					expandZoomRange: true,
					zooms: [3, 20],
					pitch: 60,
					mapStyle:'amap://styles/100ee6d53609129088afb0d80c99f144', //'amap://styles/c365e99a7fc23404d4007cc9359e7bde',//amap://styles/eaf90477d1fd85fa6deee4f1d4a8d15c
					labelzIndex: 137,//110
				    features: ['bg', 'point', 'road', 'building'], //设置地图上显示的元素种类支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
					//center: [mapLatJson.bigLongitude, mapLatJson.bigLatitude],
					//zoom:20,
					viewMode: "3D",
					layers: [
						vm.mapJson.tileLayer,
						vm.mapJson.satelliteLayer,
						vm.mapJson.roadNet,
					]
				});
				this.oMaxmap=oMaxmap;
				vm.mapJson.satelliteLayer.hide();
				vm.mapJson.roadNet.hide();
				AMap.plugin(['AMap.Scale'], function() { //异步同时加载多个插件
					var scale = new AMap.Scale(); //比例尺
					oMaxmap.addControl(scale);

				});
				var contents = this.$refs.drawMarker;
				this.mapJson.drawBtn = new AMap.Marker({
					content: contents,
					offset: new AMap.Pixel(-0, -0),
					zIndex: 300,
					map: oMaxmap
				});
				this.mapJson.drawBtn.hide();
				oMaxmap.on('rightclick', this.drawMarkerFun);
				oMaxmap.on('click', function() {
					vm.mapJson.drawBtn.hide();
					if (vm.mapJson.fireEngineMarker) {
						oMaxmap.remove(vm.mapJson.fireEngineMarker);
						vm.mapJson.fireEngineMarker = null;
					}
				});
			},
			showMapNav() { //显示地图导航栏   //*************
				this.chageShow = "888";
				var moduleType = localStorage.getItem('moduleType');
				if (moduleType == "Index") { //数据总览
					this.ChangeList = mapiconJson.index
				} else if (moduleType == "SchoolLife" || moduleType == "PersonnelControl") { //校园生活，人员管控
					this.ChangeList = mapiconJson.schoollife
				} else if (moduleType == "SchoolFire" || moduleType == "FireMintenance") { //校园消防，消防运维
					this.ChangeList = mapiconJson.fire
				} else if (moduleType == "TrafficRegulation") { //车辆监管
					this.ChangeList = mapiconJson.car
				} else if (moduleType == "SecurityMintenance" || moduleType == "Campussecurity") { //安防运维，校园安防
					this.ChangeList = mapiconJson.security
				} else if (moduleType == "elecSafety") { // 用电安全
					this.ChangeList = mapiconJson.elecSafety
				} else if (moduleType == "EmergencySafeguard") { //应急保障
					this.ChangeList = mapiconJson.index.concat(mapiconJson.EmergencySafeguard);
				} else if (moduleType == "DataSafty") { //数据安全
					this.ChangeList = mapiconJson.DataSafty;
				} else if (moduleType == "Shelter") { //宣教应急
					this.ChangeList = mapiconJson.Shelter;
				} else {
					this.ChangeList = []
				}
				this.show = !this.show;
			},
			//显示拓扑图
			showTopo(type) { //*****************************
				var vm = this;
				vm.cameraShow = type;
				if (type == 1) {
					vm.$refs.topography.show(type);
				} else {
					vm.$refs.fireTopography.show(type);
				}
			},
			//显示网管工作站详情
			showBlackInfo(list) {
				this.$refs.blackBox.showModal(list);
			},
			changeSchool(item) { //切换校区 ***********************
				var vm = this;
				this.school = item;
				mapLatJson = {
					bigLatitude: item.bigLatitude,
					bigLongitude: item.bigLongitude,
					bigZoom: item.bigZoom,
					uuid: item.uuid,
					unitName: item.unitName
				};

				oMaxmap.setZoomAndCenter(mapLatJson.bigZoom, [mapLatJson.bigLongitude, mapLatJson
					.bigLatitude
				]); //同时设置地图层级与中心点
				if (!this.mold3D || this.mapType != 3) {
					oMaxmap.zoomOut()
					oMaxmap.panBy(0, 120)
				}
				var contents = "<div class='markerlabel'><i>" + item.unitName + "</i></div>"
				var markerlabel = new AMap.Marker({
					position: [mapLatJson.bigLongitude, mapLatJson.bigLatitude],
					map: oMaxmap,
					content: contents,
					offset: new AMap.Pixel(-15, -15) //点标记显示位置偏移量
				});
				setTimeout(function() {
					oMaxmap.remove(markerlabel)
				}, 10000)
			},
			fixBtnClick(index) { //地图固定图标点击选中 ******************
				this.fixShow = index;
				this.chageShow = "8888";
				this.addmapFix(1, index);

			},
			chageBtnClick(index, title, type) { //地图动态图标点击选中 ****************
				var vm = this;
				this.chageShow = index;
				this.fixShow = "8888";
				this.mapJson.oChang.forEach((itme, index) => {
					if (itme.type == type) {
						vm.addmapFix(2, index)
					}
				})
				if (title == "医院") {
					this.setmapCenter();
					this.placeSearch()
				} else if (type == -1) { //建筑物
					this.box.buildList && this.box.buildList.length > 0 ? this.addmapFix(4, null) : this.getBlackBoxAndBuilds(4);
				} else if (type == -3) { //网管工作站
					this.box.boxIcon && this.box.boxIcon.length > 0 ? this.addmapFix(5, null) : this.getBlackBoxAndBuilds(5);
				} else if (type == -4) { //方舱
					this.shelter.shelterList && this.shelter.shelterList.length > 0 ? this.addShelter(this.shelter.shelterList) : this.getShelterLngLat();
				} else if (type == -5) { //校内安保  运维人员
					this.getMapElement('校内安保');
				} else if (type == -6) {
					this.getMapElement('运维人员');
				} else if (type == -7) { // 热力图
					this.$refs.thermodynamicDiagramref.show();
				} else if (type == -8) { //消防主机
					this.getFireEngine();
				} else if (type == -10) { //人脸摄像机
					this.getFaceCamera();
				}  else if (type == 69) {
					this.elecSafety.elecList && this.elecSafety.elecList.length > 0 ? this.addmapFix(69, null) : this
						.getelecSafetyLngLat(69);
				}
			},
			addmapFix(type, oindex, lists, fixed) { //地图上加载标记点  *********************
				var vm = this;
				var contents = "";
				!fixed && this.setmapCenter();
								
				this.$refs.keyAreas && this.$refs.keyAreas.remove();//移除重点区域标注
				
				var Obj = {};
				if (type == 1) {//固定图标
					Obj = vm.mapJson.oFix[oindex];
					// 如果点击的是应急避难所，添加应急避难线路
					this.$refs.aPerson && this.$refs.aPerson.addEmergencyRefugeRoute(Obj);
					var mess = "mess";
				} else if (type == 2) {
					Obj = vm.mapJson.oChang[oindex];
					var mess = "mess";
				} else if (type == 4) { //建筑物
					Obj.list = vm.box.buildList;
					Obj.img = "c11on.png";
					Obj.type = "-2";
					var lng = "lng";
					var lat = "lat";
					var mess = "buildname";
				} else if (type == 5) { //网管工作站
					Obj.list = vm.box.boxIcon;
					Obj.img = "c12on.png";
					Obj.type = "-3";
					var lng = "lng";
					var lat = "lat";
					var mess = "name";
				} else if (type == 8) { //消防主机
					Obj.list = lists;
					Obj.img = "h7on.png";
					Obj.type = "-8";
					var lng = "longitude";
					var lat = "latitude";
					var mess = "iconName";
				}else if (type == 10) { //人脸摄像机
					Obj.list = lists;
					Obj.img = "c14on.png";
					Obj.type = "-10";
					var lng = "longitude";
					var lat = "latitude";
					var mess = "deviceName";
				} else if (type == 69) {
					Obj.list = vm.elecSafety.elecList;
					Obj.img = "ele3on.png";
					Obj.type = "69";
					var lng = "longitude";
					var lat = "latitude";
					var mess = "iconName";
				}
				var markers = [],points=[];
				var oimg2 = Obj.img2 || Obj.img;
				var oclassName = "mapIconA" + Obj.type;
				var temporaryIcons = Obj.temporaryIcons ? 'temporaryIcons' : ''; //临时
				Obj.list.forEach((itme, index) => {					
					try{
						itme.lnglat=itme.lnglat||[itme[lng], itme[lat]];
						var oitme = JSON.stringify({
							type: Obj.type,
							...itme
						});
						if (Obj.type == "-2") { //建筑物
							contents = "<div class='singleBuildIcon mapIcon " + oclassName + "' oitme='" + oitme +
								"'><b class='dot'></b><i class='fontname'>" + itme.name +
								"</i></div>"
						} else {
							contents = "<div class='mapIcon " + oclassName + " " + temporaryIcons + "' oitme='" + oitme + "'><img src='../../../static/images/map/" + Obj.img +
								"' alt=''/><i class='fontname'>" + itme[mess] +
								"</i></div>"
						}
						var marker = new AMap.Marker({
							position: itme.lnglat,
							content: contents,						
							anchor:'bottom-left',
							offset: new AMap.Pixel(-15, 15),
							// offset: new AMap.Pixel(-15, -15),
							title: itme[mess],
						})
						// marker.on('click',(e)=>{
						// 	console.log(itme)
						// })
						markers.push(marker);
						points.push({lnglat: itme.lnglat})
					}catch(e){
						console.log(e)
					}
				})
				var _renderClusterMarker = function(context) {//聚合点渲染方法
					var ohtml = '<div class="mapIcon mapIcon2 ' + oclassName +
						'"><img src="../../../static/images/map/' + oimg2 +
						'" alt="" /><i class="font">' + context.count + '</i></div>'
					context.marker.setContent(ohtml)
				};
				var _renderMarker = function(context) {//非聚合点渲染方法
					context.marker.setContent(contents)
				};
				var MarkerClusterer=aMapVersion==1?markers:points;//高德v1.4.15 markers，v2.0 points
				this.mapJson.cluster = new AMap.MarkerClusterer(oMaxmap, MarkerClusterer, {
					gridSize: 60,
					maxZoom: 19,
					renderClusterMarker: _renderClusterMarker,//聚合点渲染方法
					renderMarker:_renderMarker  //非聚合点渲染方法
				});
				return this.mapJson.cluster;
			},
			//改变地图显示元素
			changeMapEle(){
				this.mapEle=!this.mapEle;
				if(this.mapEle){
					oMaxmap.setFeatures(['bg', 'point', 'road', 'building'])
				}else{
					oMaxmap.setFeatures(['bg', 'road'])
				}
			},
			getFaceCamera() { //获取人脸摄像机
				var vm = this;
				var params = {
					deviceType:'4',
					cameraType:'6'
				};
				this.$axios.post('home/getDevcieListByTwoType', params).then(function(res) {
					var data = res||[];
					vm.addmapFix(10, null, data)
				})
			},
			getFireEngine() { //获取消防主机
				var vm = this;
				var params = {};
				this.$axios.post('fire/device/iconInfo', params).then(function(res) {
					var data = res;
					vm.addmapFix(8, null, data)
				})
			},
			getBuilds() { //获取建筑物地图图标位置信息
				var vm = this;
				var params = {}; //unituuid:UNITID
				this.$axios.post('home/getAllPostionByUnitId', params).then(function(res) {
					var data = res;
					vm.builds = data;
					vm.addmapFix(4, null)
				})
			},

			getBlackBoxAndBuilds(type) { //获取网管工作站和建筑物地图图标位置信息
				var vm = this;
				var params = {
					unitUuid: UNITID
				}
				this.$axios.post('box/statistics/diconList', params).then(function(res) {
					vm.box = res || {};
					vm.addmapFix(type, null)

				})
			},

			getMapFence(uuid,mask) { //获取地图电子围栏接口请求函数    ***********************
				var _this = this;
				this.$axios.post('home/schoolMapInfo/' + uuid)
					.then((res)=>{
						this.MapFenceSucc(res,mask);
					})
			},
			MapFenceSucc(res,mask) { //获取地图电子围栏接口接收函数  **************************
				var vm = this;
				this.mapJson.smallpolygons=[];
				this.mapJson.buildingLayerAreas=[];
				var type = res.features[0].geometry.type;
				var data = res.features[0].geometry.coordinates;
				if (type == "Polygon") { //一个校区
					var obj = new AMap.Polygon({
						fillColor: '#fff',
						fillOpacity: 0.05,
						strokeColor: '#0497ac',
						strokeWeight: 2,
						map: mask?null:oMaxmap,
						//center: _this.mapCenter,
						path: data[0],
					});
					obj.on('rightclick', this.drawMarkerFun);
					obj.on('click', function() {
						vm.mapJson.drawBtn.hide();
					});
					this.mapJson.smallpolygons.push(obj);
					/*3D 楼块颜色*/
					this.mapJson.buildingLayerAreas = [{
						rejectTexture: true,
						color1: 'ff6f9cb1', //楼顶颜色
						color2: 'ff4c6c7b', //楼面颜色
						path: data[0]
					}]
				} else if (type == "MultiPolygon") { //多个校区
					for (var i = 0; i < data.length; i++) {
						if (data[i] && data[i].length > 0) {
							var obj = new AMap.Polygon({
								fillColor: '#fff',
								fillOpacity: 0.05,
								strokeColor: '#0497ac',
								strokeWeight: 2,
								map: mask?null:oMaxmap,
								//center: _this.mapCenter,
								path: data[i][0],
							});
							obj.on('rightclick', this.drawMarkerFun);
							obj.on('click', function() {
								vm.mapJson.drawBtn.hide();
							});
							this.mapJson.smallpolygons.push(obj);
							/*3D 楼块颜色*/
							if (data[i] && data[i].length > 0) {
								var obj = {
									rejectTexture: true,
									color1: 'ff6f9cb1', //楼顶颜色
									color2: 'ff4c6c7b', //楼面颜色
									path: data[i][0]
								}
								this.mapJson.buildingLayerAreas.push(obj)
							}
						}

					}
				}
				if (this.mold3D) {
					this.mapJson.buildingLayer = new AMap.Buildings({
						/*学校3D楼块*/
						zIndex: 136,
						merge: false,
						sort: false,
						zooms: [10, 20],
					});
					var options = {
						hideWithoutStyle: true, //是否隐藏设定区域外的楼块
						areas: this.mapJson.buildingLayerAreas
					};
					this.mapJson.buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle
					this.mapJson.buildingLayer.setMap(oMaxmap)
				}
				this.$refs.hMapType&&this.$refs.hMapType.switchMapType(this.mapType)
			},

			geMapIco() { //获取地图图标位置信息接口请求函数   **********************
				var _this = this;
				this.$axios.post('home/iconInfo')
					.then(function(res) {
						_this.MapIcoSucc(res)
					})
			},
			MapIcoSucc(res) { //地图图标位置信息接口接收函数  ********************
				var data = res.icon;
				var moduleType = localStorage.getItem('moduleType');
				for (var i = 0; i < data.length; i++) {
					var fType = data[i].iconType;
					var obj = {
						mess: data[i].iconName || '',
						lnglat: [data[i].longitude, data[i].latitude]
					};
					this.mapJson.oFix.some(function(v) {
						if (v.type == fType) {
							v.list.push(obj);
							return true;
						}
					});
					this.mapJson.oChang.some(function(v) {
						if (v.type == fType) {
							v.list.push(obj);
							return true;
						}
					});
				}
				this.addmapFix(1, this.mapJson.oFix.length - 1)
			},
			setmapCenter(params) {
				var vm = this;
				this.bus.$emit('handleCloseMapPop',params);
				this.$refs.aPerson && this.$refs.aPerson.remove();

				if (vm.track.markerList && vm.track.markerList.length > 0) { //清除车辆轨迹
					oMaxmap.remove(vm.track.markerList);
					oMaxmap.remove(vm.track.polyline);
				}

				if (this.mapJson.oplaceSearch) { //清除地图医院搜索点
					this.mapJson.oplaceSearch.clear();
					if (this.mapJson.oplaceSearch.render) {
						this.mapJson.oplaceSearch.render.markerList.clear();
					}
					this.mapJson.oplaceSearch = null;
				}
				if (this.mapJson.cluster) { //清除地图图标标记点
					this.mapJson.cluster.setMap(null);
				}
				if (this.gates) { //清除道闸图标
					this.gates.setMap(null);
				}
				if (this.shelter.sheltersMarker) {
					oMaxmap.remove(this.shelter.sheltersMarker); //清除地图图标方舱
				}
				if (this.mapJson.buildBtnmarker) {
					oMaxmap.remove(this.mapJson.buildBtnmarker); //清除地图消防，网管工作站按钮
				}
				if (this.mapJson.fireEngineMarker) {
					oMaxmap.remove(this.mapJson.fireEngineMarker); //清除地图消防主机弹窗
				}
				if (this.shelter.securityList.staffsGroupsdot) {
					oMaxmap.remove(this.shelter.securityList.staffsGroupsdot);
				}

				if (this.shelter.SMInfoWindow) {
					this.shelter.SMInfoWindow.close();
				}

				this.removeTrack(this.shelter.securityList.trackArr);
				this.$refs.mapMonitoring && this.$refs.mapMonitoring.closeInfoWindow();
				this.$refs.crt && this.$refs.crt.closeInfoWindow();
				this.$refs.blackBox && this.$refs.blackBox.closeInfoWindow();
				if(this.selectedParts.length>0){
					oMaxmap.setFitView(this.selectedParts[0],false,[0,0,0,0],20);
					oMaxmap.panBy(100, 0)
				}else{
					oMaxmap.setZoomAndCenter(mapLatJson.bigZoom, [mapLatJson.bigLongitude, mapLatJson.bigLatitude]); //同时设置地图层级与中心点
					if (!this.mold3D || this.mapType != 3) {
						oMaxmap.zoomOut()
						oMaxmap.panBy(0, 120)
					}
				}
			},
			placeSearch() { //医院搜索   ********************
				var vm = this;
				if (vm.mapJson.oplaceSearch) {
					return
				}
				vm.mapJson.oplaceSearch = new AMap.PlaceSearch({
					type: '医疗保健服务', // 兴趣点类别
					pageSize: 30, // 单页显示结果条数
					map: oMaxmap, // 展现结果的地图实例
					autoFitView: this.selectedParts.length>0?false:true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
				});

				var cpoint = [mapLatJson.bigLongitude, mapLatJson.bigLatitude]; //中心点坐标
				
				vm.mapJson.oplaceSearch.searchNearBy('医院', cpoint, 3000, function(status, result) {});
				
				// vm.mapJson.oplaceSearch.search('医院');

			},
			yearReview() { //显示学年回顾
				this.bus.$emit('showYearReview')
			},
			//获取车辆轨迹
			getTrail(car) {
				var vm = this;
				if (car.carPlate) {
					var param = new FormData();
					param.append('date', new Date(car['date']).toJSON());
					param.append('timeFlag', car.curr * 24);
					param.append('carPlate ', car.carPlate);
					this.$axios.post('traffic/pass/carTrajectory', param).then(function(res) {
						vm.drawTrail(res.trajectory);
					});
				}
			},
			drawTrail(points) {
				var vm = this;
				if (vm.track.markerList && vm.track.markerList.length > 0) {
					oMaxmap.remove(vm.track.markerList);
					oMaxmap.remove(vm.track.polyline);
				}
				vm.track = {
					markerList: [],
					polyline: null,
				}
				var lineArr = [];
				points = points.sort(function(a, b) {
					return a.unitIndex - b.unitIndex
				});
				points.forEach((itme, index) => {
					if (itme.longitude && itme.longitude) {
						var arr = [itme.longitude, itme.latitude];
						var marker = new AMap.Marker({
							position: [itme.longitude, itme.latitude],
							content: '<div class="trailMarker"><i>' + itme.unitIndex +
								'</i><div class="infoBox"><p>' + (itme.rpassTime ||
									'') + '</p><p>' + itme.unitName + '</p></div></div>',
							map: oMaxmap,
							offset: new AMap.Pixel(-13, -34),
						});
						vm.track.markerList.push(marker)
						lineArr.push(arr)
					}
				})
				// 绘制轨迹
				vm.track.polyline = new AMap.Polyline({
					map: oMaxmap,
					path: lineArr,
					showDir: false,
					strokeColor: "rgb(255, 153, 0)", //线颜色
					strokeOpacity: 1, //线透明度
					strokeWeight: 4, //线宽
					strokeStyle: "solid", //线样式
					geodesic: true,
					zIndex: 300,
				});
				oMaxmap.setFitView(vm.track.markerList)
			},
			checkNewAlarm() { //实时报警请求函数
				let _this = this;
				if(this.selectedParts.length>0)return;//选中分区
				this.$axios.post("home/newAlarm").then((res) => {
					//测试数据，勿删
					// var result = {
					// 	"code": "0",
					// 	"mess": "SUCCESS",
					// 	"data": {
					// 		"alarm": [{
					// 			"deviceIp": "",
					// 			"deviceUuid": "cqswu_24629655ff83433685a93dc70e0e15a5",
					// 			"similary": "",
					// 			"oldpicUrl": "",
					// 			"alarmTime": "2021-01-28 13:10:14",
					// 			"latitude": "29.499301860703117",
					// 			"alarmTypeName": "人脸本校布控",
					// 			"devicePosition": "南区16栋学生公寓B2-4-05",
					// 			"devicePass": "",
					// 			"deviceNo": "",
					// 			"deviceCode": "24629655ff83433685a93dc70e0e15a5",
					// 			"blackName": "",
					// 			"uuid": Date.now(),
					// 			"alarmDesc": "复合式感烟感温烟雾报警",
					// 			"picUrl": "",
					// 			"deviceUser": "",
					// 			"alarmType": "2.5",
					// 			"videoUrl": "2222",
					// 			"deviceM3u8": "",
					// 			"hasHistory": "",
					// 			"subPlatForm": "1",
					// 			"deviceRstp": "",
					// 			"longitude": "106.57851427766943"
					// 		}, 
					// 		// {
					// 		// 	"deviceIp": "",
					// 		// 	"deviceUuid": "cqswu_753e946c3ed441feadc27cb1411e9122",
					// 		// 	"similary": "",
					// 		// 	"oldpicUrl": "",
					// 		// 	"alarmTime": "2021-08-19 10:34:45",
					// 		// 	"latitude": null,
					// 		// 	"alarmTypeName": "校内违法车辆",
					// 		// 	"devicePosition": "竹园4运方向测速",
					// 		// 	"devicePass": "",
					// 		// 	"deviceNo": "",
					// 		// 	"deviceCode": "753e946c3ed441feadc27cb1411e9122",
					// 		// 	"blackName": "",
					// 		// 	"uuid": "cqswu_C678D4DE-516A-45AD-AB4C-834F7A32D0A4",
					// 		// 	"alarmDesc": "渝A1HG53超速未达 20%",
					// 		// 	"picUrl": "http://192.168.13.123:80/pic?=d45i377e*a4ei04e-1546a2e9=t1i0m*dp=*2pdi=*1s3i7=05b2i6da7*da8c34d40-a23f838-4400s3-f0z1bed4=73",
					// 		// 	"deviceUser": "",
					// 		// 	"alarmType": "3.4",
					// 		// 	"videoUrl": "",
					// 		// 	"deviceM3u8": "",
					// 		// 	"hasHistory": "",
					// 		// 	"subPlatForm": "",
					// 		// 	"deviceRstp": "",
					// 		// 	"longitude": null
					// 		// },
					// 		]
					// 	}
					// };
					// var data = result.data.alarm || [];
					var data = res.alarm || [];
					// console.log(realAlarmConfig)
					data.forEach((item) => {
						if(realAlarmConfig[item.alarmType]||Object.keys(realAlarmConfig).length==0){
							if (item.devicePosition == null) {
								item.devicePosition = "无告警位置"
							}
							this.police(item);
						}
						
					})
				})
			},
			// 添加警告
			police(alarmObj) {
				var _this = this;
				var hdata = Object.assign([], _this.Historydata); //获取已弹出的alarmUUID
				
				if (this.Historydata.indexOf(alarmObj.uuid) == -1) {
					this.Historydata.push(alarmObj.uuid);
				} else return
				
				this.alarms.push(alarmObj);
				if (alarmObj.alarmType == '1.1' || alarmObj.alarmType == '2.5') { //火警显示联动视频、人脸本校布控显示联动视频
					var alarmBigType = alarmObj.alarmType.indexOf('1.') > -1 ? 'fire' : 'security';
					this.$refs.realAlarmVideo && this.$refs.realAlarmVideo.show(2, {
						...alarmObj,
						alarmBigType: alarmBigType
					});
				}

				if (alarmObj.alarmType == "2.6") {
					_this.bus.$emit("mappopup", alarmObj)
				}
				/*判断是否显示查看详情按钮*/
				if (!!alarmObj.videoUrl || !!alarmObj.hasHistory || !!alarmObj.picUrl) {
					var oclassName = 'showfabutton'
				} else {
					var oclassName = 'hidefabutton'
				}
				$('.Z-Baseindexaa').fadeOut();
				sound++;
				if (alarmObj.latitude || alarmObj.longitude) {
					var lat = alarmObj.latitude;
					var lng = alarmObj.longitude;
					var show = 0;
				} else {
					var lat = mapLatJson.bigLatitude;
					var lng = mapLatJson.bigLongitude;
					var show = 1;
				}
				var ohtml =
					'<div id="warning">\
						<div class="Z-bowen">\
						<i class="Z-dot1"></i>\
						<i class="Z-dot2"></i>\
						<i class="Z-dot3"></i>\
						</div>\
						<div class="Z-frame clearFix">\
						<h5>' + alarmObj.alarmTypeName + '<i class="noLat' + show + '">暂无该告警定位点</i><p class="Z-close"><img id ="y' +
					idex +
					'"src="static/images/Zgb.png" alt="" /></p></h5>\
						<ul>\
						<li class="li1"><span>设备位置:</span><i>' + (alarmObj.devicePosition || '') + '</i></li>\
						<li class="li2"><span>告警时间:</span><i>' + (alarmObj.alarmTime || '') +
					'</i></li>\
						<li class="li3"><span>告警内容:</span><i>' + (alarmObj.alarmDesc || alarmObj.alarmTypeName) +
					'</i></li>\
						</ul>\
						<div class="Z-mapmapframe clearFix">\
							<button id="fabutton' + idex +
					'" class="' + oclassName + '">' + (!!alarmObj.videoUrl ? "视频联动" : "查看详情") + '</button>\
						</div>\
						</div>\
						</div>';
				if (alarmObj.alarmType == "4") {
					ohtml =
						'<div id="warning">\
						<div class="Z-bowen">\
						<i class="Z-dot1"></i>\
						<i class="Z-dot2"></i>\
						<i class="Z-dot3"></i>\
						</div>\
						<div class="Z-frame clearFix">\
						<h5>' +
						alarmObj.alarmTypeName + '<i class="noLat' + show +
						'">暂无该告警定位点</i><p class="Z-close"><img id ="y' + idex +
						'"src="static/images/Zgb.png" alt="" /></p></h5>\
						<ul>\
						<li class="li1"><span>姓名:</span><i>' +
						alarmObj.staffName + '</i></li>\
						<li class="li2"><span>学号:</span><i>' + alarmObj.staffCode +
						'</i></li>\
						<li class="li3"><span>班级:</span><i>' + alarmObj.staffClass +
						'</i></li>\
						<li class="li2"><span>时间:</span><i>' + alarmObj.cuseTime +
						'</i></li>\
						</ul>\
						</div>\
						</div>';
				}
				var marker = new AMap.Marker({
					content: ohtml,
					map: oMaxmap,
					position: [lng, lat],
					anchor: 'top-left',
					zIndex: 250
				});
				alarmObj.marker = marker;
				oMaxmap.setZoomAndCenter(18, [lng, lat])
				alarmObj.timer = setTimeout(function() {
					_this.removeMarker(alarmObj);
				}, 20000);
				$('#container').on('click', '#y' + idex, function() {
					_this.removeMarker(alarmObj);
					clearTimeout(alarmObj.timer);
				})
				$('#container').on('click', '#fabutton' + idex, function() { //查看详情按钮点击事件
					if (alarmObj.alarmType == 'blackBox') { //网管工作站告警
						_this.bus.$emit('Pop3blackBoxcrt', alarmObj);
					} else {
						_this.bus.$emit("mappopup", alarmObj)
					}

				})
				idex++;
				this.bus.$emit('closeDraw');
			},
			removeMarker(item) { //移除实时告警marker
				oMaxmap.remove(item.marker);
				var index = this.alarms.indexOf(item);
				if (index > -1) {
					this.alarms.splice(index, 1);
				}
				if (item.index) {
					this.$refs.realAlarmVideo && this.$refs.realAlarmVideo.removeItem(item);
				}
			},
			getelecSafetyLngLat(type) {
				// 获取智能空开经纬度
				this.$axios.post('elec/safety/ddeviceLocaMap', {}).then((res) => {
					if (res && res.length > 0) {
						this.elecSafety.elecList = res || [];
						this.addmapFix(type, null)
					}
				})
			},
			getShelterLngLat(fixed) { //获取方舱经纬度
				var params = {
					unitUuid: UNITID,
					currentPage: 1,
					pageSize: 20000,
				}
				this.$axios.post('edu/home/aqueryList', params)
					.then((res) => {
						if (res.data && res.data.length > 0) {
							this.shelter.shelterList = res.data;
							this.addShelter(this.shelter.shelterList, fixed)
						} else {
							return
						}
					})
			},
			addShelter(data, fixed) { //地图增加方舱
				!fixed && this.setmapCenter();
				var _this = this;
				var shelters = [];
				data.forEach((itme, index) => {
					var contents =
						"<div class='markerShelter'><p class='sImg'></p><p class='dot'></p><div class='tips-click'><b></b><b></b><b></b></div></div>";
					var shelterBatch = new AMap.Marker({
						position: [itme.lng, itme.lat],
						content: contents,
						offset: new AMap.Pixel(-3, -3), //点标记显示位置偏移量
					});
					shelterBatch.on('click', function() { //获取方舱信息
						_this.getshelterInfoNew(itme)
					})
					shelters.push(shelterBatch);

				})
				this.shelter.sheltersMarker = new AMap.OverlayGroup(shelters);
				oMaxmap.add(this.shelter.sheltersMarker);

			},
			getMapElement(name) { //获取地图元素  安保人员等后台配置角色
				this.setmapCenter();
				this.$axios.post('edu/home/getMapElement', {
						unitUuid: UNITID
					})
					.then((res) => {
						this.getMapElementSucc(res, name)
					})
			},
			getMapElementSucc(res, name) {
				if (res && res.length > 0) {
					res.forEach((item, index) => {
						if (item.mapsName == name) {
							var obj = item;
							obj.staffsGroupsdot = null; //安保人员标记点
							obj.staffsGroups = null; //安保人员信息
							obj.trackArr = []; //安保人员轨迹路线

							if (item.mapsName == "校内安保") {
								obj.mapsIcon = "../../../static/images/map/c2on.png";
							} else if (item.mapsName == "运维人员") {
								obj.mapsIcon = "../../../static/images/map/h1on.png"
							}
							this.shelter.securityList = obj;
							this.getStaff(this.shelter.securityList)
						}
					})

				}
			},
			getStaff(itme) { //获取安保人员信息
				this.$axios.post('edu/home/getMapPers', {
						roleUuid: itme.roleUuid,
						unitUuid: UNITID
					})
					.then((res) => {
						this.addDqueryStaff(res, itme)
					})
			},
			addDqueryStaff(res, Oitme) { //地图增加安保人员信息
				Oitme.staffsGroups = null;
				Oitme.staffsGroupsdot = null;
				if (res && res.length > 0) {
					var data = res;
				} else {
					console.log(res)
					return
				}
				var _this = this;
				//				var data = [{blng: 106.572498,blat: 29.506162,id: '11',name: '王五五',phone: 13529296589}];
				var staffs = [];
				var staffsDot = [];
				data.forEach((itme, index) => {
					if (itme.blng && itme.blat) {
						var contentsDot = "<div class='staffMarker'><img class='imgstaff' src='" + Oitme.mapsIcon +
							"'/><div class='floor'></div></div>";
						var contents = "<ul class='staffMess'><li>" + itme.name + "【" + itme.phone +
							"】</li><li>上报时间：" + itme.time +
							"</li></ul>";

						var staffsBatch = new AMap.Marker({ //人员信息
							position: [itme.blng, itme.blat],
							content: contents,
							offset: new AMap.Pixel(-128, -250),
							zIndex: 300,

						});
						var staffsBatchDot = new AMap.Marker({ //人员点
							position: [itme.blng, itme.blat],
							content: contentsDot,
							offset: new AMap.Pixel(-30, -60),
							zIndex: 300,

						});
						staffs.push(staffsBatch);
						staffsDot.push(staffsBatchDot)
						staffsBatchDot.on('click', function() {
							staffsBatch.Je.visible ? staffsBatch.hide() : staffsBatch.show();
							_this.shelter.securityList.trackArr.forEach((obj, oi) => {
								if (obj.id == itme.id) {
									oMaxmap.remove(obj.marker);
									oMaxmap.remove(obj.polyline);
									oMaxmap.remove(obj.passedPolyline)
								}
							})
						})
						staffsBatch.on('click', function() { //获取人员轨迹
							for (var i = 0; i < Oitme.trackArr.length; i++) {
								if (Oitme.trackArr[i].id == itme.id) {
									oMaxmap.remove(Oitme.trackArr[i].marker);
									oMaxmap.remove(Oitme.trackArr[i].polyline);
									oMaxmap.remove(Oitme.trackArr[i].passedPolyline)
									Oitme.trackArr.splice(i, 1);
								}
							}
							_this.gettrack(itme, Oitme);
						})
					}
				})
				Oitme.staffsGroups = new AMap.OverlayGroup(staffs);
				Oitme.staffsGroupsdot = new AMap.OverlayGroup(staffsDot);
				oMaxmap.add(Oitme.staffsGroupsdot);
				oMaxmap.add(Oitme.staffsGroups);
				Oitme.staffsGroups.hide()
			},
			gettrack(itme, Oitme) { //获取轨迹信息
				this.$axios.post('/edu/home/locus', {
						userUuid: itme.id,
						unitUuid: UNITID
					})
					.then((res) => {
						this.addTrack(res, itme, Oitme)
					})
			},
			addTrack(res, obj, Oitme) { //地图添加轨迹
				var lineArr = [];
				if (res && res.length > 0) {
					res.forEach((itme, index) => {
						if (itme.blng && itme.blat) {
							var arr = [itme.blng, itme.blat];
							lineArr.push(arr)
						}
					})
				} else {
					console.log(res)
				}
				// 绘制轨迹
				var track = {
					marker: null,
					polyline: null,
					passedPolyline: null,
					id: obj.id,
				}
				track.marker = new AMap.Marker({
					map: oMaxmap,
					icon: "../../../static/images/map/mm.png",
					offset: new AMap.Pixel(-10, -0),
					//autoRotation: true,
					angle: -180,
					zIndex: 100,
				});
				track.polyline = new AMap.Polyline({
					map: oMaxmap,
					path: lineArr,
					showDir: true,
					strokeColor: "#015f8f", //线颜色
					strokeOpacity: 0.8, //线透明度
					strokeWeight: 8, //线宽
					strokeStyle: "solid", //线样式
					zIndex: 300,
				});
				track.passedPolyline = new AMap.Polyline({
					map: oMaxmap,
					strokeColor: "#26B5FF", //线颜色
					strokeWeight: 8, //线宽
					zIndex: 300,
				});

				track.marker.on('moving', function(e) {
					track.passedPolyline.setPath(e.passedPath);
				});
				track.marker.moveAlong(lineArr, 400, null, true);
				Oitme.trackArr.push(track)
			},
			removeTrack(Arr) { //删除地图轨迹
				if (Arr && Arr.length > 0) {
					Arr.forEach((obj, oi) => {
						oMaxmap.remove(obj.marker);
						oMaxmap.remove(obj.polyline);
						oMaxmap.remove(obj.passedPolyline)
					})
				}
				if (this.shelter.securityList.staffsGroups) {
					this.shelter.securityList.staffsGroups.hide()
				}

			},
			getshelterInfoNew(itme) { //获取方舱消息消息
				var params = {
					shelterUuid: itme.uuid
				};
				this.$axios.post('edu/home/cshelterInfoNew', params)
					.then((res) => {
						if (res) {
							this.addShelterMess(res.data, itme, res.camerList || [])
						} else {
							console.log(res)
						}
					})
			},
			addShelterMess(res, itme, camerList) { //方舱信息
				var _this = this;
				var status = "正常 ";
				var statusClass = "";
				var list = {
					deviPowe: '--', //市电
					deviPoweClass: '',
					deviLeak: '--', //电流漏电
					deviLeakClass: '',
					deviWate: '--', //水浸
					deviWateClass: '',
					deviSmok: '--', //烟感
					deviSmokClass: '',
					deviElec: '--', //电流
					deviElecClass: '',
					deviVolt: '--', //电压
					deviVoltClass: '',
					deviTemp: '--', //湿度
					deviTempClass: '',
					deviHumi: '--', //湿度
					deviHumiClass: '',
				}
				var onlineClass = "";
				var power = '--';
				if (res.online != "离线") {
					if (res.status == 0) { //方舱状态(0:正常 1:告警 2: 预警 )
						status = "正常 "
					} else if (res.status == 1) {
						status = "告警 ";
						statusClass = "status1";
					} else if (res.status == 2) {
						status = "预警 ";
						statusClass = "status2";
					}
					res.deviPowe ? list.deviPowe = res.deviPowe : list.deviPowe = "--"; //市电
					power = res.deviPowe == '正常' ? '市电' : '蓄电池';
					res.deviPowe == '告警' ? list.deviPoweClass = 'status1' : res.deviPowe == '预警' ? list.deviPoweClass =
						'status2' : list.deviPoweClass = '';


					res.deviLeak ? list.deviLeak = res.deviLeak : list.deviLeak = "--"; //电流漏电
					res.leakStat == "告警" ? list.deviLeakClass = "status1" : res.leakStat == "预警" ? list.deviLeakClass =
						"status2" : list.deviLeakClass = '';

					res.deviWate ? list.deviWate = res.deviWate : list.deviWate = "--"; //水浸
					list.deviWate == "告警" ? list.deviWateClass = "status1" : list.deviWateClass = '';

					res.deviSmok ? list.deviSmok = res.deviSmok : list.deviSmok = "--"; //烟感
					list.deviSmok == "告警" ? list.deviSmokClass = "status1" : list.deviSmok == "预警" ? list.deviSmokClass =
						"status2" : list.deviSmokClass = '';

					res.deviElec ? list.deviElec = res.deviElec : list.deviElec = "--"; //电流
					res.elecStat == "告警" ? list.deviElecClass = "status1" : res.elecStat == "预警" ? list.deviElecClass =
						"status2" : list.deviElecClass = '';

					res.deviVolt ? list.deviVolt = res.deviVolt : list.deviVolt = "--"; //电压
					res.voltStat == "告警" ? list.deviVoltClass = "status1" : res.voltStat == "预警" ? list.deviVoltClass =
						"status2" : list.deviVoltClass = '';

					res.deviTemp ? list.deviTemp = res.deviTemp : list.deviTemp = "--"; //温度
					res.tempStat == "告警" ? list.deviTempClass = "status1" : res.tempStat == "预警" ? list.deviTempClass =
						"status2" : list.deviTempClass = '';

					res.deviHumi ? list.deviHumi = res.deviHumi : list.deviHumi = "--"; //湿度
					res.humiStat == "告警" ? list.deviHumiClass = "status1" : res.humiStat == "预警" ? list.deviHumiClass =
						"status2" : list.deviHumiClass = '';
				} else {
					onlineClass = 'redText';
					status = "告警 ";
					statusClass = "status1";
				}
				var str = '';
				if (camerList.length > 0) {
					str = '<p>监控状态</p><ul class="cameraLists">';
					camerList.forEach(item => {
						str += '<li cameraUuid="' + item.cameraUuid + '" class="single-camera ' + (item
							.onlineState == '在线' ? 'camera-online' : '') + '">\
								<div class="fr">\
									<i class="' + (item.onlineState == '在线' ? '' : 'redText') + '">' + (item.onlineState == null ? '--' : (item
							.onlineState || "离线")) + '</i>\
									<img src="../../../static/images/home_video.png" title="实时视频" class="' + (item.onlineState == '在线' ? '' :
							'offline') + '">\
								</div>\
								<p>' + item.cameName + '</p>\
							</li>'
					});
					str += '</ul>';
				}

				var openHtml = this.isOpen == 1 ? '<button  id="RemoteCabinOpening">远程开舱</button>' : '';
				var ohtml = '<div class="shelterMess">\
							   <div class="SMtop">\
									<div class="closeSM"></div>\
									<h6>' + res.name + '</h6>\
							   </div>\
							   <div class="SMcontent">\
								<ul class="SMtype">\
									<li class="' + onlineClass + '">' + res.online + '</li>\
									<li class="normal ' + statusClass + '">' + status + '</li>\
								</ul>\
								<p class="shelterCode">方舱编号：' + res.deviMode + res.code + '</p>\
								<ul class="SMlist clearFix">\
									<li class="' + list.deviPoweClass + '"><i>' + list.deviPowe + '</i><i>' + power + '</i></li>\
									<li class="' + list.deviLeakClass + '"><i>' + list.deviLeak + '</i><i>漏电</i></li>\
									<li class="' + list.deviElecClass + '"><i>' + list.deviElec + 'A</i><i>电流</i></li>\
									<li class="' + list.deviVoltClass + '"><i>' + list.deviVolt + 'V</i><i>电压</i></li>\
									<li class="' + list.deviSmokClass + '"><i>' + list.deviSmok + '</i><i>烟感火警</i></li>\
									<li class="' + list.deviTempClass + '"><i>' + list.deviTemp + '℃</i><i>温度</i></li>\
									<li class="' + list.deviHumiClass + '"><i>' + list.deviHumi + '%</i><i>湿度</i></li>\
								</ul>\
								' + str + '</div>\
								<div class="SMbottom clearFix">\
								' + openHtml + '<button  id="PortState">舱门状态</button>\
									<button  id="SMinventory">装备库存</button>\
									<button class="fr" id="realVideo">实时视频</button>\
								</div>\
							</div>';
				oMaxmap.setZoomAndCenter(18, [res.longitude, res.latitude]);

				_this.shelter.SMInfoWindow = new AMap.InfoWindow({
					isCustom: true, //使用自定义窗体
					content: ohtml,
					anchor: 'top-left',
				});
				_this.shelter.SMInfoWindow.open(oMaxmap, [res.longitude, res.latitude]);
				oMaxmap.panBy(-170, 60);
				_this.unbindClick();
				$('#container').on('click', '.closeSM', function() {
					_this.shelter.SMInfoWindow.close();
				});
				$('#container').on('click', '.single-camera.camera-online', function() {
					_this.$refs['video'].autoPlay({
						cameraUuid: $(this).attr('cameraUuid'),
						type: 1,
						shelterUuid: itme.uuid
					})
				});

				$('#container').on('click', '#RemoteCabinOpening', function() {
					_this.$refs.remoteCabinOpening.show(itme);
				});

				$('#container').on('click', '#PortState', function() {
					_this.$refs.portState.show(itme);
				});

				$('#container').on('click', '#SMinventory', function() {
					_this.$refs.SMinventory.show(itme.uuid, res.name);
				});

				$('#container').on('click', '#realVideo', function() {
					_this.$refs['video'].autoPlay({
						type: 1,
						shelterUuid: itme.uuid
					})
				});
			},
			unbindClick() {
				$('#container').off('click', '.single-camera.camera-online');
				$('#container').off('click', '.closeSM');
				$('#container').off('click', '#RemoteCabinOpening');
				$('#container').off('click', '#PortState');
				$('#container').off('click', '#SMinventory');
				$('#container').off('click', '#realVideo');
			},
			drawMarkerFun(e) { //测距 面积按钮
				//$('.bgZoom').css('zoom','1')
				var vm = this;
				// if (!this.drawBtnShow) {
					var eLng = e.lnglat.getLng();
					var eLat = e.lnglat.getLat();

					this.mapJson.drawBtn.setPosition([eLng, eLat])
					this.mapJson.drawBtn.show()
				// }

			},
			drawStart(type) {
				this.mapJson.drawBtn.hide();
				this.drawBtnShow = true;
				if (type == 1) { //测量距离
					this.drawRanging();
				} else if (type == 2) { //测量面积
					this.drawArea();
				} else {
					this.$refs.draw.initDraw(type);
				}
			},
			drawEnd() {
				var vm = this;
				vm.drawBtnShow = false;
			},
			drawRanging() {
				var vm = this;
				var mouseTool = new AMap.MouseTool(oMaxmap);
				var startMarkerOptions = {
					icon: new AMap.Icon({
						size: new AMap.Size(12, 12), //图标大小
						imageSize: new AMap.Size(12, 12),
						image: "../../../static/images/map/draw7.png"
					}),
					offset: new AMap.Pixel(-6, -6)
				};
				mouseTool.rule({
					startMarkerOptions: startMarkerOptions,
					endMarkerOptions: startMarkerOptions,
					midMarkerOptions: startMarkerOptions,
					lineOptions: { //可缺省
						strokeStyle: "solid",
						strokeColor: "#00FFFF",
						strokeOpacity: 1,
						strokeWeight: 2
					}
					//同 RangingTool 的 自定义 设置，缺省为默认样式
				});
				mouseTool.on("draw", function(data) {
					vm.drawBtnShow = false;
					mouseTool.close(false);

				})
				vm.rangingMouseTool.push(mouseTool)

			},
			drawArea() {
				var vm = this;
				var mouseTool = new AMap.MouseTool(oMaxmap);
				mouseTool.polygon({
					strokeColor: '#00FFFF',
					strokeWeight: 2,
					fillColor: '#00FFFF',
					fillOpacity: 0.1,
					extData: {
						'class': 'areaMeasure'
					}
				});
				mouseTool.on("draw", function(data) {
					var path = data.obj.getPath()
					var area = (data.obj.getArea() / 1000000).toFixed(2);
					var textMarker = new AMap.Marker({
						position: new AMap.LngLat(path[0].lng, path[0].lat),
						content: "<div class='drawareaText'><span>" + area +
							"平方公里</span><span class='closedrawarea'></span></div>",
						offset: new AMap.Pixel(-20, -20),
					})
					oMaxmap.add(textMarker);
					textMarker.on('click', function() {
						data.obj.setMap(null);
						oMaxmap.remove(textMarker);
					})
					vm.drawBtnShow = false;
					mouseTool.close(false);
					vm.areaMouseTool.push(data.obj)
					vm.areaMouseTool.push(textMarker)
				})

			},
			openVoice() { //语音功能调用函数
				this.voicshow = !this.voicshow;
				if (this.voicshow) {
					openVoic()
				} else {
					closeWebSocket()
				}
			},
			getuserAgent() { //判断浏览器内核
				var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
				if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
					this.mold3D = true;
				} else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edge") == -1) {
					this.mold3D = true;
				} else {
					this.mold3D = false;
					this.mapType = 1;
				}

			},
			openWebSocket() { //接收紧急求助实时告警
				var vm = this;
				var websocket = new WebSocket(process.env.WS_URL + "/websocket/shelter/" + UNITID + "?token=" + TOKEN);

				websocket.onerror = function() {
					console.log("连接发生错误")
				};
				websocket.onopen = function(event) {
					console.log("成功")
				};
				websocket.onclose = function() {
					console.log('连接关闭')
				};
				websocket.onmessage = function(event) {
					if (event.data == 1) return;
					console.log(event.data);
					var data = JSON.parse(event.data);
					
					var alarmTypeName='';
					if (data.alarmClass == 0) {
					   alarmTypeName = "紧急求助";
					 } else if (data.alarmClass == 1) {
						alarmTypeName = "设备异常";
					} else if (data.alarmClass == 2) {
					   alarmTypeName= "装备不足";
					}
					var params = {
						...data,
						deviceCode: data.devicecode,
						deviceUuid: data.deviceUuid,
						alarmBigType: 'shelter',
						latitude: data.lat,
						longitude: data.lng,
						devicePosition: data.position,
						devicecode: data.deviceCode,
						alarmTypeName:alarmTypeName
					}
					if(realAlarmConfig[data.alarmClass]||Object.keys(realAlarmConfig).length==0){
						vm.police(params);
						
						// if (data.alarmClass == '0') {	
						// 	vm.$refs.realAlarmVideo && vm.$refs.realAlarmVideo.show(2, params);
						// }
					}
				}
			}
		},

		created: function() {
			var vm = this;
			this.interval2 = setInterval(this.checkNewAlarm, 5000)
			this.interval1 = setInterval(() => { //报警历史只存放3分钟，3分钟后重置为空
				this.Historydata = [];
			}, 180000);
			this.openWebSocket();
			// setTimeout(()=>{
			// 	var data={
			// 			"deviceUuid": "cqswu_a10b4966af964a28ba597b30e3b52404",
			// 			"deviceName": "厚盾大门测试2",
			// 			"cameraUuid": null,
			// 			"alarmTime": "2020-06-23 11:44:42",
			// 			"alarmDesc": "一键报警启动（紧急求助）",
			// 			"unituuid": "3645",
			// 			"unitName":'重庆厚盾研究院',
			// 			"position": "重庆市渝北区人和街道水星科技大厦",
			// 			"devicecode": "a10b4966af964a28ba597b30e3b52404",
			// 			"lng": "106.503739",
			// 			"lat": "29.614775",
			// 			"uuid":Date.now(),
			// 			"alarmType": "1",
			// 			"alarmClass": "0",
			// 			"imgUrl": "[\"G1/M00/01/12/wKgBKl7xXGeAb9LJAAEzMyhHU1E139.jpg\"]",
			// 			'areaName':'重庆市/重庆市/南岸区'
			// 	}
			// 	var params={...data,deviceCode:data.devicecode,deviceUuid:data.deviceUuid,alarmBigType:'shelter',latitude:data.lat,longitude:data.lng,devicePosition:data.position,devicecode:data.deviceCode,alarmTypeName:'紧急求助'}
			// 	vm.police(params);
			// 	vm.$refs.realAlarmVideo && vm.$refs.realAlarmVideo.show(2, params);
			// },2000)
		},
		beforeDestroy() {
			if (this.interval1 != null) {
				clearInterval(this.interval1); //关闭
			}
			if (this.interval2 != null) {
				clearInterval(this.interval2); //关闭
			}
		},
		watch: {
			$route(to, from) {
				var vm = this;
				this.show = false;
				this.fixShow = "6";
				this.chageShow = "888";
				this.addmapFix(1, this.mapJson.oFix.length - 1);
				if (vm.rangingMouseTool.length > 0) {
					vm.rangingMouseTool.forEach((itme, index) => {
						itme.close(true)
					})
					vm.rangingMouseTool = [];
				}
				if (vm.areaMouseTool.length > 0) {
					oMaxmap.remove(vm.areaMouseTool);
					vm.areaMouseTool = [];
				}
				this.mapJson.drawBtn.hide();
				this.drawBtnShow = false;
				// if (vm.track.markerList && vm.track.markerList.length > 0) {
				// 	oMaxmap.remove(vm.track.markerList);
				// 	oMaxmap.remove(vm.track.polyline);
				// }
				vm.$refs.draw && vm.$refs.draw.closeDraw();
				//this.markPositio()
			}
		}
	}
</script>

<style lang="scss">
	.Ranging {
		width: 10px;
		height: 10px;
		background: rgba(9, 36, 55, 1);
		border: 2px solid rgba(0, 255, 255, 1);
		border-radius: 50%;
	}

	.map_buildName {
		position: absolute;
		top: -25px;
		left: 17px;
		transform: translate(-50%, 0);
		background-color: rgba(51, 158, 226, 0.3);
		border: 1px solid #339ee2;
		color: #fff;
		font-size: 14px;
		border-radius: 6px;
		padding: 2px 5px;
		cursor: pointer;
	}

	.el-dropdown-menu.h-school {
		background: rgba(1, 132, 219, 0.2);
		border-color: #0184DB;
		padding: 0px;
		min-width: 120px;
		box-sizing: border-box;

		li {
			color: #75CBF2;
			padding: 0px 5px;
			font-size: 0.7rem;

			span {
				display: block;
				outline: none;
				font-size: 16px;
			}

			&.active {
				background: rgba(6, 122, 183, 1);
				color: white;
			}

			&:hover {
				background: rgba(6, 122, 183, 0.5);
				color: white;
			}
		}

		&.el-popper[x-placement^=top] .popper__arrow {
			bottom: -7px;

			&:after {
				border-top-color: rgba(0, 32, 55, 0.8) !important;
			}
		}
	}
	//单个建筑marker样式
	.mapIcon.singleBuildIcon{
		.dot{
			width: 8px;
			height: 8px;
			background: rgba(31,216,225,.7);
			border-radius: 50%;
			box-shadow: 0 0 8px 2px rgba(31,216,225,0.7);
			transform: rotateX(60deg);
			display: block;
			position: relative;
			top: 11px;
			left: 11px;
			&:before{
				content: "";
				position: absolute;
				bottom: 0px;
				left: 3.5px;
				width: 1px;
				height: 80px;
				background: linear-gradient(180deg ,rgba(31,216,225,0.7),rgba(31,216,225,0));
				box-shadow: 0 0 1px 0px rgba(31,216,225,0.5);
				border-radius: 3px;
			}
		}
		.fontname{
			bottom: 44px;
		}
	}
	.mapIcon {
		width: 30px;
		height: 30px;
		cursor: pointer;
		position: relative;
	}

	.mapIcon2 {
		width: 35px;
		height: 35px;
	}

	.mapIcon img {
		width: 100%;
		height: 100%;
	}

	.mapIcon .font {
		position: absolute;
		color: #fff;
		font-size: 0.7rem;
		// top: -1.3rem;
		bottom: 35px;
		border: 1px solid rgb(31,216,225);
		height: 1.1rem;
		line-height: 1.1rem;
		min-width: 2.3rem;
		max-width: 7rem;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 0.3rem;
		background-color: rgba($color: #0f2e42, $alpha: 0.8);
		text-align: center;
		box-sizing: border-box;
		padding: 0px 5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mapIcon .fontname {
		position: absolute;
		// top: -1.3rem;
		left: 50%;
		bottom: 30px;
		transform: translate(-50%);
		// background-color: rgba(51, 158, 226, .3);
		background-color: rgba($color: #0f2e42, $alpha: 0.8);
		border: 1px solid rgb(31,216,225);
		color: #fff;
		font-size: 0.7rem;
		border-radius: 0.3rem;
		padding: 0px 5px;
		cursor: pointer;
		white-space: nowrap;
	}

	.markerlabel {
		position: relative;
	}

	.markerlabel:after {
		content: '';
		display: block;
		width: 30px;
		height: 30px;
		background: url(../../../static/images/loc.png) no-repeat center;
		background-size: 30px 30px;
	}

	.markerlabel i {
		color: #00FFFF;
		font-size: 0.8rem;
		background: rgba(0, 22, 38, 0.77);
		border: 1px solid #00FFFF;
		padding: 0.25rem 0.5rem;
		position: absolute;
		bottom: 32px;
		left: 12px;
		transform: translate(-50%, 0px);
		display: inline;
		cursor: inherit;
		white-space: nowrap;
	}

	.trailMarker {
		position: relative;
		background: url(../../../static/images/carSupervision/lod.png) no-repeat center;
		width: 26px;
		height: 34px;
		text-align: center;
	}

	.trailMarker i {
		color: #00FFFF;
		font-size: 12px;
		display: block;
		;
		line-height: 24px;
	}

	.trailMarker .infoBox {
		color: #00FFFF;
		font-size: 12px;
		background: rgba(0, 22, 38, 0.77);
		border: 1px solid #00FFFF;
		padding: 5px 10px;
		line-height: 20px;
		min-width: 120px;
		position: absolute;
		top: 34px;
		left: 13px;
	}

	.trailMarker .infoBox p {
		white-space: nowrap;
		text-align: left;
		font-size: 14px;
	}

	.amap-logo,
	.amap-copyright {
		display: none !important;
	}

	#container {
		background: rgb(8, 48, 75) !important;
	}

	.markerShelter:after,
	.markerShelter:before {
		content: "";
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 1px;
		height: 142px;
		background: linear-gradient(0deg, rgba(255, 106, 80, 1) 0%, rgba(255, 130, 109, 0) 100%);
		opacity: 0.6;
		border-radius: 3px;
	}

	.markerShelter:before {
		background: linear-gradient(0deg, rgba(255, 106, 80, 0) 0%, rgba(255, 130, 109, 0.3) 50%, rgba(255, 106, 80, 0) 100%);
		height: 3rem;
		animation: flameoff 2s ease-in-out 1s infinite;
	}

	.markerShelter .sImg {
		position: absolute;
		bottom: 7.1rem;
		left: -1.05rem;
		width: 2.55rem;
		height: 2.2rem;
	}

	.markerShelter .sImg:after {
		content: '';
		display: block;
		width: 2.4rem;
		height: 1.8rem;
		background: url(../../../static/images/map/shelterImg.png) no-repeat center;
		margin: 0 auto;
		margin-top: 0.55rem;
	}

	.markerShelter .dot {
		width: 1px;
		height: 1px;
		background: rgba(198, 82, 62, 1);
		border-radius: 50%;
	}

	.markerShelter .tips-click {
		transform: rotateX(0deg) rotateZ(-31deg);
		position: absolute;
		bottom: 8.25rem;
		left: 1.15rem;
		width: 15px;
		height: 15px;
	}

	.markerShelter .tips-click b {
		border: 1px solid #ff371c;
		border-left-color: rgba(0, 0, 0, 0);
		border-top-color: rgba(0, 0, 0, 0);
		border-bottom-color: rgba(0, 0, 0, 0);
		width: 100%;
		height: 100%;
		border-radius: 50%;
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.markerShelter .tips-click b:nth-of-type(1) {
		animation: launch1 1s linear infinite;
	}

	.markerShelter .tips-click b:nth-of-type(2) {
		animation: launch2 1s linear infinite;
	}

	@keyframes launch1 {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		50% {
			opacity: 1;
			transform: scale(1.5);
		}

		100% {
			opacity: 0;
			transform: scale(2);
		}
	}

	@keyframes launch2 {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		50% {
			opacity: 1;
			transform: scale(2);
		}

		100% {
			opacity: 0;
			transform: scale(3);
		}
	}

	/*安保人员*/

	.staffMarker {
		width: 60px;
		height: 60px;
	}

	.staffMarker:after,
	.staffMarker:before {
		content: "";
		position: absolute;
		bottom: 6px;
		left: 30px;
		width: 1px;
		height: 142px;
		background: linear-gradient(0deg, rgba(18, 150, 219, 1) 0%, rgba(18, 150, 219, 0) 100%);
		opacity: .6;
		border-radius: 3px;
	}

	.staffMarker:before {
		background: linear-gradient(0deg, rgba(18, 150, 219, 0) 0%, rgba(18, 150, 219, 0.5) 50%, rgba(18, 150, 219, 0) 100%);
		height: 60px;
		animation: flameoff 2s ease-in-out 1s infinite;
	}

	.staffMarker .imgstaff {
		width: 30px;
		height: 30px;
		position: absolute;
		bottom: 150px;
		left: 17px;
	}

	.staffMarker .floor {
		width: 15px;
		height: 15px;
		position: absolute;
		bottom: -1px;
		left: 50%;
		margin-left: -9px;
		transform: rotateX(60deg);
	}

	.staffMarker .floor:after,
	.staffMarker .floor:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		border: 2px solid rgba(38, 181, 255, 0.9);
		border-left: 2px solid rgba(0, 0, 0, 0);
		border-right: 2px solid rgba(0, 0, 0, 0);
		border-radius: 100px;
		box-shadow: 0 0 8px #2187e7;
	}

	.staffMarker .floor:after {
		width: 15px;
		height: 15px;
		margin-top: -7.5px;
		margin-left: -7.5px;
		animation: spinoffPulse 2s infinite linear;
	}

	.staffMarker .floor:before {
		width: 30px;
		height: 30px;
		margin-top: -15px;
		margin-left: -15px;
		animation: spinoffPulse2 1.5s infinite linear;
	}

	@keyframes spinoffPulse {
		from {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(360deg)
		}
	}

	@keyframes spinoffPulse2 {
		0% {
			opacity: 0;
			transform: rotate(0deg);
		}

		20% {
			opacity: 1;
		}

		80% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: rotate(-720deg);
		}
	}

	.staffMess {
		padding: 6px;
		border: 1px solid rgba(18, 150, 219, 1);
		border-radius: 10px;
		background: url(../../../static/images/track.png) no-repeat top 6px right 12px rgba(0, 61, 93, 0.5);
		width: 257px;
		box-sizing: border-box;
	}

	.staffMess li {
		color: #BBBBBB;
		font-size: 16px;
		margin-bottom: 5px;
	}

	/*方舱信息弹框*/
	.shelterMess {
		width: 25rem;
		margin-top: -8rem;
		margin-left: 0.75rem;
		color: #DDDDDD;
	}

	.shelterMess .cameraLists {
		overflow: hidden;
		margin-right: 1rem;
		margin-top: 0.25rem;
	}

	.shelterMess .cameraLists li {
		border: 1px solid #666666;
		border-radius: 0.2rem;
		padding: 0px 0.5rem;
		line-height: 1.8rem;
		margin-bottom: 0.25rem;
	}

	.shelterMess .cameraLists li * {
		color: #CCCCCC;
	}

	.shelterMess .cameraLists li i {
		display: inline-block;
		margin-right: 0.5rem;
		font-size: 0.8rem;
		vertical-align: top;
	}

	.shelterMess .cameraLists li img {
		height: 1.8rem;
		display: inline-block;
		vertical-align: top;
		cursor: pointer;
	}

	.shelterMess .cameraLists li img.offline {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.shelterMess .cameraLists li p {
		overflow: hidden;
		line-height: 1.6rem;
		font-size: 0.9rem;
	}

	.shelterMess .SMtop {
		height: 2rem;
		line-height: 2rem;
		background: rgba(198, 82, 62, 1);
		color: #fff;
		padding-left: 0.5rem;
	}

	.shelterMess .SMtop h6 {
		// display: inline-block;
		color: #fff;
		margin-right: 2.5rem;
		overflow: hidden;
	}

	.shelterMess .SMtop .closeSM {
		float: right;
		width: 2rem;
		height: 2rem;
		background: url(../../../static/images/guanbi.png) no-repeat center;
		background-size: 0.75rem 0.75rem;
		cursor: pointer;
	}

	.shelterMess .SMtop img {
		width: 0.75rem;
		height: 0.75rem;
	}

	.shelterMess .SMcontent {
		min-height: 10rem;
		max-height: 19.65rem;
		overflow: auto;
		background: #171E32;
		padding: 0.25rem 0px 0px 1rem;
		box-sizing: border-box;
		position: relative;
	}

	.shelterMess .SMcontent .shelterCode {
		margin-right: 7.2rem;
		word-break: break-all;
	}

	.shelterMess .SMcontent p {
		line-height: 1.9rem;
		color: rgba(204, 204, 204, 1);
	}

	.shelterMess .SMcontent .SMtype {
		position: absolute;
		top: 0.5rem;
		// left: 18.25rem;
		right: 1.45rem;
		white-space: nowrap;
		font-size: 0;
	}

	.shelterMess .SMcontent .SMtype li {
		display: inline-block;
		vertical-align: middle;

		&:first-of-type {
			margin-right: 0.5rem;
		}
	}

	.shelterMess .SMtype .electric {
		content: "";
		display: block;
		width: 1.8rem;
		height: 1rem;
		border: 0.1rem solid #999;
		border-radius: 0.2rem;
		padding: 0.1rem;
		box-sizing: border-box;
		position: relative;
	}

	.shelterMess .SMtype .noelectric {
		background: url(../../../static/images/electricity.png) no-repeat center;
	}

	.shelterMess .SMtype .electric:after {
		content: "";
		display: block;
		width: 0.2rem;
		height: 0.3rem;
		background: #999;
		position: absolute;
		top: 0.25rem;
		right: -0.2rem;
	}

	.shelterMess .SMtype .electric span {
		width: 0;
		height: 100%;
		background: #999;
		display: block;
	}

	.shelterMess .SMtype .signal {
		width: 2rem;
		height: 2rem;
		background: url(../../../static/images/WIFI.png) no-repeat center;
	}

	.shelterMess .SMtype .nosignal {
		width: 2rem;
		height: 2rem;
		background: url(../../../static/images/WIFI-noHave.png) no-repeat center;
	}

	.shelterMess .SMtype .normal {
		color: #fff;
		padding: 0.1rem 0.5rem;
		border-radius: 0.1rem;
		line-height: 1.2rem;
		background: rgba(6, 157, 70, 1);
	}

	.shelterMess .SMtype .status1 {
		background: rgba(255, 47, 46, 1);
	}

	.redText {
		color: rgba(255, 47, 46, 1) !important;
	}

	.shelterMess .SMtype .status2 {
		background: rgba(237, 119, 3, 1);
	}

	.shelterMess .SMlist {
		margin-top: 0.5rem;
	}

	.shelterMess .SMlist li {
		width: 5.5rem;
		height: 3.1rem;
		background: rgba(31, 40, 62, 1);
		border: 1px solid rgba(102, 102, 102, 1);
		border-radius: 2px;
		text-align: center;
		padding-top: 0.4rem;
		box-sizing: border-box;
		margin: 0px 0.2rem 0.25rem 0px;
		float: left;
	}

	.shelterMess .SMlist li i {
		display: block;
		color: #ccc;
		line-height: 1.1rem;
		font-size: 0.8rem;
	}

	.shelterMess .SMlist .status1 {
		border-color: rgba(255, 47, 46, 1);
	}

	.shelterMess .SMlist .status1 i {
		color: rgba(255, 47, 46, 1);
	}

	.shelterMess .SMlist .status2 {
		border-color: rgba(237, 119, 3, 1);
	}

	.shelterMess .SMlist .status2 i {
		color: rgba(237, 119, 3, 1);
	}

	.shelterMess .SMbottom {
		background: #171e32;
		display: flex;
		flex-direction: row;
	}

	.shelterMess .SMbottom button {
		flex: 1;
		height: 2rem;
		background: rgba(68, 74, 99, 1);
		color: #7F9DE1;
		cursor: pointer;
		margin-right: 1px;
		box-shadow: none;
		border: none;
		outline: none;
	}

	.amap-controlbar {
		transform: scale(0.40);
	}

	/*测距 面积 电子围栏 按钮 */

	.drawMarker {
		width: 122px;
		background: rgba(10, 63, 94, 1);
	}

	.drawMarker li {
		color: rgba(117, 203, 242, 1);
		border: 1px solid rgba(1, 132, 219, 1);
		border-bottom-color: transparent;
		box-sizing: border-box;
		padding-left: 8px;
	}

	.drawMarker li:nth-of-type(1):hover,
	.drawMarker li:nth-of-type(2):hover,
	.drawMarker li i:hover {
		border: 1px solid #00FFFF;
	}

	.drawMarker li p {
		height: 40px;
		line-height: 40px;
		padding-left: 32px;
		cursor: pointer;
	}

	.drawMarker li:nth-of-type(1) p {
		background: url(../../../static/images/map/draw1.png) no-repeat left center;
	}

	.drawMarker li:nth-of-type(2) p {
		background: url(../../../static/images/map/draw2.png) no-repeat left center;
	}

	.drawMarker li:nth-of-type(3) {
		border-bottom: 1px solid rgba(1, 132, 219, 1);
	}

	.drawMarker li:nth-of-type(3) p {
		background: url(../../../static/images/map/draw3.png) no-repeat left center;
	}

	.drawMarker li i {
		display: inline-block;
		width: 30px;
		height: 30px;
		margin: 0 1px;
		cursor: pointer;
		border: 1px solid rgba(0, 0, 0, 0);
		box-sizing: border-box;
	}

	.drawMarker li i img {
		width: 100%;
		height: 100%;
	}

	.amap-drags .amap-ranging-label {
		background: rgba(0, 36, 61, 1);
		border: 1px solid rgba(49, 133, 156, 1);
	}

	.amap-drags .amap-ranging-label span {
		font-size: 16px;
		color: rgba(117, 203, 242, 1);
		vertical-align: middle;
		height: 22px;
		line-height: 22px;
		display: inline-block;
	}

	.amap-drags .amap-ranging-label span img {
		display: none;
	}

	.amap-drags .amap-ranging-label span:nth-of-type(2) {
		width: 15px;
		height: 15px;
		background: url(../../../static/images/map/guanbi.png) no-repeat center #2B6285;
		background-size: 10px 10px;
		border-radius: 50%;
	}

	.amap-drags .amap-ranging-label span:nth-of-type(3),
	.drawareaText .closedrawarea {
		width: 22px;
		height: 22px;
		background: url(../../../static/images/map/delete.png) no-repeat center;
		background-size: 100% 100%;
		display: inline-block;
	}

	.drawareaText {
		background: #00243d;
		border: 1px solid #31859c;
		padding: 3px 7px 3px 2px;
		white-space: nowrap;
	}

	.drawareaText span {
		font-size: 16px;
		color: #75cbf2;
		vertical-align: middle;
		height: 24px;
		line-height: 22px;
		display: inline-block;
		margin-left: 5px;
	}

	.buildingsBtn {
		text-align: center;
		width: 25rem;
		padding-right: 1.5rem;
		display: flex;
		justify-content: space-between;
		position: relative;
		background: rgba(10, 63, 94, 1);
		box-sizing: border-box;
	}

	.buildingsBtn p {
		color: #75CBF2;
		display: inline-block;
		padding: 5px 0px;
		line-height: 25px;
		width: 130px;
		height: 25px;
		text-align: center;
		flex: 1
	}

	.buildingsBtn .active {
		border-bottom: 2px solid rgba(0, 255, 255, 1);
	}

	/*地图比例尺*/

	.amap-scalecontrol {
		left: 1rem !important;
		bottom: 6rem !important;
	}

	.amap-scale-edgeleft,
	.amap-scale-middle,
	.amap-scale-edgeright {
		background-color: #fff !important;
	}

	.amap-scale-middle {
		border: none !important;
	}

	.amap-scale-text {
		color: #fff !important;
		font-size: 0.8rem !important;
		// width: 8rem !important;
		width: 4.8rem !important;
	}

	.amap-scale-middle {
		// width: 8rem !important;
		width: 4.8rem !important;
	}

	.amap-scale-edgeright {
		// left: 8rem !important;
		left: 4.8rem !important;
	}
</style>

<style lang="scss" scoped="scoped">
	p.camera {
		img {
			width: 25px;
			height: 25px;
			left: 7.5px;
			top: 7.5px;
		}
	}

	.map-container {
		position: relative;
		display: inline-block;

		.el-dropdown {
			float: left;
			margin-left: 7px;

			.yjbz {
				background: #0479B7;
			}
		}
	}
</style>


<style>
	.mapIconA01 {
		width: 50px !important;
		height: 22px !important;
		margin-top: -8px;
	}
</style>
