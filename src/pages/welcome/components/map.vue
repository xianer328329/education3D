<template>
	<div>
		<div  class="h-map" id="welcomeMap"></div>
	</div>
</template>

<script>
	export default {
		name: 'hmap',		
		data() {
			return {
				
			}
		},
		mounted: function() {
			this.initMap();
		},
		methods: {
			initMap(){
				var map = new BMap.Map("welcomeMap");//105.403765, 39.914850
				map.centerAndZoom(new BMap.Point(105.754677,29.449727), 18);
				
				//获取中国行政区域
				this.getBoundary(map);
				
				map.enableScrollWheelZoom();
				map.setMapStyle({styleJson: myStyleJson });
				
				//添加地图类型控件
				map.addControl(new BMap.MapTypeControl({
					mapTypes:[
			            BMAP_NORMAL_MAP,
			            BMAP_SATELLITE_MAP,
			            BMAP_HYBRID_MAP
			        ],
			        anchor: BMAP_ANCHOR_TOP_RIGHT
				}));
				
				//添加全景控件
				
				// 全景覆盖区域图层
				map.addTileLayer(new BMap.PanoramaCoverageLayer());
	
				var stCtrl = new BMap.PanoramaControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}); //构造全景控件
				stCtrl.setOffset(new BMap.Size(50, 50));
				map.addControl(stCtrl);

			},
			getBoundary(map){
				var bdary = new BMap.Boundary();
			    bdary.get('中国', function(rs){       //获取行政区域
			        map.clearOverlays();        //清除地图覆盖物       
			        var count = rs.boundaries.length; //行政区域的点有多少个
			        for(var i = 0; i < count; i++){
			            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 3, strokeColor: "#0ff",fillColor:'transparent'}); //建立多边形覆盖物
			            map.addOverlay(ply);  //添加覆盖物
//			            map.setViewport(ply.getPath());    //调整视野         
			        }   
			    });   
			}
		},
	}
</script>

<style lang="scss" scoped>
	.h-map{
		position: absolute;
		bottom: 311px;
		right: 516px;
		left: 0px;
		top: 0px;
		background: #08304a !important;
	}
</style>
<style lang="scss">
	[id*=PanoramaFlashWraperTANGRAM]{
		color: white;
		font-size: 30px;
		text-align: center;
		line-height: 200px;
	}
	.BMap_noprint span{
		font-size: 14px;
	}
</style>