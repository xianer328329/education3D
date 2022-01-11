<template>
	<div class="clearFix h-container alarmTypes">
		<div class="h-time-c">
			<a :class="{'active':curr==1}" @click="operate(1)">当日</a>
			<a :class="{'active':curr==2}" @click="operate(2)">当月</a>
			<a :class="{'active':curr==3}" @click="operate(3)">当年</a>
		</div>
		<h4 class="mdTitle">告警类型占比</h4>
		<div class="bd">
			<div class="h-chart" ref="outLine" id="outLinePie"></div>
			<div class="Z-numberf h-tip">680</div>
			<p class="h-bottom-tip clearFix">
				<span class="fl">设备告警</span>
				<span class="fr"><i>680</i><i>68%</i></span>
			</p>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'alarmTypes',
		data() {
			return {
				sub:'',
				curr:2,
				pieJsonAlarm: {
					color: ["#CC1010","#FF9900","#32C872","#0478B7"],
					radius: ['53%', '65%'],
					center: ['27%', '40%'],
					emphasis: 'false',
					lege: true,
					itemGap: 10,
					fontSize: 18,
					top: 35,
				},
			}
		},
		methods: {
			//弹窗
			operate(i){
				this.curr=i;
			},
			PieDataAlarm(Id, pieDatasAlarm) {
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie(pieDatasAlarm, this.pieJsonAlarm), true);
			},
			getMonitorCurrent() { //安防运维完好率 请求接口函数
				this.$axios.post('/working/monitor/monitorCurrentStatus', {
						emulateJSON: true
					})
					.then(this.MonitorCurrentSucc)

			},
			MonitorCurrentSucc(res) { //安防运维完好率接口接收函数

				var data = res.data.data;
				var storageNum = data.storageCount; //存储总数
				var storageUnt = data.storageUntreated; //存储异常
				var offlineNum = data.offlineCount; //设备总数
				var offlineUnt = data.offlineUntreated; //离线设备
				var videoNum = data.videoCount; //视频总数
				var videoUnt = data.videoUntreated; //视频异常
				var pieDatasAlarm = [{
					value: 38,
					name: "违规电器"
				},{
					value: 13,
					name: "离线设备"
				},{
					value: 13,
					name: "漏电"
				},{
					value: 13,
					name: "其他"
				}];
				this.PieDataAlarm('outLinePie', pieDatasAlarm, this.pieJsonAlarm)

			},
		},
		mounted: function() {
			this.getMonitorCurrent();
		},
		
	}
</script>

<style lang="scss" scoped>
	.alarmTypes{
		height: 100%;
		.bd{
			position: absolute;
			top: 50px;
			bottom: 15px;
			left: 0px;
			width: 100%;
			.h-chart{
				width: 90%;
				height: 100%;
				margin: auto;
			}
			.h-tip{
				position: absolute;
				left: 29%;
				top: 40%;
				transform: translate(-50%,-50%);
				font-size: 30px;
				color: #00FFFF;
			}
			.h-bottom-tip{
				position: absolute;
				bottom: 0px;
				left: 12.5%;
				right: 12.5%;
				padding: 5px 10px;
				border: 1px solid rgba(0, 255, 255, 0.58);
				color: #75CBF2;
				span{
					font-size: 20px;
				}
				i{
					margin-left: 30px;
					color: #0ff;
					font-size: 20px;
				}
			}
		}
		.h-time-c a{
			width: 50px;
		}
	}
</style>