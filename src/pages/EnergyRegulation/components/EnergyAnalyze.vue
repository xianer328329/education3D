<template>
	<div class="clearFix EnergyAnalyze">
		<h4 class="mdTitle">能耗分析</h4>
		<div class="backboxContainer flex flex-column">
			<div class="analyzeTop">
				<div class="BlockDataTitle">
					<div class="C-bdullitext">2019-12</div>
				</div>
				<ul class="amountCom amountBoxUp clearFix">
					<li class="amount fl">
						<div class="amount-content">
							<span>生均能耗<small>kgce/生</small><i class="fr">104</i></span>
							<div class="scale clearFix">
								<p class="fl">同比<em>↑ 0.3%</em></p>
								<p class="fr">环比<em>↓ 1.2%</em></p>
							</div>
						</div>
					</li>
					<li class="amount fr">
						<div class="amount-content">
							<span>单位面积能耗<small>kgce/㎡</small><i class="fr">223</i></span>
							<div class="scale clearFix">
								<p class="fl">同比<em>↓ 0.1%</em></p>
								<p class="fr">环比<em>↓ 0.3%</em></p>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div id="analyzebar" class="flex-basis"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'EnergyAnalyze',
		data() {
			return {
				superviseJson: {
					data1: [3235, 3436, 2893, 2950, 782, 657,3099, 3965, 3203, 3562, 665,568],
					color: ['#D04A4A'],
					name: ['能耗'],
					title: "吨/标准煤",
					oxAxis: ['3月','4月','5月','6月','7月','8月','9月','10月', '11月', '12月', '01月', '02月'],
					leg: "true",
					barWidth:12,
					emcolor:['#FF9900'],
					oMax: function(value) {
						return value.max + 3;
					},
				}
			}
		},
		mounted: function() {
			this.superviseData('analyzebar', this.superviseJson)
		},
		methods: {
			superviseData(Id, superviseJson) { //能源监管 柱状图
				this.$nextTick(function(){
					var mTime3=null;
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(bar4(superviseJson), true);
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
						if(index>superviseJson.data1.length){ 
							index = 0;  
						}  
					},3000); 
				})

			},
		},
	}
</script>

<style lang="stylus" scoped>	
	.BlockDataTitle {
		width: 85%;
		height: 2.1rem;
		border: 1px solid rgba(25, 94, 127, 1);
		border-radius: 0.2rem 0.2rem 0px 0px;
		text-align: center;
		border-bottom: none;
		margin: 0 auto;
		margin-top: 0.4rem;
	}
	
	.BlockDataTitle .C-bdullitext {
		top: -0.65rem;
		background: #001525;
		text-align: center;
		position: relative;
		display: inline-block;
		color: #75cbf2;
		font-size: 0.8rem;
		padding: 0 0.45rem;
	}
	
	.amountBoxUp {
		margin: 0 auto;
		margin-top: -0.8rem;
	}
	
	.amountBoxUp .amount {
		width: 49%;
		height: 5.4rem;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		box-sizing:border-box;
	}
	
	.amountCom .amount span i {
		font-size: 1rem;
		color: #FF9900;
	}
	
	.amountCom .amount span {
		font-size: 0.8rem;
		text-align: left;
		padding-bottom:0.3rem;
		background-size: 110% 0.15rem;
	}
	
	.amountCom .amount span small {
		font-size: 0.6rem;
	}
	
	.amountBoxUp .amount p,
	.amountBoxUp .amount p * {
		color: #0ff;
		margin-top: 0.25rem;
	}
	
	.amountBoxUp .amount p em {
		margin-left: 0.25rem;
	}
	
	#analyzebar {
		width: 100%;
		position:relative;
		z-index:3;
	}
</style>