<template>
	<div class="F-box">
		<h4 class="mdTitle">建筑能耗排名TOP5</h4>
		<month-selc @monDateTimeChange='energyDate'></month-selc>
		<div class="backboxContainer">
			<el-table :data="energylists" class="F-eneryt" stripe height="100%" @row-click="">
				<el-table-column prop="buildname" label="楼宇" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="energy" label="耗能(kgce/㎡)" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import MonthSelc from '../../components/monthSelection'
	export default {
		name: "energyconsumptionTop",
		components: {
			MonthSelc,
		},
		data() {
			return {
				energylists: [{
						buildname: "仁智楼",
						energy: "389",
					},
					{
						buildname: "兰苑",
						energy: "356",
					}, {
						buildname: "格勤楼",
						energy: "307",
					}, {
						buildname: "柏苑",
						energy: "296",
					}, {
						buildname: "博智楼",
						energy: "295",
					}
				],
			}
		},
		mounted() {

		},
		methods: {
			energyDate(mydate) {
				console.log(mydate)
			},
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
