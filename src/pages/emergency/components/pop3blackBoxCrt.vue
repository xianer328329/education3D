<template>
	<div>
		<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
			<div class="crt-modal scaleZoom" v-if="curr!=0" @click="close">
				 <div class="crt-modal-content" :class="{fullScreen:full}" @click.stop="">
				 	<div class="crt-header">
				 		<h1>{{title}}{{' '+lists.length>0?lists[currIndex].fname:''}}</h1>
				 		<img :src="require('../../../../static/images/'+(full?'notfull':'full')+'.png')" class="full" @click="toggeleFull"/>
				 		<i class="el-icon el-icon-close close" @click="close"></i>
				 	</div>
				 	<div class="fire-container" ref="dragContainer"  v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
						<div class="img-c" ref="scaleContainer" :style="styles">
							<div v-for="(list,dataIndex) in lists" v-if="currIndex==dataIndex" :key="dataIndex" :style="{transform:'scale('+rate+')'}">
								<!--<embed src="chinaPolyline.svg" class="main-img" width="900" height="500" type="image/svg+xml"pluginspage="https://www.adobe.com/svg/viewer/install/" />-->
								<img :src="imgPrefix+list.imgSrc" :style="{opacity:list.imgSrc?1:0}" class="main-img" @load="imgLoad" ref="mainImg"/>
								<div class="modal-drag"></div>
								<div class="icon-c" v-for="(item,index) in list.icons" :style="{left:item.deviceleft+'px',top:item.devicetop+'px','z-index':item.zIndex||5}"  :key="index">
									<div class="icon" @mouseenter="mouseenter(item)" @click="showPop(item)" :class="{'active':item.pop,'fire':item.alarmType==1,'warn':item.alarmType==2,'fault':item.alarmType==0,'other':item.alarmType==3,'normal':item.alarmType==null,'curr':curr==1&&list.deviceCode==item.devicecode}">
										<img  src="../../../../static/images/loc.png" v-if="curr==1&&list.deviceCode==item.devicecode"/>
										<!--pluginspage="https://www.adobe.com/svg/viewer/install/"-->
										<embed :src="require('../../../../static/images/device.svg')" v-else width="15" height="15" type="image/svg+xml" ></embed>
										<div class="modal-drag"></div>
										<span class="devicename">{{item.devicename}}</span>
									</div>
									<div class="H-mapPopoutF" v-show="item.pop" v-loading="item.loading" element-loading-background="rgba(0, 0, 0, 0.8)">
										<h5 class="PopoutTop">{{item.alarmTypeName}}<i class="el-icon el-icon-close close" @click.stop="closePop(item)"></i></h5>
										<ul>
											<li class="clearFix" v-for="(value,key) in item.rows"><span >{{key}}:</span>
												<p ><i>{{value}}</i></p>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					<p class="img-placeholder" v-if="(lists.length==0&&!loading)||(lists.length>0&&(lists[currIndex].imgSrc==''||lists[currIndex].imgSrc==null))">暂未配置图片</p>
					<div class="tip-button">
						<span class="fire">非法接入</span>
						<span class="warn">设备离线</span>
						<span class="fault">动环监测</span>
						<!--<span class="other">其他</span>-->
					</div>
					<div class="slide-page text-center" v-if="lists.length>1">
						<a @click="prevPage" class="mr" v-if="totalPage>1"><</a>
						<el-button class="mb20 mr10" v-if="page>1">...</el-button>
						<el-button class="mb20 mr10" :class="{active:currIndex==dataIndex}" v-if="dataIndex>=(page-1)*size&&dataIndex<page*size" v-for="(list,dataIndex) in lists" @click="changeFloor(dataIndex)" :key="dataIndex">{{list.fname||'未定义'}}</el-button>
						<el-button class="mb20 mr10" v-if="page<totalPage">...</el-button>
						<a @click="nextPage" class="ml" v-if="totalPage>1">></a>
					</div>
					
					<template v-if="lists.length>1">
						<img src="../../../../static/images/left.png" class="left arrow" @click="prev"/>
						<img src="../../../../static/images/right.png" class="right arrow" @click="next"/>
					</template>
				 </div>
			</div>
		</transition>
	</div>
