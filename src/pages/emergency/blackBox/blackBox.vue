<template>
	<div class="Z-li Z-PutThrough">
		<!-- <div class="Z-NoAuthStyle"><big>无权限</big></div> -->
		<h6 class="title fl">网管</h6>
		<ul class="Z-left fl Z-child3" id="blackbox">
			<li authDesc="动环告警" authName="al_emergency_home_blackbox_monitor">
			<p class="flushDom"
				:class="{'Z-red': parseInt(sum.monitor)}"
				@click="handleAlarm(1)"
			>
				<i>{{sum.monitor}}</i><span>动环告警</span>
			</p>
				
			</li>
			<li authDesc="设备离线" authName="al_emergency_home_blackbox_offline">
			<p class="flushDom"
				:class="{'Z-orange': parseInt(sum.offline)}"
				@click="handleAlarm(3)"
			>
				<i>{{sum.offline}}</i><span>设备离线</span>
			</p>
			</li>
			<li  authDesc="非法接入" authName="al_emergency_home_blackbox_access">
			<p class="flushDom"
				:class="{'Z-orange': parseInt(sum.access)}"
				@click="handleAlarm(2)"
			>
				<i>{{sum.access}}</i><span>非法接入</span>
			</p>
			</li>
		</ul>
		<div class="Z-right fr">
			<div class="Z-historyAlarm" @click="handleAlarm(4)">
				<i class="clearFix"><em class="fl">{{sum.untreated}}</em>/<span class="fr">{{sum.total}}</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
		<warning ref="warning"></warning>
	</div>
</template>

<script>
	import warning from './warning.vue';
	export default {
		components:{
			warning,//告警弹框求助处理
		},
		name: 'EmergencyBlackbox',
		props:{
			sum:{type:Object}
		},
		data () {
			return {
			}
		},
		methods:{
			handleAlarm (type){
				this.bus.$emit('dateTimeInt');
				this.bus.$emit('handleCloseMapPop');
				this.$refs.warning.show(type);
			},
		},
		created:function(){
		
		},
		mounted:function(){
			
		}
	}
</script>

<style>

</style>