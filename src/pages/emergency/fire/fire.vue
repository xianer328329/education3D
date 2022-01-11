<template>
	<div class="Z-li Z-PutThrough"  :style="{'display':moduleList.length>0?'block':'none'}">
		<h6 class="title fl">消防</h6>
		<ul class="Z-left fl" :class="['Z-child'+moduleList.length]" id="fire">
			<li v-for="(item,i) in moduleList" :key="i" :authName="item.paramsName" :authDesc="item.paramsNote">
				<p class="flushDom" @click="handleAlarm(item.type)" 
					:class="{'Z-red': parseInt(item.sum)&&i==0,'Z-orange': parseInt(item.sum)&&i!=0}"
					>
					<i>{{item.sum}}</i><span>{{item.paramsNote}}</span>
				</p>
			</li>
		</ul>
		<!-- <ul class="Z-left fl Z-child4" id="fire">
			<li authDesc="火警" authName="al_emergency_home_alarminfo_fire">
			<p class="flushDom"
				:class="{'Z-red': parseInt(sum.todayUntreatedFire)}"
				@click="handleAlarm(1)"
			>
				<i>{{sum.todayUntreatedFire}}</i><span>火警</span>
			</p>
				
			</li>
			<li authDesc="预警" authName="al_emergency_home_alarminfo_early">
			<p class="flushDom"
				:class="{'Z-orange': parseInt(sum.todayUntreatedEarly)}"
				@click="handleAlarm(4)"
			>
				<i>{{sum.todayUntreatedEarly}}</i><span>预警</span>
			</p>
			</li>
			<li  authDesc="故障" authName="al_emergency_home_alarminfo_fault">
			<p class="flushDom"
				:class="{'Z-orange': parseInt(sum.todayUntreatedFault)}"
				@click="handleAlarm(2)"
			>
				<i>{{sum.todayUntreatedFault}}</i><span>故障</span>
			</p>
			</li>
			<li authDesc="其他" authName="al_emergency_home_alarminfo_other">
			<p class="flushDom" 
				:class="{'Z-orange': parseInt(sum.todayUntreatedOther)}"
				@click="handleAlarm(3)"
			>
				<i>{{sum.todayUntreatedOther}}</i><span>其他</span>	
			</p>
			
		</li>
		</ul> -->
		<div class="Z-right fr">
			<div class="Z-historyAlarm" @click="handleAlarm(5)">
				<i class="clearFix"><em class="fl">{{sum.historyUntreatedAll}}</em>/<span class="fr">{{sum.alarmTotal}}</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
		<warning ref="warning"></warning>
	</div>
</template>

<script>
	import warning from './fireWarning.vue';
	
	export default {
		name: 'EmergencyFire',
		props:{
			sum:{type:Object}
		},
		components:{
			warning,//告警弹框求助处理
		},
		data () {
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
					paramsName:"al_emergency_home_alarminfo",
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
					if(item.paramsName=='al_emergency_home_alarminfo_fire'){
						item.type=1
					}else if(item.paramsName=='al_emergency_home_alarminfo_fault'){
						item.type=2
					}else if(item.paramsName=='al_emergency_home_alarminfo_other'){
						item.type=3
					}else if(item.paramsName=='al_emergency_home_alarminfo_early'){
						item.type=4
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
		created:function(){
		
		},
		
	}
</script>

<style>

</style>