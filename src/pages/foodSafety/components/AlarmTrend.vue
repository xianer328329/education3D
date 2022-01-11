<template>
	<div>
		<h4 class="AlarmTitle">告警趋势</h4>
		<div class="situation">
			<div class="h-time-c">
				<a :class="{'active':index==1}" @click='getalarmTrenddata(1)'>最近30天</a>
				<a :class="{'active':index==2}" @click='getalarmTrenddata(2)'>最近12个月</a>
			</div>
			<div class="A-Slide">
				<ul>
					<li>
						<div class="fl">
							<div class="A-left">
								<div class="A-lefttitle"><span>{{alarmtitle}}</span><i class="fr">12<span class="ma">次</span></i></div>
								<div class="A-lefttitle spacing"><span>上年告警累计</span><i class="fr">97<span class="ma">次</span></i></div>
							</div>
							<div id="Lbuttom"></div>
						</div>
						<div id="Lright"></div>
					</li>
					<li></li>
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
				alarmtitle:"",//标题
				index: 1, //点击事件下标
				subIndex: 0, //图标移动下标
				myChart: '', //柱状图
				piemyChart: '', //饼图
				alarmtotal: 0, //最近30天总告警
				cloudalarmcount:0,//人脸联防报警次数
				lists:[],
			}
		},
		mounted: function() {
			this.getalarmTrenddata(1);
		},
		methods: {
			getalarmTrenddata(index) {
				var url = '';
				var vm=this;
				this.subIndex=0;
				this.index = index;
				if(index == 1) {
					this.alarmtitle="本年告警累计"
					url = '/monitor/alarmTrend/' + UNITID + '?type=1';
				} else {
					this.alarmtitle="本年告警累计"
					url = '/monitor/alarmTrend/' + UNITID + '?type=2';
				}

				this.$axios.post(url).then((res) => {
					var data = res.data.data || [];

					var alalmdate = [];
					var datalist = [],
						cloudControl=0,
						sum=0,
						lists=[];
					var FormerDecember = this.getdate(index); //获取当前时间前12月
					FormerDecember.forEach((it) => {
						var alalmcount = 0,alarmTime=index == 1 ? (new Date(it).Format("MM-dd")+'日') :(new Date(it).Format("yyyy-MM")+'月'),state=true;
						data.forEach((item, inx) => {
							if(it == item.alarmTime) {
								state=false;
								lists.push(item);
								for(var i in item) {
									if(i != 'alarmTime') {
										if(i=='cloudControl'){
											cloudControl+=item[i];
										}
										alalmcount += item[i];
									}
								}
							}
						});
						if(state){
							lists.push({alarmTime:0,schoolControl:0,linkageAlarm:0,cloudControl:0,motionDetection:0,videoOcclusion:0})
						}
						sum+=alalmcount;
						alalmdate.push(alarmTime)
						datalist.push(alalmcount);
					});
					if(index == 1){
						lists=[{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-11","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-12","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-13","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":22,"alarmTime":"2019-02-14","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-15","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-16","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-17","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-18","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-19","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-20","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-21","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-22","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-23","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":8,"alarmTime":"2019-02-25","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-26","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":18,"alarmTime":"2019-02-27","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-28","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-03-01","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-03-02","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":8,"alarmTime":"2019-03-03","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-03-04","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-05","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":20,"alarmTime":"2019-03-06","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-08","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-03-10","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-11","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0}];
						datalist=[0,4,10,10,22,2,4,2,6,4,4,2,10,4,0,8,6,18,6,4,2,8,4,6,20,0,6,0,2,6];
						alalmdate=["02-10日","02-11日","02-12日","02-13日","02-14日","02-15日","02-16日","02-17日","02-18日","02-19日","02-20日","02-21日","02-22日","02-23日","02-24日","02-25日","02-26日","02-27日","02-28日","03-01日","03-02日","03-03日","03-04日","03-05日","03-06日","03-07日","03-08日","03-09日","03-10日","03-11日"]

					}else{
						lists=[{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-11","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-12","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-13","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":22,"alarmTime":"2019-02-14","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-15","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-16","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-17","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-18","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-19","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-20","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-02-21","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":10,"alarmTime":"2019-02-22","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-02-23","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":8,"alarmTime":"2019-02-25","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-26","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":18,"alarmTime":"2019-02-27","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-02-28","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-03-01","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-03-02","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":8,"alarmTime":"2019-03-03","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":4,"alarmTime":"2019-03-04","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-05","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":20,"alarmTime":"2019-03-06","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-08","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"alarmTime":0,"schoolControl":0,"linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":2,"alarmTime":"2019-03-10","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0},{"schoolControl":6,"alarmTime":"2019-03-11","linkageAlarm":0,"cloudControl":0,"motionDetection":0,"videoOcclusion":0}]
						datalist=[0,4,10,10,22,2,4,2,6,4,4,2,10,4,0,8,6,18,6,4,2,8,4,6,20,0,6,0,2,6];
						alalmdate=["2018-04月","2018-05月","2018-06月","2018-07月","2018-08月","2018-09月","2018-10月","2018-11月","2018-12月","2019-01月","2019-02月","2019-03月"];
					}
					this.lists=lists;
					this.Histogram(datalist, alalmdate); //调用柱					
					this.cloudalarmcount=cloudControl;//人脸云端联防报警次数
					this.alarmtotal =sum;//最近30天总告警
					this.subscriptchange(datalist.length); //柱状图下标移动
				})
			},
			subscriptchange(length) {
				var _this = this;
				this.piemyChart = echarts.init(document.getElementById("Lright"));
				this.piemyChart.setOption(_this.Piechart(_this.lists[_this.subIndex]));//饼图
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
				this.piemyChart.setOption(_this.Piechart(_this.lists[_this.subIndex]));//饼图
			},
			getdate(index) { //获取最近30天或12个月 并存入数组
				var dataArr = [],len=index==2?12:30;
				var data = new Date();
				if(index==2){
					data.setMonth(data.getMonth()-11);
				}else{
					data.setDate(data.getDate()-29);
				}
				for(var i = 0; i <len; i++) {
					dataArr.push(index==1?data.Format('yyyy-MM-dd'):data.Format('yyyy-MM'))
					if(index==2){
						data.setMonth(data.getMonth() + 1); //每次循环一次 月份值减1
					}else{
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

<style lang="stylus" scoped>
	#Lright {
		float: left;
		height: 236px;
		width: 368px;
		margin-top: -20px;
	}
	
	#Lbuttom {
		margin-top: 20px;
		height: 160px;
		width: 524px;
	}
	
	.A-lefttitle {
		float: left;
		width: 230px;
		height: 40px;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		line-height: 40px;
		padding: 0px 10px 0px 10px;
	}
	
	.A-lefttitle span {
		font-size: 16px;
		font-family: "Microsoft YaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.ma {
		margin-left: 5px;
	}
	
	.A-lefttitle i {
		font-size: 22px;
		font-family: DIN-Medium;
		font-weight: 500;
		color: rgba(255, 204, 0, 1);
	}
	
	.spacing {
		margin-left: 10px;
	}
	
	.A-left {
		width: 524px;
		height: 46px;
	}
	
	.A-Slide {
		margin-top: 50px;
	}
	
	.situation {
		width: 100%;
		height: 280px;
		margin: 0 auto;
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
	.situation .h-time-c{
		top: 3px !important;
	}
	.AlarmTitle {
		font-size: 18px;
		font-family: "Microsoft Yahei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		position: absolute;
	}
</style>