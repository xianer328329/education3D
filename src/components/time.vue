<template>
	<time class="module">{{time}}</time>
</template>

<script>
	/* eslint-disable */

	export default {
		name: 'timeCom',
		data() {
			return {
				time: '',
				intervalid: null,
			}
		},
		mounted: function() {
			this.addtime();
			var _this = this;
			this.intervalid = setInterval(() => {
				setTimeout(function() {
					_this.addtime()
				}, 0)
			}, 1000)
		},
		beforeDestroy: function() {
			clearInterval(this.intervalid)
		},
		methods: {
			addtime() { // 获取时间
				var mydate = new Date();
				var oY = mydate.getFullYear(); // 获取完整的年份(4位,1970-????)
				var oM = mydate.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
				var oD = mydate.getDate(); // 获取当前日(1-31
				var oH = mydate.getHours(); // 获取当前小时数(0-23)
				var oMi = mydate.getMinutes(); // 获取当前分钟数(0-59)
				var oS = mydate.getSeconds(); // 获取当前秒数(0-59)
				var oData = toDub(oY) + '.' + toDub(oM) + '.' + toDub(oD) + '  ' + toDub(oH) + ':' + toDub(oMi) + ':' + toDub(oS);
				this.time = oData
			}
		}
	}
</script>

<style lang="stylus" scoped>

</style>