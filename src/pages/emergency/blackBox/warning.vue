<template>
	<div>
		<el-dialog :title="title" class="rightModal blackListModal" :visible="curr!=''" width="850px" :before-close="close" :modal-append-to-body="false" :modal="false" :close-on-click-modal="false">
			  <div class="table-box table-click noScroll">
			  	<div class="QueryParameters" v-show="curr==4">
					<div class="Z-butTab">
						<p authDesc="紧急求助" authName="al_emergency_home_shelter_emerHelp" >
							<span :class="{'Z-on':search.alarmType==0}" v-on:click='showAlarmList(1)'>动环告警</span>	
						</p>
						<p authDesc="设备异常" authName="al_emergency_home_shelter_deviceError" >
							<span :class="{'Z-on':search.alarmType==2}" v-on:click='showAlarmList(3)'>设备离线</span>	
						</p>
						<p authDesc="装备不足" authName="al_emergency_home_shelter_equeInsu" >
							<span :class="{'Z-on':search.alarmType==1}" v-on:click='showAlarmList(2)'>非法接入</span>	
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
						<li class="QueryBtn" v-on:click='getLists'>查询</li>
					</ul>
				</div>
				<el-table :data="lists"  v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)" stripe max-height="441px" @row-click="showMapInfoBox" :highlight-current-row="true">
					<template>
						<el-table-column prop="alarmClassName" label="告警类型" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="deviceName" label="告警设备" :show-overflow-tooltip="true" ></el-table-column>
						<el-table-column label="设备编号" :show-overflow-tooltip="true">
							<template slot-scope="scope">{{scope.row.deviMode+'_'+scope.row.deviceCode}}</template>
						</el-table-column>
						<el-table-column prop="alarmDesc" label="告警事件" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="alarmTime" label="告警时间" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="devibuildName" label="楼宇" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="deviceFloorName" label="楼层" :show-overflow-tooltip="true" width="70px"></el-table-column>
						<el-table-column  label="状态" :show-overflow-tooltip="true">
							<template slot-scope="scope">
								<i v-if="scope.row.alarmStatus==0" style="color: #00ffff">未处理</i>
								<i v-else>已处理</i>
							</template>
						</el-table-column>
					</template>
				</el-table>
				<el-pagination class="pager" @current-change="getLists" :current-page.sync="search.currentPage" :page-size="search.pageSize" layout=" prev, jumper,total, next" :total="search.total">
				</el-pagination>
			</div>
		</el-dialog>
		<!--<addEvent @refresh="refresh" ref="addEvent" :impactTypes="impactTypes" :harmDgree="harmDgree" :controllability="controllability"></addEvent>-->
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
				page:null,//是否是宣教应急页面
				loading:true,
				search:{
					total:0,
					currentPage:1,
					pageSize:10,
					alarmType:0,//告警类型0动环监测1非法接入|2设备离线|
					handleStatus:'',//告警状态0未处理|1已处理
					alarmTimeStart:null,//告警时间开始时间
					alarmTimeEnd:null,//告警时间结束时间
					nowHandle:1,//当前未处理
					unitUuid:UNITID
				},
			
			}
		},
		//props:['maxmap','mapCenter'],
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
			getLists(){
				this.loadBefore()
				var vm=this;
				this.$axios.post('/edu/home/zqueryBboxAlarmList',vm.search).then((res) => {
					vm.lists=res.warningMessage||res.data||[];
					vm.search.total=res.total||0;
					this.loadOver()
				})
			},
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
			show(type){
				var vm=this;
				if(this.curr!=type){
					this.lists=[];
				}
				this.curr=type;
				this.page=null;
				this.search={
					total:0,
					currentPage:1,//当前页数
					pageSize:10,//每页数量
					alarmType:type-1,//告警类型0动环监测1非法接入|2设备离线
					handleStatus:'',//告警状态0未处理|1已处理
					alarmTimeStart:null,//告警时间开始时间
					alarmTimeEnd:null,//告警时间结束时间
					nowHandle:1,//当前未处理
					unitUuid:UNITID
				}
				switch (type){
					case 1:
						vm.title="当日告警--动环告警";
						break;
					case 2:
						vm.title="当日告警--非法接入";
						break;
					case 3: //
						vm.title="当日告警--设备离线";
						break;
					case 4: //
						vm.title="历史告警--动环告警";
						this.search.nowHandle=0;
						this.search.alarmType=0;
						break;
					default:
						break;
				}
				this.getLists();
			},
			showAlarmList(type){
				var vm=this;
				this.search.currentPage=1;
				switch (type){
					case 1:
						vm.title="历史告警--动环告警";
						break;
					case 2:
						vm.title="历史告警--非法接入";
						break;
					case 3: //
						vm.title="历史告警--设备离线";
						break;
					default:
						break;
				}
				this.search.alarmType=type-1;
			
				this.getLists();
			},

			close(){
				this.curr=''
			},
			twodateQuery(res){
				if(res){
					this.search.alarmTimeStart=res[0];
					this.search.alarmTimeEnd=res[1];
				}else{
					this.search.alarmTimeStart=null;
					this.search.alarmTimeEnd=null;
				}
				
			},
		}
	}
</script>

<style lang="scss">
	
</style>