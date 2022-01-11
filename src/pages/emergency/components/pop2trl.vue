<template>
	<div>
		<div class="trackFilterDate flex flex-row align-center" v-if="track.trackFilterDateShow">
			<div class="trackFilterDate-container flex1 flex flex-row align-center">
				<span class="tip">轨迹日期</span>
				<el-date-picker v-model="track.trackFilterDate" class="flex1" :clearable="false" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>				
				<i class="el-icon-search search-icon" @click="addTrack"></i>
			</div>
			<i class="el-icon-circle-close close" @click="removeTrack"></i>
		</div>
		<div style="display: none;">
			<div class="Z-mapPopout" id="Z-mapPopout" ref="mapPop">
				<img class="mapLatAnimate" src="../../../../static/images/map/zb.png" alt="" />
				<div class="Z-mapPopoutF">
					<h5 class="PopoutTop">{{list.title}}<em v-show="!list.lon">暂无该告警定位点</em></h5>
					<img class="closeInfoWindow closeMarker" src="../../../../static/images/Zgb.png" alt="" />
					<ul>
						<li class="clearFix" v-for="(value, key) in list.rows" :key="key"><span>{{key}}:</span>
							<p>
								<i :class="{'alarmDescLow':key=='示值'&&list.alarmDesc=='偏低','alarmDescUp':key=='示值'&&list.alarmDesc=='偏高'}">
									{{value}}<strong v-show="key=='相似度'">%</strong>
								</i>
								
								<em v-if="key=='示值'">安全值: {{list.wminValue}}~{{list.wmaxValue}}{{list.valueUnit}}</em>
								
								<img v-if="key=='告警设备'&&type=='blackBox'" @click="blackBoxClick" src="../../../../static/images/blackbox/blackbox.png"class="blackBox-icon" />
								
								<img  @click="addTrack" v-if="(key=='被布控人'&&list.alarmType=='5'&&list.curr=='showTrack')||key=='当日轨迹'" src="../../../../static/images/track.png" class="track-icon" />
							</p>
						</li>
					</ul>
					<div class="Z-mapHandle clearFix">
						<button class="Z-butMap" :class="'Z-butMap'+list.butCenter.length" v-for="(data,index) in list.butCenter" @click="show3pop(data);" :key="data">{{data}}</button>
					</div>
					<p class="Z-operation" v-show="handleName=='未处理'">
						<i class="Z-misinformation handleFun" @click="handleFun(2)">误报</i>
						<i class="Z-pigeonhole handleFun" @click="handleFun(1)">归档</i><i style="display:none" class="Z-reporting">上报</i>
					</p>
				</div>
			</div>
		
		
			<div class="blackListTrackDetail" ref="photoDetail" v-for="(item,index) in tracks" :key="index">
				<!--<div class="photoContainer">
					<img :src="item.snapImage" class="photo"/>
				</div>-->
				<img src="../../../../static/images/map/xiaor.gif" class="personGif" />
				<div class="content">
					<div class="fr">
						<a><img src="../../../../static/images/map/picture.png" title="抓拍图片" @click="showBlackImg(item)" /></a>
						<a><img src="../../../../static/images/map/video.png" title="实时视频" @click="showBlackVideo(item,1)" /></a>
						<a><img src="../../../../static/images/map/track_playback.png" title="回放视频" @click="showBlackVideo(item,2)" /></a>
					</div>
					<div class="txt">
						<!--<p><label>布控人：</label>{{item.blackName}}</p>-->
						<p><label>时间：</label>{{item.alarmTime}}</p>
						<p><label>地点：</label>{{item.deviceName}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'EmergencyPop2t',
		data() {
			return {
				track:{
					trackFilterDate:null,//当前选中日期
					trackFilterDateShow:false,//是否显示人脸轨迹日期筛选框
					trackFilterFunction:function(){},//人脸轨迹日期筛选方法
				},
				type: "",
				list: {},
				infoBox: null,
				handleName: '',
				marker: '',
				photoMarkers: [],
				tracks: [],
				showTrack: true,
				passedPolyline: '', //行走路径
			}
		},
		methods: {
			show3pop(data) {
				var _this = this;
				if (_this.type == "traffic") {
					if (data == "抓拍图片") {
						_this.bus.$emit('addPop3img', _this.list)
					} else if (data == "视频回放") {
						_this.list.isplayback = 2
						_this.bus.$emit('addpop3video', _this.list.mess)
					} else if (data == "历史记录") {
						_this.bus.$emit('addPop3table', _this.list)
					}
				} else if (_this.type == "security"||_this.type=='searchForPictures') {
					if (data == "抓拍图片") {
						_this.bus.$emit('addPop3img', _this.list)
					} else if (data == "视频回放") {
						_this.bus.$emit('addpop3video', _this.list.mess)
					} else if (data == "历史记录") {
						_this.bus.$emit('Pop3tableSecurity', _this.list, _this.type)
					}else if (data == "联动视频") {
						_this.bus.$emit('addLinkageVideo', {..._this.list,type:1,alarmBigType:this.list.type});
					}
				} else if (_this.type == "fire") {
					if(data=='查看详情'){
						_this.$set(_this.list, 'popType', 1);
						_this.bus.$emit('Pop3crt', _this.list);
					}else if(data=='联动视频'){
						_this.bus.$emit('addLinkageVideo', {..._this.list,type:1,alarmBigType:this.list.type});
					}
					
				} else if (_this.type == "blackBox") { //黑箱
					_this.bus.$emit('Pop3blackBoxcrt', _this.list);
				}
			},
			blackBoxClick() { //黑箱图标点击事件
				this.$emit('showBlackInfo', this.list);
			},
			async addTrack() { //添加人脸布控轨迹
				var vm = this;			
				this.track.trackFilterDateShow=true;
				if(this.type=='searchForPictures'){		
					let tracks=await this.track.trackFilterFunction(this.track.trackFilterDate);
					this.drawTrack(tracks);
				}else{
					this.$axios.post('home/blacklistTrack', {
						alarmUuid: this.list.alarmId,
						startTime:this.track.trackFilterDate?this.track.trackFilterDate[0]+" 00:00:00":'',
						endTime:this.track.trackFilterDate?this.track.trackFilterDate[1]+" 23:59:59":'',
					}).then(res => {
						var data = res || [];
						if (data.length == 0) {
							vm.$message.error('未查询到轨迹');
							return;
						};
						this.drawTrack(data);
					})
				}
				
			},
			drawTrack(data){//绘制人脸轨迹
				var vm=this,paths = [],j = 0;
				if (vm.infoBox) {//移除当前打开的地图弹窗
					oMaxmap.remove(vm.infoBox);
				}
				if (data.length == 1) {//只有一个点
					var value = data[0];
					if (value.longitude && value.latitude) {
						value.origin = new AMap.LngLat(value.longitude, value.latitude);
						this.drawAnimationLine([
							[value.longitude, value.latitude]
						], data);
					}
				} else {
					var lastPoint=data[data.length-1];
					lastPoint.origin = new AMap.LngLat(lastPoint.longitude,lastPoint.latitude);//最后一个点设置origin
					
					data.forEach((item, index) => {
						paths[index] = [];
						if (index < data.length - 1) {
							if (item.longitude && item.latitude && data[index + 1].longitude && data[index + 1].latitude) {//有下一个点
								var origin = new AMap.LngLat(item.longitude, item.latitude);
								var destination = new AMap.LngLat(data[index + 1].longitude, data[index + 1].latitude);
								if(item.longitude==data[index + 1].longitude&&item.latitude==data[index + 1].latitude){//2020-09-25新加 起点和终点是同一个地方
									item.origin = origin;
									paths[index] =[origin,destination];										
									this.finshGetRoute(++j,data,paths);
								}else{
									(function(i){
										vm.getWalkingRoute(origin, destination).then(path => {
											var routes = path.routes,points = [path.origin];
											routes.forEach(route => {
												route.steps.forEach(step => {
													points = points.concat(step.path);
												})
											});
											points.push(path.destination);
											if (points.length > 0) {
												item.origin = points[0];
											}
											paths[i] = points;
											vm.finshGetRoute(++j,data,paths);
											if(i==3){
												console.log(path)
											}
										}).catch((e) => {
											console.log(e)
										});
									})(index)
								}																		
							} else {
								this.finshGetRoute(++j,data,paths);
							}
						}
					});
				}
				
			},
			//完成路线规划
			finshGetRoute(index,data,paths){
				if (index == data.length - 1) {
					var arr = [];
					paths.forEach(value => {
						arr = arr.concat(value);
					});
					this.drawAnimationLine(arr, data);
				}
			},
			//获取步行规划路线
			getWalkingRoute(origin, destination) {
				var walking = new AMap.Walking({});
				return new Promise(function(resolve, reject) {
					walking.search(origin, destination, function(status, result) {
						if (status == 'complete') {
							resolve(result)
						} else {
							reject()
						}
					})
				})
			},
			drawAnimationLine(lineArr, data) {
				var vm = this;
				if (lineArr && lineArr.length > 0) {
					vm.removeTrack();
					this.bus.$emit('removePersonTrack');
					vm.showTrack = true;
					this.track.trackFilterDateShow=true;
					vm.marker = new AMap.Marker({
						map: oMaxmap,
						position: lineArr[0],
						icon: "../../../../static/images/mm.png",
						offset: new AMap.Pixel(-13, -0),
						angle: -180,
					});
					if (lineArr.length == 1) {
						var point = new AMap.LngLat(lineArr[0][0], lineArr[0][1]);
						oMaxmap.setCenter(lineArr[0]);						
						vm.getTrackDetail(data, lineArr);
					} else {
						var polygon = new AMap.Polygon({
							path: lineArr
						});
						oMaxmap.setFitView(polygon, false, [0, 110, 10, 10], 19);
						var distance = Math.round(AMap.GeometryUtil.distanceOfLine(lineArr));
						if (distance > 0) {
							vm.passedPolyline = new AMap.Polyline({
								map: oMaxmap,
								strokeColor: "#0ff", //线颜色
								strokeWeight: 3, //线宽
								zIndex: 310,
							});
							vm.marker.on('moving', function(e) {
								vm.passedPolyline.setPath(e.passedPath);
								vm.getTrackDetail(data, e.passedPath);
							});
							vm.marker.moveAlong(lineArr, distance, null, true);
						} else {
							vm.getTrackDetail(data, lineArr);
						}
					}
					
				}
			},
			getTrackDetail(data, lineArr) {
				var vm = this,
					arr = [];
				if (!vm.showTrack) return;
				data.forEach(item => {
					if (item.origin) {
						if (vm.pointOnSegment(item.origin, lineArr)) {
							arr.push(item);
						}
					}
				});
				if (lineArr.length == 1) {
					arr = data;
				}
				if (arr.length > vm.tracks.length) {
					vm.tracks = arr;
					oMaxmap.remove(vm.photoMarkers);
					vm.photoMarkers = [];
					this.$nextTick(function() {
						if (!vm.showTrack) return;
						vm.tracks.forEach((item, index) => {
							var marker = new AMap.Marker({
								map: oMaxmap,
								position: item.origin,
								content: vm.$refs.photoDetail[index],
								offset: new AMap.Pixel(0, 0),
								anchor: 'bottom-center'
							});
							vm.photoMarkers.push(marker);
						});
					})
				}
			},
			// 判断点线关系
			pointOnSegment(point, lineArr) {
				// mp = getResolution() 获取指定位置的地图分辨率，单位：米/像素
				var mp = oMaxmap.getResolution();
				// m 为Polyline宽度的米数
				var m = 5 * mp;
				// 判断 marker 是否在线段上，最后一个参数为 m米 的误差
				var inLine = AMap.GeometryUtil.isPointOnLine(point, lineArr, m);
				if (inLine) {
					return true;
				}
				return false;
			},
			//布控抓拍
			showBlackImg(item) {
				var vm = this;
				var params = {
					alarmId: item.uuid,
					alarmType: this.list.alarmType,
					lat: item.longitude,
					lon: item.latitude,
					mess: Object.assign({}, item),
					personImg: this.list.personImg,
					title: this.list.title,
					type: this.list.type,
				}
				//				console.log(params)
				vm.bus.$emit('addPop3img', params);
			},
			// 布控实时视频
			showBlackVideo(item,isplayback) {
				var vm = this;
				var list = {
					show: true,
					title: item.deviceName,
					isplayback: isplayback,
				}
				vm.bus.$emit('addpop3video', {...item,...list});
			},
			handleFun(type) { //误报归档操作
				this.processStatus = false
				var back = {
					type: type,
					list: this.list
				}
				oMaxmap.remove(this.infoBox);
				this.bus.$emit('changehandleFun', back);
				this.removeTrack();
			},
			attributeMon(point) {
				var vm = this;
				if (!point.lon) {
					point.lat = mapLatJson.bigLatitude;
					point.lon = mapLatJson.bigLongitude;
				}
				vm.removeTrack();
				if (this.infoBox) {
					oMaxmap.remove(this.infoBox);
				}
				this.$nextTick(function() {
					var content = this.$refs.mapPop;
					vm.infoBox = new AMap.Marker({
						position: [point.lon, point.lat],
						content: content,
						map: oMaxmap,
						offset: new AMap.Pixel(-13, -10),
						zIndex:150
					});
					oMaxmap.setFitView(vm.infoBox, false, [0, 200, 100, 150]);
				})

			},
			removeTrack() {
				try {
					var vm = this;
					this.track.trackFilterDateShow=false;
					vm.showTrack = false;
					vm.marker && oMaxmap.remove(vm.marker);
					vm.passedPolyline && oMaxmap.remove(vm.passedPolyline);
					oMaxmap.remove(vm.photoMarkers);
					vm.photoMarkers = [];
					vm.tracks = [];
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		mounted: function() {
			var _this = this;
			this.bus.$off('addMapPop');
			this.bus.$on('addMapPop', (mes)=>{
				this.bus.$emit('closeParts');//关闭分区
				_this.type = mes.type;
				_this.list = mes;
				if (_this.list.mess) {
					_this.handleName = _this.list.mess.handleName
				} else {
					_this.handleName = ''
				}
				var point = {
					lon: _this.list.lon,
					lat: _this.list.lat
				}
				_this.$nextTick(function() {
					_this.attributeMon(point);
				});
				this.bus.$emit('closeDraw');
				
				
				if(this.type=='searchForPictures'){//以图搜图
					this.track.trackFilterDate=mes.d;
					this.track.trackFilterFunction=mes.trackFilterFunction;
				}
				
				if(mes.alarmType=='5'&&mes.curr=='showTrack'){//人脸本校布控
					this.track.trackFilterDate=[new Date(mes.alarmTime).Format('yyyy-MM-dd'),new Date(mes.alarmTime).Format('yyyy-MM-dd')];
				}
			})
			this.bus.$on('handleCloseMapPop', function(mes) {
				if (_this.infoBox) {
					oMaxmap.remove(_this.infoBox);
				}
				_this.removeTrack();
				this.bus.$emit('closeDraw');
			})
			$('#container').on('click', '.closeMarker', function() {
				_this.bus.$emit('handleCloseMapPop');
			});
			
			
			this.bus.$on('drawTrack',(mes)=>{
				this.type=mes.type;
				this.track.trackFilterDate=mes.d;
				this.track.trackFilterFunction=mes.trackFilterFunction;
				this.addTrack();
			});
		}
	}
</script>

<style>
	.amap-marker:hover {
		z-index: 999 !important;
	}

	.blackListTrackDetail {
		position: relative;
		transform: scale(0.85);
		transform-origin: center;
		height: 0px;
		margin-bottom: -10px;
	}

	.blackListTrackDetail:hover {
		transform: scale(1);
	}

	.blackListTrackDetail .personGif {
		position: absolute;
		left: -1.5rem;
		top: -1.5rem;
		width: 3rem;
		z-index: 11;
	}

	.blackListTrackDetail .photoContainer {
		position: absolute;
		left: -1.5rem;
		top: -2rem;
		width: 3rem;
		height: 100%;
	}

	.blackListTrackDetail .photoContainer:after {
		content: '';
		border: 1.5rem solid transparent;
		border-top-color: #75CBF2;
		border-top-width: 3.5rem;
		position: absolute;
		left: 0px;
		bottom: -3.5rem;
		z-index: 1;
	}

	.blackListTrackDetail .photo {
		width: 100%;
		height: 3rem;
		border-radius: 50%;
		position: absolute;
		bottom: 0.2rem;
		left: 0px;
		z-index: 2;
		background: white;
	}

	.blackListTrackDetail:hover .content {
		display: block;
	}

	.blackListTrackDetail .content {
		display: none;
		min-width: 15rem;
		background: rgba(0, 36, 61, 1);
		border: 1px solid rgba(49, 133, 156, 1);
		position: absolute;
		bottom: -1.5rem;
		left: 1.5rem;
		layout-flow: 0px;
	}

	.blackListTrackDetail .content .txt {
		margin-right: 3rem;
	}

	.blackListTrackDetail .content p {
		white-space: nowrap;
		line-height: 2.5rem;
		color: #75CBF2;
		white-space: nowrap;
	}

	.blackListTrackDetail .content p label {
		display: inline-block;
		width: 4rem;
		text-align: right;
	}

	.blackListTrackDetail a {
		display: block;
		width: 2rem;
		height: 1.55rem;
		line-height: 1.55rem;
		text-align: center;
		background: #0A3F5E;

	}

	.blackListTrackDetail a+a {
		margin-top: 0.1rem;
	}

	.blackListTrackDetail a img {
		display: inline-block;
		width: 1.4rem;
		vertical-align: middle;
	}
</style>

<style lang="scss">
	.trackFilterDate{
		position: fixed;
		top: 4.25rem;
		right: 26.75rem;
		margin-right: 40px;
		z-index: 5;	
		.trackFilterDate-container{
			width: 19rem;
			height: 2.4rem;
			background: rgba(38,91,120,0.50);
			border: 1px solid #265b78;	
			border-radius: 1.2rem;
			overflow: hidden;
			.tip{
				width: 4.8rem;
				line-height: 2.2rem;
				height: 100%;
				overflow: hidden;
				background: #0b79a3;
				color: #FFFFFF;
				text-align: center;
				flex-shrink: 0;
				border: 1px solid transparent;
				box-sizing: border-box;
			}
			.el-input__icon{
				display: none !important;
			}
			.el-input__inner{
				width: 100% !important;
				background: transparent !important;
			}
			.el-range-input{
				width: 45% !important;
			}
		}
		.close{
			color: #fff;
			font-size: 1.5rem;
			margin-left: 0.5rem;
			cursor: pointer;
		}
		.search-icon{
			color: #fff;
			font-size: 1.1rem;
			margin-right: 0.5rem;
			cursor: pointer;
		}
	}
</style>