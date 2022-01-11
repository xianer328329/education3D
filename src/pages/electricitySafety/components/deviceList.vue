<template>
  <div class="devicelist-mian">
    <el-dialog title="设备列表" class="h-dialog h-dialog-dropdown defence-modal" :center="true" :modal-append-to-body="false" width="55%" :visible="dialogVisible" :before-close="closedetails">
      <div class="search-box">
        <div class="form-box">
          <div class="form-line">
            <label>状态</label>
            <el-select v-model='seachInfo.deviceOnline' clearable placeholder="请选择状态">
              <el-option :value="item.value" v-for="item in options" :label="item.label" :key="item.label"></el-option>
            </el-select>
          </div>
          <div class="form-line">
            <label>楼宇</label>
            <el-select v-model='seachInfo.deviceBuild' clearable placeholder="请选择楼宇">
              <el-option :value="it.deviceBuild" v-for="(it,index) in buildList" :label="it.deviceBuild" :key="index"></el-option>
            </el-select>
          </div>
          <div class="operate-btn">
            <el-button type="primary" @click="getdata(1)">查 询</el-button>
          </div>
        </div>
      </div>
      <div class="alarm-list">
        <div class="v-table">
          <el-table :data="deviceData" size="mini" height="20rem" stripe :border="false" @row-click="rowClick">
            <el-table-column label="设备号" :show-overflow-tooltip="true" prop="deviceName">
            </el-table-column>
            <el-table-column label="位置" :show-overflow-tooltip="true" prop="alarmSite">
            </el-table-column>
            <el-table-column label="状态" :show-overflow-tooltip="true" prop="deviceOnline">
              <template slot-scope="scope">
                <span :class="{red:scope.row.deviceOnline==0}">{{scope.row.deviceOnline==0?'离线':'在线'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="离线时间" :show-overflow-tooltip="true" prop="onlineTime">
              <template slot-scope="scope">
                <span>{{scope.row.onlineTime||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="线路数" :show-overflow-tooltip="true" prop="nodeNum">
              <template slot-scope="scope">
                <span class="tolinlist" @click.stop="showlintList(scope.row)">{{scope.row.nodeNum}}</span>
              </template>
            </el-table-column>
          </el-table>
          <page :pager="pageInfo" @pageChange="changePage"></page>
        </div>
      </div>
    </el-dialog>
    <lin-List ref="linListref" :buildList="buildList"></lin-List>
  </div>
</template>

<script>
  import linList from './lineList.vue'
  import page from './page.vue'
  export default {
    components: {
      page,
      linList,
    },
    data() {
      return {
        dialogVisible: false,
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
        deviceData: [],
        buildList: [],
        seachInfo: {
          deviceOnline: '',
          deviceBuild: '',
        },
        pageInfo: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
      }
    },
    methods: {
      show(type, data) {
        /*
        type 1 所有设备 2离线设备
        */
        this.dialogVisible = true;
        this.buildList.length > 0 ? '' : this.getbuild();
        if (type == 1) {
          this.seachInfo.deviceOnline = '';
        } else if (type == 2) {
          this.seachInfo.deviceOnline = 1;
        }
        this.getdata();
      },
      showlintList(row) {
        this.$refs.linListref.show(row);
      },
      getdata() {
        let params = {};
        params = Object.assign(this.seachInfo, this.pageInfo);
        delete params['total']
        this.$axios.post('/elec/safety/aselectdevicelist', params).then(res => {
          this.deviceData = res.dataList || [];
          this.pageInfo.total = res.total;
        })
      },
      rowClick(row) {
        this.bus.$emit('setAlarmPoint', 2, row);
        this.closedetails();
      },
      changePage(page) {
        this.pageInfo = $.extend(this.pageInfo, JSON.parse(page));
        this.getdata();
      },
      getbuild() {
        this.$axios.post('/elec/safety/aselectdevicebuild', {}).then(res => {
          this.buildList = res || [];
        })
      },
      closedetails() {
        this.pageInfo.currentPage = 1;
        this.dialogVisible = false;
      },
    },
  }
</script>

<style lang="scss">
  .devicelist-mian {
    .search-box {
      padding-top: 0px;
      margin-top: 1rem;
    }

    .search-box .form-box {
      margin-right: 90px;
    }

    .tolinlist {
      width: 100%;
      display: block;
      cursor: pointer;
    }

    .Z-QueryList select {
      width: 10.5rem;
    }
  }
</style>
