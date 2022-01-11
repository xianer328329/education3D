<template>
	<div class="clearFix securityM">
		<h4 class="mdTitle">当日告警</h4>
		<div class="bd">
			<ul>
				<li class="Z-WarningMessage clearFix">
					<div class="Z-WarningList" @click="operate(1)">
						<div class="Z-WMPie" id="outLinePie"></div>
						<div class="Z-WMPieFont"><i ref="outLine" class="Z-numberf">{{security.outLineRate}}</i><span>设备在线率</span></div>
						<p><i>离线设备</i><span>{{security.offlineUnt}}</span></p>
					</div>
					<div class="Z-WarningList" @click="operate(2)">
						<div class="Z-WMPie" id="abnormalVideoPie"></div>
						<div class="Z-WMPieFont"><i ref="video" class="Z-numberf">{{security.abnormalVideoRate}}</i><span>视频完好率</span></div>
						<p><i>视频质量异常</i><span>{{security.videoUnt}}</span></p>
					</div>
					<div class="Z-WarningList" @click="operate(3)">
						<div class="Z-WMPie" id="abnormalStoragePie"></div>
						<div class="Z-WMPieFont"><i ref="storage" class="Z-numberf">{{security.abnormalStorageRate}}</i><span>存储完好率</span></div>
						<p><i>存储异常</i><span>{{security.storageUnt}}</span></p>
					</div>

				</li>
			</ul>
		</div>
		<h-sub></h-sub>
	</div>

</template>

<script>
	import hSub from './sub.vue';
	export default {
		name: 'IndexChemical',
		components:{
			hSub,//弹窗
		},
		data() {
			return {
				intervalid:null,//定时器
				pieJsonAlarm: {
					color: ["#31859c", "#ffc000"],
					radius: ['70%', '85%'],
					center: ['50%', '50%'],
					emphasis: 'false',
					lege: 'false',
					itemGap: 14,
					fontSize: 16,
					top: 10,
				},
				security: {
					outLineRate: "--%", //设备在线率
					offlineUnt: "--", //离线设备个数
					abnormalVideoRate: "--%", //视频完好率
					videoUnt: "--", //视频异常个数
					abnormalStorageRate: "--%", //存储完好率
					storageUnt: "--" //存储异常个数
				},
				fire: {
					deviceRate: "1", //设备率
					inspectionRate: "2", //巡检率
					patrolInfoRate: "3", //巡查率

				},
				pieDatas:[{value:100,name: "正常"},{value:0,name: "异常"}]
			}
		},
		methods: {
			//弹窗
			operate(i){
				this.bus.$emit('getSecurityMaintenance',i);
			},
			PieDataAlarm(Id, pieDatasAlarm) {
				this.pieJsonAlarm.lege = "false";
				this.pieJsonAlarm.emphasis = "false";
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie(pieDatasAlarm, this.pieJsonAlarm), true);
				allCharts.push(myChart);
				this.$nextTick(function(){
					myChart.resize();
				})
			},
			getMonitorCurrent() { //安防运维完好率 请求接口函数
				this.$axios.post('/working/monitor/monitorCurrentStatus', {
						emulateJSON: true
					})
					.then(this.MonitorCurrentSucc)

			},
			MonitorCurrentSucc(res) { //安防运维完好率接口接收函数

				var data = res;
				var storageNum = res.storageCount; //存储总数
				var storageUnt = res.storageUntreated; //存储异常
				var offlineNum = res.offlineCount; //设备总数
				var offlineUnt = res.offlineUntreated; //离线设备
				var videoNum = res.videoCount; //视频总数
				var videoUnt = res.videoUntreated; //视频异常
				var pieDatasAlarm = [];
				if(offlineNum || offlineNum == "0") { //离线
					pieDatasAlarm = [{
							value: (offlineNum - offlineUnt),
							name: "在线设备"
						},
						{
							value: offlineUnt,
							name: "离线设备"
						},
					];
					var obj = this.$refs.outLine
					this.security.outLineRate = this.pieData(offlineUnt, offlineNum, obj);
					this.security.offlineUnt = offlineUnt;
					this.PieDataAlarm('outLinePie', pieDatasAlarm)

				}
				if(videoNum || videoNum == "0") { //视频
					pieDatasAlarm = [{
							value: (videoNum - videoUnt),
							name: "视频完好"
						},
						{
							value: videoUnt,
							name: "视频异常"
						},
					];
					obj = this.$refs.video
					this.security.abnormalVideoRate = this.pieData(videoUnt, videoNum, obj);
					this.security.videoUnt = videoUnt;
					this.PieDataAlarm('abnormalVideoPie', pieDatasAlarm)

				}
				if(storageNum || storageNum == "0") { //存储
					pieDatasAlarm = [{
							value: (storageNum - storageUnt),
							name: "存储完好"
						},
						{
							value: storageUnt,
							name: "存储异常"
						},
					];
					obj = this.$refs.storage
					this.security.abnormalStorageRate = this.pieData(storageUnt, storageNum, obj);
					this.security.storageUnt = storageUnt;
					this.PieDataAlarm('abnormalStoragePie', pieDatasAlarm)
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
	.securityM,.bd,ul{
		height:100%;
	}
	.bd{
		margin-top: -2rem;
	}
	.orange {
		color: #ff6600;
	}
	.Z-WarningMessage .Z-WarningList p span{
		color: #00FFFF;
	}
</style>