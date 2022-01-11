<template>
	<div class="module" >
		<div class="section-left half-left">
			<back-box class="visible">
				<Basic-infor></Basic-infor>
				<warning-message authName="al_schoolfire_fire_fire_alarminfo" authDesc="当日告警" class="NO_Auth"></warning-message>
			</back-box>
			<back-box class="border-anim">
				<key-monitoring authName="al_schoolfire_key_monitoring" authDesc="重点监控" class="NO_Auth"></key-monitoring>
			</back-box>
		</div>
		
		<div class="section-bottom full-bottom">
			<back-box class="border-anim">
				<alarm-trend authName="al_schoolfire_fire_fire_alarmtrend" authDesc="告警趋势" class="NO_Auth"></alarm-trend>
			</back-box>
			<back-box class="border-anim">
				<health-monitoring authName="al_schoolfire_fire_fire_healthmonitoring" authDesc="健康监测" class="NO_Auth"></health-monitoring>
			</back-box>
		</div>
		
	</div>
</template>

<script>
	import  warningMessage  from './components/warningMessage' //告警信息
	import  alarmTrend  from './components/alarmTrend' //告警趋势
	import  healthMonitoring  from './components/healthMonitoring' //健康监测
	import  keyMonitoring  from './components/keyMonitoring' //重点监控
	import BasicInfor from './components/BasicInformation'//基本信息
	
	export default{
		name: 'SchoolFire',
		components: {//引入模块
			warningMessage,//告警信息
			alarmTrend,//告警趋势
			healthMonitoring,//健康监测
			keyMonitoring,//重点监控
			BasicInfor//基本信息
		
		},
		mounted: function() {
		}
	}
</script>

<style lang="stylus" scoped>
</style>