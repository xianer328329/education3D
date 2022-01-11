<template>
	<div class="h-container">
		<h4 class="boxtitle">联防布控</h4>
		<div class="h-time-c">
			<a class="active" @click="operate(6)">发起联防布控</a>
		</div>
		<div class="h-content backboxContainer vertical-middle-c">
			<div class="vertical-middle clearFix">
				<div class="section">
					<div class="h-title">
						<h4><i>协助联防</i><b class="Z-numberf">{{statistics.numberOfJoint_numberOfJoint}}</b><i>次</i></h4>
					</div>
					<ul>
						<li class="yellow" @click="operate(2,1)">
							<span class="number Z-numberf">{{statistics.numberOfJoint_toBeProcessed}}</span>
							<img src="../../../../static/images/carSupervision/time3.png"/>
							<span class="text">待处理</span>
						</li>
						<li class="blue" @click="operate(3,1)">
							<span class="number Z-numberf">{{statistics.numberOfJoint_processing}}</span>
							<img src="../../../../static/images/carSupervision/time1.png"/>
							<span class="text">进行中</span>
						</li>
						<li @click="operate(1,1)">
							<span class="number Z-numberf">{{statistics.numberOfJoint_completed}}</span>
							<img src="../../../../static/images/carSupervision/time2.png"/>
							<span class="text">已完成</span>
						</li>
						
					</ul>
				</div>
				<div class="section right">
					<div class="h-title">
						<h4><i>发起联防</i><b class="Z-numberf">{{statistics.InitiateJoint_InitiateJoint}}</b><i>次</i></h4>
					</div>
					<ul>
						<li class="blue" @click="operate(1,2)">
							<span class="number Z-numberf">{{statistics.InitiateJoint_processing}}</span>
							<img src="../../../../static/images/carSupervision/time1.png"/>
							<span class="text">进行中</span>
						</li>
						<li @click="operate(2,2)">
							<span class="number Z-numberf">{{statistics.InitiateJoint_completed}}</span>
							<img src="../../../../static/images/carSupervision/time2.png"/>
							<span class="text">已完成</span>
						</li>
						
					</ul>
				</div>
			</div>
		</div>
		
		<!--联防布控车辆-->
		<el-dialog title="联防布控车辆" center class="h-dialog h-dialog-dropdown defence-modal"  :modal-append-to-body="false" width="58%" :visible="curr!=''&&curr!=6" :before-close="close">
		 	<el-form :inline="true">
			  <el-form-item label="联防分类"  class="h-time-c1">
			     <el-select  v-model="tableData.type" placeholder="联防分类" @change="changeType" :popper-append-to-body="false">
				      <el-option label="全部" :value="0"></el-option>
				      <el-option label="协助联防" :value="1"></el-option>
				      <el-option label="发起联防" :value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="联防状态"   class="h-time-c1">
			     <el-select  v-model="tableData.status" placeholder="联防状态"  @change="search" :popper-append-to-body="false" default-first-option>
			     	<el-option label="全部" :value="0"></el-option>
			        <el-option v-for="item in status[tableData.type-1]" :label="item.name" :value="item.type" :key="item.type"></el-option>
			    </el-select>
			  </el-form-item>
			</el-form>
			<el-table  :data="cars" stripe max-height="500" v-loading="loading" class="visible-table">
			   <el-table-column prop="carPlate" label="车牌" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="storageTime" label="入库时间" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="controlDesc" label="布控描述"  :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="initiator" label="布控发起单位" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="scopeControl" label="布控范围" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="scopeControl" label="操作" width="200">
					<template slot-scope="scope">
						<el-button type="text" class="warning" @click="showAlarmDetail(scope.row)">告警信息</el-button>
						<el-button type="text" class="primary" v-if="scope.row.type==2" @click="showReceiveDetail(scope.row)">接收详情</el-button>
						<!--<div class="h-dropdown-self"  v-else-if="scope.row.handleStatus==2">
							<span class="el-dropdown-link">处理<i class="el-icon-arrow-down el-icon--right"></i></span>
							<div class="el-select-dropdown el-popper dropdown-c" x-placement="bottom-start">
								<div class="el-scrollbar">
									<div class="el-select-dropdown__wrap el-scrollbar__wrap">
										<ul class="el-scrollbar__view el-select-dropdown__list">
											<li class="el-select-dropdown__item"><el-button type="primary" size="mini"  @click="handle(scope.row,2)">同意</el-button></li>
											<li class="el-select-dropdown__item"><el-button type="warning" size="mini" @click="handle(scope.row,1)">拒绝</el-button></li>
										</ul>
									</div>
								</div>
								<div x-arrow="" class="popper__arrow"></div>
							</div>							
						</div>-->
						
						<el-dropdown trigger="hover" placement="bottom-start"   v-else-if="scope.row.handleStatus==2">
							<span class="el-dropdown-link">处理<i class="el-icon-arrow-down el-icon--right"></i></span>
							<el-dropdown-menu slot="dropdown" class="h-dropdown">
								<el-dropdown-item>
									<el-button type="primary" size="mini" @click="handle(scope.row,2)">同意</el-button>
								</el-dropdown-item>
								<el-dropdown-item>
									<el-button type="warning" size="mini" @click="handle(scope.row,1)">拒绝</el-button>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				</el-table>
			<page :pager="tableData" @pageChange="changePage"></page>
		</el-dialog>
		<!--发起联防布控车辆-->
		<el-dialog title="新增车辆联防布控" center  width="550px" class="defence-modal" :modal-append-to-body="false" :visible="curr==6" :before-close="close">
			<addDefenseControl></addDefenseControl>
		</el-dialog>
		<!--接收详情-->
		<el-dialog title="接收详情" center  :modal-append-to-body="false" class="defence-modal" :visible="receive" :before-close="closeReceive">
			<receiveDetail></receiveDetail>
		</el-dialog>
		<!--告警信息-->
		<el-dialog title="告警信息" center  :modal-append-to-body="false" class="defence-modal" :visible="alarm" :before-close="closeAlarm">
			<alarmDetail></alarmDetail>
		</el-dialog>
	</div>
