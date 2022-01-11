<template>
	<div class="operation">
		<el-carousel class="Zslide" indicator-position="outside" height="100%" trigger="click" arrow="never" :interval="interval" autoplay >
			<el-carousel-item label="消防运维" class="Z-WarningMessage clearFix">
				<div class="Z-WarningList">
					<div class="Z-WMPie" id="facilityPie"></div>
					<div class="Z-WMPieFont"><i ref="device">{{fire.deviceRate}}</i><span>设备完好率</span></div>

				</div>
				<div class="Z-WarningList">
					<div class="Z-WMPie" id="patrolPie"></div>
					<div class="Z-WMPieFont"><i ref="patrolInfo">{{fire.patrolInfoRate}}</i><span>巡查率</span></div>

				</div>
				<div class="Z-WarningList">
					<div class="Z-WMPie" id="pollingPie"></div>
					<div class="Z-WMPieFont"><i ref="inspection">{{fire.inspectionRate}}</i><span>巡检率</span></div>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	export default {
		name: 'fireOperation',
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
			getMaintenance() { //消防运维完好率 请求接口函数
				var _this=this;
				this.$axios.post('/home/fire/maintenance', {
						emulateJSON: true
					})
					.then(this.getMaintenanceSucc)

			},
			getMaintenanceSucc(res) {
				try{
					var data = res;
					var deviceTotal = data.deviceTotal; //设备总数
					var normalDeviceTotal = data.normalDeviceTotal; //正常设备数
					var inspectionCount = data.inspectionCount; //巡检数
					var inspectionTotalCount = data.inspectionTotalCount; //巡检总数
					var patrolInfoCount = data.patrolInfoCount; //巡查数
					var patrolInfoTotalCount = data.patrolInfoTotalCount; //巡查总数
					var pieDatasAlarm = [];
					if(deviceTotal || deviceTotal == "0") { //设备完好率
						pieDatasAlarm = [{
							value: normalDeviceTotal,
							name: "正常设备数"
						}, {
							value: (deviceTotal - normalDeviceTotal),
							name: "不正常设备数"
						}];
						var obj = this.$refs.device
						this.fire.deviceRate = this.pieData2(normalDeviceTotal, deviceTotal, obj);
						this.PieDataAlarm('facilityPie', pieDatasAlarm, this.pieJsonAlarm)
					
					}
					if(inspectionTotalCount || inspectionTotalCount == "0") { //巡检率
						pieDatasAlarm = [{
							value: inspectionCount,
							name: "巡检数"
						}, {
							value: (inspectionTotalCount - inspectionCount),
							name: "未巡检数"
						}];
						var obj = this.$refs.inspection
						this.fire.inspectionRate = this.pieData2(inspectionCount, inspectionTotalCount, obj);
						this.PieDataAlarm('pollingPie', pieDatasAlarm, this.pieJsonAlarm)
					}
					if(patrolInfoTotalCount || patrolInfoTotalCount == "0") { //巡查率
						pieDatasAlarm = [{
							value: patrolInfoCount,
							name: "巡查数"
						}, {
							value: (patrolInfoTotalCount - patrolInfoCount),
							name: "未巡查数"
						}, ];
						var obj = this.$refs.patrolInfo
						this.fire.patrolInfoRate = this.pieData2(patrolInfoCount, patrolInfoTotalCount, obj);
						this.PieDataAlarm('patrolPie', pieDatasAlarm, this.pieJsonAlarm)
					}
					
				}catch(e){
					console.log('异常')
				}

			},
			pieData2(Unt, Num, obj) {
				var rate = "";
				if(Num == "0" || Unt == "0") {
					rate = "0.0";
					this.pieJsonAlarm.color = ["#ff6600", "#ff6600"]
					obj.style.color = "#ff6600";
				} else {
					var oS = (Unt / Num * 100).toFixed(2);
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
			this.getMaintenance();
		},
	}
</script>

<style lang="scss" scoped>
.el-carousel{
	height: 100%;
}



</style>