<template>
	<!--<div class="Z-li clearFix Z-NoOpened" authName="ZL_DAYALARM_ENERGY" authDesc="能源安全">
		<div class="Z-NoOpenedStyle"><big>未开通</big></div>
		<h6 class="title">能源安全</h6>
		<ul class="Z-left fl Z-child5">
			<li authName="ZL_DAYALARM_ENERGY_ELECTRIC-LEAKAGE " authDesc="漏电"><i>--</i><span>漏电</span></li>
			<li authName="ZL_DAYALARM_ENERGY_OVERLOAD" authDesc="用电负荷过高"><i>--</i><span>用电负荷过高</span></li>
			<li authName="ZL_DAYALARM_ENERGY_WATER-LEAKAGE" authDesc="漏水"><i>--</i><span>漏水</span></li>
			<li authName="ZL_DAYALARM_ENERGY_GAS" authDesc="燃气侧漏"><i>--</i><span>燃气侧漏</span></li>
			<li authName="ZL_DAYALARM_ENERGY_FAULT" authDesc="设备故障"><i>--</i><span>设备故障</span></li>

		</ul>
		<div class="Z-right fr">
			<div class="Z-historyAlarm">
				<i><em>--</em>/<span>--</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
	</div>-->
	<div class="Z-li clearFix Z-NoOpened">
		<div class="Z-NoOpenedStyle"><big>未开通</big></div>
		<h6 class="title">能源安全</h6>
		<ul class="Z-left fl Z-child5">
			<li><i>--</i><span>漏电</span></li>
			<li><i>--</i><span>用电负荷过高</span></li>
			<li><i>--</i><span>漏水</span></li>
			<li><i>--</i><span>燃气侧漏</span></li>
			<li><i>--</i><span>设备故障</span></li>

		</ul>
		<div class="Z-right fr">
			<div class="Z-historyAlarm">
				<i><em>--</em>/<span>--</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'EmergencyEnergy'
	}
</script>

<style lang="stylus" scoped>
.title{margin-top:-44px !important;}
</style>