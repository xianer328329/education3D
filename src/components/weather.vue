<template>
	<div class="Z-weather">
		<div class='weather fl'>{{Now}}</div>
		<div class='fl'>
			<i class='weatherTop'>{{Top}}</i>/<i class='weatherBottom'>{{Bottom}}</i>℃
		</div>
	</div>
</template>

<script>
	/* eslint-disable */

	export default {
		name: 'weatherCom',
		data() {
			return {
				Now: "",
				Top: "",
				Bottom: "",
			}
		},
		mounted: function() {
			this.addweather();
		},
		methods: {
			addweather() {
				var _this = this
				//var para = "https://free-api.heweather.com/s6/weather/forecast?location=" + lat + "," + lon + "&key=0c45d1ee66e54915a3b065d68b053814";
				var para="https://free-api.heweather.com/s6/weather/forecast?location=auto_ip&key=0c45d1ee66e54915a3b065d68b053814";
				this.$axios.get(para)
					.then(function(data) {
//						console.log(data)
						_this.Now = data["HeWeather6"][0]["daily_forecast"][0]["cond_txt_d"];
						_this.Top = data["HeWeather6"][0]["daily_forecast"][0]["tmp_max"];
						_this.Bottom = data["HeWeather6"][0]["daily_forecast"][0]["tmp_min"];
						var weather={
							'windDir':data["HeWeather6"][0]["daily_forecast"][0]["wind_dir"],//风向
							'windSc':data["HeWeather6"][0]["daily_forecast"][0]["wind_sc"],//风力
							'hum':data["HeWeather6"][0]["daily_forecast"][0]["hum"],//湿度
							'txt':_this.Now,//实况天气状况描述
							'top':_this.Top,//最高气温
							'bottom':_this.Bottom,//最高气温
						};
						localStorage.setItem("WEATHER",JSON.stringify(weather));
					})

			},
		}
	}
</script>

<style lang="stylus" scoped>

</style>