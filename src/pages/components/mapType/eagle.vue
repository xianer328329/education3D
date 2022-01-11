<template>
	<el-dialog title="鹰眼全景" :visible="curr!=''" width="70%" :before-close="handleClose" class="eagle":modal-append-to-body="true" :append-to-body="true">
		 <div class="fl alarmLists">
			 <ul>
				 <li @click="changeAlarm(item)" v-for="(item,index) in lists" :key="item.uuid"  :class="{'active':item.uuid==listinfo.uuid}">{{item.cameraName}}</li>
			 </ul>
		 </div>
		 <div class="right-container">
			 <div class="videos" :class="['videoSize1']">
				 <div class="video-container" v-for="(item,index) in listinfo.cameras" :key="index">
					  <v :datas="item" :isReal="isReal"></v>
				 </div>
			 </div>
		 </div>
	</el-dialog>
</template>

<script>
	export default{
		data(){
			return{
				curr:'',//1单个告警，2多个
				listinfo:{
					cameras:[]
				},
				lists:[],
				isReal:true,//是否是实时视频
			}
		},
		components:{
			v:()=>import('../videoComponent.vue')
		},
		mounted(){
			
		},
		methods:{
			show(type){		
				this.curr=1;
				if(UNITID=='4406'){
					this.lists=[{
						cameraName:'四运动场鹰眼-球',
						longitude:'106.420649',
						latitude:'29.816107',
						uuid:1,
						cameras:[]
					},{
						cameraName:'大礼堂鹰眼',
						longitude:'106.422699',
						latitude:'29.818839',
						uuid:2,
						cameras:[]
					}];
					this.listinfo=this.lists[0];
					this.getDetail(this.listinfo);
				}
			},			
			getDetail(row){//获取告警关联的监控设备
				var parameter = new FormData();
				parameter.append('iconName',row.cameraName);
				parameter.append('iconType', 58);
				parameter.append('latitude', row.latitude);
				parameter.append('longitude',  row.longitude);
				this.$axios.post('home/iconDeviceList', parameter).then((res)=>{
					var videos=res.list||[];
					videos.forEach((obj,index)=>{
						this.bus.getVideoPlayUrl(obj);
					});
					row.cameras=videos;					
				});
			},
			changeAlarm(item){//切换告警信息
				this.listinfo=item;
				this.getDetail(item)
			},
			handleClose(){			
				this.lists=[];
				this.listinfo={
					cameras:[]
				};
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
		height: 100%;
		width: 17rem;
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
		flex: 1;
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
<style lang="scss" scoped="scoped">
	.eagle{
		/deep/{
			.el-dialog{
				margin-top: 2% !important;
				margin-bottom: 2% !important;
				position: absolute !important;
				right: 27% !important;
				height: 94%;
				display: flex;
				flex-direction: column;
			}
			.el-dialog__body{
				flex: 1;
				padding: 0 !important;
				display: flex;
			}
		}
	}
</style>
