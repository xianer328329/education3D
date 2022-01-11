<template>
	<div class="Z-YUJ clearFix cloudAlarm">
		<div class="Z-warningSum fl" id="dataNums"></div>
		<h4 class="fl">次</h4>
	</div>
</template>

<script>
	/* eslint-disable */
	import '../../../static/js/num.js'
	export default {
		name: 'cloudAlarm',
		data() {
			return {

			}
		},
		mounted: function() {
			this.yuj()
		},
		methods: {
			yuj(init) {
				var zx = this;
				this.$axios.post('/highclouds/cloud/totalAlarm', {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res.datasum || [];
						var sumy = data
						$("#dataNums").rollNumDaq({
							deVal: sumy
						});
					});

			}
		}
	}
</script>

<style lang="scss">
	.Z-YUJ h4 {
		font-size: 18px;
		color: #9ca2c0;
		line-height: 80px;
	}
	
	.inrow {
		font-size: 0;
		font-size: 12px;
		font-size: 0;
		font-family: arial;
		letter-spacing: normal;
		word-spacing: -1px;
	}
	
	.inrow>li,
	.inrow span {
		display: inline-block;
		*display: inline;
		*zoom: 1;
		font-size: 14px;
		letter-spacing: normal;
		word-spacing: normal;
	}
	.cloudAlarm{
		#dataNums {
			display: block;
			height: 75px;
			text-align: center;
		}
		
		#dataNums .dataOne {
			width: 29px;
			height: 75px;
			margin-right: 7px;
			text-align: center;
			opacity: 0.7;
			background: url(../../../static/images/city/b2.png) no-repeat center;
		}
		
		#dataNums .dataBoc {
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		
		#dataNums .dataBoc .tt {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		
		#dataNums .tt span {
			width: 100%;
			height: 100%;
			font: bold 34px/83px "Helvetica-Roman-SemiB";
			color: #cdcedc;
		}
	}	
</style>