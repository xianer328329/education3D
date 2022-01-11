<template>
	<div>
		<h4 class="mdTitle">实验室监管</h4>
		<div class="pieL-RBox clearFix Dangerous backboxContainer">
			<div class="pieOne fl">
				<div class="pieL-R-F">--<small>%</small></div>
				<div id="lab"></div>
			</div>
			<ul class="Dangerous-R fr">
				<li class="D-li vertical-middle-c">
					<div class="vertical-middle">
						实验室数量<i class="fr">--</i>
					</div>
				</li>
				<li class="D-li vertical-middle-c">
					<div class="vertical-middle">
						危化源<i class="fr">--</i>
					</div>					
				</li>
				<li class="D-li vertical-middle-c">
					<div class="vertical-middle">
						检测设备<i class="fr">--</i>
					</div>					
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
export default {
		name: 'IndexChemical',
		methods: {
			Pielab(Id, labData, pieJsonlab) {
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(Pie(labData, pieJsonlab), true);
					allCharts.push(myChart);
				})
			}
		},
		mounted: function() {
			var labData = [{
					value: 0,
					name: "合格"
				},
				{
					value: 0,
					name: "未合格"
				},
			];
			var pieJsonlab = {
				'color': ["#31859C", "#1D3F65"],
				'radius': ['70%', '80%'],
				'center': ['50%', '40%'],
				'emphasis': 'false',
				'lege': 'false',
				'itemGap': 14,
				'fontSize': 0.9*fontSize,
				'top': 10,
				'title': true,
				'text': '实验室合格率',
				'textStyle': {
					'color': '#75CBF2',
					'fontSize': 0.8*fontSize,
					'fontWeight':'500'
				}
			};
			this.Pielab('lab', labData, pieJsonlab)

		}
	}
</script>

<style lang="stylus" scoped>
	#lab {
		width: 100%;
		height: 100%;
	}
	.pieOne {
		width: 40%;
		height: 100%;
		position: relative;
	}
	
	.pieOne .pieL-R-F {
		width: 100%;
		font-size: 1.2rem;
		position: absolute;
		top: 40%;
		left: 0px;
		color: #FFCC00;
		text-align: center;
		transform translateY(-50%)
	}
	
	.pieOne .pieL-R-F small {
		font-size: 14px;
	}
	
	.Dangerous .Dangerous-R {
		width 55%;
		height: 100%;
	}
	
	.Dangerous .Dangerous-R .D-li {
		height: 27%;
		line-height 1.5rem;
		border: 1px solid #0A507A;
		font-size: 0.8rem;
		color: #75CBF2;
		padding: 0 0.6rem 0 1.85rem;
		box-sizing: border-box;
		margin-top: 3%;
		background-size:1.5rem auto !important; 
	}
	
	.Dangerous .D-li i {
		font-size: 22px;
		font-family: "DIN Medium";
		font-weight: 500;
		color: #00FFFF;
	}
	.Dangerous .D-li .vertical-middle{
		text-align:left;
	}
	.Dangerous .D-li:nth-of-type(1) {
		background: url(../../../../static/images/a6on.png) no-repeat left #0A3F5E;
	}
	
	.Dangerous .D-li:nth-of-type(2) {
		background: url(../../../../static/images/a5on.png) no-repeat left #0A3F5E;
	}
	
	.Dangerous .D-li:nth-of-type(3) {
		background: url(../../../../static/images/img5.png) no-repeat left #0A3F5E;
	}
</style>