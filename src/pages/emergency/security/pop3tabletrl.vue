<template>
	<div class="trafficPop3T">
		<el-dialog :title="title" :visible="curr!=''" width="60.5rem"   :before-close="close" :modal-append-to-body="false"  :close-on-click-modal="true">
			  <div class="table-box table-click">
			  	<h4 class="numberTimes" v-show="!monitor">
					<span>{{mess.title}}<i>{{page.total}}次</i></span>
					<!-- <span v-show="duration" >累计离线时长  <i>{{duration}}</i></span> -->
				</h4>
				<el-table :data="list"  stripe  v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)" height="30rem"  :highlight-current-row="true" v-if="!monitor" key="1">
					<el-table-column type="index" label="序号" width="90px"></el-table-column>
					<el-table-column  v-for="(itme,index) in tableList" :key="index" :prop="itme[1]" :label="itme[0]" :show-overflow-tooltip="true" >
						<template  slot-scope="scope">
							<template v-if="itme[1]=='sec'">{{scope.row.sec | secToTime}}</template>
							<template v-else>{{scope.row[itme[1]]}}</template>
						</template>
					</el-table-column>
				</el-table>	
				<el-table :data="list"  stripe v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)" height="30rem"  :highlight-current-row="true" v-else-if="monitor&&alarmType==8" key="2">
					<el-table-column prop="blackName" label="被布控人"></el-table-column>
					<el-table-column prop="creationTime" label="入库时间" :show-overflow-tooltip="true" width="180"></el-table-column>
					<el-table-column prop="blacklistDesc" label="布控描述" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="sponsorName" label="布控发起单位" :show-overflow-tooltip="true" ></el-table-column>
					<el-table-column  label="布控范围" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							<i class="Z-Nountreated cursorPointer" @click="checkRange(scope.row)">查看范围</i>
						</template>
					</el-table-column>
					<el-table-column  label="操作" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							<i class="Z-Nountreated cursorPointer" @click="MonitorLookClick(scope.row)">查看</i>
						</template>
					</el-table-column>
				</el-table>	
				<el-table :data="list"  stripe v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)" height="30rem"  :highlight-current-row="true" v-else-if="monitor&&alarmType==5" key="3">
					<el-table-column prop="blackName" label="被布控人"></el-table-column>
					<el-table-column prop="blackCode" label="人员编号" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="creationTime" label="入库时间" :show-overflow-tooltip="true" width="180"></el-table-column>
					<el-table-column  label="操作" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							<i class="Z-Nountreated cursorPointer" @click="MonitorLookClick(scope.row)">查看</i>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination class="pager" @current-change="getTableList" :current-page.sync="page.currentPage" :page-size="page.pageSize" layout=" prev, jumper,total, next" :total="page.total">
				</el-pagination>
			</div>
		</el-dialog>
		<el-dialog title="布控范围" class="checkRange" :visible="MonitorScope!=''" width="30rem"  :before-close="closeScope" :modal-append-to-body="false" >
		<div class="MonitorScope" >
			<ul>
				<li v-for="(itme,index) in MonitorScopeList">{{index+1}},{{itme}}</li>
			</ul>
		</div>
		</el-dialog>
	</div>
</template>


