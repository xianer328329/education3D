<template>
  <div class="v">
    <div class="v-video">
      <div class="v-VDList">
			<hik ref="hik" :list="{...listInfo,showToolbar:0}" v-show="listInfo.subPlatform==5"></hik>
			<div id="hlsvideoalarm" v-show="listInfo.subPlatform!=5" class="video-container"></div>
      </div>
    </div>
    <div class="v-select">
      <div class="v-titel">视频告警</div>
      <div class="v-butt clearfix">
        <el-select v-model="alarmType" :clearable="true" placeholder="请选择告警类型">
          <el-option v-for="item in options" :key="item.alarmType" :label="item.alarmName" :value="item.alarmType">
          </el-option>
        </el-select>
      </div>
      <div class="v-input clearfix">
        <el-input v-model="selectdeviceName" placeholder="请输入设备位置"></el-input>
      </div>
      <div class="fl v-button clearfix">
        <el-button @click="getmoniorAlarmList(1)">查询</el-button>
      </div>
    </div>
    <div class="v-table">
      <el-table :data="moniorlist" size="mini" height="14.3rem" :border="false" @row-click="rowClick" @row-dblclick="switchvideo" :row-class-name="tableRowClassName">
        <el-table-column label="告警类别" :show-overflow-tooltip="true" prop="alarmTypeName">
          <template slot-scope="scope">
            <i class="new-type" v-if="scope.row.viewFlag==0"></i>
            <span>{{ scope.row.alarmTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备位置" :show-overflow-tooltip="true" prop="deviceName">
        </el-table-column>
        <el-table-column label="告警时间" :show-overflow-tooltip="true" prop="alarmTime">
        </el-table-column>
        <el-table-column label="操作" :show-overflow-tooltip="true" width="80" prop="handleName">
          <template slot-scope="scope">
            <div @click.stop="opense(scope.$index, scope.row,$event)" class="ml20">
              <div class="fontzie fl">
                {{scope.row.handleName}}
              </div>
              <div class="fl">
                <img src="../../../../static/images/operation.png" class="imgselect" v-if="scope.row.handleStatus !=1"></img>
              </div>
            </div>
            <div class="opendiao" v-show="scope.$index==showopen&&isopen">
              <ul>
                <li class="nextli bule" @click.stop="handelalarm(2,scope.row)">误报</li>
                <li class="nextli yell" @click.stop="handelalarm(1,scope.row)">归档</li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="Z-lyPage fr clearFix">
        <img id="LYfirst_page" src="../../../../static/images/first_page.png" /> <img id="LYlast" src="../../../../static/images/last.png" />
        <p>
          第<input type="text" value="1" id="intPage">页 共<span id="SumPage">0</span>页 <i id="goPage">跳转</i>
        </p>
        <img id="Lynext" src="../../../../static/images/next.png" /><img id="LYlast_page" src="../../../../static/images/last_page.png" />
      </div>
    </div>
  </div>
</template>

<script>
  import videoplay from "@/util/play";
  import hik from '../../components/hik/hik.vue';
  export default {
    data() {
      return {
        isplayback: 0, //1实时 2回放
        videotype: null, //当前视频平台类型：1海康 2大华 3宇视 4 华为  5 海康插件播放
        yushiflag: false, //宇视视频
        Dahuaflag: false, //大华视频
        Hikfalg: false, //海康视频
        paramsData: {
          videoPlatformIp: "", //视频服务器Ip地址
          videoPlatformPort: "", //端口号
          videoPlatformName: "", //视频系统用户名
          videoPlatformPassword: "", //视频系统登录密码
          videoPlatformType: "",
        },
        options: [],
        moniorlist: [], //监控国报警列表
        alarmType: '', //告警类型
        selectdeviceName: '', //输入设备位置
        dailyAlarm: "0", //是否当日报警
        currentPage: "1", //当前页
        pageSize: '8', //数据条数
        showopen: null, //table行下标
        isopen: false, //是否显示处理监控报警
        ciclkcount: 0, //点击次数，第二次点击关闭
        temporarylist: [], //暂存table点击行数据
        cickunmber: 0,
        paramsIP: {}, //平台IP等
        bLogin: 0,
		listInfo:{},//当前选中行
      }
    },
	components:{
		hik
	},
    mounted() {
      var _this = this;
      this.getmoniorAlarmList(1); //调取接口
      this.paging(); //加载分页事件
      this.getalarmType(); //获取告警类型
      this.bus.$on('changehandleFun', function(mes) {
        var type = mes.type;
        _this.handelalarm(type, _this.temporarylist);
      })
    },
    methods: {
      //点击行
      rowClick(row, column, event) {
        //4：移动侦测，5：本校布控，6：联动报警（手抱+报警柱） 7：视频遮挡 ，8 云端布控'
        this.temporarylist = row; //点击行数据存入
        if (row.alarmType == 5) {
          var selfParmas = {
            title: '人脸本校布控',
            //					"butCenter": ["抓拍图片", "视频回放"],
            rows: {
              '被布控人': row.blackName,
              '人员编号': row.blackCode,
              '相似度': row.blackSimilary,
              '设备位置': row.deviceName,
              '设备编号': row.deviceCode,
            }
          }
        } else if (row.alarmType == 4) {
          var selfParmas = {
            title: '移动侦测',
            //					"butCenter": ["视频回放"],
            rows: {
              '设备位置': row.deviceName,
              '设备编号': row.deviceCode,
              '告警时间': row.alarmTime,
            }
          }
        } else {
          var selfParmas = {
            title: row.alarmTypeName,
            //					"butCenter": ["视频回放"],
            rows: {
              '设备位置': row.deviceName,
              '设备编号': row.deviceCode,
              '告警时间': row.alarmTime,
            }
          }
        }
        var params = {
          title: row.alarmTypeName,
          type: "security",
          lon: row.longitude,
          lat: row.latitude,
          index: 1,
          "handleName": row.handleName,
          rows: {}
        }
        params = Object.assign(params, selfParmas);
        this.bus.$emit('addMapPop', params)
        // this.handelalarm(0, row); //去除new
      },
      opense(index, rows, event) {
        /*
         * viewFlag 1已查看 0未查看
         */
        if (index > 5) {
          var divcla = document.getElementsByClassName('opendiao');
          var thediv = divcla[index];
          thediv.style.top = "-50px"
          thediv.style.right = "70px"
        }
        if (rows.handleStatus != 0) {
          this.isopen = false;
        } else {
          this.showopen = index;
          this.isopen = (this.ciclkcount % 2) == 0 ? true : false;
          this.ciclkcount++;
        }

      },
      handelalarm(type, row) { //处理监控报警
        /* type
         * 0、出去new
         * 1、归档
         * 2、误报
         */
        this.isopen = false;
        this.ciclkcount = 0;
        var parasm = new FormData();
        parasm.append('alarmId', row.alarmId);
        parasm.append('handleStatus', type);
        this.$axios.post('monitor/alarmProcessing/' + UNITID, parasm).then((res) => {
			this.getmoniorAlarmList(1, 0); //刷新数据
        })
      },
      getalarmType() { //获取下拉选择框
        this.$axios.post('monitor/alarmType/' + UNITID).then((res) => {
          var alarmdata = res || [];
          this.options = alarmdata;
        })
      },
      getmoniorAlarmList(currentPage, type) { //获取数据
        this.currentPage = currentPage;
        var params = new FormData();
        params.append("alarmType", this.alarmType);
        params.append("deviceName", this.selectdeviceName);
        params.append("dailyAlarm", this.dailyAlarm);
        params.append("currentPage", this.currentPage);
        params.append("pageSize", this.pageSize);
        this.$axios.post('monitor/moniorAlarmList/' + UNITID, params).then((res) => {
          var data = res || [];
          $('#SumPage').html(Math.ceil(data.total / this.pageSize));
          var pagei = $('#intPage').val();
          if (pagei > Math.ceil(data.total / this.pageSize)) {
            $('#intPage').val(Math.ceil(data.total / this.pageSize));
          }
          this.moniorlist = data.rows;
          if (data.rows.length == 0 || type == 0) {
            return
          }
		  
		  if (this.isplayback == 0) {//默认播放第一条数据的实时告警
		  	 this.playVideo(data.rows[0],1)
		  }
        })
      },
	  switchvideo(row) { //双击切换视频(默认回放)
	     this.playVideo(row,2)
	  },
	  playVideo(row,isplayback){//isplayback:1实时 2回放
		  var vm = this;
		  this.listInfo={...row,isplayback:isplayback};
		  var flag = row.subPlatform;
		  if(flag==5){//海康插件播放
			  this.$refs.hik&&this.$refs.hik.init(false);
			  setTimeout(()=>{
			  	this.$refs.hik&&this.$refs.hik.init(true);
			  },500)
		  }else{
			 if(isplayback == 1) {
			 	 videoplay.preview(this.listInfo, 'hlsvideoalarm', 'videoalarm', 'videoalarm2');
			 } else {
				 videoplay.playback(this.listInfo, 'hlsvideoalarm', 'videoalarm', 'videoalarm2');
			 }
		  }
	  },
      /*分页栏按钮事件*/
      paging() {
        var _this = this;
        /*第一页 */
        $('#LYfirst_page').on('click', function() {
          _this.currentPage = 1;
          $('#intPage').val('1')
          _this.getmoniorAlarmList(_this.currentPage);
        })
        /*最后一页*/
        $('#LYlast_page').on('click', function() {
          _this.currentPage = $('#SumPage').html();
          $('#intPage').val(_this.currentPage)
          _this.getmoniorAlarmList(_this.currentPage)
        })
        /*上一页*/
        $('#LYlast').on('click', function() {
          _this.currentPage = $('#intPage').val();
          _this.currentPage--;
          if (_this.currentPage <= 0) {
            _this.currentPage = 1;
          }
          $('#intPage').val(_this.currentPage)
          _this.getmoniorAlarmList(_this.currentPage)
        })
        /*下一页 */
        $('#Lynext').on('click', function() {
          _this.currentPage = parseInt($('#intPage').val());
          _this.currentPage++;
          var oMax = $('#SumPage').html();
          if (_this.currentPage >= oMax) {
            _this.currentPage = oMax;
          }
          $('#intPage').val(_this.currentPage);
          _this.getmoniorAlarmList(_this.currentPage)
        })
        /*跳页 */
        $('#goPage').on('click', function() {
          var a = parseInt($('#intPage').val())
          var b = $('#SumPage').html();
          if (a >= b) {
            _this.currentPage = b;
          } else {
            _this.currentPage = a;
          }
          _this.getmoniorAlarmList(_this.currentPage)
        })
      },
      tableRowClassName({ //行颜色
        row,
        rowIndex
      }) {
        if ((rowIndex % 2) == 1) {
          return 'warning-row';
        } else if ((rowIndex % 2) == 0) {
          return 'success-row';
        }
        return '';
      }
    },
    beforeDestroy: function() {
      videoplay.wsbackclose();
    },

  }
</script>

<style lang="scss" scoped>
  #videoalarm2 {
    height: 100%;
    width: 100%;
  }

  .ml20 {
    margin-left: 1rem;
  }

  .v {
    display: flex;
    flex-direction: column;
  }

  .opendiao {
    width: 71px;
    /*height: 88px;*/
    background: rgba(0, 78, 129, 1);
    position: absolute;
    border: 1px solid rgba(0, 255, 255, 1);
    border-radius: 6px;
    z-index: 1;
    margin-top: 23px;
  }

  .imgselect {
    display: flex;
    margin-top: 6px;
  }

  .new-type {
    background: url(../../../../static/images/new2.png) no-repeat center;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 20px;
    height: 10px;
  }

  .v-table {
    width: 98%;
    margin-top: 1rem;
    margin-left: 0.25rem;
    cursor: pointer;
  }

  .fontzie {
    font-size: 16px;
  }

  .v-input {
    float: left;
  }

  .v-butt {
    float: left;
  }

  .v-titel {
    font-size: 0.9rem;
    color: rgba(117, 203, 242, 1);
    float: left;
  }

  .v-select {
    padding: 1rem 0px 0px 0.35rem;
  }

  .nextli {
    height: 20px;
    line-height: 20px;
    width: 45px;
    color: #FFFFFF;
    border-radius: 6px;
    margin: 5px 10px;
  }

  .bule {
    border: solid 1px rgb(0, 179, 179);
    background: rgb(0, 179, 179);
  }

  .yell {
    border: solid 1px #db7202;
    background: #db7202;
  }

  .red {
    border: solid 1px #d04a4a;
    background: #d04a4a;
  }

  .v-video {
    border-bottom: 1px solid rgba(74, 172, 219, 0.5);
    flex: 1;
    height: 40%;

    .v-VDList {
      width: 100%;
      height: 100%;
    }

    .video-container {
      width: 100%;
      height: 100%;
    }

  }

  .Z-lyPage * {
    font-size: 0.7rem;
    letter-spacing: 0.1rem;
  }

  .Z-lyPage {
    position: relative;
    bottom: 0px !important;
    right: 0px !important;
  }

  .Z-top3 {
    position: absolute;
  }

  .Z-lyPage input {
    width: 1.75rem !important;
    margin: 0 0.25rem;
  }

  .hikli {
    width: 100%;
    height: 100%;
  }
</style>
<style lang="scss">
  .v {
    .popper__arrow::after {
      border-bottom-color: #002037;
    }

    .el-scrollbar {
      background: #002037;
    }

    .el-select-dropdown {
      background: #002037;
      width: 5rem !important;
      border: 1px solid rgba(74, 172, 219, 1);
    }

    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      background: #002037;
    }

    .v-table {
      .el-table__empty-block {
        min-height: 14rem;
      }

      .el-table .warning-row {
        background: #001C2E;
      }

      .el-table .success-row {
        background: #00243C;
      }

      .el-table th {
        background: #014674;
        font-size: 0.9rem;
        color: rgba(117, 203, 242, 1);
      }

      .el-table td {
        padding: 0.2rem 0px;
      }

      .el-table td .cell {
        font-size: 0.8rem !important;
      }

      .el-table td span {
        font-size: 0.8rem !important;
      }

      .el-table .cell {
        padding-left: 0px;
        padding-right: 0.25rem;
      }

      .select-texe {
        display: block;
        width: 4rem;
        font-size: 0.8rem;
        text-align: left;
      }
    }

    .v-button {
      height: 1.2rem;
      text-align: center;
      margin-left: 0.25rem;

      span {
        font-size: 0.9rem;
      }

      .el-button {
        border: 1px solid rgba(0, 255, 255, 1);
        padding: 0.2rem 0.6rem;
      }

      .el-button--default,
      .el-button--default:focus,
      .el-button--default:hover {
        font-size: 0.8rem;
        color: rgba(254, 254, 254, 1);
      }
    }

    .v-input {
      border: 1px solid rgba(74, 172, 219, 1);
      border-radius: 4px;
      margin-left: 0.5rem;

      .el-input__inner {
        height: 1.2rem;
        line-height: 1.2rem;
        background: #021a2c;
        width: 7rem;
        font-size: 0.8rem;
        color: rgba(153, 153, 153, 1);
        padding: 0px 0.25rem;
        text-align: center;
      }
    }

    .v-butt {
      margin-left: 0.5rem;

      .el-input {
        width: 7.5rem;
      }

      .el-input--suffix .el-input__inner {
        padding-right: 0px;
      }

      .el-input__suffix {
        padding: 0px;
      }

      .el-input__inner {
        height: 1.2rem;
        line-height: 1.2rem;
        background: #021a2c;
        width: 6.3rem;
        font-size: 0.8rem;
        color: rgba(153, 153, 153, 1);
        padding: 0px 0.25rem;
        text-align: center;
      }

      .el-input__suffix {
        background: #021a2c;
      }

      .el-input__icon {
        height: 1.2rem;
      }

      .el-select {
        border: 1px solid rgba(74, 172, 219, 1);
        border-radius: 4px;
      }

      .el-select-dropdown {}
    }
  }
</style>
