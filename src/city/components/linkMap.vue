<template>
	<div class="linkMap">
		<div id="linkMap"></div>
		<back-box class="Z-histogram fr">
			<div class="Z-lineT"><img src="../../../static/images/city/b13.png" alt="" />
				<!--<span id="barName">联网区县学校TOP10</span>--></div>
			<div id="mapBarTab" class="Z-tab">
				<span class="Z-span" :class="{'Z-on':'1'==dateType}" @click="setDateType(1)">当日</span>
				<span class="Z-span" :class="{'Z-on':'2'==dateType}" @click="setDateType(2)">当月</span>
				<span class="Z-span" :class="{'Z-on':'3'==dateType}" @click="setDateType(3)">当年</span>
				<span id="mapQl" :class="{'Z-on':'4'==dateType}" @click="mapQL(4)">查询</span>
			</div>
			<div class="ShowTime" v-show="B_Time">
				<p>
					<label>开始时间</label>
					<el-date-picker v-model="sTime" type="date" value-format="yyyy-MM-dd" placeholder="开始时间">
					</el-date-picker>
				</p>
				<P>
					<label>结束时间</label>
					<el-date-picker v-model="eTime" type="date" value-format="yyyy-MM-dd" placeholder="结束时间">
					</el-date-picker>
				</P>
				<p>
					<el-button size="mini" type="primary" @click="Determine">确定</el-button>
				</p>
			</div>
			<div id="alarmTypesBtn" class="Z-tab">
				<span class="Z-span" :class="{'Z-on':'0'==moduleType}" @click="setModuleType(0)">全部</span>
				<span class="Z-span" :class="{'Z-on':'1'==moduleType}" @click="setModuleType(1)">消防</span>
				<span class="Z-span" :class="{'Z-on':'2'==moduleType}" @click="setModuleType(2)">车辆</span>
				<span class="Z-span" :class="{'Z-on':'3'==moduleType}" @click="setModuleType(3)">运维</span>
				<span class="Z-span" :class="{'Z-on':'4'==moduleType}" @click="setModuleType(4)">治安</span>
				<span style="background:none; opacity:0.5">人员</span>
				<span style="background:none; opacity:0.5">危化</span>
				<span style="background:none; opacity:0.5">食品</span>

			</div>
		</back-box>
	</div>

</template>

