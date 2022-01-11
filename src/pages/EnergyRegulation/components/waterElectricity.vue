<template>
	<div class="waterElectricity">
		<p class="navBtn">
			<span :class="{'active':istable==1}" @click="showtable(1)">电</span >
			<span :class="{'active':istable==2}" @click="showtable(2)">水</span>
			<span style="color:#666">气</span>
			<span style="color:#666">暖</span>
		</p>
		<div class="h-time-c" v-show="istable==1">
			<a :class="{'active':index==1}" @click='setdata(1)'>生均电耗</a>
			<a :class="{'active':index==2}" @click='setdata(2)'>单位建筑面积电耗</a>
		</div>
		<div class="backboxContainer">
			<div class="tabs clearFix" :class="{'show':istable==1}">
				<div id="electricitybar" class="fl"></div>
				<div class="tabs-centos clearFix">
					<div class="tabs-centos-title">本年分项能耗分析</div>
					<div class="tabs-top">
						<div class="tabs-box">
							<div class="tabls-title">照明插座</div>
							<div class="tabls-reat vertical-middle-c">
								<span class="vertical-middle">同比 ↑ 10%</span>
							</div>
							<div class="tabls-buott">
								<div class="tabls-rom tabls-romleft colr vertical-middle-c"><span class="vertical-middle">1689</span></div>
								<div class="tabls-rom colr2 vertical-middle-c"><span class="vertical-middle">1533</span></div>
							</div>
						</div>
						<div class="tabs-box maleft">
							<div class="tabls-title">空调用电</div>
							<div class="tabls-reat vertical-middle-c">
								<span class="vertical-middle">同比 ↓ 18%</span>
							</div>
							<div class="tabls-buott">
								<div class="tabls-rom tabls-romleft colr vertical-middle-c"><span class="vertical-middle">1320</span></div>
								<div class="tabls-rom colr2 vertical-middle-c"><span class="vertical-middle">1568</span></div>
							</div>
						</div>
					</div>
					<div class="tabs-top">
						<div class="tabs-box">
							<div class="tabls-title">动力用电</div>
							<div class="tabls-reat vertical-middle-c">
								<span class="vertical-middle">同比 ↓ 10%</span>
							</div>
							<div class="tabls-buott">
								<div class="tabls-rom tabls-romleft colr vertical-middle-c"><span class="vertical-middle">960</span></div>
								<div class="tabls-rom colr2 vertical-middle-c"><span class="vertical-middle">1063</span></div>
							</div>
						</div>
						<div class="tabs-box maleft">
							<div class="tabls-title">特殊用电</div>
							<div class="tabls-reat vertical-middle-c">
								<span class="vertical-middle">同比 ↓ 12%</span>
							</div>
							<div class="tabls-buott">
								<div class="tabls-rom tabls-romleft colr vertical-middle-c"><span class="vertical-middle">206</span></div>
								<div class="tabls-rom colr2 vertical-middle-c"><span class="vertical-middle">183</span></div>
							</div>
						</div>
					</div>
				</div>
				<div class="tabs-right">
					<div class="tables-pie flex flex-column">
						<div class="tables-title">2019年01月</div>
						<div id="energypie" class="flex-basis"></div>
						<div class="tables-bottom">
							<div class="tables-box"><span>照明用电</span><i>{{monthzhaoreat}}</i><small>%</small></div>
							<div class="tables-box"><span>动力用电</span><i>{{monthdongreat}}</i><small>%</small></div>
							<div class="tables-box"><span>空调用电</span><i>{{monthdianreat}}</i><small>%</small></div>
							<div class="tables-box"><span>特殊用电</span><i>{{monthtesureat}}</i><small>%</small></div>
						</div>
					</div>
					<div class="tables-pie flex flex-column">
						<div class="tables-title">2019年02月</div>
						<div id="energyation" class="flex-basis"></div>
						<div class="tables-bottom">
							<div class="tables-box"><span>照明用电</span><i>{{monthzhaoreat}}</i><small>%</small></div>
							<div class="tables-box"><span>动力用电</span><i>{{monthdongreat}}</i><small>%</small></div>
							<div class="tables-box"><span>空调用电</span><i>{{monthdianreat}}</i><small>%</small></div>
							<div class="tables-box"><span>特殊用电</span><i>{{monthtesureat}}</i><small>%</small></div>
						</div>
					</div>
				</div>
			</div>
			<div class="tabs clearFix"  :class="{'show':istable==2}">
				<div id="Average" class="fl"></div>
				<div id="Average2" class="fl"></div>
			</div>
		</div>
	</div>
</template>

