<template>
	<div class="h-container">
		<div class="shrinkNav" id="shrinkNav" @click.stop="">
			<ul>
				<!--NO_Auth-->
				<li class="NO_Auth" @click="shrink(0,$event)" authName="al_firemaintenance_fire_operation_baseinfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]" @click.stop="">
					<ul class="clearFix">
						<li class="divbase">
							<p class="textsize">{{info.Terminal}}</p>
							<p>刷卡终端</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{info.Student}}</p>
							<p>持卡学生</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{info.TeachingStaff}}</p>
							<p>持卡教职工</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{info.Time}}</p>
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
				showSKRINK: [false],
				info: {
					Terminal:2,
					Student:2.2,
					TeachingStaff:1365,
					Time:37,
				}
			}
		},
		mounted: function() {
//			this.getInfo();
		},
		methods: {
			//获取基础信息
			getInfo() {
				var vm = this;
				this.$axios.post('fire/operation/baseInfo')
					.then(function(res) {
						vm.info = res.data.data;
					})
			},
			shrink(oIndex, event) {
				clickshrink(oIndex, event, this)
			}
		},
	}
</script>

<style lang="stylus" scoped="scoped">

</style>