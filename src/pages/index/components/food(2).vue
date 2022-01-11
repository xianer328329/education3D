<template>
	<div>
		<h4 class="mdTitle">食品安全</h4>
		<ul class="amountCom amountBoxUp clearFix">
			<li class="fl amount">
				<div class="amount-content">
					<span class="yellowC">优良(Ⅱ类)</span>
					<p>水质</p>
				</div>
			</li>
			<li class="fr amount">
				<div class="amount-content">					
					<span class="yellowC">优良(Ⅱ类)</span>
					<p>环境</p>
				</div>
			</li>
		</ul>
		<div class="pieL-RBox clearFix">
			<div class="pieL-R fl">
				<div class="pieL-R-F">--<small>%</small></div>
				<div class="pieExp">
					<p>供应商<i>--</i></p>
					<p>已备案<i>--</i></p>
				</div>
				<div id="supplier"></div>
			</div>
			<div class="pieL-R fr">
				<div class="pieL-R-F">--<small>%</small></div>
				<div class="pieExp">
					<p>工作人员<i>--</i></p>
					<p>持证上岗<i>--</i></p>
				</div>
				<div id="holder"></div>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable */	
import axios from 'axios'
export default {
		name: 'IndexFood',
		methods: {
			Piesupplier(Id, supplierData, pieJsonSupplier) {
				pieJsonSupplier.emphasis = 'false';
				pieJsonSupplier.lege = 'false';
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie(supplierData, pieJsonSupplier), true);
				allCharts.push(myChart);
			}

		},
		mounted: function() {
			var supplierData = [{
					value: 35,
					name: "已备案"
				},
				{
					value: 51 - 35,
					name: "未备案"
				},
			];
			var pieJsonSupplier = {
				'color': ["#00CD4D", "#1D3F65"],
				'radius': ['60%', '70%'],
				'center': ['40%', '40%'],
				'emphasis': 'false',
				'lege': 'false',
				'itemGap': 14,
				'fontSize': 0.8*fontSize,
				'top': 10,
				'title': true,
				'text': '供应商备案率',
				'textStyle': {
					'color': '#75CBF2',
					'fontSize': 0.8*fontSize,
					'fontWeight':'500'
				}
			}
			this.$nextTick(function(){				
				this.Piesupplier('supplier', supplierData, pieJsonSupplier)
				this.Piesupplier('holder', supplierData, pieJsonSupplier)
			})
		}

	}
</script>

<style lang="scss" scoped>
	.amountBoxUp .amount{
		width: 49%;
	}
	.pieL-RBox {
		width: 100%;
		height: calc(100% - 5rem);
	}
	
	.pieL-R {
		width: 49%;
		height: 100%;
		position: relative;
	}
	
	#supplier,
	#holder {
		height: 100%;
	}
	
	.pieL-R-F {
		font-size: 0.8rem;
		color: #FFCC00;
		text-align: center;
		line-height: 3.1rem;
		position: absolute;
		top: 40%;
		transform: translateY(-50%);
		left: 0px;
		right: 10%;
	}
	
	.pieL-R-F small {
		font-size: 0.6rem;
		color: #75CBF2;
	}
	
	.pieExp {
		color: #999;
		position: absolute;
		top: 0px;
		right: 0px;
	}
	
	.pieExp p {
		font-size: 0.7rem;
		line-height: 1.15rem;
	}
	
	.pieExp i {
		font-size: 0.8rem;
		color: #00FFFF;
		float: right;
	}
</style>