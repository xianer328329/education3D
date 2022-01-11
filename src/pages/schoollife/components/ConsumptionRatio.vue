<template>
	<div class="consum">
		<h4 class="mdTitle">消费占比</h4>
		<month-selc :ondate="analyDate" @monDateTimeChange='consumDate'></month-selc>
		<div class="pie-consumption backboxContainer vertical-middle-c">
			<div v-show="!noData" id="consumptionratio"></div>
			<div v-show="noData" class="pieNoData vertical-middle vertical-middle-c"><span class="vertical-middle">暂无数据</span></div>
		</div>
	</div>
</template>
<script>
	import MonthSelc from '../../components/monthSelection'
	export default {
		components: {
			MonthSelc,
		},
		data() {
			return {
				noData: true,
				analyDate: null,
			}
		},
		mounted: function() {
			var _this = this
			var nowdays = new Date();
			var year = nowdays.getFullYear();
			var month = nowdays.getMonth();
			if(month == 0) {
				month = 12;
				year = year - 1;
			}
			if(month < 10) {
				month = "0" + month;
			}
		
			this.analyDate = year + "-" + month + "-01" ;
			this.getfeeDevice(); //获取消费占比数据

		},
		methods: {
			consumDate(mes) {
				this.analyDate = mes + '-01';
				if(this.analyDate) {
					this.getfeeDevice()
				}
			},
			getfeeDevice() {
				var _this = this;
				var params = new FormData();
				params.append('analyDate', this.analyDate);
				this.$axios.post('/traffic/life/feeDevice/' + UNITID, params).then((res) => {
						var data = res.deviceList || [];
						data.forEach((item) => {
							item.value = item.consumption.toFixed(1);
							item.name = item.deviceName;
						})
						_this.Pieconsumptionratio(data); //消费占比
				})
			},
			Pieconsumptionratio(data) {
				var Jsondata = data;
				var SetupJsondata = {
					'color': ['#0a5898', '#2e8ad3', '#75cbf2', '#198b8b', '#1db3b3', '#15d5d5', '#1f53b6', '#3f78e3', '#6fa0fb'], //颜色list
					'radius': ['45%', '60%'], //圆环大小
					'linecolor': '#015c69', //视觉引导线颜色
					'fontcolor': '#75cbf2', //文字颜色
					'fontSize': 14, //文字大小
					'title': "消费占比"
				}
				if(Jsondata && Jsondata.length > 0) {
					this.noData = false;
					this.$nextTick(function(){
						var myChart = echarts.init(document.getElementById("consumptionratio"));
						myChart.setOption(Ringdiagram(Jsondata, SetupJsondata), true);
						allCharts.push(myChart);
					})
				} else {
					this.noData = true;
				}

			},
		},
	}
</script>

<style lang="scss">	
	.consum .boxtitle {
		color: #75CBF2;
	}
	
	#consumptionratio {
		height: 100%;
		width: 100%;
	}
	
	.vertical-middle.pieNoData {
		width: 8rem;
		height: 8rem;
		margin: 0 auto;
		border: 0.75rem solid #1D3F65;
		border-radius: 50%;
		color: #999;
		text-align: center;
	}
</style>