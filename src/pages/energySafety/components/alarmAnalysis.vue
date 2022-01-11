<template>
	<div>
  		<h4 class="mdTitle">告警分析</h4>
		<div id="alarmAnalysis"></div>
	</div>
</template>

<script>
/* eslint-disable */	
import axios from 'axios'

export default {
  name: 'IndexFire',
  data(){
  	return {
  		alarmList:{},
  	}
  },
  methods:{
  	LineData (Id,alarmList) {
  		var vm=this;
  		var mTime3 = null;
		var myChart = echarts.init(document.getElementById(Id));
		myChart.setOption(vm.LineChartN(alarmList),true);
		var index = 0; //播放所在下标  
		clearInterval(mTime3);
    	mTime3 = setInterval(function() {
    		myChart.dispatchAction({  
        		type: 'showTip',  
        		seriesIndex: 0,  
        		dataIndex: index  
        	});  
        	index++; 
        	if(index>alarmList.BJdata1.length){ 
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
			"BJdata1": [135, 156, 154, 100, 89, 89, 75, 17, 14, 5, 2, 3, 3, 11, 53, 159, 342, 282, 201, 137, 130, 189, 203, 74],
			"BJdata2": [539, 384, 339, 302, 247, 224, 206, 196, 198, 198, 197, 198, 200, 206, 227, 280, 451, 578, 603, 540, 463, 494, 557, 568],
			"oxAxis": ["17时", "18时", "19时", "20时", "21时", "22时", "23时", "00时", "01时", "02时", "03时", "04时", "05时", "06时", "07时", "08时", "09时", "10时", "11时", "12时", "13时", "14时", "15时", "16时"],
		};
		this.LineData('alarmAnalysis',this.alarmList);
		
  	},
  	LineChartN(alarmList) {
		return {
			color : ['#00FFFF','rgba(208, 74, 74, 1)'],
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
		    	fontSize:14,
		    },
		    grid: {
		        left: '0%',
		        right: '1%',
		        top:0,
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
		            		if(index==alarmList.BJdata1.length-1){
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
						        offset: 0, color: 'rgba(3,255,252,0.5)' // 0% 处的颜色
						    },{
						        offset: 1, color: 'rgba(0,196,201,0.2)'
						    }],
						    global: false // 缺省为 false
						}
		            },
		            lineStyle:{
		            	width:5
		            },
		            symbol:'none',
		            smooth:true,
		            data:alarmList.BJdata1
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
						        offset: 0, color: 'rgba(208, 74, 74, 0.4)' 
						    },{
						        offset: 1, color: 'rgba(208, 74, 74,0.1)'
						    }],
						    global: false // 缺省为 false
						}
		            },
		            lineStyle:{
		            	width:5
		            },
		            symbol:'none',
		            smooth:true,
		            data:alarmList.BJdata2
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
#alarmAnalysis{width:100%; height:233px; margin-top: 15px;}
.amountBoxUp .amount{height:66px; margin-bottom: 0px;}
.amountBoxUp .amount span{margin-top:-1px;}
</style>
