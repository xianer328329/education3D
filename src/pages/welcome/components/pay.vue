<template>
	<div class="clearFix h-container">
		<h4 class="mdTitle">财务缴费</h4>
		<h4 class="mdTitle">用品购买</h4>
		<div class="bd">
			<ul>
				<li class="Z-WarningMessage clearFix">
					<div class="Z-WarningList" @click="operate(1)">
						<div class="Z-WMPie" id="outLinePie"></div>
						<div class="Z-WMPieFont"><i ref="outLine" class="Z-numberf">{{(39/74*100).toFixed(1)}}%</i><span>财务缴费</span></div>
						<p class="ml10 mr10">
							<span>
								<i>已缴费</i><span class="Z-numberf">39</span><i>人</i>
							</span>
							<span class="ml10">
								<i>未缴费</i><span class="Z-numberf">35</span><i>人</i>
							</span>
						</p>
					</div>
					<div class="Z-WarningList" @click="operate(2)">
						<div class="Z-WMPie" id="abnormalVideoPie"></div>
						<div class="Z-WMPieFont"><i ref="video" class="Z-numberf">{{(146/266*100).toFixed(1)}}%</i><span>用品购买</span></div>
						<p>
							<span>
								<i>已购买</i><span class="Z-numberf">146</span><i>人</i>
							</span>
							<span class="ml10">
								<i>未购买</i><span class="Z-numberf">120</span><i>人</i>
							</span>
						</p>
					</div>
				</li>
			</ul>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'pay',
		components:{

		},
		data() {
			return {
				sub:'',
				pieJsonAlarm: {
					'radius': ['75%', '85%'],
					'center': ['50%', '50%'],
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				},
				security: {
					outLineRate: "", //设备在线率
					offlineUnt: "", //离线设备个数
					abnormalVideoRate: "", //视频完好率
					videoUnt: "", //视频异常个数
					abnormalStorageRate: "", //存储完好率
					storageUnt: "" //存储异常个数
				},
				fire: {
					deviceRate: "1", //设备率
					inspectionRate: "2", //巡检率
					patrolInfoRate: "3", //巡查率

				}
			}
		},
		methods: {
			PieDataAlarm(Id, pieDatasAlarm) {
				this.pieJsonAlarm.lege = "false";
				this.pieJsonAlarm.emphasis = "false";
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie(pieDatasAlarm, this.pieJsonAlarm), true);
				allCharts.push(myChart)
			},
			getMonitorCurrent() { //安防运维完好率 请求接口函数
				this.$axios.post('/working/monitor/monitorCurrentStatus', {
						emulateJSON: true
					})
					.then(this.MonitorCurrentSucc)

			},
			MonitorCurrentSucc(res) { //安防运维完好率接口接收函数
				var data = res||{};
				var storageNum = data.storageCount; //存储总数
				var storageUnt = data.storageUntreated; //存储异常
				var offlineNum = data.offlineCount; //设备总数
				var offlineUnt = data.offlineUntreated; //离线设备
				var videoNum = data.videoCount; //视频总数
				var videoUnt = data.videoUntreated; //视频异常
				var pieDatasAlarm = [];
				if(offlineNum || offlineNum == "0") { //离线
					pieDatasAlarm = [{
						value: 39,
						name: "已缴费"
					},
					{
						value: 35,
						name: "未缴费"
					}];
					var obj = this.$refs.outLine
					this.security.outLineRate = this.pieData(offlineUnt, offlineNum, obj);
					this.security.offlineUnt = offlineUnt;
					this.PieDataAlarm('outLinePie', pieDatasAlarm, this.pieJsonAlarm)

				}
				if(videoNum || videoNum == "0") { //视频
					pieDatasAlarm = [{
						value: 146,
						name: "已购买"
					},
					{
						value: 120,
						name: "未购买"
					}];
					obj = this.$refs.video
					this.security.abnormalVideoRate = this.pieData(videoUnt, videoNum, obj);
					this.security.videoUnt = videoUnt;
					this.PieDataAlarm('abnormalVideoPie', pieDatasAlarm, this.pieJsonAlarm)

				}
			},
			pieData(Unt, Num, obj) {
				var rate = "";
				if(Num == "0") {
					rate = "0.0";
					this.pieJsonAlarm.color = ["#ff6600", "#ff6600"]
					obj.style.color = "#ff6600";
				} else {
					var oS = (100 - Unt / Num * 100).toFixed(2);
					oS = oS.substring(0, oS.length - 1);
					rate = oS;
					if(rate < 85.0) {
						this.pieJsonAlarm.color = ["#31859c", "#ff6600"]
						obj.style.color = "#ff6600"
					}else  {
						this.pieJsonAlarm.color = ["#31859c", "#ffc000"]
						obj.style.color = "#ffcc00"
					}
				}

				return rate + '%'
			}
		},
		mounted: function() {
			this.getMonitorCurrent();
		},
		
	}
</script>

<style lang="scss" scoped>
	.h-container{
		font-size: 0px;
		position: relative;
		.bd{
			height: calc(100% - 2rem);
			ul{
				height: 100%;
			}
		}
	}
	.mdTitle{
		display: inline-block;
		width: 50%;
	}
	.ml10{
		margin-left:0.5rem !important;
	}
	.mr10{
		margin-right: 0.5rem;
	}
	.h-container .Z-WarningMessage .Z-WarningList{
		width: 49.5%;
		.Z-WMPieFont{
			i{
				background-size: 45%;
				font-size: 1.2rem;
			}
		}
		p{
			margin-top: 0.5rem;
			text-align: center;
		}
	}
	.orange {
		color: #ff6600;
	}
	.Z-WarningMessage{
		margin-top: 1.25rem !important;
		width: 100% !important;
	}
	.Z-WarningMessage .Z-WarningList p i{
		font-size: 0.8rem !important;
		vertical-align: middle;
	}
	.Z-WarningMessage .Z-WarningList p span{
		font-size: 1rem !important;
		color: #00FFFF;
		margin-left: 2px;
		vertical-align: text-bottom;
	}
</style>