</template>

<script>
	var zIndex=5,timer;
	export default {
		name: 'EmergencyPop3crt',
		data() {
			return {
				curr:'',
				currIndex:0,
				lists:[],
				title:'',
				list:{},
				loading:false,
				styles:{},
				full:false,
				imgPrefix:process.env.IMG_URL,
				scaleRate:1,//缩放比率
				dragState:false,//拖拽状态
				dragPosition:{
					x:0,
					y:0,
					newx:0,
					newy:0
				},
				iconWidth:20,//图标宽度
				iconHeight:20,//图标高度
				mw:0,//图片容器最小宽度
				mh:0,//图片容器最小高度
				cursor:'pointer',
				rate:1,
				totalPage:0,
				page:1,
				size:5,
			}
		},
		mounted: function() {
			var vm=this;
			//单个设备告警详情
			vm.bus.$on('Pop3blackBoxcrt',function(list){
				vm.resetInfo();
				vm.title=list.buildName;//+' '+list['position']
				vm.list=list;
				vm.curr=1;
				vm.getCrtFloorDetails(list);
				vm.init();
			});
		},
		methods: {
			//获取建筑物告警详情
			getCrtBuildDetails(list){
				var vm=this;
				var params={
					buildname:list.buildname,
				}
				vm.loading=true;
				vm.$axios.post('home/getAllCrtImage',params).then(function(res){
					var data=res||[],arr=[];
					data.forEach(function(value){
						var obj={
							imgSrc:value.crturl,
							fname:value.fname,
							icons:value.devicecodes||[]
						}
						arr.push($.extend(true,obj,list));
					});
					vm.lists=arr;
					vm.totalPage=Math.ceil(vm.lists.length/vm.size);
					vm.loading=false;
				})
			},
			//获取单个设备crt信息
			getCrtFloorDetails(list){
				var vm=this;
				vm.loading=true;
				var params={
					buildname:list.buildName,
					unitUuid:UNITID,
					devicecode:list.deviceCode,
				}
				if(vm.curr==1){
					params.uuid=vm.list.uuid;
				}
				vm.$axios.post('box/statistics/agetCrtFloorDetails',params).then(function(res){
					var data=res||{devicecode:[]},arr=[],icons=[];
					if(data.devicecode){
						data.devicecode.forEach(item=>{
							if(item.deviceleft&&item.devicetop){
								icons.push(item)
							}
						})
					}
					var obj={
						imgSrc:data.crturl,
						icons:icons
					}
					arr.push($.extend(true,obj,list));
					vm.lists=arr;
					vm.loading=false;
				})
			},
			//获取单个设备告警信息
			getAlarmDetailsByDeviceCode(item){
				var vm=this,params={};
				if(vm.curr==1&&item.devicecode==vm.list.deviceCode){
					params.alarmUuid=vm.list.uuid;
				}else{
					params.deviceUuid=item.uuid;
				}
				vm.$axios.post('box/statistics/agetAlarmDetailsByDeviceCode',params).then(function(res){
					var data=res||[];
					if(data.length>0){
						var row=data[0];
						var rows={
							"告警事件": row.alarmDesc,
							"告警设备": row.deviceName,
							"设备编号": row.deviceCode,
							"告警时间": row.alarmTime,
							"设备类型": row.deviceType,
							"所在楼宇": row.buildName,
							"所在楼层": row.fname,
						}
						item=$.extend(true,item,row);
						vm.$set(item,'rows',rows);
					}else{
						vm.$set(item,'rows',{});
						vm.$set(item,'alarmTypeName','该点位无告警信息');
					}
					vm.$set(item,'hasDetail',true);
					vm.$set(item,'loading',false);
				})
			},
			//查看建筑物告警详情
			lookDetail(build){
				var vm=this;
				vm.resetInfo();
				vm.curr=2;
				vm.title=build.buildname;
				vm.init();
				vm.getCrtBuildDetails(build);
			},
			//切换楼层
			changeFloor(dataIndex){
				var vm=this;
				this.scaleRate=1;
				vm.styles={
					left:'50%',
					top:'50%',
					cursor:vm.cursor,
					transform:'translate(-50%,-50%)',
					opacity:0,
				}
				this.currIndex=dataIndex;
			},
			prev(){
				if(this.currIndex>0){
					this.changeFloor(this.currIndex-1);
				}
			},
			next(){
				if(this.currIndex<(this.lists.length-1)){
					this.changeFloor(this.currIndex+1);
				}
			},
			prevPage(){
				if(this.page>1){
					this.page--;
				}
			},
			nextPage(){
				if(this.page<this.totalPage){
					this.page++;
				}
			},
			resetInfo(){
				var vm=this;
				vm.lists=[];
				vm.rate=1;
				vm.currIndex=0;
				vm.scaleRate=1;
				vm.dragState=false;
				vm.full=false;
				vm.styles={
					left:'50%',
					top:'50%',
					cursor:vm.cursor,
					transform:'translate(-50%,-50%)',
				}
			},
			//初始化
			init:function(){
				var vm=this;
				vm.$nextTick(function(){
					vm.bindDragEvent();
					scale();
//					vm.bindScaleEvent();					
				})
			},
			//绑定整体拖拽事件
			bindDragEvent:function(){
				var vm=this;
				var dragContainer=vm.$refs.dragContainer;
				$(dragContainer).on('mousedown',function(e){
					vm.dragState=true;
					vm.dragPosition.x=e.pageX;
					vm.dragPosition.y=e.pageY;
					vm.cursor='url("https://api0.map.bdimg.com/images/openhand.cur") 8 8, default';
				});
				$(dragContainer).on('mousemove',function(e){
					e.preventDefault();
					if(vm.dragState){
						vm.dragPosition.newx=vm.dragPosition.newx+e.pageX-vm.dragPosition.x;
						vm.dragPosition.newy=vm.dragPosition.newy+e.pageY-vm.dragPosition.y;
						vm.dragPosition.x=e.pageX;
						vm.dragPosition.y=e.pageY;
						vm.scale();
					}
				});
				$(dragContainer).on('mouseup',function(e){
					vm.dragState=false;
					vm.cursor='pointer';
					vm.scale();
				});
				
				$(dragContainer).on('mousewheel DOMMouseScroll', vm.onMouseScroll);
			},
			//绑定整体缩放事件
			bindScaleEvent:function(){
				var vm=this;
				var scaleContainer=vm.$refs.scaleContainer;
				$(scaleContainer).on('mousewheel DOMMouseScroll', vm.onMouseScroll);
			},
			//图片加载完成
			imgLoad:function(){
				var vm=this;
				vm.$nextTick(function(){
					try{
						var dragContainer=vm.$refs.dragContainer;
						var mainImg=vm.$refs.mainImg[0];
//						vm.mw=mainImg.offsetWidth;
//						vm.mh=mainImg.offsetHeight;
//						var windowW=880;
//						var windowH=796;
						var windowW=1056;
						var windowH=955;
						var w=mainImg.src.indexOf('.svg')==-1?mainImg.naturalWidth:windowW;
						var h=mainImg.src.indexOf('.svg')==-1?mainImg.naturalHeight:windowH;
						if((w/h)>(windowW/windowH)){
							vm.mw=windowW;
							vm.mh=h*(vm.mw/w)
						}else{
							vm.mh=windowH;
							vm.mw=w*(vm.mh/h)
						}
						vm.dragPosition.newx=(dragContainer.offsetWidth-vm.mw)/2;
						vm.dragPosition.newy=(dragContainer.offsetHeight-vm.mh)/2;
						vm.scale();
					}catch(e){
						console.log(e.message)
					}
				})
			},
			//鼠标滚轮事件监听
			onMouseScroll:function(e){
				var vm=this;
			    e.preventDefault();
			    var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			    var delta = Math.max(-1, Math.min(1, wheel));
			    if(delta<0){//向下滚动
			    	if(vm.scaleRate>1){
			    		vm.scaleRate-=0.1;
			    		 vm.scale();
			    	}
			    }else{//向上滚动
		        	vm.scaleRate+=0.1;
		        	vm.scale();
			    } 

			},
			//缩放、拖拽图片
			scale:function(){
				var vm=this; 
				vm.styles={
					width:vm.mw+'px',
					height:vm.mh+'px',
					left:vm.dragPosition.newx+'px',
					top:vm.dragPosition.newy+'px',
					cursor:vm.cursor,
					transform:'scale('+vm.scaleRate+')',
					opacity:1,
				}	
			},
			//显示弹窗
			showPop(item){
				var vm=this;
				this.$set(item,'loading',true);
				this.$set(item,'pop',true);
				this.$set(item,'zIndex',++zIndex);
				if(item.alarmType==null){
					this.$set(item,'alarmTypeName','该点位无告警信息');
					this.$set(item,'loading',false);
					return;
				}
				if(item.hasDetail==undefined){
					vm.getAlarmDetailsByDeviceCode(item);
				}else{
					this.$set(item,'loading',false);
				}
			},
			mouseenter(item){
				this.$set(item,'zIndex',++zIndex);
			},
			toggeleFull(){
				this.full=!this.full;
				this.scaleRate=1;
				this.rate=this.full?1.25:1;
				this.imgLoad();
			},
			//关闭弹窗
			closePop(item){
				this.$set(item,'pop',false);
			},
			close(){
				this.curr='';
			}
		},
	}
