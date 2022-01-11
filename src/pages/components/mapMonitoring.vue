<template>
	<div>
		<div id="Z-mapMon" style="display:none" >
			<div class="Z-mapPopout Z-mapMon"  ref="mapMon">
				<div class="Z-mapPopoutF">
					<h5 class="PopoutTop"><span>状态</span><span>设备ID</span><span>位置</span><span class="seat"></span><span class="seat"></span></h5>
					<img class="closeInfoWindow" src="../../../static/images/Zgb.png" alt="" @click="closeInfoWindow"/>
					<ul>
						<li class="clearFix Z-monitoringli" :class="{'active':itme.deviceUuid==row.deviceUuid}" v-for="(itme,index) of list" :key="index">
							<span :title="itme.deviceStatusName" :class="{'typerad':itme.deviceStatusName=='离线'}">{{itme.deviceStatusName}}</span>
							<span :title="itme.deviceCode">{{itme.deviceCode}}</span>
							<span :title="itme.deviceName">{{itme.deviceName}}</span>
							<span class="seat"><img class="Z-monitoringC " src="../../../static/images/map/icon_tv.png" alt="" @click="realtimeVideo(itme)"/></span>
							<!-- 海康视频回放 -->
							<span class="seat" v-if="itme.subplatform==1||itme.subplatform==5"><img class="playback_icon" src="../../../static/images/map/icon_playback.png" alt="" @click="playbackVideo(itme)" /></span>
						</li>
					</ul>
				</div>
			</div>			
		</div>
	    <playback  ref="playback"></playback>
	</div>

</template>

<script>
	var omaxmap=null;	
	export default {
		name: 'MapMonitoring2',
		data() {
			return {
				maxmap:null,
				infoWindow:null,//监控列表弹框
				row:{},
				list: []
			}
		},
		components:{
			playback:()=>import('./playback.vue'),
		},
		mounted: function() {
			
		},
		methods: {
			getIconDeviceList(iconType, point,maxmap,cameraName,cameraType) {
				var _this = this;
				this.row={};
				this.maxmap=maxmap;
				var parameter = new FormData();
				cameraName&&parameter.append('iconName',cameraName);
				cameraType&&parameter.append('cameraType',cameraType);
				parameter.append('iconType', iconType);
				parameter.append('latitude', point[1]);
				parameter.append('longitude', point[0]);
				this.$axios.post('home/iconDeviceList', parameter).then(function(res) {
					var data=res.list;
					if(data && data.length > 0) {
						_this.list = data;
						_this.$nextTick(function() {
							_this.attributeMon(iconType, point, data)
						});

					}

				});
			},
			attributeMon(oType, point, data) {
				var vm=this;
				// var content = $('#Z-mapMon').html();
				this.infoWindow = new AMap.InfoWindow({
 				 	isCustom: true,  //使用自定义窗体
 					content: this.$refs.mapMon,
  					anchor: 'top-left',
				});
				 this.infoWindow.open(this.maxmap,point);
			},
			closeInfoWindow(){
				if(this.infoWindow){
					this.infoWindow.close();
					this.infoWindow=null;
				}
			},
			// 查看实时视频
			realtimeVideo(itme) {
				var _this = this;
				this.row={...itme};				
				var list = {
					show: true,
					subPlatForma: itme.subplatform,
					title: itme.deviceName,
					real: true,
					isplayback: 1,
				}
				_this.bus.$emit('addpop3video', {...itme,...list});
			},
			playbackVideo(itme){	
				var list = {
					...itme,
					subPlatForma:itme.subplatform
				}
				this.$refs.playback.autoPlay(2,list);
			}
		},
		
		
	}
	
</script>

<style lang="stylus">
	.Z-mapMon {
		border: 1px solid #38c1ff;
		border-radius: 6px;
		overflow: hidden;
		background: #001c2e;
		width: 23rem;
		margin-top: 0.5rem;
		.seat{
			flex:0 !important;
			min-width:auto !important;
			flex-basis:2.2rem !important;
		}
	}
	
	.Z-mapMon .PopoutTop {
		height: 2rem;
		line-height: 2rem;
		font-size: 1rem;
		color: #fff;
		background: #004e81;
		padding: 0px 10px;
		display:flex;
	}
	
	.Z-mapMon .PopoutTop span {
		font-size: 1rem;
		color: #fff;
		flex:1 1;
		text-align: center;
		display: inline-block;
		margin: 0 0.15rem;
	}
	
	.Z-mapMon .PopoutTop span:nth-of-type(3) {
		width: 6rem;
	}
	.Z-mapMon .Z-mapPopoutF{
		position:inherit;
		top:inherit;
		right:inherit;
		width:100%;
		
	}
	.Z-mapPopoutF .closeInfoWindow {
		position:absolute;
		top:0.25rem;
		right:0.3rem;
		width:1.5rem;
		height:1.5rem;
		cursor: pointer;
	}
	
	.Z-mapPopoutF ul {
		max-height: 18rem;
		overflow: auto;
	}
	
	.Z-mapMon .Z-mapPopoutF ul li {
		height: 2rem;
		line-height: 2rem;
		padding: 0px 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		display:flex;
		&.active{
			box-shadow:0 0 10px #0ff inset;
		}
	}
	
	.Z-mapPopoutF ul li:nth-of-type(2n+2) {
		background: #00243c;
	}
	
	.Z-mapMon .Z-mapPopoutF ul li span {
		width: auto;
		font-size: 1rem;
		text-align: center;
		color: #75CBF2;
		float: left;
		margin: 0 0.15rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex:1 1;		
	}
	
	.Z-mapPopoutF ul li .typerad {
		color: red;
	}
	.Z-mapPopoutF ul li img {
		float: left;
		width: 1.2rem;
		height: 0.7rem;
		margin-left: 0.85rem;
		margin-top: 0.6rem;
		&.playback_icon{
			width:1.3rem;
			height:1.3rem;
			margin-top:0.3rem;
		}
	}
</style>