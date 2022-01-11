<template>
	<div class="search-camera" id="searchCamera">
		<el-input placeholder="输入监控名称查找" v-model="keyword"  class="search-camera-input" @keyup.enter.native="search" :class="{'focus':keyword}">
		    <div slot="append">
				<i  class="el-icon-circle-close" @click="clearable" v-if="keyword"></i>
				<i  class="el-icon-search" @click="search"></i >
			</div>
		</el-input>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				keyword:'',
			}
		},
		methods:{
			clearable(){
				this.keyword='';
			},
			search(){
				var params=new FormData();
				params.append('iconName',this.keyword);
				params.append('iconType',58);
				this.$axios.post('home/iconDeviceList',params).then((res)=>{
					this.$parent.chageShow=-999;//清除地图右侧图标选中样式
					this.$parent.fixShow=-999;//清除地图底部图标选中样式
					var data=res.list||[];
					this.addMarker(data);
				})
			},
			addMarker(data){
				this.$parent.setmapCenter();
				this.$parent.cameraName=this.keyword;
				var Obj={
					type: "58",
					name: "监控设备",
					img: "c4on.png",
					img2: "c4two.png",
				};				
				var markers = [],points=[],contents='';
				var oimg2 = Obj.img2 || Obj.img;
				var oclassName = "mapIconA" + Obj.type;
				
				for(var i=0;i<data.length;i++){
					data[i].count=1;
					data[i].mergeName=data[i].deviceName;
					data[i].searchName=this.keyword;
					for(var j=i+1;j<data.length;j++){
						try{
							if(data[i].longitude==data[j].longitude&&data[i].latitude==data[j].latitude){
								data[i].count++;
								data[i].mergeName+=','+data[j].deviceName;
								data.splice(j,1);
								j--;
							}
						}catch(e){
							console.log(data[i],data[j])
						}
					}
				}
				data.forEach((itme, index) => {
					itme.lnglat=[itme.longitude, itme.latitude];
					var oitme = JSON.stringify(itme);
					contents = "<div class='mapIcon " + oclassName + "' oitme='" + oitme +"'><img src='../../../static/images/map/" + Obj.img + "' alt=''/><i class='font'>" + itme.mergeName + "</i></div>"
					var marker = new AMap.Marker({
						position:itme.lnglat,
						content: contents,
						offset: new AMap.Pixel(-15, -15),
						title: itme.mergeName
					})
					marker.count=itme.count;
					markers.push(marker);
					points.push({lnglat:itme.lnglat})
				})
				var _renderClusterMarker = function(context) {
					var count=0;
					context.markers.forEach(item=>{
						count+=item.count;
					})
					var ohtml = '<div class="mapIcon mapIcon2"><img src="../../../static/images/map/' + oimg2 +'" alt="" /><i class="font">' + count + '</i></div>'
					context.marker.setContent(ohtml)
				};
				var _renderMarker = function(context) {//非聚合点渲染方法
					context.marker.setContent(contents)
				};
				var MarkerClusterer=aMapVersion==1?markers:points;//高德v1.4.15 markers，v2.0 points
				this.$parent.mapJson.cluster = new AMap.MarkerClusterer(oMaxmap, MarkerClusterer, {
					gridSize: 60,
					maxZoom: 19,
					renderClusterMarker: _renderClusterMarker,//聚合点渲染方法
					renderMarker:_renderMarker  //非聚合点渲染方法
				});
			}
		}
	}
</script>

<style lang="scss">
	.search-camera{
		position: absolute;
		top: 5rem;
		// left: 12.3rem;
		margin-left: 0.5rem;
		z-index: 1001;
		cursor: pointer;
		.search-camera-input{
			min-width: 2.5rem;
			min-height: 2rem;
			vertical-align: middle;
			&:hover,&.focus{
				.el-icon-circle-close,.el-input__inner{
					display: inline-block !important;
				}
			}			
			.el-icon-search,.el-icon-circle-close{
				color: #7FE8F9;
				font-size: 1.2rem;
				&.el-icon-circle-close{
					display: none;
				}
			}
			.el-input__inner{
				display: none;
				width: 12rem;
				height: 2rem;
				opacity: 1;
				background: rgba(38,91,120,0.50);
				border: 1px solid #265b78;
				font-size: 0.8rem;
				border-radius: 1rem;
				box-sizing: content-box;
				&::-webkit-input-placeholder,&{
					color: #7FE8F9;
				}
			}
			.el-input-group__append{
				position: absolute;
				padding:0 !important;
				background: transparent !important;
				right: 1rem;
				top: 50%;
				width: auto !important;
				transform: translateY(-50%);
			}
		}
	}
</style>
