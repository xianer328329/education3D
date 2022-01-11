<template>
	<div class="h-container alarmInfo">
		<h4 class="mdTitle">告警信息</h4>
		<ul class="backboxContainer">
			<li>
				<div class="vertical-middle-c" @click="showSub(0)">
					<div class="vertical-middle">
						<p class="Z-numberf" :class="{'yellow':list.moveNum>0}">{{list.moveNum}}</p>
						<img src="../../../../static/images/img4.png"/>
						<span>动环告警</span>
					</div>
				</div>
			</li>
			<li>
				<div class="vertical-middle-c" @click="showSub(2)">
					<div class="vertical-middle">
						<p class="Z-numberf" :class="{'yellow':list.lineNum>0}">{{list.lineNum}}</p>
						<img src="../../../../static/images/img4.png"/>
						<span>设备离线</span>
					</div>
				</div>
			</li>
			<li>
				<div class="vertical-middle-c" @click="showSub(1)">
					<div class="vertical-middle">
						<p class="Z-numberf" :class="{'yellow':list.accessNum>0}">{{list.accessNum}}</p>
						<img src="../../../../static/images/img4.png"/>
						<span>非法接入</span>
					</div>
				</div>
			</li>
		</ul>
		<alarmList ref="alarmList"></alarmList>
	</div>
</template>

<script>
	import alarmList from './alarmList.vue';
	export default {
		name: '',
		data(){
			return {
				list:{
					moveNum:'--',
					lineNum:'--',
					accessNum:'--',
				}
			}
		},
		components: {//引入模块
			alarmList
		},
		mounted: function() {
			var vm=this;
			this.getInfo();
			this.bus.$on('refreshAlarm',function(){
				vm.getInfo();
			});
		},
		methods:{
			getInfo(){
				var vm=this;
				var params={
					unitUuid:UNITID
				}
				this.$axios.post('box/statistics/aalarm',params).then(data=>{
					vm.list=data||{};
				})
			},
			showSub(type){
				this.$refs.alarmList.show(type);
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmInfo{
		ul{
			font-size: 0px;
			margin-left: -0.25rem;
			margin-right: -0.25rem;
		}
		li{
			display: inline-block;
			width:33.33%;
			height:100%;
			cursor: pointer;
			padding: 0px 0.25rem;
			box-sizing: border-box;
			vertical-align: top;
			.vertical-middle-c{
				height: 100%;
				background:rgba(10,63,94,1);
				border:1px solid rgba(10,80,122,1);
				box-sizing: border-box;
				p{
					font-size: 1.1rem;
					color: #00FFFF;
					min-height: 1.2rem;
					&.yellow{
						color: #FFCC00;
					}
				}
				img{
					margin: 0.4rem auto 0px;
					max-width: 100%;
				}
				span{
					display: inline-block;
					font-size: 0.8rem;
					color: #75CBF2;
					margin-top: 0.5rem;
				}
			}
		}
	}
</style>