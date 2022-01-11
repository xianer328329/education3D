<template>
	<div class="draw-container">
		 <div style="display: none;">
		 	<div class="draw-list-container" ref="list">
		 		<div style="display: none;">
		 			<div class="closeIcon" ref="close"><span>电子围栏</span><img src="../../../static/images/map/guanbi.png" @click="closeDraw"/></div>
		 		</div>
			 	<a @click="operate(1)" :class="{'active':type==1}">
			 		<b class="Z-numberf">{{camerasDevices.total}}</b>
			 		<img src="../../../static/images/img4.png"/>
			 		<div>
			 			<img src="../../../static/images/map/c4on.png" class="icon"/><span>摄像头</span>
			 		</div>
			 	</a>
			 	<a @click="operate(2)" :class="{'active':type==2}">
			 		<b class="Z-numberf">{{firesDevices.total}}</b>
			 		<img src="../../../static/images/img4.png"/>
			 		<div>
			 			<img src="../../../static/images/map/c5on.png"  class="icon"/><span>消防栓</span>
			 		</div>
			 	</a>
			 	<!--列表-->
			 	<div class="Z-mapPopout Z-mapMon" v-show="type!=''">
			 		<div class="Z-mapPopoutF">
						<div v-show="type==1">
							<h5 class="PopoutTop"><span class="noFlex" >状态</span><span>设备ID</span><span>位置</span><b></b></h5>
							<!-- @click="type=''" -->
							<img class="closeInfoWindow" src="../../../static/images/Zgb.png" alt="" @click="closeDraw"/>
							<ul>
								<!--:class="{'active':device.deviceCode==item.deviceCode}"-->
								<li class="clearFix" @click="markeup(item)" :class="{'active':device.deviceCode==item.deviceCode}"  v-for="(item,index) of camerasDevices.data" :key="index" :oUrl="item.deviceUrl" :name="item.deviceName" :type="item.videoPlatformType">
									<span class="noFlex" :title="item.deviceStatusName" :class="{'typerad':item.deviceStatusName=='离线'}">{{item.deviceStatusName}}</span>
									<span :title="item.deviceCode">{{item.deviceCode}}</span>
									<span :title="item.deviceName">{{item.deviceName}}</span>
									<img class="Z-monitoringC" src="../../../static/images/map/icon_tv.png" alt="" @click.stop="showVideo(item)"/>
									<img class="Z-monitoringC playback_icon" src="../../../static/images/map/icon_playback.png" alt="" @click.stop="playbackVideo(item)"/>
								</li>
							</ul>
						</div>
						<div v-show="type==2">
							<h5 class="PopoutTop"><span>设备ID</span><span>位置</span></h5>
							<img class="closeInfoWindow" src="../../../static/images/Zgb.png" alt="" @click="closeDraw"/>
							<ul>
								<li class="clearFix" @click="markeup(item)" :class="{'active':device.deviceCode==item.deviceCode}" v-for="(item,index) of firesDevices.data" :key="index" :oUrl="item.deviceUrl" :name="item.deviceName" :type="item.videoPlatformType">
									<span :title="item.deviceCode">{{item.deviceCode}}</span>
									<span :title="item.position">{{item.position}}</span>								
								</li>
							</ul>
						</div>
						<div class="Z-lyPage">
							<img src="../../../static/images/first_page.png" @click="goPage('first')" />
							<img src="../../../static/images/last.png" @click="goPage('prev')"/>
							<p>第<input type="text" v-model.number="search.page">页    共<span>{{search.total}}</span>页  <i @click="goPage('jump')">跳转</i></p>
							<img src="../../../static/images/next.png" @click="goPage('next')" /><img @click="goPage('last')" src="../../../static/images/last_page.png"/>
						</div>
					</div>
			 	</div>
			 </div>
		 </div>		 
		 <playback  ref="playback"></playback>
	</div>
</template>

