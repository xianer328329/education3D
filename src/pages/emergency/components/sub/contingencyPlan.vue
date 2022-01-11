<template>
	<div id="">
		<div class="Reserve bgrese" v-show="small">
			<div class="resct">
				<label  class="titles"><span >应急预案</span></label>
				<el-select v-model="firstPlan" :default-first-option="true" class="h-self-select" :popper-append-to-body="false" value-key="uuid" @change="changeFirstPlan">
					<el-option v-for="item in plans" :key="item.uuid" :label="item.name" :value="item" v-if="item.level==1||item.parentUuid==null"></el-option>
				</el-select>
				<el-select v-model="secondPlan" :default-first-option="true" class="h-self-select" :popper-append-to-body="false" value-key="uuid">
					<el-option v-for="item in getSecond" :key="item.uuid" :label="item.name" :value="item"></el-option>
				</el-select>
			</div>
			<div class="alarmBtn emergency-btn mt10" @click="showPlan">启动预案</div>
		</div>
		
		<div class="mt10 mb20" v-show="small">
			<a class="alarmBtn blue-btn fr" @click="openPlanRecord">查看应急预案启动记录》》</a>
			<label  class="titles"><span >应急领导小组</span></label>
			<el-table class="h-group-table mt10" :data="list.peopleList" height="12.5rem">
		      <el-table-column prop="level" label="职称">
		      	 <template slot-scope="scope">{{scope.row.level | getWork}}</template>
		      </el-table-column>
		      <el-table-column prop="name" label="名字" > </el-table-column>
		       <el-table-column prop="phone" label="手机号码"> </el-table-column>
		   </el-table>
		</div>
		<div class="plan-collapse" v-show="small">
			<div class='title'>应急措施<a @click="small=false" v-if="list.contentList&&list.contentList.length>0">查看放大</a></div>
			<div class='item-mn'>
				<ul>
					<li v-for="(item,index) in list.contentList" :key="index"><i>{{index+1}}</i>
						<div class="item-di"><span>{{item.planDesc}}</span></div>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="plan-collapse big" v-if="!small">
			<div class='title'>应急措施<i class="el-dialog__close el-icon el-icon-close fr" @click="small=true"></i></div>
			<div class='item-mn'>
				<ul>
					<li v-for="(item,index) in list.contentList" :key="index"><i>{{index+1}}</i>
						<div class="item-di"><span>{{item.planDesc}}</span></div>
					</li>
				</ul>
			</div>
		</div>
		<!--预案选择弹窗-->
		<el-dialog title="启动预案" center  class="emergency-modal contingency-plan-modal modal-visible" :modal-append-to-body="false" :visible="isplan" :before-close="close" width="430px">
			<el-form label-position="right" label-width="0px" >
				<el-form-item label="">
					<el-radio v-model="hasEvent" :label="1" class="h-emergency-radio">选择对应突发事件</el-radio>   
					<div>
						<el-select v-model="eventId" filterable  default-first-option :popper-append-to-body="false"  class="h-self-select">
							<el-option v-for="item in events"  :label="item.title" :value="item.uuid" :key="item.uuid" v-if="item.planTime==null||item.planTime==''">
							</el-option>
						</el-select>
					</div>
				</el-form-item>
				<el-form-item label="">
				   <el-radio v-model="hasEvent"  :label="2" class="h-emergency-radio">无应急事件启动预案</el-radio> 
				</el-form-item>					
			</el-form>
			<div class="text-center mt25">
				<a class="alarmBtn emergency-btn big" @click="startPlan">启动预案</a>
			</div>
		</el-dialog>
		
		<inputEmergency ref="emergency" @refresh="refresh"></inputEmergency>
		<planRecord ref="planRecord"></planRecord>
	</div>
</template>

