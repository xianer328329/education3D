<template>
	<!--录入突发事件和事件进展-->
	<el-dialog title="应急预案启动记录"  class="emergency-modal plan-record-modal modal-visible" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="60rem">
		<el-form :inline="true">
			<el-form-item label="预案类型">
				<!--change-on-select @change="getLists"-->
				<el-cascader :options="plans" clearable filterable v-model="search.uuid" :props="props" :show-all-levels="false" class="h-el-cascader" > </el-cascader>
			</el-form-item>
			<el-form-item label="预案启动时间" class="date-picker">
			   <el-date-picker v-model="search.startTime" type="date" placeholder="" class="h-date" value-format="yyyy-MM-dd" @change="changeDate"> </el-date-picker>
			   <span class="tip">至</span>
			   <el-date-picker v-model="search.endTime" :picker-options="pickerOptions" type="date" placeholder="" class="h-date" value-format="yyyy-MM-dd"> </el-date-picker>
			</el-form-item>
			<el-form-item label="">
				<a class="alarmBtn success-btn" @click="getLists">查询</a>
			</el-form-item>
		</el-form>
		<el-table  :data="lists" stripe height="25rem" class="h-group-table">
		    <el-table-column prop="name" label="应急预案" :show-overflow-tooltip="true">
		    	<template slot-scope="scope">{{scope.row.name||'--'}}</template>
		    </el-table-column>
			<el-table-column prop="eventName" label="关联突发事件"  :show-overflow-tooltip="true"> </el-table-column>
			<el-table-column prop="planTime" label="启动时间" width="180px":show-overflow-tooltip="true"> </el-table-column>
			<el-table-column prop="finishedTime" label="终止时间"width="180px" :show-overflow-tooltip="true" >
				<template slot-scope="scope">{{scope.row.finishedTime||'--'}}</template>
			</el-table-column>
			<el-table-column prop="scopeControl" label="预案启动持续时长" :show-overflow-tooltip="true">
				<template slot-scope="scope">{{scope.row | getHour(state)}}</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>

<script>
	var timer;
	export default {
		name: 'planRecord',//预案启动记录
		data(){
			return{
				curr:'',
				plans:[],
				search:{
					startTime:'',
					endTime:'',
					uuid:[]
				},
				lists:[],
				props: {
		          value: 'uuid',
		          label:'name',
		          children: 'children'
		        },
		        state:false,
		        pickerOptions: {
		          disabledDate(time) {
		            return time.getTime()<0;
		          },
		        }
			}
		},
		mounted(){
			var vm=this;
			this.getPlans();
//			timer=setInterval(function(){
//				vm.state=!vm.state;
//			},60000);
		},
//		beforeDestroy(){
//			clearInterval(timer);
//		},
		methods:{
			show(){
				this.curr=1;
				this.getLists();
				this.getPlans();
			},
			getLists(){
				var vm=this;
				var search=$.extend(true,{},vm.search);
				search.startTime+=search.startTime!=''?' 00:00:00':'';
				search.endTime+=search.endTime!=''?' 59:59:59':'';
				search.uuid=search.uuid.length>0?search.uuid[search.uuid.length-1]:'';
				
				var params=new FormData();
				for (var i in search){
					params.append(i,search[i])
				}	
				this.$axios.post('contingency/plan/startRecord', params).then((res) => {
					vm.lists= res.list || [];						
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
			changeDate(){
				var vm=this;
				if(new Date(vm.search.startTime).getTime()>new Date(vm.search.endTime).getTime()){
					vm.search.endTime='';
				}
				vm.pickerOptions={
		          disabledDate(time) {
		            return time.getTime()<new Date(vm.search.startTime).getTime();
		          },
		        }
			},
			close(){
				this.curr='';
			}
		},
		filters:{
			getHour(item,state){
				var timestart=new Date();
				if(item.finishedTime){
					timestart=new Date(Date.parse(item.finishedTime.replace(/-/g,"/"))).getTime()
				}
				var timeend =  new Date(Date.parse(item.planTime.replace(/-/g,"/"))).getTime();
				return Math.floor((timestart-timeend)/1000/3600)+'小时'+Math.ceil((timestart-timeend)/1000/60%60)+'分钟';
			},
		}
	}
</script>

<style lang="scss">
	.emergency-modal.plan-record-modal{
		.el-dialog__body{
			padding: 1rem 1rem 1.5rem !important;
			
		}
		.alarmBtn{
			line-height: 1.4rem;
			margin-top: -3px;
			vertical-align: middle;
		}
		.el-form-item__label{
			font-size: 0.8rem;
		}
		.el-form--inline .el-form-item{
			margin-right: 0.5rem;
		}
		.date-picker{
			.el-date-editor.el-input, .el-date-editor.el-input__inner{
				width: 8rem;
				.el-input__inner{
					padding-left: 0.75rem;
				}
			}
			.el-input__icon{
				width: 1.5rem;
				line-height: 2rem;
			}
			.tip{
				font-size: 0.8rem;
				padding: 0px 0.25rem;
			}
			
		}
	}
</style>