<script>
	/* eslint-disable oMaxmap */
	export default {
		name: 'DateSelc',
		data() {
			return {
				mouseTool:'',
				drawStyle:{
				  zIndex:2000,
	              fillColor:'rgba(37,54,66,0.4)',
	              strokeColor:'#00FFFF',
	              strokeWeight:2,
	              strokeStyle:'dashed',
	              fillOpacity:0
	              //同Polygon的Option设置
	            },
	            search:{
	            	page:1,
	            	currentPage:1,
	            	pageSize:8,
	            	total:0
	            },
	            device:{},//当前选中设备
	            marker:'',
	            firesDevices:{data:[],total:'--',totalPage:0},//
	            camerasDevices:{data:[],total:'--',totalPage:0},//设备列表
	            overlays:[],//覆盖物
	            fires:[],//范围内的消防栓
	            cameras:[],//范围内的摄像头
	            type:1,
				angle:5,//俯视角度
			}
		},
		props:{
			icons:{
				type:Array,
				'default'(){
					return [];
				}
			}
		},
		watch:{
			overlays(newvalue){
				if(newvalue.length==0){
					this.device={};
				}
			},
		},
		components:{
			playback:()=>import('./playback.vue'),
		},
		methods: {
			//初始化绘画功能
			initDraw(status){
				var vm=this;
				if(oMaxmap==null){status='';return;};
				if(this.mouseTool==''){
					this.mouseTool = new AMap.MouseTool(oMaxmap);
					this.mouseTool.on('draw',function(e){
						vm.mouseTool.close();
						vm.$emit('closeDraw');
						vm.handle(e.obj,['58','61']);
					})
				}
				if(vm.overlays.length>0){
					oMaxmap.remove(vm.overlays);
					vm.overlays=[];
					vm.type=1;
				}
				
				switch (status){
			        case 'polygon':{
			        	oMaxmap.setPitch(vm.angle);
			            vm.mouseTool.polygon(vm.drawStyle);
			            break;
			        }
			        case 'rectangle':{
			        	oMaxmap.setPitch(vm.angle);
			            vm.mouseTool.rectangle(vm.drawStyle);
			            break;
			        }
			        case 'circle':{
			        	oMaxmap.setPitch(vm.angle);
			            vm.mouseTool.circle(vm.drawStyle); 
			            break;
			        }
					default:
						oMaxmap.setPitch(60);
						vm.mouseTool.close();
						break;
				}
			},
			//判断图标是否在圈内
			handle(obj,types){
				var vm=this,fires={lng:[],lat:[]},cameras={lng:[],lat:[]},path=obj.getPath();
				vm.icons.forEach(item=>{
					//58为摄像头，61为消火栓
					if(types.indexOf(item.type)>-1){
						item.list.forEach(value=>{
							 try{
							 	var isPointInRing = AMap.GeometryUtil.isPointInRing(value.lnglat,path);
								if(isPointInRing){//在圈内
									if(item.type==58){
										cameras.lng.push(value.lnglat[0]);
										cameras.lat.push(value.lnglat[1]);
									}else if(item.type==61){
										fires.lng.push(value.lnglat[0]);
										fires.lat.push(value.lnglat[1]);
									}
								}
							 }catch(e){
//							 	console.log(value)
							 }
						});
					}
				});
				vm.fires=fires;
				vm.cameras=cameras;
				vm.markup(obj);
			},
			//地图添加覆盖物
			markup(obj){
				var vm=this;
				vm.type=1;
				var bounds=obj.getBounds();
				var marker = new AMap.Marker({
					isCustom: true,  //使用自定义窗体
			        map: oMaxmap,
			        content:vm.$refs.list,
			        position:bounds.getNorthEast(),
			        zIndex:200,
			   });
			   var close = new AMap.Marker({
			        map: oMaxmap,
			        content:vm.$refs.close,
			        position:bounds.getCenter(),
			        zIndex:200,
			        offset:new AMap.Pixel(-5,5)
			    });
			    vm.overlays.push(obj);
			    vm.overlays.push(marker);
			    vm.overlays.push(close);
			    oMaxmap.setFitView(vm.overlays,true,[20,300,20,500],18);
			    this.getLists(0);
			},
			//获取设备列表
			getLists(init){
				var vm=this;
				if(init==0){//请求全部
					vm.getCameras();
					vm.getFires();
					return;
				}
				if(vm.type==1){
					vm.getCameras();
				}else{
					vm.getFires();
				}
				
			},
			//获取摄像头列表
			getCameras(){
				var vm=this;
				var camerasParams={
					currentPage:vm.search.currentPage.toString(),
					pageSize:vm.search.pageSize.toString(),
					lng:vm.cameras.lng.join(','),
					lat:vm.cameras.lat.join(','),
				}
				this.$axios.post('home/regionalMonitor',camerasParams).then(res=>{
					var total=res.total||0;
					vm.camerasDevices={data:res.data||[],total:total,totalPage:Math.ceil(total/vm.search.pageSize)};
					this.search.total=this.type==1?vm.camerasDevices.totalPage:vm.firesDevices.totalPage;
				})
			},
			//获取消防栓列表
			getFires(){
				var vm=this;
				var firesParams={
					currentPage:vm.search.currentPage.toString(),
					pageSize:vm.search.pageSize.toString(),
					lng:vm.fires.lng.join(','),
					lat:vm.fires.lat.join(','),
				}
				this.$axios.post('home/regionalFire',firesParams).then(res=>{
					var total=res.total||0;
					vm.firesDevices={data:res.data||[],total:total,totalPage:Math.ceil(total/vm.search.pageSize)};
					this.search.total=this.type==1?vm.camerasDevices.totalPage:vm.firesDevices.totalPage;
				});
			},			
			operate(newvalue){
				if(this.type==newvalue)return;
				this.type=newvalue;
				this.search.currentPage=1;
				this.search.page=1;
				this.search.total=this.type==1?this.camerasDevices.totalPage:this.firesDevices.totalPage;
				this.getLists();
			},
			//分页
			goPage(type){
				var vm=this;
				vm.search.currentPage=isNaN(vm.search.page)?vm.search.currentPage:vm.search.page;
				switch (type){
					case 'first':
						vm.search.currentPage=1;
						break;
					case 'prev':
						vm.search.currentPage>1&&vm.search.currentPage--;
						break;
					case 'jump':
						
						break;
					case 'next':
						vm.search.currentPage<vm.search.total&&vm.search.currentPage++;
						break;
					case 'last':
						vm.search.currentPage=vm.search.total;
						break;
					default:
						break;
				}
				if(vm.search.page==vm.search.currentPage)return;
				vm.search.page=vm.search.currentPage;
				this.getLists();
				
			},
			//地图打标
			markeup(item){
				var vm=this;
				this.device=item;
				if(vm.marker){
					oMaxmap.remove(vm.marker);
					var index=vm.overlays.indexOf(vm.marker);
					if(index>-1){
						vm.overlays.splice(index,1);
					}
				}
				var title=vm.type==1?item.deviceName:item['position'];
				var icon=vm.type==1?'c4on.png':'c5on.png';
				var contents='<div class="mapIcon mapIcon2 H-iconCicle" title="'+title+'"><img src="../../../static/images/map/'+icon+'" alt="" /></div>';
				vm.marker=new AMap.Marker({
					map: oMaxmap,
    				position:[item.longitude,item.latitude],
    				content:contents,
   					offset: new AMap.Pixel(-15, -15),
   					title:title,
   					zIndex:201,
    			});
    			vm.overlays.push(vm.marker);
			},
			//实时视频
			showVideo(item){
				var list = {
					playUrl: item.deviceCode,
					show: true,
					subPlatforma: item.videoPlatformType,
					title: item.deviceName,
					real: true,
					isplayback: 1,
					deviceM3u8:item.deviceM3u8,
					deviceRstp:item.deviceRstp,
					subplatform:item.videoPlatformType,
					// deviceIp:item.camerdeviceIp,
					// deviceUser:item.camerDeviceUser,
					// devicePass:item.camerdevicePass,					
				}
				this.bus.$emit('addpop3video',{...item,...list});
			},
			// 回放
			playbackVideo(item){
				var list = {
					...item,
					subPlatform:item.videoPlatformType,
					// deviceIp:item.camerdeviceIp,
					// deviceUser:item.camerDeviceUser,
					// devicePass:item.camerdevicePass,
				}
				this.$refs.playback.autoPlay(2,list);
			},
			//关闭绘画
			closeDraw(){
				var vm=this;
				try{
					vm.mouseTool.close();
					if(vm.overlays.length>0){
						oMaxmap.remove(vm.overlays);
						vm.overlays=[];
					}
					vm.camerasDevices={data:[],total:'--',totalPage:0};
					vm.firesDevices={data:[],total:'--',totalPage:0};
					oMaxmap.setPitch(60);
				}catch(e){
					
				}
			},
		},
		mounted: function() {
			var vm=this;
			this.bus.$on('closeDraw',vm.closeDraw);
		},

	}
