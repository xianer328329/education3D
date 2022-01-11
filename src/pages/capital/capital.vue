<template>
	<div class="module h-CLEFT-self">
		<BasicInformation></BasicInformation>
		<back-box class="CLEFT CLEFT1">
			<annualAssets></annualAssets>
		</back-box>
		<back-box class="CLEFT3">
			<Analysise></Analysise>
		</back-box>
		<back-box class="CLEFT4">
			<state></state>
		</back-box>
		<back-box class="CBOTTOM CBOTTOM1">
			<distribution></distribution>
		</back-box>
		<back-box class="CBOTTOM CBOTTOM2-3">
			<DistributionEducation></DistributionEducation>
		</back-box>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import Analysise from './components/Analysise.vue'
	import state from './components/state.vue'
	import DistributionEducation from './components/DistributionEducation.vue'
	import annualAssets from './components/annualAssets.vue'
	import distribution from './components/distribution.vue'
	export default {
		name: 'capital', //资产
		components: { //引入模块
			annualAssets, //资产管理
			distribution, //资产分布
			DistributionEducation, //资产分布-教育
			state, //状态
			Analysise, //分析
			BasicInformation, //基础信息
		},
		mounted: function() {}
	}
</script>

<style scoped="scoped" lang="scss">
	.CBOTTOM2-3 {
		left: 482px;
		width: 918px;
		padding: 5px 5px
	}
	
	.h-full {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 18;
	}
</style>