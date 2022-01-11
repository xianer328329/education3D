<template>
	<div class="mediaplayerContainer">
		<svg viewBox="25 25 50 50" class="circular" id="svg"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
		<!-- 海康插件播放 -->
		<hik ref="hik" :list="datas" v-show="datas.subPlatform==5"></hik>
		
		<!-- 宇视平台播放 -->
		<yushi ref="yushi" :list="datas" v-show="datas.subPlatform==6"></yushi>
		
		<!-- 其他 -->
		<div class="mediaplayer" ref="video_mediaplayer"  v-show="(datas.subPlatform||0)-5<0">
		   <div class="video">
		   	<!-- H264 -->
		   	<video class="player" ref="player" autoplay ></video>
		   	<!-- H265 -->
		   	<canvas class="player" ref="h265Player" style="display:none"></canvas>
		   </div>
		   <!--视频控制层-->
		   <div class="wrap" ref="videoBtn" @click.stop="">
		       <div  ref="video_progress_list" class="progress-list" @click="changeProgress($event)" v-if="!isReal">
		           <!--进度条-->
		           <div ref="video_progress" class="play-progress"></div>
		       </div>
		       <div class="controls">
		           <div class="left-box" v-if="!isReal">
		           	<!--播放按钮-->
		               <span  class="video-btn" @click="togglePlay"><i :class="['fa',playClass]"></i></span><span class="curtime">{{curtime}}</span><span class="left-box-div">/</span><span class="duration">{{duration}}</span>
		           </div>
		           <div id="box">
		               <span class="fullScreen fr"  @click="toogleFullScreen"> <i class="fa el-icon-full-screen"></i></span>
		           </div>
		       </div>
		   </div>
		</div>
	</div>
</template>

