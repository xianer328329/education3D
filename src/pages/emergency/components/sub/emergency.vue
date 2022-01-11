<template>
	<div class="h-emergency">
		<template v-if="events.length>0">
			<div class="Reserve mb20">
				<div class="h-self-select">
					<label class="mr10">突发事件</label>
					<el-select v-model="currEvent" filterable  default-first-option :popper-append-to-body="false" value-key="uuid">
						<el-option v-for="item in events"  :label="item.title" :value="item" :key="item.uuid">
						</el-option>
					</el-select>
				</div>
				<template  v-if="currEvent.status!=1">
					<!--预案已启动-->
					<template v-if="currEvent.planUuid">
						<div class="Ev-centos">
							<p>预案已启动</p>
						</div>
						<div class="Ev-box">
							<p class="boxs"><i class=" mr5">{{currEvent | getHour(state)}}</i><span class="evtext">小时</span><i class="mr5">{{currEvent | getMinutes(state)}}</i><span class="evtext">分钟</span></p>
							<p class="evtext mt10">预案启动时间：{{currEvent.planTime}}</p>
							<p class="evtext mt10"><label class=" underline" @click="jumpPlan(currEvent.plan)">预案名称：{{currEvent.plan.planName||'未获取到预案名称'}}</label></p>
						</div>
					</template>	
					<!--未启动应急预案-->
					<template v-else>
						<div class="alarmBtn emergency-btn mt25" @click="showPlan">开启预案</div>
						<span >该突发事件 未启动应急预案 !</span>
					</template>
				</template>
			</div>
			<!--事件进展-->
			<eventProgress :currEvent="currEvent" @refresh="getEvents" ref="eventProgress"></eventProgress>
			<!--预案选择弹窗-->
			<el-dialog title="启动预案" center  class="emergency-modal plan-modal modal-visible" :modal-append-to-body="false" :visible="isplan" :before-close="close" width="430px">
				<el-form label-position="right" label-width="105px" >
					<el-form-item label="针对事件：">
						<span>{{currEvent.title}}</span>	   
					</el-form-item>
					<el-form-item label="选择预案：">
					   <!--<el-select v-model="alarmType" :popper-append-to-body="false" class="h-self-select">
							<el-option v-for="item in plans" :key="item.value" :label="item.text" :value="item.value">
							</el-option>
						</el-select>-->
						<el-cascader :options="plans" filterable v-model="planType" :props="props" :show-all-levels="false" class="h-el-cascader"> </el-cascader>
					</el-form-item>					
				</el-form>
				<div class="text-center mt25">
					<a class="alarmBtn red-btn big" @click="startPlan">启动预案</a>
				</div>
			</el-dialog>
		</template>
		
		<template v-else>
			<p class="h-tip">当前暂无需处理的突发事件</p>
		</template>
		
		<div class="mt25">
			<a class="alarmBtn emergency-btn transprent-bg" @click="edit(1,{})"><img  src="../../../../../static/images/emergency/pen_yellow.png"/>新增突发事件</a>
			<a class="alarmBtn blue-btn fr" @click="lookRecord">查看历史记录>></a>
		</div>
		
		<inputEmergency ref="emergency" @refresh="getEvents"></inputEmergency>
		<historyRecord ref="historyRecord"></historyRecord>
		<playAudio ref="play"></playAudio>
	</div>
</template>

