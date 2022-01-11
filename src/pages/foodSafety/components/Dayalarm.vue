<template>
	<div class="h-container">
		<h4 class="boxtitle">当日告警</h4>
		<div class="alarmMes">
			<ul class="total">
				<li>
					<div>
						<p class="Z-numberf">2</p>
						<span>非工作人员闯入</span>
					</div>
				</li>
				<li>
					<div>
						<p class="Z-numberf">0</p>
						<span>禁区出现老鼠</span>
					</div>
				</li>
				<li>
					<div>
						<p class="Z-numberf">1</p>
						<span>工作人员穿戴违规</span>
					</div>
				</li>
				<li>
					<div>
						<p class="Z-numberf">0</p>
						<span>水质监测告警</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>	
	export default {
		data() {
			return {
				list:{}
			}
		},
		mounted: function() {
				
		},
		methods: {
			
		}

	}
</script>
<style lang="scss" scoped="scoped">
.h-container{
	position: relative;
	height: 100%;
	.boxtitle{
	    font-size: 18px;
	    font-weight: 400;
	    color: #75cbf2;
	}
	.alarmMes .total{
		top: 15px;
		bottom: 20px;
		left: 15px;
		right: 15px;
		width: auto;
		li{
			width: 50%;
			height: 50%;
			padding: 0px 5px;
			div{
				padding: 15px 0px;
				p{
					font-size: 24px;
					margin-bottom: 10px;
				}
				span{
					font-size: 16px;
				}
				.Z-numberf{
					color: #00FFFF;
					padding-bottom: 10px;
				}
			}
		}
	}
}
</style>
