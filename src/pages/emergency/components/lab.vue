<template>
	<!--<div class="Z-li clearFix Z-NoOpened" authName="ZL_DAYALARM_LAB" authDesc="实验室">
		<div class="Z-NoOpenedStyle"><big>未开通</big></div>
		<h6 class="title">实验室</h6>
		<ul class="Z-left fl Z-child3">
			<li  authName="ZL_DAYALARM_LAB_GAS" authDesc="有害气体" ><i>--</i><span>有害气体</span></li>
			<li  authName="ZL_DAYALARM_LAB_TEMPERATURE" authDesc="室温异常" ><i>--</i><span>室温异常</span></li>
			<li  authName="ZL_DAYALARM_LAB_INTRUDER" authDesc="人员闯入"><i>--</i><span>人员闯入</span></li>
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
		<h6 class="title">实验室</h6>
		<ul class="Z-left fl Z-child3">
			<li><i>--</i><span>有害气体</span></li>
			<li><i>--</i><span>室温异常</span></li>
			<li><i>--</i><span>人员闯入</span></li>
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
	name: 'EmergencyLab'
}
</script>

<style lang="stylus" scoped>
.title{margin-top:-38px !important;}
</style>