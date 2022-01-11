<template>
	<el-dialog title="" :visible="curr!=''" width="72rem" :before-close="handleClose" class="linkageVideo" :class="{'isSmall':isSmall&&!isFullScreen}" :modal="false"  :close-on-click-modal="!isSmall">
		 <div class="fl alarmLists" v-show="lists.length>1">
			 <ul>
				 <!-- {{item.deviceCode}} -->
				 <li @click="changeAlarm(item)" v-for="(item,index) in reverseLists" :key="index" :title="item.devicePosition" :class="{'active':item.uuid==listinfo.uuid}">{{item.devicePosition}}</li>
			 </ul>
		 </div>
		 <div class="right-container">
			 <div class="detail">
				 <b class="el-icon-arrow-left fl" @click="exitFull" v-show="isFullScreen"></b>
				 <span>告警类型：{{listinfo.alarmTypeName||'--'}}</span>
				 <span>位置：{{listinfo.devicePosition||'--'}}</span>
				 <span>告警时间：{{listinfo.alarmTime||'--'}}</span>
				 <div class="fr" v-show="!isSmall||isFullScreen">
					 <i class="rect" @click="changePageSize(1)" :class="{'active':page.pageSize==1}"></i>
					 <i class="el-icon-menu" @click="changePageSize(4)" :class="{'active':page.pageSize==4}"></i>
					 <i class="el-icon-s-grid" @click="changePageSize(9)" :class="{'active':page.pageSize==9}"></i>
				 </div>
			 </div>
			 <div class="videos" :class="['videoSize'+page.pageSize]">
				 <template v-if="listinfo.videos">
					 <div class="video-container" v-for="(item,index) in paging" :key="time+index+isReal" @click="full(item)">
						  <v :datas="item" :isReal="isReal"></v>
					 </div>
				 </template>
			 </div>
			 <div class="video-bottom">
				 <el-radio-group v-model="isReal" v-if="isPlayBack&&page.pageSize==1&&page.total>0">
				   <el-radio-button :label="true">实时</el-radio-button>
				   <el-radio-button :label="false">回放</el-radio-button>
				 </el-radio-group>
				 <el-pagination :current-page.sync="page.currentPage" :page-size.sync="page.pageSize" layout="prev, pager, next" :total="page.total" class="fr"> </el-pagination>
			 </div>
		 </div>
	</el-dialog>
</template>

