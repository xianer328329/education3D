<template>
	<div>
		<h4 class="mdTitle">数据安全</h4>
		<div class="security">
			<span>网管工作站</span>
			<i>{{list.total}}</i>
		</div>
		<ul class="securityUL">
			<li>
				<span class="Bfont">12U</span>
				<i class="BNumber">{{list['12Utotal']}}</i>
			</li>
			<li>
				<span class="Bfont">24U</span>
				<i class="BNumber">{{list['24Utotal']}}</i>
			</li>
			<li>
				<span class="Bfont">48U</span>
				<i class="BNumber">{{list['48Utotal']}}</i>
			</li>
		</ul>
		<div class="Online">
			<div id="OnlineID"></div>
			<div class="OnlinePieFont vertical-middle-c">
				<div class="vertical-middle">
					<p><i ref="outLine">{{list.total>0?(list.onlineTotal/list.total*100).toFixed(1):0}}%</i></p>
					<span>设备在线率</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	import axios from 'axios'
	export default {
		name: 'IndexFood',
		data() {
			return {
				list: {},
				pieDatasAlarm: [{
						value: 100,
						name: "在线设备"
					},
					{
						value: 50,
						name: "离线设备"
					},
				],
			}
		},
		mounted: function() {
			this.getInfo();
		},
		methods: {
			getInfo() {
				var vm = this;
				var params = {
					unitUuid: 12345||UNITID
				}
				this.$axios.post('box/statistics/bqueryTotal', params).then(data => {
					vm.list = data || {};
					var pieDatasAlarm = [{
							value: vm.list.onlineTotal || 0,
							name: "在线设备"
						},
						{
							value: vm.list.total == 0 ? 1 : ((vm.list.total || 0) - (vm.list.onlineTotal || 0)),
							name: "离线设备"
						}
					];
					this.PieDataAlarm('OnlineID', pieDatasAlarm);
				})
			},
			PieDataAlarm(id, res) {
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(id));
					myChart.setOption({
						legend: {
							show:false
						},
						color: ["#ffc000", "#31859c"],
						series: [{
							type: 'pie',
							radius: ['75%', '90%'],
							center: ['51%', '50%'],
							label: {
								normal: {
									show: false,
									position: 'center'
								},
							},
							avoidLabelOverlap: false,
							labelLine: {
								normal: {
									show: false
								}
							},
							data: res
						}]
					});
					allCharts.push(myChart);
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.security {
		margin-top: 0.5rem;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
	}
	
	.security span {
		font-size: 0.8rem;
		line-height: 2rem;
		margin-left: 0.5rem;
		color: rgba(117, 203, 242, 1);
	}
	
	.security i {
		position: relative;
		right: 0.5rem;
		top: 0.7rem;
		float: right;
		font-size: 1rem;
		font-family: "DIN Medium";
		font-weight: 500;
		color: #00FFFF;
		margin-right: 0.15rem;
		display: inline-block;
	}
	
	.securityUL {
		width: 55%;
		float: left;
		height:calc(100% - 6rem);
		margin-top:1rem;
	}
	
	.securityUL li {
		height: 30%;
		margin-top: 2%;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		display:flex;
		align-items:center;
	}
	
	.securityUL li span {
		font-size: 0.7rem;
		margin-left: 0.25rem;
		color: rgba(117, 203, 242, 1);
	}
	
	.securityUL li i {
		flex:1;
		text-align:right;
		font-size: 0.9rem;
		color: #00FFFF;
		margin-right:0.25rem;
	}
	
	.Online {
		width: 43%;
		height:calc(100% - 4rem);
		position: relative;
		top: 0.25rem;
		left: 0.25rem;
		float: left;
	}
	
	.OnlinePieFont {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0px;
		text-align: center;
		background-size: 90px 3px;
	}
	.OnlinePieFont i {
		font-size: 1rem;
		color: #ffcc00;
		display: block;
		padding-bottom:0.25rem;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 77%;
	}
	
	.OnlinePieFont span {
		font-size: 0.7rem;
		display: block;
		color: #75cbf2;
	}
	
	.OnlinePieFont p {
		color: #75cbf2;
		font-size: 0.7rem;
	}
	
	#OnlineID {
		width: 100%;
		height: 100%;
	}
</style>