</script>

<style lang="scss">
	.closeIcon{
		white-space: nowrap;
		min-width:80px;
		padding: 0px 7px;
		height:26px;
		background:rgba(0,36,61,1);
		border:1px solid rgba(49,133,156,1);
		margin-left: -43px;
		margin-top: -13px;
		span{
			font-size: 16px;
			color: #75CBF2;
			vertical-align: middle;
		}
		img{
			display: inline-block;
			vertical-align: middle;
			margin-left: 4px;
			color: #FFFFFF;
			width:15px;
			height:15px;
			background:rgba(43,98,133,1);
			border-radius:50%;
		}
	}
	.draw-list-container{
		white-space: nowrap;
		margin-left: 20px;
		user-select:none;
		a{
			display: inline-block;
			padding: 0.5rem 0.3rem 0.3rem 0px;
			border: 2px solid #0A507A;
			text-align: center;
			min-width: 9.2rem;
			box-sizing: border-box;
			background:#0A3F5E;
			margin:0.5rem 0px 0.5rem 0.5rem;
			&.active{
				border: 2px solid #0ff;
			}
			*{
				vertical-align: middle;
				white-space: normal;
			}
			b{
				display: block;	
				color: #0ff;	
				font-size: 1.2rem;
			}
			img{
				display: block;
				margin: 0.2rem auto;
				width: 7rem;
			}
			.icon{
				display: inline-block;
				width: 1.6rem;
				margin: 0px 0px 0px -0.3rem;
			}
			span{
				color: #75CBF2;
				font-size: 0.8rem;
			}
		}
		.el-table{
			min-height: 4rem;
			margin-bottom: 2.5rem;
			.Z-monitoringC{
				display: inline-block;
			}
		}
		.Z-lyPage *{
			font-size: 0.8rem;
			margin-left: 0.2rem;
		}
		.PopoutTop{
			display: flex;
			span{
				flex: 1;
			}
			b{
				display: inline-block;
				width: 2.05rem;
			}
		}
		.noFlex{
			flex: 0 !important;
			width: 4rem;
			flex-basis: 4rem !important;
			text-align: center;
		}
		ul{
			min-height: 0.5rem;
			margin-bottom: 2.5rem;
			li{
				display: flex;
				span{
					flex: 1;
				}
			}
			li.active{
				box-shadow: rgb(0, 255, 255) 0px 0px 10px inset;
			}
		}
		.Z-mapMon{
			left: 10px;
			margin-top: 0px;
		}
		.Z-mapPopoutF,.Z-mapMon{
			width: 25rem;
			box-sizing: border-box;
		}
	}
	.H-iconCicle{
		transform-origin: center !important;
		animation: showScale 0.5s linear infinite alternate;
	}
	@keyframes showScale{
		from{transform: scale(1);}
		to{transform: scale(1.5);}
	}
</style>