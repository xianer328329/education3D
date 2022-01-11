<template>
	<div class="h-container">
		<div class="shrinkNav" id="shrinkNav" @click.stop="">
			<ul>
				<li class="NO_Auth"  @click="shrink(0,$event)" authName="al_carsupervision_traffic_pass_baseinfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]" @click.stop="">
					<ul class="clearFix">
						<li class="divbase">
							<p class="textsize">{{info.carEntrance}}</p>
							<p>车辆进出口</p>
						</li>
						<!--<li class="divbase">
							<p class="textsize">{{info.roadGate}}</p>
							<p>车管通道</p>
						</li>-->
						</li>
						<li class="divbase">
							<p class="textsize">{{info.violationPoint}}</p>
							<p>违停监控点</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{info.singleSpeed}}</p>
							<p>单向测速点</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{info.doubleSpeed}}</p>
							<p>双向测速点</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{info.parkCapacity}}</p>
							<p>车位容量</p>

						</li>
						<li class="divbase">
							<p class="textsize">{{info.registeredCar}}</p>
							<p>注册车辆</p>
						</li>
						<li class="divbase singular">
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
				this.$axios.post('traffic/pass/baseInfo')
					.then(function(res) {
						vm.info = res;
					})
			},
			shrink(oIndex,event) {
				clickshrink(oIndex,event,this)
			}
		},
	}
</script>

<style lang="stylus" scoped="scoped">

</style>