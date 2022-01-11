<template>
	<div>
		<div class="shrinkNav" id="shrinkNav" @click.stop="">
			<ul>
				<li class="haveData" :class="{active:showSKRINK.a}" @click="shrink(1)">报到情况</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1 h-SKRINK" v-show="showSKRINK.a" @click.stop="">
					<!--<div class="h-chart" ref="chart"></div>-->
					<div class="h-list">
						<span class="h-title">学院新生报到情况</span>
						<div class="h-legend">
							<span class="h-boy"><i class="boy"></i><span>男生</span></span>
							<span class="h-girl"><i class="girl"></i><span>女生</span></span>
						</div>
						<ul>
							<li v-for="item in lists">
								<span class="fl" v-html="item.name"></span>
								<div class="bar-c">
									<template v-if="max>0">
										<i class="boy" v-if="item.boy>0" :style="{width:(item.boy/max*100)+'%'}">{{item.boy}}</i>
										<i class="girl" v-if="item.girl>0" :style="{width:(item.girl/max*100)+'%'}">{{item.girl}}</i>
										<i class="other" v-if="item.other>0" :style="{width:(item.other/max*100)+'%'}">{{item.other}}</i>
									</template>
								</div>
								<span class="h-percent">{{(item.rowNumber/total*100).toFixed(1)}}%</span>
							</li>
						</ul>
					</div>
					<ul></ul>
				</back-box>
			</transition>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showSKRINK: {
					a: false,
					//b:false,
				},
				max:0,
				total:0,
				lists:[{
					name:'文化与传媒学院',
					boy:246,
					girl:78,
					other:124
				},{
					name:'数学与财经学院',
					boy:201,
					girl:81,
					other:115
				},{
					name:'材料与化工学院',
					boy:226,
					girl:59,
					other:107
				},{
					name:'机器人工程学院',
					boy:198,
					girl:95,
					other:78
				},{
					name:'林学与生命科学学院',
					boy:165,
					girl:42,
					other:187
				},{
					name:'电子电气工程学院',
					boy:176,
					girl:80,
					other:125
				},{
					name:'重庆服务外包学院',
					boy:90,
					girl:156,
					other:107
				},{
					name:'经济管理学院',
					boy:169,
					girl:147,
					other:0
				},{
					name:'旅游学院',
					boy:89,
					girl:156,
					other:107
				},{
					name:'公共管理学院',
					boy:190,
					girl:70,
					other:86
				},{
					name:'教育学院',
					boy:176,
					girl:59,
					other:108
				},{
					name:'外国语学院',
					boy:156,
					girl:109,
					other:78
				},{
					name:'音乐学院',
					boy:56,
					girl:205,
					other:0
				}],
				
			}
		},
		mounted: function() {
			this.getInfo();

		},
		methods: {
			//获取基础信息
			getInfo() {
				var vm = this;
				this.$axios.post('traffic/pass/baseInfo')
					.then(function(res) {
						vm.changeData();
					})
			},
			changeData(){
				var vm=this,max=0,total=0;
				vm.lists.forEach(function(item){
					if(item.name.length>4){
						if(item.name.length==5){
			        		item.name=item.name.substring(0,2)+'<p></p>'+item.name.substring(2)
			        	}else if(item.name.length>8){
			        		item.name=item.name.substring(0,item.name.length/2)+'<p></p>'+item.name.substring(item.name.length/2)
			        	}else{
			        		item.name=item.name.substring(0,item.name.length/2-1)+'<p></p>'+item.name.substring(item.name.length/2-1)
			        	}	
		        	}
		        	var row=item.boy+item.girl+item.other;
		        	
		        	item.rowNumber=row;
		        	if(row>max){
		        		max=row;
		        	}
		        	total+=row;
				});
				vm.max=max;
				vm.total=total;
			},
			//初始化图表
			initChart(){
				var vm=this;
				var chart=echarts.init(vm.$refs.chart);
				chart.setOption(vm.getOption());
			},
			getOption(){
				return {
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    title:{
				    	text:'学院新生报到情况',
				    	textStyle:{
				    		fontSize:18,
				    		color:'#75CBF2'
				    	}	    	
				    },
				    color:['#0087C4','#FF8DC3','transparent'],
				    legend: {
				        data: ['男生', '女生','',''],
				        right:45,
				        textStyle:{
				        	color:'#75CBF2',
				        },
				        itemWidth:4
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis:  {
				        type: 'value',
				        show:false,
				    },
				    yAxis: {
				        type: 'category',
				        data: ['音乐学院','外国语学院','教育学院','公共管理学院','旅游学院','经济管理学院','重庆服务外包学院','电子电气工程学院','林学与生命科学学院','机器人工程学院','材料与化工学院','数学与财经学院 ','文化与传媒学院'],
				        axisLabel:{
				        	color:'#75CBF2',
				        	fontSize:14,
				        	formatter:function(name){
					        	if(name.length>4){
					        		return name.substring(0,name.length/2-1)+'\n'+name.substring(name.length/2-1)
					        	}
					        	return name
					        },
				        },
				        axisLine:{
				        	show:false
				        }
				    },
				    textStyle:{
				    	fontSize:14
				    },
				    series: [
				        {
				            name: '男生',
				            type: 'bar',
				            stack: '总量',
				            barWidth:22,
				            label: {
			                    show: true,
			                    position: 'inside',
			                    formatter:function(item){
			                    	return item.data==0?'':item.value
			                    }
			            	},
			            	itemStyle:{
			            		borderColor:'#0087C4',
			            		borderWidth:1,	
			            	},
				            data: [56,320, 302, 301, 334, 390, 330, 320]
				        },
				        {
				            name: '女生',
				            type: 'bar',
				            stack: '总量',
				            label: {
			                    show: true,
			                    position: 'inside',
			                    formatter:function(item){
			                    	return item.data==0?'':item.value
			                    }
			            	},
			            	itemStyle:{
			            		borderColor:'#FF8DC3',
			            		borderWidth:1,	
			            	},
				            data: [205,120, 132, 101, 134, 90, 230, 210]
				        },
				        {
				            name: '未知',
				            type: 'bar',
				            stack: '总量',
				            label: {
			                    show: true,
			                    position: 'inside',
			                    formatter:function(item){
			                    	return item.data==0?'':item.value
			                    }
			            	},
			            	itemStyle:{
			            		borderColor:'rgba(255,255,255,0.5)',
			            		borderWidth:1,	
			            	},
				            data: [0,220, 182, 191, 234, 290, 330, 310]
				        },
				        {
				            name: '百分比',
				            type: 'bar',
				            stack: '总量',
				            label: {
			                    show: true,
			                    position: 'inside',
			                    formatter:function(item){
			                    	return item.data==0?'':item.value
			                    }
			            	},
			            	itemStyle:{
			            		borderColor:'rgba(255,255,255,0.5)',
			            		borderWidth:1,	
			            	},
				            data: []
				        },
				    ]
				}
			},
			shrink(index) {
				if(index == 1) {
					//this.showSKRINK.b=false;
					this.showSKRINK.a = !this.showSKRINK.a;
				}
				var _this = this
				$(document).click(function(e) {
					var target = $(e.target);
					if(!target.is('#shrinkNav *') && !target.is('#SKRINKBox *')) {
						_this.showSKRINK.a = false
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
.SKRINK.h-SKRINK{
    width: 17.5rem;
}
.h-list{
	color: #75CBF2;
	font-size: 0.7rem;
	margin-right: 0.2rem;
	overflow: hidden;
	&:hover{
		overflow: visible;
	}
	*{
		padding: 0px;
		margin: 0px;
		list-style: none;
	}
	.boy{
		display: inline-block;
		background: #0087C4;
		vertical-align: middle;
	}
	.girl{
		display: inline-block;
		background: #FF8DC3;
		vertical-align: middle;
	}
	.h-legend{
		float: right;
		.h-boy,.h-girl{
			i{
				width: 0.2rem;
				height: 0.7rem;
				margin-right: 0.25rem;
			}
		}
		span{
			display: inline-block;
			font-size: 0.7rem;
			vertical-align: middle;
		}
	}
	ul{
		margin-top: 1rem;
		margin-bottom: 0.65rem;
		margin-right: -40px;
		max-height: 27.5rem;
		overflow: auto;
		li{
			height: 2.3rem;
			margin-bottom: 1px;
			overflow: hidden;
			font-size: 0px;
			&:after{
				content: '';
				display: inline-block;
				height: 100%;
				vertical-align: middle;
			}
			*{
				vertical-align: middle;
			}
			.fl{
				display: inline-block;
				font-size: 0.7rem;	
				margin-right: 0.5rem;
				width:3.7rem;
				text-align: right;
				float: none;
				max-height: 100%;
				overflow: hidden;
			}
			.h-percent{
				display: inline-block;
				font-size: 0.8rem;
				color: #00FFFF;
				width: 2.5rem;
				text-align: right;
			}
			.bar-c{
				display: inline-block;
				width: 9.5rem;
				font-size: 0px;
				i{
					display: inline-block;
					width: 33%;
					height: 1.1rem;
					vertical-align: middle;
					text-align: center;
					font-size: 0.7rem;
					line-height: 1.1rem;
					color: white;
					box-sizing: border-box;
				}
				.other{
					border: 1px solid rgba(255,255,255,0.5);
					border-left: 0px;
				}
			}
		}
	}
}
</style>