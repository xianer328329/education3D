<template>
	<div class="h-container">
		<h4 class="boxtitle">告警分析</h4>
		<div class="fr h-time-c">
			<a @click="operate(1)" :class="{'active':curr==1}">最近30天</a>
			<a @click="operate(2)" :class="{'active':curr==2}">最近12个月</a>
		</div>
		<div class="h-content">
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
				curr:1,//当前选中项，30天/12个月
				lists:[],//数据
				selIndex:0,//当前柱状图选中的索引
			}
		},
		mounted(){
			this.getList();
		},
		methods:{
			//切换30天/12个月
			operate(i){
				this.curr=i;
				this.selIndex=0;
				this.getList();
			},
			//获取数据
			getList(){
				var vm=this;
				if(vm.curr==1){
					var req='traffic/pass/alarm30Day';
				}else{
					var req='traffic/pass/alarm12Month';
				}
				this.$axios.post(req).then(function(res){
					vm.supplyData(res.list);
				})
			},
			//完善数据
			supplyData(data){
				var vm=this,arr=[];
				var sDate = new Date();
				if(vm.curr==1){
					sDate.setDate(sDate.getDate() - 29);
				}else{
					sDate.setMonth(sDate.getMonth() - 11);
				}
				sDate = new Date(sDate);
				var eDate = new Date();
				for (var vdate = new Date(sDate); vdate <= eDate;vm.curr==1?vdate.setDate(vdate.getDate() + 1):vdate.setMonth(vdate.getMonth() +1)) {
				    var vtime = vm.curr==1?vdate.Format("yyyy-MM-dd"):vdate.Format("yyyy-MM");
				    var sensitive = 0;
				    var localControl = 0;
				    var internalIllegality = 0;
				    var foreignIllegality = 0;
				    var cloudControl=0;
				    for (var idx = 0, len = data.length; idx < len; idx++) {
				      if (vtime == data[idx].alarmTime) {
				        sensitive = data[idx].sensitive;
				        localControl = data[idx].localControl;
				        cloudControl=data[idx].cloudControl;
				        internalIllegality = data[idx].internalIllegality;
				        foreignIllegality = data[idx].foreignIllegality;
				        break;
				      }
				    }
				    arr.push({
				    	alarmTime:vm.curr==1?(vdate.Format("MM-dd")+'日'):(vdate.Format("MM")+'月'),
				    	sensitive:sensitive,
				    	localControl:localControl,
				    	cloudControl:cloudControl,
				    	internalIllegality:internalIllegality,
				    	foreignIllegality:foreignIllegality
				    });
				}
				vm.lists=arr;
				vm.$nextTick(function(){
					vm.initchart(vm.lists)
				})
			},
			//初始化图表
			initchart(data){
				var vm=this;
				var chart1=echarts.init(vm.$refs.chart1);
				var chart2=echarts.init(vm.$refs.chart2);
				chart1.setOption(vm.getOption1(data.length>0?data[0]:[]));
				chart2.setOption(vm.getOption2(data));
				allCharts.push(chart1,chart2);
				vm.setInterval(data,chart1,chart2);
				//柱状图添加点击事件
				chart2.on('click', function (params) {
				    vm.selIndex=params.dataIndex;
				    vm.changeData(chart1,chart2);
				});
				chart2.on('mouseover', function(params) {//柱状图点击事件
					clearInterval(mTime);
				});
				chart2.on('mouseout', function(params) {//柱状图点击事件
					vm.setInterval(data,chart1,chart2);
				});
			},
			setInterval(data,chart1,chart2){
				var vm=this;
				chart2.dispatchAction({
				  type: 'showTip',
				  seriesIndex:0 ,//第几条series
				  dataIndex: vm.selIndex,//第几个tooltip
			    });
				clearInterval(mTime);
		    	mTime = setInterval(function() {
		        	vm.selIndex++;  
		        	if(vm.selIndex>=data.length){ 
		        		vm.selIndex = 0;  
		         	} 
	         		vm.changeData(chart1,chart2);
		    	}, 3000); 
			},
			changeData(chart1,chart2){
				var vm=this;
				//切换柱状图选中效果
			    chart2.setOption({
			    	series :[
				        {
				            itemStyle:{
				            	normal:{  
				　　　　　　　　　　//当前选中的柱子使用亮色，其余的使用基本颜色
				                   color: function (param){
				                       return (vm.selIndex==param.dataIndex)?'#FF9900':'#D04A4A';
				                   }
				               },
				           },
				        }
				    ]
			    });
			    chart2.dispatchAction({
				  type: 'showTip',
				  seriesIndex:0 ,//第几条series
				  dataIndex: vm.selIndex,//第几个tooltip
			    });
			    var data=vm.lists[vm.selIndex];
			    //切换饼图数据
			    chart1.setOption({
			    	series :[
				        {
				           data:[
				              {
				              	value:data.localControl, 
				              	name:'车辆本校布控',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c1|}{c|'+params.data.name+'}'
//				            			return '{a|{c}}{e|次} {b|{d}%}\n{d|}\n{c|{b}}'
				            		}
				             	}
				              },
				              {
				              	value:data.cloudControl, 
				              	name:'车辆联防布控',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c2|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.foreignIllegality, 
				              	name:'高频违法驶入',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c3|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.sensitive, 
				              	name:'敏感车辆驶入',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c4|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.internalIllegality, 
				              	name:'校内违法车辆',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c5|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				            ]
				        }
				    ]
			    });
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
						height:3,
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
                		borderWidth:2,
                		borderColor:'#0478B7',
                	},
                	c2:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:2,
                		borderColor:'#D45079',
                	},
                	c3:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:2,
                		borderColor:'#52A6A2',
                	},
                	c4:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:2,
                		borderColor:'#2189AF',
                	},
                	c5:{
                		align:'right',
                		width:1,
                		height:0.5*fontSize,
                		borderWidth:2,
                		borderColor:'#ED7703',
                	},
                }
				return {
				     tooltip: {
				     	show:false,
				        trigger: 'none',
						textStyle:tooltipTextStyle
				    },
					color:['#0478B7','#D45079','#52A6A2','#2189AF','#ED7703'],
				    series: [
				        {
				            name:'',
				            type:'pie',
				            radius: '50%',
				            center:['50%','60%'],
				            hoverOffset:2,
//				            avoidLabelOverlap:false,
				            color:['#0478B7','#D45079','#52A6A2','#2189AF','#ED7703'],
				            label:{
				            	color:'#75CBF2',
				            	fontSize:0.7*fontSize,
	                            borderColor: '#195E7F',
	                            borderWidth: 1,
	                            backgroundColor:'#001626',
	                            align: 'center',
	                            padding:[0.5*fontSize,0.7*fontSize],
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
				              	value:data.localControl, 
				              	name:'车辆本校布控',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c1|}{c|'+params.data.name+'}'
//				            			return '{a|{c}}{e|次} {b|{d}%}\n{d|}\n{c|{b}}'
				            		}
				             	}
				              },
				              {
				              	value:data.cloudControl, 
				              	name:'车辆联防布控',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c2|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.foreignIllegality, 
				              	name:'高频违法驶入',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c3|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.sensitive, 
				              	name:'敏感车辆驶入',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c4|}{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.internalIllegality, 
				              	name:'校内违法车辆',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c5|}{c|'+params.data.name+'}'
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
				var legends=[],datas=[];
				data.forEach(function(value){
					legends.push(value.alarmTime);
					var count=0;
					for(var i in value){
						if(i!='alarmTime'){
							count+=value[i];
						}
					}
					datas.push(count);
				});
				return {
				    color: ['#3398DB'],
				    tooltip : {
				        trigger: 'axis',
				        alwaysShowContent:true,
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        },
						textStyle:tooltipTextStyle
				    },
				    grid: {
				        left: '0%',
				        right: '0%',
				        top:8,
				        bottom: '0%',
				        containLabel: true
				    },
				    textStyle:textStyleC,
				    xAxis : [
				        {
				            type : 'category',
				            data : legends,
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
				            	rotate:60,
								textStyle:textStyleC,
				            	formatter:function(value){
				            		return value.substring(0,value.length-1)
				            	}
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            minInterval:1,
				            splitLine:{
				            	show:false
				            },
				            axisTick: {
				                show: false
				            },
							axisLabel:{
								textStyle:textStyleC,
							},
				            axisLine:{
				            	lineStyle:{
				            		color:'rgba(49, 133, 156,0.5)',
				            	}
				            },
				        }
				    ],
				    series :[
				        {
				            name:'告警数量',
				            type:'bar',
				            barMaxWidth:10,
				            itemStyle:{
				            	color:'#D04A4A',
				            	barBorderRadius: [4,4,0,0],
				            	normal:{  
				　　　　　　　　　　//当前选中的柱子使用亮色，其余的使用基本颜色
				                   color: function (param){
				                       return (vm.selIndex==param.dataIndex)?'#FF9900':'#D04A4A';
				                   },
								   barBorderRadius: [4,4,0,0],
				               },
				            },
				            emphasis:{
				            	label:{
				            		borderColor: '#00ffff',
				            	}
				            },
				            data:datas
				        }
				    ]
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
.boxtitle{
	color:#75CBF2;
}
.h-content{
	position: relative;
	height: 100%;
	margin-top: -1rem;
}
.chart1{
	position: absolute;
	left: 0px;
	bottom: 6.5rem;
	top: 0px;
	width: 100%;
	z-index: 2;
}
.chart2{
	position: absolute;
	left: 0px;
	bottom: 0px;
	width: 100%;
	height:6.5rem;
	z-index: 2;
}
</style>