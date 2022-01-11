<template>
	<div>
		<el-dialog :title="title" class="rightModal" :visible="curr!=''" width="800px" :before-close="close" :modal-append-to-body="false" :modal="false" :close-on-click-modal="false">
			  <div class="table-box table-click noScroll">
			  	<div class="QueryParameters" v-show="curr==5">
					<h3 class="rollAall export"  @click='exp'>导出</h3>
					<div class="Z-butTab">
						<p  authDesc="火警" authName="al_emergency_home_alarminfo_fire" >
							<span :class="{'Z-on':search.alarmType==1}" v-on:click='showAlarmList(1)'>火警</span>	
						</p>
						<p authDesc="预警" authName="al_emergency_home_alarminfo_early" >
							<span :class="{'Z-on':search.alarmType==4}" v-on:click='showAlarmList(4)'>预警</span>	
						</p>
						<p authDesc="故障" authName="al_emergency_home_alarminfo_fault" >
							<span :class="{'Z-on':search.alarmType==2}" v-on:click='showAlarmList(2)'>故障</span>	
						</p>
						<p authDesc="其他" authName="al_emergency_home_alarminfo_other" >
							<span :class="{'Z-on':search.alarmType==3}" v-on:click='showAlarmList(3)'>其他</span>	
						</p>
						
					</div>
					<ul class="Z-QueryList clearFix" id="data-box">
						<li>
							<p class="lable">状态</p>
							<select v-model='search.handleStatus'>
								<option value ="">请选择状态</option>
								<option value ="0">未处理</option>
								<option value ="1">已处理</option>
							</select>
						</li>
						<li>
							<span class="lable">告警日期</span>
							<div class="timeQuery">
								<two-selc @twodateTimeChange='twodateQuery'></two-selc>
							</div>
						</li>
						<li class="QueryBtn" v-on:click='getFireLists'>查询</li>
					</ul>
				</div>
				<el-table :data="lists"   v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)"  stripe max-height="441px" @row-click="showMapInfoBox" :highlight-current-row="true">
					<template>
						<el-table-column prop="alarmTypeName" label="告警类型" :show-overflow-tooltip="true" width="100px"></el-table-column>
						<el-table-column prop="deviceCode" label="设备编号" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="deviceName" label="告警设备" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="displayTime" label="告警时间" :show-overflow-tooltip="true"  width="180px"></el-table-column>
						<el-table-column prop="buildName" label="楼宇" :show-overflow-tooltip="true" ></el-table-column>
						<el-table-column prop="position" label="位置" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column v-if="search.alarmType==2||search.alarmType==3" prop="alarmDesc" label="事件" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column v-else-if="search.alarmType==4" prop="warnValue" label="示值" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column v-if="curr==5"  label="状态" :show-overflow-tooltip="true" width="90px">
							<template slot-scope="scope">
								<i :class="{'Z-Nountreated':scope.row.handleStatusName=='未处理'}">{{scope.row.handleStatusName}}</i>
								
							</template>
						</el-table-column>
					</template>
				</el-table>
				<el-pagination class="pager" @current-change="getFireLists" :current-page.sync="search.currentPage" :page-size="search.pageSize" layout=" prev, jumper,total, next" :total="total"></el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import TwoSelc from '../../components/twodateSelection'
	export default{
		components:{
			TwoSelc,
		},
		data(){
			return {
				curr:'',
				title:'',
				lists:[],
				row:{},//当前选中数据
				total:0,
				loading:true,
				search:{
					currentPage:1,
					pageSize:10,
					alarmType:1,//告警类型1火警2故障3其他4:预警
					handleStatus:'',//告警状态0未处理|1已处理
					alarmTimeStart:'',//告警时间开始时间
					alarmTimeEnd:'',//告警时间结束时间
					nowHandle:1,//当前未处理
				},
			
			}
		},
		mounted(){
			var vm=this;
			this.bus.$on('shelterClosePop',function(){
				vm.curr=''
			})
		},
		methods:{
			loadOver(){
				this.loading=false;
			},
			loadBefore(){
				this.loading=true;
			},
			//获取表格列表
			getFireLists(type){
				var vm=this;
				var  parameter = new FormData();
				vm.search.alarmTimeStart==null?vm.search.alarmTimeStart='':'';
				vm.search.alarmTimeEnd==null?vm.search.alarmTimeEnd='':'';
				for(var key in vm.search){
				 	parameter.append(key,vm.search[key]);
				}
				 
				if(type=='export')return parameter
				 
				this.loadBefore();
				this.$axios.post('home/fire/alarmList',parameter).then((res) => {
					vm.lists=res.rows||[];
					vm.total=res.total||0;
					this.loadOver();
				})
			},			
			//导出
			exp(){
				this.bus.exportExcel('home/fire/alarmList/export',this.getFireLists('export'),this.title)
			},
			showMapInfoBox(row){
				var vm=this;
				var rows= {
					"楼宇": row.buildName,
					"位置": row.position,
					"告警设备": row.deviceName,
					"设备编号": row.deviceCode,
					"告警时间": row.displayTime,
				}
				if(this.search.alarmType==2||this.search.alarmType==3){
					rows["事件"]=row.alarmDesc
				}else if(this.search.alarmType==4){
					rows["示值"]=row.warnValue
				}
				var maptitle=this.title.split("--")[1]
				var params = {
					title:maptitle,
					type: "fire",//traffic
					lon:row.longitude,													
					lat:row.latitude,	
					wminValue:row.wminValue,
					wmaxValue:row.wmaxValue,
					valueUnit:row.valueUnit,
					butCenter:this.search.alarmType==1?['查看详情','联动视频']:['查看详情'],
					"rows":rows,
					uuid:row.uuid,//告警id
					deviceCode:row.deviceCode,
					deviceUuid:row.deviceUuid,
					buildName:row.buildName,
					position:row.position,
					alarmTime:row.displayTime,
					alarmDesc:row.alarmDesc
				}
				this.bus.$emit('addMapPop',params)
			},
			show(type){
				var vm=this;
				if(this.curr!=type){
					this.lists=[];
				}
				this.curr=type;
				this.search={
					currentPage:1,//当前页数
					pageSize:10,//每页数量
					alarmType:type,
					handleStatus:'',//告警状态0未处理|1已处理
					alarmTimeStart:'',//告警时间开始时间
					alarmTimeEnd:'',//告警时间结束时间
					nowHandle:1,//当前未处理
				}
				switch (type){
					case 1:
						vm.title="当日告警--火警";
						break;
					case 2:
						vm.title="当日告警--故障";
						break;
					case 3: //
						vm.title="当日告警--其他";
						break;
					case 4: //
						vm.title="当日告警--预警";
						break;
					case 5: //
						vm.title="历史告警--火警";
						this.search.nowHandle=0;
						this.search.alarmType=1;
						break;
					default:
						break;
				}
				this.getFireLists();
			},
			showAlarmList(type){
				var vm=this;
				this.search.currentPage=1;
				switch (type){
					case 1:
						vm.title="历史告警--火警";
						break;
					case 2:
						vm.title="历史告警--故障";
						break;
					case 3: //
						vm.title="历史告警--其他";
						break;
					case 4: //
						vm.title="历史告警--预警";
						break;	
					default:
						break;
				}
				this.search.alarmType=type;
			
				this.getFireLists();
			},

			close(){
				this.curr=''
			},
			twodateQuery(res){
				if(res){
					this.search.alarmTimeStart=res[0];
					this.search.alarmTimeEnd=res[1];
				}else{
					this.search.alarmTimeStart='';
					this.search.alarmTimeEnd='';
				}
				
			},
		}
	}
</script>