<script>
	import cqData from "../../../static/mock/cq.json"
	/* eslint-disable */
	export default {
		name: 'linkMap',
		props: ['infmationChild'],
		data() {
			return {
				dateType: "2",
				curr: '',
				sTime: "",
				eTime: "",
				moduleType: "0",
				oresult: null,
				InfmationID: {},
				dialogVisible: false,
				B_Time: false,
				areaData: [

					{
						"title": "联网区县",
						"Xname": "所",
						"Yname": "联网区县学校TOP10",
						"color": ['#ade2f8', '#0ff'],
						"data": [{
							value: 8,
							name: "永川区",
							pId: 2410
						}, {
							value: 6,
							name: "沙坪坝区",
							pId: 2376
						}, {
							value: 4,
							name: "南岸区",
							pId: 2378
						}]
					},
					{
						"title": "学生分布",
						"Xname": "人",
						"Yname": "学生分布TOP10",
						"color": ['#dbfedb', '#00ff00'],
						"data": [{
							value: 110400,
							name: "沙坪坝区"
						}, {
							value: 91879,
							name: "永川区"
						}, {
							value: 86000,
							name: "南岸区"
						}, {
							value: 25000,
							name: "九龙坡区"
						}, {
							value: 13500,
							name: "渝北区"
						}]

					},

					{
						"title": "告警分布",
						"Xname": "次",
						"Yname": "告警分布TOP10",
						"color": ['#fdfddc', '#ffff00'],
						"data": [{
							value: 12935,
							name: "沙坪坝区"
						}, {
							value: 2509,
							name: "江津区"
						}, {
							value: 2208,
							name: "南岸区"
						}]

					}
				]
			}
		},
		mounted: function() {
			this.getFence();
			this.getUnit();
			this.getAlarmRanking();
		},
		watch: {
			infmationChild() {
				this.InfmationID = this.infmationChild;
				this.getAlarmRanking();
				this.getUnit();
			}
		},
		methods: {
			twodateQuery(res) {
				console.log(res);
			},
			setDateType(Num) {
				this.dateType = Num;
			},
			setModuleType(Num) {
				this.moduleType = Num;
			},
			mapQL() {
				this.B_Time = true;
			},
			Determine() {
				this.getAlarmRanking();
				this.B_Time = false;
			},
			getUnit() {
				var _this = this;
				var parameter = {
					adminId: _this.InfmationID.id,
					pageFlag: _this.InfmationID.pageFlag,
				};
				this.$axios.post('/highclouds/cloud/networkingUnit', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res || [];
						data.forEach((item) => {
							item.value = item.num;
						});
						if(data.length == 0) {
							_this.areaData[0].data = [{
								name: "",
								value: 0
							}]
						} else if(data.length != 0) {
							var aperture = _this.districtStatistics(data);
							_this.areaData[0].data = aperture;
						}
					});
				this.$axios.post('/highclouds/cloud/studentDistribution', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res|| [];
						data.forEach((item) => {
							item.value = item.num;
						});
						if(data.length == 0) {
							_this.areaData[1].data = [{
								name: "",
								value: 0
							}]
						} else {
							var aperture = _this.districtStatistics(data);
							_this.areaData[1].data = aperture;
						}
					});
			},
			getAlarmRanking() {
				var _this = this;
				var parameter = {
					adminId: _this.InfmationID.id,
					pageFlag: _this.InfmationID.pageFlag,
					dateType: ' ',
					sTime: _this.sTime,
					eTime: _this.eTime,
					moduleType: '',
				};
				this.$axios.post('/highclouds/cloud/alarmRanking', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res || [];
						data.forEach((item) => {
							item.value = item.num;
						});
						if(data.length == 0) {
							_this.areaData[2].data = [{
								name: "",
								value: 0
							}]
						} else {
							var aperture = _this.districtStatistics(data);
							_this.areaData[2].data = aperture;
						}
						_this.getFence();
					});
			},

			districtStatistics(data) { /* 地图区镇统计 */
				var aperture = [];
				for(var i = 0; i < data.length; i++) {
					var aperObj = {};
					if(data[i].name == "石柱土家族自治县") {
						data[i].name = "石柱县";
					} else if(data[i].name == "秀山土家族苗族自治县") {
						data[i].name = "秀山县";
					} else if(data[i].name == "酉阳土家族苗族自治县") {
						data[i].name = "酉阳县";
					} else if(data[i].name == "彭水苗族土家族自治县") {
						data[i].name = "彭水县";
					}
					aperObj.name = data[i].name;
					if(data[i].num) {
						aperObj.value = data[i].num;
					} else {
						aperObj.value = 0;
					}
					aperture.push(aperObj);
				}
				return aperture
			},
			getFence() {
				var _this = this;
				_this.oresult = cqData;
				BiglinkMap(_this.oresult, _this.areaData);
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.linkMap {
		width: 1450px;
		height: 950px;
		position: absolute;
		right: 0px;
		top: 105px;
		z-index: 1;
	}
	
	#linkMap {
		width: 1450px;
		height: 950px;
		position: relative;
		z-index: 2;
	}
	
	.Z-histogram {
		position: absolute;
		right: 27px;
		bottom: 48px;
		width: 488px;
		height: 400px;
	}
	
	.Z-histogram .Z-tab {
		top: 8px;
		right: 18px;
		z-index: 99;
	}
	
	.Z-histogram .Z-tab .Z-on {
		border: 1px solid #00ffff;
		border-radius: 4px;
		background: rgba(0, 255, 255, 0.5);
	}
	
	.ShowTime {
		width: 400px;
		height: 300px;
		position: absolute;
		bottom: 16px;
		right: 30px;
		z-index: 99;
		background: rgba(0, 0, 0, 0.6);
		padding: 10px;
	}
	
	.ShowTime P {
		margin-top: 10px;
	}
	
	.ShowTime label {
		font-size: 18px;
		margin-right: 10px;
		color: #cccfd2;
	}
	
	.ShowTime .el-input__inner {
		background-color: red !important;
	}
</style>