</script>
<style lang="scss" scoped="scoped">
	.blackBoxBuildPop{
		height: 237px;
		color: #75CBF2;
		width: 500px;
		float: left;
		background: #002037;
		text-align: center;
		margin-left: 410px;
		border: 1px solid #31859C;
		h1{
			line-height: 43px;
			padding: 0px 20px;
			font-size: 18px;
			color: white;
			background: #004E81;
			text-align: center;
		}
		.content{
			padding: 15px;
			.section{
				margin-bottom: 25px;
				*{
					display: inline-block;
					vertical-align: middle;
				}
				span{
					color: #75CBF2;
					font-size: 16px;
				}
				b{
					margin-left: 20px;
					color: #00FFFF;
				}
			}
			ul{
				
				font-size: 0px;
				text-align: center;
				li{
					display: inline-block;
					margin-left: 10px;
					width: 145px;
					line-height: 20px;
					padding: 35px 0px;
					background: #0A3F5E;
					border-radius:4px;
					cursor: pointer;
					border:1px solid #0A3F5E;
					position:relative; 
					box-sizing:border-box; 
					&:hover{
						background: #014674;
						border-color: #00FFFF;
						&:after{
							content: '';
							position: absolute;
							left: 50%;
							top: 100%;
							border: 10px solid transparent;
							border-top-color: #014674;
							border-top-width: 18px;
							margin-top: -2px;
							transform: translateX(-50%);
						}
						&:before{
							content: '';
							position: absolute;
							left: 50%;
							top: 100%;
							border: 10px solid transparent;
							border-top-color: #00FFFF;
							border-top-width: 18px;
							transform: translateX(-50%);
						}
					}
					
					span{
						color: #75CBF2 ;
					}
					i{
						color: #75CBF2 ;
						margin: 0px 3px;
					}
					b{
						color: #0ff;
					}
				}
			}
			.barList{
				width: 480px;
				padding: 10px;
				background:rgba(0,32,55,1);
				border:1px solid rgba(49,133,156,1);
				*{
					color: #75CBF2;
				}
				.normal{
					background:rgba(50,200,114,1);
				}
				.fault{
					background: #ED7703;
				}
				.listTitle{
					margin-bottom: 8px;
					h2{
						overflow: hidden;
						text-align: left;
					}
					span{
						margin-left: 30px;
					}
					i{
						display: inline-block;
						width:6px;
						height:18px;
						margin-right: 4px;
					}
				}
				.bar-c{
					overflow: hidden;
					p{
						height: 20px;
						font-size: 16px;
						margin-top: 10px;
						text-align: right;
						padding-right: 10px;
						max-width: 150px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.barBg{
						font-size: 0px;
						margin-top: 10px;
						text-align: left;
						.bar{
							display: inline-block;
							height: 20px;
							text-align: center;
							font-size: 16px;
							color: white;
							line-height: 20px;
						}
					}
					
				}
			}
			
		}
	}
	.arrow{
		position: absolute;
		left: 20px;
		top: 50%;
		width: 51px;
		height: 106px;
		z-index: 6;
		transform: translate(0,-50%);
		cursor: pointer;
		opacity: 0;
		transition: all .2s linear;
		&.right{
			left: auto;
			right: 20px;
		}
	}
	.el-button--warning {
	    color: #fff;
	    background-color:#ED7703;
	    border-color:#ED7703;
	}
</style>

<style lang="scss" scoped="scoped">
	.img-placeholder{
		font-size: 20px;
		color: white;
		position: absolute;
		top: 50%;
		line-height: 60px;
		left: 0px;
		width: 100%;
		text-align: center;
		margin-top: -30px;
	}
	.crt-modal{
		position: absolute;
		left: 0px;
		top: 0px;
		width:1920px;
		height: 1080px;
		/*right: 0px;
		bottom: 0px;*/
		z-index: 99999999;
		.crt-modal-content{
			width: 60%;
			margin: auto;
			top: 25px;
			border: 1px solid #38c1ff;
    		background: #00192B;
    		position:relative;
    		&:hover{
				.arrow{
					opacity: 1;
				}
			}
    		&.fullScreen{
    			width: 100%;
    			top: 0px;
    			.fire-container{
    				height: 1016px;
    			}
    			.main-img{
					width: 100%;
					height: 100%;
				}
    		}
    		.tip-button{
    			position: absolute;
    			right: 0px;
    			top: 64px;
    			span{
    				display: inline-block;
    				margin-right: 10px;
    				color: white;
    				font-size: 18px;
    				text-align: center;
    				line-height: 30px;
    				&:before{
    					content: '';
    					display: inline-block;
    					width: 14px;
    					height: 14px;
    					border-radius: 50%;
    					margin-right: 5px;
    				}
    			}
    			.fire:before{
					background:#DF0024;
				}
				.warn:before{
					background:#D85A06;
				}
				.fault:before{
					background:#E38B00;
				}
				.other:before{
					background:#04B600;
				}
    		}
    		.crt-header{
    			position: relative;
    			h1{
					text-align: center;
					font-size: 18px;
					color: #FFFFFF;
					height: 44px;
					line-height: 44px;
					background: #005794;
				}
    			.close{
    				position: absolute;
    				right: 0px;
    				top: 0px;
    				color: white;
    				cursor: pointer;
    				padding: 7px;
    				font-size: 28px;
    				z-index: 2;
    			}
    			.full{
    				position: absolute;
    				right: 50px;
    				top: 0px;
    				padding: 7px;
    				cursor: pointer;
    			}
    		}
    		.slide-page{
    			position: absolute;
    			bottom: 20px;
    			left: 50%;
    			transform: translate(-50%,0);
    			max-width: 100%;
    			white-space: nowrap;
    			font-size: 0px;
    			a{
    				display: inline-block;
    				padding: 0px 15px;
					line-height:31px;
					background:rgba(0,78,129,1);
					border:1px solid rgba(76,162,205,1);
					border-radius:4px;
					color: white !important;
					margin-bottom:10px;
					vertical-align: middle;
					cursor: pointer;
    			}
    			.ml{
    				margin-left: 10px;
    			}
    			.mr{
    				margin-right: 10px;
    			}
    			.el-button{
    				padding: 0px 15px;
					line-height:30px;
					background:rgba(0,78,129,1);
					border:1px solid rgba(76,162,205,1);
					border-radius:4px;
					color: white !important;
					margin-bottom:10px;
					vertical-align: middle;
					span{
						color: 20px;
					}
					&.active{
						background: #008BDB;
					}
    			}
    		}
		}
	}
	.fire-container{
		height:960px;
		overflow: hidden;
		position: relative;
		user-select: none;
		.img-c{
			position: absolute;
			font-size: 0px;
			left: 50%;
			top: 50%;
			transform-origin: center;
			transform: translate(-50%,-50%);	
			cursor: move;   
			&>div{
				height: 100%;
			}
		}
		.main-img{
			/*max-width: 1200px;
			max-height:800px;
			min-width: 100px;
			min-height: 100px; */
			width: 100%;
			height: 100%;
		}
		.modal-drag{
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			background: rgba(0,0,0,0.0001);
			z-index: 3;
		}
		.icon-c{
			position: absolute;
			left: 0px;
			top: 0px;
			z-index: 4;
			.icon{
				border-radius:50%;
				display:inline-block;
				position:relative;
				font-size:0px;
				transform-origin:center; 
				transition:all 0.1s linear; 
				cursor: pointer;				
				&.curr{
					z-index: 9999999;
					&+.H-mapPopoutF{
						left: 70%;
						top: 70%;
					}
					img{
						width: 30px;
						height: 30px;
					}
					&:before{
						display: none;
					}
				}
				&.active{
					embed{
						background: #00FFFF;
					}
				}
				&:hover{
					transform: scale(1.2);
					.devicename{
						display: block;
					}
				}
				embed{
					border-radius:50%;
					width:16px;
					height: 16px;
					min-height: 16px;
					background: #006ABC;
					padding: 2px;
				    z-index: 2;
    				position: relative;
    				cursor: pointer;
    				transform: scale(0.8);
    				transform-origin: center;
				}
				.devicename{
					display: none;
					position: absolute;
				    height: 30px;
				    background: rgba(5,45,72,1);
				    border: 1px solid rgba(49,133,156,1);
				    border-radius: 4px;
				    line-height: 30px;
				    left: 50%;
				    transform: translate(-50%,0);
				    padding: 0px 10px;
				    color: #00FFFF;
					bottom: 109%;
					white-space: nowrap;
					font-size: 16px;
				}
				&:before{
					content: '';
					position: absolute;
					left: 50%;
					top: 50%;
					width: 100%;
					height: 100%;
					transform: translate(-50%,-50%);
					border-radius:50%;
					z-index: 1;
				}
			}
			.fire{
				embed{
					background: rgba(223, 0, 36,1);
				}
				&:before{
					animation: iconRipple 1s ease-in infinite alternate;
					background:rgba(223, 0, 36,0.5);
					border: 1px solid rgba(223, 0, 36,1);
				}
			}
			.warn{
				embed{
					background: rgba(216, 90, 6,1);
				}
				&:before{
					animation: iconRipple 1s ease-in infinite alternate;
					background:rgba(216, 90, 6,0.5);
					border: 1px solid rgba(216, 90, 6,1);
				}
			}
			.fault{
				embed{
					background: rgba(227, 139,0,1);
				}
				&:before{
					animation: iconRipple 1s ease-in infinite alternate;
					background:rgba(227, 139,0,0.5);
					border: 1px solid rgba(227, 139,0,1);
				}
			}
			.other{
				embed{
					background: rgba(4, 182, 0,1);
				}
				&:before{
					animation: iconRipple 1s ease-in infinite alternate;
					background:rgba(4, 182, 0,0.5);
					border: 1px solid rgba(4, 182, 0,1);
				}
			}
		}
	}
	@keyframes iconRipple{
		0%{
			width: 90%;
			height: 90%;
		}
		100%{
			width: 130%;
			height: 130%;
		}
	}
</style>

<style lang="scss">
	.urge{
		display: inline-block;
		width:24px;
		height: 24px;
		background: url(../../../../static/images/urge.png) no-repeat center 1px;
		background-size:100%;
		vertical-align: middle;
		&+span{
			display: inline-block;
			vertical-align: middle;
		}
	}
</style>
<style lang="scss" scoped="scoped">
	.H-mapPopoutF {
		border: 1px solid #38c1ff;
		overflow: hidden;
		background: #052D48;
		min-width: 355px;
		position: absolute;
		top: 90%;
		left: 90%;
	}
	
	.H-mapPopoutF * {
		color: #fff;
		font-size: 16px;
	}
	
	.Z-mapPopout em {
		font-size: 20px;
		color: red;
		margin-left: 6px;
	}
	
	.PopoutTop {
		height: 39px;
		line-height: 39px;
		font-size: 18px;
		color: #fff;
		background: #004e81;
		padding: 0px 10px;
		position: relative;
		.close{
			position: absolute;
			right: 0px;
			top: 0px;
			padding: 10px;
			font-size: 20px;
		}
	}
	
	.H-mapPopoutF ul li {
		min-height: 33px;
		line-height: 33px;
		padding: 0px 10px;
		font-size: 20px;
	}
	
	.H-mapPopoutF ul li:nth-of-type(2n+2) {
		background: #073452
	}
	
	.H-mapPopoutF ul li i {
		color: #75CBF2;
	}
	
	.H-mapPopoutF ul li i strong {
		color: #75CBF2;
	}
	
	.H-mapPopoutF ul li p {
		float: left;
		margin-left: 10px;
		width: 200px;
	}
	
	.H-mapPopoutF ul li span {
		width: 85px;
		float: left;
	}
	
	.H-mapPopoutF ul li .alarmDescLow {
		background: url(../../../../static/images/down.png) no-repeat right;
		background-size: 10px 20px;
		padding-right: 20px;
	}
	
	.H-mapPopoutF ul li .alarmDescUp {
		background: url(../../../../static/images/up.png) no-repeat right;
		background-size: 10px 20px;
		padding-right: 20px;
	}
	
	.H-mapPopoutF ul li em {
		font-size: 16px;
		color: #fff;
		display: block;
	}
	
	.Z-mapHandle button {
		font-size: 18px;
		color: #fff;
		height: 39px;
		width: 49.5%;
		background: #0478B7;
		border: none;
		cursor: pointer;
	}
	
	.Z-mapHandle .Z-butMap2 {
		margin-right: 1%;
	}
	
	.Z-mapHandle .Z-butMap2:last-child {
		margin-right: 0;
	}
	
	.Z-mapHandle .Z-butMap3 {
		margin-right: 0.5%;
		width: 33%
	}
	
	.Z-mapHandle .Z-butMap3:last-child {
		margin-right: 0;
	}
	
	.Z-mapHandle .Z-butMap1 {
		width: 100%;
	}
	
	.Z-misinformation {
		background: #1b8cb8;
	}
	
	.Z-pigeonhole {
		background: #ff9900;
	}
	
	.mapLatAnimate {
		animation: jump 1s;
	}
	
	@keyframes jump {
		0% {
			transform: translate(0, 0)
		}
		50% {
			transform: translate(0, 30px)
		}
		100% {
			transform: translate(0, 0)
		}
	}
</style>
    