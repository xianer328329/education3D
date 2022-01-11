<template>
 	<div>
 		<el-table  :data="lists" stripe max-height="480" v-loading="loading"  class="visible-table">
		    <el-table-column prop="alarmTypeName" label="告警类型"  :show-overflow-tooltip="true"> </el-table-column>
			<el-table-column prop="blackName" label="被布控人" :show-overflow-tooltip="true"> </el-table-column> 
			<el-table-column prop="blackCode" label="人员编号" :show-overflow-tooltip="true"> </el-table-column>
			<el-table-column prop="blackSimilary" label="相似度" width="80"> </el-table-column>
			<el-table-column prop="alarmTime" label="告警时间" width="180"> </el-table-column>
			<el-table-column prop="deviceCode" label="设备ID" :show-overflow-tooltip="true"> </el-table-column>
			<el-table-column prop="deviceName" label="位置" :show-overflow-tooltip="true"> </el-table-column>
			<el-table-column prop="postion" label="操作">
				<template slot-scope="scope">
						<div class="h-dropdown-self" >
							<span class="el-dropdown-link">处理<i class="el-icon-arrow-down el-icon--right"></i></span>
							<div class="el-select-dropdown el-popper dropdown-c" x-placement="bottom-start">
								<div class="el-scrollbar">
									<div class="el-select-dropdown__wrap el-scrollbar__wrap">
										<ul class="el-scrollbar__view el-select-dropdown__list">
											<li class="el-select-dropdown__item"><el-button type="primary" size="mini" @click="handelalarm(2,scope.row)">误报</el-button></li>
											<li class="el-select-dropdown__item"><el-button type="warning" size="mini" @click="handelalarm(1,scope.row)">归档</el-button></li>
										</ul>
									</div>
								</div>
								<div x-arrow="" class="popper__arrow"></div>
							</div>							
						</div>
					</template>
			</el-table-column>
		</el-table>
		<page :pager="tableData" @pageChange="changePage"></page>
 	</div>
</template>

<script>
	import page from './page.vue'
	export default {
		components:{
			page,//分页
		},
		data(){
			return {
				loading:false,
				lists:[],//表格列表
				tableData:{
				 	total:0,
				 	pageSize:10,
				 	currentPage:1
				 },
			}
		},
		mounted(){
			var vm=this;
			this.bus.$off('getSchoolAlarmDetail').$on('getSchoolAlarmDetail',function(res){
				var params=JSON.parse(res);
				vm.tableData=$.extend(vm.tableData,params);
				vm.tableData.currentPage=1;
				vm.getData();
			})
		},
		methods:{
			//获取告警详情
			getData(){
				var vm=this;
				vm.loading=true;
				var params=new FormData();
				for(var i in vm.tableData){
					params.append(i,vm.tableData[i]);
				}
				this.$axios.post('monitor/alarmInformation/'+UNITID,params).then(function(res){
					vm.lists=res.alarmInfo||[];
					vm.tableData.total=res.total||0;
					vm.$nextTick(function(){
						vm.loading=false
					})
				})
			},
			handelalarm(type,row) { //处理监控报警
				/* type
				 * 0、出去new
				 * 1、归档
				 * 2、误报
				 */
				var vm=this;
				var parasm = new FormData();
				parasm.append('alarmId',row.alarmId);
				parasm.append('handleStatus',type);
				this.$axios.post('monitor/alarmProcessing/' + UNITID, parasm).then((res) => {
					this.tableData.currentPage=1;
					this.getData(); //刷新数据
				})
			},
			//分页改变
			changePage(page){
				var vm=this;
				this.tableData=$.extend(vm.tableData,JSON.parse(page));
				this.getData(this.tableData);
			},
		}
	}
</script>

<style lang="stylus" scoped="scoped">
	.boxtitle{
		color:#75CBF2;
		margin-bottom: 14px;
	}
	.h-content{
		margin-top: 40px;
	}
	.fr{
		float: right;
		margin-top: 10px;
	}
	.fr a{
		display: inline-block;
		text-align: center;
		width:110px;
		cursor: pointer;
		line-height:32px;
		background:rgba(4,120,183,1);
		border-radius:2px;
		font-size: 14px;
		color: white;
	}
	.section{
		width: 50%;
		float: left;
	}
	.section ul{
		width:202px;
		margin: auto;
		margin-top: -10px;
	}
	.section li{
		line-height:44px;
		background:rgba(10,63,94,1);
		border:1px solid rgba(10,80,122,1);
		font-size: 14px;
		color: #999999;
		padding: 0px 15px;
		margin-bottom: 4px;
		cursor: pointer;
	}
	.section .number{
		float: right;
		font-size: 22px;
	}
	
	.yellow *{
		color: #FFCC00;
	}
	.blue *{
		color: #00FFFF;
	}
	.section.right li{
		line-height:70px;
	}
	.h-title{
		width:169px;
		height:30px;
		border:1px solid rgba(0,255,255,0.5);
		border-radius:2px;
		margin: auto;
		text-align: center;
	}
	.h-title h4{
		display: inline-block;
		font-size: 16px;
		color: #75CBF2;
		text-align: center;
		margin-top: -30px;
		background: rgb(2, 26, 44);
		padding: 0px 2px;
	}
	.h-title h4 b{
		font-size: 22px;
		color: #00FFFF;
		margin: 0px 5px;
	}
	.h-title *{
		vertical-align: middle;
	}
	.h-tip{
		color: #31859C;
		font-size: 14px;
	}
	.h-select{
		width: 100%;
	}
	
	.range{
		position: relative;
		
	}
	.tree{
		height: 260px;
		overflow: auto;
		margin-bottom: 40px;
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
	}
	.h-dropdown .el-dropdown-menu__item{
	    padding: 0px 15px;
	   margin-bottom: 4px;
	}	
	.h-dropdown .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
		background: transparent;
	}
	
	.h-dropdown-c{
	    background: #00365C;
	    border: none;
	    color: #eeeeee;
	    text-align: right;
	    cursor: pointer;
	}
	.h-dropdown-c .el-button{
		border: none;
		outline: none;
		background-color: #004E81;
    	color: #75CBF2;
    	padding: 10px;
	}
	.plates{
		display: inline-block;
		position: relative;
		color: white;
		border: 1px solid #004E81;
		padding: 2px 15px;
		margin-top: 15px;
		border-radius: 5px;
		margin-right: 20px;
		font-size: 14px;
	}
	.plates span{
		font-size: 14px;
	}
	.plates .el-button{
	    border: none;
	    outline: none;
	    color: #fff;
	    position: absolute;
	    right: -14px;
	    top: -14px;
	    padding: 5px 5px;
	    cursor: pointer;
	    background: rgba(0,0,0,0.5);
	    border-radius: 50%;
	}
	.h-textarea-c{
		position: relative;
	}
	.append{
		position: absolute;
		right: 8px;
		bottom: -5px;
		color: #75CBF2;
	}
	.h-dropdown-self{
		/*position: relative;*/
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
<style>
	.h-dropdown .popper__arrow::after{
	    border-bottom-color:#004E81 !important;
	}
	.h-dropdown .popper__arrow{
		 border-bottom-color:#00FFFF !important;
	}
</style>