<template>
	<div class="popshade videoPlayContainer" v-show="showvideo">
		<div class="Z-3Popout hikPositionParent">
			<h5 class="PopoutTop">{{list.title||list.deviceName}}
				<p class="Z-close" @click="closePop()">
				<img src="../../../../static/images/Zgb.png" alt="" /></p>
			</h5>				
			<svg viewBox="25 25 50 50" class="circular" id="svg"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
			<!-- 海康插件播放 -->
			<div class="videoPlay videoContainer hik" v-show="videotype==5">
				<hik ref="hik" :list="list"></hik>
			</div>
			<!-- 宇视平台播放 -->
			<div class="videoPlay videoContainer yushi" v-show="videotype==6">
				<yushi ref="yushi" :list="list"></yushi>
			</div>			
			<div id="hlsvideo"  class="videoContainer" v-show="(videotype||0)-5<0"></div>
		</div>
	</div>
</template>
<script>
	import hik from '../../components/hik/hik.vue';//海康
	import yushi from './yushi.vue';//宇视
	import videoplay from '@/util/play'
	export default {
		name: 'EmergencyPop3videot',
		data() {
			return {
				videoHaiK: false,
				videoYuS: false,
				YuSvideo: "",
				videotype: '',
				deviceM3u8: "",
				myPlayer: null,
				list: {},
				showvideo: false,
				isplayback: 0,//1实时，2回放
			}
		},
		components:{
			hik,
			yushi
		},
		mounted: function() {
			var _this = this;
			this.bus.$on('addpop3video', (mes)=> {
				_this.showvideo = true;				
				mes.startTime=mes.alarmTime||mes.startTime;
				_this.videotype=mes.subplatform||mes.subPlatform || mes.subPlatForm || mes.subPlatforma||mes.subPlatForma;
				_this.list = mes;
				_this.isplayback = mes.isplayback;
				_this.$nextTick(()=>{
					if(mes.temporary){//临时增加2021-06-23
						_this.getCameraDetailByDeviceCode(mes);
					}else{
						_this.playOCX(mes);
					}
				})
			})
		},
		methods: {
			// 通过deviceCode获取摄像头详细信息
			getCameraDetailByDeviceCode(mes){
				var params={
					currentPage: 1,
					pageSize: 1,
					deviceCode: mes.deviceCode,
					unitUuid: UNITID,
				}
				this.$axios.post('xfbd/fireMonitor/fmMonitorDeviceList',params).then((res) => {
				   var data=res.data||[];
				   if(data.length>0){
					   var video={
						   ...data[0],
						   title:data[0].deviceName,
						   isplayback:1,
						   // subPlatForma:data[0].subPlatform
					   }
					   this.list = video;
					   this.isplayback = video.isplayback;
					   this.playOCX(video);
				   }else{
					   this.$message.error('未查询到摄像头信息')
				   }
				});
			},
			playOCX(videoObj) {
				/*
				 * {传入参数}
				 * videoObj:{
				 * 	playUrl:要播放的视频ID
				 * 
				 *  ----------------以下必传
				 * 
				 * 	isplayback:要播放的类型  1实时 2回放
				 * recordLocation:录像存储位置：0-中心存储(cvr)，1-设备存储(nvr)
				 * deviceCode:摄像头编号
				 * 	alarmTime:播放时间 格式yyyy-MM-dd hh:mm:ss
				 * 	deviceName:当类型为宇视时需要 设备名称
				 * deviceIp:摄像头ip地址
				 * deviceUser:摄像头用户名
				 * devicePass:摄像头密码
				 * 
				 * nvrDeviceIp: nvr ip地址
				 * nvrDeviceUser: nvr 用户名
				 * nvrDevicePass: nvr 密码
				 * deviceNo:nvr通道号
				 * 
				 * subPlatForma:平台 1海康 2大华 3宇视 4 华为  5 海康插件播放
				 * deviceRstp  平台播放所需参数 '{ip,APPKEY,SECRET}'
				 * 
				 * }
				 * */				 
				 if(this.videotype == 5){//海康插件播放
					this.$refs.hik&&this.$refs.hik.init(true);
					 return;
				 }else if(this.videotype==6){//宇视平台播放
					 this.$refs.yushi&&this.$refs.yushi.init(true);
				 }else{
					if(this.isplayback == 1) {
						videoplay.preview(videoObj, 'hlsvideo', 'videodialog','videodialog2');
					} else {
						videoplay.playback(videoObj, 'hlsvideo', 'target_back','target_back2');
					}
				 }
			
			},
			closePop() { //关闭地图弹框
				try{
					$("#videodialog").remove();
					$("#target_back").remove();
					videoplay.wsbackclose();
				}catch(e){
					console.log(e.message)
				}
				this.list.show = false;
				this.showvideo = false;
				this.$refs.yushi&&this.$refs.yushi.init(false);
				this.$refs.hik&&this.$refs.hik.init(false);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.videoPlayContainer{
		width: 100%;
		height: 100%;
		content: "";
		display: block;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 9999;
		.Z-3Popout {
			width:43rem !important;
			min-width: 430px;
			left: 50% !important;
			margin-left: 0px !important;
			margin-top: 0px !important;
			transform: translate(-50%,-50%);
			height: auto !important;
			.videoContainer {
				height: 26.5rem;
				width: 100%;
			}
		}	
		// .videoPlay {
		// 	height: 450px;
		// }

		.circular{
			height: 42px;
			width: 42px;
			animation: loading-rotate 2s linear infinite;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-top: -21px;
			margin-left: -21px;
			z-index: -1;
		}
		.path{
			animation: loading-dash 1.5s ease-in-out infinite;
			stroke-dasharray: 90, 150;
			stroke-dashoffset: 0;
			stroke-width: 2;
			stroke: #349DCE;
			stroke-linecap: round;
		}
	}
	
</style>
