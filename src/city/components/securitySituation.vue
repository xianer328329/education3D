<template>
	<back-box class="Z-safetyline">
		<div class="Z-tab">
			<span @click="getDay()" :class="{'Z-on': isActive1}">最近24小时</span>
			<span @click="getMonth()" :class="{'Z-on': isActive2}">最近30天</span>
			<span @click="getYear()" :class="{'Z-on': isActive3}">最近12个月</span>
		</div>
		<div class="Z-lineT"><img src="../../../static/images/city/b16.png" alt="" /><span>安全态势</span></div>
		<div id="safetyline"></div>

	</back-box>

</template>

<script>
	/* eslint-disable */
	export default {
		name: 'securitySituation',
		props: ['infmationChild'],
		data() {
			return {
				isActive1: true,
				isActive2: false,
				isActive3: false,
				lineJson: this.objectLine(),
				ObjData: {},
				InfmationID: {},
				mTime: null,
			}
		},
		created: function() {
			this.getDay();
			//setInterval(this.getMonth, 93000);
		},
		mounted: function() {
			//			console.log(this.lineJson);
		},
		methods: {
			getDay(event) {
				var zx = this;
				this.isActive1 = true;
				this.isActive2 = false;
				this.isActive3 = false;
				var parameter = {
					adminId: zx.InfmationID.id,
					pageFlag: zx.InfmationID.pageFlag,
				}
				this.$axios.post('/highclouds/cloud/securitySituation/twentyFourHours', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res || [];
						var arr = [];
						var arr2 = [];
						data.forEach((item) => {
							arr.push(item.num);
							arr2.push(item.date);
						})
						zx.lineJson.data1 = arr;
						zx.lineJson.oxAxis = arr2;
						zx.LineDatacar('safetyline', zx.lineJson);
					});
			},
			getMonth(event) {
				var zx = this;
				this.isActive1 = false;
				this.isActive2 = true;
				this.isActive3 = false;
				var parameter = {
					adminId: zx.InfmationID.id,
					pageFlag: zx.InfmationID.pageFlag,
				}
				this.$axios.post('/highclouds/cloud/thirtyDays', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res || [];
						var arr = [];
						var arr2 = [];
						data.forEach((item) => {
							arr.push(item.num);
							arr2.push(item.count_date);
						})
						zx.lineJson.data1 = arr;
						zx.lineJson.oxAxis = arr2;
						zx.LineDatacar('safetyline', zx.lineJson);
					});
			},
			getYear(event) {
				var zx = this;
				this.isActive1 = false;
				this.isActive2 = false;
				this.isActive3 = true;
				var parameter = {
					adminId: zx.InfmationID.id,
					pageFlag: zx.InfmationID.pageFlag,
				}
				this.$axios.post('/highclouds/cloud/securitySituation/twelvemonth', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res || [];
						var arr = [];
						var arr2 = [];
						data.forEach((item) => {
							arr.push(item.num);
							arr2.push(item.month);
						})
						zx.lineJson.data1 = arr;
						zx.lineJson.oxAxis = arr2;
						zx.LineDatacar('safetyline', zx.lineJson);
					});
			},
			objectLine() { //折线图数据
				var obj = new Object();
				obj.data1 = ['100', '120', '130', '140', '150', '100', '120', '130', '140', '150', '100', '120'];
				obj.color = ['#47BCC2', 'rgba(71,188,194,0.7)', "rgba(0,0,0,0)"];
				obj.nameX = '时';
				obj.name = '告警次数';
				obj.oxAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
				obj.leg = "false";
				obj.oMax = function(value) {
					return value.max;
				};
				obj.leg = 'false';
				return obj
			},
			LineDatacar(Id, carData) { //折线图
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(LineChartV(carData), true);
				var index = 0; // 播放所在下标
				clearInterval(this.mTime);
				this.mTime = setInterval(function() {
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index
					});
					index++;
//					if(index > carData.BJdata2.length - 1) {
//						index = 0;
//					}
				}, 3000);

			},
		},
		watch: {
			infmationChild() {
				this.InfmationID = this.infmationChild;
				this.getDay();
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Z-safetyline {
		width: 489px;
		height: 249px;
		margin-top: 256px;
	}
	
	#safetyline {
		width: 100%;
		height: 210px;
		margin: 0 auto;
		margin-top: 35px;
		z-index: 9;
	}
	
	.Z-tooltipF {
		color: #00ffff;
	}
	
	.Z-tooltipF i {
		color: #00ffff;
	}
	
	.Z-tooltipF i:last-child {
		color: #ff5745;
	}
	
	#Z-safetylineTab {
		z-index: 99;
	}
</style>