<script>
	import yushi from '../emergency/components/yushi.vue';
	import hik from './hik/hik.vue';
	export default{
		data(){
			return{
				videoUrls:[],
				unitUuid:JSON.parse(localStorage.getItem('DEPT')||'{}').uuid,
				videoSocket:'ws://192.168.0.29',
				player:null,//播放对象
				playClass:'el-icon-video-pause',
				mediaplayer:'',
				html5Player:'',
				h265Player:'',
				curtime:'00:00:00',//当前的播放长度
				duration:'00:00:00', //播放源的总长度
				progress_width:'',
				seekable:true,//是否支持拖动
				seekValue:0,//鼠标拖动播放的位置所代表秒数
				offset:0,//seek前播放的时长
				total:0,//视频总时长
				initWidth:0,//全屏前播放器的宽度，用于退出全屏恢复
				initHeight:0,//全屏前播放器的高度，用于退出全屏恢复
			}
		},
		props:{
			datas:{
				type:Object,
				default(){
					return {};
				}
			},
			isReal:{
				type:Boolean,
				default(){
					return true;
				}
			}
		},		
		components:{
			yushi,
			hik
		},
		watch:{
			datas:{
				handler(){
					this.destroyPlayer();
					this.init();
				},
				deep:true
			},
		},
		mounted(){
			var vm=this;
			this.getVideoUrls();
			if (window.Streamedian) {
	            vm.init();
	        }
		},
		beforeDestroy(){
			this.destroyPlayer();
		},
		methods:{
			//获取视频播放地址
			getVideoUrls(){
				this.videoUrls=JSON.parse(localStorage.getItem("videoUrl")||'[]');
				this.videoSocket=this.videoUrls.length>0?this.videoUrls[0].params_value:'';
			},
			init(){
				var vm=this;
				if(!vm.datas.realurl)return;
				vm.datas.isplayback=vm.isReal?1:2;//1实时
				vm.$nextTick(()=>{
					if(vm.datas.subPlatform==5){//海康插件播放
						this.$refs.hik&&this.$refs.hik.init(false);
						setTimeout(()=>{
							this.$refs.hik&&this.$refs.hik.init(true);
						},500)
					}else if(vm.datas.subPlatform==6){//宇视平台播放
						this.$refs.yushi&&this.$refs.yushi.init(false);
						setTimeout(()=>{
							this.$refs.yushi&&this.$refs.yushi.init(true);
						},500)
					}else{
						vm.mediaplayer = this.$refs.video_mediaplayer; //播放器容器
						vm.html5Player =this.$refs.player; //播放显示标签		
						vm.h265Player=this.$refs.h265Player;//h265播放显示标签
						vm.progress_width =this.$refs.video_progress_list; //总进度条
						vm.play_progress =this.$refs.video_progress; //当前播放进度
						vm.togglePlay();
					}
					
				})
			},
			//点击播放暂停
			togglePlay(){
				var vm=this;
				if (vm.player && vm.player.isStart) {
                    if (vm.player.isPlaying()) vm.player.pause();
                    else vm.player.play();
                } else {
                    vm.setPlayerSource(vm.html5Player);
                }
			},
			//配置播放参数
			setPlayerSource(Node) {
				var vm=this;				
				vm.seekValue = 0;
                //播放前先释放之前的播放器
                vm.destroyPlayer();
                let playerOptions = {
                    socket: vm.videoSocket+"/rtsp"+(vm.isReal?vm.datas.realurl:vm.datas.backurl),
					// socket:'ws://192.168.0.29:7070/rtsp?firm=1&ip=192.168.0.240&user=admin&pwd=test1234&chl=1&subtype=1&playback=1&start=2021-06-29 17:57:00&end=2021-06-30 17:57:34',
                    redirectNativeMediaErrors: true,
                    bufferDuration: 1,
                    errorHandler:vm.errHandler,
                    infoHandler:vm.infHandler
                };
                vm.player = Streamedian.player(Node, playerOptions,vm.h265Player);
                //注册连接断开事件
                vm.player.set_disconnect_handler((e) => {
                    vm.html5Player.pause();
                    vm.destroyPlayer();
                    vm.curtime = vm.formatSeconds(vm.total);
                    vm.duration = vm.formatSeconds(vm.total);
                });
				vm.player.set_play_handler(vm.play);
				vm.player.set_pause_handler(vm.pause);
				vm.player.set_playtimechanged_handler(vm.timeUpdate);
           },
            //预设播放时间
            formatSeconds(value) {
            	var vm=this;
                var theTime = parseInt(value);
                var theTime1 = 0;
                var theTime2 = 0;

                if (theTime >= 60) {
                    theTime1 = parseInt(theTime / 60);
                    theTime = parseInt(theTime % 60);
                    if (theTime1 >= 60) {
                        theTime2 = parseInt(theTime1 / 60);
                        theTime1 = parseInt(theTime1 % 60);
                    }
                }
                if (theTime < 10) {
                    theTime = "0" + parseInt(theTime)
                }
                var result = "" + theTime + "";
                if (theTime1 >= 0) {
                    if (theTime1 < 10) {
                        theTime1 = "0" + parseInt(theTime1)
                    }
                    result = "" + theTime1 + ":" + result;
                }
                if (theTime2 >= 0) {
                    if (theTime2 < 10) {
                        theTime2 = "0" + parseInt(theTime2)
                    }
                    result = "" + theTime2 + ":" + result;
                }
                return result;
            },
            //播放失败
			errHandler(err){
				this.$message.error(err.message);
			},
			infHandler(args){
				if(args&&typeof(args)=='object'){
					for(var k in args){
						if(typeof(args[k])=='string'){
							if(args[k].indexOf('404')>-1||args[k].indexOf('400')>-1){
								this.$message.error(args[k]);
								break;
							}
						}else{
							this.$message.error('播放失败');
						}
					}
				}else{
					console.log(args)
				}
			},
			//刷新进度条
			timeUpdate(){
				var vm=this;	
                if (!vm.player || !vm.player.isStart||vm.isReal)
                    return;

                //初始化进度值
                if (vm.seekable && vm.total === 0) {
                    let Range = vm.player.seekable();
                    if (Range) {
                        vm.total = Range[1] - Range[0];
                    } else {
                        vm.total = 0;
                        vm.seekable = false;
                    }
                    vm.play_progress.max = vm.total;
                    vm.duration = vm.formatSeconds(vm.total);
                } else if (!vm.seekable) {
                    return;
                }

                let playtime = vm.player.getTime() - vm.offset + vm.seekValue;
                let cur = Math.floor(playtime);

                //播放完成清零
                if (vm.html5Player.ended === true || cur === vm.total) {	
                    vm.destroyPlayer();	
                    vm.duration= vm.formatSeconds(vm.total);	
                    cur = 0;
                    if (vm.playClass =="el-icon-video-pause"){vm.playClass ="el-icon-video-play";}                     
                }

                let med = vm.mediaplayer.offsetWidth - 2;
                vm.curtime= vm.formatSeconds(cur);
                if (vm.total === 0)
                    vm.play_progress.style.width = med + "px";
                else
                    vm.play_progress.style.width = Math.floor(playtime * med / vm.total) + "px";
			},
			//点击变更播放进度
            changeProgress(e){
            	var vm=this;								
                if (vm.player && vm.seekable && vm.total > 0) {
                    let curPlay = e.offsetX;
                    vm.seekValue = curPlay / vm.progress_width.offsetWidth * vm.total;

                    if (vm.seekValue < 0)
                        vm.seekValue = 0;

                    if (vm.seekValue > vm.total)
                        vm.seekValue = vm.total;

                    vm.offset = vm.html5Player.currentTime; //记录seek前的播放时间，用于计算拖动后的播放时间

                    vm.player.seek(vm.seekValue);
                }
            },
            //销毁播放器
            destroyPlayer() {
				var vm=this;
                try{
					this.$refs.hik&&this.$refs.hik.init(false);
					this.$refs.yushi&&this.$refs.yushi.init(false);
                	if (vm.player && !vm.player.isDestroy()) {	
	                    vm.player.stop();
	                    vm.player.destroy();	                    
	
	                    vm.html5Player.currentTime = 0;
	                    vm.html5Player.ended = true;
	                    vm.html5Player.load();
	                }
					vm.player = null;
						
					vm.seekable = true;
					vm.total = 0;
					vm.offset = 0;
					vm.seekValue = 0;
                }catch(e){
//              	console.log(e.message);
                }
            },
            play(){
            	var vm=this;
            	vm.playClass = "el-icon-video-pause";
            },
            pause(){
            	var vm=this;
	            vm.playClass ="el-icon-video-play";
            },
			//切换全屏
			toogleFullScreen(){
				var vm=this;
				if(!vm.isFullScreen()) {
                    vm.enterfullScreen(vm.mediaplayer);
                } else {
                    vm.exitFullscreen();
                }
			},
			//进入全屏
            enterfullScreen(element) {
				var vm=this;
                // 判断各种浏览器，找到正确的方法
                let requestMethod = element.requestFullScreen || //W3C
                    element.webkitRequestFullScreen || //FireFox
                    element.mozRequestFullScreen || //Chrome等
                    element.msRequestFullScreen; //IE11
                if (requestMethod) {
                    requestMethod.call(element);
                } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                    let wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            //退出全屏
            exitFullscreen() {
				var vm=this;
                // 判断各种浏览器，找到正确的方法
                let exitMethod = document.exitFullScreen || //W3C
                    document.mozCancelFullScreen || //FireFox
                    document.webkitExitFullScreen || //Chrome等
                    document.webkitExitFullscreen; //IE11
                if (exitMethod) {
                    exitMethod.call(document);
                } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                    let wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            //判断是否全屏
            isFullScreen() {
				var vm=this;
                let isFull = document.webkitIsFullScreen || document.msFullscreenEnabled || document.fullScreen;
                //to fix : false || undefined == undefined
                if (isFull === undefined) { isFull = false; }
                return isFull;
            },
		}
	}
</script>

<style lang="scss" scoped="scoped">
.mediaplayerContainer{
	width: 100%;
	height: 100%;
	position: relative;
	background: #22252b;
	.circular{
		height: 42px;
		width: 42px;
		animation: loading-rotate 2s linear infinite;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -21px;
		margin-left: -21px;
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
.mediaplayer {
	margin: 0 auto;
	width: 100%;
	height: 100%;
	position:relative;
	overflow: hidden;
	&:hover{
		.wrap{
			transform: translateY(0);
		}
	}
	.fa {
		cursor: pointer;
		font-size: 1.5rem;
		color: white;
	}
	.fullScreen .fa{		
		margin-top: 0.2rem;
	}
	.video {
		position: absolute;
		width: 100%;
		top:0px;
		left:0px;
		bottom:2.5rem;
	}		
	/*控制组件容器*/
	
	.wrap {
		position: absolute;
		width: 100%;
		height: 2.5rem;
		background: #333;
		bottom:0px;
		left:0px;
		z-index: 2;
		transform: translateY(120%);
		transition: all 0.2s linear;
	}
	
	
	/*视频资源层容器*/
	
	.player {
		width: 100% !important;
		height: 100% !important;
		object-fit: fill;
		object-position: 50% 50%;
	}
	
	
	/*---------------进度条层开始--------*/
	
	
	/*进度条资源总长度层*/
	
	.progress-list {
		transition-duration: .2s;
		position: absolute;
		width: 100%;
		height: 3px;
		top: -4px;
		margin-left: -1px;
		border: 1px solid black;
		border-radius: 3px;
		background: rgb(130, 130, 130);
	}
	
	
	/*进度条当前播放层*/
	
	.play-progress {
		width: 0px;
		height: 3px;
		transition-duration: .2s;
		background: linear-gradient(to right, #57a900, #97ff00 80%, #dee2da);
		background-color: #57a900;
		/*ie10以下兼容*/
	}
	
	.progress-list:hover {
		height: 0.65rem;
	}
	
	.progress-list:hover .play-progress {
		height: 0.65rem;
	}
	
	
	/*进度条层结束*/
	
	/*暂停按钮*/
	
	.curtime,
	.duration,
	.left-box-div {
		color: white;
	}
	
	.video-btn {
		display: inline-block;
		height: 1.8rem;
		vertical-align: middle;
		margin-right: 0.5rem;
	}
	
	.left-box {
		white-space: nowrap;
		float: left;
		margin-left: 0.5rem;
	}
	
	.left-box span {
		margin-left: 0.25rem;
	}
	
	#upload-file {
		margin-left: 0.75rem;
	}
	
	
	/*----------------右盒子----*/
	
	
	/*静音,全屏*/
	
	.fullScreen {
		display: inline-block;
		list-style: none;
		margin-right: 0.5rem;
	}
	
	#box {		
		white-space: nowrap;
		float: right;
	}
	
	#box ul {
		vertical-align: middle;
	}
	
	#box ul ul li {
		list-style: none;
	}
	
	
	/*音量控制层*/
	
	.voice-box {
		display: inline-block;
		position: relative;
		height: 1.5rem;
		width: 6.2rem;
		opacity: 0.7;
		line-height: 1.5rem;
		top: 5px;
		margin-left: 5px;
		filter: alpha(opacity=70);
	}
	
	.voice-line {
		cursor: pointer;
		position: absolute;
		top: 0.65rem;
		height: 4px;
		width: 6.2rem;
		background: #ddd;
	}
	
	.voice-volume {
		position: absolute;
		top: 0.65rem;
		height: 4px;
		width: 2.8rem;
		cursor: pointer;
		background: #57a900;
	}
	
	.voice-btn {
		position: absolute;
		left: 2.8rem;
		top: 0.45rem;
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 50%;
		background: white;
	}
	
	
	/*语速层开始*/
	
	.speed {
		cursor: pointer;
		position: relative;
		display: inline-block;
		width: 2.2rem;
		height: 1.1rem;
		line-height: 1.1rem;
		text-align: center;
		border: 1px solid black;
		background: #DAD6D8;
		margin-left: 1.25rem;
		top: -2px
	}
	
	.speed:hover ul {
		visibility: visible;
	}
	
	
	/*滑动语速显示*/
	
	.speed ul {
		visibility: hidden;
		background: #292929;
		position: absolute;
		top: -4.5rem;
		left: -0.5rem;
	}
	
	.speed li {
		cursor: pointer;
		color: white;
		font-family: arial;
		font-size: 0.8rem;
		width: 3.5rem;
		height: 1.5rem;
		line-height: 1.5rem;
	}
	
	.speed li:hover {
		background: grey;
	}
	
	
	/*语速层结束*/
	
	.controls {
		height: 2rem;
		line-height: 2rem;
		margin-top: 0.3rem;
	}
}
</style>