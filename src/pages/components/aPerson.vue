<template>
	<div style="display: none;">
		<div class="fireInfoWindow" ref="fire">
			<img class="closeBtn" src="../../../static/images/Zgb.png" alt="" @click="close" />
			<img class="icon" src="../../../static/images/map/h4on.png" alt="" />
			<span>当前水压 <i> -- Mpa</i></span>
		</div>
		<div class="hospitalWindow"  ref="hospitalWindow">
			<img class="closeBtn" src="../../../static/images/Zgb.png" alt="" @click="close" />
			<img  alt="图片加载失败"class="img" src="../../../static/images/map/hospital.jpg">	
		</div>
		<div class="Z-mapPopout fireMonitorRoom"  ref="fireMonitorRoom">
			<div class="Z-mapPopoutF">
				<h5 class="PopoutTop">{{listInfo.title}}</h5>
				<img class="closeInfoWindow closeMarker" src="../../../static/images/Zgb.png" alt="" @click="close"/>
				<ul>
					<li class="clearFix" v-for="(value, key) in listInfo.rows" :key="key"><span>{{key}}:</span>
						<p>
							<i>{{value}}</i>
						</p>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import mapicon from "../../../static/mock/mapicon.js" //菜单js
	export default {
		data() {
			return {
				timers: [],
				overlays: [],
				listInfo:{rows:{}},//消防控制室数据
				infoWindow: null
			}
		},
		props: {
			mapJson: {},
			gates: {},
			shelter: {}
		},
		methods: {
			//添加应急避难线路
			addEmergencyRefugeRoute(obj) {
				try {
					if (obj.type != '01' || UNITID != '3690')return;
					console.log(obj)
					//添加道闸
					this.mapJson.oChang.find((item, index) => {
						if (item.type == 67) {
							var gates = this.$parent.addmapFix(2, index, [], true);
							this.$emit('update:gates', gates)
						}
					})
					// 添加方舱
					this.shelter.shelterList && this.shelter.shelterList.length > 0 ? this.$parent.addShelter(this
						.shelter.shelterList, true) : this.$parent.getShelterLngLat(true);
					
					this.addLine();
				} catch (e) {
					console.log(e.message)
				}
			},
			//添加避难路线
			addLine(obj) {
				var markers = [],
					vm = this;
				//步行导航
				var walking = new AMap.Walking({});

				for (var k in mapicon.dormitory) {
					var item = mapicon.dormitory[k];
					if (item.a && item.b) {
						//根据起终点坐标规划步行路线
						walking.search(item.a.split(','), item.b.split(','), function(status, result) {
							// result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
							if (status === 'complete') {
								var paths = [result.origin];
								result.routes.forEach(r => {
									r.steps.forEach(s => {
										paths = paths.concat(s.path)
									})
								});
								paths.push(result.destination);
								vm.drawAnimationLine(paths);
							} else {
								log.error('步行路线数据查询失败' + result)
							}
						});
					}



					// var marker = new AMap.Marker({
					// 	position: item.a.split(','),
					// 	offset: new AMap.Pixel(-15, -15),
					// });					
					// markers.push(marker);					
					// (function(marker,k) {
					//       marker.on('click',(e)=>{
					//       	console.log(k)
					//       })
					// })(marker,k);

				}
				oMaxmap.add(markers)
			},
			drawAnimationLine(lineArr) {
				var vm = this;
				if (lineArr) {
					var distance = Math.round(AMap.GeometryUtil.distanceOfLine(lineArr));
					var marker = new AMap.Marker({
						map: oMaxmap,
						position: [116.478935, 39.997761],
						content: '<i class="movePerson"></i>',
						offset: new AMap.Pixel(-2, -15),
						// autoRotation: true,
					});
					var passedPolyline = new AMap.Polyline({
						map: oMaxmap,
						strokeColor: "#0ce717", //线颜色
						strokeWeight: 4, //线宽
						zIndex: 200,
						showDir: true
					});
					marker.on('moving', function(e) {
						passedPolyline.setPath(e.passedPath);
					});
					(function(marker, passedPolyline) {
						marker.on('movealong', e => {
							var timer = setTimeout(() => {
								oMaxmap.remove([marker, passedPolyline])
								vm.drawAnimationLine(lineArr)
							}, 4000);
							vm.timers.push(timer);
						})
					})(marker, passedPolyline);
					marker.moveAlong(lineArr, distance / 2, null, false);
					this.overlays.push(marker, passedPolyline)
				}
			},
			showFire(item) {//消火栓
				var vm = this;
				if (UNITID != '3690')return;
				var content = vm.$refs.fire;
				vm.infoWindow = new AMap.InfoWindow({
					isCustom: true, //使用自定义窗体
					autoMove: true,
					closeWhenClickMap: true,
					content: content,
					anchor: 'top-left',
					offset: new AMap.Pixel(0, 5)
				});
				vm.infoWindow.open(oMaxmap, item.lnglat);
			},
			showHospital(item) {//校医务室
				var vm = this;
				if (UNITID != '3690')return;
				var content = vm.$refs.hospitalWindow;
				vm.infoWindow = new AMap.InfoWindow({
					isCustom: true, //使用自定义窗体
					autoMove: true,
					closeWhenClickMap: true,
					content: content,
					anchor: 'top-left',
					offset: new AMap.Pixel(0, 5)
				});
				vm.infoWindow.open(oMaxmap, item.lnglat);
			},
			showFireMonitorRoom(oitem){//消防监控室
				var vm = this;
				if (UNITID != '3690')return;
				console.log(oitem.type+'-'+oitem.lnglat[0]+'-'+oitem.lnglat[1])
				if(mapicon.fireMonitorRoom[oitem.type+'-'+oitem.lnglat[0]+'-'+oitem.lnglat[1]]){
					this.$nextTick(()=>{						
						this.listInfo={title:oitem.mess,rows:mapicon.fireMonitorRoom[oitem.type+'-'+oitem.lnglat[0]+'-'+oitem.lnglat[1]]}
						var content = vm.$refs.fireMonitorRoom;
						vm.infoWindow = new AMap.InfoWindow({
							isCustom: true, //使用自定义窗体
							autoMove: true,
							closeWhenClickMap: true,
							content: content,
							anchor: 'top-left',
							offset: new AMap.Pixel(0, 5)
						});
						vm.infoWindow.open(oMaxmap, oitem.lnglat);
					})
				}
			},
			close() {
				this.infoWindow && this.infoWindow.close()
			},
			remove() {
				oMaxmap.remove(this.overlays);
				this.overlays = [];
				this.timers.forEach(timer => {
					clearTimeout(timer);
				})
				this.listInfo={rows:{}};
				this.close();
			}
		}
	}
