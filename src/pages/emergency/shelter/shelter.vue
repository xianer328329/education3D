<template>
	<div class="Z-li Z-PutThrough" :style="{'display':moduleList.length>0?'block':'none'}">
		<!-- <div class="Z-NoAuthStyle"><big>无权限</big></div> -->
		<h6 class="title fl">方舱</h6>
		<ul class="Z-left fl" :class="['Z-child'+moduleList.length]" id="shelters">
			<li v-for="(item,i) in moduleList" :key="i" :authName="item.paramsName" :authDesc="item.paramsNote">
				<p class="flushDom" @click="handleAlarm(item.type)" 
					:class="{'Z-red': parseInt(item.sum)&&i==0,'Z-orange': parseInt(item.sum)&&i!=0}"
					>
					<i>{{item.sum}}</i><span>{{item.paramsNote}}</span>
				</p>
			</li>
		</ul>
		<!-- <ul class="Z-left fl Z-child3" id="shelters">
			<li authDesc="紧急求助" authName="al_emergency_home_shelter_emerHelp">
			<p class="flushDom"
				:class="{'Z-red': parseInt(sum.emerHelp)}"
				@click="handleAlarm(1)"
			>
				<i>{{sum.emerHelp}}</i><span>紧急求助</span>
			</p>
				
			</li>
			<li authDesc="设备异常" authName="al_emergency_home_shelter_deviceError">
			<p class="flushDom"
				:class="{'Z-orange': parseInt(sum.deviceError)}"
				@click="handleAlarm(2)"
			>
				<i>{{sum.deviceError}}</i><span>设备异常</span>
			</p>
			</li>
			<li  authDesc="装备不足" authName="al_emergency_home_shelter_equeInsu">
			<p class="flushDom"
				:class="{'Z-orange': parseInt(sum.equeInsu)}"
				@click="handleAlarm(3)"
			>
				<i>{{sum.equeInsu}}</i><span>装备不足</span>
			</p>
			</li>
		</ul> -->
		<div class="Z-right fr">
			<div class="Z-historyAlarm" @click="handleAlarm(4)">
				<i class="clearFix"><em class="fl">{{sum.noHand}}</em>/<span class="fr">{{sum.alarmTotal}}</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
		<warning ref="warning" :moduleList="moduleList"></warning>
	</div>
</template>

<script>
	import warning from './warning.vue';
	export default {
		components:{
			warning,//告警弹框求助处理
		},
		name: 'EmergencyShelter',
		props:{
			sum:{type:Object}
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
					paramsName:"al_emergency_home_shelter",
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
					if(item.paramsName=='al_emergency_home_shelter_emerHelp'){
						item.type=1
					}else if(item.paramsName=='al_emergency_home_shelter_deviceError'){
						item.type=2
					}else if(item.paramsName=='al_emergency_home_shelter_equeInsu'){
						item.type=3
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
	}
</script>

<style>

</style>