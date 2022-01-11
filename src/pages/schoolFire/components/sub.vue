<template>
	<el-dialog :title="title" class="h-right-dialog" :modal="false" center :modal-append-to-body="false" :visible="curr!=''" :before-close="close">
		<div  ref="dialog">
			<el-button size="mini" class="h-mini" :class="{'el-button--primary':index==1}" @click="operate(1)">火警</el-button>
			<el-button size="mini" class="h-mini" :class="{'el-button--primary':index==4}" @click="operate(4)">预警</el-button>
			<el-table  :data="lists" stripe max-height="500" v-if="index==1" :key="'lists'+index" v-loading="loading" @row-click="rowClick">
			    <el-table-column prop="alarmTypeName" label="告警类型" width="100":show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceCode" label="设备编号" width="120":show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="告警设备"  :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="alarmTime" label="告警时间" width="180" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="buildName" label="楼宇" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="position" label="位置" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
			<el-table  :data="lists" stripe max-height="500" :key="'lists'+index" v-loading="loading"  v-else @row-click="rowClick" >
			    <el-table-column prop="alarmTypeName" label="告警类型"width="100":show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceCode" label="设备编号" width="120" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="deviceName" label="告警设备" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="warnValue" label="示值" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="alarmTime" label="告警时间" width="180":show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="buildName" label="楼宇" :show-overflow-tooltip="true"> </el-table-column>
				<el-table-column prop="position" label="位置" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
			<page :pager="tableData" @pageChange="changePage"></page>
		</div>
	</el-dialog>
</template>

<script>
	import page from '../../carsupervision/components/page.vue'
	export default{
		data(){
			return {
				lists:[],
				curr:'',
				index:1,//当前选中选项卡
				title:'',//弹窗标题
				loading:false,
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
			this.bus.$off('getSchoolFire').$on('getSchoolFire',function(i){
				vm.curr=i;
				vm.switchData();
			});
		},
		methods:{
			//点击行
			rowClick(row){
				var params={
					title:this.index==1?'火警':'预警',			
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
						'设备编号':row.deviceCode,														
						'告警时间':row.alarmTime,
					}
				}
				if(this.index!=1){
					params.rows={
						'楼宇':row.buildName,
						'位置':row['position'],															
						'告警设备':row.deviceName,		
						'示值':row.warnValue,
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
				this.loading=true;
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
				
				this.$axios.post('home/fire/alarmList',params).then((res)=>{
					vm.tableData.total=res.total;
					vm.lists=res.rows;
					vm.$nextTick(()=>{
						vm.loading=false;
						if(this.$refs.dialog.offsetHeight>10*fontSize){
							this.bus.$emit('cutHik',{type:'repair'});
							this.bus.$emit('cutHik',{type:'cut',x:0,y:0,w:this.$refs.dialog.offsetWidth,h:this.$refs.dialog.offsetHeight-9.5*fontSize});
						}else{
							this.bus.$emit('cutHik',{type:'repair'});
						}
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
				this.lists=[];
				this.tableData.total=0;
				this.getLists();
			},
			//关闭弹窗
			close(){
				this.curr='';
				this.tableData.currentPage=1;
				this.lists=[];
				this.bus.$emit('cutHik',{type:'repair'});
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
.h-header-button{
	position: absolute;
	right: 3.5rem;
	top: 0.2rem;
	span{
		font-size: 0.6rem;
	}
}
.h-mini{
	margin-left: 0.5rem;
	margin-bottom: 0.5rem;
	color: #EEEEEE;
}
</style>