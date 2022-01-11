<template>
	<div>
		<el-dialog :title="title" class="rightModal securityTable" :visible="curr!=''" width="49rem" :before-close="close" :modal-append-to-body="false" :modal="false" :close-on-click-modal="false">
			  <div class="table-box table-click noScroll">
			  	<div class="QueryParameters" v-show="curr=='history'">
			  		<!-- <h3 class="QueryBtn rollAall" v-show="search.alarmType==8" @click='MonitorList()'>人脸联防布控</h3>
			  		<h3 class="QueryBtn rollAall" v-show="search.alarmType==5"  @click='MonitorList()'>人脸本地布控</h3> -->
			  		<h3 class="rollAall export"  @click='exp'>导出</h3>
					
					<div class="Z-butTab">
						<p v-for="(item,index) in list" :authDesc="item.paramsNote" :authName="item.paramsName" :key="item.uuid">
							<span :class="{'Z-on':search.alarmType==item.parameter}" @click='showAlarmList(item.parameter,item.paramsNote)'>{{item.paramsNote}}</span>	
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
						<li v-if="search.alarmType==5||search.alarmType==8">
							<p class="lable">被控人</p>
							<input placeholder="请输入姓名" v-model="search.blackName"/>
						</li>
						<li class="QueryBtn" @click='AlarmList'>查询</li>
					</ul>
				</div>
				<el-table :data="lists"   v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)"  stripe max-height="441px" @row-click="showMapInfoBox" :highlight-current-row="true">
					<template>
						<el-table-column  v-for="(itme,index) in tableList" :width="(itme[0]=='告警时间'||itme[0]=='巡检日期')?180:((itme[0]=='操作'||itme[0]=='设备状态')?100:'')" :key="itme[1]+index" :label="itme[0]" :show-overflow-tooltip="true" >
							<template  slot-scope="scope">
								<!-- 时长 -->
								<template v-if="itme[1]=='sec'">{{scope.row.alarmTime | secToTime}}</template>
								
								<!-- 离线告警历史记录 -->
								<p v-else-if="itme[0]=='操作'&&itme[1]=='offlineHistory'"  @click.stop="lookOfflineHistory(scope.row)" class="Z-Nountreated">历史记录</p>
								
								<template v-else>
									<template v-if="scope.row[itme[1]]!='未处理'">{{scope.row[itme[1]]}}</template>
									<!-- 未处理的操作 -->
									<div v-else :class="{'Z-untreated':scope.row[itme[1]]=='未处理'}" @click.stop="handDispose(scope.row[itme[1]],scope)">{{scope.row[itme[1]]}}</div>
									<p class="Z-operation" v-if="itme[0]=='操作'" v-show="operation==scope.$index">
										<i class="Z-misinformation" @click.stop='getHandleFun(2,scope.row)'>误报</i>
										<i class="Z-pigeonhole" @click.stop='getHandleFun(1,scope.row)'>归档</i><i style="display:none" class="Z-reporting">上报</i>
									</p>
								</template>
							</template>
						</el-table-column>
					</template>
				</el-table>
				<el-pagination class="pager" @current-change="AlarmList" :current-page.sync="search.currentPage" :page-size="search.pageSize" layout=" prev, jumper,total, next" :total="total">
				</el-pagination>
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
		props: {
			list: {
				type:Array,
				default:[]
			}
		},
		data(){
			return {
				curr:'',
				title:'',
				lists:[],
				total:0,
				operation:null,//误报归档处理
				loading:true,
				search:{
					currentPage:1,
					pageSize:10,
					alarmType:8,//告警类型1：离线报警，2：视频质量,3：存储异常 4：移动侦测，5：人脸本校布控  ，6：联动报警 ，7：视频遮挡，8：人脸联防布控，9：警戒线事件，10：警戒区事件
					handleStatus:'',//告警状态0未处理|1已处理
					alarmTimeStart:'',//告警时间开始时间
					alarmTimeEnd:'',//告警时间结束时间
					dailyAlarm:'',
					blackName:"",//被布控人
				},
				mapJson:{},
				butCenter:[],
				tableList:[]
			}
		},
		filters:{
			secToTime(val){
				return new Date(val)
			}
		},
		mounted(){
			var vm=this;
			this.bus.$on('shelterClosePop',function(){
				vm.curr=''
			})
			this.bus.$on('changehandleFun', function(mes) {//地图列表 误报 归档操作
				vm.getHandleFun(mes.type,mes.list.mess)
			})
		},
		methods:{
			loadOver(){
				this.loading=false;
			},
			loadBefore(){
				this.loading=true;
			},
			showMapInfoBox(row,type){
				var vm=this;
				var rows= {}
				for(var key in this.mapJson){
					var k=this.mapJson[key].split(',');
					rows[key]=k.length>1?(row[k[0]]||row[k[1]]):row[k[0]];
				}
				var maptitle=this.title.split("--")[1]
				var params = {
					title:maptitle,
					type: "security",//traffic
					lon:row.longitude,													
					lat:row.latitude,
					personImg: true,
					butCenter:this.butCenter,
					rows:rows,
					curr:'showTrack',
					alarmId:row.alarmId||'',
					alarmType:this.search.alarmType,
					mess:row,
					uuid:row.uuid,//告警id
					deviceCode:row.deviceCode,
					deviceUuid:row.deviceUuid,
					buildName:row.deviceName,
					position:'',
					alarmTime:row.alarmTime,
					alarmDesc:row.alarmDesc
				}
				if(type=='operation')return params
				else this.bus.$emit('addMapPop',params)
				
			},
			show(obj){
				var vm=this;
				this.search={
						currentPage:1,//当前页数
						pageSize:10,//每页数量
						alarmType:null,
						handleStatus:'',//告警状态0未处理|1已处理
						alarmTimeStart:'',//告警时间开始时间
						alarmTimeEnd:'',//告警时间结束时间
						dailyAlarm:'',
						blackName:"",//被布控人
				}
				if(obj=="history"){
					vm.title="历史告警--人脸联防布控";
					vm.search.alarmType=8;
					this.curr="history"
				}else{
					if(this.curr!=obj.parameter){
						this.lists=[];
					}
					this.search.alarmType=obj.parameter;
					this.curr=obj.parameter;
					vm.title="当日告警--"+obj.paramsNote;
					
				}
				this.setAlarmList();
			},
			showAlarmList(type,paramsNote){
				var vm=this;
				this.search.currentPage=1;
				vm.title="历史告警--"+paramsNote;
				this.search.alarmType=type;
			
				this.setAlarmList();
			},
			setAlarmList(){ //获取安防告警记录接口请求函数
				var type=this.search.alarmType;				
				this.search.dailyAlarm = "1";// 1 是当天  0是历史记录
				var tableList=[['告警类型','alarmTypeName'],['告警时间','alarmTime'],['设备编号','deviceCode'],['位置','deviceName'],['操作','handleName']];
				this.mapJson={
					'设备位置':'deviceName',
					'设备编号':'deviceCode',
					'告警时间':'alarmTime'
				}
				this.butCenter=["视频回放"]
				this.oUrl = "home/monitorAlarmList";
				if(type == 8) {//人脸联防布控
					tableList.splice(1, 0, ['被布控人','blackName'],['人员编号','blackCode'],['相似度','blackSimilary']);
					this.mapJson={
						'被布控人':'blackName',
						'人员编号':'blackCode',
						'相似度':'blackSimilary',
						'设备位置':'deviceName',
						'设备编号':'deviceCode',
						'入库时间':'createTime,creationTime',
						'告警时间':'alarmTime',
						'布控描述':'blackListDesc'
					}
					this.oUrl = 'home/monitorPersonnelAlarm'
					this.butCenter = ["抓拍图片", "视频回放"]
				} else if(type == 5) {//人脸本校布控
					// this.search.dailyAlarm = "1";
					tableList.splice(1, 0, ['被布控人','blackName'],['相似度','blackSimilary']);
					this.mapJson={
						'被布控人':'blackName',
						'人员编号':'blackCode',
						'相似度':'blackSimilary',
						'设备位置':'deviceName',
						'设备编号':'deviceCode',
						'入库时间':'createTime,creationTime',
						'告警时间':'alarmTime',
					}
					this.oUrl = 'home/monitorPersonnelAlarm'
					this.butCenter = ["抓拍图片", "视频回放", "联动视频"];
				} else if(type == 4||type == 6||type == 9||type == 10) {
					// this.search.dailyAlarm = "1";
				} else if(type == 11) {//离线设备
					tableList=[['设备编号','deviceCode'],['位置','deviceName'],['设备状态','deviceStatusName'],['采集时间','modifyTime'],['操作','offlineHistory']];
					this.mapJson={
						'设备编号':'deviceCode',
						'设备位置':'deviceName',
						'设备状态':'deviceStatusName',
						'采集时间':'modifyTime',
					}
					this.oUrl = 'home/monitorStatusList'
					this.butCenter = ["历史记录"];
					if(this.curr=="history"){
						tableList=[['设备编号','deviceCode'],['位置','deviceName'],['设备状态','deviceStatusName'],['采集时间','modifyTime']];
					}
				}else if(type == 1) {//离线告警
					tableList=[['告警类型','alarmTypeName'],['告警时间','alarmTime'],['设备编号','deviceCode'],['位置','deviceName'],['操作','offlineHistory']];
					this.mapJson={
						'告警类型':'alarmTypeName',
						'告警时间':'alarmTime',
						'设备编号':'deviceCode',
						'位置':'deviceName',
					}
					this.oUrl = 'home/monitorStatusList'
					this.butCenter = ["历史记录"];
					if(this.curr=="history"){
						tableList=[['告警类型','alarmTypeName'],['告警时间','alarmTime'],['设备编号','deviceCode'],['位置','deviceName']];
					}
				} else if(type == 2) {//视频质量
					tableList=[['告警类型','alarmTypeName'],['设备编号','deviceCode'],['描述','alarmDesc'],['巡检日期','time'],['位置','deviceName']]
					this.mapJson={
						'描述':'alarmDesc',
						'设备位置':'deviceName',
						'设备类型':'deviceType',
						'设备编号':'deviceCode',
						'告警时间':'time',
					}
					this.oUrl = 'home/monitorStatusList'
					this.butCenter = ["历史记录"];
					if(this.curr=="history"){
						tableList=[['告警类型','alarmTypeName'],['告警时间','time'],['设备编号','deviceCode'],['位置','deviceName']];
					}
				} else if(type == 3) {//存储异常
					tableList.splice(1, 1, ['巡检日期','time']);
					tableList.pop();
					this.mapJson={
						'描述':'alarmDesc',
						'设备位置':'deviceName',
						'设备类型':'deviceType',
						'设备编号':'deviceCode',
						'告警时间':'time',
					}
					this.oUrl = 'home/monitorStatusList'
					this.butCenter = ["历史记录"];
					if(this.curr=="history"){
						tableList=[['告警类型','alarmTypeName'],['告警时间','time'],['设备编号','deviceCode'],['位置','deviceName']];
					}
				}
				if(this.curr=="history"){
					this.search.dailyAlarm = "";
					this.oUrl = "home/monitorAlarmHistory"				
				}
				
				this.tableList=tableList;
				this.AlarmList()
			},
			AlarmList(type) {
				this.search.alarmTimeStart==null?this.search.alarmTimeStart='':'';
				this.search.alarmTimeEnd==null?this.search.alarmTimeEnd='':'';
				var parameter = new FormData();
				parameter.append('alarmType', this.search.alarmType);
				parameter.append('currentPage', this.search.currentPage);
				parameter.append('pageSize', this.search.pageSize);
				this.search.blackName&&parameter.append('blackName', this.search.blackName);
				this.search.dailyAlarm&&parameter.append('dailyAlarm', this.search.dailyAlarm);
				if(this.oUrl == "home/monitorAlarmHistory") {
					parameter.append('handleStatus', this.search.handleStatus);
					parameter.append('alarmTimeStart', this.search.alarmTimeStart);
					parameter.append('alarmTimeEnd', this.search.alarmTimeEnd);
				}
				if(type=='export')return parameter
				
				this.loadBefore();
				this.$axios.post(this.oUrl, parameter).then(this.AlarmListSucc);
			},
			AlarmListSucc(res) {
				if(this.curr=="history"){
					if(res.rows&&res.rows.length>0){
						if(res.rows[0].alarmType!=this.search.alarmType&&(this.search.alarmType!=1&&this.search.alarmType!=11)){
							return
						}
					}
				}
				this.total = res.total;
				this.lists = (res.rows||[]).map(item=>{
					return {
						...item,
						modifyTime:item.modifyTime||item.alarmTime,
						deviceStatusName:item.deviceStatus==0?'离线':(item.deviceStatus==1?'在线':(item.deviceStatus||item.alarmTypeName||'--')),
						time:item.alarmTime?(new Date(item.alarmTime)).Format('yyyy-MM-dd'):'--',
					}
				});
				this.loadOver();
			},	
			//导出
			exp(){
				this.bus.exportExcel(this.oUrl+'/export',this.AlarmList('export'),this.title)
			},
			// 离线告警查看历史记录
			lookOfflineHistory(row){
				let params=this.showMapInfoBox(row,'operation')
				this.bus.$emit('Pop3tableSecurity',params, params.type);
			},
			handDispose(str,scope){
				if(str!="未处理"){
					return
				}else{
					this.operation==scope.$index?this.operation=null:this.operation=scope.$index;
				}
			},
           	getHandleFun(type,mes) {//误报归档操作
           		this.operation=null
				var parameter = new FormData();
				parameter.append('alarmId', mes.alarmId);
				parameter.append('handleStatus', type);
				this.$axios.post('home/alarmProcessing', parameter, { //监控报警处理接口请求函数
						emulateJSON: true
					})
					.then(this.AlarmList);
			},
			close(){
				this.curr=''
			},
			MonitorList () {//布控名单
                this.bus.$emit('MonitorListSecurity',this.search.alarmType)
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

<style lang="scss">
.timeWidth{
		width:6rem;
	}
</style>