<template>
	<div class="h-container fire">
		<div class="h-section h-section1">
			<span class="mdTitle">告警趋势</span>
			<div class="fr h-time-c">
				<a @click="operate(1)" :class="{'active':curr==1}">最近24小时</a>
				<a @click="operate(2)" :class="{'active':curr==2}">最近30天</a>
			</div>
			<div class="chart" ref="chart"></div>
		</div>
		<div class="h-section h-section2">
			<h4 class="boxtitle">设备故障TOP10(最近90天)</h4>
			<el-table  :data="lists" class="h-table" stripe height="18rem"  @row-click="rowClick">
			    <el-table-column prop="deviceCode" label="设备ID" :show-overflow-tooltip="true"></el-table-column>
			    <el-table-column prop="deviceName" label="设备名称" :show-overflow-tooltip="true"></el-table-column>
			    <el-table-column prop="buildName" label="位置" :show-overflow-tooltip="true">
			    	<template slot-scope="scope">
			    		<!--<span class="h-text-overflow">{{scope.row.buildName}} {{scope.row.position}}</span>-->
			    		{{scope.row.buildName}} {{scope.row.position}}
			    	</template>
			    </el-table-column>
			    <el-table-column prop="alarmCount" label="次数" width="60" class="Z-numberf" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	var mTime;
	export default {
		data(){
			return {
				curr:1,//当前选中项，30天/24小时
				lists:[]
			}
		},
		mounted(){
			this.getFault();
			this.getList();
		},
		methods:{
			//点击行
			rowClick(row){
				var params={
					title:row.deviceName,			
					lon:row.longitude,													
					lat:row.latitude,
					wminValue:row.wminValue,			
					wmaxValue:row.wmaxValue,														
					valueUnit:row.valueUnit,														
					butCenter:'',														
					alarmDesc:row.alarmDesc,
					rows:{
						'楼宇':row.buildName,
						'位置':row['position'],															
						'告警设备':row.deviceName,
//						'事件':row.alarmDesc,
						'设备编号':row.deviceCode,														
						'告警次数':row.alarmCount,
					}
				}
//				console.log(JSON.stringify(row))
				this.bus.$emit('addMapPop',params)
			},
			//设备故障TOP10(最近90天)
			getFault(){
				var vm=this;
				this.$axios.post('fire/operation/deviceFaultTopN').then(function(res){
					vm.lists=res.faultList;
				})
			},
			//切换24小时/30天
			operate(i){
				this.curr=i;
				this.getList();
			},
			//24小时/30天获取数据
			getList(){
				var vm=this;
				if(vm.curr==1){
					var req='fire/operation/opterationTrend24Hour';
				}else{
					var req='fire/operation/opterationTrend30Day';
				}
				this.$axios.post(req).then(function(res){
					var data=res||[],arr=[];
					vm.supplyData(data);
				})
			},
			//完善数据
			supplyData(data,type){
				var vm=this,arr=[],arr1=[],times=[];
				var sDate = new Date();
				if(vm.curr==1){
					sDate.setHours(sDate.getHours() - 22);
				}else{
					sDate.setDate(sDate.getDate() - 29);
				}
				sDate = new Date(sDate);
				var eDate = new Date();
				eDate.setHours(eDate.getHours()+1);
				for (var vdate = new Date(sDate); vdate <= eDate;vm.curr==1?vdate.setHours(vdate.getHours() + 1):vdate.setDate(vdate.getDate() + 1)) {
				    var vtime = vm.curr==1?vdate.Format("yyyy-MM-dd hh"):vdate.Format("yyyy-MM-dd");
				    var num = 0,num1=0;
				    for (var idx = 0, len = data.fault.length; idx < len; idx++) {
				      if (vtime == data.fault[idx].date) {
					        num = data.fault[idx].num;
					        break;
					    }
				    }
				    for (var idx = 0, len = data.other.length; idx < len; idx++) {
				      if (vtime == data.other[idx].date) {
					        num1 = data.other[idx].num;
					        break;
					    }
				    }
				    times.push(vm.curr==1?(vdate.Format("hh")+'时'):(vdate.Format("MM-dd"))+'日');
				    arr.push(num);
				    arr1.push(num1);
				}
				vm.$nextTick(function(){
					vm.initchart(times,arr,arr1);
				})
			},
			//初始化图表
			initchart(times,arr,arr1){
				var vm=this;
				var chart=echarts.init(vm.$refs.chart);
				chart.setOption(vm.getOption(times,arr,arr1));
				allCharts.push(chart);
				var index = 0; //播放所在下标  
				clearInterval(mTime);
		    	mTime = setInterval(function() {
		    		chart.dispatchAction({  
		        		type: 'showTip',  
		        		seriesIndex: 0,  
		        		dataIndex: index  
		        	});  
		        	index++;  
		        	if(index>=times.length){ 
		        		index = 0;  
		         	}  
		    	},3000); 
			},
			//折线图
			getOption(times,arr,arr1){
				var vm=this;
				return {
					color : ['#CC1010','#FF9900'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        },
						textStyle:tooltipTextStyle,
				    },
				    legend:{
				    	show:true,
				    	icon:'rect',
				    	align:'left',
				    	itemWidth:4,
				    	itemHeight:0.7*fontSize,
				    	right:0,
				    	top:5,
				    	textStyle:textStyleC
				    },
				    textStyle:textStyleC,
				    grid: {
				        left: '0%',
				        right: '1%',
				        top:30,
				        bottom: '0%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data :times,
				            axisLine:{
				            	lineStyle:{
				            		color:'rgba(49, 133, 156,0.5)',
				            	}
				            },
				            axisTick: {
				                show: false
				            },
				            splitLine:{
				            	show:true,
				            	lineStyle:{
				            		color:'rgba(10, 63, 94,0.5)'
				            	}
				            },
				            axisLabel:{
				            	rotate:60,
								textStyle:textStyleC,
				            	formatter:function(value,index){
				            		if(index==arr.length-1){
				            			return '';
				            		}
				            		return value.substring(0,value.length-1)
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
				            minInterval: 1,
				            min:0,
							max:function(value){
				            	return value.max+20
				            },
				            axisLine:{
				            	lineStyle:{
				            		color:'rgba(49, 133, 156,0.5)',
				            	}
				            },
							axisLabel:{
								textStyle:textStyleC,
							},
				            axisTick: {
				                show: false
				            },
				            splitLine:{
				            	show:true,
				            	lineStyle:{
				            		color:'rgba(10, 63, 94,0.5)'
				            	}
				            },
				            axisPointer:{
				            	show:false
				            }
				        }
				    ],
				    series : [
				        {
				            name:'故障',
				            type:'line',
				            symbol:'none',
				            smooth:true,
				            lineStyle:{
				            	width:4
				            },
				            data:arr
				        },
				        {
				            name:'其他',
				            type:'line',
				            symbol:'none',
				            smooth:true,
				            lineStyle:{
				            	width:3
				            },
				            data:arr1
				        },
				    ]
				}
			},
		}
	}
</script>

<style scoped="scoped">
.boxtitle{
	color: #75CBF2;
	padding-bottom: 1rem;
}
.h-container{
	position: relative;
	display: flex;
	flex-direction: column;
}
.h-section1{
	position: relative;	
	flex: 1;
}
.h-section2{
	position: relative;
}
.chart{
	height:calc(100% - 2rem);
	z-index: 3;
}
.h-tip{
	margin-top: -3px;
}
.h-tip span{
	font-size: 14px;
	color: #00FFFF;
	margin-left: 10px;
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
	font-size: 24px;
	color: #00FFFF;
	margin-left: 3px;
}
.h-title{
	margin-bottom: 10px;
}

.h-content{
	position: relative;
}
.h-time-c{
	top: 0px !important;
	right: 0px !important;
}
.h-time-c-self{
	top: 1.7rem !important;
	right: 0px !important;
}
.h-text-overflow{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 16px;
}
</style>
<style>
	.fire .h-table td,.h-table th{
		padding: 0.25rem 0px !important;
		cursor: pointer;
	}
	.fire .h-table td .cell,.h-table th .cell{
		font-size: 0.8rem !important;
	}
</style>