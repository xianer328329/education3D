<template>
	<div class="Where">
		<div class="Where-left fl">
			<h4 class="basetitle">毕业生去向</h4>
			<div class="Where-pie" id="wherepie"></div>
		</div>
		<div class="Where-left fl">
			<h4 class="basetitle">毕业生流动率</h4>
			<div id="wherbar"></div>
		</div>
		<div class="Where-left fl">
			<h4 class="basetitle">就业单位性质</h4>
			<div id="wherbars"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Whereabouts',
		components: {

		},
		data() {
			return {

			}
		},
		mounted: function() {
			this.mycharts();
		},
		methods: {
			mycharts() {
				var mychats = echarts.init(document.getElementById("wherepie"));
				mychats.setOption(this.charpie()); //饼图
				var mybatchart = echarts.init(document.getElementById("wherbar"));
				mybatchart.setOption(this.chartbar()); //柱状图
				var mybatcharts = echarts.init(document.getElementById("wherbars"));
				mybatcharts.setOption(this.chatbars()); //柱状图

			},
			chatbars() {
				var option = {
					color: ['#0478B7', '#32C872'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},

					legend: {
						show: true,
						//orient: 'vertical',
						right: 0,
						top: 0,
						itemWidth: 8,
						itemHeight: 16,
						itemGap: 6,
						textStyle: {
							color: '#75CBF2',
							fontSize: 14,
						},
						data: ['今年', '同期']
					},
					grid: {
						left: '1%',
						right: '1%',
						bottom: '1%',
						top: '10%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ["民营企业", "国有企业", "中外合资", "外资企业", "政府机关", "事业单位", '其他'],

						axisTick: {
							show: false,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#6FBFCB',
							}
						},
						axisLabel: {
							color: '#31859C',
							interval: 0,
							/*rotate: 60,*/
							fontSize:14,
							formatter: function(value) {
								value = value.substring(0, 6);
								var ret = ""; //拼接加\n返回的类目项
								var maxLength = 2; //每项显示文字个数
								var valLength = value.length; //X轴类目项的文字个数
								var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
								if(rowN > 1) //如果类目项的文字大于3,
								{
									for(var i = 0; i < rowN; i++) {
										var temp = ""; //每次截取的字符串
										var start = i * maxLength; //开始截取的位置
										var end = start + maxLength; //结束截取的位置
										temp = value.substring(start, end) + "\n";
										ret += temp; //凭借最终的字符串
									}
									return ret;
								} else {
									return value;
								}
							},
						}
					}],
					yAxis: [{
						show:true,
						type: 'value',
						minInterval: 1,
						axisTick: {
							show: false,
						},
						splitLine: {
							show: false,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#6FBFCB',
							}
						},
						axisLabel: {
							show: true,
							color: '#31859C',
							fontSize:14,
							formatter:function(parasm){
								return parasm+"%";
							}
							
						},
					}],
					series: [{
							name: "今年",
							type: 'bar',
							barWidth: 20,
							barGap:0,
							data: [50, 54, 80, 97, 31, 68, 48],
						},
						{
							name: "同期",
							type: 'bar',
							barWidth: 20,
							barGap:0,
							data: [68, 48, 57, 59, 64, 71, 66],
						},

					]
				};
				return option

			},
			chartbar() {
				var option = {
					color: ["#135E81"],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '1%',
						right: '1%',
						bottom: '0%',
						top: "3%",
						containLabel: true
					},
					xAxis: {
						show: false,
						type: 'value',
					},
					yAxis: {
						type: 'category',
						axisLabel: {
							color: ['#75CBF2'],
							fontSize: 14,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: ['#75CBF2'],
								width: '1',
								type: 'solid',
							}
						},
						axisTick: {
							show: false,
						},
						data: ['就业城流动率', '向一线城市流动率', '一线城市向外流动率', '本事留存率', '工作与专业一致率']
					},
					series: [{
						name: '2019年',
						type: 'bar',
						barWidth: 25,
						label: {
							show: true,
							position: 'right',
							fontWeight: 'bold',
							color: ["rgba(0,255,255,1)"],
							formatter: function(params) {
								return(params.value / 2973).toFixed(2) * 100 + "%"
							}
						},
						data: [182, 234, 290, 1049, 1317]
					}, ]

				}
				return option;
			},
			charpie() {
				var _this = this;
				var img = require('../../../../static/images/img4.png');
				var rich = {
					a: {
						fontWeight: 'bold',
						fontSize: 14,
						color: '#00FFFF',
						padding: [8, 8, 8, 12],
						align: 'left',
						fontFamily: 'DIN Medium'
					},
					b: {
						color: '#75CBF2',
						fontSize: 14,
						padding: [8, 12, 8, 8],
						align: 'right',
						fontFamily: "DIN Medium"
					},
					c: {
						color: '#75CBF2',
						fontSize: 12,
						padding: [8, 12],
						align: 'center',
					},
					d: {
						width: '100%',
						height: 3,
						backgroundColor: {
							image: img
						}
					},
					e: {
						color: '#00FFFF',
						align: 'left',
						padding: [0, 5, 0, 0]
					}
				}
				return {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					series: [{
						name: '告警分析',
						type: 'pie',
						radius: '70%',
						center: ['50%', '55%'],
						color: ['#0478B7', '#D45079', '#52A6A2', '#2189AF', '#ED7703'],
						labelLine: {
							lineStyle: {
								color: '#75CBF2',
							}
						},
						label: {
							normal: {
								color: '#75CBF2',
								fontSize: 12,
								formatter: '{a|{d}%}\n{d|}\n{c|{b}}',
								borderColor: '#195E7F',
								borderWidth: 1,
								backgroundColor: '#001626',
								align: 'center',
								//								formatter: function(params) { //格式化数据
								//									return '{line|' + params.name + " " + params.percent + '%}\n{hr|}\n';
								//								},
								rich: rich //设置文字与下滑线
							},
						},
						emphasis: {
							label: {
								borderColor: '#00ffff',
							}
						},
						data: [{
								value: 28,
								name: '未就业'
							},
							{
								value: 20,
								name: '就业'
							},
							{
								value: 15,
								name: '升学'
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};

			},
		}
	}
</script>

<style>
	#wherbars {
		height: 255px;
		width: 450px;
	}
	
	#wherbar {
		height: 255px;
		width: 450px;
		/*border: solid 1px red;*/
	}
	
	.Where-pie {
		height: 245px;
		width: 450px;
	}
	
	.basetitle {
		font-size: 18px;
		font-family: "Microsoft YaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.Where-left {
		width: 450px;
		height: 270px;
	}
</style>