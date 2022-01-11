<template>
	<div class="module h-CLEFT-self">
		<!--<BasicInformation></BasicInformation>-->
		<back-box class="CLEFT CLEFT1">
			<nowDayAlarm></nowDayAlarm>
		</back-box>
		<back-box class="CLEFT3">
			<realTimeAlarm></realTimeAlarm>
		</back-box>
		<back-box class="CLEFT4">
			<alarmAnalysis></alarmAnalysis>
		</back-box>
		<back-box class="CBOTTOM CBOTTOM1">
			<alarmTypes></alarmTypes>
		</back-box>
		<back-box class="CBOTTOM CBOTTOM2 CBOTTOM-self">
			<alarmTimeAnalysis></alarmTimeAnalysis>
		</back-box>
	</div>
</template>

<script>
	import nowDayAlarm from './components/nowDayAlarm.vue';
	import realTimeAlarm from './components/realTimeAlarm.vue';
	import alarmTypes from './components/alarmTypes.vue';
	import alarmTimeAnalysis from './components/alarmTimeAnalysis.vue';
	import alarmAnalysis from './components/alarmAnalysis.vue';
	export default {
		name: 'energySafety',//能耗安全
		components: {//引入模块
//			BasicInformation,//基础信息
			nowDayAlarm,//当日告警
			realTimeAlarm,//实时告警
			alarmTypes,//告警类型占比
			alarmTimeAnalysis,//告警时段分析
			alarmAnalysis,//告警分析
		},
		mounted: function() {}
	}
</script>

<style>
	/*覆盖首页 定义的样式
	 校园生活与首页页面格局不一样  重新定位该模块 位置
	 * */
	.CBOTTOM-self{
		width: 917px !important;
	}
	.h-CLEFT-self>.Z-border{
		padding: 10px !important;
	}
</style>