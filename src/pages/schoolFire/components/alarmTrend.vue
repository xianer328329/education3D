<template>
	<div class="alarmTrend">
  		<h4 class="mdTitle">告警趋势</h4>
		<div class="h-time-c">
				<a @click="getAlarmTrend24Hour()" :class="{'active':act==1}">最近24小时</a>
				<a @click="getAlarmTrend30Day()" :class="{'active':act==2}">最近30天</a>
		</div>
		<div id="Z-XFGKline" class="backboxContainer"></div>
	</div>
</template>

<script>
/* eslint-disable */
var mTime = null;
export default {
  name: 'alarmTrend',
  data(){
  	return {
  		act:1,
  		alarmList:{
  		title:"",
  		BJdata1:[],//火警
	 	BJdata2:[],//预警
	 	color:['#A02923','#ff8400','rgba(255,132,0,0)','rgba(255,132,0,0)'],
	 	name:['火警','预警'],
	 	oxAxis:[],
	 	oMax:function(value) {
 		return value.max;
		},
	 	Yname:"次",
	    leg:true,
	    y:50
  	},
  	}
  },
  methods:{
 	getAlarmTrend24Hour(){//报警趋势折线图24小时 请求接口
	this.$axios.post('fire/fire/alarmTrend24Hour',{emulateJSON: true})
	.then(this.alarmTrend24HourSucc)
	},
	alarmTrend24HourSucc(res){//报警趋势折线图24小时 接收函数
		this.act=1;
		this.alarmList.oxAxis=[];
  		this.alarmList.data1=[];
  		this.alarmList.data2=[];
  		this.alarmList.name=['火警','预警'];
  		this.alarmList.title="24小时"
  		var earlyWarning=res.earlyWarning;//预警
  		var fireAlarm=res.fireAlarm;//火警
  		var eDate = new Date();
		hours24DataC(earlyWarning,'date','num','num',this.alarmList)
		this.alarmList.oxAxis=[];
		this.alarmList.data1=[];
		hours24DataC(fireAlarm,'date','num','num',this.alarmList)
		this.LineData('Z-XFGKline',this.alarmList);
	},
	getAlarmTrend30Day(){//报警趋势折线图30天 请求接口
	this.$axios.post('fire/fire/alarmTrend30Day',{emulateJSON: true})
	.then(this.alarmTrend30DaySucc)
	},
	alarmTrend30DaySucc(res){//报警趋势折线图30天 接收函数
		this.act=2;
		this.alarmList.oxAxis=[];
  		this.alarmList.data1=[];
  		this.alarmList.data2=[];
  		this.alarmList.name=[' 火警',' 预警'];
  		this.alarmList.title="";
  		var earlyWarning=res.earlyWarning;//预警
  		var fireAlarm=res.fireAlarm;//火警
  		var eDate = new Date();
		day30DataC(earlyWarning,'date','num','num',this.alarmList)
		this.alarmList.oxAxis=[];
		this.alarmList.data1=[];
		day30DataC(fireAlarm,'date','num','num',this.alarmList)
		this.LineData('Z-XFGKline',this.alarmList);
	},
  
//绑定折线图

LineData (Id,alarmList) {
  		
		var myChart = echarts.init(document.getElementById(Id));
		myChart.setOption(LineChart(alarmList),true);
		allCharts.push(myChart);
		var index = 0; //播放所在下标  
		clearInterval(mTime);
    	mTime = setInterval(function() {
    		myChart.dispatchAction({  
        		type: 'showTip',  
        		seriesIndex: 0,  
        		dataIndex: index  
        	});  
        	index++; 
        	if(index>alarmList.data1.length){ 
         		index = 0;  
        	}  
    	},3000); 
  	},
  },
  mounted:function(){
	this.getAlarmTrend24Hour()
  },
}
</script>

<style lang="stylus" scoped>
#Z-XFGKline{position:relative; z-index: 3;}
</style>
