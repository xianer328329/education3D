<template>
	<div>
		<el-dialog :title="title" center :modal="false" :modal-append-to-body="false"  class="h-right-dialog h-mini-dialog"  :visible="curr!=''" :before-close="close">
			<el-button size="mini" class="h-mini" :class="{'el-button--primary':index==2}" @click="operate(2)">故障</el-button>
			<el-button size="mini" class="h-mini" :class="{'el-button--primary':index==3}" @click="operate(3)">其他</el-button>
			<el-table  :data="lists" stripe max-height="500" :key="'lists'+index" v-loading="loading" @row-click="rowClick">
			    <el-table-column prop="alarmTypeName" label="告警类型" width="100" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceCode" label="设备编号" width="120" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="告警设备" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="alarmTime" label="告警时间" width="180" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="buildName" label="楼宇" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="position" label="位置" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
			<page :pager="tableData" @pageChange="changePage"></page>
		</el-dialog>
	</div>
</template>

<script>
	import page from '../../carsupervision/components/page.vue'
	export default{
		data(){
			return {
				lists:[],
				curr:'',
				loading:false,
				index:2,//当前选中选项卡
				title:'',//弹窗标题
				tableData:{
					total:0,
				 	pageSize:10,
				 	currentPage:1
				},
			}
		},
		components:{
			page,//分页
		},
		mounted(){
			var vm=this;
			this.bus.$off('getFireMaintenance').$on('getFireMaintenance',function(i){
				vm.curr=i;
				vm.switchData();
			});
		},
		methods:{
			//点击行
			rowClick(row){
				var params={
					title:this.index==2?'故障':'其他',			
					lon:row.longitude,													
					lat:row.latitude,
					wminValue:row.wminValue,			
					wmaxValue:row.wmaxValue,														
					valueUnit:row.valueUnit,														
					butCenter:'',														
					alarmDesc:row.alarmDesc,
					rows:{
						'楼宇':row.buildName,
						'位置':row['position'],															
						'告警设备':row.deviceName,
						'事件':row.alarmDesc,
						'设备编号':row.deviceCode,														
						'告警时间':row.alarmTime,
					}
				}
//				console.log(JSON.stringify(row))
				this.bus.$emit('addMapPop',params)
			},
			switchData(){
				var vm=this;
				switch (vm.curr){
					case 1:
						vm.title='当日未处理';
						break;
					case 2:
						vm.title='逾期未处理';
						break;
					case 3:
						vm.title='未处理总数';
						break;
					default:
						vm.title='';
						break;
				}
				vm.getLists();
			},
			//列表
			getLists(){
				var vm=this;
				vm.loading=true;
				var params=new FormData();
				params.append('alarmType',vm.index);
				if(vm.curr==1){
					params.append('nowHandle',vm.curr);
				}else if(vm.curr==2){
					params.append('nowHandle',0);
					params.append('alarmTimeEnd',(new Date()).Format('yyyy-MM-dd 00:00:00'));
				}else{
					params.append('nowHandle',0);
				}
				params.append('handleStatus',0);
				params.append('currentPage',vm.tableData.currentPage);
				params.append('pageSize',vm.tableData.pageSize);
				
				this.$axios.post('home/fire/alarmList',params).then(function(res){
					vm.tableData.total=res.total;
					vm.lists=res.rows;
					vm.$nextTick(function(){
						vm.loading=false;
					})
				});
			},
			//分页改变
			changePage(page){
				this.tableData=$.extend(this.tableData,JSON.parse(page));
				this.getLists();
			},
			operate(i){
				this.index=i;
				this.tableData.currentPage=1;
				this.getLists();
			},
			//关闭弹窗
			close(){
				this.curr='';
				this.tableData.currentPage=1;
				this.lists=[]
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
.h-header-button{
	position: absolute;
	right: 70px;
	top: 4px;
	span{
		font-size: 12px;
	}
}
.h-mini{
	margin-bottom: 10px;
	margin-left: 10px;
	color: #EEEEEE;
}
</style>