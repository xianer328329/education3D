<template>
	<div class="h-container">
		<h4 class="boxtitle">运行状态</h4>
		<div class="h-content backboxContainer">
			<div class="h-section">
				<ul class="h-system">
					<li>
						<div :class="{'active':curr==8}" @click="operate(8)">
							<p>火灾报警</p>
						</div>
						<div :class="{'active':curr==10}" @click="operate(10)">
							<p>电气火灾</p>
						</div>
						<div :class="{'active':curr==4}" @click="operate(4)">
							<p>内消火栓</p>
						</div>
					</li>
					<li class="h-section2 h-disable">
						<div>
							<p>防火分隔</p>
						</div>
						<div>
							<p>防排烟</p>
						</div>
					</li>
					<li class="h-section3 h-disable">
						<div>
							<p>自动喷水</p>
						</div>
						<div>
							<p>可燃气体</p>
						</div>
						<div>
							<p>其他系统</p>
						</div>
					</li>
				</ul>
			</div>
			<div class="h-section">
				<div class="h-chart" ref="chart"></div>
				<div class="h-center">
					<h4 class="Z-numberf">{{lists.count}}</h4>
					<p>屏蔽<i class="Z-numberf">{{lists.shieldRate}}</i>%</p>
				</div>
				<div class="h-bottom h-left">正常<i class="Z-numberf">{{lists.normalRate}}</i>%</div>
				<div class="h-bottom h-right">故障<i class="Z-numberf">{{lists.faultRate}}</i>%</div>
			</div>
		</div>
	</div>
</template>

<script>
	var mTime;
	export default {
		data(){
			return {
				curr:8,//当前选中项
				lists:{
					normalRate:0,
					faultRate:0,
					count:0,
					shieldRate:0,
				},//当前展示数据
				datas:[],//所有系统数据
			}
		},
		mounted(){
			this.getList();
			var myChart = echarts.init(this.$refs.chart);
			myChart.setOption(this.getOption(this.lists));
		},
		methods:{
			operate(type){
				if(this.curr==type){
					return;
				}
				this.curr=type;
				this.initData()
			},
			//获取数据
			getList(){
				var vm=this;
				var params=new FormData();
				params.append('deviceType',vm.curr);
				this.$axios.post('fire/operation/workingState',params).then(function(res){
					vm.datas=res;
					vm.initData()
				})
			},
			//切换数据
			initData(){
				var vm=this;
				var data=this.datas;
				var countAll=0,ShieldRate = 0,faultCount=0;
				if(vm.curr==8){
					countAll = data.fireCount;
					faultCount = data.fireCount - data.normalFireCount;
				}
				else if (vm.curr == 10) {
					countAll = data.electCount;
					faultCount = data.electCount - data.normalElectCount;
				}else if (vm.curr == 4) {
					countAll = data.hydrantCount;
					faultCount = data.hydrantCount - data.normalHydrantCount;
				}
				vm.lists={
					normalRate:countAll>0?((countAll-faultCount)/countAll*100).toFixed(2):0,
					faultRate:countAll>0?(faultCount/countAll*100).toFixed(2):0,
					count:countAll,
					shieldRate:countAll>0?(0/countAll*100).toFixed(2):0,
				}
				vm.$nextTick(function(){
					var myChart = echarts.init(vm.$refs.chart);
					myChart.setOption(vm.getOption(vm.lists));
					allCharts.push(myChart);
				})
			},
			//初始化图表
			getOption(data){
				var vm=this;
				return {
				    	tooltip : {
						show:false,
				        formatter: "{a} <br/>{b} : {c}%"
			    	},
			    	series: [
				        {
							name: '运行状态',
				            type: 'gauge',
							radius: '70%',
							center: ['50%','48%'],
							min: 100,
				            max: -100,
				        	axisLine: {//设置表盘颜色和表盘线大小
								 show:false,
					             lineStyle: {
					                 color: [[vm.convert(data.normalRate), '#fff'], [0.5, '#00e027'], [vm.convert2(data.faultRate)+0.5, 'red'],[1,'#fff']],
					                "width":1,
									opacity:'0'
					            },
					        },
							pointer:{
								show:false,
							},
						    splitLine: {           // 分隔线
				                length:10,    // 属性length控制线长
				                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
				                    color: 'auto'
				                }
				            },	
							axisTick: {//设置大刻度颜色
					            lineStyle: {
					                color: 'auto',
					                width:1,
					                type:'solid',
					                opacity:'0.8'
					            },
					            length: 10,
					            splitNumber:5,
					            
					        },
							axisLabel: {//表盘刻度文字
				                show: true,
								distance:-1.9*fontSize,
				                textStyle: textStyleC
				            },
				            detail: {
				            	show:false,
				            	formatter:'{value}%'
				            },
				            data: [{value:data.normalRate, name: ''}]
				        }
				    ]
				};
			},
			//表盘数据转换
			convert(n){
				if(n==0){
					var m=0;
				}else{
					var m=(100-n)*0.5/100;
				}
				
				return m
			},
			convert2(n){
				if(n==0){
					var m=0;
				}else{
					var m=(100-n)*0.5/100;
				}
				if(m!=0){
					m=0.5-m;
				}
				return m
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
.h-container{
	position: relative;
	height: 100%;
}
.boxtitle{
	color:#75CBF2;
}
.h-section{
	float: left;
	width: 50%;
	height: 100%;
	position: relative;
	overflow: visible;
}
.h-chart{
	height: 100%;
}
.h-center{
	position: absolute;
	top: 44%;
	left: 50%;
	transform: translate(-50%,-50%);
	text-align: center;
}
.h-center h4{
	font-size: 1rem;
	color: #00FFFF;
	margin-bottom: 0.5rem;
	font-weight: bold;
}
.h-center p{
	color: #75CBF2;
}
.h-bottom{
	color: #75CBF2;
	position: absolute;
	bottom:0.3rem;
}
.h-left{
	left: 0px;
}
.h-right{	
	right: 0px;
}

.h-system{
	height: 100%;
	margin-top: 2%;
}
.h-system li{
	width: 35%;
	float: left;
	height: 95%;
}
.h-section2{
	margin-top: 15% !important;
    margin-left: -7%;
}
.h-section3{
	margin-left: -7%;
}
.h-system li>div{
	cursor: pointer;
	height: 33.33%;
	background: url(../../../../static/images/d303_03.png) no-repeat center;
	background-size:contain;
	position: relative;
	text-align: center;
	&:after{
		content: '';
		display: inline-block;
		height: 100%;;
		vertical-align: middle;
	}
	p{
		display: inline-block;
		vertical-align:middle;
	}
}
.h-system li>div.active{
	background-image: url(../../../../static/images/d304_03.png);
}
.h-system li>div.active p{
	color: #00FFFF;
}
.h-system li>div p{
	color: #75CBF2;
	font-size: 0.8rem;
	text-align: center;
	word-break: break-all;
	width: 2.2rem;
	margin: auto;
}
</style>