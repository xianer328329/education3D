<template>
	<div class="NoMask-mian">
		<h4 class="mdTitle">未佩戴口罩占比 </h4>
		<div class="nomask-box backboxContainer">
			<div class="nomaske-pie clearFix">
				<div class="nomask-echatrbox">
					<div id="nomaskepie"></div>
				</div>
				<div class="nomask-lengd">
					<div class="linhight">
						<div class="lengeng recolor"><span class="nomask-title">未佩戴人数<i class="Z-numberf bcolor">{{pietitle[0].value}}</i></span></div>
						<div class="lengeng"><span class="nomask-title">已佩戴人数<i class="Z-numberf bcolor">{{pietitle[1].value}}</i></span></div>
					</div>
				</div>
			</div>
			<div class="nomask-echatr">
				<div class="nomask-title">未佩戴口罩趋势</div>
				<div id="nomaskechart"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'NoMask',
		data() {
			return {
				dayList: [],
				barJson: {
					name: '最近30天',
					color: ["00fffc"],
					grid: {
						left: 10,
						right: 10,
						bottom: 0,
						top: 0,
						containLabel: true
					},
					splitNumber: 3,
					size: 0.7 * fontSize
				},
				pieJsondata: { //pie图样式
					color: ["#FF9900", "#0071A6"],
					radius: '90%',
					center: ['50%', '50%'],
					emphasis: 'false',
					lege: 'false',
					label: {
						show: true,
						position: 'inside',
					},
					itemGap: 14,
					fontSize: 18,
					top: 10,
				},
				pietitle: [{
					value: 0,
					name: "未佩戴口罩"
				}, {
					value: 0,
					name: "已佩戴口罩"
				}],
				nomasktime: null,
				maskData: [],
				myCharts: null,
			}
		},
		mounted() {
			this.getdata();
		},
		methods: {
			getdata() {
				var vm = this;
				this.$axios.post('/traffic/people/notWornMask', {}).then(res => {
					var data = res || {};
					var dataX = [];
					var barData = [];
					var maskData = [];

					for(var k in data) {
						var item = data[k] == null ? '0' : data[k].notWornMask + data[k].wearMask;
						let ky = k.split('-');
						dataX.push(ky[1]);
						barData.push(item);
						var list = [];
						var nobj = {
							value: data[k] == null ? 0 : data[k].notWornMask,
							name: '未佩戴口罩'
						}
						var yobj = {
							value: data[k] == null ? 0 : data[k].wearMask,
							name: '已佩戴口罩'
						};
						list.push(nobj, yobj)
						maskData.push(list)
					}

					this.barJson.dataX = dataX;
					this.barJson.barData = barData;

					this.maskData = maskData;
					this.initecharts();
					this.initpie();
				})
			},
			initpie() {
				this.pieJsondata.lege = "false";
				this.pieJsondata.emphasis = "false";
				var vm = this;
				this.$nextTick(function() {
					var myCharts = echarts.init(document.getElementById("nomaskepie"));
					myCharts.setOption(Pie(this.pietitle, this.pieJsondata), true);
					vm.myCharts = myCharts
					myCharts.resize();
					allCharts.push(myCharts);
				})
			},
			initecharts() {
				var vm = this;
				var barJson = this.barJson;
				var maskData = this.maskData;
				this.$nextTick(function() {
					var myChart = echarts.init(document.getElementById('nomaskechart'));
					myChart.setOption(vm.initeoption(barJson), true);
					myChart.resize();
					allCharts.push(myChart);
					var index = 0; //播放所在下标  
					clearInterval(vm.nomasktime);
					vm.nomasktime = setInterval(function() {
						myChart.dispatchAction({
							type: 'showTip',
							seriesIndex: 0,
							dataIndex: index
						});
						vm.pietitle = maskData[index]
						vm.pieJsondata.lege = "false";
						vm.pieJsondata.emphasis = "false";
						vm.myCharts.setOption(Pie(vm.pietitle, vm.pieJsondata), true)
						index++;
						if(index > barJson.dataX.length - 1) {
							index = 0;
						}
					}, 3000);
					myChart.on('click', function(params) {
						vm.pietitle = maskData[params.dataIndex]
						vm.pieJsondata.lege = "false";
						vm.pieJsondata.emphasis = "false";
						vm.myCharts.setOption(Pie(vm.pietitle, vm.pieJsondata), true)
					})
				})
			},
			initeoption(barJson) {
				var option = {
					animationEasing: 'SinusoidalIn',
					animationDuration: 10000,
					grid: {
						left: 0,
						right: 10,
						bottom: 5,
						top: 30,
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						formatter: '{c0}人',
						backgroundColor: '#0A3F5E',
						borderColor: '#00D1D5',
						borderWidth: 1,
						axisPointer: {
							type: 'shadow',
							label: {
								show: true,
								backgroundColor: '#333'
							}
						}
					},
					xAxis: {
						type: 'category',
						data: barJson.dataX,
						axisTick: false,
						splitLine: {
							show: false,
						},
						axisLabel: {
							show: true,
							rotate: 0,
							textStyle: textStyleC
						},
						axisLine: axisLineC,
					},
					yAxis: [{
						type: 'value',
						minInterval: 1,
						splitNumber: barJson.splitNumber || 5,
						splitLine: {
							show: false,
						},
						axisLine: axisLineC,
						axisLabel: {
							show: true,
							textStyle: textStyleC,
							formatter: function(e) {
								return Math.abs(e);
							}
						},
						axisTick: {
							show: false,
						}

					}],
					series: [{
						name: '异常',
						type: 'bar',
						stack: '体温',
						barMaxWidth: 8,
						itemStyle: {
							normal: {
								barBorderRadius: [0, 0, 0, 0],
								color: '#0087C4',
							}
						},
						data: barJson.barData
					}]
				};
				return option;

			},
			FormData(dateList) {
				var datas = [];
				dateList.forEach((item) => {
					var day = null;
					if(item) {
						var daylist = item.split('-');
						day = daylist[daylist.length - 1]
					}
					datas.push(day);
				})
				return datas
			},
			getday() {
				//获取最近30天
				var lastMonth = [];
				for(var i = 0; i < 30; i++) {
					var data = new Date(new Date().setDate(new Date().getDate() - i))
					var Month = data.getMonth() + 1;
					Month = Month < 10 ? "0" + Month : Month;
					var day = data.getDate();
					day = day < 10 ? "0" + day : day;
					lastMonth.push(data.getFullYear() + '-' + Month + '-' + day)
				}
				return lastMonth;
			},
		},
	}
