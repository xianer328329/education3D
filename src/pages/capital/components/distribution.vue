<template>
	<div class="Distri clearFix">
		<h4 class="Z-Btitle2">资产分布 <back-box class="Z-Stitle Z-border">国标大类</back-box></h4>
		<div id="propertyPie1" class="fl"></div>
		<ul class="Z-propertyList1 fr">
			<li>
				<h4>土地、房屋及构筑建</h4>
				<p class="clearFix"><span><i>13.2</i>千万元 (<i>33.9</i>%)</span><span><i>1.87</i>km²</span></p>
			</li>
			<li>
				<h4>通用设备</h4>
				<p class="clearFix"><span><i>10.2</i>千万元 (<i>26.2</i>%)</span><span><i>1212</i>件</span></p>
			</li>
			<li>
				<h4>专用设备</h4>
				<p class="clearFix"><span><i>7.5</i>千万元 (<i>19.3</i>%)</span><span><i>737</i>件</span></p>
			</li>
			<li>
				<h4>家具、用具、装具</h4>
				<p class="clearFix"><span><i>2.7</i>千万元 (<i>6.9</i>%)</span><span><i>73221</i>件</span></p>
			</li>
			<li>
				<h4>图书、档案</h4>
				<p class="clearFix"><span><i>2.6</i>千万元 (<i>6.8</i>%)</span><span><i>311</i>万册</span></p>
			</li>
			<li>
				<h4>无形资产</h4>
				<p class="clearFix"><span><i>1.6</i>千万元 (<i>6.7</i>%)</span><span><i>89</i>件</span></p>
			</li>
			<li>
				<h4>文物和陈列品</h4>
				<p class="clearFix"><span><i>1.1</i>千万元 (<i>2.8</i>%)</span><span><i>37</i>件</span></p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'distribution',
		data() {
			return {}
		},
		mounted: function() {
			this.PieData("propertyPie1");
		},
		methods: {
			PieData(Id) {
				var pieDatas = [{
						value: 33.9,
						name: '土地、房屋及构筑建'
					},
					{
						value: 26.2,
						name: '通用设备'
					},
					{
						value: 19.3,
						name: '专用设备'
					},
					{
						value: 6.9,
						name: '家具、用具、装具'
					},
					{
						value: 6.8,
						name: '图书、档案'
					},
					{
						value: 6.7,
						name: '无形资产'
					},
					{
						value: 2.8,
						name: '文物和陈列品'
					},

				]
				var pieJson = {
					'color': ['#58acd1', '#4fa1c6', '#338fb8', '#2a87b0', '#237fa8', '#196b8f', '#0a4662'],
					'radius': '60%',
					'center': ['50%', '55%'],
					'tValue': 'false',
					'fontSize2': '12',
				}
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie2T(pieDatas, pieJson), true);
			}
		},
	}
</script>

<style lang="stylus" scoped>
	.Distri .Z-border {
		border: 1px solid #1f739b;
		position: relative;
		background: rgba(0, 0, 0, 0.2);
	}
	
	.Distri .Z-Btitle2 {
		font-size: 18px;
		color: #74D4FF;
		margin: 4px 0 0 0px;
	}
	
	.Distri .Z-Stitle {
		display: inline-block;
		height: 23px;
		line-height: 23px;
		padding: 0 8px;
		font-size: 16px;
		border-color: #053c4e;
	}
	
	.Distri .Z-Stitle .Z-b {
		border-color: #00ffff;
	}
	
	#propertyPie1 {
		width: 200px;
		height: 250px;
	}
	
	.Distri .Z-propertyList1 {
		margin-top: -30px;
		margin-right: 1px;
	}
	
	.Distri .Z-propertyList1 li {
		width: 210px;
		height: 37px;
		border: 1px solid #1f749d;
		font-size: 14px;
		padding: 3px 3px;
		padding-bottom: 0px;
		box-sizing: border-box;
		margin-bottom: 3px;
	}
	
	.Distri .Z-propertyList1 h4 {
		font-size: 14px;
		color: #38c1ff;
		margin-top: -4px;
	}
	
	.Distri .Z-propertyList1 p {
		font-size: 12px;
		height: 19px;
	}
	
	.Distri .Z-propertyList1 p span {
		color: #999;
	}
	
	.Distri .Z-propertyList1 p span:nth-of-type(1) {
		font-size: 14px;
		float: left;
	}
	
	.Distri .Z-propertyList1 p span:nth-of-type(2) {
		float: right;
		font-size: 14px;
	}
	
	.Distri .Z-propertyList1 p span i {
		color: #00fff0;
		font-size: 14px;
	}
	
	.Distri .Z-propertyList1 p span sup {
		font-size: 12px;
		color: #999;
	}
	
	.Distri .Z-propertyList1 li:hover {
		background: rgba(0, 246, 255, 0.4);
		border-color: #00f6ff;
	}
</style>