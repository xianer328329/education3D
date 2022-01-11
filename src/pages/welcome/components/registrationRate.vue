<template>
	<div class="clearFix ">
		<h4 class="mdTitle">新生报到率</h4>
		<div class="h-container">
			<ul>
				<li class="Z-WarningMessage clearFix">
					<div class="Z-WarningList">
						<div class="Z-WMPie" id="registrationRate"></div>
						<div class="Z-WMPieFont"><i ref="registrationRate" class="Z-numberf">{{(5259/6920*100).toFixed(1)}}%</i><span>新生报到率</span></div>
						<p>
							<span class="Z-numberf">5259</span><i class="h-splitline">|</i><i class="Z-numberf">6920</i>
						</p>
					</div>
					<div class="Z-WarningList">
						<div class="Z-WMPie" id="acceptRate"></div>
						<div class="Z-WMPieFont"><i ref="acceptRate" class="Z-numberf">{{(5159/6020*100).toFixed(1)}}%</i><span>录取率</span></div>
						<p>
							<span class="Z-numberf">5159</span><i class="h-splitline">|</i><i class="Z-numberf">6020</i>
						</p>
					</div>
					<div class="Z-WarningList">
						<div class="Z-WMPie" id="schoolStudents"></div>
						<div class="Z-WMPieFont"><i ref="schoolStudents" class="Z-numberf">{{(5159/6020*100).toFixed(1)}}%</i><span>在校生统计</span></div>
						<p>
							<span class="Z-numberf">5159</span><i class="h-splitline">|</i><i class="Z-numberf">6020</i>
						</p>
					</div>
				</li>
			</ul>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'registrationRate',
		components:{

		},
		data() {
			return {
				sub:'',
				pieJsonAlarm: {
					'radius': ['65%', '75%'],
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
				allCharts.push(myChart);
			},
			getMonitorCurrent() { //安防运维完好率 请求接口函数
				this.$axios.post('/working/monitor/monitorCurrentStatus', {
						emulateJSON: true
					})
					.then(this.MonitorCurrentSucc)

			},
			MonitorCurrentSucc(res) { //安防运维完好率接口接收函数

				var data = res||{};

				var offlineNum = data.offlineCount; //设备总数
				var offlineUnt = data.offlineUntreated; //离线设备
				var videoNum = data.videoCount; //视频总数
				var videoUnt = data.videoUntreated;
				var pieDatasAlarm = [];
					pieDatasAlarm = [{
						value: 5259,
						name: "已报到"
					},
					{
						value: 1661,
						name: "未报到"
					}];
					var obj = this.$refs.registrationRate
					this.security.outLineRate = this.pieData(offlineUnt, offlineNum, obj);
					this.security.offlineUnt = offlineUnt;
					this.PieDataAlarm('registrationRate', pieDatasAlarm, this.pieJsonAlarm);
					
					pieDatasAlarm = [{
						value: 5159,
						name: "已录取"
					},
					{
						value: 861,
						name: "未录取"
					}];
					obj = this.$refs.acceptRate;
					this.security.abnormalVideoRate = this.pieData(videoUnt, videoNum, obj);
					this.security.videoUnt = videoUnt;
					this.PieDataAlarm('acceptRate', pieDatasAlarm, this.pieJsonAlarm);
					
					pieDatasAlarm = [{
						value: 5159,
						name: "在校"
					},
					{
						value: 861,
						name: "离校"
					}];
					obj = this.$refs.schoolStudents;
					this.security.abnormalVideoRate = this.pieData(videoUnt, videoNum, obj);
					this.security.videoUnt = videoUnt;
					this.PieDataAlarm('schoolStudents', pieDatasAlarm, this.pieJsonAlarm);
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
			this.bus.$on('closeFooddialog',this.closeSub);
		},
		
	}
</script>

<style lang="scss" scoped>
	.h-container{
		height: calc(100% - 2rem);
		ul{
			height: 100%;
		}
	}
	.ml10{
		margin-left:0.5rem !important;
	}
	.mr10{
		margin-right: 0.5rem;
	}
	.h-container .Z-WarningMessage .Z-WarningList{
		width: 33%;
		.Z-WMPieFont{
			i{
				background-size: 54%;
				font-size: 1.2rem;
			}
		}
	}
	.orange {
		color: #ff6600;
	}
	.Z-WarningMessage{
		margin-top: 0.5rem !important;
		width: 102% !important;
	}
	.Z-WarningMessage .Z-WarningList p{
		 margin-top: 1rem;
		 text-align: center;
		 span{
		 	display: inline-block;
			font-size: 1.2rem !important;
			color: #00FFFF;
			margin-left: 2px;
		}
		i{
			display: inline-block;
			font-size: 1.2rem;
			color: #75CBF2;
			&.h-splitline{
				display: inline-block;
				margin: 0px 0.25rem;
				line-height: 0.9rem;
				font-size: 0.9rem;
				position: relative;
				top: -0.1rem;
			}
		}
		
	}
</style>