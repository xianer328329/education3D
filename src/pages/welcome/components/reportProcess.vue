<template>
	<div>
		<h4 class="mdTitle">报道流程统计</h4>
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
						indicator:[
				           { name: '资料提交', max: 6500},
				           { name: '绿色\n通道', max: 16000},
				           { name: '新生\n入住', max: 30000},
				           { name: '一卡通', max: 38000},
				           { name: '认证 \n通过', max: 52000},
				        ],
				        data:[
				            {
				                value : [4300, 10000, 28000, 35000, 50000, 19000],
				                name : ''
				            },
				        ]
					}
					vm.initRadar(data);
					
					var data={
						data:[
			                {value:335, name:'专升本'},
			                {value:310, name:'博士'},
			                {value:234, name:'专科'},
			                {value:135, name:'硕士'},
			                {value:1548, name:'本科'}
			            ]
					}
					vm.initPie(data);
				})
			},
			//初始化圆环
			initPie(data){
				var vm=this;
				var chart2=echarts.init(vm.$refs.chart2);
				chart2.setOption(vm.getOption2(data));	
				allCharts.push(chart2);
			},
			//初始化雷达
			initRadar(data){
				var vm=this;
				var chart1=echarts.init(vm.$refs.chart1);
				chart1.setOption(vm.getOption1(data));
				allCharts.push(chart1);
			},
			//雷达
			getOption1(data){
				return {
					    radar: {
					        name: {
					            textStyle: {
					                color: '#75CBF2',
					                fontSize:0.7*fontSize,
					                borderRadius: 3,
					                padding: [3, 5]
					           }
					        },
					        radius:'65%',
					        nameGap:0,
					        splitArea:{
					        	areaStyle:{
					        		color:'transparent'
					        	}
					        },
					        axisLine:{
					        	lineStyle:{
					        		color:'rgba(255, 255, 255, 0.2)'
					        	}
					        },
					        splitLine:{
					        	lineStyle:{
					        		color:'rgba(255, 255, 255, 0.2)'
					        	}
					        },
					        indicator: data.indicator
					    },
					    color:['#00FFFF'],
					    series: [{
					        name: '预算 vs 开销（Budget vs spending）',
					        type: 'radar',
					        data : data.data
					    }]
					}
			},
			//圆环
			getOption2(data){
				var vm=this;
				return {
					color:['#0A5898','#2E8AD3','#75CBF2','#198B8B','#15D5D5'],
				    tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b}: {c} ({d}%)"
				    },
				    series: [
				        {
				            name:'',
				            type:'pie',
				            radius: ['40%', '55%'],
				            avoidLabelOverlap: false,
				            label: {
				                normal: {
				                    show: true,
				                    fontSize: 0.7*fontSize,
				                    color:'#75CBF2',
//				                    formatter:'{b}'
				                },
				                emphasis: {
				                    show: true,
				                    textStyle: {
				                       color:'#0ff'
				                    }
				                },
				                
				            },
				            labelLine: {
				                normal: {
				                    show: true
				                }
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
.h-container{
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
	width:45%;
	height: 100%;
	z-index: 2;
}
.chart2{
	float: left;
	width:55%;
	height:100%;
	z-index: 2;
}
</style>