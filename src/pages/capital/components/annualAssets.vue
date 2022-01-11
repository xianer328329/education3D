<template>
	<div class="clearFix EnergyAnalyze">
		<h4 class="mdTitle">资产管理</h4>
		<div class="Z-Left1">
			<ul class="Z-head clearFix">
				<li>
					<p>38.9<em>千万元</em></p>
					<span>固定资产总计</span>
				</li>
				<li>
					<p>38.9<em>千万元</em></p>
					<span>本年增加</span>

				</li>
				<li>
					<p>0.68<em>千万元</em></p>
					<span>本年减少</span>

				</li>
			</ul>
		</div>
		<div>
			<div id="Pianoshapes" class="fl"></div>
			<div class="Z-AssetsDate fr">
				<h5>2019年2月</h5>
				<p>
					<span class="clearFix"><i class="fl">固定资产</i><i class="fr">37.2<em>千万</em></i></span>
					<span class="clearFix"><i class="fl">新增资产</i><i class="fr"> 0.35<em>千万</em></i></span>
					<span class="clearFix"><i class="fl">减少资产</i><i class="fr">0.18<em>千万</em></i></span>
				</p>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'annualAssets',
		data() {
			return {}
		},
		mounted: function() {
			this.setPianoshapes("Pianoshapes");
		},
		methods: {
			setPianoshapes(Id) {
				var barJson = {
					name: ["新增资产", "减少资产"],
					oxAxis: this.AssetsDate(),
					data1: [35, 30, 33, 32, 25, 28, 30, 31, 45, 46, 48, 42, 46, 42, 48, 42, 38, 40, 42, 39, 34, 25, 29, 30],
					data2: [-18, -15, -13, -16, -20, -21, -15, -28, -30, -15, -17, -20, -22, -15, -14, -18, -19, -21, -23, -25, -20, -11, -12, -14],
				}
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(barBothway(barJson), true);
			},
			AssetsDate() {
				var dataX = [];
				var dottedBase = new Date();
				var Year = dottedBase.getFullYear();
				var Month = dottedBase.getMonth() + 1;
				for(var i = 0; i < 24; i++) {
					if(Month == 0) {
						Year -= 1;
						Month = 12;
					}
					dataX.unshift([
						Year,
						Month
					].join('-'));
					Month--;
				}
				return dataX
			},
		},
	}
</script>

<style lang="stylus" scoped>
	* {
		color: #75CBF2
	}
	
	#Pianoshapes {
		width: 290px;
		height: 135px;
	}
	
	.Z-head {
		width: 586px;
		margin-bottom: 6px;
		margin-top: 20px;
	}
	
	.Z-head li {
		width: 147px;
		height: 70px;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		opacity: 0.8;
		margin-left: 5px;
		text-align: center;
		float: left;
	}
	
	.Z-head li h6 {
		font-size: 18px;
		color: #74d4ff;
	}
	
	.Z-head li p {
		font-size: 24px;
		font-family: "DIN Medium";
		font-weight: bold;
		color: rgba(255, 204, 0, 1);
		line-height: 36px;
		background: url(../../../../static/images/img4.png) no-repeat bottom;
		margin-bottom: 2px;
	}
	
	.Z-head span {
		font-size: 14px;
		font-family: "Microso ftYaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		line-height: 24px;
	}
	
	.Z-head li em {
		font-size: 12px;
		font-family: "Microsoft YaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.Z-AssetsDate {
		width: 170px;
		height: 124px;
		border: 1px solid #1f77a2;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 10px;
	}
	
	.Z-AssetsDate h5 {
		background: rgba(56, 193, 255, 0.5);
		font-size: 22px;
		color: #ffffff;
		text-align: center;
	}
	
	.Z-AssetsDate p {
		width: 194px;
		height: 88px;
		padding: 8px 10px 0px 10px;
		box-sizing: border-box;
		font-size: 16px;
	}
	
	.Z-AssetsDate p span i {
		color: #ffffff;
	}
	
	.Z-AssetsDate p span {
		margin-right: 15px;
		margin-bottom: 7px;
		display: block;
	}
	
	.Z-AssetsDate p span em {
		font-size: 12px;
	}
	
	.Z-AssetsDate p span:nth-of-type(2) i {
		color: #6acae6;
	}
	
	.Z-AssetsDate p span:nth-of-type(3) i {
		color: #c96bd6;
	}
	
	.Z-AssetsDate p span:nth-of-type(2) em {
		color: #6acae6;
	}
	
	.Z-AssetsDate p span:nth-of-type(3) em {
		color: #c96bd6;
	}
</style>