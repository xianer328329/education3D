<template>
	<div class="h-container">
		<div class="shrinkNav" id="shrinkNav" @click.stop="">
			<ul>
				<li class="NO_Auth"  @click="shrink(0,$event)" authName="al_campussecurity_working_monitor_baseinfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition 
				enter-active-class="animated fadeInRight"	
				leave-active-class="animated fadeOutRight"
				
			>
			<back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]" @click.stop="">

				<ul class="clearFix">
					<li class="divbase">
						<p class="textsize">{{info.hostSystem}}</p>
						<p>系统主机</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.platformNumber}}</p>
						<p>平台</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.displayDevice}}</p>
						<p>显控</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.storageDevice}}</p>
						<p>存储设备</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.decodeDevice}}</p>
						<p>解码设备</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.videoDevice}}</p>
						<p>监控终端</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.alarmDevice}}</p>
						<p>报警柱</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.joinDate}}</p>
						<p>接入时间</p>
					</li>
				</ul>
			</back-box>
			</transition>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showSKRINK:[false],
				info: {}
			}
		},
		mounted: function() {
			this.getInfo();
		},
		methods: {
			//获取基础信息
			getInfo() {
				var vm = this;
				this.$axios.post('working/monitor/baseInfo')
					.then(function(res) {
						vm.info = res;
					})
			},
			shrink(oIndex,event){
				clickshrink(oIndex,event,this)
			}
		},
	}
</script>

<style lang="stylus" scoped="scoped">
	
</style>