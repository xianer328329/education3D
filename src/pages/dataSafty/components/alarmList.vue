<template>
	<div>
		<el-dialog :title="title" center  class="h-right-dialog" :modal="false" :modal-append-to-body="false" :visible="curr!=-1" :before-close="close">
			<el-table  :data="lists" stripe max-height="500" v-loading="loading" @row-click="showMapInfoBox">
			   <el-table-column prop="alarmClassName" label="告警类型" width="100" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="告警设备" width="110" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceCode" label="设备编号" :show-overflow-tooltip="true">
					<template slot-scope="scope">{{scope.row.deviMode+'_'+scope.row.deviceCode}}</template>
				</el-table-column>
				<el-table-column prop="alarmDesc" label="告警事件" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="alarmTime" label="告警时间" width="180"> </el-table-column>
				<el-table-column prop="devibuildName" label="楼宇" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceFloorName" label="楼层" :show-overflow-tooltip="true" width="60"> </el-table-column>
			</el-table>
			<page :pager="tableData" @pageChange="changePage"></page>
		</el-dialog>
	</div>
</template>

<script>
	import page from '../../carsupervision/components/page.vue';  
	export default {
		name: '',//告警列表
		components:{
			page,//分页
		},
		data(){
			return{
				title:'',
				curr:-1,
				loading:false,
				tableData:{
					total:0,
				 	pageSize:10,
				 	currentPage:1
				},
				lists:[]
			}
		},
		mounted: function() {
			var vm=this;
			this.bus.$on('refreshAlarm',function(){
				vm.show(vm.curr);
			});
		},
		methods:{
			show(type){
				this.curr=type;
				this.tableData.currentPage=1;
				this.getLists();
				if(type==0){
					this.title='动环告警';
				}else if(type==2){
					this.title='设备离线';
				}else{
					this.title='非法接入';
				}
			},
			//点击行
			showMapInfoBox(row){
				var vm=this;
				var rows= {
					"告警事件": row.alarmDesc,
					"告警设备": row.deviceName,
					"设备编号": row.deviMode+'_'+row.deviceCode,
					"告警时间": row.alarmTime,
					"设备类型": row.deviceType,
					"所在楼宇": row.devibuildName,
					"所在楼层": row.deviceFloorName,
				}
				var params = {
					title:this.title,
					type: "blackBox",//traffic
					lon:row.lng,													
					lat:row.lat,	
					wminValue: "",
					wmaxValue: "",
					"valueUnit": "",
					butCenter:['查看详情'],
					"rows":rows,
					uuid:row.uuid,//告警id
					deviceUuid:row.deviceUuid,//黑箱uuid
					deviceCode:row.deviceCode,
					buildName:row.devibuildName,
				}
				this.bus.$emit('addMapPop',params)
			},
			//列表
			getLists(){
				var vm=this;
				vm.loading=true;
				var params={
					pageSize:vm.tableData.pageSize,
					currentPage:vm.tableData.currentPage,
					alarmClass:vm.curr,
					unitUuid:UNITID,
				}
				this.$axios.post('box/statistics/aalarmList',params).then(function(res){
					vm.tableData.total=res.total||0;
					vm.lists=res.data;
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
				this.curr=-1;
				this.tableData.currentPage=1;
				this.lists=[]
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	
</style>