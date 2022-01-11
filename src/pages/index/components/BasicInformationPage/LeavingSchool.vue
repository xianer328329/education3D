<template>
	<div class="LeavingSchool">
		<div class="LeavingSchool_top">
			<div class="ReportTo">
				<div id="LeavingSchool_topB"></div>
				<div class="GraduationRateUL">
					<ul style="margin-left: 0px;">
						<li>6974</li>
						<li class="fontONELine">|</li>
						<li>7059</li>
					</ul>
				</div>
			</div>
			<div class="ReportTo">
				<div id="LeavingSchool_topJ"></div>
				<div class="GraduationRateUL">
					<ul>
						<li>5890</li>
						<li class="fontONELine">|</li>
						<li>6700</li>
					</ul>
				</div>
			</div>
		</div>
		<div id="LeavingSchool_Center"></div>
		<div id="LeavingSchool_Bottom"></div>
	</div>
</template>

<script>
	export default {
		name: 'newborn',
		components: {},
		data() {
			return {}
		},
		mounted() {
			this.starchar();
		},
		methods: {
			starchar() {
				var LeavingSchool_topBs = echarts.init(document.getElementById("LeavingSchool_topB"));
				LeavingSchool_topBs.setOption(this.LeavingSchool_topBEcharts());
				var LeavingSchool_topJs = echarts.init(document.getElementById("LeavingSchool_topJ"));
				LeavingSchool_topJs.setOption(this.LeavingSchool_topJEcharts());
				var LeavingSchool_Centers = echarts.init(document.getElementById("LeavingSchool_Center"));
				LeavingSchool_Centers.setOption(this.LeavingSchool_CenterEcharts());
				var LeavingSchool_Bottoms = echarts.init(document.getElementById("LeavingSchool_Bottom"));
				LeavingSchool_Bottoms.setOption(this.LeavingSchool_BottomEcharts());
				//LeavingSchool_Bottom
			},
			LeavingSchool_BottomEcharts() {
				var data = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5]
				var titlename = ['财务管理', '土木工程', '会计学', '英语', '艺术设计', '法学', '教育', '外国语',
					'公共管理', '音乐'];
				var myColor = ['#22B1D4'];
				var option = {
					title: {
						text: '就业率分析',
						left: '0%',
						textStyle: {
							color: '#75CBF2',
							fontSize: '18'
						},
					},
					grid: {
						containLabel: true,
						left: 15,
						bottom: -15,
						top: 30,
						right: 20,
					},
					xAxis: {
						show: false
					},
					yAxis: [{
						show: true,
						data: titlename,
						inverse: true,
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							color: '#75CBF2',
							fontSize: '14',
						},
					}],
					series: [{
						type: 'bar',
						data: data,
						barWidth: 10,
						itemStyle: {
							normal: {
								barBorderRadius: 30,
								color: function(params) {
									var num = myColor.length;
									return myColor[params.dataIndex % num]
								},
							}
						},
						label: {
							normal: {
								show: true,
								position: 'right',
								formatter: '{c}%'
							}
						},
					}]
				};
				return option;
			},
			LeavingSchool_CenterEcharts() {
				var option = {
					title: {
						text: '毕业去向',
						left: 'left',
						top: 0,
						textStyle: {
							fontSize: 18,
							color: '#75CBF2'
						}
					},
					visualMap: {
						show: false,
						min: 1,
						max: 100,
						inRange: {}
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: '70%',
						center: ['50%', '50%'],
						color: ['#0486A6', '#22B1D4', '#32D1F8'], //'#FBFE27','rgb(11,228,96)','#FE5050'
						data: [{
								value: 80,
								name: '就业'
							},
							{
								value: 40,
								name: '升学'
							},
							{
								value: 20,
								name: '未就业'
							}
						].sort(function(a, b) {
							return a.value - b.value
						}),
						roseType: 'radius',
						labelLine: {
							show: false,
							smooth: 5,
							length: 5,
						},
						label: {
							normal: {
								formatter: function(params) {
									return params.name + params.value + "%"
								},
								color: '#75CBF2',
							}
						},
					}]
				}
				return option;
			},
			//毕业率
			LeavingSchool_topBEcharts() {
				var Data = 97.3;
				var color = ["#31859C", "#1D3F65"];
				var ydata = [{
					name: '已毕业',
					value: Data
				}, {
					name: '未毕业',
					value: 100 - Data
				}];
				var option = {
					color: color,
					title: [{
						text: Data + '%',
						x: 'center',
						y: '50%',
						textStyle: {
							fontSize: 20,
							fontWeight: 'bold',
							fontStyle: 'normal',
							color: '#00FFFF'
						}
					}, {
						text: '新生报到率',
						x: 'center',
						y: '0%',
						textStyle: {
							fontSize: 16,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#75CBF2'
						}
					}],
					series: [{
						type: 'pie',
						hoverAnimation: false,
						center: ['50%', '60%'],
						radius: ['55%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
							}
						},
						data: ydata
					}]
				}
				return option;
			},
			//就业率
			LeavingSchool_topJEcharts() {
				var Data = 73.5;
				var color = ["#31859C", "#1D3F65"];
				var ydata = [{
					name: '已就业',
					value: Data
				}, {
					name: '未就业',
					value: 100 - Data
				}];
				var option = {
					color: color,
					title: [{
						text: Data + '%',
						x: 'center',
						y: '50%',
						textStyle: {
							fontSize: 20,
							fontWeight: 'bold',
							fontStyle: 'normal',
							color: '#00FFFF'
						}
					}, {
						text: '财务缴费率',
						x: 'center',
						y: '0%',
						textStyle: {
							fontSize: 16,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#75CBF2'
						}
					}],
					series: [{
						type: 'pie',
						hoverAnimation: false,
						center: ['50%', '60%'],
						radius: ['55%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
							}
						},
						data: ydata
					}]
				}
				return option;
			},
		}
	}
</script>

<style lang="stylus" scoped>
	.LeavingSchool_top {
		height: 125px;
		width: 290px;
	}
	
	#LeavingSchool_Center {
		height: 165px;
		width: 290px;
		margin-top: 30px;
	}
	
	#LeavingSchool_topB {
		width: 140px;
		height: 120px;
		float: left;
		margin-top: 2px;
	}
	
	#LeavingSchool_topJ {
		width: 140px;
		height: 120px;
		float: left;
		margin-left: 10px;
		margin-top: 2px;
	}
	
	.ReportTo {
		width: 140px;
		float: left;
	}
	
	.GraduationRateUL .fontONELine {
		font-size: 14px;
	}
	
	.GraduationRateUL ul {
		width: 100%;
		text-align: center;
		margin-left: 10px;
	}
	
	.GraduationRateUL ul li {
		display: inline-block;
		font-size: 16px;
		color: #75CBF2;
		vertical-align: middle;
	}
	#LeavingSchool_Bottom{
		height: 390px;
		width: 290px;
	}
</style>