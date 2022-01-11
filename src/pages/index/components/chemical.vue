<template>
	<div class="chemical">
		<h4 class="mdTitle">宣教应急</h4>
		<div class="amountCom amountBox clearFix">
			<div class="fl amounts">应急方舱<span class="yellowC">{{emergencyRushing.total||0}}</span></div>
			<div class="fr amounts">配比<span class="yellowC">{{emergencyRushing.matching||0}}</span></div>
		</div>
		<div id="callingLine"></div>
	</div>
</template>

<script>
	/* eslint-disable */

	import axios from 'axios'
	export default {
		name: 'IndexTraffic',
		data() {
			return {
				interval: 10000, //轮播间隔秒数
				car: {
					enterCount: "--", //入校车辆
					stayCount: "--", //时实车辆
					BJdata1: [], //入校车辆
					BJdata2: [], //校内车辆
					color: ['#be5f5e', '#893236'],
					name: ['入校车辆', '校内车辆'],
					oxAxis: [],
					interval: 1,
					Yname: "",
					leg: false
				},
				aJsonA: {
					color: ['rgba(140,44,28,1)', 'rgba(254,140,128,1)', 'rgba(198,82,62,1)'],
					legend: ['总数', '误报', '真实求助']
				},
				chart: {
					type: 1,
					series: []
				},
				xAxisData: this.setxAxis(),
				emergencyRushing: {
					total: 10, //方舱总数
					matching: '0:0', //配比
				},
			}
		},
		methods: {
			getEmergencyCalling() { //紧急求助接口
				this.$axios.post('edu/home/EmergencyCalling', {
						unitUuid: UNITID
					})
					.then(this.getEmergencyCallingSucc)
			},
			getEmergencyCallingSucc(res) {
				this.aJsonA.data = [];
				this.aJsonA.data.push(this.eachJson(res.EmergencyCallingTwo));
				this.aJsonA.data.push(this.eachJson(res.EmergencyCallingOne));
				this.aJsonA.data.push(this.eachJson(res.EmergencyCallingThree));
				this.seriesInitA();
			},
			getEmergencyRushing() { //应急方舱,在校师生,配比接口
				this.$axios.post('edu/home/EmergencyRushing', {
						unitUuid: UNITID
					})
					.then(this.getEmergencyRushingSucc)
			},
			getEmergencyRushingSucc(res) {
				var data = res.emergencyRushing;
				var tsCount = data.tsCount;
				this.emergencyRushing = res.emergencyRushing;
				this.emergencyRushing.units = '万';
				tsCount > 10000 ? this.emergencyRushing.tsCount = (tsCount / 10000).toFixed(1) : this.emergencyRushing.units = '人';
				if(data.tsCount) {
					data.total ? this.emergencyRushing.matching = '1:' + (tsCount / data.total).toFixed(0) : this.emergencyRushing.matching = '0:0';
				}
			},
			eachJson(Json) {
				var arr = [];
				for(var i in Json) {
					Json[i] ? arr.push(Json[i]) : arr.push(0)
				}
				return arr
			},
			setxAxis() {
				var arr = [];
				var mydate = new Date();
				var oM = mydate.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
				for(var i = 0; i < 12; i++) {
					arr.unshift(oM + '月')
					oM -= 1;
					oM == 0 ? oM = 12 : '';
				}
				return arr;
			},
			seriesInitA() { //紧急求助series
				this.chart.series = [];
				var opcityRgba = "";
				this.aJsonA.legend.forEach((itme, index) => {
					if(index == 0) {
						opcityRgba = 'rgba(140,44,28,0)';
					} else if(index == 1) {
						opcityRgba = 'rgba(254,140,128,0)';
					} else if(index == 2) {
						opcityRgba = 'rgba(198,82,62,0)';
					};
					var obj = {
						name: itme,
						type: 'line',
						data: this.aJsonA.data[index],
						symbol: 'none',
						smooth: true,
						lineStyle: {
							width: 2
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: this.aJsonA.color[index]
								},
								{
									offset: 1,
									color: opcityRgba
								}
							], false),
						},
					};
					this.chart.series.push(obj)
				})
				this.LineDatacar('callingLine', this.aJsonA);
			},
			LineDatacar(Id, aJson) {
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(this.LineChartN(aJson), true);
					allCharts.push(myChart);
				})
			},
			LineChartN(aJson) {
				var vm = this;
				var option = {
					grid: {
						x: 10,
						x2: 10,
						y: 5,
						y2: 20,
						borderWidth: 0
					},
					calculable: true,
					tooltip: {
						trigger: 'axis',

					},
					color: aJson.color,
					xAxis: [{
						type: 'category',
						gridIndex: 0,
						axisLabel: {
							interval: 0,
							textStyle: textStyleC

						},
						axisLine: {
							lineStyle: {
								color: 'rgba(111,191,203,0.5)'
							}
						},
						axisTick: {
							alignWithLabel: true,
							inside: true,
						},
						data: vm.xAxisData,
					}],
					yAxis: [{
						nameGap: 10,
						type: 'value',
						max: function(value) {
							return value.max;
						},
						axisLabel: {
							show: false
						},
						splitLine: {
							show: false,
						},
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						}
					}],
					series: vm.chart.series
				};
				return option;
			},
		},
		mounted: function() {
			this.getEmergencyRushing();
			this.getEmergencyCalling();
		}
	}
</script>

<style lang="scss" scoped>
	.amountBox {
		margin-top: 0.5rem;
	}
	
	.amountCom .amounts {
		width: 49%;
		line-height: 1.5rem;
		padding: 0 0.5rem;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		font-size: 0.7rem;
		background: #0A3F5E;
		border: 1px solid #0A507A;
		color: #75CBF2;
	}
	
	.amountCom .amounts span {
		font-size: 0.9rem;
		font-family: "DIN Medium";
		font-weight: 500;
		color: #00FFFF;
		float: right;
	}
	
	.yellowC {
		color: #FFCC00 !important;
	}
	
	#callingLine {
		width: 100%;
		height: calc(100% - 4rem);
		margin-top:0.35rem;
	}

</style>