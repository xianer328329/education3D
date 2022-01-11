<template>
	<div class="h-pager">
	  <!--联防布控车辆-->
		<el-dialog :title="'当日告警--'+title" center  class="h-right-dialog h-mini-dialog" :modal="false" :modal-append-to-body="false" :visible="curr!=''" :before-close="close">
			<!--<el-button type="primary" size="mini" v-if="curr==1||curr==3" class="h-header-button" @click="showSub">{{title}}</el-button>-->
			<el-table  :data="lists" stripe max-height="500" v-loading="loading" @row-click="rowClick">
			   <el-table-column prop="alarmTypeName" label="告警类型" width="130" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="carPlate" label="车牌" width="110" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="alarmDesc" label="描述" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="alarmTime" label="告警时间" width="180":show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="道闸" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
			<page :pager="tableData" @pageChange="changePage"></page>
		</el-dialog>
		
		<!--子弹窗-->
		<!--<el-dialog :title="title" :modal-append-to-body="false" width="50%" :visible="sub!=''" :before-close="closeSub">
			<el-table  :data="subLists" stripe max-height="500">
				<el-table-column prop="carPlate" label="车牌"> </el-table-column>
				<el-table-column prop="createTime" label="入库时间" width="200"> </el-table-column>
				<el-table-column prop="illegalDesc" label="布控描述"> </el-table-column>
				<el-table-column prop="illegalDesc" label="操作">
					<template sclot-scope="scope"></template>
				</el-table-column>
			</el-table>
			<page :pager="subTableData" @pageChange="changeSubPage"></page>
		</el-dialog>-->
	</div>
</template>

<script>
	import page from '../page.vue'
	export default{
		data(){
			return {
				lists:[],
				subLists:[],
				curr:'',
				sub:'',
				loading:false,
				title:'',//弹窗标题
				tableData:{
					total:0,
				 	pageSize:10,
				 	currentPage:1
				},
				subTableData:{
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
			this.bus.$off('getCars').$on('getCars',function(i){
				vm.curr=i;
				vm.switchData();
			});
		},
		methods:{
			//点击行
			rowClick(row){
				if(this.curr==1){
					var rows= {
						"车牌": row.carPlate,
						"告警时间": row.alarmTime,
						"描述":  row.alarmDesc,
						"道闸":  row.deviceName,
						"布控说明": row.alarmDesc
					}
				}else{
					var rows= {
						"车牌": row.carPlate,
						"告警时间": row.alarmTime,
						"描述":  row.alarmDesc,
						"道闸":  row.deviceName,
					}
				}
				var params = {
					title:this.title,
					type: "traffic",
					lon:row.longitude,													
					lat:row.latitude,	
					wminValue: "",
					wmaxValue: "",
					"valueUnit": "",
//					"butCenter": ["抓拍图片", "视频回放", "历史记录"],
					"rows":rows
				}
//				console.log(JSON.stringify(row))
				this.bus.$emit('addMapPop',params)
			},
			switchData(){
				var vm=this;
				switch (vm.curr){
					case 1:
						vm.title='车辆联防布控';
						break;
					case 2:
						vm.title='敏感车辆驶入';
						break;
					case 3:
						vm.title='车辆本校布控';
						break;
					case 4:
						vm.title='校内违法车辆';
						break;
					case 5:
						vm.title='高频违法驶入';
						break;	
					default:
						vm.title='';
						break;
				}
				vm.getLists();
			},
			//展示子弹窗
			showSub(){
				this.sub=1;
				this.getSubLists();
			},
			//列表
			getLists(){
				var vm=this;
				vm.loading=true;
				var params=new FormData();
				params.append('alarmType',vm.curr);
				params.append('currentPage',vm.tableData.currentPage);
				params.append('pageSize',vm.tableData.pageSize);

				this.$axios.post('traffic/pass/alarmList',params).then(function(res){
					vm.tableData.total=res.total;
					vm.lists=res.rows;
					vm.loading=false;
				});
			},
			//列表
			getSubLists(){
				var vm=this;
				var params=new FormData();
				params.append('alarmType',vm.curr);
				params.append('currentPage',vm.tableData.currentPage);
				params.append('pageSize',vm.tableData.pageSize);
				
				this.$axios.post('traffic/pass/illegalCarList',params).then(function(res){
					vm.subTableData.total=res.data.total;
					vm.subLists=res.data.rows;
				});
			},
			//分页改变
			changePage(page){
				this.tableData=$.extend(this.tableData,JSON.parse(page));
				this.getLists();
			},
			//子弹窗分页改变
			changeSubPage(page){
				this.subTableData=$.extend(this.tableData,JSON.parse(page));
				this.getSubLists();
			},
			close(){
				this.curr='';
				this.tableData.currentPage=this.subTableData.currentPage=1;
				this.lists=[]
			},
			closeSub(){
				this.sub='';
				this.subLists=[]
			}
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