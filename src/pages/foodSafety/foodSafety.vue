<template>
	<div class="module">
		<BasicInformation></BasicInformation>
		<back-box class="CLEFT CLEFT1">
			<Dayalarm></Dayalarm>
		</back-box>
		<back-box class="RECTANGLEBOX">
			<VideoAlarm></VideoAlarm>
		</back-box>
		<back-box class="CBOTTOM CBOTTOM1">
			<supply></supply>
		</back-box>
		<back-box class="MAXCBOTTOM MAXBOTT">
			<AlarmTrend></AlarmTrend>
		</back-box>
	</div>
</template>

<script>
	import BasicInformation from './components/BasicInformation'
	import supply from './components/supply.vue'
	import AlarmTrend from './components/AlarmTrend.vue'
	import VideoAlarm from './components/VideoAlarm.vue'
	import Dayalarm from './components/Dayalarm.vue'

	export default {
		components: {
			BasicInformation,//基础信息
			supply, //食品安全链分析
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
	.RECTANGLEBOX {
		width: 489px !important;
		height: 691px !important;
		bottom: 20px;
		position: absolute !important;
		right: 20px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	
	.MAXBOTT {
		left: 484px;
	}
	
	.MAXCBOTTOM {
		bottom: 20px;
		width: 918px !important;
		height: 290px !important;
		position: absolute !important;
		right: 20px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding: 5px 10px;
	}
</style>