</script>

<style lang="scss">
	.NoMask-mian {
		height: 100%;
		.nomask-lengd {
			height: 100%;
			width: 50%;
			position: relative;
			display: inline-block;
			float: right;
		}
		.bcolor {
			font-size: 1rem;
			font-weight: 500;
			margin-left: 0.5rem;
			color: #00FFFF;
		}
		.recolor:before {
			background-color: #FF9900 !important;
		}
		.linhight {
			margin-left: 5%;
			margin-top: 20%;
		}
		.lengeng:before {
			content: "";
			display: inline-block;
			width: 0.2rem;
			height: 0.7rem;
			background: #0087C4;
			margin-right: 0.3rem;
		}
		.nomask-title {
			font-size: 0.6rem;
			font-family: "Adobe Heiti Std R";
			font-weight: normal;
			position: absolute;
			color: rgba(117, 203, 242, 1);
		}
		#nomaskechart {
			height: 100%;
			width: 100%;
			position: relative;
			z-index: 3;
		}
		#nomaskepie {
			height: 100%;
			width: 100%;
			position: relative;
			z-index: 3;
		}
		.nomask-echatrbox {
			height: 100%;
			width: 50%;
			position: relative;
			display: inline-block;
		}
		.nomaske-pie {
			width: 100%;
			height: 9rem;
			margin-top: 0.5rem;
			flex: 1;
		}
		.nomask-echatr {
			width: 100%;
			margin-top: 0.5rem;
			flex: 1;
		}
		.nomask-box {
			display: flex;
			flex-direction: column;
		}
		.mdTitle-right {
			text-align: center;
			width: 12%;
			border: 1px solid rgba(255, 255, 255, 1);
			opacity: 0.5;
			border-radius: 1px;
			color: rgba(254, 254, 254, 1);
			float: right;
			cursor: pointer
		}
	}
</style>