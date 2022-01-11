<template>
	<div class="distr">
		<div class="clearFix">
			<h4 class="Z-Btitle">资产分布 <back-box class="Z-Stitle Z-border">教育大类</back-box></h4>
			<div id="propertyPie2" class="fl"></div>
			<div class="Z-propertyListB fl">
				<ul class="Z-propertyList1 fl">
					<li>
						<h4>房屋及建筑物</h4>
						<p class="clearFix"><span><i>8.1</i>千万元 (<i>20.8</i>%)</span><span><i>96</i>平方米</span></p>
					</li>
					<li class="maxli">
						<h4>土地及植物</h4>
						<p class="clearFix" style="margin-top:10px;"><span><i>5.1</i>千万元 (<i>13.1</i>%)</span></p>
						<p class="clearFix" style="margin-top:3px; margin-bottom:14px;"><span><i>2319</i>件</span><span><i>2129</i>亩</span></p>
					</li>
					<li>
						<h4>机电设备</h4>
						<p class="clearFix"><span><i>4.7</i>千万元 (<i>12.1</i>%)</span><span><i>737</i>件</span></p>
					</li>
					<li>
						<h4>电子设备</h4>
						<p class="clearFix"><span><i>4.2</i>千万元 (<i>10.8</i>%)</span><span><i>278</i>件</span></p>
					</li>
					<li>
						<h4>家具</h4>
						<p class="clearFix"><span><i>3.6</i>千万元 (<i>9.3</i>%)</span><span><i>61228</i>件</span></p>
					</li>

				</ul>
				<ul class="Z-propertyList1 fl">
					<li>
						<h4>文体设备</h4>
						<p class="clearFix"><span><i>2.8</i>千万元 (<i>7.2</i>%)</span><span><i>1227</i>件</span></p>
					</li>
					<li>
						<h4>行政办公设备</h4>
						<p class="clearFix"><span><i>2.0</i>千万元 (<i>5.7</i>%)</span><span><i>412</i>件</span></p>
					</li>
					<li>
						<h4>图书</h4>
						<p class="clearFix"><span><i>1.7</i>千万元 (<i>4.9</i>%)</span><span><i>283</i>万册</span></p>
					</li>
					<li>
						<h4>仪器仪表</h4>
						<p class="clearFix"><span><i>4.7</i>千万元 (<i>4.4</i>%)</span><span><i>827</i>件</span></p>
					</li>
					<li>
						<h4>无形资产</h4>
						<p class="clearFix"><span><i>4.2</i>千万元 (<i>4.1</i>%)</span><span><i>89</i>件</span></p>
					</li>
					<li>
						<h4>文物及陈列品</h4>
						<p class="clearFix"><span><i>1.1</i>千万元 (<i>3.3</i>%)</span><span><i>56</i>件</span></p>
					</li>

				</ul>
				<ul class="Z-propertyList1 fl">
					<li>
						<h4>工具、量具和器皿</h4>
						<p class="clearFix"><span><i>1.0</i>千万元 (<i>2.2</i>%)</span><span><i>1227</i>件</span></p>
					</li>
					<li>
						<h4>印刷机械</h4>
						<p class="clearFix"><span><i>0.7</i>千万元 (<i>2.1</i>%)</span><span><i>1827</i>件</span></p>
					</li>
					<li>
						<h4>标本模型</h4>
						<p class="clearFix"><span><i>0.5</i>千万元 (<i>1.3</i>%)</span><span><i>962</i>万册</span></p>
					</li>
					<li>
						<h4>被服装具</h4>
						<p class="clearFix"><span><i>0.5</i>千万元 (<i>0.8</i>%)</span><span><i>13827</i>件</span></p>
					</li>
					<li>
						<h4>卫生医疗器械</h4>
						<p class="clearFix"><span><i>0.2</i>千万元 (<i>0.5</i>%)</span><span><i>327</i>件</span></p>
					</li>
					<li>
						<h4>牲畜</h4>
						<p class="clearFix"><span><i>0</i>千万元 (<i>0</i>%)</span><span><i>0</i>头</span></p>
					</li>

				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		mounted: function() {
			this.PieData2('propertyPie2');
		},
		methods: {
			PieData2(Id) {
				var pieDatas2 = [{
						value: 8.1,
						name: '房屋及建筑物'
					},
					{
						value: 5.1,
						name: '土地及植物'
					},
					{
						value: 4.7,
						name: '机电设备'
					},
					{
						value: 4.5,
						name: '仪器仪表'
					},
					{
						value: 4.2,
						name: '无形资产'
					},
					{
						value: 4.0,
						name: '电子设备'
					},
					{
						value: 3.6,
						name: '家具'
					},
					{
						value: 2.8,
						name: '文体设备'
					},
					{
						value: 2.0,
						name: '行政办公设备'
					},
					{
						value: 1.7,
						name: '图书'
					},

					{
						value: 1.1,
						name: '文物及陈列品'
					},
					{
						value: 1.0,
						name: '工具、量具和器皿'
					},
					{
						value: 0.7,
						name: '印刷机械'
					},
					{
						value: 0.5,
						name: '标本模型'
					},
					{
						value: 0.5,
						name: '被服装具'
					},
					{
						value: 0.2,
						name: '卫生医疗器械'
					},
					{
						value: 0,
						name: '牲畜'
					},

				]
				var pieJson2 = {
					'color': ['#58acd1', '#4fa1c6', '#338fb8', '#2a87b0', '#237fa8', '#196b8f', '#0a4662'],
					'radius': '50%',
					'center': ['50%', '50%'],
					'tValue': 'false',
					'fontSize2': '12',
				}
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie2T(pieDatas2, pieJson2), true);
			}
		},
	}
</script>

<style lang="stylus" scoped>
	.distr .Z-propertyList1 {
		margin-top: -25px;
		margin-left: 5px;
	}
	
	.distr .Z-propertyList1 li {
		width: 205px;
		height: 42px;
		border: 1px solid #1f749d;
		font-size: 14px;
		padding: 3px 3px;
		padding-bottom: 0px;
		box-sizing: border-box;
		margin-bottom: 5px;
	}
	
	.distr .Z-propertyList1 h4 {
		color: #38c1ff;
		margin-top: -4px;
		font-size: 14px;
	}
	
	.distr .Z-propertyList1 p {
		font-size: 12px;
		margin-top: 2px;
		height: 19px;
	}
	
	.distr .Z-propertyList1 p span {
		color: #999;
	}
	
	.distr .Z-propertyList1 p span:nth-of-type(1) {
		float: left;
		font-size: 14px;
	}
	
	.distr .Z-propertyList1 p span:nth-of-type(2) {
		float: right;
		font-size: 14px;
	}
	
	.distr .Z-propertyList1 p span i {
		color: #00fff0;
		font-size: 14px;
	}
	
	.distr .Z-propertyList1 p span sup {
		color: #999;
	}
	
	.distr .Z-propertyList1 li:hover {
		background: rgba(0, 246, 255, 0.4);
		border-color: #00f6ff;
	}
	
	.Z-propertyListB {
		/*width: 690px;*/
	}
	
	#propertyPie2 {
		width: 273px;
		height: 250px;
	}
	
	.distr .Z-Btitle {
		font-size: 18px;
		color: #74d4ff;
	}
	
	.distr .Z-Stitle {
		display: inline-block;
		height: 23px;
		line-height: 23px;
		padding: 0 8px;
		font-size: 16px;
		border-color: #053c4e;
	}
	.distr .Z-propertyList1 .maxli {
		height: 89px;
	}
</style>