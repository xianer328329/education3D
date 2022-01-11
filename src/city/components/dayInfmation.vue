<template>
	<div class="Z-BalarmNum">
		<p class="Z-Btitle">当日火警<span>{{FireAlarm}}</span></p>
		<p class="Z-Btitle">当日伤亡<span>0</span></p>
		<p class="Z-Btitle">当日舆情<span>0</span></p>
		<p class="Z-Bweather">气象信息
			<span>
            	<i>风向<br><em>{{weather.windDir}}</em></i>
                <i>风力<br><em>{{weather.windSc}}级</em></i>
                <i>湿度<br><em>{{weather.hum}}%</em></i>
            </span>
		</p>

	</div>
</template>

<script>
	/* eslint-disable */
	export default {
		name: 'dayInfmation',
		props: ['infmationChild'],
		data() {
			return {
				weather: {
					windDir: '--',
					windSc: '--',
					hum: '--',
				},
				FireAlarm: '',
				InfmationID: {},
			}
		},
		mounted: function() {
			var oWeather = JSON.parse(localStorage.getItem("WEATHER"))
			if(oWeather) {
				this.weather = oWeather
			}
		},
		methods: {
			getfireAlarm() {
				var zx = this;
				var parameter = {
					adminId: zx.InfmationID.id,
					pageFlag: zx.InfmationID.pageFlag,
				};
				this.$axios.post('/highclouds/cloud/fireAlarm', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
//						console.log(res);
						zx.FireAlarm = res.data;
					});
			}
		},
		watch: {
			infmationChild() {
				this.InfmationID = this.infmationChild;
				this.getfireAlarm();
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Z-BalarmNum {
		font-size: 28px;
		margin-top: 4px;
		text-align: left;
	}
	
	.Z-BalarmNum * {
		font-size: 28px;
	}
	
	.Z-BalarmNum .Z-Btitle,
	.Z-Bweather,
	.Z-realAlarm p {
		line-height: 41px;
		padding-left: 40px;
	}
	
	.Z-BalarmNum .Z-Btitle span {
		font-family: "DIN Medium";
		margin-left: 23px;
	}
	
	.Z-BalarmNum .Z-Btitle:nth-of-type(1) {
		color: #ff0000;
		background: url(../../../static/images/city/b3.png) no-repeat left top;
	}
	
	.Z-BalarmNum .Z-Btitle:nth-of-type(1) span {
		color: #ff0000;
	}
	
	.Z-BalarmNum .Z-Btitle:nth-of-type(2) {
		color: #ffff00;
		background: url(../../../static/images/city/b4.png) no-repeat left top;
	}
	
	.Z-BalarmNum .Z-Btitle:nth-of-type(2) span {
		color: #ffff00;
	}
	
	.Z-BalarmNum .Z-Btitle:nth-of-type(3) {
		color: #ff6900;
		background: url(../../../static/images/city/b5.png) no-repeat left top;
	}
	
	.Z-BalarmNum .Z-Btitle:nth-of-type(3) span {
		color: #ff6900;
	}
	
	.Z-BalarmNum .Z-Bweather {
		color: #00ffff;
		background: url(../../../static/images/city/b6.png) no-repeat left top;
	}
	
	.Z-BalarmNum .Z-Bweather span {
		display: block;
		font-size: 18px;
		margin-left: 0px;
	}
	
	.Z-BalarmNum .Z-Bweather i {
		color: #82fcfc;
		display: inline-block;
		margin-right: 20px;
		font-size: 18px;
	}
	
	.Z-BalarmNum .Z-Bweather em {
		color: #82fcfc;
		font-size: 18px;
	}
	
	.Z-BalarmNum .Z-realAlarm p {
		background: url(../../../static/images/city/b7.png) no-repeat left 10px;
		color: #cccfd2;
		margin-top: 4px;
	}
	
	.Z-BalarmNum .Z-realAlarm img {
		margin-top: 8px;
		margin-left: 23px;
	}
	
	.Z-BalarmNum .Z-realAlarm span {
		color: #cccfd2 !important;
		margin-left: 0px;
	}
</style>