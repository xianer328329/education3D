<template>
	<div class="newborn">
		<div class="newborn_top">
			<div id="newborn_topB"></div>
			<div id="newborn_topJ"></div>
		</div>
		<div id="newborn_Bottom">
		</div>
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
				var newborn_topBs = echarts.init(document.getElementById("newborn_topB"));
				newborn_topBs.setOption(this.newborn_topBEcharts());
				var newborn_topJs = echarts.init(document.getElementById("newborn_topJ"));
				newborn_topJs.setOption(this.newborn_topJEcharts());
				var newborn_Bottoms = echarts.init(document.getElementById("newborn_Bottom"));
				newborn_Bottoms.setOption(this.newborn_BottomEcharts());
			},
			newborn_BottomEcharts() {
				var legendData = ['男生', '女生'];
				var y_data = ['文化与传媒学院', '数学与财经学院', '材料与化工学院', '机器人工程学院', '林学与生命科学学院',
					'电子电气工程学院', '重庆服务外包学院', '经济管理学院', '旅游学院', '公共管理学院', '教育学院', '外国语学院',
					'音乐学院'
				];
				var _datamax = [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
					_data1 = [246, 201, 226, 198, 165, 176, 90, 169, 89, 190, 176, 156, 56],
					_data2 = [78, 81, 56, 95, 42, 80, 156, 147, 156, 70, 59, 109, 205],
					_data3 = [124, 115, 107, 78, 187, 125, 107, '', 107, 86, 108, 78, ''],
					_data4 = [9.8, 8.5, 8.3, 8.2, 7.6, 7.1, 6.9, 6.7, 6.7, 6.4, 6.1, 5.9, 5.7]
				var _label = {
					normal: {
						show: true,
						position: 'inside',
						textStyle: {
							color: '#fff',
							fontSize: 14
						}
					},
				};
				var option = {
					title: [{
						text: '学院新生报到情况',
						x: 'left',
						y: '0%',
						textStyle: {
							fontSize: 18,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#75CBF2'
						}
					}],
					legend: {
						data: legendData,
						itemWidth: 6,
						itemHeightL: 16,
						right: 10,
						textStyle: {
							color: '#4AACDB'
						}
					},
					grid: {
						containLabel: true,
						left: 0,
						bottom: -8,
						top: 30,
						right: 0,
					},
					xAxis: {
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
					},
					yAxis: [{show: true,
						inverse: true,
						data: y_data,
						axisLabel: {
							fontSize: 14,
							color: '#75CBF2',
							interval: 0,
							formatter: function(params) {
								var newParamsName = "";
								var paramsNameNumber = params.length;
								var provideNumber = 5; //一行显示几个字
								var rowNumber = 2;
								if(paramsNameNumber > provideNumber) {
									for(var p = 0; p < rowNumber; p++) {
										var tempStr = "";
										var start = p * provideNumber;
										var end = start + provideNumber;
										if(p == rowNumber - 1) {
											tempStr = params.substring(start, paramsNameNumber);
										} else {
											tempStr = params.substring(start, end) + "\n";
										}
										newParamsName += tempStr;
									}
								} else {
									newParamsName = params;
								}

								return newParamsName
							}
						},
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
					}, {
						show: true,
						inverse: true,
						data: _data4,
						axisLabel: {
							textStyle: {
								fontSize: 16,
								color: '#00FFFF',
							},
							formatter: function(params) {
								return params+"%"
								console.log(params);
							}
						},
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
					}],
					series: [{
						type: 'bar',
						name: '男生',
						stack: '2',
						label: _label,
						yAxisIndex: 1,
						barWidth: 22,
						itemStyle: {
							normal: {
								color: '#0087C4'
							},
							emphasis: {
								color: '#0087C4'
							}
						},
						data: _data1
					}, {
						type: 'bar',
						name: '女生',
						stack: '2',
						yAxisIndex: 1,
						barWidth: 22,
						label: _label,
						itemStyle: {
							normal: {
								color: '#FF8DC3'
							},
							emphasis: {
								color: '#FF8DC3'
							}
						},
						data: _data2
					}, {
						type: 'bar',
						stack: '2',
						name: '其他',
						yAxisIndex: 1,
						barWidth: 22,
						label: _label,
						itemStyle: {
							normal: {
								color: '#979797'
							},
							emphasis: {
								color: '#979797'
							}
						},
						data: _data3
					}]
				};
				return option;
			},
			//毕业率
			newborn_topBEcharts() {
				var Data = 95.3;
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
			newborn_topJEcharts() {
				var Data = 72.2;
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
	.newborn_top {
		height: 125px;
		width: 290px;
		margin-top: 10px;
	}
	
	#newborn_topB {
		width: 140px;
		height: 120px;
		float: left;
		margin-top: 2px;
	}
	
	#newborn_topJ {
		width: 140px;
		height: 120px;
		float: left;
		margin-left: 10px;
		margin-top: 2px;
	}
	
	#newborn_Bottom {
		height: 550px;
		width: 290px;
		margin-top: 10px;
		margin-bottom: 14px;
	}
</style>