<template>
	<div class="h-container">
		<div class="h-title">
			<span class="boxtitle">车流分析</span>
			<div class="fr h-tip">
				<span>
					<span>当日入校车辆数</span><b class="Z-numberf">{{total.enterCount}}</b>
				</span>
				<span>
					<span>实时校内车辆数</span><b class="Z-numberf">{{total.stayCount}}</b>
				</span>
			</div>			
		</div>
		<div class="h-content backboxContainer">
			<div class="fr h-time-c">
				<a @click="operate(1)" :class="{'active':curr==1}">最近24小时</a>
				<a @click="operate(2)" :class="{'active':curr==2}">最近30天</a>
			</div>
			<div class="chart" ref="chart">
				
			</div>
		</div>
	</div>
</template>

<script>
	var mTime,cancel;
	export default {
		data(){
			return {
				curr:1,//当前选中项，30天/12个月
				lists:[],//数据
				total:{},//统计数据
				lastDate:Date.now()
			}
		},
		mounted(){
			this.getList(this.lastDate);
		},
		methods:{
			//切换30天/12个月
			operate(i){
				this.curr=i;
				this.lastDate=Date.now();
				this.getList(this.lastDate);
			},
			//获取数据
			getList(lastDate){
				var vm=this;
				var CancelToken = this.$axios.CancelToken;
				if(vm.curr==1){
					var req='traffic/pass/traffic24Hour';
				}else{
					var req='traffic/pass/traffic30Day';
				}
				this.$axios.post(req).then(function(res){
					var data=res.countList;
					if(lastDate==vm.lastDate){
						vm.supplyData(data);
					}
				})
			},
			//完善数据
			supplyData(data){
				var vm=this,data1=[],data2=[],times=[],sum=0;
				var sDate = new Date();
				if(vm.curr==1){
					sDate.setHours(sDate.getHours() - 22);
				}else{
					sDate.setDate(sDate.getDate() - 29);
				}
				sDate = new Date(sDate);
				var eDate = new Date();
				eDate.setHours(eDate.getHours()+1);
				var state=false;
				var zeroPoint=(new Date().Format("yyyy-MM-dd")) + " 01";
				for (var vdate = new Date(sDate); vdate <= eDate;vm.curr==1?vdate.setHours(vdate.getHours() + 1):vdate.setDate(vdate.getDate() +1)) {
				    var vtime = vm.curr==1?vdate.Format("yyyy-MM-dd hh"):vdate.Format("yyyy-MM-dd");
				    var enterCount = 0;
				    var stayCount = 0;
				    for (var idx = 0, len = data.length; idx < len; idx++) {
				      if (vtime == data[idx].passTime) {
					        enterCount = data[idx].enterCount;
					        stayCount = data[idx].stayCount;
				        	break;
				      }
				    }
				    times.push(vm.curr==1?(vdate.Format("hh")+'时'):(vdate.Format("MM-dd")+'日'));
//				    console.log(vtime+';'+eDate.Format("yyyy-MM-dd") + " 01"+';'+(vtime >=zeroPoint ))
				    if(vm.curr == 1 && vtime >= zeroPoint){
				    	sum+=enterCount;
				    }
				    data1.push(enterCount);
				    data2.push(stayCount)
				}
				if(vm.curr==1){
					vm.total={
						enterCount:sum,
						stayCount:data2[data2.length-1]
					};
				}else{
					vm.total={
						enterCount:data1[data1.length-1],
						stayCount:data2[data2.length-1]
					};
				}
//				vm.$nextTick(function(){
					vm.initchart(times,data1,data2)
//				})
			},
			//初始化图表
			initchart(times,data1,data2){
				var vm=this;
				if(vm.$refs.chart){
					var chart=echarts.init(vm.$refs.chart);
					chart.setOption(vm.getOption(times,data1,data2));
					allCharts.push(chart);
					var index = 0; //播放所在下标  
					clearInterval(mTime);
			    	mTime = setInterval(function() {
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
				}
			},
			//折线图
			getOption(legends,datas1,datas2){
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
				    	show:true,
				    	icon:'rect',
				    	align:'left',
				    	itemWidth:4,
				    	itemHeight:12,
				    	left:0,
				    	top:0,
				    	textStyle:textStyleC,
				    },
				    textStyle:{
				    	color:'#31859C',
				    	fontSize:0.7*fontSize,
				    },
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
				            splitLine:{
				            	show:true,
				            	lineStyle:{
				            		color:'rgba(111,191,203,0.1)'
				            	}
				            },
				            axisLabel:{
				            	rotate:50,
								textStyle:textStyleC,
				            	formatter:function(value,index){
				            		if(index==datas1.length-1){
				            			return '';
				            		}
				            		return value.substring(0,value.length-1);
				            	}
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
							axisLabel:{
								textStyle:textStyleC,
							},
				            axisTick: {
				                show: false
				            },
				            splitLine:{
				            	lineStyle:{
				            		color:'rgba(111,191,203,0.1)'
				            	}
				            },
				            axisPointer:{
				            	show:false
				            }
				        }
				    ],
				    series : [
				        {
				            name:'入校车辆',
				            type:'line',
				            areaStyle: {
				            	color: {
								    type: 'linear',
								    x: 0,
								    y: 0,
								    x2: 0,
								    y2: 1,
								    colorStops: [{
								        offset: 0, color: 'rgba(255, 87, 69, 1)' // 0% 处的颜色
								    }, {
								        offset: 0.5, color: 'rgba(255, 87, 69, 0.8)' // 0% 处的颜色
								    },{
								        offset: 0.8, color: 'rgba(255, 87, 69, 0.5)' // 0% 处的颜色
								    },{
								        offset: 1, color: 'rgba(255, 87, 69, 0.2)' // 0% 处的颜色
								    }],
								    global: false // 缺省为 false
								}
				            },
				            symbol:'none',
				            smooth:true,
				            data:datas1
				        },
				        {
				            name:'校内车辆',
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
				            data:datas2
				        },
				    ]
				}
			},
		}
	}
</script>

<style scoped="scoped">
.boxtitle{
	color:#75CBF2;
}
.chart{
	height: 100%;
	position: relative;
	z-index: 3;
}
.h-tip{
	margin-top: -3px;
}
.h-tip span span{
	font-size: 0.7rem;
	color: #75cbf2;
	margin-left: 0.5rem;
}
.h-tip *{
	vertical-align: middle;
}
.h-tip span i{
	display: inline-block;
	width: 14px;
	height: 10px;
	background: red;
	border-radius: 2px;
	margin-right: 4px;
}
.h-tip span b{
	font-size: 1rem;
	color: #00FFFF;
	margin-left: 0.15rem;
}
.h-content{
	position: relative;
}
.h-time-c{
	top: 0px !important;
	right: 0px !important;
}
</style>