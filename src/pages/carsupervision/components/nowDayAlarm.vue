<template>
	<div class="h-container">
		<h4 class="boxtitle">当日告警</h4>
		<div class="h-content1 backboxContainer">
			<div class="h-section h-left">
				<div class="h-content" :class="{'h-red':list.todayUnion&&list.todayUnion!='--'}" @click="operate(1)">
					<p class="h-number">{{list.todayUnion}}</p>
					<i class="h-splitline"></i>
					<p class="h-text">车辆联防布控</p>
				</div>
			</div>
			<div class="h-right">
				<div class="h-col h-text-left">
					<div class="h-section">
						<div class="h-content" :class="{'h-red':list.todaySchool&&list.todaySchool!='--'}" @click="operate(3)">
							<div class="text-center">
								<p class="h-number">{{list.todaySchool}}</p>
								<i class="h-splitline"></i>
								<p class="h-text">车辆本校布控</p>
							</div>
						</div>
					</div>
					<div class="h-section">
						<div class="h-content" :class="{'h-yellow':list.todayOther&&list.todayOther!='--'}" @click="operate(5)">
							<div class="text-center">
								<p class="h-number">{{list.todayOther}}</p>
								<i class="h-splitline"></i>
								<p class="h-text">高频违法驶入</p>
							</div>
						</div>
					</div>
				</div>
				<div class="h-col h-text-right">
					<div class="h-section">
						<div class="h-content" :class="{'h-yellow':list.todaySensitive&&list.todaySensitive!='--'}" @click="operate(2)">
							<div class="text-center">
								<p class="h-number">{{list.todaySensitive}}</p>
								<i class="h-splitline"></i>
								<p class="h-text">敏感车辆驶入</p>
							</div>
						</div>
					</div>
					<div class="h-section">
						<div class="h-content" :class="{'h-yellow':list.todayLocal&&list.todayLocal!='--'}" @click="operate(4)">
							<div class="text-center">
								<p class="h-number">{{list.todayLocal}}</p>
								<i class="h-splitline"></i>
								<p class="h-text">校内违法车辆</p>
							</div>
						</div>
					</div>
				</div>
				<div class="h-chart-c"></div>
				<div ref="chart" class="h-chart" @click="seeDeilt()"></div>
			</div>
			<nowAlarmSub></nowAlarmSub>
			<parking-Lot-Details ref="parkingLotDetailsRef"></parking-Lot-Details>
		</div>
	</div>
</template>

<script>
	import parkingLotDetails from "./parkingLotDetails.vue"
	import nowAlarmSub from './sub/nowAlarmSub.vue';
	export default {
		data() {
			return {
				list: {
					todayUnion: "--",
					todaySchool: "--",
					todayOther: "--",
					todaySensitive: "--",
					todayLocal: "--"
				},
			}
		},
		components: {
			nowAlarmSub,
			parkingLotDetails
		},
		mounted() {
			var _this = this;
			this.getData();
		},
		methods: {
			seeDeilt() {
				this.$refs.parkingLotDetailsRef.show();
			},
			operate(i) {
				this.bus.$emit('getCars', i);
			},
			getData() {
				var vm = this;
				this.$axios.post('traffic/pass/alarmInfo')
					.then(function(res) {
						vm.list = res;
						vm.$nextTick(function() {
							vm.initchart(vm.list)
						})
					})
			},
			initchart(data) {
				var vm = this;
				if (vm.$refs.chart) {
					var c = echarts.init(vm.$refs.chart);
					c.setOption(vm.getOption(data));
					allCharts.push(c);
				}

			},
			getOption(data) {
				return {
					tooltip: {
						show: false,
						trigger: 'none',
					},
					color: ['#00FFFF', '#1D3F65'],
					series: [{
						name: '',
						type: 'pie',
						radius: ['85%', '100%'],
						silent: true,
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [{
								value: (data.occupancyRate * 100).toFixed(2),
								name: '车位占用',
								label: {
									normal: {
										show: true,
										position: 'center',
										textStyle: {
											fontSize: 0.8 * fontSize,
											fontWeight: 'bold'
										},
										formatter: '{a|{d}}{b|%}\n{c|车位占用}',
										rich: {
											a: {
												fontSize: 1.2 * fontSize,
												fontWeight: 'bold',
												color: '#00FFFF',
												lineHeight: 1.2 * fontSize,
												fontFamily: "DIN Medium"
											},
											b: {
												fontSize: 0.7 * fontSize,
												color: '#75CBF2',
												lineHeight: 1.3 * fontSize,
												padding: 4
											},
											c: {
												fontSize: 0.8 * fontSize,
												color: '#75CBF2',
												lineHeight: 1.3 * fontSize
											},
										}
									},
								},
							},
							{
								value: (100 - (data.occupancyRate * 100).toFixed(2)),
								name: ''
							},
						]
					}]
				}
			},

		},
	}
</script>

<style lang="scss" scoped="scoped">
	.boxtitle {
		color: #75CBF2;
	}

	.h-section {
		border: 1px solid rgba(25, 94, 127, 1);
		height: 100%;
		box-sizing: border-box;
	}

	.h-section:before {
		display: inline-block;
		content: ' ';
		height: 100%;
		vertical-align: middle;
	}

	.h-content {
		display: inline-block;
		vertical-align: middle;
		width: 99.99%;
		text-align: center;
		cursor: pointer;
	}

	.h-red *,
	.h-red {
		color: #CC1010 !important;
	}

	.h-yellow * {
		color: #ED7703 !important;
	}

	.h-number {
		font-size: 1.4rem;
		font-weight: 500;
		color: #999999;
		line-height: 1.05rem;
		height: 1.05rem;
		margin-bottom: -3px;
	}

	.h-splitline {
		display: inline-block;
		width: 100%;
		height: 3px;
		background: linear-gradient(to right, transparent 0%, transparent 5%, #00FFFF 50%, transparent 95%);
	}

	.h-text {
		font-size: 0.7rem;
		color: rgba(117, 203, 242, 1);
		line-height: 1.05rem;
	}

	.h-left {
		float: left;
		width: 6rem;
	}

	.h-right {
		height: 100%;
		position: relative;
		overflow: hidden;
		font-size: 0px;
	}

	.h-right .h-section {
		margin-left: 0.5rem;
	}

	.h-col {
		display: inline-block;
		width: 50%;
		height: 100%;
	}

	.h-text-right {
		text-align: right;
	}

	.h-right .h-section {
		height: 49%;
		box-sizing: border-box;

		&:nth-of-type(1) {
			margin-bottom: 2%;
		}
	}

	.h-right .h-content {
		width: auto;
		min-width: 75%;
		max-width: 6rem;
	}

	/*图表*/
	.h-chart-c {
		position: absolute;
		width: 6.25rem;
		height: 6.25rem;
		border: 1px solid rgba(25, 94, 127, 1);
		border-radius: 50%;
		left: 50%;
		top: 50%;
		padding: 0.25rem;
		background: rgba(0, 21, 37, 1);
		transform: translate(-50%, -50%);
	}

	.h-chart {
		position: absolute;
		width: 6.25rem;
		height: 6.25rem;
		border-radius: 50%;
		left: 50%;
		top: 50%;
		margin-left: -3.125rem;
		margin-top: -3.125rem;
		cursor: pointer;
	}

	/*.car{
	background:url(../../../../static/images/carSupervision/icon_car_b.png) no-repeat 2px center;
	background-size:18px 15px ;
	text-align: right;
}
.yellow .car{
	background-image:url(../../../../static/images/carSupervision/icon_car_y.png);
}*/
</style>
