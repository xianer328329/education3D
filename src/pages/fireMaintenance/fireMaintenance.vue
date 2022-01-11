<template>
	<div class="module">
		<div class="section-left">
			<back-box class="visible">
				<BasicInformation ></BasicInformation>
				<fireAlarm authName="al_firemaintenance_fire_operation_alarminfo" authDesc="当日告警" class="NO_Auth"></fireAlarm>
			</back-box>
			<back-box class="border-anim">
				<alarmTrend authName="al_firemaintenance_fire_operation_top" authDesc="告警趋势" class="NO_Auth"></alarmTrend>
			</back-box>
		</div>
		<div class="section-bottom">
			<back-box class="border-anim">
				<runningState authName="al_firemaintenance_fire_operation_workingState" authDesc="运行状态" class="NO_Auth"></runningState>
			</back-box>
			<back-box class="border-anim">
				<serviceComment authName="al_firemaintenance_servicecomment" authDesc="服务评价" class="NO_Auth"></serviceComment>
			</back-box>
		</div>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import fireAlarm from './components/fireAlarm.vue';
	import alarmTrend from './components/alarmTrend.vue';
	import runningState from './components/runningState.vue';
	import serviceComment from './components/serviceComment.vue';
	export default {
		name: 'fireMaintenance',
		components: {//引入模块
			BasicInformation,//基础信息
			fireAlarm,//消防告警
			alarmTrend,//告警趋势
			runningState,//运行状态
			serviceComment,//服务评价
		},
		mounted: function() {
			
		}
	}
</script>
<style scoped="scoped">
	
</style>