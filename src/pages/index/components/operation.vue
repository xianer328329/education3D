<template>
	<div class="operation">
		<el-carousel class="Zslide" indicator-position="outside" height="100%" trigger="click" arrow="never" :interval="interval" autoplay >
			<el-carousel-item label="安防运维" class="Z-WarningMessage clearFix">
				<div class="Z-WarningList">
					<div class="Z-WMPie" id="outLinePie"></div>
					<div class="Z-WMPieFont"><i ref="outLine">{{security.outLineRate}}</i><span>设备在线率</span></div>
					<p><span>{{security.offlineUnt}}</span><i>离线设备</i></p>
				</div>
				<div class="Z-WarningList">
					<div class="Z-WMPie" id="abnormalVideoPie"></div>
					<div class="Z-WMPieFont"><i ref="video">{{security.abnormalVideoRate}}</i><span>视频完好率</span></div>
					<p><span>{{security.videoUnt}}</span><i>视频质量异常</i></p>
				</div>
				<div class="Z-WarningList">
					<div class="Z-WMPie" id="abnormalStoragePie"></div>
					<div class="Z-WMPieFont"><i ref="storage">{{security.abnormalStorageRate}}</i><span>存储完好率</span></div>
					<p><span>{{security.storageUnt}}</span><i>存储异常</i></p>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	export default {
		name: 'IndexOperation',
		data() {
			return {
				interval:10000,//轮播间隔秒数
				pieJsonAlarm: {
					color: ["#31859c", "#ffc000"],
					radius: ['70%', '85%'],
					center: ['50%', '50%'],
					emphasis: 'false',
					lege: 'false',
					itemGap: 14,
					fontSize: 18,
					top: 10,
				},
				pieDatasAlarm: [{
						value: 100,
						name: "在线设备"
					},
					{
						value: 0,
						name: "离线设备"
					},
				],
				security: {
					outLineRate: "--%", //设备在线率
					offlineUnt: "--", //离线设备个数
					abnormalVideoRate: "--%", //视频完好率
					videoUnt: "--", //视频异常个数
					abnormalStorageRate: "--%", //存储完好率
					storageUnt: "--" //存储异常个数
				},
				fire: {
					deviceRate: "--%", //设备率
					inspectionRate: "--%", //巡检率
					patrolInfoRate: "--%", //巡查率

				}
			}
		},
		methods: {
			PieDataAlarm(Id, pieDatasAlarm,pieJsonAlarm) {
				var vm=this;
				vm.pieJsonAlarm.lege = "false";
				vm.pieJsonAlarm.emphasis = "false";
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(Pie222(pieDatasAlarm, vm.pieJsonAlarm), true);
				allCharts.push(myChart);
				this.$nextTick(function(){
					myChart.resize();
				})

			},
			getMonitorCurrent() { //安防运维完好率 请求接口函数
				var _this = this;
				this.$axios.post('/home/monitorCurrentStatus', {
						emulateJSON: true
					})
					.then(this.MonitorCurrentSucc)

			},
			MonitorCurrentSucc(res) { //安防运维完好率接口接收函数
				var data = res;
				var storageNum = data.storageCount; //存储总数
				var storageUnt = data.storageUntreated; //存储异常
				var offlineNum = data.offlineCount; //设备总数
				var offlineUnt = data.offlineUntreated; //离线设备
				var videoNum = data.videoCount; //视频总数
				var videoUnt = data.videoUntreated; //视频异常
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
					this.PieDataAlarm('outLinePie', pieDatasAlarm, this.pieJsonAlarm)
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
					this.PieDataAlarm('abnormalVideoPie', pieDatasAlarm, this.pieJsonAlarm)

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
					this.PieDataAlarm('abnormalStoragePie', pieDatasAlarm, this.pieJsonAlarm)
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
					} else {
						this.pieJsonAlarm.color = ["#31859c", "#ffc000"]
						obj.style.color = "#ffcc00"
					}
				}

				return rate + '%'
			},
		},
		created: function() {},
		mounted: function() {
			this.getMonitorCurrent();
		},
	}
</script>

<style lang="scss" scoped>
.el-carousel{
	height: 100%;
}
.Z-WarningList p{
	i,span{
		font-size:0.75rem;
		display: block !important;
	}
}
</style>