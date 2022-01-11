<template>
  <div class="AlarmLog-mian">
    <div class="title-box proportion">
      <span>报警记录</span>
    </div>
    <div class="v-table">
      <el-table :data="moniorlist" size="mini" height="11.8rem" stripe :border="false" @row-click="rowClick">
        <el-table-column label="告警类型" :show-overflow-tooltip="true" prop="alarmDesc">
        </el-table-column>
        <el-table-column label="设备位置" :show-overflow-tooltip="true" prop="alarmAddr">
        </el-table-column>
        <el-table-column label="告警时间" :show-overflow-tooltip="true" prop="alarmTime">
          <template slot-scope="scope">{{scope.row.alarmTime|time}}</template>
        </el-table-column>
      </el-table>
      <!-- <div class="Z-lyPage fr clearFix">
        <img id="LYfirst_page" src="../../../../static/images/first_page.png" /> <img id="LYlast" src="../../../../static/images/last.png" />
        <p>
          第<input type="text" value="1" id="intPage">页 共<span id="SumPage">0</span>页 <i id="goPage">跳转</i>
        </p>
        <img id="Lynext" src="../../../../static/images/next.png" /><img id="LYlast_page" src="../../../../static/images/last_page.png" />
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AlarmLog',
    data() {
      return {
        moniorlist: [],
      }
    },
    filters: {
      time(val) {
        if (!val) {
          return "--"
        }
        return val.substr(0, val.length - 3);
      },
    },
    mounted() {
      this.getdata();
    },
    methods: {
      getdata() {
        this.$axios.post('/elec/safety/balarmRecord', {
          "alarmClass": 1,
          "sortNum": 6
        }).then(res => {
          this.moniorlist = res || [];
        })
      },
      rowClick() {},
    }
  }
</script>

<style lang="scss">
  .AlarmLog-mian {

    .el-table td,
    .el-table th {
      padding: 0.2rem 0rem;
    }

    .AlarmLog-title {
      padding: 5px 10px;
    }

    .title-box {
      font-size: 0.9rem;
      position: relative;
      margin: 0.25rem 0rem 0.5rem 0.5rem;
    }

    .title-box span {
      font-size: 0.9rem;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #75c2e5;
      padding-left: 1.5rem;
      vertical-align: middle;
    }

    .proportion {
      background: url(../../../assets/icon/icon-alarmLog.png) no-repeat left;
      background-size: 1.1rem 1.1rem;
    }

    .el-table thead {
      font-size: 0.8rem;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #9ddaf6;
    }

    .el-table th {
      background: #0a2939 !important;
    }

    .el-table,
    .el-table__expanded-cell {
      background: #001423;
    }

    .el-table tr {
      background: #001423;
    }

    .el-table {
      font-size: 0.8;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #4d91b0;
      letter-spacing: 1px;
    }

    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #071b29 !important;
    }
  }
</style>
