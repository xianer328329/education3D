<template>
	<div class="h-map">
		<div id="map"></div>
	</div>
</template>

<script>
	var Hmap;
	export default {
		name: 'MapCom',
		data() {
			return {
				show: false,
				fixShow:6,
				chageShow:null,
			}
		},
		mounted: function() {
			var vm=this;
			
			Hmap = new BMap.Map("map", { enableMapClick: false });
			
			var point = new BMap.Point(105.947443,29.353063);
			Hmap.centerAndZoom(point,16);
			this.getMapCenter() //获取地图中心点 缩放层级
			Hmap.setMapStyle({styleJson: myStyleJson });
			Hmap.enableScrollWheelZoom();
			
			
			this.bus.$off('getTrail').$on('getTrail',function(data){
				vm.getTrail(JSON.parse(data))
			})
		},
		methods: {
			//获取车辆轨迹
			getTrail(car){
				var vm=this;
				if(car.carPlate){
					var param = new FormData();
        			param.append('date',new Date(car['date']).toJSON());
        			param.append('timeFlag',car.curr*24);
        			param.append('carPlate ',car.carPlate);
					this.$axios.post('traffic/pass/carTrajectory',param).then(function(res){
						vm.drawTrail(res.data.data.trajectory);
					});
				}
			},
			//画车辆轨迹
			drawTrail(points){
				var vm=this;
				Hmap.clearOverlays();
				var arr=[];
				points=points.sort(function(a,b){
					return a.unitIndex-b.unitIndex
				});
				points.forEach(function(value){
					var pt = new BMap.Point(value.longitude,value.latitude);
					arr.push(pt);
					//轨迹点
					var myIcon = new BMap.Icon(require('../../../../static/images/carSupervision/lod.png'),new BMap.Size(26,68),{
						imageSize:new BMap.Size(26,34),
						imageOffset:new BMap.Size(0,0)
					});
					var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
					Hmap.addOverlay(marker);
					
					///添加顺序数字
					var opts = {
					  position : pt,    // 指定文本标注所在的地理位置
					  offset   : new BMap.Size(-26, -32)    //设置文本偏移量
					}
					var label = new BMap.Label(value.unitIndex, opts);  // 创建文本标注对象
						label.setStyle({
							 color : "#00FFFF",
							 fontSize : "12px",
							 width:'50px',
							 textAlign:'center',
							 height : "20px",
							 lineHeight : "20px",
							 backgroundColor:'transparent',
							 border:'none',
						 });
					Hmap.addOverlay(label);
					//信息窗口
					var opts = {
					  position : pt,    // 指定文本标注所在的地理位置
					  offset   : new BMap.Size(0, 0)    //设置文本偏移量
					}
					var template='<div class="infoBox"><p>'+(value.rpassTime||'')+'</p><p>'+value.unitName+'</p></div>';
					var label = new BMap.Label(template, opts);  // 创建文本标注对象
						label.setStyle({
							 color : "#00FFFF",
							 fontSize : "10px",
							 backgroundColor:'rgba(0,22,38,0.77)',
							 border:'1px solid #00FFFF',
							 padding:'5px 10px',
							 lineHeight:'20px',
							 minWidth:'120px'
						 });
					Hmap.addOverlay(label);
				});
							
				//添加轨迹线(驾车路线)
				if(arr.length>1){
					try{
						for(var i=1,len=arr.length;i<len;i++){
							var p1 =arr[i-1];
							var p2 = arr[i];
							var driving = new BMap.DrivingRoute(Hmap);
							driving.setSearchCompleteCallback(function(res){
								try{
									var plan=res.getPlan(0);
									plan.dk[0].zr.unshift(res.Rv.point);
									plan.dk[0].zr.push(res.cv.point);
									vm.addBackground(plan.dk[0].zr);
								}catch(e){
									console.log(e.message)
									var CurveLine = new BMapLib.CurveLine(arr,{strokeColor:"#FF9900", strokeWeight:3});
									Hmap.addOverlay(CurveLine);
								}
							})
							driving.search(p1,p2);
						}
					}catch(e){
						var CurveLine = new BMapLib.CurveLine(arr,{strokeColor:"#FF9900", strokeWeight:3});
						Hmap.addOverlay(CurveLine);
					}
				}

				//设置地图最佳缩放
				Hmap.setViewport(arr,{
					enableAnimation:false
				});	
//				vm.addBackground(arr)
						
			},
			//折线添加箭头
			addBackground(arr){
				var imgurl=BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW;
				
				var sym = new BMap.Symbol(imgurl, {
				    fillColor : '#FFF', //设置矢量图标的填充颜色。支持颜色常量字符串、十六进制、RGB、RGBA等格式
	                fillOpacity : 0, //设置矢量图标填充透明度,范围0~1
	                scale : 1, //设置矢量图标的缩放比例
	                rotation : 0, //设置矢量图标的旋转角度,参数为角度
	                strokeColor : 'black', //设置矢量图标的线填充颜色,支持颜色常量字符串、十六进制、RGB、RGBA等格式
	                strokeOpacity : 0, //设置矢量图标线的透明度,opacity范围0~1
	                strokeWeight : 2, //设置线宽。如果此属性没有指定，则线宽跟scale数值相
				});
				var icons = new BMap.IconSequence
				(
					sym, //symbol为符号样式
	                '5%', //offset为符号相对于线起点的位置，取值可以是百分比也可以是像素位置，默认为"100%"
	                '50%', //repeat为符号在线上重复显示的距离，可以是百分比也可以是距离值，同时设置repeat与offset时，以repeat为准
	                false //fixedRotation设置图标的旋转角度是否与线走向一致，默认为true
			    );
				var polyline =new BMapLib.CurveLine(arr, {
//				    icons:[icons], //图标集合  
	                strokeColor : '#FF9900', //折线颜色 尽量与图标填充色保持一样
	                strokeOpacity: 1, //折线的透明度，取值范围0 - 1
	                strokeWeight:4, //折线的宽度，以像素为单位
				});
				
				Hmap.addOverlay(polyline);
			},
			//获取地图中心点 缩放层级
			getMapCenter() { 
				var _this = this;
				this.$axios.post("home/systemInfo")
					.then(function(res) {
						var data = res.data.data;
						mapLatJson = {
							bigLatitude: data.bigLatitude,
							bigLongitude: data.bigLongitude,
							bigZoom: data.bigZoom,
							uuid: data.uuid,
						}
						_this.getMapFence(data.uuid); //地图获取电子围栏
					})
			},
			//获取地图电子围栏接口请求函数
			getMapFence(uuid) {
				this.$axios.post('home/schoolMapInfo/' + uuid)
					.then(this.MapFenceSucc)
			},
			//获取地图电子围栏接口接收函数
			MapFenceSucc(res) { 
				var arr = [];
				var data = res.data.data.features[0].geometry.coordinates[0];
				if(data) {
					for(var i = 0; i < data.length; i++) {
						arr[i] = data[i][0] + ',' + data[i][1];
					}
					var Mappoints = arr.join(";");
					this.MapFence(Mappoints) //画地图围栏
				}
			},
			/*画地图围栏*/ 
			MapFence(Mappoints){
				var ply = new BMap.Polygon(Mappoints,{strokeWeight:3, strokeColor: "#49BFE2", fillOpacity: 0.03, fillColor: "#ffffff"}); //建立多边形覆盖物
				ply.disableMassClear();
				Hmap.addOverlay(ply);
				var point = new BMap.Point(mapLatJson.bigLongitude,mapLatJson.bigLatitude);
				Hmap.setViewport(ply.getPath(),{
					enableAnimation:true
				});		
			},
			
		},
	}
</script>

<style lang="stylus" scoped>
	.h-map{
		position: absolute;
		top: 0px !important;
		bottom:310px;
		left: 0px;
		right:509px;
		background: #08304a !important;
		div{
			width: 100%;
			height: 100%;
			background: #08304a !important;
		}
	}
</style>
<style lang="stylus">
	.infoBox{
		p{
			font-size: 14px;
		}
	}
	
</style>