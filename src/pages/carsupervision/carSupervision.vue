<template>
	<div class="module h-CLEFT-self">
		<div class="section-left">			
			<back-box class="visible">
				<BasicInformation></BasicInformation>
				<nowDayAlarm authName="al_carsupervision_traffic_pass_alarminfo" authDesc="当日告警" class="NO_Auth"></nowDayAlarm>
			</back-box>
			<back-box class="border-anim">
				<alarmAnalysis authName="al_carsupervision_traffic_pass_alarm" authDesc="告警分析" class="NO_Auth"></alarmAnalysis>
			</back-box>
			<back-box class="border-anim">
				<trafficFlowAnalysis authName="al_carsupervision_traffic_pass_traffic" authDesc="车流分析" class="NO_Auth"></trafficFlowAnalysis>
			</back-box>
		</div>
		
		<div class="section-bottom">
			<back-box class="visible">
				<jointDefenseControl authName="al_carsupervision_traffic_pass_jointcontrol" authDesc="联防布控" class="NO_Auth"></jointDefenseControl>
			</back-box>
			<back-box class="border-anim">
				<sensitiveDetection authName="al_carsupervision_traffic_pass_carmore" authDesc="敏感监测" class="NO_Auth"></sensitiveDetection>
			</back-box>
		</div>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import nowDayAlarm from './components/nowDayAlarm.vue'
	import alarmAnalysis from './components/alarmAnalysis.vue'
	import trafficFlowAnalysis from './components/trafficFlowAnalysis.vue'
	import jointDefenseControl from './components/jointDefenseControl.vue'
	import sensitiveDetection from './components/sensitiveDetection.vue'
	export default {
		name: 'carSupervision',
		components: {//引入模块
			BasicInformation,//基础信息
			nowDayAlarm,//当日告警
			alarmAnalysis,//告警分析
			trafficFlowAnalysis,//车流分析
			jointDefenseControl,//联防布控
			sensitiveDetection,//敏感侦测
		},
		mounted: function() {
		}
	}
</script>
