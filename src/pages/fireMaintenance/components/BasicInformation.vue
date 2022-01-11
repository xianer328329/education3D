<template>
	<div class="h-container">
		<div class="shrinkNav" id="shrinkNav" @click.stop="">
			<ul>
				<li class="NO_Auth"  @click="shrink(0,$event)" authName="al_firemaintenance_fire_operation_baseinfo" authDesc="基础信息">基础信息</li>
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
						<p class="textsize">{{info.superviseGrade}}</p>
						<p>监管等级</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.smallStation}}</p>
						<p>微型消防站</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.buildingCount}}</p>
						<p>建筑</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.alarmDevice}}</p>
						<p>报警主机</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.evacuationCase}}</p>
						<p>疏散箱</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.monitorNode}}</p>
						<p>监测节点</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.extinguisher}}</p>
						<p>灭火器</p>
					</li>
					<li class="divbase">
						<p class="textsize">{{info.fireHydrant}}</p>
						<p>消火栓</p>
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
				this.$axios.post('fire/operation/baseInfo')
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