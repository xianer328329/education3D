<template>
	<div class="distrAna">
		<h4 class="mdTitle">资产处置分析</h4>
		<div class="Ana-box">
			<div class="Ana-img fl"></div>
			<div class="Ana-tile fl">
				<span class="Ana-boxtitle">本年累计处置资产</span>
			</div>
			<div class="Ana-boxi fr">
				<i>126</i><small>万元</small>
			</div>
		</div>
		<div class="Ana-box">
			<div class="Ana-img2 fl"></div>
			<div class="Ana-tile fl">
				<span class="Ana-boxtitle">上年累计处置资产</span>
			</div>
			<div class="Ana-boxi fr">
				<i>126</i><small>万元</small>
			</div>
		</div>
		<div id="Anabar"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				List: {
					data1: [10, 12, 18, 30, 15, 27, 20, 19, 24, 21, 17, 23], //本年
					data2: [8, 19, 24, 27, 19, 34, 27, 25, 27, 24, 22, 25], //去年
					color: ['#A02923', '#ed7703', 'rgba(255,132,0,0)', 'rgba(255,132,0,0)'],
					name: ['本年', '去年'],
					oxAxis: ["18-03", "18-04", "18-05", "18-06", "18-07", "18-08", "18-09", "18-10", "18-11", "18-12", "19-1", "19-2"],
					oMax: function(value) {
						return value.max + 20;
					},
					Yname: "万元",
					leg: false,
					xAxisinterval:0,
				},
			}
		},
		mounted: function() {
		this.LineData("Anabar",this.List);
		},
		methods: {
			LineData(Id, alarmList) {
				var mTime3 = null;
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Linebar(alarmList), true);
				var index = 0; //播放所在下标  
				clearInterval(mTime3);
				mTime3 = setInterval(function() {
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index
					});
					index++;
					if(index > alarmList.data2.length) {
						index = 0;
					}
				}, 3000);
			},
		},
	}
</script>

<style>
	#Anabar {
		margin-top: 10px;
		height: 220px;
		width: 100%;
	}
	
	.Ana-boxi small {
		font-size: 12px;
		font-family: "Microsoft YaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.Ana-boxi i {
		font-size: 24px;
		font-family: "DIN Medium";
		font-weight: bold;
		color: rgba(0, 255, 255, 1);
		margin-right: 5px;
	}
	
	.Ana-boxi {
		line-height: 50px;
		height: 50px;
		padding-right: 10px;
		background: rgba(0, 36, 61, 1);
	}
	
	.Ana-boxtitle {
		font-size: 16px;
		font-family: "Microsoft YaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.Ana-tile {
		margin-left: 10px;
		line-height: 50px;
	}
	
	.Ana-img2 {
		width: 50px;
		height: 100%;
		text-align: left;
		background: rgba(19, 82, 126, 0.3) url('../../../../static/images/Education/icon_mony2.png') no-repeat center;
	}
	
	.Ana-img {
		width: 50px;
		height: 100%;
		text-align: left;
		background: rgba(19, 82, 126, 0.3) url('../../../../static/images/Education/icon_mony.png') no-repeat center;
	}
	
	.Ana-box {
		width: 444px;
		height: 50px;
		margin: 0 auto;
		margin-top: 10px;
		background: rgba(0, 36, 61, 1);
	}
	
	.distrAna {
		width: 100%;
		height: 100%;
	}
	
	.imgan {
		height: 100%;
		width: 100%;
	}
</style>