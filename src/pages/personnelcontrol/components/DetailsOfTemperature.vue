<template>
  <div class="DetailsOfTemperature">
    <el-dialog title="体温异常班级" :modal-append-to-body="false" top="41vh" :visible="visible" :before-close="closeSub" custom-class="dialog-dtemper">
      <div class="dtemper-box clearFix">
        <div class="dtempert-left fl">
          <div class="dtemper-li" @click="changedetail(item)" :class="{itemclass:itemdata.staffClass==item.staffClass}" :key="item.staffClass" v-for="item in datalist">
            <span class="dtemper-text">{{item.staffClass}}</span>
            <div class="fr Z-numberf dtemper-number">{{item.count}} <small>人</small></div>
          </div>
        </div>
        <div class="dtempert-riht fr">
          <div class="QueryParameters">
            <ul class="Z-QueryList clearFix" id="data-box">
              <li>
                <span class="lable">测量日期</span>
                <div class="timeQuery">
                  <div class="block twodate">
                    <el-date-picker v-model="defaultTime" type="daterange" :default-time="['00:00:00', '23:59:59']" range-separator="" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeChange" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </div>
                </div>
              </li>
              <li class="QueryBtn" v-on:click='queryData'>查询</li>
            </ul>
          </div>
          <el-table :data="lists" stripe height="23rem" v-loading="loading">
            <el-table-column prop="staffName" label="姓名" :show-overflow-tooltip="true" width="120"></el-table-column>
            <el-table-column prop="tempValu" label="体温" width="50"> </el-table-column>
            <el-table-column prop="staffUuid" label="学号"></el-table-column>
            <el-table-column prop="cuseTime" label="测量时间" width="100"></el-table-column>
            <el-table-column prop="deviName" label="测量位置"></el-table-column>
            <el-table-column prop="staffClass" label="班级">
				<template slot-scope="scope">{{scope.row.deptName||'--'}}</template>
			</el-table-column>
          </el-table>
          <page :pager="tableData" @pageChange="changePage"></page>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import page from './page.vue'
  import TwoSelc from '@/pages/components/twodateSelection.vue'
  export default {
    components: {
      page, //分页
      TwoSelc,
    },
    data() {
      return {
        lists: [],
        visible: false,
        loading: false,
        tableData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        type: '',
        rows: [],
        datalist: [],
        itemdata: {},
        defaultTime: [],
      }
    },
    mounted() {
      var _this = this;
    },
    methods: {
      //初始化
      async init(item, type) {
        this.type = type;
        this.defaultTime = [];
        if (type == 1) {
          /* 点击更多是查询最近30天的数据*/
          var sdate = new Date();
          sdate.setDate(sdate.getDate() - 30);
          sdate.setHours(0, 0, 0)
          sdate = this.formatDate(sdate, 'yyyy-MM-dd hh:mm:ss')

          var edate = new Date();
          edate.setHours(23, 59, 59);
          edate = this.formatDate(edate, 'yyyy-MM-dd hh:mm:ss')
        } else {
          var sdate = item.sdate;
          var edate = item.edate;
        }
        this.defaultTime = [sdate, edate];

        var datalist = await this.loadClass();
        this.datalist = datalist;
        if (item == null && datalist.length > 0) {
          item = datalist[0];
        }
        var list = await this.getdetail(item);
        this.lists = list;

        this.itemdata = item;
        this.visible = true;
      },
      // 获取表格数据
      async getdetail(item) {
        let parmas = {};
        parmas = {
          "currentPage": this.tableData.currentPage,
          "pageSize": this.tableData.pageSize,
          "startTime": this.defaultTime[0],
          "endTime": this.defaultTime[1],
        }
        if (item != null) {
          parmas.staffClass = item.staffClass
        }
        return await this.$axios.post('/traffic/people/tempExStudent', parmas).then((res) => {
          this.tableData.total = res.total;
          return res.rows || [];
        })
      },
      // 获取班级数据
      async loadClass() {
        let params = {};
        params.startTime = this.defaultTime[0];
        params.endTime = this.defaultTime[1];
        return await this.$axios.post('/traffic/people/tempExClass', params).then(res => {
          return res.rows;
        })
      },
      // 查询
      async queryData() {

        var datalist = await this.loadClass();
        this.datalist = datalist;
        if (datalist.length > 0) {
          var list = await this.getdetail(datalist[0]);
          this.lists = list;
          this.itemdata = datalist[0];
        }
        this.changedetail(this.itemdata);
      },
      //点击班级事件
      async changedetail(item) {
        this.tableData.currentPage = 1;
        this.itemdata = item;
        this.lists = await this.getdetail(item);
      },
      timeChange(res) {
        this.defaultTime = res;
      },
      //分页
      async changePage(page) {
        this.tableData = $.extend(this.tableData, JSON.parse(page));
        this.lists = await this.getdetail(this.itemdata);
      },
      formatDate(value, fmt) {
        if (!value) {
          return "--"
        }
        let getDate = new Date(value);
        let o = {
          'M+': getDate.getMonth() + 1,
          'd+': getDate.getDate(),
          'h+': getDate.getHours(),
          'm+': getDate.getMinutes(),
          's+': getDate.getSeconds(),
          'q+': Math.floor((getDate.getMonth() + 3) / 3),
          'S': getDate.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt;

      },
      // 关闭
      closeSub() {
        this.visible = false;
        this.itemdata = {};
        this.lists = [];
        this.defaultTime = [];
      },
    }
  }
</script>

<style lang="scss">
  .DetailsOfTemperature {
    .QueryParameters {
      margin-bottom: 10px;
      margin-top: 0px !important;
    }

    .itemclass {
      background: rgba(10, 63, 94, 1) !important;
      border: 1px solid rgba(0, 255, 255, 1) !important;
    }

    .dialog-dtemper {
      width: 60% !important;
    }

    .el-table {
      font-size: 0.8rem !important;
    }

    .dtemper-box {
      height: 100%;
      width: 100%;
      position: relative;
    }

    .dtempert-left {
      width: 23.5%;
      height: 25rem;
      padding: 0 0.5rem 0 0.5rem;
      position: relative;
      background: rgba(5, 45, 72, 1);
      border: 1px solid rgba(10, 80, 122, 1);
      overflow-y: auto;
    }

    .dtempert-riht {
      width: 73%;
      height: 100%;
      position: relative;
    }

    .dtemper-number {
      height: 100%;
      line-height: 2.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: rgba(255, 204, 0, 1);
    }

    .dtemper-li small {
      font-size: 0.6rem;
      color: #75cbf2;
      margin-right: 0.2rem;
    }

    .dtemper-text {
      font-size: 0.8rem;
      font-weight: 400;
      color: rgba(117, 203, 242, 1);
      margin-left: 1%;
      width: 80%;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .dtemper-li {
      width: 98%;
      height: 2.1rem;
      margin: 0 auto;
      margin-top: 0.5rem;
      line-height: 2.1rem;
      background: rgba(10, 63, 94, 1);
      border: 1px solid rgba(10, 80, 122, 1);
      cursor: pointer;
      position: relative;
    }

    #data-box .el-date-editor--daterange.el-input__inner {
      width: 13.85rem;
      height: 1.4rem;
    }

    .el-picker-panel {
      background: rgba(0, 32, 55, 1);
      border: 1px solid rgba(49, 133, 156, 1);
    }

    .Z-QueryList .timeQuery .el-icon-date {
      display: none;
    }

    .Z-QueryList .timeQuery .el-range-input {
      padding-left: 0;
    }

    .Z-QueryList .timeQuery .el-range-separator {
      width: 1rem;
      border-top: 1px solid #999;
      margin-top: 1.3rem;
      display: inline-block;
    }

    .el-date-range-picker__header div {
      color: #75cbf2;
    }

    .el-date-editor .el-range__close-icon {
      font-size: 20px;
      color: #c0c4cc;
      width: 40px;
      display: inline-block;
      float: right;
      line-height: 10px;
    }

    .el-date-range-picker__content.is-left {
      border-right: 1px solid #31859c;
    }

    .el-popper[x-placement^=top] .popper__arrow::after {
      border-top-color: rgba(0, 32, 55, 1);
    }

    .el-popper[x-placement^=top] .popper__arrow {
      border-top-color: rgba(49, 133, 156, 1);
    }

    .el-date-table td.today span {
      color: #34affd;
      font-weight: 500;
    }

    .el-input__prefix {
      left: auto;
      right: 0px;
    }

    .el-date-picker__header {
      background: rgba(0, 78, 129, 1);
      border-radius: 2px 1px 1px 1px;
      margin: 0;
      height: 36px;
      padding: 0 8px
    }

    .el-date-picker__header-label,
    .el-picker-panel__icon-btn {
      color: #75CBF2;
    }

    .el-date-table th {
      color: #75CBF2;
      font-size: 14px;
      border-bottom: solid 1px #31859C;
    }

    .el-date-table td.prev-month,
    .el-date-table td.next-month,
    .el-date-table td.prev-month {
      color: #31859C;
    }

    .el-date-table td.available {
      color: #75CBF2;
    }

    .el-date-table td.today {
      border-bottom: 1px solid #34affd;
    }
  }
</style>
