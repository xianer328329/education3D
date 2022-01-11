<template>
  <div class="EarlyWarningMonitoring">
    <h4 class="mdTitle">预警监测</h4>
    <div class="early-maxbox">
      <div class="early-box" :class="{currbox:currbox==1}" @click="swithbox(1)">
        <div class="early-centers">
          <i class="Z-numberf" @click="childClick(1,'体温异常详情')">{{dataInfo.abnormalTemp}}</i>
          <span>体温异常</span>
        </div>
        <div class="ealy-butbox">
          <div class="ealy-but-minbox">
            <span>较上日<i>{{dataInfo.lastabnormalTemp}}</i></span>
          </div>
        </div>
      </div>
      <div class="early-box early-mar" :class="{currbox:currbox==2}" @click="swithbox(2)">
        <div class="early-centers">
          <i class="Z-numberf" @click="childClick(2,'未佩戴口罩详情')">{{dataInfo.wearMask}}</i>
          <span>未佩戴口罩</span>
        </div>
        <div class="ealy-butbox">
          <div class="ealy-but-minbox">
            <span>较上日<i>{{dataInfo.lastWearMask}}</i></span>
          </div>
        </div>
      </div>
      <div class="early-box clearFix" :class="{currbox:currbox==3}" @click="swithbox(3)">
        <div class="early-centers two-centers">
          <i class="Z-numberf" @click="childClick(3,'疑似异常详情')">{{dataInfo.toDayCount}}</i>
          <span>疑似异常</span>
          <span class="early-span">(48小时)</span>
        </div>
        <div class="ealy-butbox ealy-two">
          <div class="ealy-but-minbox">
            <span>较上日<i>{{dataInfo.lastCount}}</i></span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="childName" :modal-append-to-body="false" :visible="visible" :before-close="closeSub" custom-class="dialog-userdetail">
      <el-table :data="childData" stripe height="25rem" v-loading="loading">
        <el-table-column prop="staffName" label="姓名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="staffClass" label="学院"> </el-table-column>
        <el-table-column prop="cuseTime" label="时间">
          <template slot-scope="scope">{{scope.row.cuseTime?scope.row.cuseTime:'--'}}</template>
        </el-table-column>
        <el-table-column prop="deviceName" label="地点"></el-table-column>
      </el-table>
      <page :pager="tableData" @pageChange="changePage"></page>
    </el-dialog>
  </div>
</template>

<script>
  import page from './page.vue'
  export default {
    components: {
      page, //分页
    },
    data() {
      return {
        childData: [],
        currbox: 1,
        childName: '',
        visible: false,
        loading: false,
        tableData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        dataInfo: {
          abnormalTemp: 0,
          toDayCount: 0,
          wearMask: 0,
        },
      }
    },
    mounted() {
      this.getdata();
    },
    methods: {
      getdata() {
        this.$axios.post('/traffic/people/earlyWarningMonitor', {}).then(res => {
          let data = res || {};
          //较上日体温异常
          data.lastabnormalTemp = data.abnormalTemp - data.lastDayAbnormalTemp;
          data.lastabnormalTemp = data.lastabnormalTemp >= 0 ? "+" + data.lastabnormalTemp : '-' + Math.abs(data.lastabnormalTemp);
          //较上日未带口罩
          data.lastWearMask = data.wearMask - data.lastDayWearMask;
          data.lastWearMask = data.lastWearMask >= 0 ? "+" + data.lastWearMask : '-' + Math.abs(data.lastWearMask);
          //较上日疑似异常
          data.lastCount = data.toDayCount - data.lastDayCount;
          data.lastCount = data.lastCount >= 0 ? "+" + data.lastCount : '-' + data.lastCount;
          this.dataInfo = data;
        })
      },
      childClick(childCurr, childName) {
        this.childName = childName;
        this.tableData.type = childCurr;
        this.getchildData();
      },
      changePage(page) {
        this.tableData = $.extend(this.tableData, JSON.parse(page));
        this.getchildData();
      },
      getchildData() {
        this.$axios.post('/traffic/people/earlyWarningDetails', this.tableData).then(res => {
          this.childData = res.data || [];
          this.tableData.total = res.total;
          this.visible = true;
        })
      },
      closeSub() {
        this.visible = false;
      },
      swithbox(currbox) {
        this.currbox = currbox;
        this.$emit("show", currbox);
      },
    },
  }
</script>

<style lang="scss">
  .EarlyWarningMonitoring {
    .currbox {
      border: 1px solid rgba(0, 255, 255, 1);
    }

    .early-maxbox {
      width: 100%;
      height: 100%;
      margin-top: 4%;
      cursor: pointer;
    }

    .early-box {
      float: left;
      width: 32.2%;
      height: 80%;
      background: rgba(10, 63, 94, 1);
    }

    .early-mar {
      margin: 0 1%;
    }

    .early-centers {
      width: 100%;
      text-align: center;
      top: 20%;
      left: 0px;
      cursor: pointer;
      background-size: 90px 3px;
      position: relative;
    }

    .early-centers i {
      font-size: 1.5rem;
      color: #FFCC00;
      display: block;
      padding-bottom: 0.7rem;
      background: url(../../../../static/images/img4.png) no-repeat center bottom;
    }

    .early-centers i em {
      font-size: 0.7rem;
      color: #75cbf2;
      margin-left: 0.15rem;
    }

    .early-centers span {
      font-size: 0.8rem;
      display: block;
      margin-top: 0.7rem;
      color: #75cbf2;
    }

    .early-span {
      margin-top: 1% !important;
    }

    .ealy-two {
      top: 29% !important;
    }

    .ealy-butbox {
      width: 100%;
      height: 13%;
      text-align: center;
      top: 40%;
      position: relative;
    }

    .ealy-but-minbox {
      width: 80%;
      height: 100%;
      margin: 0 auto;
      background: #356582;
      border: 1px solid #0a507a;
      text-align: center;
    }

    .ealy-but-minbox span {
      font-size: 0.7rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(117, 203, 242, 1);
    }

    .ealy-but-minbox i {
      font-size: 0.7rem;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(255, 130, 7, 1);
    }
  }
</style>
