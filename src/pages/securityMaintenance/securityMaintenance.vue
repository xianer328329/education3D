<template>
	<div class="module" >
		<div class="section-left">			
			<back-box class="visible">
				<BasicInformation></BasicInformation>
				<alarmInfo authName="al_securitymaintenance_working_monitor_monitorcurrentstatus" authDesc="当日告警" class="NO_Auth"></alarmInfo>
			</back-box>
			<back-box class="border-anim">
				<alarmTrend authName="al_securitymaintenance_working_monitor_alarmtop" authDesc="告警趋势" class="NO_Auth"></alarmTrend>
			</back-box>
		</div>
		<div class="section-bottom">
			<back-box class="border-anim">
				<healthMonitoring authName="al_securitymaintenance_working_monitor_healthmonitoring" authDesc="健康监测" class="NO_Auth"></healthMonitoring>
			</back-box>
			<back-box class="border-anim">
				<serviceComment authName="al_securitymaintenance_servicecomment" authDesc="服务评价" class="NO_Auth"></serviceComment>
			</back-box>
		</div>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import alarmInfo from './components/alarmInfo.vue';
	import alarmTrend from './components/alarmTrend.vue';
	import healthMonitoring from './components/healthMonitoring.vue';
	import serviceComment from './components/serviceComment.vue';
	export default {
		name: 'fireMaintenance',
		components: {//引入模块
			BasicInformation,//基础信息
			alarmInfo,//告警信息
			alarmTrend,//告警趋势
			healthMonitoring,//健康监测
			serviceComment,//服务评价
		},
		mounted: function() {
		}
	}
</script>
<style scoped="scoped">
	
</style>