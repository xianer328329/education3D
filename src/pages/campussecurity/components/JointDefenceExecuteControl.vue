<template>
	<div>
		<h4 class="Distributiontitle">联防布控</h4>
		<div class="Distributionstart" @click="showSub(1)"><span>发起联防布控</span></div>
		<div class="D-lower backboxContainer vertical-middle-c">
			<ul class="vertical-middle">
				<li>
					<div class="D-boder"></div>
					<div class="D-title"><span>协助联防</span><i class="acsstype">{{datalist.numberOfJoint_numberOfJoint}}</i><span>次</span></div>
					<div class="D-leftmo">
						<div class="D-block co-yellow" @click="operate(2,1)"><img src="../../../../static/images/carSupervision/time3.png"/><span>待处理</span><i class="acsstype">{{datalist.numberOfJoint_toBeProcessed}}</i></div>
						<div class="D-block co-blue" @click="operate(3,1)"><img src="../../../../static/images/carSupervision/time1.png"/><span>进行中</span><i class="acsstype">{{datalist.numberOfJoint_processing}}</i></div>
						<div class="D-block co-gray" @click="operate(1,1)"><img src="../../../../static/images/carSupervision/time2.png"/><span>已完成</span><i class="acsstype">{{datalist. numberOfJoint_completed}}</i></div>

					</div>
				</li>
				<li class="D-li-right">
					<div class="D-boder "></div>
					<div class="D-title"><span>发起联防</span><i class="acsstype">{{datalist.InitiateJoint_InitiateJoint}}</i><span>次</span></div>
					<div class="D-leftmo">
						<div class="D-maxblock co-blue" @click="operate(1,2)"><img src="../../../../static/images/carSupervision/time1.png"/><span>进行中</span><i class="acsstype">{{datalist.InitiateJoint_processing}}</i></div>
						<div class="D-maxblock co-gray" @click="operate(2,2)"><img src="../../../../static/images/carSupervision/time2.png"/><span>已完成</span><i class="acsstype">{{datalist.InitiateJoint_completed}}</i></div>

					</div>

				</li>
			</ul>
		</div>
		<!--联防人员布控-->
		<el-dialog title="联防人员布控" class="h-dialog h-dialog-dropdown defence-modal" :center="true" :modal-append-to-body="false" width="60%" :visible="showdetails" :before-close="closedetails">
			<el-form :inline="true">
				<el-form-item label="联防分类" class="h-time-c1">
					<el-select v-model="tableData.type" placeholder="联防分类" @change="search" :popper-append-to-body="false">
						<el-option label="全部" :value="0"></el-option>
						<el-option label="协助联防" :value="1"></el-option>
						<el-option label="发起联防" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联防状态" class="h-time-c1">
					<el-select v-model="tableData.status" placeholder="联防状态" @change="search" :popper-append-to-body="false" default-first-option>
						<el-option label="全部" :value="0"></el-option>
						<el-option v-for="item in status[tableData.type-1]" :label="item.name" :value="item.type" :key="item.type" v-if="tableData.type>0"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-table :data="cars" stripe max-height="500" v-loading="loading">
				<el-table-column prop="controlName" label="姓名" width="100" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="storageTime" label="入库时间" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="controlDesc" label="布控描述" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="initiator" label="布控发起单位" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="scopeControl" label="布控范围" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="status" label="状态" width="100" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="scopeControl" label="操作" width="220">
					<template slot-scope="scope">
						<el-button type="text" class="success" @click="showPeople(scope.row)">被布控人</el-button>
						<el-button type="text" class="warning" @click="showSub(3,scope.row)">告警信息</el-button>
						<el-button type="text" class="primary" v-if="scope.row.type==2" @click="showSub(2,scope.row)">接收详情</el-button>
						<el-dropdown trigger="hover" placement="bottom-start"  v-else-if="scope.row.handleStatus==2">
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
		<el-dialog title="新增人脸联防布控" class="defence-modal" center width="550px" :modal-append-to-body="false" :visible="sub==1" :before-close="closeSub">
			<adduserControl></adduserControl>
		</el-dialog>
		<!--接收详情-->
		<el-dialog title="接收详情" center  class="defence-modal h-dialog"  width="55%" :modal-append-to-body="false" :visible="sub==2" :before-close="closeSub">
			<receiveDetail></receiveDetail>
		</el-dialog>
		<!--告警信息-->
		<el-dialog title="告警信息" center class="defence-modal h-dialog"  width="55%" :modal-append-to-body="false" :visible="sub==3" :before-close="closeSub">
			<alarmDetail></alarmDetail>
		</el-dialog>
		<!--被布控人-->
		<el-dialog :title="currPeople.controlName" class="img-dialog defence-modal" width="35%" :modal-append-to-body="false" :visible="people" :before-close="closePeople">
			<img :src="imgUrl+currPeople.controlImg+'?token='+token" v-if="currPeople.controlImg"/>
		</el-dialog>
	</div>
