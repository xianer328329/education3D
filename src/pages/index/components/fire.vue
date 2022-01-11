<template>
	<div>
		<h4 class="mdTitle">校园消防</h4>
		<span class="dtatTitle">{{YYMM}}</span>
		<ul class="amountCom amountBoxUp clearFix">
			<li class="fl amount">
				<div class="amount-content">
					<span><i>{{fireAlarmNum}}</i>次</span>
					<p>本月火警累计</p>
				</div>
			</li>
			<li class="fr amount">
				<div class="amount-content">
					<span><i>{{earlyWarningNum}}</i>次</span>
					<p>本月预警累计</p>
				</div>
			</li>
		</ul>
		<div id="fireLine"></div>
	</div>
</template>

<script>
	/* eslint-disable */
	import axios from 'axios'

	export default {
		name: 'IndexFire',
		data() {
			return {
				YYMM: (new Date()).Format("yyyy-MM"),
				alarmList: {
					BJdata1: [], //火警
					BJdata2: [], //预警
					color: ['#A02923', '#ed7703', 'rgba(255,132,0,0)', 'rgba(255,132,0,0)'],
					name: ['火警', '预警'],
					oxAxis: [],
					splitNumber:3,
					oMax: function(value) {
						return value.max + 20;
					},
					Yname: "次",
					leg: false
				},
				fireAlarmNum: "--",
				earlyWarningNum: "--"
			}
		},
		methods: {
			LineData(Id, alarmList) {
				if(document.getElementById(Id)){
					this.$nextTick(function(){
						var mTime3 = null;
						var myChart = echarts.init(document.getElementById(Id));
						myChart.setOption(LineChart(alarmList), true);
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
							if (index > alarmList.data2.length) {
								index = 0;
							}
						}, 3000);
					})
				}
			},
			alarmTrend() {
				var _this = this;
				this.$axios.post('fire/fire/home/alarmTrend', {
						emulataJSON: true
					})
					.then(this.alarmTrendSucc)
			},
			alarmTrendSucc(res) {
				this.fireAlarmNum = 0;
				this.earlyWarningNum = 0;
				this.alarmList.oxAxis = [];
				this.alarmList.data1 = [];
				this.alarmList.data2 = [];
				var eDate = new Date();
				var oMonth = eDate.getMonth() + 1;
				day30DataC(res, 'alarmTime', 'fireAlarm', 'earlyWarning', this.alarmList)
				this.addData(oMonth, res)
				this.LineData('fireLine', this.alarmList);

			},
			addData(oMonth, data) {
				for (var i = 0; i < data.length; i++) {
					var mm = data[i].alarmTime.split("-")[1];
					if (oMonth == mm) {
						this.fireAlarmNum += data[i].fireAlarm;
						this.earlyWarningNum += data[i].earlyWarning;
					}
				}
			}
		},
		mounted: function() {
			this.alarmTrend();
		},
	}
</script>

<style lang="scss" scoped>
	#fireLine {
		width: 100%;
		height: calc(100% - 5.5rem);
		margin-top: 0.35rem;
		z-index: 3;
		position: relative;
	}

	.amountBoxUp .amount {
		width: 49%;
		height: auto;
		margin-bottom: 0px;
	}

	.amountBoxUp .amount span {
		margin-top: -1px;
	}
</style>
