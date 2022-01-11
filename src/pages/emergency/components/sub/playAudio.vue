<template>
	<el-dialog  center  class="playAudio emergency-modal" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="432px">
		<div class="svg-c">
			<svg id="svgForStroke" width="400" height="120" xmlns="https://www.w3.org/2000/svg">
				 <g>
				 	<path  d="M0 60 L50 60 L55 35 L60 75 L62 23 L70 85 L90 45 L100 75 L110 35 L120 100 L130 20 L135 80 L138 30 L150 100 L168 60 A 32 32 0 0 1 232 60" fill="none" stroke="#4AACDB" stroke-width="2" :stroke-dasharray="w" :stroke-dashoffset="offset" stroke-linejoin="null" stroke-linecap="round"/>
				 	<path  d="M400 60 L350 60 L345 35 L340 75 L338 23 L330 85 L310 45 L300 75 L290 35 L280 100 L270 20 L265 80 L262 30 L250 100 L232 60  A 32 32 0 0 1 168 60" fill="none" stroke="#4AACDB" stroke-width="2" :stroke-dasharray="w" :stroke-dashoffset="offset" stroke-linejoin="null" stroke-linecap="round"/>
				
				 </g>
			</svg>
			<img :src="'../../../../../static/images/emergency/'+(state?'pause.png':'play.png')" @click="togglePlay"/>
		</div>
		<div class="audio-c"  v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="transparent">
			<template v-if="list.src">
				<audio autobuffer="autobuffer" autoplay="autoplay" :src="list.src+'?token='+token"  controls="controls" @play="play" @pause="pause" @ended="pause" @error="mistake" ref="mediaTag" :key="list.isSupport"  v-if="list.isSupport" ></audio>
				<embed autostart="true" width="100%" height="150px" controls="smallconsole" :src="list.src+'?token='+token" allowscriptaccess="true" ref="mediaTag" :key="list.isSupport" v-else></embed>
				<!--<object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="100%" height="100%"  ref="mediaTag"  :key="list.isSupport" v-else></object>-->
			</template>	
		</div>
	</el-dialog>
</template>

<script>
	var timer,support;