</template>

<script>
	import adduserControl from './adduserControl.vue'
	import receiveDetail from './receiveDetail.vue'
	import alarmDetail from './alarmDetail.vue'
	import page from './page.vue'
	export default {
		components: {
			adduserControl, //添加人员布控
			page,//分页
			receiveDetail,//接收详情
			alarmDetail,//告警信息
		},
		data() {
			return {
				datalist:{
					numberOfJoint_numberOfJoint:"--",
					numberOfJoint_toBeProcessed:"--",
					numberOfJoint_processing:"--",
					numberOfJoint_completed:"--",
					InitiateJoint_InitiateJoint:"--",
					InitiateJoint_processing:"--",
					InitiateJoint_completed:"--",
				}, //获取的接口数据
				imgUrl:OHTTP,
				loading:false,
				showdetails: false,
				sub:'',//子弹窗标志
				people:false,
				currPeople:{},
				token:localStorage.getItem('TOKEN'),
				tableData: {
					type: '', //联防分类
					status: '', //联防状态
					total: 0,
					pageSize: 10,
					currentPage: 1
				},
				cars: [],
				status: [
					[{
						type: 2,
						name: '待处理'
					},
					{
						type: 3,
						name: '进行中'
					},
					{
						type: 1,
						name: '已完成'
					},{
						type: 4,
						name: '已拒绝'
					},{
						type: 5,
						name: '已超时'
					}],
					[{
						type: 1,
						name: '进行中'
					},
					{
						type: 2,
						name: '已完成'
					}]
				],
				receive:false,//显示接收详情
				alarm:false,//显示告警细腻
			}
		},
		mounted() {
			var _this = this;
			this.getjointControl(); //获取数据
			this.bus.$off('getjointControl').$on('getjointControl', function() {
				_this.getjointControl();
			});
			this.bus.$off('closedialog').$on('closedialog',function(){
				_this.closeSub();
			});
			
		},
		methods: {
			//显示添加联防布控
			showSub(i,row) {
				this.sub = i;
				if(i==2){
					var params={
						controlName:row.controlName,
						storageTime:row.storageTime,
						unitUuid:UNITID
					}
					this.bus.$emit('getSchoolReceiveDetail',JSON.stringify(params));
				}
				else if(i==3){
					var params={
						blacklistUuid:row.blacklistUuid,
						unitUuid:UNITID
					}
					this.bus.$emit('getSchoolAlarmDetail',JSON.stringify(params));
				}
			},
			//显示被布控人照片
			showPeople(item){
				this.people=true;
				this.currPeople=item;
			},
			//处理
			handle(row,type){
				var vm=this;
				var params=new FormData();
				params.append('uuid',row.uuid);
				params.append('handleStatus',type);
				this.$axios.post('monitor/controlProcessing/'+UNITID,params).then(function(data){
					vm.$message({
					   message:'操作成功',
					   type: 'success'
					});
					 vm.getjointControl();
					 vm.getuser();
				})
			},
			//获取布控列表
			getjointControl() {
				this.loading=true;
				this.$axios.post('monitor/jointControl/'+UNITID).then((res) => {
					var data = res|| [];
					this.datalist = data;
					this.$nextTick(function(){
						this.loading=false;
					})
				})
			},
			search() {
				this.tableData.currentPage = 1;
				this.getuser();
			},
			//显示弹窗
			operate(i, type) {
				this.showdetails = true;
				if(type) {
					this.tableData.type = type * 1;
					this.tableData.status = i * 1;
					this.getuser();
				}
			},
			//获取布控统计
			getuser() {
				var vm = this;
				var param = new FormData();
				for(var i in vm.tableData) {
					param.append(i, vm.tableData[i]);
				}
				this.$axios.post('monitor/jointControlList/' + UNITID, param).then(function(res) {
						vm.tableData.total = res.assistInJointTotal + res.initiateJointTotal;
						if(vm.tableData.type == '') {
							vm.cars = res.assistInJoint.concat(res.initiateJoint);
						} else if(vm.tableData.type == 1) {
							vm.cars = res.assistInJoint;
						} else {
							vm.cars = res.initiateJoint;
						}
				})
			},
			changePage(page) {
				var vm=this;
				this.tableData = $.extend(vm.tableData, JSON.parse(page));
			},
			//关闭主弹窗
			closedetails(){
				this.showdetails=false;
				this.tableData.currentPage=1;
				this.cars=[];
			},
			//关闭子弹窗
			closeSub(){
				this.sub='';
				this.bus.$emit('claerimg');
			},
			//关闭被布控人弹窗
			closePeople(){
				this.people=false;
				this.currPeople={}
			},
			
		}
	}
