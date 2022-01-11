<template>
	<div>
		<el-dialog :title="title" center  :modal="false" :modal-append-to-body="false" class="h-right-dialog h-mini-dialog"  :visible="curr!=''" :before-close="close">
			<el-table  :data="lists" stripe max-height="500" v-loading="loading" @row-click="rowClick" v-if="curr==1">
				<el-table-column prop="deviceCode" label="设备编号" width="180" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceType" label="设备类型" width="120" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="modifyTime" label="采集时间" width="180" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="位置" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
			<el-table  :data="lists" stripe max-height="500" v-loading="loading" @row-click="rowClick" v-else>
			    <el-table-column prop="alarmTypeName" label="告警类型" width="120" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceCode" label="设备编号" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="time" label="巡检日期" width="120" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="位置" :show-overflow-tooltip="true"> </el-table-column>
				<!-- <el-table-column prop="alarmDesc" label="描述" width="120" :show-overflow-tooltip="true"> </el-table-column> -->
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
			this.bus.$off('getSecurityMaintenance').$on('getSecurityMaintenance',function(i){
				vm.curr=i;
				vm.switchData();
			});
		},
		methods:{
			//点击行
			rowClick(row){
				if(this.curr==1){
					var rows={
						"设备位置":row.deviceName,
						"设备类型":row.deviceType,
						"设备编号":row.deviceCode,
						"采集时间":row.modifyTime
					}
				}else{
					var rows={
						"设备位置":row.deviceName,
						"设备类型":row.deviceType,
						"设备编号":row.deviceCode,
						"巡检日期":row.time
					}
				}
				var params = {
					"title": this.title,
					lon:row.longitude,
					lat:row.latitude,
					"type": "security",
					"index": 3,
					"handleName": "",
//					"butCenter": ["历史记录"],
					"rows":rows
				}
//				console.log(JSON.stringify(row))
				this.bus.$emit('addMapPop',params)
			},
			switchData(){
				var vm=this;
				switch (vm.curr){
					case 1:
						vm.title='离线设备';
						break;
					case 2:
						vm.title='视频质量异常';
						break;
					case 3:
						vm.title='存储异常';
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
				params.append('alarmType',vm.curr);
				params.append('currentPage',vm.tableData.currentPage);
				params.append('pageSize',vm.tableData.pageSize);
				
				this.$axios.post('working/monitor/currentList',params).then(function(res){
					vm.tableData.total=res.total;
					vm.lists=(res.rows||[]).map(item=>{
						return {
							...item,
							time:item.alarmTime?(new Date(item.alarmTime)).Format('yyyy-MM-dd'):'--',
						}
					});
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
</style>