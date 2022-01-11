<template>
	<div class="Monitor">
		<h4 class="m-title">重点监控</h4>
		<div class="backboxContainer">
			<div class="monitorvideo">
				<hik ref="hik" :list="{...selectobj,isplayback:1}" v-show="videotype==5"></hik>
				<div class="monitorvideoOther" v-show="videotype!=5">
					<div class="myvideolr" id="myvideolr"></div>
				</div>
			</div>
			<div class="video-button">
				<div class="fl">
					<div class="m-butt clearfix">
						<el-select v-model="monitortype" :clearable="true" @change="change" placeholder="请选择监控类型" popper-class="selectpop">
							<el-option v-for="item in monitortypelist" :key="item.partId" :label="item.partName" :value="item.partId">
							</el-option>
						</el-select>
						<el-select v-model="selectobj" :clearable="true"  value-key="videoId" placeholder="请选择视频">
							<el-option v-for="(item,index) in monitorurl" :key="item.videoId" :label="item.videoName" :value="item">
							</el-option>
						</el-select>
					</div>
					<div class="m-button clearfix">
						<el-button @click="look">查看</el-button>
					</div>
				</div>
				<el-button plain class="button-box" icon="el-icon-arrow-left" @click="upclick()"></el-button>
				<el-button plain class="button-box" icon="el-icon-arrow-right" @click="nextclick()"></el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import videoplay from '@/util/play'
	import hik from '../../components/hik/hik.vue';
	/* eslint-disable */
	export default {
		data() {
			return {
				videotype: "",
				monitortype: null,
				monitortypelist: [], //监控分组列表
				monitorurl: [], //监控视频列表
				selectobj: {},
				clickindex: 0, //点击下标
				myPlayer: null,
			}
		},
		components:{
			hik
		},
		mounted: function() {
			this.getmonitortype(); //获取监控分组
		},
		methods: {
			initVideo(type) {
				let vm = this;
				//初始化视频方法
				if(type != 1) {
					let option = {};
					var myPlayer = videojs('my-video')
					videojs("my-video", option, function onPlayerReady() {
						myPlayer.src({
							src: vm.deviceM3u8,
							type: "application/x-mpegURL"
						});
						videojs.log("播放器已经准备好了!");
						if(vm.deviceM3u8 != null) {
							myPlayer.play();
						}
					});
					vm.myPlayer = myPlayer;
				} else {
					var videoObj = videojs('my-video');
					videoObj.src({
						src: vm.deviceM3u8,
						type: "application/x-mpegURL"
					});
				}

			},
			// 查看
			look(){
				this.clickindex=this.selectobj.index;
				this.start(1); //播放视频
			},
			upclick() {
				this.clickindex--;
				if(this.clickindex < 0) {
					this.clickindex = 0;
				}
				this.selectobj = this.monitorurl[this.clickindex];
				this.videocode = this.monitorurl[this.clickindex].videoUrl; //播放用的视频code
				this.deviceM3u8 = this.monitorurl[this.clickindex].deviceM3u8;
				this.start(1); //播放视频
			},
			nextclick() {
				this.clickindex++;
				var len = this.monitorurl.length;
				if(this.clickindex > len - 1) {
					this.clickindex = 0;
				}
				this.selectobj = this.monitorurl[this.clickindex];
				this.videocode = this.monitorurl[this.clickindex].videoUrl; //播放用的视频code
				this.deviceM3u8 = this.monitorurl[this.clickindex].deviceM3u8;
				this.start(1); //播放视频
			},
			change(partId) { // 获取监控类别下的视频
				this.getmonitorurl(partId);
			},
			getmonitortype() { //获取监控类别
				this.$axios.post("fire/fire/listPartIdAndName").then((res) => {
					var data = res;
					this.monitortypelist = data;
					this.monitortype = data[0].partId; //默认select显示第一个
					this.getmonitorurl(data[0].partId); //获取第一个视频
				})
			},
			getmonitorurl(partId) { //获取视频
				var params = new FormData();
				params.append("partId", partId)
				this.$axios.post("/fire/fire/listVedioUrl", params).then(res => {
					var data = res;
					data.map((item,index)=>{
						item.index=index;
					})
					this.monitorurl = data;
					this.selectobj = data[0];
					this.start(); //默认播放第一个视频
				})

			},
			start() {
				this.videotype =this.selectobj.subPlatform;
				if(this.videotype==5){//海康插件播放
					this.$refs.hik&&this.$refs.hik.init(false);
					setTimeout(()=>{
						this.$refs.hik&&this.$refs.hik.init(true);
					},500)
				}else{
					$("#my-video").remove();
					videoplay.wsbackclose();
					videoplay.preview(this.selectobj, "myvideolr", "my-video",'my-video2');
				}

			},
		},
		beforeDestroy: function() {
		  videoplay.wsbackclose();
		},
	}
</script>

<style lang="scss">
	#schoolVideo {
		height: 100%;
		width: 100%;
	}

	#my-video {
		height: 100%;
		width: 100%;
	}

	.Monitor {
		.backboxContainer {
			position: relative;
		}
		
		.myvideolr,.monitorvideoOther{
			height: 100%;
			width: 100%;
		}
		.el-select-dropdown .el-popper {
			width: 100%;
			height: 100%;
			top: 1.3rem;
			left: 300px;
			z-index: 999999
		}
		.button-box {
			background: rgba(0, 255, 255, 0.3);
			color: #FFFFFF;
			padding: 0.2rem;
			border-radius: 0px
		}
		.el-button.is-plain:focus,
		.el-button.is-plain:hover {
			background: rgba(0, 255, 255, 0.3);
			color: #FFFFFF;
		}
		.video-button {
			position: absolute;
			bottom: 0px;
			left: 0px;
			width: 100%;
			text-align: right;
		}
		.el-button+.el-button {
			margin-left: 0rem;
		}
		.monitorvideo {
			height: calc(100% - 2rem);
		}
		.Monitor-titletop {
			width: 100%;
			margin-top: 10px;
		}
		.m-title {
			color: rgba(117, 203, 242, 1);
		}
		.m-butt {
			display: inline-block;
			.el-input {
				width: 7rem;
				text-align: left;
			}
			.el-input--suffix .el-input__inner {
				padding-right: 0px;
			}
			.el-input__suffix {
				padding: 0px;
			}
			.el-input__inner {
				height: 1.2rem;
				line-height: 1.2rem;
				background: #021a2c;
				width: 6rem;
				font-size: 0.8rem;
				color: rgba(153, 153, 153, 1);
				padding: 0px 0.25rem;
				text-align: center;
			}
			.el-input__suffix {
				background: #021a2c;
			}
			.el-select {
				border: 1px solid rgba(74, 172, 219, 1);
				border-radius: 4px;
			}
			.el-select-dropdown {}
		}
		.m-button {
			text-align: center;
			display: inline-block;
			span {
				font-size: 0.8rem;
			}
			.el-button {
				border: 1px solid rgba(0, 255, 255, 1);
				padding: 0.2rem 0.6rem;
			}
			.el-button--default,
			.el-button--default:focus,
			.el-button--default:hover {
				font-size: 0.8rem;
				color: rgba(254, 254, 254, 1);
			}
		}
	}

	.selectpop {
		.el-select-dropdown__wrap {
			font-size: 14px;
		}
		.el-select-dropdown__item span {
			font-size: 14px;
		}
	}
</style>
