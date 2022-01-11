<template>
	<div class="chart" ref="chart">
		
	</div>
</template>

<script>
	export default {
		name: '',//告警分析
		data(){
			return{
				mTime:'',
				index:0,
				timer:'',
				length:3,//循环几部分数据
			}
		},
		props:{
			'lists':{
				type:Array,
				'default':[]
			}
		},
		watch:{
			lists(newvalue){
				var obj={"a1":0,"a2":0,"a3":0};
				newvalue.forEach(value=>{
					if(value.alarmClass==1){
						obj.a1=value.count
					}else if(value.alarmClass==2){
						obj.a2=value.count
					}else if(value.alarmClass==0){
						obj.a3=value.count
					}
				});
				this.initPie(obj)
			},
			index(newvalue){
				if(newvalue>-2){
					this.$emit('changeBar',newvalue+1)
				}
			}
		},
		mounted: function() {
			
		},
		beforeDestroy(){
			clearInterval(this.mTime);
		},
		methods:{
			initPie(data){
				var vm=this;
				var chart=echarts.init(vm.$refs.chart);
				chart.setOption(vm.getOption(data));
				allCharts.push(chart);
				vm.bindHighLight(chart,-1);
				vm.bindEvent(chart);
			},
			//饼图高亮显示
			bindHighLight(myChart,index){
				var vm=this;
				clearInterval(vm.timer);
	            vm.index=index;
				if(vm.index==-1){
				   myChart.dispatchAction({
				        type: 'highlight',
				        seriesIndex: 0,
				   });
				}else{
					myChart.dispatchAction({
				        type: 'highlight',
				        seriesIndex: 0,
				        dataIndex:vm.index
				    });
				}
            	this.timer=setInterval(function(){
            		//当检测到鼠标悬停事件，取消默认选中高亮
					myChart.dispatchAction({
				        type: 'downplay',
				        seriesIndex: 0,
				   });
				    if(vm.index==vm.length-1){
				    	vm.index=-2;
				    }
				    vm.index++;
				    if(vm.index==-1){
						myChart.dispatchAction({
					        type: 'highlight',
					        seriesIndex: 0,
					   });
					}else{
						myChart.dispatchAction({
					        type: 'highlight',
					        seriesIndex: 0,
					        dataIndex:vm.index
					    });
					}
	            },50000)   
			},
			//绑定饼图事件
			bindEvent(myChart){
				var vm=this;
				myChart.on('mouseover', function(e) {
	            	clearInterval(vm.timer);
					//当检测到鼠标悬停事件，取消默认选中高亮
					myChart.dispatchAction({
				        type: 'downplay',
				        seriesIndex: 0,
				   });
					//高亮显示悬停的那块
				    myChart.dispatchAction({
				        type: 'highlight',
				        seriesIndex: 0,
				        dataIndex: e.dataIndex
				    });
				    vm.index=e.dataIndex;
				});
				//检测鼠标移出后显示之前默认高亮的那块
				myChart.on('mouseout', function(e) {
				    vm.bindHighLight(myChart,e.dataIndex);
				});
			},
			//饼图
			getOption(data){
				var img=require('../../../../../static/images/img4.png');
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
                		padding:[0,0,0,0.25*fontSize],
                		width:3.5*fontSize,
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
                }
				return {
				     tooltip: {
				     	show:false,
				        trigger: 'none',
				    },
					color:['#52A6A2','#2189AF','#0478B7'],
				    series: [
				        {
				            name:'',
				            type:'pie',
				            radius: '50%',
				            center:['50%','55%'],
				            hoverOffset:2,
				            color:['#52A6A2','#2189AF','#0478B7'],
				            label:{
				            	color:'#75CBF2',
				            	fontSize:0.6*fontSize,
	                            borderColor: '#195E7F',
	                            borderWidth: 1,
	                            backgroundColor:'#001626',
	                            align: 'center',
	                            padding:[0.5*fontSize,0.6*fontSize],
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
				              	value:data.a1, 
				              	name:'非法接入',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.a2, 
				              	name:'设备离线',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				              {
				              	value:data.a3, 
				              	name:'动环监测',
				              	label:{
				              		formatter:function(params){
				            			return '{a|'+params.data.value+'}{e|次} {b|'+params.percent+'%}\n'+'{d|}\n{line|}\n{c|'+params.data.name+'}'
				            		}
				             	}
				              },
				            ]
				        }
				    ]
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.chart{
		height: 100%;
	}
</style>