<template>
	<div class="h-content">
		<div class="fr h-time-c">
			<a @click="operate(1)" :class="{'active':curr==1}">最近30天</a>
			<a @click="operate(2)" :class="{'active':curr==2}">最近12个月</a>
		</div>
		<div class="chart" ref="chart">
			
		</div>
	</div>
</template>

<script>
	export default {
		name: '',
		components: {//引入模块
			
		},
		data(){
			return{
				mTime:'',
				curr:1,
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
				this.supplyData(newvalue);
			}
		},
		mounted: function() {
			this.operate(1);
		},
		beforeDestroy(){
			clearInterval(this.mTime);
		},
		methods:{
			operate(type){
				this.curr=type;
				this.$emit('getInfo',type);
			},
			//完善数据
			supplyData(data){
				var vm=this,arr=[],times=[];
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
				    var count = 0;
				    for (var idx = 0, len = data.length; idx < len; idx++) {
				      if (vtime == data[idx].displayTime) {
					        count = data[idx].count;
				        	break;
				      }
				    }
				    times.push(vm.curr==1?vdate.Format("yyyy-MM-dd"):vdate.Format("yyyy-MM月"));
				    arr.push(count);
				}
				vm.initchart(times,arr)
			},
			//初始化图表
			initchart(times,data){
				var vm=this;
				var chart=echarts.init(vm.$refs.chart);
				chart.setOption(vm.getOption(times,data));
				allCharts.push(chart);
				var index = 0; //播放所在下标  
				clearInterval(vm.mTime);
		    	vm.mTime = setInterval(function() {
		    		try{
		    			chart.dispatchAction({  
			        		type: 'showTip',  
			        		seriesIndex: 0,  
			        		dataIndex: index  
			        	});  
			        	index++;  
			        	if(index>=times.length){ 
			        		index = 0;  
			         	} 
		    		}catch(e){
		    			console.log(e.message)
		    		} 
		    	},3000);
			},
			//折线图
			getOption(legends,datas){
				var vm=this;
				return {
					color : ['#ff5745','#a92035'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        },
						textStyle:tooltipTextStyle
				    },
				    legend:{
				    	show:false,
				    },
				    textStyle:textStyleC,
				    grid: {
				        left: '0%',
				        right: '1%',
				        top:45,
				        bottom: '0%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data :legends,
				            axisLine:{
				            	lineStyle:{
				            		color:'#6FBFCB',
				            	}
				            },
				            axisTick: {
				                show: false
				            },
				            axisLabel:{
				            	rotate:55,
				            	formatter:function(value,index){
				            		return value.substring(5);
				            	},
								textStyle:textStyleC,
				            },
				            axisPointer:{
				            	label:{
				            		show:false
				            	},
				            	lineStyle:{
				            		color:'#999999'
				            	}
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            minInterval:1,
				            min:0,
				            max:function(value){
				            	return value.max+20
				            },
				            axisLine:{
				            	lineStyle:{
				            		color:'#6FBFCB',
				            	}
				            },
				            axisTick: {
				                show: false
				            },
				            splitLine:{
				            	show:false,
				            	lineStyle:{
				            		color:'rgba(111,191,203,0.1)'
				            	}
				            },
							axisLabel:{
								textStyle:textStyleC,
							},
				            axisPointer:{
				            	show:false
				            }
				        }
				    ],
				    series : [
				        {
				            name:'告警次数',
				            type:'line',
				            areaStyle: {
				            	color: {
								    type: 'linear',
								    x: 0,
								    y: 0,
								    x2: 0,
								    y2: 1,
								    colorStops: [{
								        offset: 0, color: '#A92035' // 0% 处的颜色
								    }, {
								        offset: 0.2, color: 'rgba(182, 59, 46,0.7)' // 100% 处的颜色rgba(182, 59, 46, 1)
								    }, {
								        offset: 0.8, color: 'rgba(182, 59, 46,0.6)' // 100% 处的颜色
								    },{
								        offset: 1, color: 'rgba(255,255,255,0.1)' // 100% 处的颜色
								    }],
								    global: false // 缺省为 false
								}
				            },
				            symbol:'none',
				            smooth:true,
				            data:datas
				        },
				    ]
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.chart{
		height: 100%;
		position: relative;
		z-index: 3;
	}
</style>