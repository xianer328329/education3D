<template>
	<div>
		<h4 class="AlarmTitle">告警趋势</h4>
		<div class="h-time-c">
			<a :class="{'active':index==1}" @click='getalarmTrenddata(1)'>最近30天</a>
			<a :class="{'active':index==2}" @click='getalarmTrenddata(2)'>最近12个月</a>
		</div>
		<div class="situation backboxContainer">			
			<div class="A-Slide">
				<ul>
					<li>
						<div class="fl Lleft">
							<div class="A-left">
								<div class="A-lefttitle"><span>{{alarmtitle}}</span><i class="fr">{{alarmtotal}}<span class="ma">次</span></i></div>
								<div class="A-lefttitle spacing"><span>人脸联防布控告警</span><i class="fr">{{cloudalarmcount}}<span class="ma">次</span></i></div>
							</div>
							<div id="Lbuttom"></div>
						</div>
						<div id="Lright"></div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	var subscript;
	export default {
		data() {
			return {
				alarmtitle: "", //标题
				index: 1, //点击事件下标
				subIndex: 0, //图标移动下标
				myChart: '', //柱状图
				piemyChart: '', //饼图
				alarmtotal: "--", //最近30天总告警
				cloudalarmcount: "--", //人脸联防报警次数
				lists: [],
				accesstype: {//配置项
					alarmTime: 0
				}
			}

		},
		mounted: function() {
			this.getalarmTrenddata(1);
		},
		methods: {
			getaccesstype(){//配置项
				if(Campussecurity && Campussecurity.length > 0) {
					this.accesstype = {
						alarmTime: 0
					};
					for(var i = 0; i < Campussecurity.length; i++) {
						if(Campussecurity[i] == "人脸本校布控") {
							this.accesstype.schoolControl = 0;
						} else if(Campussecurity[i] == "人脸联防布控") {
							this.accesstype.cloudControl = 0;
						} else if(Campussecurity[i] == "联动报警") {
							this.accesstype.linkageAlarm = 0;
						} else if(Campussecurity[i] == "移动侦测") {
							this.accesstype.motionDetection = 0;
						} else if(Campussecurity[i] == "视频遮挡") {
							this.accesstype.videoOcclusion = 0;
						}
					}
				}
			},
			getalarmTrenddata(index) {
				var url = '';
				var vm = this;
				this.subIndex = 0;
				this.index = index;
				if(index == 1) {
					this.alarmtitle = "最近30天告警"
					url = '/monitor/alarmTrend/' + UNITID + '?type=1';
				} else {
					this.alarmtitle = "最近12月告警"
					url = '/monitor/alarmTrend/' + UNITID + '?type=2';
				}

				this.$axios.post(url).then((res) => {
					this.getaccesstype();
					var data = res || [];
					var alalmdate = [];
					var datalist = [],
						cloudControl = 0,
						sum = 0,
						lists = [];
					var FormerDecember = this.getdate(index); //获取当前时间前12月
					FormerDecember.forEach((it) => {
						var alalmcount = 0,
							alarmTime = index == 1 ? (new Date(it).Format("MM-dd") + '日') : (new Date(it).Format("yyyy-MM") + '月'),
							state = true;
						data.forEach((item, inx) => {
							if(it == item.alarmTime) {
								state = false;
								var obj = {};
								for(var j in this.accesstype) {
									obj[j] = item[j]
								}
								lists.push(obj);
								for(var i in item) {

									if(i != 'alarmTime') {
										if(i == 'cloudControl') {
											cloudControl += item[i];
										}
										alalmcount += item[i];
									}
								}
							}
						});
						if(state) {
							//lists.push({alarmTime:0,schoolControl:0,linkageAlarm:0,cloudControl:0,motionDetection:0,videoOcclusion:0})
							lists.push(this.accesstype)
						}
						sum += alalmcount;
						alalmdate.push(alarmTime)
						datalist.push(alalmcount);
					})
					this.lists = lists;
					this.Histogram(datalist, alalmdate); //调用柱					
					this.cloudalarmcount = cloudControl; //人脸云端联防报警次数
					this.alarmtotal = sum; //最近30天总告警
					this.subscriptchange(datalist.length); //柱状图下标移动
				})
			},
			subscriptchange(length) {
				var _this = this;
				this.piemyChart = echarts.init(document.getElementById("Lright"));
				this.piemyChart.setOption(_this.Piechart(_this.lists[_this.subIndex])); //饼图
				allCharts.push(this.piemyChart);
				this.myChart.on('click', function(params) { //柱状图点击事件
					_this.subIndex = params.dataIndex;
					_this.setoption();
					_this.setInterval(length);
				});
				this.myChart.on('mouseover', function(params) { //柱状图点击事件
					clearInterval(subscript);
				});
				this.myChart.on('mouseout', function(params) { //柱状图点击事件
					_this.setInterval(length);
				});
				this.setInterval(length);
			},
			setInterval(length) {
				var _this = this;
				clearInterval(subscript);
				this.myChart.dispatchAction({
					type: 'showTip',
					seriesIndex: 0, //第几条series
					dataIndex: _this.subIndex, //第几个tooltip
				});
				subscript = setInterval(function() { //柱状图颜色循环
					_this.subIndex++;
					if(_this.subIndex >= length) {
						_this.subIndex = 0;
					}
					_this.setoption();

				}, 3000);
			},
			setoption() { //重新set柱状图柱子颜色
				var _this = this;
				this.myChart.setOption({
					series: [{
						itemStyle: {
							normal: {          
								color: function(param) {            
									return(_this.subIndex == param.dataIndex) ? '#FF9900' : '#D04A4A';          
								}        
							},
						},
					}]
				});
				this.myChart.dispatchAction({
					type: 'showTip',
					seriesIndex: 0, //第几条series
					dataIndex: _this.subIndex, //第几个tooltip
				});
				this.piemyChart.setOption(_this.Piechart(_this.lists[_this.subIndex])); //饼图
			},
			getdate(index) { //获取最近30天或12个月 并存入数组
				var dataArr = [],
					len = index == 2 ? 12 : 30;
				var data = new Date();
				if(index == 2) {
					data.setMonth(data.getMonth() - 11);
				} else {
					data.setDate(data.getDate() - 29);
				}
				for(var i = 0; i < len; i++) {
					dataArr.push(index == 1 ? data.Format('yyyy-MM-dd') : data.Format('yyyy-MM'))
					if(index == 2) {
						data.setMonth(data.getMonth() + 1); //每次循环一次 月份值减1
					} else {
						data.setDate(data.getDate() + 1); //每次循环一次 月份值减1
					}

				}
				return dataArr;
			},
			Histogram(datalist, alalmdate) {
				var _this = this;
				var option = {
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						alwaysShowContent: true,
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						},
						textStyle:tooltipTextStyle
					},
					grid: {
						left: '0%',
						right: '0%',
						top: '4%',
						bottom: '0%',
						containLabel: true
					},
					textStyle:textStyleC,
					xAxis: [{
						type: 'category',
						data: alalmdate,
						axisLine: {
							lineStyle: {
								color: '#6FBFCB',
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							rotate: 60,
							formatter: function(value) {
								return value.substring(0, value.length - 1)
							},
							textStyle:textStyleC,
						}
					}],
					yAxis: [{
						type: 'value',
						splitNumber:4,
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							textStyle:textStyleC,
						},
						axisLine: {
							lineStyle: {
								color: '#6FBFCB',
							},
						},
					}],
					series: [{
						name: '告警数量',
						type: 'bar',
						barMaxWidth:10 ,
						itemStyle: {
							color: '#D04A4A',
							barBorderRadius: [4, 4, 0, 0],
							normal: { 　　　　　　　　　　 //当前选中的柱子使用亮色，其余的使用基本颜色
								color: function(param) {            
									return(_this.subIndex == param.dataIndex) ? '#FF9900' : '#D04A4A';          
								},
								barBorderRadius: [4, 4, 0, 0],
								        
							},
						},
						data: datalist
					}]

				}
				this.myChart = echarts.init(document.getElementById("Lbuttom"));
				this.myChart.setOption(option);
				allCharts.push(this.myChart)
			},
			Piechart(piecount) {
				var _this = this;
				var img = require('../../../../static/images/img4.png');
				var rich = {
					a: {
						fontWeight: 'bold',
						fontSize: 0.7*fontSize,
						color: '#00FFFF',
						padding: [0.4*fontSize, 0,0.4*fontSize, 0.6*fontSize],
						align: 'left',
						fontFamily: 'DIN Medium'
					},
					b: {
						color: '#75CBF2',
						fontSize: 0.7*fontSize,
						padding: [0.4*fontSize, 0.6*fontSize, 0.4*fontSize,0.4*fontSize],
						align: 'right',
						fontFamily: "DIN Medium"
					},
					c: {
						color: '#75CBF2',
						fontSize: 0.6*fontSize,
						padding: [0.4*fontSize, 0.6*fontSize],
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
						padding: [0, 0.25*fontSize, 0, 0]
					}
				}
				return {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)",
						textStyle:tooltipTextStyle
					},
					series: [{
						name: '告警分析',
						type: 'pie',
						radius: '50%',
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
								fontSize: 0.6*fontSize,
								formatter: '{a|{c}}{e|次} {b|{d}%}\n{d|}\n{c|{b}}',
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
								value: piecount.linkageAlarm,
								name: '联动报警'
							},
							{
								value: piecount.cloudControl,
								name: '云端布控报警'
							},
							{
								value: piecount.schoolControl,
								name: '人脸本校布控'
							},
							{
								value: piecount.motionDetection,
								name: '移动侦测'
							},
							{
								value: piecount.videoOcclusion,
								name: '视频遮挡'
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

<style lang="scss" scoped>
	#Lright {
		float: right;
		height: 100%;
		width: 40%;
	}
	
	#Lbuttom {
		position: absolute !important;
		top:3rem;
		bottom: 0px;
		left: 0px;
		width: 100%;
	}
	
	.A-lefttitle {
		float: left;
		width: 49%;
		height: 2rem;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		line-height: 2rem;
		padding: 0px 0.5rem;
		box-sizing: border-box;
	}
	
	.A-lefttitle span {
		font-size: 0.8rem;
		color: rgba(117, 203, 242, 1);
	}
	
	.ma {
		margin-left: 0.25rem;
	}
	
	.A-lefttitle i {
		font-size: 1.1rem;
		font-family: DIN-Medium;
		font-weight: 500;
		color: rgba(255, 204, 0, 1);
	}
	
	.spacing {
		float: right !important;
	}
	
	.A-left {
		overflow: hidden;
	}
	
	.A-Slide,ul,li{
		width:100%;
		height:100%;
		.Lleft{
			width: 60%;
			height:100%;
			position: relative;
		}
	}
	
	.situation {
		position: relative;
		overflow: hidden;
		z-index: 2;
	}
	
	.situation .hd {
		position: absolute;
		z-index: 1;
		top: 0px;
		text-align: center;
		right: 0px;
	}
	
	.situation .hd li {
		background: rgb(28, 49, 66);
		float: left;
		height: 26px;
		margin-right: 4px;
		font-size: 14px;
		color: #999;
		cursor: pointer;
		border: 1px solid;
		border-radius: 3px;
		line-height: 26px;
		padding: 0 5px;
	}
	
	.situation .hd .active {
		font-size: 18px;
		color: #75CBF2;
		background: rgb(1, 95, 108);
	}
	
	.situation .h-time-c {
		top: 3px !important;
	}
	
	.AlarmTitle {
		color: rgba(117, 203, 242, 1);
	}
</style>