<template>
	<div id="">
		<div id=""><h4 class="mdTitle"><span>资产状态</span><span class="statetitle">资金来源</span></h4></div>
		<div class="btoom">
			<div id="statepie" class="fl"></div>
			<div id="statepie2" class="fr"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'state',
		data() {
			return {}
		},
		mounted: function() {
			this.PieData3("statepie");
			this.statepie2("statepie2");
		},
		methods: {
			statepie2(Id) {
				var oPieDatas = [{
						value: 33,
						name: "教学"
					},
					{
						value: 127,
						name: "科研"
					},
					{
						value: 113,
						name: "基建"
					},
					{
						value: 80,
						name: "自筹"
					},
					{
						value: 71,
						name: "贷款"
					},
					{
						value: 37,
						name: "捐款"
					},
					{
						value: 37,
						name: "其他"
					},
				]
				var oPieJson = {
					'color': ["#49dee2", "#36c1c5", "#3bd296", "#27c27e", "#4780ca", "#659fec", "#d762eb"],
					'radius': '71',
					'center': ['55%', '60%'],
				}
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(ordinaryPie(oPieDatas, oPieJson), true);
			},
			PieData3(Id) {
				var pieDatas3 = [{
						value: 54.2,
						name: '在用'
					},
					{
						value: 31.8,
						name: '其他'
					},
					{
						value: 12.2,
						name: '闲置'
					},

				]
				var pieJson3 = {
					'color': ['#d84b46', '#bd3733', '#a3211d'],
					'radius': '70%',
					'center': ['50%', '65%'],
					'tValue': 'false',
					'lege': 'true',
					'top': 15,
					'left': 80,
					'itemGap': 9,
					'fontSize': 14,
					'label': 'false',
					'target': 'false',

				}
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie2H(pieDatas3, pieJson3), true);
			}

		},
	}
</script>

<style>
	.statetitle{
		margin-left: 220px;
		width: 200px;
	}
	.btoom {
		height: 252px;
	}
	
	#statepie2 {
		width: 220px;
		height: 252px;
	}
	
	#statepie {
		width: 220px;
		height: 252px;
	}
</style>