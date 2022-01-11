<template>
	<div class="Z-li Z-PutThrough"  :style="{'display':moduleList.length>0?'block':'none'}">
		<h6 class="title">车辆</h6>
		<ul class="Z-left fl" :class="['Z-child'+moduleList.length]" id="traffic">
			<li v-for="(item,i) in moduleList" :key="i" :authName="item.paramsName" :authDesc="item.paramsNote">
				<p class="flushDom" @click="handleAlarm(item.type)" 
					:class="{'Z-red': parseInt(item.sum)&&i==0,'Z-orange': parseInt(item.sum)&&i!=0}"
					>
					<i>{{item.sum}}</i><span>{{item.paramsNote}}</span>
				</p>
			</li>
		</ul>
		<!-- <ul class="Z-left fl Z-child5" id="traffic">
			<li authName="al_emergency_traffic_pass_trafficinfo_mutual" authDesc="车辆联防布控">
				<p class="flushDom" :class="{'Z-red': parseInt(sum.todayUnion)}" @click="handleAlarm(1)">
					<i>{{sum.todayUnion}}</i><span>车辆联防布控</span>
				</p>
			</li>
			<li authName="al_emergency_traffic_pass_trafficinfo_school" authDesc="车辆本校布控">
				<p  class="flushDom" :class="{'Z-red': parseInt(sum.todaySchool)}" @click="handleAlarm(3)">
					<i>{{sum.todaySchool}}</i><span>车辆本校布控</span>
				</p>
			</li>
			<li  authName="al_emergency_traffic_pass_trafficinfo_sensitive" authDesc="敏感驶入">
				<p class="flushDom" :class="{'Z-orange': parseInt(sum.todaySensitive)}" @click="handleAlarm(2)">
					<i>{{sum.todaySensitive}}</i><span>敏感驶入</span>	
				</p>
			</li>
			<li authName="al_emergency_traffic_pass_trafficinfo_outer" authDesc="高频违法">
				<p  class="flushDom" :class="{'Z-orange': parseInt(sum.todayOther)}" @click="handleAlarm(5)">
					<i>{{sum.todayOther}}</i><span>高频违法</span>	
				</p>
			</li>
			<li authName="al_emergency_traffic_pass_trafficinfo_inside" authDesc="校内违法">
				<p class="flushDom" :class="{'Z-orange': parseInt(sum.todayLocal)}" @click="handleAlarm(4)">
					<i>{{sum.todayLocal}}</i><span>校内违法</span>	
				</p>
				
			</li>
		</ul> -->
		<div class="Z-right fr">
			<div class="Z-historyAlarm" @click="handleAlarm('history')">
				<i class="clearFix"><em class="fl">{{sum.notReported}}</em>/<span class="fr">{{sum.alarmTotal}}</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
		<warning ref="warning"></warning>
		<pop3-table></pop3-table>
	</div>
</template>

<script>
	import warning from './trafficWarning.vue';
	import pop3Table from './pop3tabletrl.vue';
	export default {
		name: 'EmergencyTraffic',
		props: {
			sum: {
				type: Object
			}
		},
		components:{
			warning,//告警弹框求助处理
			pop3Table,//历史记录
		},
		data() {
			return {
				moduleList:[],
			}
		},
		watch:{
			sum:{
				handler(){
					if(this.moduleList.length>0){
						this.forEachAddSum();
					}else{
						this.getAccessModule();
					}
				},
				deep:true
			}
		},
		mounted:function(){
			this.getAccessModule();
		},
		methods:{
			getAccessModule(){
				var parameter={
					paramsName:"al_emergency_traffic_pass_trafficinfo",
					pageName:"/emergency"
				}
				this.$axios.post("/home/dGetAccessModule", parameter)
					.then(res=>{
						this.getAccessModuleSucc(res)
					});
			},	
			getAccessModuleSucc(res){
				var _this=this;
				this.moduleList=(res||[]).map(item=>{
					if(item.paramsName=='al_emergency_traffic_pass_trafficinfo_mutual'){
						item.type=1
					}else if(item.paramsName=='al_emergency_traffic_pass_trafficinfo_sensitive'){
						item.type=2
					}else if(item.paramsName=='al_emergency_traffic_pass_trafficinfo_school'){
						item.type=3
					}else if(item.paramsName=='al_emergency_traffic_pass_trafficinfo_inside'){
						item.type=4
					}else if(item.paramsName=='al_emergency_traffic_pass_trafficinfo_outer'){
						item.type=5
					}
					return item
				});
				this.forEachAddSum();					
			},
			forEachAddSum(){
				this.moduleList.forEach((item,index)=>{
					if(!this.sum[item.uuid]&&this.sum[item.uuid]!=0){
						item.sum='--'
					}else{
						item.sum=this.sum[item.uuid]
					}	
				})		
				this.$nextTick(()=>{
					addAuthList()
				})	
			},
			handleAlarm (type){
				this.bus.$emit('dateTimeInt');
				this.bus.$emit('handleCloseMapPop');
				this.$refs.warning.show(type);
			},

		},
		created: function() {

		},
		
	}
</script>

<style>

</style>