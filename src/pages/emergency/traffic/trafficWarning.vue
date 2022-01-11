<template>
  <div>
    <el-dialog :title="title" class="rightModal trafficTable" :visible="curr!=''" width="880px" :before-close="close" :modal-append-to-body="false" :modal="false" :close-on-click-modal="false">
      <div class="table-box table-click noScroll">
	    <!-- 历史记录 -->
        <div class="QueryParameters" v-show="curr=='history'">
          <!-- <h3 class="QueryBtn rollAall" v-show="search.alarmType==1" v-on:click='MonitorList()'>车辆联防布控</h3>
          <h3 class="QueryBtn rollAall" v-show="search.alarmType==3" v-on:click='MonitorList()'>车辆本校布控</h3> -->
		  <h3 class="rollAall export"  @click='exp'>导出</h3>
					
          <div class="Z-butTab">
            <p authDesc="车辆联防布控" authName="al_emergency_traffic_pass_trafficinfo_mutual">
              <span :class="{'Z-on':search.alarmType==1}" v-on:click="showAlarmList(1,'历史告警--车辆联防布控')">车辆联防布控</span>
            </p>
            <p authDesc="车辆本校布控" authName="al_emergency_traffic_pass_trafficinfo_school">
              <span :class="{'Z-on':search.alarmType==3}" v-on:click="showAlarmList(3,'历史告警--历史告警--车辆本校布控')">车辆本校布控</span>
            </p>
            <p authDesc="敏感驶入" authName="al_emergency_traffic_pass_trafficinfo_sensitive">
              <span :class="{'Z-on':search.alarmType==2}" v-on:click="showAlarmList(2,'历史告警--敏感驶入')">敏感驶入</span>
            </p>
            <p authDesc="高频违法" authName="al_emergency_traffic_pass_trafficinfo_outer">
              <span :class="{'Z-on':search.alarmType==5}" v-on:click="showAlarmList(5,'历史告警--高频违法')">高频违法</span>
            </p>
            <p authDesc="校内违法" authName="al_emergency_traffic_pass_trafficinfo_inside">
              <span :class="{'Z-on':search.alarmType==4}" v-on:click="showAlarmList(4,'历史告警--校内违法')">校内违法</span>
            </p>
          </div>
          <ul class="Z-QueryList clearFix" id="data-box">
            <li>
              <span class="lable">车牌号</span>
              <input type="text" v-model="search.carPlate" placeholder="请输入车牌号" />
            </li>
            <li>
              <span class="lable">告警日期</span>
              <div class="timeQuery">
                <two-selc @twodateTimeChange='twodateQuery'></two-selc>
              </div>
            </li>
            <li class="QueryBtn" v-on:click='getTrafficLists'>查询</li>
          </ul>
        </div>
				
		<div class="QueryParameters" v-show="curr!='history'&&search.alarmType==4">
		  <div class="Z-butTab">
		    <p>
		      <span :class="{'Z-on':search.illegalType==1}" v-on:click='searchSchoolViolation(1)'>超速</span>
		    </p>
		    <p>
		      <span :class="{'Z-on':search.illegalType==33}" v-on:click='searchSchoolViolation(33)'>违停</span>
		    </p>
		  </div>
		</div>	
			
			
        <el-table :data="lists" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(0, 32, 55, 1)" stripe max-height="441px" @row-click="showMapInfoBox" :highlight-current-row="true">
          <template>
            <el-table-column prop="alarmTypeName" label="告警类型" :show-overflow-tooltip="true" width="120px"></el-table-column>
            <el-table-column prop="carPlate" label="车牌" :show-overflow-tooltip="true" width="120px"></el-table-column>
            <el-table-column prop="alarmDesc" label="描述" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="alarmTime" label="告警时间" :show-overflow-tooltip="true" width="180px"></el-table-column>
            <el-table-column prop="postion" label="道闸" :show-overflow-tooltip="true" width="120px"></el-table-column>
          </template>
        </el-table>
        <el-pagination class="pager" @current-change="getTrafficLists" :current-page.sync="search.currentPage" :page-size="search.pageSize" layout=" prev, jumper,total, next" :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import TwoSelc from '../../components/twodateSelection'
  export default {
    components: {
      TwoSelc,
    },
    data() {
      return {
        curr: '',
        title: '',
        lists: [],
        row: {}, //当前选中数据
        total: 0,
        loading: true,
        search: {
          currentPage: 1,
          pageSize: 10,
          alarmType: 1, //告警类型1：联防布控，2：敏感,3本校布控 4：校内违法，5：校外违法  ，6：其他
          handleStatus: '', //告警状态0未处理|1已处理
          alarmTimeStart: '', //告警时间开始时间
          alarmTimeEnd: '', //告警时间结束时间
          nowHandle: 1, //当前未处理
          carPlate: '', //车牌号
					illegalType:1,//1：超速，2：超低速，3：其他，4：闯红灯，5：不按车道行驶，6：压线，7：逆行，8：非机动车道，10：机动车违反禁令标志指示，33：违章停车，34：违章变道，35：压黄线，36：交通拥堵，37：交通滞留，38：黄牌车占道，39：有车占道，40：手动抓拍，41：占用公交车道，42：违章倒车，43：闯黄灯，44：车位有车，45：车位无车，46：吸烟，47：打手机，48：不系安全带，49：遮挡车牌，50：黄网格违章停车，51：交通抛洒物事件，52：交通行人事件，53：绕行卡口，99：未知'" 
        },

      }
    },
    mounted() {
      var vm = this;
      this.bus.$on('shelterClosePop', function() {
        vm.curr = ''
      })
    },
    methods: {
      loadOver() {
        this.loading = false;
      },
      loadBefore() {
        this.loading = true;
      },
      //获取表格列表
      getTrafficLists(type) {
        var vm = this;
        var parameter = new FormData();
        vm.search.alarmTimeStart == null ? vm.search.alarmTimeStart = '' : '';
        vm.search.alarmTimeEnd == null ? vm.search.alarmTimeEnd = '' : '';
        for (var key in vm.search) {
          parameter.append(key, vm.search[key]);
        }
		if(type=='export')return parameter
		
        this.loadBefore();
        this.$axios.post('traffic/pass/traffic/alarmList', parameter).then((res) => {
          if (this.curr == "history") {
            if (res.rows && res.rows.length > 0) {
              if (res.rows[0].alarmType != this.search.alarmType) {
                return
              }
            }
          }
          vm.lists = res.rows || [];
          vm.total = res.total || 0;
          this.loadOver();
        })
      },	
	  //导出
	  exp(){
		this.bus.exportExcel('traffic/pass/traffic/alarmList'+'/export',this.getTrafficLists('export'),this.title)
	  },
      showMapInfoBox(row) {
        var vm = this;
        var rows = {
          "车牌": row.carPlate,
          "告警时间": row.alarmTime,
          "描述": row.alarmDesc,
          "道闸": row.postion,

        }
        if (this.search.alarmType == 1 || this.search.alarmType == 3) {
          rows["布控说明"] = row.remark
        }
        var maptitle = this.title.split("--")[1];
		let picUrl=((row.picUrl||'').indexOf('http')>-1?'':process.env.IMG_URL) +row.picUrl;
        var params = {
          title: maptitle,
          type: "traffic", //traffic
          lon: row.longitude,
          lat: row.latitude,
          picUrl:picUrl,
          videoUrl: row.videoUrl,
          butCenter: (this.search.alarmType==2||this.search.alarmType==5)?["抓拍图片", "历史记录"]:["抓拍图片", "视频回放", "历史记录"],
          rows: rows,
          mess: row,
          uuid: row.uuid, //告警id
          carPlate: row.carPlate,
          alarmType: this.search.alarmType
        }
        this.bus.$emit('addMapPop', params)
      },
      show(type) {
        var vm = this;
        if (this.curr != type) {
          this.lists = [];
        }
        this.curr = type;
        let params = {
          currentPage: 1, //当前页数
          pageSize: 10, //每页数量
          alarmType: type,
          handleStatus: '', //告警状态0未处理|1已处理
          alarmTimeStart: '', //告警时间开始时间
          alarmTimeEnd: '', //告警时间结束时间
          nowHandle: 1, //当前未处理
          carPlate: '', //车牌号
        }
		if(type==4) params.illegalType=1;
		this.search=params;
        this.showAlarmList(type);
      },
      showAlarmList(type,name) {
        var vm = this;
        this.search.currentPage = 1;
        this.search.alarmType = type;
        switch (type) {
          case 1:
            vm.title = name||"当日告警--车辆联防布控";
            break;
          case 2:
            vm.title = name||"当日告警--敏感驶入";
            break;
          case 3: //
            vm.title = name||"当日告警--车辆本校布控";
            break;
          case 4: //
            vm.title = name||"当日告警--校内违法";
            break;
          case 5: //
            vm.title = name||"当日告警--高频违法";
            break;
          case 'history': //
            vm.title = "历史告警--车辆联防布控";
            this.search.nowHandle = 0;
            this.search.alarmType = 1;
            break;
          default:
            break;
        }
        this.getTrafficLists();
      },
	  // 所搜校内违法
	  searchSchoolViolation(type){
		  this.search.illegalType=type;
		  this.showAlarmList(this.search.alarmType);
	  },
      close() {
        this.curr = ''
      },
      MonitorList() { //布控名单
        this.bus.$emit('MonitorListTraffic', this.search.alarmType)
      },
      twodateQuery(res) {
        if (res) {
          this.search.alarmTimeStart = res[0];
          this.search.alarmTimeEnd = res[1];
        } else {
          this.search.alarmTimeStart = '';
          this.search.alarmTimeEnd = '';
        }

      },
    }
  }
</script>

<style lang="scss">

</style>