</script>

<style lang="scss">
	.fireMonitorRoom .Z-mapPopoutF{
		top: 0px !important;
		right: auto !important;
		left: 10px !important;
	}
	
	.movePerson {
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 100%;
		background-color: #0ce717;
		box-shadow: 0px 0px 0px 4px rgba($color:#0ce717, $alpha: 0.5);
	}

	.fireInfoWindow {
		color: white;
		display: flex;
		position: relative;
		align-items: center;
		min-width: 148px;
		padding: 5px 10px;
		background: #052d48;
		border: 1px solid #38c1ff;
		border-radius: 3px;

		i {
			color: #0ff;
		}

		.closeBtn {
			position: absolute;
			width: 15px;
			height: 15px;
			padding: 2px;
			background: #052d48;
			border: 1px solid #38c1ff;
			border-radius: 100%;
			right: -9px;
			top: -9px;
			z-index: 2;
			cursor: pointer;
		}

		.icon {
			width: 25px;
			margin-right: 7px;
		}
	}

	.hospitalWindow{
		background: #052d48;
		border: 1px solid #38c1ff;
		.closeBtn {
			position: absolute;
			width: 15px;
			height: 15px;
			padding: 2px;
			background: #052d48;
			border: 1px solid #38c1ff;
			border-radius: 100%;
			right: -9px;
			top: -9px;
			z-index: 2;
		}
		img{
			width: 17rem;
		}
	}

</style>
