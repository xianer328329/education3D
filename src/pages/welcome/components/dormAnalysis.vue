<template>
	<div>
		<h4 class="mdTitle">告警分析</h4>
		<div class="h-container">
			<div id="studentsNum" class="h-chart"></div>
			<div id="registTime" class="h-chart"></div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'dormAnalysis',
  data(){
  	return {
  		alarmList:{},
  	}
  },
  methods:{
  	LineData (Id,alarmList,type) {
  		var vm=this;
  		var mTime3 = null;
		var myChart = echarts.init(document.getElementById(Id));
		myChart.setOption(vm.LineChartN(alarmList,type),true);
		allCharts.push(myChart);
		var index = 0; //播放所在下标  
		clearInterval(mTime3);
    	mTime3 = setInterval(function() {
    		myChart.dispatchAction({  
        		type: 'showTip',  
        		seriesIndex: 0,  
        		dataIndex: index  
        	});  
        	index++; 
        	if(index>alarmList.data.length){ 
         		index = 0;  
        	}  
    	},3000); 
  	},
  	
  	alarmTrend(){
  			//this.$axios.post('fire/fire/home/alarmTrend',{emulataJSON:true})
  			//.then(this.alarmTrendSucc)
  			this.alarmTrendSucc()
  	},
  	alarmTrendSucc(){
		this.alarmList={
			title:'历年新生数量',
			"data": [135, 156, 154, 100, 89, 89, 75, 17, 14, 5, 2, 3, 3, 11, 53, 159, 342, 282, 201, 137, 130, 189, 203, 74],
			"oxAxis": ["17时", "18时", "19时", "20时", "21时", "22时", "23时", "00时", "01时", "02时", "03时", "04时", "05时", "06时", "07时", "08时", "09时", "10时", "11时", "12时", "13时", "14时", "15时", "16时"],
		};
		this.LineData('studentsNum',this.alarmList,1);
		
		this.alarmList={
			title:'报到时间',
			"data": [539, 384, 339, 302, 247, 224, 206, 196, 198, 198, 197, 198, 200, 206, 227, 280, 451, 578, 603, 540, 463, 494, 557, 568],
			"oxAxis": ["17时", "18时", "19时", "20时", "21时", "22时", "23时", "00时", "01时", "02时", "03时", "04时", "05时", "06时", "07时", "08时", "09时", "10时", "11时", "12时", "13时", "14时", "15时", "16时"],
		};
		this.LineData('registTime',this.alarmList,2);
  	},
  	LineChartN(alarmList,type) {
  		if(type==1){
  			var areaStyle={
            	color: {
				    type: 'linear',
				    x: 0,
				    y: 0,
				    x2: 0,
				    y2: 1,
				    colorStops: [{
				        offset: 0, color: 'rgba(3,255,252,0.5)' // 0% 处的颜色
				    },{
				        offset: 1, color: 'rgba(0,196,201,0.2)'
				    }],
				    global: false // 缺省为 false
				}
            }
  		}else{
  			var areaStyle={
            	color: {
				    type: 'linear',
				    x: 0,
				    y: 0,
				    x2: 0,
				    y2: 1,
				    colorStops: [{
				        offset: 0, color: 'rgba(204, 16, 16, 0.8)' 
				    },{
				        offset: 1, color: 'rgba(204, 16, 16,0.1)'
				    }],
				    global: false // 缺省为 false
				}
            }
  		}
		return {
			color :type==1?['#00FFFF']:['#FF1717'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross',
		            label: {
		                backgroundColor: '#6a7985'
		            }
		        }
		    },
		    textStyle:{
		    	color:'#31859C',
		    	fontSize:12,
		    },
		    grid: {
		        left: '3%',
		        right: '1%',
		        top:'20%',
		        bottom: '0%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data :alarmList.oxAxis,
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
		            	formatter:function(value,index){
		            		if(index==alarmList.data.length-1){
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
		        	name:alarmList.title,
		        	nameGap:10,
		        	nameTextStyle:{
		        		color:'#75CBF2'
		        	},
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
//		            name:alarmList.title,
		            type:'line',
		            areaStyle: areaStyle,
		            lineStyle:{
		            	width:3
		            },
		            symbol:'none',
		            smooth:true,
		            data:alarmList.data
		        },
		    ]
		}
	},
  },
  mounted:function(){
	this.alarmTrend();
	
	
  },
}
</script>

<style lang="scss" scoped>
.h-container{
	height: calc(100% - 2rem);
	margin-top: 0.5rem;
	.h-chart{
		height: 50%;
	}
}
</style>
