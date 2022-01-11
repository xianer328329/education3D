<template>
	<div>
		<el-dialog  center title="最近五日天气预报"  class="emergency-modal" :modal-append-to-body="false" :modal="false" :visible="curr!=''" :before-close="close" width="45rem">
			<ul class="weather">
				<li v-for="(item,index) in lists" :class="{active:index==0}" :key="index">
					<div>
						<p class="week">{{item.week}}</p>
						<p class="date">{{item.day}}</p>
						<div class="weather_icon_c">
							<!--<img :src="require('../../../../static/images/weather/'+item.weatIcon+'@1x.png')" class="weather_icon"/>-->
							<img :src="'static/images/weather/'+item.weatIcon+'@1x.png'" class="weather_icon"/>
						</div>
						<p class="temperature">{{item.weatLows}}℃~{{item.weatHigh}}℃</p>
						<p class="desc">{{item.textDay==item.textNight?item.textDay:(item.textDay+'转'+item.textNight)}}</p>
						<p class="degree" :style="{'background-color':item.bg}">{{item.weatQual}}</p>
					</div>
				</li>
			</ul>
			<div class="chart-c">
				<h1>最近24小时天气预报</h1>
				<div class="chart" ref="chart"></div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'weather',
		data(){
			return{
				curr:'',
				lists:[],//{week:'周一',day:'2019-12-18',weatIcon:1,weatLows:23,weatHigh:6,textDay:'请',textNight:'云',weatQual:'凉'}
				week:['周日','周一','周二','周三','周四','周五','周六'],
				qual:{
					'优':'#38A84C',
					'良':'#75B51B',
					'轻度':'#E09600',
					'中度':'#FF3F1F',
					'重度':'#D10042',
					'严重':'#780039',
				}
			}
		},
		mounted(){
			var vm=this;
		},
		methods:{		
			show(row){
				var vm=this;
				vm.curr=1;
				vm.getWeatherForecast(row,2);
				vm.getWeatherForecast(row,1);
			},
			getWeatherForecast(row,type){
				var vm=this;
				var params={
					"deptCode": row.deptCode,
  					"weatType": type,
  					"unitUuid": UNITID
				}
				vm.$axios.post('edu/home/weatherForecast',params).then(res=>{
					var arr=res||[];
					if(type==2){
						arr.forEach((item,index)=>{
							item.lastUpdate=item.lastUpdate.replace(/-/g,"/");
							var d=new Date(item.lastUpdate);
							item.week=index==0?'今天':vm.week[d.getDay()];
							item.day=(d.getMonth()+1)+'月'+d.getDate()+'日';
							item.weatQual=item.weatQual?item.weatQual.substring(0,2):'';
							item.bg=vm.qual[item.weatQual]||'transparent';
						});
						vm.lists=arr;
					}else{
						var time=[],temprature=[];
						arr.forEach((item,index)=>{
							item.lastUpdate=item.lastUpdate.replace(/-/g,"/");
							if(arr.length>9){
								if(index%3==0){
									time.push(item.lastUpdate);
									temprature.push(item.weatTemp);
								}else if(index==23){
									var d=new Date(item.lastUpdate);
									d.setHours(d.getHours()+1);
									
									var year=d.getFullYear();
									var month=d.getMonth()+1;
									var day=d.getDate();
									
									var hour=d.getHours();
									var minute=d.getMinutes();
									var seconds=d.getSeconds();
									
									var lastDate=year+'/'+(month>9?month:'0'+month)+'/'+(day>9?day:'0'+day)+' '+(hour>9?hour:'0'+hour)+':'+(minute>9?minute:'0'+minute)+':'+(seconds>9?seconds:'0'+seconds)+':'						
									time.push(lastDate);
									temprature.push(item.weatTemp);
								}
							}
							else{
								time.push(item.lastUpdate);
								temprature.push(item.weatTemp);
							}
							
						});
						vm.$nextTick(function(){
							vm.initChart(time,temprature);
						})
					}
				})
			},
			initChart(xData,yData){
				var vm=this;
				var chart=echarts.init(vm.$refs.chart);
				chart.setOption({
				    xAxis: {
				        type: 'category',
				        data:xData,
//				        boundaryGap: false,
				        axisTick:{
				        	show:false,
				        },
				        axisLine:{
				        	lineStyle:{
				        		color:'rgba(255,255,255,0.5)'
				        	}
				        },
				        axisLabel:{
				        	color:'#BBBBBB',
				        	fontSize:0.8*fontSize,
				        	formatter:function(time,index){
				        		if(index==0){
				        			return '现在';
				        		}else{
				        			var d=new Date(time);
				        			var h=d.getHours();
				        			h=h>9?h:'0'+h;
				        			return h+'点';
				        		}
				        		
				        	}
				        },
				    },
				    yAxis: {
				        type: 'value',
				        axisTick:{
				        	show:false,
				        },
				        axisLabel:{
				        	show:false,
				        },
				        axisLine:{
				        	show:false,
				        },
				        splitLine:{
				        	lineStyle:{
				        		color:'rgba(255,255,255,0.1)'
				        	}
				        }
				    },
				    tooltip:{
				    	trigger:'axis',
				    	axisPointer:{
				    		type:'none'
				    	},
				    	showContent:false,
						textStyle:tooltipTextStyle
				    },
				    grid:{
				    	top:1.5*fontSize,
				    	left:1*fontSize,
				    	right:1*fontSize
				    },
				    series: [{
				        type: 'line',
				        label:{
				        	show:true,
				        	color:'#FF3D1E',
				        	fontSize:0.8*fontSize,
				        	formatter:'{c}℃'
				        },
				        'symbol':'circle',
				        symbolSize:6,
				        itemStyle:{
				        	color:'#D0533F'
				        },
				        lineStyle:{
				        	color:'#C55140'
				        },
				        emphasis:{
				        	itemStyle:{
//					        	color:'#0ff'
					        },
				        },
//				        smooth:true,
				        data:yData,
				    }]
				});
				allCharts.push(chart)
			},
			close(){
				var vm=this;
				this.curr='';
				this.lists=[];
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.weather{
		overflow: hidden;
		margin: 0px -2px;
		min-height: 15.75rem;
		display: flex;
		line-height: 0px !important;
		line-height: initial !important;
		li{
			float: left;
			width: 20%;
			text-align: center;
			border: 2px solid transparent;
			box-sizing: border-box;
			flex: 1;
			&.active>div{
				background: #293657;
			}
			&>div{
				padding: 1rem 0.25rem 0.5rem;
				background: #222D48;
				height: 15.5rem;
				box-sizing: border-box;
			}
			*{
				color: white !important;
			}
			.weather_icon_c{
				width: 4.25rem;
				height: 4.25rem;
				margin: auto;
				position: relative;
				margin-bottom: 0.75rem;
				.weather_icon{
					display: inline-block;
					width: 3rem;
					max-width: 99%;
					max-height: 100%;
					vertical-align: middle;
				}
				&:after{
					content: '';
					display: inline-block;
					height: 100%;
					vertical-align: middle;
				}
			}
			
			p{
				margin-bottom: 0.5rem;
				font-size: 0.8rem;
			}
			.week{
				margin-bottom: 0.75rem;
				font-size: 0.9rem;
			}
			.temperature{
				margin-bottom: 0.25rem;
			}
			.degree{
				display: inline-block;
				border-radius: 4px;
				line-height: 1.5rem;
				min-width: 5rem;
				background: #38A84C;
				margin-top: 0.5rem;
			}
		}
	}
	
	.chart-c{
		background:#222D48;
		margin-top: 1rem;
		h1{
			text-align: left;
			color: white !important;
			padding: 1rem 1rem 0px;
		}
		.chart{
			margin: auto;
			height: 15rem;
		}
	}
</style>
<style lang="scss">
	.emergency-modal .el-dialog__header{
		line-height: 0px !important;
		line-height: initial !important;
	}
</style>
