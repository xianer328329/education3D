<template>
	<div class="clearFix h-container">
		<div class="h-time-c">
			<a class="active"@click="showSub(1)">发起联防布控</a>
		</div>
		<h4 class="mdTitle">食品安全链分析</h4>
		<div class="bd">
			<ul>
				<li class="Z-WarningMessage clearFix">
					<div class="Z-WarningList" @click="operate(1)">
						<div class="Z-WMPie" id="outLinePie"></div>
						<div class="Z-WMPieFont"><i ref="outLine" class="Z-numberf">{{(38/51*100).toFixed(1)}}%</i><span>供应商备案率</span></div>
						<p class="ml-15">
							<span>
								<i>供应商</i><span class="Z-numberf">51</span>
							</span>
							<span  class="ml10">
								<i>已备案</i><span class="Z-numberf">38</span>
							</span>
						</p>
					</div>
					<div class="Z-WarningList" @click="operate(2)">
						<div class="Z-WMPie" id="abnormalVideoPie"></div>
						<div class="Z-WMPieFont"><i ref="video" class="Z-numberf">{{(112/128*100).toFixed(1)}}%</i><span>持证上岗率</span></div>
						<p class="ml-15">
							<span>
								<i>工作人员</i><span class="Z-numberf">128</span>
							</span>
							<span class="ml10">
								<i>持健康证</i><span class="Z-numberf">112</span>
							</span>
						</p>
					</div>
				</li>
			</ul>
		</div>
		<el-dialog title="新增联防布控" center width="30%" :modal-append-to-body="false" :visible="sub==1" :before-close="closeSub">
			<adduserControl></adduserControl>
		</el-dialog>
	</div>

</template>

<script>
	import adduserControl from './adduserControl.vue'
	export default {
		name: 'IndexChemical',
		components:{
	adduserControl
		},
		data() {
			return {
				sub:'',
				pieJsonAlarm: {
					'radius': ['65', '75'],
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
			//显示添加联防布控
			showSub(i) {
				this.sub = i;
			},
			closeSub(){
				this.sub='';
			},
			//弹窗
			operate(i){
				this.bus.$emit('getSecurityMaintenance',i);
			},
			PieDataAlarm(Id, pieDatasAlarm) {
				this.pieJsonAlarm.lege = "false";
				this.pieJsonAlarm.emphasis = "false";
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
				var pieDatasAlarm = [];
				if(offlineNum || offlineNum == "0") { //离线
					pieDatasAlarm = [{
						value: 38,
						name: "已备案"
					},
					{
						value: 13,
						name: "未备案"
					}];
					var obj = this.$refs.outLine
					this.security.outLineRate = this.pieData(offlineUnt, offlineNum, obj);
					this.security.offlineUnt = offlineUnt;
					this.PieDataAlarm('outLinePie', pieDatasAlarm, this.pieJsonAlarm)

				}
				if(videoNum || videoNum == "0") { //视频
					pieDatasAlarm = [{
						value: 112,
						name: "持健康证"
					},
					{
						value: 128-112,
						name: "未持健康证"
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
			this.bus.$on('closeFooddialog',this.closeSub);
		},
		
	}
</script>

<style lang="scss" scoped>
	.ml10{
		margin-left:10px !important;
	}
	.ml-15{
		margin-left: -15px;
	}
	.h-container .Z-WarningMessage .Z-WarningList{
		width: 49.5%;
		.Z-WMPieFont{
			i{
				background-size: 54%;
				font-size: 24px;
			}
		}
		p{
			margin-top: 15px;
			text-align: center;
		}
	}
	.orange {
		color: #ff6600;
	}
	.Z-WarningMessage{
		margin-top: 35px !important;
		width: 102% !important;
	}
	.Z-WarningMessage .Z-WarningList p i{
		font-size: 16px !important;
		vertical-align: middle;
	}
	.Z-WarningMessage .Z-WarningList p span{
		font-size: 20px !important;
		/*font-weight: bold;*/
		color: #00FFFF;
		margin-left: 2px;
		vertical-align: middle;
	}
</style>