</template>

<script>
	import addDefenseControl from './addDefenseControl.vue'
	import receiveDetail from './receiveDetail.vue'
	import alarmDetail from './alarmDetail.vue'
	import page from './page.vue'
	export default {
		components:{
			addDefenseControl,//发起布控
			page,//分页
			receiveDetail,//接收详情
			alarmDetail,//告警信息
		},
		data(){
			return {
				 curr:'',
				 statistics:{
				 	numberOfJoint_numberOfJoint:"--",
				 	numberOfJoint_toBeProcessed:"--",
				 	numberOfJoint_processing:"--",
				 	numberOfJoint_completed:"--",
				 	InitiateJoint_InitiateJoint:"--",
				 	InitiateJoint_processing:"--",
				 	InitiateJoint_completed:"--",
				 },//统计数据
				 cars:[],////表格数据，布控车辆
				 loading:false,
				 status:[[
				 	{
				 		type:1,
				 		name:'已完成'
				 	},
				 	{
				 		type:2,
				 		name:'待处理'
				 	},
				 	{
				 		type:3,
				 		name:'进行中'
				 	},
				 	{
				 		type:4,
				 		name:'已拒绝'
				 	},
				 	{
				 		type:5,
				 		name:'已超时'
				 	},
				 ],[
				 	{
				 		type:1,
				 		name:'进行中'
				 	},
				 	{
				 		type:2,
				 		name:'已完成'
				 	}
				 ]],
				 show:false,//显示布控范围下拉
				 tableData:{
				 	type:'',//联防分类
				 	status:'',//联防状态
				 	total:0,
				 	pageSize:10,
				 	currentPage:1
				 },
				 times:[],//监控时长
				 areas: [],
				 showBtn:'a',
				 receive:false,//显示接收详情
				 alarm:false,//显示告警细腻
				 
			}
		},
		mounted(){
			var vm=this;
			this.getData();
			this.bus.$off('closeModal').$on('closeModal',function(){
				vm.close();
			});
			this.bus.$off('getControl').$on('getControl',this.getData);
		},
		methods:{
			//布控车辆筛选
			search(){
				this.tableData.currentPage=1;
				this.getCars();
			},
			//布控分类改变
			changeType(){
				this.tableData.status=0;
				this.search();
			},
			//布控车辆分页改变
			changePage(page){
				var vm=this;
				this.tableData=$.extend(vm.tableData,JSON.parse(page));
				this.getCars();
			},
			//获取联防布控统计数据
			getData(){
				var vm=this;
				this.$axios.post('traffic/pass/jointControl/'+UNITID).then(function(res){
					vm.statistics=res;
				})
			},
			//获取联防布控车辆
			getCars(){
				var vm=this;
				vm.loading=true;
				var param=new FormData();
				for(var i in vm.tableData){
					param.append(i,vm.tableData[i]);
				}
				this.$axios.post('traffic/pass/jointControlList/'+UNITID,param).then(function(res){
					vm.tableData.total=res.assistInJointTotal+res.initiateJointTotal;
					if(vm.tableData.type==''){
						vm.cars=res.assistInJoint.concat(res.initiateJoint);
					}else if(vm.tableData.type==1){
						vm.cars=res.assistInJoint;
					}else{
						vm.cars=res.initiateJoint;
					}
					vm.$nextTick(function(){
						vm.loading=false;
					})
				})
			},
			//显示弹窗
			operate(i,type){
				this.curr=i;
				if(type){
					this.tableData.type=type*1;
					this.tableData.status=i*1;
					this.getCars();
				}
			},
			//处理
			handle(row,type){
				var vm=this;
				var params=new FormData();
				params.append('uuid',row.uuid);
				params.append('handleStatus',type);
				this.$axios.post('traffic/pass/controlProcessing/'+UNITID,params).then(function(data){
					vm.$message({
					  message:'操作成功',
					  type: 'success'
					});
					vm.getCars();
					vm.getData();
				})
			},
			//显示接收详情
			showReceiveDetail(row){
				this.receive=true;
				this.$nextTick(function(){
					var params={
						carPlate:row.carPlate,
						storageTime:row.storageTime,
					}
					this.bus.$emit('getReceiveDetail',JSON.stringify(params));
				})
			},
			//显示告警详情
			showAlarmDetail(row){
				this.alarm=true;
				this.$nextTick(function(){
					var params={
						carPlate:row.carPlate,
					}
					this.bus.$emit('getAlarmDetail',JSON.stringify(params));
				})
			},
			//显示布控下拉菜单
			dropdown(){
				this.show=!this.show;
			},
			//关闭弹窗
			close(){
				this.curr='';
				this.tableData.currentPage=1;
				this.cars=[];
			},
			//关闭接收详情弹窗
			closeReceive(){
				this.receive=false;
			},
			//关闭告警详情弹窗
			closeAlarm(){
				this.alarm=false;
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.boxtitle{
		color:#75CBF2;
	}
	.el-form{
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}
	.fr{
		float: right;
		margin-top: 10px;
	}
	.fr a{
		display: inline-block;
		text-align: center;
		width:5.5rem;
		cursor: pointer;
		line-height:1.6rem;
		background:rgba(4,120,183,1);
		border-radius:2px;
		font-size: 0.7rem;
		color: white;
	}
	.section{
		width: 50%;
		text-align: left;
		float: left;
	}
	.section ul{
		width:96%;
		margin: auto;
		margin-top: -0.6rem;
	}
	.section li{
		line-height:2.2rem;
		background:rgba(10,63,94,1);
		border:1px solid rgba(10,80,122,1);
		font-size: 0.8rem;
		color: #999999;
		padding: 0px 0.75rem;
		margin-bottom: 0.2rem;
		cursor: pointer;
	}
	.section .text{
		font-size: 0.8rem;
		vertical-align: middle;
	}
	.section li img{
		display: inline-block;
		width:1rem;
		height: 1rem;
		vertical-align: middle;
		margin-right: 0.2rem;
	}
	.section .number{
		float: right;
		font-size: 1.1rem;
	}
	
	.yellow *{
		color: #FFCC00;
	}
	.blue *{
		color: #00FFFF;
	}
	.section.right li{
		height: 3.59rem;
		line-height:3.5rem;
	}
	.h-title{
		width:80%;
		height:1.6rem;
		border:1px solid rgba(0,255,255,0.5);
		border-radius:2px;
		margin: auto;
		text-align: center;
	}
	.h-title h4{
		display: inline-block;
		font-size: 0.8rem;
		color: #75CBF2;
		text-align: center;
		margin-top: -1.5rem;
		background: #001525;
		padding: 0px 2px;
	}
	.h-title h4 b{
		font-size: 1.1rem;
		color: #00FFFF;
		margin: 0px 0.25rem;
	}
	.h-title *{
		vertical-align: middle;
		font-size: 0.8rem;
	}
	.h-tip{
		color: #31859C;
		font-size: 0.7rem;
	}
	.h-select{
		width: 100%;
	}
	
	.range{
		position: relative;
		
	}
	.tree{
		height: 200px;
		overflow: auto;
	}
	.range-c{
		position: absolute;
		left: 0px;
		top: 50px;
		right: 0px;
		background: #002037;
		border:1px solid rgba(117,203,242,1);
		border-radius:2px;
		z-index: 1;
		padding: 15px;
	}
	.el-tree{
		background: transparent;
	}
	.h-dropdown{
		padding: 10px 0px 6px 0px;
	     background: #004E81;
	     border: 1px solid #00FFFF;
	     .el-scrollbar{
	     	background: transparent;
	     }
	}
	.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
 		background: transparent !important;
 	}
	.h-dropdown .el-dropdown-menu__item{
	    padding: 0px 15px;
	   margin-bottom: 4px;
	}	
	.h-dropdown .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
		background: transparent;
	}
	.el-table .el-button{
		padding: 0px ;
	}
	
	.h-dropdown-self{
		position: relative;
		display: inline-block;
		margin-left: 10px;
	}
	.h-dropdown-self:hover .dropdown-c{
		transform: scaleY(1);
	}
	.h-dropdown-self .el-dropdown-link{
		cursor: pointer;
		color: #00FFFF;
	}
	.h-dropdown-self .dropdown-c{
		width: 100px;
		min-width: 100px !important;
		position: absolute;
		top: 15px;
		left:-35px;
		padding: 10px 15px 0px 15px;
		transform: scaleY(0);
		transform-origin: top;
		transition: all .1s linear;
		&.el-select-dropdown{
			background: #004E81;
		}
		.popper__arrow::after{
			border-bottom-color: #004E81;
		}
		.popper__arrow{
			border-bottom-color: #00FFFF;
		}
		li{
			padding: 0px;
			margin-bottom: 10px;
		}
		.el-button{
			padding: 6px 15px;
		}
		.el-button--warning{
			background: #DB7202;
		}
	}
	.h-time-c{
		top: 8px !important;
		a{
			padding-left:5px !important;
			padding-right: 5px !important;
		}
	}
</style>
<style lang="scss">
	.h-dialog-dropdown .el-dialog__body,.h-dialog-dropdown .el-dialog__body *{
		overflow: visible !important;
		&.el-scrollbar{
			overflow-y: auto !important;
		}
		&.el-table__body-wrapper{
			overflow-y: auto !important;
		}
	}
	.h-dialog-dropdown .el-select-dropdown__wrap{
		margin-bottom: 0px !important;
	}
	.h-dialog-dropdown .h-pager{
		overflow: hidden !important;
	}
	.h-dialog .el-dialog__body{
		padding:1rem 0px 0.75rem 0px !important;
	}
	.h-dropdown .popper__arrow::after{
	    border-bottom-color:#004E81 !important;
	}
	.h-dropdown .popper__arrow{
		 border-bottom-color:#00FFFF !important;
	}
	.h-time-c1{
		position: relative;
	}
	.h-time-c1 .el-select-dropdown{
		position: absolute !important;
		left: 0px !important;
		right: 0px !important;
		top: 2.1rem !important;
	}
	.h-dropdown .el-dropdown-menu__item{
		margin-bottom: 0px;
	   .el-button--mini span{
			font-size: 0.75rem;
		}
	}
</style>