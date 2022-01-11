<template>
	<div class="leftList">
		<back-box class="listModule">
			<h5 class="mdTitle">预警监测</h5>
			<el-row  class="backboxContainer flex flex-column">
				<el-row :gutter="0" class="top flex1">
					<el-col :span="8">
						<div class="calling  curpointer vertical-middle-c" :class="{grade1:earlyWarning.emergencyCalling}" @click="getWarning(1)">
							<div class="vertical-middle">
								<h1>紧急求助</h1>
								<h2 class="style4" :class="{'is-animate2':earlyWarning.emergencyCalling}">
									<em v-for="(time,index) in earlyWarning.emergencyCalling" v-if="earlyWarning.emergencyCalling">{{time}}</em>
									<em v-show="!earlyWarning.emergencyCalling">0</em>
									
								</h2>
							</div>
						</div>
					</el-col>
					<el-col :span="16" class="vertical-middle-c">
						<ul class="figureOutRate vertical-middle">
							<li class="clearFix">
								<i>处理率</i>
								<p><em :style="'width:' + earlyWarning.figureOutRate"></em></p>
								<span>{{earlyWarning.figureOutRate||0}}</span>
							</li>
							<li class="clearFix">
								<i>误报率</i>
								<p><em :style="'width:' + earlyWarning.mistakeCountRate"></em></p>
								<span>{{earlyWarning.mistakeCountRate||0}}</span>
							</li>
						</ul>
					</el-col>
				</el-row>
				<el-row class="flex">
					<div class="callingList  clearFix hoverAnimate flushDom curpointer" @click="getWarning(5)">
						<div class="vertical-middle-c">
							<div class="vertical-middle">
								<i class="fl">风险预警</i><i class="DIN-Medium fr">{{earlyWarning.riskCount||0}}</i>
							</div>
						</div>
					</div>
					<!-- <div class="callingList clearFix  hoverAnimate flushDom curpointer" @click="getWarning(2)">
						<div class="vertical-middle-c">
							<div class="vertical-middle">
								<i class="fl">设备异常</i><i class="DIN-Medium fr">{{earlyWarning.unitException||0}}</i>
							</div>
						</div>
					</div> -->
					<div class="callingList  clearFix  hoverAnimate flushDom curpointer" @click="getWarning(3)">
						<div class="vertical-middle-c">
							<div class="vertical-middle">
								<i class="fl">装备不足</i><i class="DIN-Medium fr">{{earlyWarning.equipmentShortages||0}}</i>
							</div>
						</div>
					</div>
				</el-row>
			</el-row>
			<warning ref="warning" @refresh="getEarlyWarning"></warning>
		</back-box>
		<back-box class="numberBox">
			<div class="peopleNumber clearFix">
				<p class="fl">安全学习累计人次</p>
				<div class="fr" id="dataNums"></div>
			
			</div>
			<div class="peopleNumber clearFix">
				<p class="fl">安全考试累计人次</p>
				<div class="fr" id="dataNums1"></div>
			</div>
		</back-box>
		<back-box class="shelter">
			<el-row :gutter="6">
				<el-col :span="8">
					<div class="shelterM hoverAnimate vertical-middle-c">
						<div class="pos-top">
							<span class="probability clearFix"><i class="fl">正常{{emergencyRushing.usual||0}}</i><i class="fr">异常{{emergencyRushing.unusual||0}}</i></span>
						</div>
						<div class="vertical-middle">
							<div class="emergency">
								<p class="DIN-Medium linear">{{emergencyRushing.total||0}}<i class="units">个</i></p>
							</div>
							<p class="matching">应急方舱</p>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="shelterM hoverAnimate vertical-middle-c">
						<div class="vertical-middle">
							<div class="emergency ">
								<p class="DIN-Medium figure linear">{{emergencyRushing.tsCount||0}}<i class="units">{{emergencyRushing.units||'人'}}</i></p>
							</div>
							<p class="matching">在校师生</p>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="shelterM hoverAnimate vertical-middle-c">
						<div class="vertical-middle">
							<div class="emergency">
								<p class="DIN-Medium figure linear">{{emergencyRushing.matching||0}}</p>
							</div>
							<p class="matching">方舱配比</p>
						</div>
					</div>
				</el-col>

			</el-row>
		</back-box>
		<back-box class="lineChart">
			<div class="tabs">
				<p :class="{active:chart.type==1}" @click="clickChartTabs(1)">紧急求助</p>
				<!-- <p :class="{active:chart.type==2}" @click="clickChartTabs(2)">急救包</p> -->
				<p :class="{active:chart.type==3}" @click="clickChartTabs(3)">装备使用</p>
			</div>
			<div class="chart backboxContainer">
				<!-- <transition enter-active-class="animated bounceInUp"> -->
				<div :class="[chart.type==1?'animated bounceInUp':'transparent']" id="callingLine"></div>
				<!-- </transition> -->
				<!-- <transition enter-active-class="animated bounceInUp"> -->
				<div :class="[chart.type==2?'animated bounceInUp':'transparent']" id="packetBar"></div>
				<!-- </transition> -->
				<!-- <transition enter-active-class="animated bounceInUp"> -->
				<div :class="[chart.type==3?'animated bounceInUp':'transparent']" id="useLine"></div>
				<!-- </transition> -->
			</div>
		</back-box>
	</div>