export default {
	name: 'playAudio',
	data(){
		return{
			curr:'',
			state:false,
			list:{},
			loading:true,
			w:850,
			offset:850,
			token:TOKEN
		}
	},
	mounted(){
		var vm=this;
		this.bus.$on('hideEmergencyDialog',function(){
			try{
				vm.close();
			}catch(e){}
		})
	},
	methods:{		
		autoPlay(i,item){
			var vm=this;
			vm.list={};
			this.startAnimation();
			if(item.transcripts_url){
				this.getAuido(item);
			}else{
				vm.$message({
					message: '未获取到播放地址',
					type: 'warning'
				});
			}
			vm.playTheAlarm(item)
		},
		//请求播放录音接口
		playTheAlarm(item){
			try{
				if(item.isReade==1){
					return;
				}
				var params={
					isReade:"1",
					uuid:item.uuid||''
				}
				this.$axios.post('contingency/realTimeAlert/playTheAlarm', params).then((res) => {
					item.isReade=1;
				});
			}catch(e){
				console.log('请求播放录音失败'+e.message);
			}
		},
		//获取音频
		getAuido(item){
			var vm=this;
			vm.curr=1;
			var obj={
				src:OHTTP+item.transcripts_url.substring(1),
				isSupport:vm.canPlayType(item.transcripts_url),
			};
			vm.list=obj;
			vm.$nextTick(function(){
				vm.loading=false;
				if(!vm.list.isSupport){
					vm.notSupport();
				}
			})
//			this.$axios.get(item.transcripts_url.substring(1),{responseType:'blob'}).then(function(res){
//				var b=res.data;
//				 if (res.status == 200) {
//              	var obj={};
//              	try{
//              		obj={
//							src:'https://osvaldas.info/examples/audio-player-responsive-and-touch-friendly/audio.wav',
////							src:'',//https://www.jq22.com/demo/jQuery-music20160328/tracks/jq22com2.mp3
//							isSupport:vm.canPlayType(item.transcripts_url),
//						};
////						var a = new FileReader();
////						a.readAsDataURL(b);
////						a.onload = function (e){
////							obj.src=e.target.result;
////							vm.list=obj;
////							vm.$nextTick(function(){
////								vm.loading=false;
////							})
////						};
//						obj.isSupport=vm.canPlayType(obj.src);
//						vm.list=obj;
//	                    //不支持audio标签
//						if(!obj.isSupport){
//							vm.notSupport();
//						}	
//              	}catch(e){
//              		vm.$message({
//							message: '音频播放失败',
//							type: 'warning'
//						});
//						console.log(e.message)
//              	}                
//              } else {
//                 vm.$message({
//						message: '音频获取失败',
//						type: 'warning'
//					});
//              }
//			})
		},
		//不支持audio标签
		notSupport(){
			var vm=this;
			support=setInterval(function(){
				try{
					if(vm.$refs.mediaTag.playState==2){
						vm.play();
					}else{
						vm.pause();
					}
				}catch(e){
					vm.pause();
					clearInterval(support);
					console.log('音频状态获取失败'+e.message);
				}
			},100);
		},
		//判断是否支持audio标签播放
		canPlayType(file)
		{
			var audioElement = document.createElement( 'audio' );
			return !!( audioElement.canPlayType && audioElement.canPlayType( 'audio/' + file.split( '.' ).pop().toLowerCase() + ';' ).replace( /no/, '' ) );
		},
		play(){
			this.state=true;
		},
		pause(){
			this.state=false;
		},
		togglePlay(){
			try{
				//embed 方法Stop()、Pause()、Play()
				if(this.state){
					if(this.list.isSupport){
						this.$refs.mediaTag.pause();
					}else{
						this.$refs.mediaTag.Pause();
//						this.$refs.mediaTag.controls.pause();//object元素方法
					}
				}else{
					if(this.list.isSupport){
						this.$refs.mediaTag.play();
					}else{
						this.$refs.mediaTag.Play();
//						this.$refs.mediaTag.controls.play();//object元素方法
					}
				}
				this.state=!this.state;
			}catch(e){
				console.log('音频播放:'+e.message)
			}
		},
		//播放失败
		mistake(){
			this.$message({
				message: '播放失败',
				type: 'warning'
			});
		},
		//曲线动画
		startAnimation(){
			var vm=this;
			vm.loading=true;
			clearInterval(timer);
			vm.offset=vm.w;
			vm.$nextTick(function(){
				timer=setInterval(function(){
					if(vm.offset>6){
						vm.offset=vm.offset-6
					}else{
						vm.offset=0;
						clearInterval(timer);
					}
				},10)
			})
		},
		close(){
			var vm=this;
			this.curr='';
			this.list.src='';
			clearInterval(timer);
			clearInterval(support);
			vm.offset=vm.w;
		}
	}
}
</script>

<style lang="scss">
	.playAudio{
		.el-dialog__header{
			padding: 0px;
		}
		.audio-c{
			height: 50px;
			overflow: hidden;
			position: relative;
			audio{
				width: 100%;
				height: 50px;
			}
			embed,audio,object{
				position: absolute;
				left: 0px;
				bottom: 0px;
				z-index: 2001;
				/*background: #002037;*/
			}
			.el-loading-spinner{
				margin-top: -8px;
			}
		}
		.el-icon-loading{
			font-size: 30px;
		}
		.svg-c{
			width: 400px;
			margin: auto;
			position: relative;
			img{
				position: absolute;
				width: 64px;
				height: 64px;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				margin-top: -2px;
				border-radius: 50%;
				cursor: pointer;
			}
		}
	}	
</style>