<script>
	export default{
		data(){
			return{
				curr:'',//1单个告警，2多个
				unitUuid:UNITID||JSON.parse(localStorage.getItem('DEPT')||'{}').uuid,
				lists:[],
				listinfo:{},
				page:{
					currentPage:1,
					pageSize:this.isSmall?2:1,
					oldCurrentPage:1,
					oldPageSize:this.isSmall?2:1,
					total:0
				},
				time:Date.now(),
				isFullScreen:false,//是否全屏
				isReal:true,//是否是实时视频
			}
		},
		props:{
			isPlayBack:{//是否可以回放
				type:Boolean,
				default(){
					return false;
				}
			},
			isSmall:{//是否小屏展示
				type:Boolean,
				default(){
					return false;
				}
			},
		},
		components:{
			v:()=>import('./videoComponent.vue')
		},
		watch:{
			'lists.length': {
				handler(newValue, oldValue) {
					if(newValue>0){
						if(newValue>oldValue){								
							this.page.currentPage=1;
							this.listinfo=this.lists[newValue-1];
							this.page.total=(this.listinfo.videos&&this.listinfo.videos.length)||0;
						}
					}else{							
						this.page.currentPage=1;
						this.listinfo={};
						this.page.total=0;
						if(this.curr==2){						
							this.curr='';
						}
					}
				}
			}
		},
		computed:{
			paging(){				
				this.isReal=true;		
				this.time=Date.now();
				if(this.listinfo.videos){
					return this.listinfo.videos.slice(this.page.pageSize*(this.page.currentPage-1),this.page.pageSize*this.page.currentPage)
				}
				return []
			},
			reverseLists(){
				return Object.assign([],this.lists).reverse()
			}
		},
		mounted(){
			// 监听海康视频插件点击事件
			window.addEventListener('message',res=>{
				if(this.curr&&res&&res.data&&res.data.action=='videoClick'){
					this.full(res.data.data);
				}
			})
		},
		methods:{
			show(type,row){
				// console.log(row);
				this.isFullScreen=this.curr==2?this.isFullScreen:false;
				if(type!=this.curr){
					this.page={
						currentPage:1,
						pageSize:this.isSmall?2:1,
						oldCurrentPage:1,
						oldPageSize:this.isSmall?2:1,
						total:0
					};
				}			
				if(this.curr==1)this.lists=[];
				if(type==1){
					this.lists=[];
					this.curr = type;
				};	
				
				//判断当前告警是否已在告警列表中
				let exists=this.lists.some(item=>{
					return item.uuid==row.uuid
				})			
				if(exists) return;
							
				this.getDetail(row,type);
			},			
			getDetail(row,type){//获取告警关联的监控设备
				var params={
					deviceUuid:row.deviceUuid,
					deviceCode:row.deviceCode,
					unitUuid:this.unitUuid,
				}
				var req='xfbd/fireMonitor/fmfireDeviceInfo';
				if(row.alarmBigType=='security')req='xfbd/fireMonitor/fmMonitorDeviceInfo'
				else if(row.alarmBigType=='shelter')req='xfbd/fireMonitor/fmShelterDeviceInfo';
				
				this.$axios.post(process.env.API_OHTTPH+req,params).then((data) => {
					var videos= data || [];
					videos.forEach((obj,index)=>{
						obj.startTime=row.alarmTime;
						this.bus.getVideoPlayUrl(obj);
						obj.index=index;
					});
					this.changeVideosPlayUrls(videos,row,type);
				})
			},
			changeVideosPlayUrls(videos,row,type){				
				row.videos=videos;
				if(type==2){
					if(videos.length>0){
						this.curr = type;
						this.lists.push(row);
						row.index=this.lists.length;
					}
				}else{
					this.lists=[row];
				}
			},
			changeAlarm(item){//切换告警信息
				this.listinfo=item;
			},
			changePageSize(size){//切换每页显示视频个数
				this.time=Date.now();
				this.page.pageSize=size;
				this.page.currentPage=1;
			},
			full(item){//最大化展示某一视频
			    if(this.page.pageSize==1&&this.page.currentPage==item.index+1)return;
				this.isFullScreen=true;
				this.isReal=true;
				this.page.oldCurrentPage=this.page.currentPage;
				this.page.oldPageSize=this.page.pageSize;
				this.page.pageSize=1;
				this.$nextTick(()=>{
					this.page.currentPage=item.index+1;
				})
			},
			exitFull(){//退出大屏播放
				this.isFullScreen=this.curr==1?false:(this.page.oldPageSize!=2&&this.page.oldPageSize!=this.page.pageSize);
				this.isReal=true;
				this.page.pageSize=this.page.oldPageSize==this.page.pageSize?(this.isSmall?2:1):this.page.oldPageSize;				
				this.$nextTick(()=>{
					this.page.currentPage=this.page.oldPageSize==this.page.pageSize?1:this.page.oldCurrentPage;
				})
			},
			removeItem(item){
				if(this.lists[item.index-1]&&this.lists[item.index-1].uuid==item.uuid){
					this.lists.splice(item.index-1,1);
				}
			},
			handleClose(){
				// if(this.curr==2)				
				this.listinfo={};
				this.curr='';
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	*{
		color: #75CBF2;
	}
	.alarmLists{
		// padding-top: 2.5rem;
		height: 100%;
		width: 19rem;
		border-right: 1px solid #DDDDDD;
		margin-right: 0.5rem;
		overflow: auto;
		box-sizing: border-box;
		li{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			line-height: 2.5rem;
			padding-left: 1rem;
			cursor: pointer;
			&.active{
				background-color: #31859C;
				color: white;
			}
		}
	}
	.right-container{
		display: flex;
		flex-direction: column;
		height: 100%;
		.detail{
			min-height: 2.5rem;
			line-height: 2.5rem;
			margin-left: 0.5rem;
			b{
				font-size: 1.5rem;
				margin-right: 0.5rem;
				position: relative;
				top: 0.5rem;
				cursor: pointer;
			}
			span{
				margin-right: 1.5rem;
				float: left;
			}
			.fr{
				margin-right: 0.5rem;
				margin-top: 0.25rem;
				i{
					font-size: 1.5rem;
					cursor: pointer;
					&.active{
						color: #0ff;
					}
				}
				.rect{
					display: inline-block;
					width: 1.1rem;
					height: 1.1rem;
					background-color: #75CBF2;
					margin-right: 0.25rem;
					&.active{
						background-color: #0ff;
					}
				}
			}
		}		
		.videos{
			flex: 1;
			.video-container{
				float: left;
				border: 0.5rem solid transparent;
				box-sizing: border-box;
				cursor: pointer;
			}
			&.videoSize1{
				.video-container{
					width: 100%;
					height: 100%;
				}
			}
			&.videoSize2{
				// display: flex;
				// flex-direction: column;
				.video-container{					
					// flex: 1;
					width: 100%;
					height: 50%;
				}
			}
			&.videoSize4{
				.video-container{
					width: 50%;
					height: 50%;
				}
			}
			&.videoSize9{
				.video-container{
					width: 33.333%;
					height: 33.333%;
				}
			}
		}
		.video-bottom{
			margin-left: 0.5rem;
		}
	}
	
	
</style>
<style lang="scss">
	.linkageVideo{
		left: auto !important;
		right: 27% !important;
		z-index: 10000 !important;
		&.isSmall{
			padding:0px 0.5rem;
			.el-dialog{
				width: 50rem !important;
				box-shadow: 0 0px 8px rgba(255,255,255,.3);
			}
		}
		.el-dialog{
			margin-top: 1.5rem !important;
			margin-bottom: 1.5rem !important;
			margin-right: 0px !important;
		}
		.el-dialog__header{		
			height: 0px;
			background: transparent !important;
			.el-dialog__headerbtn{
				top: 0px;
				right: 0.5rem;
				padding: 0.3rem 0.5rem;
				i{
					font-size: 1.5rem;
				}
			}
		}
		.el-dialog__body{
			height: 48rem;
			padding-top: 0px;
			padding-left: 0px;
		}
		.el-pagination *{			
			color: #75CBF2 !important;
		}
		.el-pager li,.el-pagination .el-icon{
			font-size: 0.9rem;
			background: none;
			line-height: 28px;
			padding: 0px !important;
			min-width: 2.5em;
		}
		.el-pager li.active{
			color:  #fff!important;
		}
		.el-pagination .btn-next,.el-pagination .btn-prev{
			background: none !important;
			.el-icon{
				display: inline-block !important;
			}
		}
	}
</style>
