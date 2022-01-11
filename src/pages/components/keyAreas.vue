<template>
	<el-dropdown class="keyAreas" placement="top" trigger="click" @command="change" @visible-change="visibleChange" v-show="types.length>0">
		<div class="yjbz">重点区域</div>
		<el-dropdown-menu  v-loading="loading" class="h-school keyAreas-drop" slot="dropdown">
			<el-dropdown-item v-for="(item,index) in types"  :command="item" :key="index">
				<el-checkbox v-model="selectedTypes[item.dictValue]&&selectedTypes[item.dictValue].selected"></el-checkbox>
				<i class="areaName">{{item.dictValue}}</i>
			</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
	export default{
		data(){
			return{
				areas:{},
				types:[],
				selectedTypes:{},
				loading:false,
				vectorLayer:'',//矢量图层
			}
		},
		inject:['setmapCenter'],
		props:{
			oMaxmap
		},
		mounted() {
			this.bus.getDic('areaType','区域类型').then(data=>{
				this.types=data;
			})
		},
		methods:{
			visibleChange(type){
				try{
					if(type&&Object.keys(this.areas).length==0){
						this.getPoints();
					}
				}catch(e){
					this.getPoints();
				}
			},
			getPoints() {
				this.loading=true;
				var params = {
					// areaName: vm.iconName,
					// schoolUuid: this.listinfo.uuid,
					unitUuid:UNITID
				}
				this.$axios.post(process.env.API_OHTTPH+'xxgl/schoolInfo/areaQuery', params).then((res) => {
					var data = res.dataList || [],obj = {};
					data.forEach((item, index) => {
						if (obj[item.areaType]) obj[item.areaType].push(item)
						else obj[item.areaType] = [item];
					});
					this.areas=obj;					
					this.loading=false;
				})
			},
			change(item){
				if(!this.oMaxmap)return 
				
				if(aMapVersion==2&&!this.vectorLayer){//添加矢量图层
					this.vectorLayer = new AMap.VectorLayer({
						zIndex:140
					});
					this.oMaxmap.add(this.vectorLayer);
				}
				
				let obj=this.selectedTypes[item.dictValue];
				if(obj){
					obj.selected=!obj.selected;
				}else{
					this.$set(this.selectedTypes,item.dictValue,{selected:true})
					obj=this.selectedTypes[item.dictValue];
				}

				if(this.areas[item.dictValue]){
					if(!this.selectedTypes[item.dictValue].overlays){
						var overlays=[];
						this.areas[item.dictValue].forEach(item=>{
							overlays=overlays.concat(this.newOverlay(item));
						})
						this.selectedTypes[item.dictValue].overlays=overlays;
					}
					
					if(obj.selected){	
						this.$parent.chageShow=-999;//清除地图右侧图标选中样式
						this.$parent.fixShow=-999;//清除地图底部图标选中样式
						this.setmapCenter();
						if(aMapVersion==1){
							this.oMaxmap.add(this.selectedTypes[item.dictValue].overlays);//高德v1.4.15
						}else{
							this.vectorLayer.add(this.selectedTypes[item.dictValue].overlays);//高德v2.0
						}
						
					}else{
						if(aMapVersion==1){
							this.oMaxmap.remove(this.selectedTypes[item.dictValue].overlays);//高德v1.4.15
						}else{
							this.vectorLayer.remove(this.selectedTypes[item.dictValue].overlays);//高德v2.0
						}
					}
				}
			},
			newOverlay(data){
				if(!data.areaDesc) return;
				var polygon=new AMap.Polygon({
					path:JSON.parse(data.areaDesc||'[]'),
					strokeWeight:2,
					fillOpacity:0.4,
					fillColor:data.areaColor,
					strokeColor:data.areaColor,
					zIndex:400
				})
				var marker=new AMap.Marker({
					position:polygon.getBounds().getCenter(),
					offset:new AMap.Pixel(0,0),
					content:'<div class="keyAreaMarker" style="color:'+data.areaColor+'"><p class="areaName"><span>'+data.areaName+'</span></p><i class="dot"></i></div>'
				})
				data.overlay=[polygon,marker];
				return data.overlay;	
			},
			remove(){
				// for(var k in this.selectedTypes){
				// 	this.selectedTypes[k].overlays&&this.oMaxmap.remove(this.selectedTypes[k].overlays);
				// }
				// this.selectedTypes={};
			},
		}
	}
</script>

<!-- 重点区域marker样式 -->
<style lang="scss">
	.keyAreas.el-dropdown .yjbz{
	    background: #0479B7;
	}
	.keyAreas-drop{
		.el-checkbox,.areaName{
			vertical-align: middle;
			pointer-events: none;
		}
		.el-checkbox__input{
			font-size: 0.7rem !important;
		}
	}
	.keyAreaMarker{
		position: relative;
		*{
			color: inherit;
		}
		.areaName{
			white-space: nowrap;
			position: absolute;
			left: 50%;
			bottom: 2.5rem;
			margin-left: -0.4rem;
			min-width: 2.5rem;
			z-index:3;
			// overflow: hidden;
			border-radius: 0.25rem;
			border: 1PX solid transparent;
			span{	
				display: block;
				font-size: 0.7rem;				
				color: #fff;
				background: rgba(15,46,66,0.90);
				padding: 0px 0.25rem;	
				line-height: 1.25rem;
				border-radius: 0.25rem;
			}
			
			&:after {
			  content: '';
			  position: absolute;
			  top:-1PX;
			  left:-1PX;
			  bottom: -1PX;
			  right: -1PX;
			  background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
			  border-radius: 2PX;
			  z-index: -1;
			  animation: animatedgradient 3s ease alternate infinite;
			  background-size: 300% 300%;
			  border-radius: 0.25rem;
			}
			
			
			@keyframes animatedgradient {
				0% {
					background-position: 0% 50%;
				}
				33% {
					background-position: 50% 50%;
				}
				66% {
					background-position: 100% 50%;
				}
				100% {
					background-position: 0% 50%;
				}
			}
		}
		&::before{
			content: '';
			width: 0.45rem;
			height: 0.25rem;
			border-radius: 100%;
			background: currentcolor;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			z-index: 1;
		}
		&::after{
			content: '';
			width: 1PX;
			height: 2.35rem;
			background: currentcolor;
			opacity: 0.6;
			position: absolute;
			left: 50%;
			bottom: 0.1rem;
			transform: translate(-50%,0);
			z-index: 2;
		}
		
		.dot{
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			width: 1PX;
			height: 0.25rem;
			background: linear-gradient(0deg,rgba(255,255,255,0.5),currentcolor);
			animation: keyAreasDot 2s linear infinite;
			border-radius: 100%;
			opacity: 0.5;
		}
		@keyframes keyAreasDot{
			0%{
				bottom: 0;
			}
			100%{
				bottom: 2.1rem;
			}
		}
	}
</style>
