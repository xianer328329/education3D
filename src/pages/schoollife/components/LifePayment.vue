<template>
	<div>
		<h4 class="mdTitle">生活缴费</h4>
		<div class="timeselect">2018-02</div>
		<ul class="S-Bfirst">
			<li class="B-first">
				<div id="Bttom"></div>
				<div class="B-centertop"><i>15.2%</i><span>缴费占比</span></div>
				<div class="B-buttom"><i>105<small>元</small></i><span>生均月缴费</span></div>
				<div class="B-tbuttm">电费</div>
			</li>
			<li class="B-Second">
				<div id="Center"></div>
				<div class="B-centerc"><i>15.2%</i><span>缴费占比</span></div>
				<div class="B-buttom"><i>20<small>元</small></i><span>生均月缴费</span></div>
				<div class="B-tbuttm">水费</div>
			</li>
			<li class="B-Third">
				<div id="Tbttom"></div>
				<div class="B-centerbuttom"><i>15.2%</i><span>缴费占比</span></div>
				<div class="B-buttom"><i>80<small>元</small></i><span>生均月缴费</span></div>
				<div class="B-tbuttm">网费</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		mounted: function() {
			this.PieDataBttoms(); //电费-echarts圆形对比图
			this.PieDataCenters(); //水费-echarts圆形对比图
			this.PieDataTbttoms();//网费-echarts圆形对比图 
		},
		methods: {
			/*电费-echarts圆形对比图*/
			PieDataBttoms() {
				var pieDatasBttom = [{
						value: 92.3,
						name: "总数"
					},
					{
						value: 7.7,
						name: "电费"
					},
				]
				var pieJsonBttom = {
					'color': ["#31859c", "#ffc000"],
					'radius': ['70%', '85%'],
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				}
				pieDatasBttom.lege = "false";
				pieJsonBttom.emphasis = "false";
				var myChart = echarts.init(document.getElementById("Bttom"));
				myChart.setOption(Pie(pieDatasBttom, pieJsonBttom), true);
			},
			/*水费-echarts圆形对比图*/
			PieDataCenters(Id) {
				var pieDatasCenter = [{
						value: 92.3,
						name: "总数"
					},
					{
						value: 7.7,
						name: "水费"
					},
				]
				var pieJsonCenter = {
					'color': ["#31859c", "#ffc000"],
					'radius': ['70%', '85%'],
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				}
				pieDatasCenter.lege = "false";
				pieJsonCenter.emphasis = "false";
				var myChart = echarts.init(document.getElementById("Center"));
				myChart.setOption(Pie(pieDatasCenter, pieJsonCenter), true);
			},
			/*网费-echarts圆形对比图*/
			PieDataTbttoms(Id) {
				var pieDatasTbttom = [{
						value: 92.3,
						name: "总数"
					},
					{
						value: 7.7,
						name: "水费"
					},
				]
				var pieJsonTbttom = {
					'color': ["#31859c", "#ffc000"],
					'radius': ['70%', '85%'],
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				}
				pieDatasTbttom.lege = "false";
				pieJsonTbttom.emphasis = "false";
				var myChart = echarts.init(document.getElementById("Tbttom"));
				myChart.setOption(Pie(pieDatasTbttom, pieJsonTbttom), true);
			}

		}
	}
</script>

<style>
	.S-Bfirst {
		height: 260px;
		width: 100%;
	}
	
	.S-Bfirst li {
		float: left;
		width: 32.3%;
		height: 100%;
	}
	
	#Bttom {
		height: 135px;
		width: 135px;
	}
	
	#Center {
		height: 135px;
		width: 135px;
	}
	
	#Tbttom {
		height: 135px;
		width: 135px;
	}
	
	.B-centertop {
		width: 135px;
		height: 135px;
		text-align: center;
		top: 23px;
		left: 14px;
		cursor: pointer;
		background-size: 90px 3px;
		position: absolute;
	}
	
	.B-centertop i {
		font-size: 22px;
		color: #ffcc00;
		display: block;
		margin-top: 44px;
		padding-bottom: 5px;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 60%
	}
	
	.B-centertop span {
		font-size: 16px;
		display: block;
		margin-top: 6px;
		color: #75cbf2;
	}
	
	.B-buttom {
		text-align: center;
		margin: 0 5px;
		width: 120px;
		height: 78px;
		background: rgba(0, 36, 61, 1);
		border: 1px solid rgba(25, 94, 127, 1);
		border-radius: 2px;
	}
	
	.B-buttom i {
		font-size: 22px;
		color: rgba(15, 255, 255, 1);
		display: block;
		padding-bottom: 5px;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 100%
	}
	
	.B-buttom span {
		font-size: 16px;
		display: block;
		margin-top: 6px;
		color: #75cbf2;
	}
	
	.B-buttom small {
		font-size: 12px;
		font-family: NSimSun;
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.B-tbuttm {
		text-align: center;
		margin: 5px;
		width: 120px;
		height: 30px;
		background: rgba(25, 94, 127, 1);
		border: 1px solid rgba(2, 129, 191, 1);
		border-radius: 2px;
		color: rgba(255, 255, 255, 1);
	}
	
	.B-centerc {
		width: 135px;
		height: 135px;
		text-align: center;
		top: 23px;
		left: 156px;
		cursor: pointer;
		background-size: 90px 3px;
		position: absolute;
	}
	
	.B-centerc i {
		font-size: 22px;
		color: #ffcc00;
		display: block;
		margin-top: 44px;
		padding-bottom: 5px;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 60%
	}
	
	.B-centerc span {
		font-size: 16px;
		display: block;
		margin-top: 6px;
		color: #75cbf2;
	}
	
	.B-centerbuttom {
		width: 135px;
		height: 135px;
		text-align: center;
		top: 23px;
		left: 295px;
		cursor: pointer;
		background-size: 90px 3px;
		position: absolute;
	}
	
	.B-centerbuttom i {
		font-size: 22px;
		color: #ffcc00;
		display: block;
		margin-top: 44px;
		padding-bottom: 5px;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 60%
	}
	
	.B-centerbuttom span {
		font-size: 16px;
		display: block;
		margin-top: 6px;
		color: #75cbf2;
	}
</style>