<template>
	<div>
		<el-carousel class="Zslide" indicator-position="outside" height="100%" trigger="click" arrow="never" :interval="interval">
			<el-carousel-item label="能耗监管">
				<div class="energy fl">
					<div id="energyBar"></div>
				</div>
				<div class="amountCom amountBoxUp energyAmount fr">
					<div class="amount" :class="{'Z-on':type==1}" @click="clickFun(1)">
						<div class="amount-content">
							<span><i>{{personenery}}</i></span>
							<p>本校师生均能耗<small>(kgce/生)</small></p>
						</div>
					</div>
					<div class="amount" :class="{'Z-on':type==2}" @click="clickFun(2)">
						<div class="amount-content">
							<span><i>{{buildnery}}</i></span>
							<p>本校建筑能耗<small>(kgce/m²)</small></p>
						</div>
					</div>
				</div>
			</el-carousel-item>
			<el-carousel-item label="能源安全">
				<div class="energy-safety-L fl">
					<h6 class="mdTitle2">告警趋势</h6>
					<div id="safetyBar"></div>
				</div>
				<div class="energy-safety-R fr">
					<h6 class="mdTitle2">告警分类</h6>
					<div id="safetyPie"></div>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	/* eslint-disable */
	import axios from 'axios'
	export default {
		name: 'IndexEnergy',
		data() {
			return {
				//personenery:"167.29",
				//buildnery:"275.31",
				interval: 10000, //轮播间隔秒数
				personenery: "--",
				buildnery: "--",
				type: 1,
				superviseJson: {
					data1: [10, 10, 10, 10, 10, 10],
					data2: [10, 10, 10, 10, 10, 10],
					color: ['#33CC00', '#0478B7'],
					name: ['本校', '全国'],
					title: "师生能耗 (kgce/生)",
					oxAxis: ['10月', '11月', '12月', '01月', '02月', '03月'],
					leg: true,
					oMax: function(value) {
						return value.max + 3;
					},
				},
				4: [1, 2, 3, 4]
			}
		},
		methods: {
			clickFun(type) {
				this.type = type;
				if(type == 1) {
					this.getsuperviseData()
				} else if(type == 2) {
					this.getbuildData()
				}

			},
			getsuperviseData() {
				//this.superviseJson.data1=[153.36,172.74,189.58,186.77,104.55,196.78],
				//this.superviseJson.data2=[156.75,186.33,204.68,285.39,247.33,186.67],

				this.superviseJson.title = "师生能耗 (kgce/生)",
					this.superviseData('energyBar', this.superviseJson)
			},
			getbuildData() {
				//this.superviseJson.data1=[237.69,298.46,365.89,436.77,223.38,89.68],
				//this.superviseJson.data2=[276.33,367.45,423.27,532.11,560.68,396.76],
				this.superviseJson.title = "建筑能耗 (kgce/m)",
					this.superviseData('energyBar', this.superviseJson)
			},
			superviseData(Id, superviseJson) { //能源监管 柱状图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(bar2(superviseJson), true);
					allCharts.push(myChart);
				})
			},
			alarmType(Id, typeData, typeJson) { //能源安全 告警分类饼图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(Pie2H(typeData, typeJson), true);
					allCharts.push(myChart);
				})
			},
			alarmTrend(Id, trendJson) { //能源安全 告警趋势柱图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(bar(trendJson), true);
					allCharts.push(myChart);
				})	
			},

		},
		mounted: function() {
			this.getsuperviseData()
			var typeData = [{
					name: "违规电器",
					value: 0
				},
				{
					name: "故障电弧",
					value: 0
				},
				{
					name: "电流过大",
					value: 0
				},
				{
					name: "导线温度",
					value: 0
				},
				{
					name: "漏电",
					value: 0
				},
				{
					name: "漏水",
					value: 0
				},
			];
			var typeJson = {
				'color': ['#D46461', '#B9322E', '#A32C28', '#862423', '#79211F', '#4A1413'],
				'radius': '80%',
				'center': ['20%', '50%'],
			};
			this.alarmType('safetyPie', typeData, typeJson)
			//柱图
			var trendJson = {
				data: [25, 36, 55, 15, 18, 8],
				color: ['#31859C'],
				name: ['告警趋势'],
				oxAxis: ['10月', '11月', '12月', '01月', '02月', '03月'],
				oMax: function(value) {
					return value.max + 3;
				}
			};
			this.alarmTrend('safetyBar', trendJson)

		}
	}
</script>

<style lang="scss" scoped>
	/*能源监管*/
	.el-carousel{
		height: 100%;
	}
	.energy {
		width: 45%;
		height:100%;
		padding-top: 2rem;
		box-sizing: border-box;
	}
	
	#energyBar {
		width: 100%;
		height: 100%;
	}
	
	.energyAmount.amountBoxUp {
		float: right;
		width: 50%;
		height: 100%;
		max-width: 200px;
		padding-top: 2rem;
		padding-bottom: 0.5rem;
		margin-top: 0px;
		box-sizing: border-box;
	}
	
	.energyAmount .amount {
		width: 100%;
		cursor: pointer;
		padding: 0px !important;
	}
	
	.energyAmount .Z-on {
		background: rgba(0, 74, 118, 1);
		border: 2px solid rgba(0, 255, 255, 1);
	}
	
	.energyAmount .amount small {
		font-size: 12px;
	}
	
	.energy-safety-L {
		width: 40%;
		height:100%;
		padding-top: 2rem;
		box-sizing: border-box;
	}
	
	.energy-safety-R {
		width: 60%;
		height:100%;
		padding-top: 2rem;
		box-sizing: border-box;
	}
	
	#safetyBar,#safetyPie{
		width: 100%;
		height: calc(100% - 1rem);
	}
</style>