<template>
	<div class="consume">
		<h4 class="mdTitle">就餐消费倾向</h4>
		<div class="timeselect">最近12个月</div>
		<div class="clearFix backboxContainer">
			<div class="WeeklyConsumption fl">
				<h5>周消费趋势</h5>
				<div id="WeeklyConsumption"></div>
			</div>
			<div class="GendeConsumption fr">
				<h5>不同性别消费倾向</h5>
				<div class="ConsumptionPie">
					<p>男</p>
					<div id="BoyConsumption"></div>
				</div>
				<div class="ConsumptionPie">
					<p>女</p>
					<div id="GirConsumption"></div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	var SetupJsondata = {
		'color': ["#0A4B76", "#B1306D", "#FF9900"], //颜色list
		'radius': ['45%', '55%'], //圆环大小
		'linecolor': '#015c69', //视觉引导线颜色
		'fontcolor': '#75cbf2', //文字颜色
		'fontSize': 12, //文字大小
		'title': "不同性别消费倾向"
	}

	export default {
		name: "PropensityConsume",
		data() {
			return {
				maxConsume: "",
				minConsume: "",
				lessTen: [], //10元以内
				greaterTen: [], //10-20元
				greaterTwenty: [], //20元以上
				boyConsumption: [{
						value: 0,
						name: '10元以内'
					},
					{
						value: 0,
						name: '10-20元'
					},
					{
						value: 0,
						name: '20元以上'
					},

				],
				girConsumption: [{
						value: 0,
						name: '10元以内'
					},
					{
						value: 0,
						name: '10-20元'
					},
					{
						value: 0,
						name: '20元以上'
					},

				],
				Ajson: {
					color: ["#0A4B76", "#B1306D", "#FF9900"],
					splitNumber:4,
					legend: ['10元以内', '10-20元', '20元以上'],
					oxAxis: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
					oData1: [0, 0, 0, 0, 0, 0, 0],
					oData2: [0, 0, 0, 0, 0, 0, 0],
					oData3: [0, 0, 0, 0, 0, 0, 0]
				},
				boy: {
					data1: [0, 0, 0, 0, 0, 0, 0],
					data2: [0, 0, 0, 0, 0, 0, 0],
					data3: [0, 0, 0, 0, 0, 0, 0]
				},

				girl: {
					data1: [0, 0, 0, 0, 0, 0, 0],
					data2: [0, 0, 0, 0, 0, 0, 0],
					data3: [0, 0, 0, 0, 0, 0, 0],
				}

			}
		},
		mounted: function() {
			//this.geteatGrade(); //获取就餐分析数据
			this.getConsumption()
		},
		methods: {
			getConsumption() {
				var _this = this;
				this.$axios.post('traffic/life/weekTrend/' + UNITID)
					.then(this.getConsumptionSucc)
			},
			addListData(oINdex, list) {
				if(list.staffSex == "1") {
					this.boy.data1[oINdex] = parseInt(list.lessTen);
					this.boy.data2[oINdex] = parseInt(list.greaterTen);
					this.boy.data3[oINdex] = parseInt(list.greaterTwenty);
				} else if(list.staffSex == "2") {
					this.girl.data1[oINdex] = parseInt(list.lessTen);
					this.girl.data2[oINdex] = parseInt(list.greaterTen);
					this.girl.data3[oINdex] = parseInt(list.greaterTwenty);
				}
				this.Ajson.oData1[oINdex] += parseInt(list.lessTen);
				this.Ajson.oData2[oINdex] += parseInt(list.greaterTen);
				this.Ajson.oData3[oINdex] += parseInt(list.greaterTwenty);

			},
			getConsumptionSucc(res) {
				var myChart2 = echarts.init(document.getElementById("BoyConsumption"));
				var myChart3 = echarts.init(document.getElementById("GirConsumption"));
				var data = res.weekList;
				var consume = res.consume || [];
				if(consume.maxConsume != "" || consume.minConsume != "") {
					var min = consume.minConsume + "元以内";
					var minmax = consume.minConsume + "-" + consume.maxConsume + "元";
					var max = consume.maxConsume + "元以上";
					this.boyConsumption[0].name = min;
					this.boyConsumption[1].name = minmax;
					this.boyConsumption[2].name = max;
					this.girConsumption[0].name = min;
					this.girConsumption[1].name = minmax;
					this.girConsumption[2].name = max;
					this.Ajson.legend = [min, minmax, max]; 
				}
				if(data && data.length > 0) {
					this.Ajson.oData1 = [0, 0, 0, 0, 0, 0, 0];
					this.Ajson.oData2 = [0, 0, 0, 0, 0, 0, 0];
					this.Ajson.oData3 = [0, 0, 0, 0, 0, 0, 0];
					this.boy.data1 = [0, 0, 0, 0, 0, 0, 0];
					this.boy.data2 = [0, 0, 0, 0, 0, 0, 0];
					this.boy.data3 = [0, 0, 0, 0, 0, 0, 0];

					this.girl = {
						data1: [0, 0, 0, 0, 0, 0, 0],
						data2: [0, 0, 0, 0, 0, 0, 0],
						data3: [0, 0, 0, 0, 0, 0, 0],
					};
					this.boyConsumption[0].value = 0;
					this.boyConsumption[1].value = 0;
					this.boyConsumption[2].value = 0;
					this.girConsumption[0].value = 0;
					this.girConsumption[1].value = 0;
					this.girConsumption[2].value = 0;

					for(var i = 0; i < data.length; i++) {
						var list = data[i];
						if(list.useWeek == "7") {
							this.addListData(0, list)
						} else if(list.useWeek == "1") {
							this.addListData(1, list)
						} else if(list.useWeek == "2") {
							this.addListData(2, list)
						} else if(list.useWeek == "3") {
							this.addListData(3, list)
						} else if(list.useWeek == "4") {
							this.addListData(4, list)
						} else if(list.useWeek == "5") {
							this.addListData(5, list)
						} else if(list.useWeek == "6") {
							this.addListData(6, list)
						}

					}
				};
				var mTime3 = null;
				var myChart = echarts.init(document.getElementById("WeeklyConsumption"));
				this.ConsumptionChart(1, myChart2, myChart3)
				myChart.setOption(StackedBar(this.Ajson), true);
				var index = 0; //播放所在下标  
				var _this = this;
				clearInterval(mTime3);
				mTime3 = setInterval(function() {
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index
					});
					index++;
					if(index > _this.Ajson.oData1.length - 1) {
						index = 0;
					}
					_this.ConsumptionChart(index, myChart2, myChart3)
				}, 3000);
				
				allCharts.push(myChart,myChart2,myChart3);

			},
			ConsumptionChart(index, myChart2, myChart3) {
				if(index == 0) {
					index = 7
				}
				this.boyConsumption[0].value = this.boy.data1[index - 1];
				this.boyConsumption[1].value = this.boy.data2[index - 1];
				this.boyConsumption[2].value = this.boy.data3[index - 1];
				this.girConsumption[0].value = this.girl.data1[index - 1];
				this.girConsumption[1].value = this.girl.data2[index - 1];
				this.girConsumption[2].value = this.girl.data3[index - 1];
				myChart2.setOption(Ringdiagram(this.boyConsumption, SetupJsondata), true);
				myChart3.setOption(Ringdiagram(this.girConsumption, SetupJsondata), true);
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.consume h5 {
		font-size: 0.7rem;
		color: #75CBF2;
	}
	
	.WeeklyConsumption {
		width: 55%;
		height: 98%;
	}
	
	#WeeklyConsumption {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 3;
	}
	
	.GendeConsumption {
		width: 42%;
		height: 98%;
	}
	
	.ConsumptionPie {
		width: 100%;
		height: 50%;
		position: relative;
	}
	
	.ConsumptionPie p {
		width: 100%;
		text-align: center;
		font-size: 0.8rem;
		color: #71C5EB;
		position: absolute;
		top: 50%;
		left: 0;
		transform:translateY(-50%); 
	}
	
	#BoyConsumption,
	#GirConsumption {
		width: 100%;
		height: 100%;
	}
	
	.timeselect {
		line-height: 1.2rem;
		font-size: 0.8rem;
		cursor: pointer;
		padding-left: 0.45rem;
		color: #71C7D5;
		position: absolute;
		top: 0.35rem;
		right: 0.65rem;
	}
</style>