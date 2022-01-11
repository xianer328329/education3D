<template>
	<div class="viewBtn">
		<i class="el-icon-circle-close partsClose" @click="cancelSelectedOverlay" v-if="partition&&overlay.length>0"></i>
		<a :class="{active:mapType==1}" @click="switchMapType(1)">
			<p class="check" v-if="parts.length>0">
				<el-checkbox v-model="partition" @change="switchPartition(1)">分区显示</el-checkbox>
			</p>
			<img src="../../../../static/images/pt.png" />
			<p>普通地图</p>
		</a>
		<a :class="{active:mapType==3}" @click="switchMapType(3)" v-show="viewBtnUnfold&&mold3D" key='1'>
			<p class="check" v-if="parts.length>0">
				<el-checkbox v-model="partition" @change="switchPartition(3)">分区显示</el-checkbox>
			</p>
			<img src="../../../../static/images/3D.png" />
			<p>3D地图</p>
		</a>
		<a :class="{active:mapType==2}" @click="switchMapType(2)" v-show="school.isScene==1&&viewBtnUnfold" key='2'>
			<p class="check">
				<el-checkbox v-model="checked" @change="switchMapType(2)">开启路网</el-checkbox>
				<el-checkbox v-model="partition" @change="switchPartition(2)"  v-if="parts.length>0">分区显示</el-checkbox>
			</p>
			<img src="../../../../static/images/wx.png" />
			<p>卫星地图</p>
		</a>		
		<a :class="{active:mapType==4}" @click="switchMapType(4)" v-show="viewBtnUnfold" key='4'>
			<img src="../../../../static/images/eagle.png" />
			<p>鹰眼全景</p>
		</a>
		<transition-group enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">			
			<a :class="{active:mapType==5}" @click="switchMapType(5)" v-show="viewBtnUnfold" key='5'>
				<img src="../../../../static/images/model.png" />
				<p>3D建模</p>
			</a>
		</transition-group>
		<div class="openviewBtn" @click="unfolDviewBtn">
			<transition-group enter-active-class="animated rotateIn">
				<img src="../../../../static/images/OPEN.png" v-show="!viewBtnUnfold" key="1" />
				<img src="../../../../static/images/shrink.png" v-show="viewBtnUnfold" key="2" />
			</transition-group>
		</div>
		<model ref="model"></model>
		<eagle ref="eagle"></eagle>
	</div>
</template>