<script>
	import inputEmergency from './inputEmergency.vue';
	import planRecord from './planRecord.vue';
	export default {
		name: 'EmergencyLab',
		components:{
			planRecord,//预案启动记录
			inputEmergency,//突发事件
		},
		data(){
			return{
				secondPlan:{},
				firstPlan:{},
				list:{},//选中的预案
				plans: [], //应急预案下拉选择
				isplan:false,//应急预案弹窗
				eventId:'',//事件id
				hasEvent:1,//是否有对应突发事件
				events:[],//事件列表
				tableData:[],
				small:true,
				jump:false,
			}
		},
		mounted(){
			var vm=this;
			vm.init();
		},
		methods:{
			reload(){
				var vm=this;
				vm.init();
				vm.small=true;
				vm.jump=false;
				vm.$refs.planRecord.curr='';
				vm.close();
			},
			init(){
				var vm=this;
				vm.getEvents();
				vm.getPlans();
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
					vm.plans=arr;
					if(lists.length>0){
						vm.firstPlan=lists[0];
					}else{
						vm.firstPlan={}
					}
				})
			},
			//获取突发事件列表
			getEvents(){
				var vm=this;
				var params=new FormData();
				params.append('status',0)
				this.$axios.post('contingency/event/list', params).then((res) => {
					vm.events= res.eventList || [];							
				})
			},
			//选择预案
			change() {
				var vm=this;
				var params=new FormData();
				params.append('uuid',vm.secondPlan.uuid);
				this.$axios.post('contingency/plan/content', params).then((res) => {
					var data= res||{};	
					vm.list=data;
				})
			},
			//由突发事件选择预案跳转过来
			selectPlan(plan){
				var vm=this,state=false;
				this.jump=true;
				for(var i=0;i<vm.plans.length;i++){
					var item=vm.plans[i];
					if(item.level==1||item.parentUuid==null){
						if(item.uuid==plan.uuid){
							vm.firstPlan=item;
							break;
						}
					}else if(item.uuid==plan.uuid){
						vm.secondPlan=item;
						state=true;
					}
				}
				if(state){
					vm.plans.forEach(function(value){
						if(value.uuid==vm.secondPlan.parentUuid){
							vm.firstPlan=value;
						}
					})
				}
			},
			changeFirstPlan(){
				this.jump=false;
			},
			//查看预案启动记录
			openPlanRecord(){
				this.$refs.planRecord.show();
			},
			//显示启动预案弹窗
			showPlan(){
				if(this.secondPlan.uuid||this.firstPlan.uuid){
					this.isplan=true;
				}
				else{
					this.$message({
						message:'没有可用预案',
						type: 'warning'
					});
				}
			},
			//启动预案
			startPlan(){
				var vm=this;
				if(vm.hasEvent==1){//有对应突发事件
					if(vm.eventId==''){
						vm.$message({
							message:'请选择突发事件',
							type: 'warning'
						});
						return;
					}
					var params={
						planUuid:vm.secondPlan.uuid||vm.firstPlan.uuid,
						uuid:vm.eventId
					}
					this.$axios.post('contingency/event/startPlan', params).then((res) => {
						var data= res;
						vm.isplan=false;
						vm.eventId='';
						vm.getEvents();
						vm.$message({
							message:data.mess,
							type: 'success'
						});
					})
				}
				else{//没有突发事件
					this.$refs.emergency.editEvent(5,{planUuid:vm.secondPlan.uuid||vm.firstPlan.uuid});
				}
			},
			refresh(){
				this.isplan=false;
			},
			close(){
				this.eventId='';
				this.isplan=false;
			}
		},
		computed:{
			getSecond(){
				var vm=this;
				var arr=vm.plans.filter(function(item){
					return item.parentUuid==vm.firstPlan.uuid
				});
				if(arr.length>0){
					if(!vm.jump){
						vm.secondPlan=arr[0]
					}
				}else{
					vm.secondPlan={}
				}
				return arr;
			}
		},
		filters:{
			getWork(level){
				if(level==1){
					return '组长'
				}else if(level==2){
					return '副组长'
				}else{
					return '小组成员'
				}
			}
		},
		watch:{
			secondPlan(){
				this.change();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.Reserve span {
		font-size: 16px;
		color: rgba(117, 203, 242, 1);
	}
	.titles {
		padding-left: 10px;
	}
	.titles span {
		color:#75CBF2;
		font-size: 0.8rem;
		position: relative;
		margin-right: 5px;
		line-height: 1.4rem;
	}
	
	.titles span:before {
		content: '';
		position: absolute;
		left: -8px;
		top: 50%;
		width:2px;
		height:14px;
		margin-top: -7px;
		background:rgba(117,203,242,1);
	}
	.resct {
		margin: 0.5rem 0px;
		margin-right: -2rem;
		.el-select {
			width: 13rem;
			margin-right: 2rem;
		}
		
	}
	.plan-collapse{
		margin-bottom: 25px;
		&.big{
			margin: -10px -32px 5px -15px;
			background: #072F4B;
			padding: 10px;
			.item-mn{
				margin-top:10px;
				ul{
					margin-right: 0px;
					max-height: 33rem;
					li{
						border:1px solid #24698B;
						background: #0C3D61;
						padding: 0px;
						margin-top: 0.5rem;
						border-radius:2px;
						margin-right: 0.5rem;
						&:hover{
							color: #75CBF2;
							.item-di{
								background: #0C3D61;
							}
						}
						i{
							font-size: 1.1rem;
							border: none;
							background: none;
							width: 1.5rem;
							color: #00FFFF;
						}
						.item-di{
							width: 33rem;
							margin-left: 0px;
							background: #00243D;
							padding: 0.25rem 0.5rem;
							span{
								font-size: 1.2rem !important;
							}
						}
					}
				}
			}
			.title{
				font-size: 1rem;
				color: #00FFFF;
				&:before{
					width: 0.2rem;
					height: 1rem;
					margin-top: -0.5rem;
				}
			}
		}
		.title{
			color: #75CBF2;
			font-size: 0.8rem;
			position: relative;
			padding-left: 10px;
			line-height: 1.25rem;
			&:before{
				content: '';
				position: absolute;
				left: 0px;
				width: 2px;
				height: 14px;
				background:rgba(117,203,242,1);
				top: 50%;
				margin-top: -7px;
			}
			a{
				background: url(../../../../../static/images/emergency/magnifying.png) no-repeat left center;
				background-size:1rem;
				font-size: 0.8rem;
				color: white;
				float: right;
				padding-left: 1.25rem;
				cursor: pointer;
			}
			.fr{
				font-size: 1.2rem;
				color: white;
				cursor: pointer;
				padding: 0px 5px;
			}
		}
		.item-mn{
			color: #75CBF2;
			ul{
				max-height: 14rem;
				overflow: auto;
				margin-right: -25px;
			}
			li{
				border-bottom:1px solid #014674;
				border-radius:2px;
				margin-top: 0.75rem;
				overflow: hidden;
				padding: 0.25rem 0px;
				cursor: default;
				font-size:0px; 
				white-space: nowrap;
				&:hover{
					color: #0ff;
				}
				i{
					vertical-align: middle;
				    text-align: center;
				    display: inline-block;
				    font-size: 0.8rem;
				    width: 1.2rem;
				    height: 1.2rem;
				    line-height: 1.2rem;
				    text-align: center;
				    border-radius: 3px;
				    border: 1px solid #24698B;
				    background: #00243D;
				}
				.item-di{
				    vertical-align: middle;
				    display: inline-block;
				    height: 100%;
				    width: 33rem;
				    margin-left: 0.5rem;
					white-space: normal;
					word-break: break-all;
				    span{
				    	display: block;
				    	text-align: justify;
			    	    font-size: 0.9rem;
				    }
				}
			}
		}
	}
</style>
<style lang="scss">
	
	.contingency-plan-modal{
		.el-dialog__body{
			padding-left: 1.5rem !important;
			.h-self-select{
				margin-left: 1.4rem;
				// width: 16rem;
				margin-top: 0.5rem;
			}
			.el-form-item{
				margin-bottom: 0.5rem;
			}
		}
	}
	.resct .el-input{
		font-size: 0.7rem;
	}
</style>
