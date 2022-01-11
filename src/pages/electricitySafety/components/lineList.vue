<template>
  <div class="elecsafetylinelist-mian">
    <el-dialog title="线路列表" class="h-dialog h-dialog-dropdown defence-modal" :center="true" :modal-append-to-body="false" width="70%" :visible="dialogVisible" :before-close="close">
      <div class="search-box">
        <div class="form-box">
          <div class="form-line">
            <label>开关状态</label>
            <el-select v-model="seachInfo.nodeOc" clearable placeholder="请选择开关状态">
              <el-option v-for="item in ocoptions" :label="item.label" :key="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-line">
            <label>楼宇</label>
            <el-select v-model="seachInfo.deviceBuild" clearable placeholder="请选择楼宇">
              <el-option :value="it.deviceBuild" v-for="(it,index) in buildList" :label="it.deviceBuild" :key="index"></el-option>
            </el-select>
          </div>
          <div class="form-line">
            <label>是否总线</label>
            <el-select v-model="seachInfo.mainLine" clearable placeholder="请选择是否总线">
              <el-option v-for="item in mainoptions" :label="item.label" :key="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-line">
            <label>告警状态</label>
            <el-select v-model="seachInfo.nodeAlarm" clearable placeholder="请选择告警状态">
              <el-option v-for="item in alarmoptions" :label="item.label" :key="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-line">
            <label>设备号</label>
            <el-input v-model="seachInfo.deviceName" placeholder="请输入设备编号"></el-input>
          </div>
          <div class="form-line">
            <label>线路位置</label>
            <el-cascader v-model="seachInfo.alarmNode" clearable :options="nodeList"></el-cascader>
          </div>
          <div class="operate-btn">
            <el-button type="primary" @click="queryline(1)">查 询</el-button>
          </div>
        </div>
      </div>
      <div class="v-table">
        <el-table :data="lineData" size="mini" height="14.3rem" stripe :border="false">
          <el-table-column label="线路名称" :show-overflow-tooltip="true" prop="nodeName">
          </el-table-column>
          <el-table-column label="线路地址" :show-overflow-tooltip="true" prop="alarmSite">
          </el-table-column>
          <el-table-column label="类型" :show-overflow-tooltip="true" prop="lineType">
            <template slot-scope="scope">
              <span>{{scope.row.lineType==220?'单相':'三相'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属设备" :show-overflow-tooltip="true" prop="deviceName">
          </el-table-column>
          <el-table-column label="告警状态" :show-overflow-tooltip="true" prop="nodeNum">
            <template slot-scope="scope">
              <span :class="{red:scope.row.nodeAlarm==0}">{{scope.row.nodeAlarm==0?'! 告警':'未告警'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="开关状态" :show-overflow-tooltip="true" prop="nodeOc">
            <template slot-scope="scope">
              <span :class="{red:scope.row.nodeOc==0}">{{scope.row.nodeOc==0?'已断':'已通'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :show-overflow-tooltip="true" prop="nodeNum">
            <template slot-scope="scope">
              <div class="enableNetCtrl" v-show="scope.row.enableNetCtrl!='--'">
                <span :class="{noctrl:scope.row.nodeOc==1}" @click="open(1,scope.row)">合闸</span>
                <span :class="{noctrl:scope.row.nodeOc==0}" @click="open(2,scope.row)">分闸</span>
              </div>
              <span v-show="scope.row.enableNetCtrl=='--'">--</span>
            </template>
          </el-table-column>
          <el-table-column label="详情" :show-overflow-tooltip="true" prop="nodeNum">
            <template slot-scope="scope">
              <span class="curpointer" @click="showdetail(scope.row)">详情</span>
            </template>
          </el-table-column>
        </el-table>
        <page :pager="pageInfo" @pageChange="changePage"></page>
      </div>
    </el-dialog>
    <el-dialog title="线路详情" class="h-dialog h-dialog-dropdown defence-modal" :center="true" :modal-append-to-body="false" width="75%" :visible="detailVisible" :before-close="closedetails">
      <div class="titlelinlist-box">
        <div class="line-from-box">
          <span>开关状态：{{detailInfo.nodeOc==0?'已断':'已通'}}</span>
          <span>类型：{{detailInfo.lineType==220?'单相':'三相'}}</span>
          <span>告警状态：{{detailInfo.nodeAlarm==0?'! 告警':'未告警'}}</span>
        </div>
        <div class="line-from-box">
          <span>线路名称：{{detailInfo.nodeName}}</span>
          <span>线路地址：{{detailInfo.nodeAddr}}</span>
          <span>所属设备：{{detailInfo.deviceName}}</span>
        </div>
      </div>
      <div class="v-table" v-show="row.lineType=='220'">
        <el-table :data="detailList" size="mini" height="5rem" stripe :border="false">
          <el-table-column label="漏电流（mA）" :show-overflow-tooltip="true" prop="aLd">
          </el-table-column>
          <el-table-column label="温度（℃）" :show-overflow-tooltip="true" prop="aT">
          </el-table-column>
          <el-table-column label="电流（A）" :show-overflow-tooltip="true" prop="aA">
          </el-table-column>
          <el-table-column label="电压（V）" :show-overflow-tooltip="true" prop="aV">
          </el-table-column>
          <el-table-column label="功率（W）" :show-overflow-tooltip="true" prop="aW">
          </el-table-column>
        </el-table>
      </div>
      <div class="v-table clearFix" v-show="row.lineType!='220'">
        <div class="C-table">
          <el-table :data="detailList" size="mini" height="5rem" stripe :border="false">
            <el-table-column label="漏电流（mA）" :show-overflow-tooltip="true" prop="gLd">
            </el-table-column>
            <el-table-column label="壳温度（℃）" :show-overflow-tooltip="true" prop="gT">
            </el-table-column>
            <el-table-column label="平均电流（A）" :show-overflow-tooltip="true" prop="gA">
            </el-table-column>
            <el-table-column label="平均电压（V）" :show-overflow-tooltip="true" prop="gV">
            </el-table-column>
            <el-table-column label="功率和值（W）" :show-overflow-tooltip="true" prop="gW">
            </el-table-column>
            <el-table-column label="合相功率因数" :show-overflow-tooltip="true" prop="gPF">
            </el-table-column>
          </el-table>
        </div>
        <div class="C-table">
          <el-table :data="detailList" size="mini" height="5rem" stripe :border="false">
            <el-table-column label="零线电流（A）" :show-overflow-tooltip="true" prop="nA">
            </el-table-column>
            <el-table-column label="A相温度（℃）" :show-overflow-tooltip="true" prop="aT">
            </el-table-column>
            <el-table-column label="A相电流（A）" :show-overflow-tooltip="true" prop="aA">
            </el-table-column>
            <el-table-column label="A相电压（V）" :show-overflow-tooltip="true" prop="aV">
            </el-table-column>
            <el-table-column label="A相功率（W）" :show-overflow-tooltip="true" prop="aW">
            </el-table-column>
            <el-table-column label="A相功率因数" :show-overflow-tooltip="true" prop="aPF">
            </el-table-column>
          </el-table>
        </div>
        <div class="C-table">
          <el-table :data="detailList" size="mini" height="5rem" stripe :border="false">
            <el-table-column label="零线温度（℃）" :show-overflow-tooltip="true" prop="nT">
            </el-table-column>
            <el-table-column label="B相温度（℃）" :show-overflow-tooltip="true" prop="bT">
            </el-table-column>
            <el-table-column label="B相电流（A）" :show-overflow-tooltip="true" prop="bA">
            </el-table-column>
            <el-table-column label="B相电压（V）" :show-overflow-tooltip="true" prop="bV">
            </el-table-column>
            <el-table-column label="B相功率（W）" :show-overflow-tooltip="true" prop="bW">
            </el-table-column>
            <el-table-column label="B相功率因数" :show-overflow-tooltip="true" prop="bPF">
            </el-table-column>
          </el-table>
        </div>
        <div class="last-table fr">
          <el-table :data="detailList" size="mini" height="5rem" stripe :border="false">
            <el-table-column label="C相温度（℃）" :show-overflow-tooltip="true" prop="cA">
            </el-table-column>
            <el-table-column label="C相电流（A）" :show-overflow-tooltip="true" prop="cT">
            </el-table-column>
            <el-table-column label="C相电压（V）" :show-overflow-tooltip="true" prop="cV">
            </el-table-column>
            <el-table-column label="C相功率（W）" :show-overflow-tooltip="true" prop="cW">
            </el-table-column>
            <el-table-column label="C相功率因数" :show-overflow-tooltip="true" prop="cPF">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import page from './page.vue'
  export default {
    components: {
      page,
    },
    props: {
      buildList: {
        type: Array,
        default: () => {
          return [];
        }
      },
    },
    data() {
      return {
        dialogVisible: false,
        detailVisible: false,
        alarmoptions: [{
          value: '',
          label: '不限'
        }, {
          value: 1,
          label: '未告警'
        }, {
          value: 0,
          label: '告警'
        }],
        mainoptions: [{
          value: '',
          label: '不限'
        }, {
          value: 0,
          label: '否'
        }, {
          value: 1,
          label: '是'
        }],
        ocoptions: [{
          value: '',
          label: '不限'
        }, {
          value: 0,
          label: '已断'
        }, {
          value: 1,
          label: '已通'
        }],
        options: [{
          value: '',
          label: '不限'
        }, {
          value: 0,
          label: '离线'
        }, {
          value: 1,
          label: '在线'
        }],
        row: {},
        lineData: [],
        detailList: [],
        detailInfo: {},
        seachInfo: {
          "alarmNode": [],
          "nodeOc": "", //开关状态
          "mainLine": "", //是否是总线
          "nodeAlarm": "", //告警状态
          "deviceName": "", //设备号
          "nodeName": "", //线路名称
          "deviceBuild": "", //楼栋
          "deviceUnit": "", //单元
          "deviceRoom": "", //房号
        },
        nodeList: [],
        pageInfo: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        row: {},
      }
    },
    methods: {
      show(data) {
        this.row = data;
        this.seachInfo.deviceName = data.deviceName;
        this.dialogVisible = true;
        this.queryline();
      },
      open(type, row) {
        this.$axios.post('/elec/safety/aupdatenodeoc', {
          mac: row.deviceName,
          value1: type == 1 ? 'close' : 'open',
          value2: row.nodeAddr,
        }).then(res => {
			  this.$message({
				message: res.message,
				type: 'success'
			  });
			  this.queryline();
        })
      },
      queryline() {
        var params = Object.assign(this.seachInfo, {});
        params.currentPage = this.pageInfo.currentPage;
        params.pageSize = this.pageInfo.pageSize;
        var data = JSON.parse(JSON.stringify(params))
        if (this.seachInfo.alarmNode.length != 0) {
          this.seachInfo.deviceBuild = "";
          data.deviceBuild = data.alarmNode.length > 0 ? data.alarmNode[0] : this.seachInfo.deviceBuild;
          data.deviceUnit = data.alarmNode.length > 0 ? data.alarmNode[1] : '';
          data.deviceRoom = data.alarmNode.length > 0 ? data.alarmNode[2] : '';
        }
        delete data.alarmNode;
        this.$axios.post('/elec/safety/aselectnodelist', data).then(res => {
          this.lineData = res.data1 || [];
          this.nodeList = res.data2 || [];
          this.pageInfo.total = res.total;
        })
      },
      changePage(page) {
        this.pageInfo = $.extend(this.pageInfo, JSON.parse(page));
        this.queryline();
      },
      showdetail(row) {
        this.row = row;
        this.$axios.post('/elec/safety/aselectnodeinfo', {
          uuid: row.uuid
        }).then(res => {
          this.detailInfo = res.data1;
          this.detailList = [res.data1];
        })
        this.detailVisible = true;
      },
      closedetails() {
        this.detailVisible = false;
      },
      close() {
        this.dialogVisible = false;
      },
    }
  }
</script>

<style lang="scss">
  .elecsafetylinelist-mian {
    .titlelinlist-box {
      height: 4rem;
      width: 100%;
    }

    .v-table {
      width: 100%;
      position: relative;
    }

    .last-table {
      width: 83%;
    }

    .C-table {
      margin-top: 0.5rem;
    }

    .line-from-box {}

    .line-from-box span {
      display: inline-block;
      width: 33%;
      text-align: left;
      color: #6dc0e6;
      font-size: 0.9rem;
      font-family: 'Microsoft YaHei Regular';
      font-weight: 400;
    }

    .search-box .form-box {
      margin-right: 90px;
    }

    .noctrl {
      background: #008BDB !important;
      color: #fff !important;
    }

    .curpointer {
      cursor: pointer;
    }

    .enableNetCtrl span {
      cursor: pointer;
      display: inline-block;
      padding: 0.2rem 0.5rem;
      color: #606266;
      background: #cccccc;
      border-radius: 4px;

    }

    .form-line {
      .el-cascader {
        display: inline-block;
        position: relative;
        font-size: 0.9rem;
        line-height: 1.4rem;
        height: 1.4rem;
      }

      .el-cascader__label {
        font-size: 0.9rem;
      }

      .el-input__icon {
        line-height: 1.4rem;
        width: 1.25rem;
      }
    }

    .red {
      color: red !important;
    }
  }
</style>