<script>
	import model from './model.vue' //3D建模组件
	import eagle from './eagle.vue' //3D建模组件
	export default{
		components: {
			model,//3D建模组件
			eagle,//鹰眼
		},
		data(){
			return{	
				parts:[],//分区
				viewBtnUnfold: false, //地图模式按钮是否收起		
				checked: false, //路网模式
				partition:false,//是否显示分区
				partOverlays:[],//分区 overlays
				overlay:[],//当前选中的ovelay
			}
		},
		inject:['setmapCenter'],
		props:{
			mapType:{},
			mold3D:{},
			mapJson:{},
			school:{},
			selectedParts:{}
		},
		mounted() {
			this.getPartition();
			this.bus.$on('closeParts',()=>{//关闭分区
				this.closeOverlay();
			})
		},
		methods:{
			switchPartition(type){//显示、隐藏分区
				oMaxmap.remove(this.partOverlays);
				if(this.partition){
					this.overlay=[];
					this.$parent.chageShow=-999;//清除地图右侧图标选中样式
					this.$parent.fixShow=-999;//清除地图底部图标选中样式
					this.setmapCenter();
					
					var overlays=[];
					this.parts.forEach(item=>{
						overlays=overlays.concat(this.newOverlay(item));
					})	
					this.partOverlays=overlays;
					oMaxmap.add(overlays);
				}else{
					this.closeOverlay();
				}
			},
			getPartition(){//获取分区
				var params = {
					unitUuid:UNITID,
					flag:1
				}
				this.$axios.post(process.env.API_OHTTPH+'xxgl/schoolInfo/divisionAreaQuery', params).then((res) => {
					this.parts= res.dataList || [];
				})
			},
			newOverlay(data){
				if(!data.areaDesc) return;
				var polygon=new AMap.Polygon({
					path:JSON.parse(data.areaDesc||'[]'),
					strokeWeight:2,
					fillOpacity:0.2,
					fillColor:data.areaColor,
					strokeColor:data.areaColor,
					zIndex:400
				})
				var marker=new AMap.Marker({
					position:polygon.getBounds().getCenter(),
					offset:new AMap.Pixel(0,0),
					content:'<div class="keyAreaMarker mapTypeMarker" style="color:'+data.areaColor+'"><p class="areaName"><span>'+data.areaName+'</span></p><i class="dot"></i></div>'
				})
				data.overlay=[polygon,marker];
				
				polygon.on('click',(e)=>{
					this.selectedOverlay(data)
				});	
				marker.on('click',(e)=>{
					this.selectedOverlay(data)
				});	
				// polygon.on('dblclick',(e)=>{
				// 	this.cancelSelectedOverlay(data)
				// });
				return data.overlay;	
			},
			//选中ovelay
			selectedOverlay(data){
				if(this.overlay.length==0){
					this.$parent.chageShow=-999;//清除地图右侧图标选中样式
					this.$parent.fixShow=-999;//清除地图底部图标选中样式
					var overlay=data&&data.overlay||[];
					
					this.overlay=overlay;
					this.emitParent();
					
					this.$parent.init(overlay[0].getPath());
					oMaxmap.add(overlay);
					overlay[1].hide();
					this.setFitview(this.overlay);
				}
			},
			//取消选中ovelay
			cancelSelectedOverlay(data){	
				var overlay=data&&data.overlay||[];
				overlay[1]&&overlay[1].show();	
				this.overlay=[];
				this.emitParent();
				this.$parent.init();
				this.switchPartition();
			},
			//关闭ovelay
			closeOverlay(){
				this.partition=false;
				this.partOverlays=[];	
				var length=this.overlay.length;
				this.overlay=[];
				this.emitParent();
				if(length>0){
					this.$parent.init();
					this.setmapCenter();
				}
			},
			emitParent(){
				this.$emit('update:selectedParts',Object.assign([],this.overlay))
			},
			switchMapType(type) { //切换地图类型        *******************
				// if (this.mapType == type && type != 2) {
				// 	return
				// }
				
				if (type == 1) { //普通视图
					this.mapJson.tileLayer.show();
					this.mapJson.satelliteLayer.hide();
					this.mapJson.roadNet.hide();
					this.mold3D ? this.mapJson.buildingLayer.hide() : "";
					if(this.overlay.length>0){
						this.setFitview(this.overlay);
					}else{
						oMaxmap.setZoomAndCenter(mapLatJson.bigZoom - 1, [mapLatJson.bigLongitude, mapLatJson.bigLatitude]);
						oMaxmap.panBy(0, 120)
						oMaxmap.setPitch(0.5);
					}
				} else if (type == 2) { //卫星视图
					if(this.overlay.length>0){
						this.setFitview(this.overlay);
					}else{
						oMaxmap.setZoomAndCenter(mapLatJson.bigZoom - 1, [mapLatJson.bigLongitude, mapLatJson.bigLatitude]);
						oMaxmap.panBy(0, 120)
						oMaxmap.setPitch(0.5);
					}
					
					this.mold3D ? this.mapJson.buildingLayer.hide() : "";
			
					if (this.checked) {
						this.mapJson.satelliteLayer.show();
						this.mapJson.roadNet.show()
						this.mapJson.tileLayer.hide();
					} else {
						this.mapJson.satelliteLayer.show();
						this.mapJson.roadNet.hide()
						this.mapJson.tileLayer.hide();
					}
				} else if (type == 3) { //3D视图
					this.mapJson.tileLayer.show();
					this.mapJson.buildingLayer.show();
					this.mapJson.satelliteLayer.hide();
					this.mapJson.roadNet.hide();
					if(this.overlay.length>0){
						this.setFitview(this.overlay);
					}else{
						oMaxmap.setZoomAndCenter(mapLatJson.bigZoom, [mapLatJson.bigLongitude, mapLatJson.bigLatitude]);
						oMaxmap.setPitch(60);
					}
				}else if(type==4){//鹰眼
					this.$refs.eagle.show(2);
					return;
				}else if(type==5){//3D建模
					this.$refs.model.show();
					return;
				}
				this.$emit('update:mapType',type);
			},
			setFitview(overlay){
				oMaxmap.setFitView(overlay[0],false,[0,0,0,0],20);
				oMaxmap.panBy(100, 0)
			},
			unfolDviewBtn() { //地图模式按钮收缩
				this.viewBtnUnfold = !this.viewBtnUnfold
			},
		}
	}