<script>
	var timer;
	import eventProgress from './eventProgress.vue';
	import inputEmergency from './inputEmergency.vue';
	import historyRecord from './historyRecord.vue';
	import playAudio from './playAudio.vue';
	export default {
		name: 'Emergency',
		components:{
			eventProgress,//事件进展
			inputEmergency,//突发事件
			historyRecord,//历史记录
			playAudio,//录音
		},
		data(){
			return{
				isplan:false,//是否显示启动预案弹窗
				planType:[],	
				plans: [{
					"name": "网络系统安全突发事件",
					"uuid": "1",
				}], //下拉选择
				currEvent: {},
				events: [],
				props: {
		          value: 'uuid',
		          label:'name',
		          children: 'children'
		       },
		       state:false,
			}
		},
		beforeDestroy(){
			clearInterval(timer);
		},
		mounted(){
			var vm=this;
			vm.init();
			
		},
		watch:{
			currEvent(newvalue){
				var vm=this;
				if(newvalue.planUuid){
					timer=setInterval(function(){
						vm.state=!vm.state;
					},60000);
				}else{
					clearInterval(timer);
				}
			}
		},
		methods:{
			reload(){
				var vm=this;
				try{
					vm.init();
					vm.isplan=false;
					vm.$refs.historyRecord.curr='';
					vm.$refs.emergency.curr='';
					vm.$refs.eventProgress.close();
					vm.$refs.eventProgress.$refs.emergency.curr='';
				}catch(e){
					
				}
			},
			init(){
				var vm=this;
				vm.getEvents();
				vm.getPlans();
			},
			//获取突发事件列表
			getEvents(type){
				var vm=this;
				var params=new FormData();
				params.append('status',0)
				this.$axios.post('contingency/event/list', params).then((res) => {
					this.events= res.eventList || [];		
					if(this.events.length>0){
						if(type=='keep'){
							var arr=this.events.filter(function(item){
								return vm.currEvent.uuid==item.uuid;
							});
							if(arr.length>0){
								vm.currEvent=arr[0];
							}else{
								vm.currEvent=this.events[0];
							}
						}else{
							vm.currEvent=this.events[0];
						}
						this.$emit('showNew',{index:1,state:true})
					}else{
						this.currEvent={};
						this.$emit('showNew',{index:1,state:false})
					}
				})
			},
			//获取预案列表
			getPlans(){
				var vm=this;
				var params={};
				this.$axios.post('contingency/plan/typeList', params).then((res) => {
					var arr= res.eventList || [],lists=[];	
					for(var i=0;i<arr.length;i++){
						var item=arr[i];
						if(item.level==1||item.parentUuid==null){
							lists.push(item);
						}
					}
					lists.forEach(function(item){
						vm.getChildren(arr,item);
					})
					vm.plans=lists;
//					console.log(JSON.stringify(lists))
				})
			},
			getChildren(arr,item){
				var vm=this;
				var children=[];
				for(var i=0;i<arr.length;i++){
					var value=arr[i];
					if(item.uuid==value.parentUuid&&item.uuid!=value.uuid){
						arr.splice(i,1);
						i--;
						vm.getChildren(arr,value);
						children.push(value);
						
					}
				}
				if(children.length>0){
					item.children=children;
				}
			},
			//启动预案
			startPlan(){
				var vm=this;
				if(vm.planType.length==0){
					vm.$message({
						message:'请选择预案',
						type: 'warning'
					});
					return;
				}
				var params={
					planUuid:vm.planType[vm.planType.length-1],
					uuid:vm.currEvent.uuid
				}
				this.$axios.post('contingency/event/startPlan', params).then((res) => {
					var data= res;
					vm.isplan=false;
					vm.planType=[];
					vm.getEvents();
					vm.$message({
						message:data.mess,
						type: 'success'
					});
				})
			},
			//跳转到预案
			jumpPlan(plan){
				if(plan.uuid){
					this.$emit('jumpPlan',plan)
				}
				else{
					this.$message({
						message:'预案不存在',
						type: 'warning'
					});
				}
			},
			//编辑
			edit(type,item){
				this.$refs.emergency.editEvent(type,item);
			},
			//查看历史记录
			lookRecord(){
				this.$refs.historyRecord.curr=1;
			},
			//显示预案选择弹窗
			showPlan(){
				this.isplan=true;
				this.getPlans();
			},
			close(){
				this.isplan=false;
			}
		},
		filters:{
			getHour(currEvent,state){
				var timestart=new Date().getTime();
				var timeend =  new Date(Date.parse(currEvent.planTime.replace(/-/g,"/"))).getTime();
				var value=Math.floor((timestart-timeend)/1000/3600);
				return value>0?value:0;
			},
			getMinutes(currEvent,state){
				var timestart=new Date().getTime();
				var timeend =  new Date(Date.parse(currEvent.planTime.replace(/-/g,"/"))).getTime();
				var value=Math.ceil((timestart-timeend)/1000/60%60);
				return value>0?value:1;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.h-self-select{
		display: block;
	}
	.underline{
		cursor: pointer;
		border-bottom: 1px solid #75CBF2;
	}
	.h-tip{
		color: white;
		text-align: center;
		margin-top: 30px;
		padding-bottom: 25px;
	}
	.h-emergency{
		span {
			display: inline-block;
			font-size: 0.8rem;
			font-weight: 400;
			color: #00FFFF;
		}
		label{
			display: inline-block;
			font-size: 0.8rem;
			color: #75CBF2;
		}
	}
	.Reserve .titles span {
		font-size: 16px;
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
	}
	
	.Reserve .titles span:before {
		content: '';
		position: absolute;
		left: 15px;
		margin-top: 8px;
		width: 4px;
		height: 12px;
		background: rgba(33, 137, 175, 1);
	}
	
	.Reserve .titles {
		padding-left: 10px;
	}
	
	
	
	.Ev-title {
		margin-left: 5px;
		font-size: 16px;
		color: rgba(0, 255, 255, 1);
	}
	
	.Ev-title:before {
		content: '';
		position: absolute;
		/*bottom: 9px;*/
		margin-top: 8px;
		left: 5px;
		width: 4px;
		height: 12px;
		background: rgba(33, 137, 175, 1);
	}
	
	.plan {
		padding: 10px;
		top: 200px;
		right: 50%;
		position: absolute;
		width: 364px;
		height: 140px;
		background: rgba(0, 36, 61, 1);
		border: 1px solid rgba(49, 133, 156, 1);
	}
	.Ev-righe {
		padding-right: 60px;
	}
	.Ev-box .evtext {
		&,*{
			text-align: center;
			color: rgba(117, 203, 242, 1);
			font-size: 0.7rem;
		}
	}
	
	.Ev-box .boxs i {
		margin-left: 5px;
		font-size: 1.2rem;
		font-weight: bold;
		color: rgba(237, 119, 3, 1);
	}
	
	.Ev-box .boxs {
		line-height: 1.5rem;
		padding-bottom: 0.5rem;
		text-align: center;
		background: url(../../../../../static/images/img4.png) no-repeat center bottom;
		*{
			vertical-align: middle;
		}
	}
	
	.Ev-box {
		margin-top: 0.5rem;
	}
	
	.Ev-centos p {
		color: rgba(117, 203, 242, 1);
		font-size: 0.8rem;
	}
	
	.Ev-centos {
		margin-top: 1rem;
		text-align: center;
	}
	.emergency-modal.plan-modal{		
		.el-form-item{
			margin-bottom: 0.75rem;
			span{
				font-size: 0.9rem;
			}
		}
	}
</style>