</template>

<script>
	// 引入基本模板
	//let echarts = require('echarts/lib/echarts')
	// 引入柱状图组件
	//require('echarts/lib/chart/line')
	// 引入提示框和title组件
	////require('echarts/lib/component/tooltip')
	//require('echarts/lib/component/legend')
	//import echarts from 'echarts'
	import warning from '../emergency/shelter/warning'; //预警监测弹窗
	export default {
		components: {
			warning,
		},
		//props:['maxmap','mapCenter'],
		data() {
			return {
				goingEvent: false,
				aJsonA: {
					color: ['rgba(140,44,28,1)', 'rgba(254,140,128,1)', 'rgba(198,82,62,1)'],
					legend: ['总数', '误报', '真实求助']
				},
				aJsonB: {
					color: ['#FF8672'],
					legend: ['付费购买']
				},
				aJsonC: {
					color: ['#FF5235'],
					legend: ['装备使用'],
					data: []
				},
				//fullScreenShow:true,
				xAxisData: this.setxAxis(),
				accumulationCount: 0, //现场教学累计人数
				earlyWarning: { //预警监测
					emergencyCalling: 0, //紧急求助
					equipmentShortages: 0, //装备不足
					figureOutRate: 0, //解决率
					mistakeCountRate: 0, //误报率
					riskCount: 0, //天气预警
					totalAlarm: 0, //总数
					unitException: 0, //设备异常
				},
				emergencyRushing: { //应急方舱,在校师生,配比接口
					total: 0, //方舱总数
					tsCount: 0, //师生总数
					unusual: 0, //异常数
					usual: 0, //正常数
					matching: '0:0', //配比
					units: '人' //师生总数单位
				},
				chart: {
					type: 1,
					series: []
				},

			}
		},
		mounted: function() {
			var _this = this;
			this.getpeopleNumber();
			this.getEarlyWarning();
			this.getEmergencyRushing();
			this.getEmergencyCalling();

		},
		methods: {
			LineDatacar(Id, aJson) {
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(this.LineChartN(aJson), true);
				allCharts.push(myChart);
			},
			getEarlyWarning() { //预警监测接口
				this.$axios.post('edu/home/earlyWarningMonitoring', {
						unitUuid: UNITID
					})
					.then(this.getEarlyWarningSucc)
			},
			getWarning(type) { //预警监测弹窗
				this.$refs.warning.show(type, "shelterPage");
			},
			getEarlyWarningSucc(res) {
				var data = res.earlyWarningMonitoring
				this.earlyWarning = data;
				this.earlyWarning.emergencyCalling ? this.earlyWarning.emergencyCalling = data.emergencyCalling + '' : '';
				data.totalAlarm ? this.earlyWarning.figureOutRate = parseInt(data.figureOut / data.totalAlarm * 100) + '%' : this.earlyWarning.figureOutRate = '0%';
				data.figureOut ? this.earlyWarning.mistakeCountRate = parseInt(data.mistakeCount / data.figureOut * 100) + '%' : this.earlyWarning.mistakeCountRate = '0%'
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
			eachJson(Json) {
				var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				for(var key in Json) {
					var keystr = key.split('-')[1];
					for(var j = 0; j < this.xAxisData.length; j++) {
						if(keystr + '月' == this.xAxisData[j] && Json[key]) {
							arr[j] = Json[key]
						}
					}
					//Json[key]?arr.push(key+':'+Json[key]):arr.push(0)
				}
				return arr
			},
			getFirstaidPacket() { //急救包接口
				this.$axios.post('edu/home/FirstaidPacket', {
						unitUuid: UNITID
					})
					.then(this.getFirstaidPacketSucc)
			},
			getFirstaidPacketSucc(res) {
				this.aJsonB.data = [];
				//this.aJsonB.data.push(this.eachJson(res.FirstaidPacketOne));
				this.aJsonB.data.push(this.eachJson(res.FirstaidPacketTwo));
				this.seriesInitB();
			},
			getEquipmentUse() { //装备使用接口
				this.$axios.post('edu/home/EquipmentUse', {
						unitUuid: UNITID
					})
					.then(this.getEquipmentUseSucc)
			},
			getEquipmentUseSucc(res) {
				this.aJsonC.data = this.eachJson(res.EquipmentUse);
				this.seriesInitC();
			},
			getpeopleNumber() { //现场教学累计接口			
				this.yuj({});
				this.$axios.post(process.env.API_EMER+'edu/home/examAndReadTotal', {unitUuid: UNITID}).then(this.getpeopleNumberSucc)
			},
			getpeopleNumberSucc(res) {
				this.accumulationCount = res;
				this.yuj(this.accumulationCount);
			},
			clickChartTabs(type) { //统计图Tabs
				this.chart.type = type;
				var vm = this;
				if(type == 1) {
					this.getEmergencyCalling()
				} else if(type == 2) {
					this.getFirstaidPacket()
				} else {
					this.getEquipmentUse();

				}

			},

			setxAxis() {
				var arr = [];
				var mydate = new Date();
				var oM = mydate.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
				for(var i = 0; i < 12; i++) {
					oM = oM < 10 ? '0' + oM : oM
					arr.unshift(oM + '月')
					oM -= 1;
					oM == 0 ? oM = 12 : '';
				}
				return arr;
			},
			yuj(sumy) {
				$("#dataNums").rollNumDaq({
					deVal: sumy.readTotal||0,
					digit: '9'
				});
				$("#dataNums1").rollNumDaq({
					deVal: sumy.examTotal||0,
					digit: '9'
				});
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
							//color: this.aJsonA.color[index]
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
			seriesInitB() { //急救包series
				this.chart.series = [];
				this.aJsonB.legend.forEach((itme, index) => {
					var obj = {
						name: itme,
						type: 'bar',
						color: this.aJsonB.color[index],
						data: this.aJsonB.data[index]
					};
					this.chart.series.push(obj)
				})
				this.LineDatacar('packetBar', this.aJsonB)
			},
			seriesInitC() { //装备使用series
				this.chart.series = [];
				var obj = {
					name: this.aJsonC.legend,
					type: 'line',
					data: this.aJsonC.data,
					symbol: 'none',
					smooth: true,
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: 'rgba(255,82,53,1)'
								},
								{
									offset: 1,
									color: 'rgba(255,82,53,0.2)'
								}
							], false),
						}
					},
				};
				this.chart.series.push(obj)
				this.LineDatacar('useLine', this.aJsonC)
			},
			LineChartN(aJson) {
				var vm = this;
				var option = {
					animationEasing: 'SinusoidalIn',
					animationDuration: 10000,
					grid: {
						x: 10,
						x2: 10,
						y: 30,
						y2: 30,
						borderWidth: 0
					},
					calculable: true,
					tooltip: {
						trigger: 'axis',
						textStyle: tooltipTextStyle
					},
					color: aJson.color,
					legend: { //图例组件
						show: true,
						icon: 'rect',
						left: 10, //图例组件离右边的距离
						top: 0,
						itemWidth: 0.3 * fontSize, //图例标记的图形宽度
						itemHeight: 0.8 * fontSize, //图例标记的图形高度
						itemGap: 0.5 * fontSize,
						data: aJson.legend,
						textStyle: { //图例文字的样式
							color: '#ccc',
							fontSize: 0.8 * fontSize
						}
					},
					xAxis: [{
						type: 'category',
						gridIndex: 0,
						axisLabel: {
							interval: 0,
							textStyle: {
								color: "#31859C",
								fontSize: 0.8 * fontSize,
							}

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
		}

	}
</script>

<style lang="scss" scoped>
	.leftList {
		display: flex;
		flex-direction: column;
		width: 24.4rem;
		text-align: center;
		position: absolute;
		top: 4.15rem;
		right: 1rem;
		bottom: 0px;
		margin-bottom: 1.51%;
		z-index: 8;
		* {
			color: #75CBF2
		}		
		.top{			
			background: rgba(10, 63, 94, 1);
			.el-col{
				height: 100%;
			}
			.calling {
				height: 100%;
				box-sizing: border-box;
				overflow: hidden;
				position: relative;	
				cursor: pointer;
				.vertical-middle{
					border-right: 1px solid rgba(10, 80, 122, 1);
					box-sizing: border-box;
					margin-top: 0.3rem;
				}
				h2 {
					font-size: 2.2rem;
					font-family: "DIN Medium";
					font-weight: bold;
					height: 3.5rem;
					line-height: 4.7rem;
					overflow: visible;
					em {
						font-size: 2.2rem;
						font-family: "DIN Medium";
						font-weight: bold;
					}
				}
				&.grade1{
					color: #FF4C2D;
					h1{
						margin-top: 0.3rem;
					}
					em {
						color: #ff4c2d;
					}
				}
			}
		}
		.callingList {
			flex:1;
			line-height: 3.4rem;
			padding: 0px 0.7rem 0px 1rem;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			background: rgba(10, 63, 94, 1);
			border: 1px solid rgba(10, 80, 122, 1);
			cursor: pointer;
			margin-top: 6px;
			&:nth-last-of-type(1) {
				margin-left: 6px;
			}
			.vertical-middle-c {
				height: 100%;
			}
			.DIN-Medium {
				font-size: 1.5rem;
			}
		}
	}
	.listModule {
		position: relative;
		margin-bottom: 0.5rem;
		padding: 0.25rem 0.5rem;
		box-sizing: border-box;
		height: 14rem;
		.mdTitle {
			text-align: left;
		}
		.el-col-12 {
			height: 100%;
			&.flex {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
			}
		}
	}

	.DIN-Medium {
		font-family: "DIN Medium";
	}	
	.figureOutRate {
		text-align: left;
		i,p,span{
			display: inline-block;
			vertical-align: middle;
		}
		span{
			width: 2rem;
		}
	}
	
	.figureOutRate li {
		width: 90%;
		white-space: nowrap;
		margin: auto;
		margin-bottom: 0.8rem;
		display: flex;
		align-items: center;
		&:nth-last-of-type(1) {
			margin-bottom: 0px;
		}
	}
	
	.figureOutRate li i,
	.figureOutRate li span {
		font-size: 0.7rem;
	}
	
	.figureOutRate li p {
		// width: 8.75rem;
		flex: 1;
		height: 0.5rem;
		border: 1px solid rgba(4, 120, 183, 1);
		border-radius: 0.25rem;
		position: relative;
		margin: 0 0.3rem 0px 0.3rem;
	}
	
	.figureOutRate li p em {
		height: 0.5rem;
		background: #0478B7;
		border-radius: 0.25rem;
		position: absolute;
		top: 0px;
		left: 0px;
	}
	/*.grade1 .figureOutRate li p{
		background:rgba(255,76,45,0.4);
		border:1px solid rgba(255,76,45,0.5);
	}
	.grade1 .figureOutRate li p em{
		background:rgba(198,82,62,1);
	}
	.grade1 .figureOutRate li span{
		color:#FF4C2D
	}*/
	
	.emergency p {
		font-size: 1.1rem;
		position: relative;
		height: 1.9rem;
	}
	
	.emergency p em {
		font-size: 36px;
		font-weight: bold;
	}
	
	.emergency .linear:after {
		content: '';
		display: block;
		height: 2px;
		width: 100%;
		background: linear-gradient(to right,rgba(255,255,255,0),rgba(0,255,255,1), rgba(255,255,255,0));
		margin-top: 0.2rem;
	}
	
	.emergency.grade1 * {
		color: #FF4C2D
	}
	
	.emergency.grade1 .linear:after {
		background: linear-gradient(to right, rgba(255, 76, 45, 0), #FF4C2D, rgba(255, 76, 45, 0));
	}
	
	.emergency span {
		margin-top: 0.85rem;
		display: block;
	}
	
	.numberBox{
		margin-bottom: 0.5rem;
		height: 7.3rem;
		padding: 0.5rem;
		box-sizing: border-box;
	}
	
	.peopleNumber {
		white-space: nowrap;
		margin-bottom: 0.5rem;
	}
	
	.peopleNumber p {
		width: 8.65rem;
		height: 2.8rem;
		font-size: 0.8rem;
		line-height: 2.8rem;
		box-sizing: border-box;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
	}
	
	.shelter {
		margin-bottom: 0.5rem;
		height: 8.5rem;
		padding: 0.5rem;
		box-sizing: border-box;
		.el-row,
		.el-col-8 {
			height: 100%;
		}
	}
	
	.shelter .shelterM {
		background: #0a3f5e;
		height: 100%;
		position: relative;
	}
	
	.shelter .pos-top {
		position: absolute;
		top: 0.25rem;
		left: 0.8rem;
		right: 0.8rem;
		*{
			font-size: 0.8rem;
		}
	}
	
	.shelter .units {
		line-height: 1rem;
		display: inline-block;
		margin-left: 0.2rem;
	}
	
	.shelter .emergency {
		padding: 0 0.75rem;
		box-sizing: border-box;
		margin-top: 0.5rem;
	}
	
	.shelter .emergency .linear {
		color: #0ff;
	}
	
	.shelter .figure {
		font-size: 1.1rem;
	}
	
	.lineChart {
		flex: 1;
		max-height: 18.5rem;
		padding: 0.25rem 0.5rem;
		box-sizing: border-box;
		overflow: hidden;
		text-align: left;
	}
	
	.lineChart .tabs p {
		display: inline-block;
		height: 1.5rem;
		padding: 0px 0.2rem;
		line-height: 1.5rem;
		font-size: 0.9rem;
		cursor: pointer;
		box-sizing: border-box;
		color: #31859C;
	}
	
	.lineChart .tabs .active {
		color: #75CBF2;
		border-bottom: 2px solid #75CBF2;
	}
	
	.lineChart .chart {
		position: relative;
		padding: 0 0.5rem;
		box-sizing: border-box;
	}
	
	#callingLine,
	#packetBar,
	#useLine {
		height: 100%;
		opacity: 1;
		z-index: 3;
		position: absolute !important;
		left: 0px;
		top: 0px;
		width: 100%;
		&.transparent {
			opacity: 0;
			z-index: 2;
		}
	}
	
	.hoverAnimate {
		border: 1px solid transparent;
		box-sizing: border-box !important;
		&:hover {
			border: 1px solid rgba(0, 255, 255, 1);
			box-shadow: 0px 0px 6px 0px rgba(0, 255, 255, 0.72);
		}
	}
</style>

<style>
	/*现场教学累计*/
	
	.peopleNumber #dataNums,
	.peopleNumber #dataNums1 {
		overflow: hidden;
		height: 2.8rem !important;
		white-space: normal;
	}
	
	.peopleNumber .dataNums {
		display: block;
		width: 100%;
		height: 2.8rem !important;
		text-align: center;
		overflow: hidden;
	}
	
	.peopleNumber .dataNums .dataOne {
		width: 1.4rem !important;
		height: 2.8rem !important;
		opacity: 1 !important;
		margin-left: 0.1rem;
		margin-right: 0px !important;
		text-align: center !important;
		background: linear-gradient(0deg, rgba(10, 63, 94, 0.8), rgba(10, 63, 94, 1), rgba(10, 63, 94, 0.8)) !important;
	}
	
	.peopleNumber .dataNums .dataBoc {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.peopleNumber .dataNums .dataBoc .tt {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.peopleNumber .inrow {
		font-size: 0;
		*font-size: 0;
		font-family: arial;
		*letter-spacing: normal;
		*word-spacing: -1px;
	}
	
	.peopleNumber .inrow>li,
	.peopleNumber .inrow span {
		display: inline-block;
		*display: inline;
		*zoom: 1;
		font-size: 0.7rem;
		letter-spacing: normal;
		word-spacing: normal;
	}
	
	.peopleNumber .comma em {
		width: 0.5rem;
		font-size: 1.5rem;
		font-weight: 500;
		position: relative;
		top: -0.4rem;
		display: inline-block;
		color: #ffcc00
	}
	
	.peopleNumber .dataNums .tt span {
		width: 100%;
		height: 100%;
		font-size: 1.4rem !important;
		font-weight: 500 !important;
		font-family: "DIN Medium" !important;
		line-height: 3.2rem !important;
		color: #ffcc00 !important;
	}
	
	.is-animate2.style4>em {
		animation: style4 4s infinite;
		display: inline-block;
	}
	
	.is-animate2>em:nth-child(1) {
		animation-delay: 0.0s
	}
	
	.is-animate2>em:nth-child(2) {
		animation-delay: 0.1s
	}
	
	.is-animate2>em:nth-child(3) {
		animation-delay: 0.2s
	}
	
	.is-animate2>em:nth-child(4) {
		animation-delay: 0.3s
	}
	
	.is-animate2>em:nth-child(5) {
		animation-delay: 0.4s
	}
	
	.is-animate2>em:nth-child(6) {
		animation-delay: 0.5s
	}
	
	@keyframes style4 {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	
	.flushDom:after {
		width: 100%;
		height: 100%;
		content: "";
		position: absolute;
		top: 0px;
		left: -40px;
		background: url(../../../static/images/sm.png) no-repeat left;
		background-size: 40px 100%;
		animation: flush 10s linear infinite;
		opacity: 0.3;
	}
	
	@keyframes flush {
		0% {
			transform: translate(0, 0);
			-ms-transform: translate(0, 0);
		}
		80% {
			transform: translate(130%, 0);
			-ms-transform: translate(130%, 0);
		}
		100% {
			transform: translate(130%, 0);
			-ms-transform: translate(130%, 0);
		}
	}
	
	.border-anim1::before,
	.border-anim1::after {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0px;
		left: 0px;
		background: url(../../../static/images/borderAni/meteor4.png) no-repeat center;
		background-size: 6px 100px;
		transform-origin: center bottom;
		transform: translate(-49.5%, -98%) rotate(-0deg);
		opacity: 0;
	}
	/*隔多少秒执行*/
	
	.border-anim1::before {
		animation: anim-border-runL 6s infinite;
		animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)
	}
	
	.border-anim1::after {
		animation: anim-border-runR 6s infinite;
		animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)
	}
	
	@keyframes anim-border-runL {
		0%,
		0.2% {
			opacity: 1;
			transform: translate(-49.5%, -98%) rotate(-0deg);
		}
		39.9% {
			opacity: 1;
			transform: translate(-49.5%, 92%) rotate(-0deg);
		}
		40% {
			opacity: 1;
			transform: translate(-51%, -1%) rotate(-90deg);
		}
		79.9% {
			transform: translate(100%, -1%) rotate(-90deg);
			opacity: 1;
		}
		80% {
			transform: translate(-49.5%, -98%) rotate(-0deg);
			opacity: 0;
		}
		100% {
			transform: translate(-49.5%, -98%) rotate(-0deg);
			opacity: 0;
		}
	}
	
	@keyframes anim-border-runR {
		0%,
		0.2% {
			opacity: 1;
			transform: translate(49.5%, -3%) rotate(-180deg);
		}
		39.9% {
			opacity: 1;
			transform: translate(49.5%, -188%) rotate(-180deg);
		}
		40% {
			opacity: 1;
			transform: translate(48%, -99%) rotate(-270deg);
		}
		79.9% {
			transform: translate(-96%, -99%) rotate(-270deg);
			opacity: 1;
		}
		80% {
			transform: translate(-49.5%, -98%) rotate(-0deg);
			opacity: 0;
		}
		100% {
			transform: translate(49.5%, -3%) rotate(-180deg);
			opacity: 0;
		}
	}
</style>