</script>

<style lang="scss" scoped>

	.D-maxblock i {
		font-size: 1.1rem;
		font-weight: 500;
		float: right;
	}
	
	.D-maxblock span {
		font-size: 0.8rem;
	}
	
	.D-maxblock {
		height: 3.3rem;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		padding: 0px 0.5rem;
		line-height: 3.3rem;
		margin-bottom: 0.3rem;
		cursor: pointer;
	}
	
	.D-leftmo {
		margin-top: -1rem;
	}
	
	.D-block i {
		float: right;
		font-size: 1.1rem;
		font-weight: 500;
	}
	
	.D-block span {
		display: inline-block;
		font-size: 0.8rem;
	}
	
	.co-yellow {
		color: rgba(255, 204, 0, 1);
	}
	
	.co-blue {
		color: rgba(117, 203, 242, 1);
	}
	
	.co-gray {
		color: rgba(153, 153, 153, 1);
	}
	
	.D-block {
		height: 2.1rem;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		line-height: 2.1rem;
		padding: 0px 0.5rem;
		margin-bottom: 0.25rem;
		cursor: pointer;
	}
	
	.D-title {
		white-space: nowrap;
		text-align: center;
		position: absolute;
		background-color: #021a2c;
		top: 0;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	
	.D-title span {
		font-size: 0.8rem;
		color: rgba(117, 203, 242, 1);
	}
	
	.D-title i {
		display: inline-block;
		color: rgb(0, 255, 255);
		font-size: 0.9rem;
		font-weight: bold;
		margin: 0px 0.15rem 0px 0.15rem;
	}
	
	.D-lower ul li {
		position: relative;
		width: 49%;
		float: left;
		text-align: left;
	}
	
	.D-li-right {
		float: right !important;
	}
	
	.D-boder {
		width: 80%;
		margin: auto;
		height: 2.1rem;
		border: 1px solid rgba(25, 94, 127, 1);
		border-radius: 4px 4px 0px 0px;
	}
	
	.Distributiontitle {
		color: rgba(117, 203, 242, 1);
	}
	
	.Distributionstart {
		min-width: 5.8rem;
		height: 1.1rem;
		border: 1px solid rgba(0, 255, 255, 1);
		border-radius: 2px;
		position: absolute;
		top: 0.35rem;
		right: 0.65rem;
		line-height: 1.1rem;
		text-align: center;
		background-color: rgb(1, 95, 108);
		cursor: pointer;
	}
	
	.Distributionstart span {
		font-size: 0.8rem;
		color: rgba(254, 254, 254, 1);
	}
	.h-dialog .el-form {
		padding-left: 15px;
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
		.el-scrollbar{
	     	background: transparent;
	    }
	}
	.h-dropdown-self:hover .dropdown-c{
		transform: scaleY(1);
	}
	.h-dropdown-self .el-dropdown-link,.success{
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
</style>
<style lang="scss">
	.img-dialog .el-dialog__body{
		min-height: 20rem;
		img{
			border: none;
			max-width: 100%;
			margin: auto;
		}
	}
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
	.h-dialog .el-dialog{
		position: absolute !important;
		right: 27% !important;
	}
	.h-dialog .el-dialog__body{
		padding:20px 0px 15px 0px !important;
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
	.D-lower li img{
	    display: inline-block;
	    width: 1rem;
	    height: 1rem;
	    vertical-align: middle;
	    margin-right: 0.2rem;
	}
	.h-dropdown .el-dropdown-menu__item{
		margin-bottom: 0px;
	   .el-button--mini span{
			font-size: 0.75rem;
		}
	}
	.defence-modal{
		background: rgba($color: #000000, $alpha: 0.3);
	}
</style>