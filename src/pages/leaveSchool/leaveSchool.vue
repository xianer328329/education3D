<template>
	<div class="module h-CLEFT-self">
		<BasicInformation ></BasicInformation>
		<back-box class="CLEFT CLEFT1">
			<FreshmanRegistrationRate></FreshmanRegistrationRate>
			<!--<img src="../../../static/images/liveschool/liveschool1.png" />-->
		</back-box>
		<back-box class="CLEFT3 CLEFT2-3">
			<EmploymentAnalysis></EmploymentAnalysis>
			<!--<img src="../../../static/images/liveschool/liveschool2.png" />-->
		</back-box>
		<back-box class="CBOTTOM CBOTTOM1 CBOTTOM1-3">
			<whereabouts></whereabouts>
			<!--<img src="../../../static/images/liveschool/liveschool3.png" />-->
		</back-box>
	</div>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import EmploymentAnalysis from './components/EmploymentAnalysis'
	import whereabouts from './components/whereabouts'
	import FreshmanRegistrationRate from './components/FreshmanRegistrationRate'
	//FreshmanRegistrationRate.vue
	export default {
		name: 'leaveSchool', //离校
		components: { //引入模块
			EmploymentAnalysis,
			whereabouts,
			FreshmanRegistrationRate,
			BasicInformation
		},
		mounted: function() {}
	}
</script>

<style scoped="scoped" lang="scss">
	.h-full {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 18;
	}
</style>