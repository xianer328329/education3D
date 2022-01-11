<template>
	<div class="h-container">
		<h4 class="AlarmTitle">告警时段分析</h4>
		<div id="Lbuttom"></div>
	</div>
</template>

<script>
	var subscript;
	export default {
		data() {
			return {
				alarmtitle:"",//标题
				subIndex: 0, //图标移动下标
				myChart: '', //柱状图
				lists:[],
			}
		},
		mounted: function() {
			this.getalarmTrenddata(1);
		},
		methods: {
			getalarmTrenddata(index) {
				var url = '/monitor/alarmTrend/' + UNITID + '?type=2';
				var vm=this;
				this.subIndex=0;
				this.$axios.post(url).then((res) => {
					var data = res.data.data || [];
					var lists=[{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-11","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-12","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-13","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":22,"alarmTime":"2019-02-14","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-15","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-16","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-17","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-18","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-19","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-20","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-21","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-22","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-23","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":8,"alarmTime":"2019-02-25","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-26","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":18,"alarmTime":"2019-02-27","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-28","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-03-01","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-03-02","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":8,"alarmTime":"2019-03-03","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-03-04","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-05","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":20,"alarmTime":"2019-03-06","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-08","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-03-10","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-11","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0}];
					var datalist=[0,4,10,10,22,2,4,2,6,4,4,2,10,4,0,8,6,18,6,4,2,8,4,6,20,0,6,0,2,6];
					var alalmdate=["02-10日","02-11日","02-12日","02-13日","02-14日","02-15日","02-16日","02-17日","02-18日","02-19日","02-20日","02-21日","02-22日","02-23日","02-24日","02-25日","02-26日","02-27日","02-28日","03-01日","03-02日","03-03日","03-04日","03-05日","03-06日","03-07日","03-08日","03-09日","03-10日","03-11日"]

					this.Histogram(datalist, alalmdate); //调用柱					
					this.subscriptchange(datalist.length); //柱状图下标移动
				})
			},
			subscriptchange(length) {
				var _this = this;
				this.myChart.on('click', function(params) {//柱状图点击事件
					_this.subIndex = params.dataIndex;
					_this.setoption();
					_this.setInterval(length);
				});
				this.myChart.on('mouseover', function(params) {//柱状图点击事件
					clearInterval(subscript);
				});
				this.myChart.on('mouseout', function(params) {//柱状图点击事件
					_this.setInterval(length);
				});
				this.setInterval(length);
			},
			setInterval(length){
				var _this = this;
				clearInterval(subscript);
				this.myChart.dispatchAction({
				  type: 'showTip',
				  seriesIndex:0 ,//第几条series
				  dataIndex: _this.subIndex,//第几个tooltip
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
				  seriesIndex:0 ,//第几条series
				  dataIndex: _this.subIndex,//第几个tooltip
			   });
			},
			Histogram(datalist, alalmdate) {
				var _this = this;
				var option = {
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						alwaysShowContent:true,
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '0%',
						right: '0%',
						top: '3%',
						bottom: '0%',
						containLabel: true
					},
					textStyle: {
						color: '#31859C',
						fontSize: 12
					},
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
							formatter:function(value){
			            		return value.substring(0,value.length-1)
			            	},
							textStyle: {color: "#31859C"}
						}
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							textStyle: {color: "#31859C"}
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
						barWidth: 10,
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
			},
			Piechart(piecount) {
				var _this = this;
				var img=require('../../../../static/images/img4.png');
				var rich ={
                	a:{
                		fontWeight:'bold',
                		fontSize:14,
                		color:'#00FFFF',
                		padding:[8,0,8,12],
                		align:'left',
                		fontFamily:'DIN Medium'
                	},
                	b:{
                		color:'#75CBF2',
                		fontSize:14,
                		padding:[8,12,8,8],
                		align:'right',
                		fontFamily:"DIN Medium"
                	},
                	c:{
                		color:'#75CBF2',
                		fontSize:12,
                		padding:[8,12],
                		align:'center',
                	},
                	d:{
                		width:'100%',
						height:3,
						backgroundColor: {
                            image: img
                       }
                	},
                	e:{
                		color:'#00FFFF',
                		align:'left',
                		padding:[0,5,0,0]
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
						radius: '50%',
						center: ['50%', '55%'],
						color:['#0478B7','#D45079','#52A6A2','#2189AF','#ED7703'],
						labelLine:{
			            	lineStyle:{
			            		color:'#75CBF2',
			            	}
			            },
						label: {
							normal: {
								color:'#75CBF2',
				            	fontSize:12,
				            	formatter:'{a|{c}}{e|次} {b|{d}%}\n{d|}\n{c|{b}}',
//								formatter:'{b}{d}%',
	                            borderColor: '#195E7F',
	                            borderWidth: 1,
	                            backgroundColor:'#001626',
	                            align: 'center',
								rich: rich //设置文字与下滑线
							},
						},
						emphasis:{
			            	label:{
			            		borderColor: '#00ffff',
			            	}
				        },
						data: [
							{
								value: piecount.linkageAlarm,
								name: '穿戴违规'
							},
							{
								value: piecount.cloudControl,
								name: '禁区出现老鼠'
							},
							{
								value: piecount.schoolControl,
								name: '非工作人员闯入'
							},
							{
								value: piecount.motionDetection,
								name: '水资监测告警'
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
	.h-container{
		height: 100%;
		position: relative;
		.AlarmTitle{
		    color: #75CBF2;
		}
	}
	#Lbuttom{
		position: absolute;
		top: 35px;
		bottom: 0px;
		left: 0px;
		right: 0px;
	}
</style>