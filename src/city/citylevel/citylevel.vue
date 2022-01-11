<template>
	<div class=""  authName="al_citylevel_Cloud" authDesc="云端市级页面">
		<div class="cityLeft">
			<cloud-alarm></cloud-alarm>
			<day-infmation :infmationChild="cityData"></day-infmation>
			<supervision></supervision>
			<realtime-alarm></realtime-alarm>
			<base-infor :infmationChild="cityData"></base-infor>
		</div>
		<div class="cityRight">
			<search-box @BoxData="searchData"></search-box>
			<security-situation :infmationChild="cityData"></security-situation>
		</div>
		<link-map :infmationChild="cityData"></link-map>
	</div>
</template>

<script>
	/* eslint-disable */
	import cloudAlarm from '../components/cloudAlarm'
	import dayInfmation from '../components/dayInfmation'
	import supervision from '../components/supervision'
	import realtimeAlarm from '../components/realtimeAlarm'
	import baseInfor from '../components/baseInfor'
	import searchBox from '../components/searchBox'
	import securitySituation from '../components/securitySituation'
	import linkMap from '../components/linkMap'
	export default {
		name: 'citylevel',
		components: {
			cloudAlarm,
			dayInfmation,
			supervision,
			realtimeAlarm,
			baseInfor,
			searchBox,
			securitySituation,
			linkMap
		},
		data() {
			return {
				cityData: '',
			}
		},
		mounted() {},
		watch: {},
		methods: {
			searchData(payload) {
				this.cityData = payload;
				if(this.cityData == null) {
					this.cityData = {
						id: 2370,
						label:"重庆",
						pageFlag:"1",
					};
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.cityLeft {
		position: absolute;
		top: 80px;
		left: 27px;
	}
	
	.cityRight {
		position: absolute;
		top: 80px;
		right: 27px;
	}
</style>