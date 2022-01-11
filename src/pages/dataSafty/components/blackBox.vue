<template>
	<div class="h-container blackBox">
		<h4 class="mdTitle">网管工作站</h4>
		<div class="backboxContainer">
			<div class="section left vertical-middle-c">
				<div class="vertical-middle">
					<div class="top">
						<p class="Z-numberf">{{list.total}}</p>
						<span>网管工作站总数</span>
					</div>
					<div class="chart-c">
						<div class="chart" ref="chart"></div>
						<div class="text">
							<p><i class="Z-numberf">{{list.total>0?(list.onlineTotal/list.total*100).toFixed(1):0}}</i>%</p>
							<img src="../../../../static/images/img4.png"/>
							<span>设备在线率</span>
						</div>
					</div>
				</div>
			</div>
			<ul class="section">
				<li>
					<div>
						<div>
							<span class="title">12U</span>
							<b class="Z-numberf">{{list['12Utotal']}}</b>
						</div>
						<div>
							<span class="fl">容量：{{list['12Usize']}}u</span>
							<span class="fr">已占用：{{list['12Uuse']}}u</span>
						</div>
					</div>
				</li>
				<li>
					<div>
						<div>
							<span class="title">24U</span>
							<b class="Z-numberf">{{list['24Utotal']}}</b>
						</div>
						<div>
							<span class="fl">容量：{{list['24Usize']}}u</span>
							<span class="fr">已占用：{{list['24Uuse']}}u</span>
						</div>
					</div>
				</li>
				<li>
					<div>
						<div>
							<span class="title">48U</span>
							<b>{{list['48Utotal']}}</b>
						</div>
						<div>
							<span class="fl">容量：{{list['48Usize']}}u</span>
							<span class="fr">已占用：{{list['48Uuse']}}u</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: '',//网管工作站
		components: {//引入模块
			
		},
		data(){
			return{
				list:{},
				pieJsonAlarm: {
					color: ["#ffc000","#31859c"],
					radius: ['85%', '100%'],
					center: ['50%', '50%'],
					emphasis: 'false',
					lege: 'false',
					hoverAnimation:'false',
					itemGap: 14,
					fontSize: 18,
					top: 10,
				},	
			}
		},
		mounted: function() {
			this.getInfo();
		},
		methods:{
			getInfo(){
				var vm=this;
				var params={
					unitUuid:UNITID
				}
				this.$axios.post('box/statistics/bqueryTotal',params).then(data=>{
					vm.list=data||{};
					var pieDatasAlarm = [{
						value: vm.list.onlineTotal||0,
						name: "在线设备"
					},
					{
						value: vm.list.total==0?1:((vm.list.total||0)-(vm.list.onlineTotal||0)),
						name: "离线设备"
					}];
					this.PieDataAlarm('chart',pieDatasAlarm);
				})
			},
			PieDataAlarm(Id, pieDatasAlarm) {
				var myChart = echarts.init(this.$refs[Id]);
				myChart.setOption(Pie(pieDatasAlarm, this.pieJsonAlarm), true);
				allCharts.push(myChart);
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.blackBox{
		*{
			color: #75CBF2;
			font-size: 0.8rem;
		}
		.section{
			float: left;
			&.left{
				width:45%;
				height:100%;
				background:rgba(10,63,94,1);
				border:1px solid rgba(10,80,122,1);
				box-sizing: border-box;
				.top{
					text-align:center;
					p{
						font-size:1.8rem;
						color:rgba(0,255,255,1);
						margin-bottom: 0.25rem;
					}
				}
				.chart-c{
					position: relative;
					margin: auto;
					margin-top: 1rem;
					width: 70%;
					padding-bottom: 70%;
					.chart{
						position: absolute;
						left: 0px;
						top: 0px;
						right: 0px;
						bottom: 0px;
					}
					.text{
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
						text-align: center;
						p{
							i{
								color: #FFCC00;
								font-size: 1.2rem;
								margin-right: 2px;
							}
						}
						img{
							width: 92%;
							margin:5px auto;
						}
						span{
							white-space: nowrap;
						}
					}
				}
			}
		}
		ul.section{
			float: right;
			width:53%;
			height: 100%;
			li{
				display: inline-block;
				width:100%;
				height:32.7%;
				background:rgba(10,63,94,1);
				border:1px solid rgba(10,80,122,1);
				padding: 0px 0.5rem;
				margin-bottom: 1%;
				box-sizing: border-box;
				&>div{
					display: inline-block;
					width: 99%;
					vertical-align: middle;
					*{
						line-height: 1.5rem;
					}
					.title{
						display: inline-block;
						font-size: 0.9rem;
						margin-bottom: 0.4rem;
						padding-left: 0.25rem;
						&:before{
							content: '';
							display: inline-block;
							width:0.2rem;
							height:0.7rem;
							background:rgba(33,137,175,1);
							position: relative;
							left: -0.25rem;
						}
					}
					b{
						font-weight: normal;
						color: #0ff;
						font-size: 1.2rem;
						float: right;
					}
				}
				&:after{
					content: '';
					display: inline-block;
					height: 100%;
					vertical-align: middle;
				}
			}
		}
		
	}
</style>