</script>

<style lang="scss">
	 .keyAreaMarker.mapTypeMarker{
		 &:after{
			 opacity: 1;
		 }
	 	.areaName{
			background-color: currentcolor;
			transform: translateX(-50%);
			margin-left: 0;
			span{
				background: transparent;
				text-align: center;
				// color: #041926;
			}
			&:after{
				display: none;
			}
		}
	 }
</style>

<style lang="scss" scoped="scoped">
	.viewBtn {
		position: absolute;
		left: 1rem;
		bottom: 0px;
		z-index: 6;
		.partsClose{
			position: fixed;
			top: 2rem;
			margin-right: 60px;
			z-index: 6;
			font-size: 2rem;
			color: white;
			cursor: pointer;
		}
		a {
			display: inline-block;
			// width: 8rem;
			// height: 5rem;
			// margin-right: 0.5rem;
			width: 4.8rem;
			height: 3.5rem;
			margin-right: 0.2rem;
			border-radius: 0.5rem;
			position: relative;
			overflow: hidden;
			cursor: pointer;
			border: 1px solid rgba(6, 122, 183, 1);
	
			&.active {
				/*border:1px solid rgba(6,122,183,1);*/
				border: 1px solid #0ff;
			}
	
			&:hover .check {
				display: block;
	
			}
	
			img {
				width: 100%;
				height: 100%;
			}
	
			p {
				padding: 0px 0.5rem;
				line-height: 1.2rem;
				background: rgba(0, 0, 0, 0.5);
				color: white;
				font-size: 0.6rem;
				position: absolute;
				left: 0px;
				right: 0px;
				bottom: 0px;
				text-align: right;
	
				&.check {
					display: none;
					bottom: auto;
					top: 0px;
					text-align: left;
					/deep/{
						&,.el-checkbox__label{
							line-height: 0.8rem !important;
						}
						span {
							color: white;
							font-size: 0.6rem;
						}

						.el-checkbox__label {
							padding-left: 5px;
						}

						.el-checkbox__inner {
							width: 0.6rem;
							height: 0.6rem;
							border: 1px solid #409EFF;
						}

						.el-checkbox__input.is-checked .el-checkbox__inner,
						.el-checkbox__input.is-indeterminate .el-checkbox__inner {
							background-color: #409EFF;
							border-color: #409EFF;
						}

						.el-checkbox__inner::after {
							left: 0.15rem;
							top: 0.05rem;
							width: 0.15rem;
							height: 0.3rem;
						}

						.el-checkbox__input.is-checked+.el-checkbox__label {
							color: white;
						}
					}
				}
			}
		}
	
		.openviewBtn {
			// width: 1.5rem;
			// height: 5rem;
			width: 1.2rem;
			height: 3.5rem;
			background: rgba(0, 21, 37, 1);
			border: 1px solid rgba(6, 122, 183, 1);
			border-radius: 0.5rem;
			display: inline-block;
			box-sizing: border-box;
			overflow: hidden;
	
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
	
</style>