<script>
	var mTime = null;
	var mTimeone = null;
	var mTimetwo = null;
	export default {
		name: 'waterElectricity',
		data() {
			return {
				index: 1,
				istable: 1,
				superviseJson: {
					data1: [30.36, 31.74, 30.58, 34.77, 28.55, 27.78, 29.36, 35.74, 34.58, 33.77, 32.55, 33.78],
					data2: [29.36, 32.58, 29.58, 31.77, 33.55, 33.78, 34.36, 33.55, 32.58, 31.77, 30.55, 31.78],
					color: ['#32C872', '#0478B7'],
					name: ['本年', '上年'],
					title: "人均耗电 kWh/人",
					oxAxis: ['3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '01月', '02月'],
					leg: true,
					barWidth: 8,
					oMax: function(value) {
						return value.max + 3;
					},
				},
				waterJson: {
					data1: [46, 56, 52, 49, 25, 23, 61, 55, 59, 47, 22, 18],
					data2: [47, 59, 58, 47, 28, 20, 65, 59, 55, 44, 25, 19],
					color: ['#32C872', '#FFCC00'],
					name: ['本期', '同期'],
					title: "人均水耗(吨/人)",
					oxAxis: ['3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '01月', '02月'],
					leg: false,
					barWidth: 14,
					oMax: function(value) {
						return value.max + 3;
					},
				},
				unitwater: {
					data1: [6, 12, 17, 21, 13, 8, 25, 20, 13, 18, 8, 10],
					data2: [10, 14, 15, 20, 15, 7, 26, 24, 16, 15, 7, 13],
					color: ['#32C872', '#FFCC00'],
					name: ['本期', '同期'],
					title: "单位建筑面积水耗(吨/m²)",
					oxAxis: ['3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '01月', '02月'],
					leg: false,
					barWidth: 14,
					oMax: function(value) {
						return value.max + 3;
					},
				},
				pieJson: {
					lege: "false",
					emphasis: false,
					title: false,
					textStyle: false,
					emphasis: false,
					color: ["#D04A4A", "#52A6A2", "#2189AF", "#ED7703"],
					radius: ["0%", "100%"],
					center: ["50%", "50%"],
				},
				monthdianreat: '',
				monthzhaoreat: '',
				monthdongreat: '',
				monthtesureat: '',
			}
		},
		mounted: function() {
			this.superviseData('electricitybar', this.superviseJson);

			this.Averagewater('Average', this.waterJson);
			this.Averagewatertwo('Average2', this.unitwater);

			this.setdata(1);
		},
		methods: {
			showtable(type) { //切换菜单
				this.istable = type;
			},
			Averagewatertwo(Id, waterJson) {
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(barline(waterJson), true);
					allCharts.push(myChart);
					var indextwo = 0; //播放所在下标  
					clearInterval(mTimetwo);
					mTimetwo = setInterval(function() {
						myChart.dispatchAction({
							type: 'showTip',
							seriesIndex: 0,
							dataIndex: indextwo
						});
						indextwo++;
						if(indextwo > waterJson.data1.length) {
							indextwo = 0;
						}
					}, 3000);
				})

			},
			Averagewater(Id, waterJson) {
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(barline(waterJson), true);
					allCharts.push(myChart);
					var indexone = 0; //播放所在下标  
					clearInterval(mTimeone);
					mTimeone = setInterval(function() {
						myChart.dispatchAction({
							type: 'showTip',
							seriesIndex: 0,
							dataIndex: indexone
						});
						indexone++;
						if(indexone > waterJson.data1.length) {
							indexone = 0;
						}
					}, 3000);
				})

			},
			setdata(index) { //数据添加
				this.index = index;
				var monthdian = 74; //月空调
				var monthzhao = 85; //月照明
				var monthdong = 54; //月动力
				var monthtesu = 11; //特殊动力
				if(index == 2) {
					monthdian = 36;
					monthzhao = 30;
					monthdong = 18;
					monthtesu = 5;
				}
				var monthcount = monthdian + monthzhao + monthdong + monthtesu; //月总数
				this.monthdianreat = (monthdian / monthcount).toFixed(2) * 100; //空调用电1月
				this.monthzhaoreat = (monthzhao / monthcount).toFixed(2) * 100; //照明用电1月
				this.monthdongreat = (monthdong / monthcount).toFixed(2) * 100; //动力用电1月
				this.monthtesureat = (monthtesu / monthcount).toFixed(2) * 100; //特殊用电1月
				var energydata = [{
					name: "照明插座",
					value: monthdian,
				}, {
					name: "动力用电",
					value: monthzhao,
				}, {
					name: "空调用电",
					value: monthdong,
				}, {
					name: "特殊用电",
					value: monthtesu,
				}];
				var energydata2 = [{
					name: "照明插座",
					value: 70,
				}, {
					name: "动力用电",
					value: 65,
				}, {
					name: "空调用电",
					value: 85,
				}, {
					name: "特殊用电",
					value: 19,
				}];
				this.$nextTick(function(){
					this.setenergypie('energypie', energydata, this.pieJson);
					this.setenergypie('energyation', energydata2, this.pieJson);
				})
			},
			setenergypie(id, jsondata, stylejson) { //饼图1
				stylejson.lege = "false";
				stylejson.emphasis = "false";
				var myChart = echarts.init(document.getElementById(id));
				myChart.setOption(Pie(jsondata, stylejson), true);
				allCharts.push(myChart);
			},
			superviseData(Id, superviseJson) { //能源监管 柱状图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(bar4(superviseJson), true);
					allCharts.push(myChart);
					var index = 0; //播放所在下标  
					clearInterval(mTime);
					mTime = setInterval(function() {
						myChart.dispatchAction({
							type: 'showTip',
							seriesIndex: 0,
							dataIndex: index
						});
						index++;
						if(index > superviseJson.data1.length) {
							index = 0;
						}
					}, 3000);
				})

			},
		},
	}
