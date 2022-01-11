<template>
	<div class="module">	
		<div class="section-left">
			<back-box class="border-anim">
				<BasicInformation></BasicInformation>
				<pay></pay>
			</back-box>
			<back-box class="border-anim">
				<dormAnalysis></dormAnalysis>
			</back-box>
			<back-box class="border-anim">
				<reportProcess></reportProcess>
			</back-box>			
		</div>
		<div class="section-bottom">
			<back-box class="border-anim">
				<registrationRate></registrationRate>
			</back-box>
			<back-box class=" border-anim">
				<studentInfoAnalysis></studentInfoAnalysis>
			</back-box>
		</div>
		<!--<hMap></hMap>-->
		<!--<img src="../../../static/images/welcome/6.png" class="h-left-info"/>-->
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import pay from './components/pay.vue'
	import dormAnalysis from './components/dormAnalysis.vue'
	import studentInfoAnalysis from './components/studentInfoAnalysis.vue'
	import registrationRate from './components/registrationRate.vue'
	import reportProcess from './components/reportProcess.vue'
	import hMap from './components/map.vue'
	export default {
		name: 'welcome',//迎新
		components: {//引入模块
			BasicInformation,//基础信息
			pay,//财务缴费
			dormAnalysis,//寝室分析
			studentInfoAnalysis,//学生信息分析
			registrationRate,//新生报到率
			reportProcess,//报道流程统计
			hMap,//地图
		},
		mounted: function() {
			
		},
		methods:{
			
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.h-full{
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 18;
	}
	.CBOTTOM.CBOTTOM-self1{
		width: 685px !important;
	}
	.CBOTTOM.CBOTTOM-self2{
		left: 715px !important;
	}
	.h-CLEFT-self>.Z-border{
		padding: 10px !important;
	}
	.h-left-info{
		position: absolute;
		left: 55px;
		bottom: 300px;
		z-index: 18;
	}
</style>