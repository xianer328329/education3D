<template>
	<div class="emp">
		<h4 class="boxtitle">就业率分析</h4>
		<div id="empanalysis"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		mounted() {
			this.starchar();
		},
		methods: {
			starchar() {
				var mycharts = echarts.init(document.getElementById("empanalysis"));
				mycharts.setOption(this.empanaly()); //柱状图
			},
			empanaly() {
				var data = [510, 500, 520, 481, 469, 456, 430, 411, 392, 354, 310, 245, 200, 180];
				var datastr = ['财务管理', '计算机科学与技术', '土木工程', '机械设计制作及其自动化', '会计学', '汉语言文学', '英语', '艺术设计', '国际经济与贸易', '法学', '教育', '外国语', '公共管理', '音乐'];
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
							interval: 0,
							formatter: function(value) {
								value = value.substring(0, 10);
								var ret = ""; //拼接加\n返回的类目项
								var maxLength = 5; //每项显示文字个数
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
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: ['#75CBF2'],
								width: '1',
								type: 'solid',
							}
						},
						axisTick: {
							show: false,
						},
						data: datastr.reverse(),
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
								var datacount = 0;
								data.forEach(item => {
									datacount += item;
								})
								var a = (params.value / datacount).toFixed(2);
								var value = parseInt(a * 100)// 解决 0.07 乘以100等于7.0000000000000001的问题
								var reat = value + "%";
								return reat;
							}
						},
						data: data.reverse(),
					}, ]

				}
				return option;

			},
		},
	}
</script>

<style lang="stylus" scoped>
	#empanalysis {
		height: 650px;
	}
	
	.boxtitle {
		font-size: 18px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
</style>