<template>
	<div>
		<h4 class="mdTitle">学生信息分析</h4>
		<h4 class="mdTitle">民族占比</h4>
		<div class="h-container">
			<div class="chart1" ref="chart1">
				
			</div>
			<div class="chart2" ref="chart2">
				
			</div>
		</div>
	</div>
</template>

<script>
	var mTime;
	export default {
		data(){
			return {
				lists:[],//数据
				selIndex:0,//当前柱状图选中的索引
			}
		},
		mounted(){
			this.getList();
		},
		methods:{
			//获取数据
			getList(){
				var vm=this;
				var req='traffic/pass/alarm30Day';
				this.$axios.post(req).then(function(res){
					var data={
						legends:['留学生','汉族','少数名族'],
						data:[{
							name:'留学生',
							value:20,
						},{
							name:'汉族',
							value:20,
						},{
							name:'少数名族',
							value:20,
						}]
					}
					vm.initPie(data);
					
					var data={
						legends:['土家族','回族','苗族','白族','彝族'],
						data:[5,10,15,20,250]
					}
					vm.initBar(data);
				})
			},
			//初始化柱状图
			initBar(data){
				var vm=this;
				var chart2=echarts.init(vm.$refs.chart2);
				chart2.setOption(vm.getOption2(data));	
				allCharts.push(chart2);
			},
			//初始化饼图
			initPie(data){
				var vm=this;
				var chart1=echarts.init(vm.$refs.chart1);
				chart1.setOption(vm.getOption1(data));
				allCharts.push(chart1);
			},
			//饼图
			getOption1(data){
				var img=require('../../../../static/images/img4.png');
				var rich={
                	a:{
                		fontWeight:'bold',
                		fontSize:0.7*fontSize,
                		color:'#00FFFF',
                		padding:[0.25*fontSize,0,0,0],
                		align:'left',
                		fontFamily:'DIN Medium'
                	},
                	b:{
                		color:'#75CBF2',
                		fontSize:0.7*fontSize,
                		padding:[0.25*fontSize,0,0,0],
                		align:'right',
                		fontFamily:"DIN Medium"
                	},
                	c:{
                		color:'#75CBF2',
                		fontSize:0.6*fontSize,
                		align:'center',
                		padding:[0,0,0,0.25*fontSize]
                	},
                	d:{
                		width:'100%',
						height:0.15*fontSize,
						backgroundColor: {
                            image: img
                       }
                	},
                	e:{
                		color:'#00FFFF',
                		align:'left',
                		padding:[0.25*fontSize,0,0,0]
                	},
                	line:{
                		width:'100%',
                		height:0.4*fontSize,
                	},
                	c1:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:0.1*fontSize,
                		borderColor:'#0478B7',
                	},
                	c2:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:0.1*fontSize,
                		borderColor:'#D45079',
                	},
                	c3:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:0.1*fontSize,
                		borderColor:'#52A6A2',
                	},
                	c4:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:0.1*fontSize,
                		borderColor:'#2189AF',
                	},
                	c5:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:0.1*fontSize,
                		borderColor:'#ED7703',
                	},
                }
				return {
				     tooltip: {
				     	show:false,
				        trigger: 'none',
				    },
					color:['#0478B7','#D45079','#52A6A2','#2189AF','#ED7703'],
				    series: [
				        {
				            name:'',
				            type:'pie',
				            radius: '40%',
				            center:['50%','50%'],
				            hoverOffset:2,
				            color:['#0478B7','#D45079','#52A6A2','#2189AF','#ED7703'],
				            label:{
				            	color:'#75CBF2',
				            	fontSize:12,
	                            borderColor: '#195E7F',
	                            borderWidth: 1,
	                            backgroundColor:'#001626',
	                            align: 'center',
	                            padding:[5,5],
	                            rich:rich
				            },
				            emphasis:{
				            	label:{
				            		borderColor: '#00ffff',
				            	}
				            },
				            labelLine:{
				            	lineStyle:{
				            		color:'#75CBF2',
				            	}
				            },
				            data:[
				              {
				              	value:data.data[0].value, 
				              	name:data.data[0].name,
				              	label:{
				              		formatter:function(params){
				            			return '{b|'+params.percent+'%} {a|'+params.data.value+'}{e|人} \n'+'{d|}\n{line|}\n{c1|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.data[1].value, 
				              	name:data.data[1].name,
				              	label:{
				              		formatter:function(params){
				            			return '{b|'+params.percent+'%} {a|'+params.data.value+'}{e|人}\n'+'{d|}\n{line|}\n{c2|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.data[2].value, 
				              	name:data.data[2].name,
				              	label:{
				              		formatter:function(params){
				            			return '{b|'+params.percent+'%} {a|'+params.data.value+'}{e|人}\n'+'{d|}\n{line|}\n{c3|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				            ]
				        }
				    ]
				}
			},
			//柱状图
			getOption2(data){
				var vm=this;
				return {
				    color: ['#3398DB'],
				    tooltip : {
				        trigger: 'axis',
//				        alwaysShowContent:true,
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				        left: '0%',
				        right: '5%',
				        top:'6%',
				        bottom: '0%',
				        containLabel: true
				    },
				    textStyle:{
				    	color:'#31859C',
				    	fontSize:0.7*fontSize
				    },
				    xAxis : [
				        {
				            type : 'value',
				            minInterval:1,
				            max:function(value){
				            	return Math.ceil(value.max*1.5)
				            },
				            splitNumber:5,
				            axisLine:{
				            	lineStyle:{
				            		color:'rgba(49, 133, 156,0.5)',
				            	}
				            },
				            axisTick: {
				                show: false
				            },
				            splitLine:{
				            	show:false
				            },
				            axisLabel:{
//				            	rotate:60,
								fontSize:0.7*fontSize,
								align:'right'
				            }
				        }
				    ],
				    yAxis : [
				        {
				        	type : 'category',
				            data : data.legends,
				            splitLine:{
				            	show:false
				            },
				            axisTick: {
				                show: false
				            },
				            axisLine:{
				            	lineStyle:{
				            		color:'rgba(49, 133, 156,0.5)',
				            	}
				            },
				            axisLabel:{
//				            	rotate:60,
								fontSize:0.7*fontSize,
				            }
				        }
				    ],
				    series :[
				        {
				            name:'人数',
				            type:'bar',
				            barWidth:1.25*fontSize,
				            itemStyle:{
				            	color:'#135E81',	
				            },
				            label:{
		     	            	show:true,
		     	            	position:'right',
		     	            	color:'#00FFFF'
				            },
				            data:data.data
				        }
				    ]
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
.mdTitle{
	width: 50%;
	float: left;
}
.h-container{
	font-size: 0px;
	height: calc(100% - 2rem);
}
.boxtitle{
	color:#75CBF2;
	margin-bottom: 10px;
	display: inline-block;
}
.h-time-c{
	top: 8px !important;
}

.chart1{
	float: left;
	width:55%;
	height: 100%;
	z-index: 2;
}
.chart2{
	float: left;
	width:45%;
	height: 100%;
	z-index: 2;
}
</style>