</script>

<style lang="scss" scoped>
	* {
		color: #75CBF2
	}
	
	.tabs-centos-title {
		font-size: 0.8rem;
		text-align:center;
		margin-top: -2rem;
		margin-bottom: 1rem;
	}
	
	.colr2 span{
		color: #32C872;
	}
	
	.colr span {
		color: #0478B7;
	}
	#Average,#Average2 {
		height: 100%;
		width: 48%;
	}
	#Average2{
		float: right;
	}
	.tables-box small {
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
	}
	
	.tables-box i {
		font-size: 0.8rem;
		margin-left: 0.2rem;
		color: rgba(0, 255, 255, 1);
	}
	
	.tables-box span {
		font-size: 0.7rem;
	}
	
	.tables-box {
		text-align: center;
		float: left;
		width: 48%;
		line-height: 1.5rem;
		margin: 0.5rem 1% 0px 0px;
		border: 1px solid rgba(25, 94, 127, 1);
		box-sizing: border-box;
	}
	
	.tables-bottom {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
	.tables-title {
		text-align: center;
	}
	.tabs-right{
		float: right;
		width: 39%;
		height: 100%;
	}
	.tables-pie {
		height: 100%;
		width: 50%;
		float: left;
	}
	
	.tabs-top {
		height: 45%;
		&:nth-last-of-type(1){
			margin-top: 5%;
		}
	}
	
	.tabls-romleft {
		border-right: 1px solid rgba(25, 94, 127, 1);
	}
	
	.tabls-rom {
		float: left;
		width: 50%;
		height: 100%;
		text-align: center;
		background: rgba(7, 52, 82, 1);
		box-sizing: border-box;
		span{
			font-size: 1rem;
		}
	}
	
	
	.tabls-reat span {
		color: #00FFFF;
		font-size: 0.8rem;
	}
	
	.tabls-reat {
		text-align: center;
		border-bottom: 1px solid rgba(25, 94, 127, 1);
		width: 100%;
		height: 59%;
		box-sizing: border-box;
	}
	.tabls-buott {
		width: 100%;
		height: 41%;
	}
	.tabls-title {
		position: absolute;
		left: 50%;
		margin-left: -2rem;
		margin-top: -0.6em;
		background: #001525;
		width: 4rem;
		font-size: 0.8rem;
		font-weight: 400;
		text-align: center;
		color: rgba(117, 203, 242, 1);
		z-index: 1;
	}
	
	.tabs-box {
		position: relative;
		float: left;
		height: 100%;
		width: 46%;
		margin-left: 5%;
		border: 1px solid rgba(25, 94, 127, 1);
		box-sizing: border-box;
	}
	.maleft{
		margin-left: 2%;
	}
	.tabs-centos {
		width: 25%;
		float: left;
		height: 100%;
	}
	
	.waterElectricity .navBtn span {
		display: inline-block;
		font-size: 0.9rem;
		color: #31859C;
		width: 3.9rem;
		margin-right: 0.5rem;
		text-align: center;
		line-height: 1.5rem;
		cursor: pointer;
	}
	.backboxContainer{
		position: relative;
	}
	.tabs{
		height:100%;
		width: 100%;
		position: absolute;
		left: 0px;
		top: 0px;
		opacity: 0;
		&.show{
			opacity: 1;
			z-index: 3;
		}
	}
	.waterElectricity .navBtn .active {
		color: #75CBF2;
		border-bottom: 2px solid #75CBF2;
	}
	
	#electricitybar {
		width: 35%;
		height: 100%;
		position:relative;
		z-index:3;
	}
</style>