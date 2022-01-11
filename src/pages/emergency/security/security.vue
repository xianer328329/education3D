<template>
	<div class="Z-li Z-PutThrough" :style="{'display':moduleList.length>0?'block':'none'}" ref="ZPutThrough">
		<h6 class="title">安防</h6>
		<ul class="Z-left fl" :class="['Z-child'+childs]" id="security">
			<li v-for="item in moduleList" :authName="item.paramsName" :authDesc="item.paramsNote">
				<p class="flushDom" @click="handleAlarm(item)" 
					:class="{'Z-red': parseInt(item.sum)&&item.rank==1,'Z-orange': parseInt(item.sum)&&item.rank==2}"
					>
					<i>{{item.sum}}</i><span>{{item.paramsNote}}</span>
				</p>
			</li>
		</ul>
		<div class="Z-right fr" ref="Zright">
			<div class="Z-historyAlarm" @click="handleAlarm('history')">
				<i class="clearFix"><em class="fl">{{sum.historyUntreatedAll}}</em>/<span class="fr">{{sum.alarmTotal}}</span></i>
				<h5>历史告警</h5>
			</div>
		</div>
		<warning ref="warning" :list="moduleList"></warning>
		<pop3-table></pop3-table>
	</div>
</template>

<script>
	import warning from './securityWarning.vue';
	import pop3Table from './pop3tabletrl.vue';
	
	export default {
		name: 'EmergencySecurity',
		props: {
			sum: {
				type:Object,
				default:{
					alarmTotal:"--", //历史告警（包含当天）
					historyUntreatedAll:"--",//历史未处理（包含当天未处理）
				}
			}
		},
		components:{
			warning,//告警弹框求助处理
			pop3Table
		},
		data() {
			return {
				moduleList:[],
				childs:0
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
		mounted: function() {
			var _this = this;
			this.getAccessModule()
		},
		methods: {
			getAccessModule(){
				var parameter={
					paramsName:"al_emergency_home_monitorinfo",
					pageName:"/emergency"
				}
				this.$axios.post("/home/dGetAccessModule", parameter)
					.then(res=>{
						this.getAccessModuleSucc(res)
					});
			},	
			getAccessModuleSucc(res){
				var _this=this
				this.moduleList=res||[];
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
				var olen=this.moduleList.length;
				if(olen){
					var remainder=(olen-2)%3;
					if(olen==1||remainder==1){
						this.childs=1
					}else if(remainder==2){
						this.childs=2
					}
				}
				this.$nextTick(()=>{
					addAuthList()
				})
			},
			handleAlarm(obj) { //页面 当日告警点击
				this.bus.$emit('dateTimeInt');
				this.bus.$emit('handleCloseMapPop')
				this.$refs.warning.show(obj);
			},
			
		},
		
		watch:{
			sum(val){
				this.forEachAddSum();
			}
		}
	}
</script>

<style>/*width: 152px;*/
.Z-DayAlarmList .Z-li #security li:nth-of-type(1),
.Z-DayAlarmList .Z-li #security li:nth-of-type(2),
.Z-DayAlarmList .Z-li .Z-child2#security li:nth-last-child(1),
.Z-DayAlarmList .Z-li .Z-child2#security li:nth-last-child(2){
    width: 7.6rem;
}
.Z-DayAlarmList .Z-li #security li{
    width: 4.95rem;
}

.Z-DayAlarmList .Z-li .Z-child1#security li:last-child{
    width: 15.45rem;
}


</style>