<script>
	export default {
		//name: 'EmergencyPop3tablet',
		data() {
			return {
				curr:'',
				title:'',
				monitor:false,
				mess:{},
				duration:false,
				alarmType:null,
				loading:true,
				list:[],
				page:{
					total:0,					
					currentPage:1,
					pageSize:15,
				},
				MonitorScope:'',
				MonitorScopeList:null,
				tableList:[]
				
			}
		},
		filters:{
			secToTime(val){
				return secToTime(val)
			}
		},
		methods: {
			show(type){
				this.curr=type
			},
			close(){
				this.curr=''
			},
			closeScope() { //关闭布控范围
				this.MonitorScope =''
			},
			loadOver(){
				this.loading=false;
			},
			loadBefore(){
				this.loading=true;
			},
			securityhistoryList() { // 安防 地图弹框 历史记录  1：离线报警，11:离线设备,2：视频异常，3：存储异常，4：移动侦测，5：本校布控，6：手动报警 7：视频遮挡 8：云端布控,
				this.loadBefore();
				this.title='历史记录'
				this.list=[];
				var tableArr=[['设备编号','deviceCode'],['巡检日期','alarmTime'],['描述','alarmDesc']]
				// if(this.alarmType == 11) { //离线设备
				// 	tableArr=[['设备编号','deviceCode'],['采集时间','modifyTime']]
				// }else 
				if(this.alarmType == 1||this.alarmType == 11){//1 离线告警 11 离线设备
					tableArr=[['设备编号','deviceCode'],['告警时间','alarmTime'],['描述','alarmDesc']]
				} 
				this.tableList=tableArr;
				var parameter = new FormData();
				parameter.append('deviceCode', this.mess.mess.deviceCode);
				parameter.append('alarmType', this.alarmType);
				parameter.append('currentPage', this.page.currentPage);
				parameter.append('pageSize', this.page.pageSize);
				this.$axios.post('/home/monitorAlarmHistory', parameter, {})
					.then(this.securityhistoryListSucc);
			},
			securityhistoryListSucc(res) {
				this.page.total = res.total;
				this.list = res.rows;
				this.duration = secToTime(res.duration);
				this.loadOver();
			},
			getMonitorList() { //获取布控名单 接口请求函数
				this.loadBefore();
				var parameter = new FormData();
				parameter.append('alarmType', this.alarmType);
				parameter.append('currentPage', this.page.currentPage);
				parameter.append('pageSize', this.page.pageSize);
				this.$axios.post('/home/blackListInfo', parameter, {
						emulateJSON: true
					}) //告警列表请求
					.then(this.getMonitorListSucc);
			},
			getMonitorListSucc(res) {
				this.page.total = res.total;
				this.list = res.rows;
				this.loadOver();
			},
			getTableList(){
				if(this.monitor){
					this.getMonitorList()//布控名单
				}else{
					this.securityhistoryList()//车辆 地图弹框 历史记录 1：联防布控，2：敏感，6：其他 , 4：校内违法，5：校外违法 3 本校布控
				}
			},
			checkRange(row){
				this.MonitorScope = 1;
				this.MonitorScopeList=row.scopeControl.split(",");
			},
			MonitorLookClick (row) {
				var list={};
				list.subtitle='目标图片';
				list.title=this.title;
				list.type = "security";
				list.mess=row;
				this.bus.$emit('addPop3img', list)
			},
			thHeight(){
				this.$nextTick(function() {
           			$(".AlarmTableFix tr th").each(function (i, v) {
               			$(this).css("width", $(".thead-tr th").eq(i).outerWidth())
           			})
           			
				})
			}

		},
		mounted: function() {
			var _this = this;
			this.bus.$on('Pop3tableSecurity', function(mes) {
				_this.curr=1;
				_this.mess=mes;
				_this.alarmType=mes.alarmType;
				_this.monitor=false;
				_this.getTableList()
				
			})
			this.bus.$on('MonitorListSecurity', function(mes) {
				_this.curr=1;
				_this.monitor=true;
				_this.alarmType=mes
				_this.alarmType==8?_this.title='人脸联防布控':_this.title='人脸本地布控'
				_this.getTableList()
			})
		},

	}
</script>
<style>
	.trafficPop3T .v-modal {
    	background: #000 !important;
	}
	.cursorPointer{
		cursor: pointer;
	}
</style>
<style lang="stylus" scoped>
	.Pop3tab {
		width: 1210px;
		z-index: 999;
		top: 50%;
		left: 50%;
		margin-left: -650px;
		margin-top: -348px;
		min-height: inherit;
	}
	
	.numberTimes {
		font-size: 0.9rem;
		color: #fff;
		margin-left: 0.5rem;
		margin-bottom: 0.75rem;
	}
	
	.numberTimes span {
		margin-right: 4.75rem;
	}
	
	.numberTimes i {
		color: #75CBF2;
		margin-left: 4px;
	}
	.pager{
		text-align: right;
		margin-top: 0.5rem;
	}
	.Pop3Box{
    	width: 1210px;
    	height: 760px;
		content: "";
		display: block;
		position: absolute;
		top: 50%;
    	left: 50%;
    	margin-left: -650px;
    	margin-top: -385px;
	}
	.popshade{
		width: 1920px;
		height: 1080px;
		content: "";
		display: block;
		position: fixed;
		top: 0px;
    	left:0px;
    	z-index:9999;
    	background: rgba(0,0,0,0.4);
	}
	.Popout .AlarmTable td {
    	max-width: 300px;
    	box-sizing: border-box;
	}
	.AlarmTableBox{
		height: 684px;
		position:relative;
		margin-top: 10px;
	}
	.AlarmTableBox .AlarmTable{
		margin: 0px;
	}
	.AlarmTableFix{
		z-index: 6;
	}
	.MonitorScope{
		height: 29.2rem;
		overflow: auto;
    	background: #002037 !important;
    	box-sizing: border-box;
	}
	
	.MonitorScope .Z-Btitle2{
		font-size:18px;
		color:#fff;
	}
	.MonitorScope ul{
		height: 26.25rem;
		margin-top: 0.5rem;
		overflow: auto;
	}
	.MonitorScope li{
		font-size: 0.8rem;
    	line-height:1.5rem;
    	color: #75CBF2;
    	margin-bottom: 5px;
	}
</style>