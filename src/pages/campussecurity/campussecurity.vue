<template>
	<div class="module campussecurity">
		<div class="section-left">
			<!-- CLEFT CLEFT1  -->
			<back-box class="border-anim">
				<BasicInformation></BasicInformation>
				<Dayalarm authName="al_campussecurity_monitor_dailyalarm" authDesc="当日告警" class="NO_Auth"></Dayalarm>
			</back-box>
			<!-- RECTANGLEBOX  -->
			<back-box class="border-anim videoAlarm">
				<VideoAlarm authName="al_campussecurity_monitor_alarmprocessing" authDesc="视频告警" class="NO_Auth no-padding"></VideoAlarm>
			</back-box>
		</div>
		<div class="section-bottom">
			<!-- CBOTTOM CBOTTOM1 -->
			<back-box class=" visible">
				<JointDefenceExecuteControl authName="al_campussecurity_monitor_jointDefenseControl" authDesc="联防布控" class="NO_Auth"></JointDefenceExecuteControl>
			</back-box>
			<!-- MAXCBOTTOM MAXBOTT -->
			<back-box class="border-anim">
				<AlarmTrend authName="al_campussecurity_monitor_alarmtrend" authDesc="告警趋势" class="NO_Auth"></AlarmTrend>
			</back-box>
		</div>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import JointDefenceExecuteControl from './components/JointDefenceExecuteControl.vue'
	import AlarmTrend from './components/AlarmTrend.vue'
	import VideoAlarm from './components/VideoAlarm.vue'
	import Dayalarm from './components/Dayalarm.vue'

	export default {
		components: {
			BasicInformation,//基础信息
			JointDefenceExecuteControl, //联防布控模块
			AlarmTrend, //告警趋势页面
			VideoAlarm, //视频告警页面
			Dayalarm, //当日告警
		},
		data() {
			return {

			}
		},
		mounted: function() {
		
		},
		methods: {
			
		}
	}
</script>
<style lang="stylus" scoped>
	.NO_Auth.no-padding:after{
		top: 0px;
    	left: 0px;
    	bottom: 0px;
    	right: 0px;
	}
	.videoAlarm{
		padding:0px !important;
	}
</style>