<template>
	<div class="Frr">
		<h4 class="Frrtitle">新生报到率</h4>
		<div class="ReportTo">
			<div id="GraduationRate"></div>
			<div class="GraduationRateUL">
				<ul>
					<li class="fontONE">6974</li>
					<li class="fontONELine">|</li>
					<li>7059</li>
				</ul>
			</div>
		</div>
		<div class="ReportTo">
			<div id="RateOfEmployment"></div>
			<div class="GraduationRateUL">
				<ul>
					<li class="fontONE">6018</li>
					<li class="fontONELine">|</li>
					<li>7059</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		mounted() {
			this.starchar();
		},
		methods: {
			starchar() {
				var GraduationRates = echarts.init(document.getElementById("GraduationRate"));
				GraduationRates.setOption(this.GraduationRateEcharts()); //柱状图
				var RateOfEmployments = echarts.init(document.getElementById("RateOfEmployment"));
				RateOfEmployments.setOption(this.RateOfEmploymentEcharts()); //柱状图
			},
			//毕业率
			GraduationRateEcharts() {
				var Data = 98.3;
				var img = require('../../../../static/images/img4.png');
				var color = ["#31859C", "#FFCC00"];
				var ydata = [{
					name: '已毕业',
					value: Data
				}, {
					name: '未毕业',
					value: 100 - Data
				}];
				var option = {
					color: color,
					title: [{
						text: Data + '%',
						x: 'center',
						y: '35%',
						textStyle: {
							fontSize: 20,
							fontWeight: 'bold',
							fontStyle: 'normal',
							color: '#FFCC00'
						}
					}, {
						text: '毕业率',
						x: 'center',
						y: '53%',
						textStyle: {
							fontSize: 14,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#75CBF2'
						}
					}],
					graphic: {
						elements: [{
							type: 'image',
							style: {
								image: img,
								width: 110,
							},
							left: '40',
							top: 'center'
						}]
					},
					series: [{
						type: 'pie',
						radius: ['65%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
							}
						},
						data: ydata
					}]
				}
				return option;
			},
			//就业率
			RateOfEmploymentEcharts() {
				var Data = 92.3;
				var img = require('../../../../static/images/img4.png');
				var color = ["#31859C", "#FFCC00"];
				var ydata = [{
					name: '已就业',
					value: Data
				}, {
					name: '未就业',
					value: 100 - Data
				}];
				var option = {
					color: color,
					title: [{
						text: Data + '%',
						x: 'center',
						y: '35%',
						textStyle: {
							fontSize: 20,
							fontWeight: 'bold',
							fontStyle: 'normal',
							color: '#FFCC00'
						}
					}, {
						text: '就业率',
						x: 'center',
						y: '53%',
						textStyle: {
							fontSize: 14,
							fontWeight: 'normal',
							fontStyle: 'normal',
							color: '#75CBF2'
						}
					}],
					graphic: {
						elements: [{
							type: 'image',
							style: {
								image: img,
								width: 110,
							},
							left: '40',
							top: 'center'
						}]
					},
					series: [{
						type: 'pie',
						radius: ['65%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
							}
						},
						data: ydata
					}]
				}
				return option;
			},
		},
	}
</script>

<style lang="stylus" scoped>
	.Frrtitle {
		font-size: 18px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.ReportTo {
		width: 200px;
		float: left;
		height: 100%;
		margin-left: 25px;
	}
	
	.GraduationRateUL .fontONE{
		color: #00FFFF;
	}
	.GraduationRateUL .fontONELine{
		font-size: 20px;
		margin-top: -5px;
	}
	.GraduationRateUL ul{
		width: 100%;
		text-align: center;
	}
	.GraduationRateUL ul li {
		display: inline-block;
		font-size: 24px;
		color: #75CBF2;
		vertical-align: middle;
	}
	
	#GraduationRate {
		height: 180px;
	}
	
	#RateOfEmployment {
		height: 180px;
	}
</style>