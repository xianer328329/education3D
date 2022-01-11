<template>
  <div class="elecSafetyList-mian" id="elecSafetyList" style="display:none">
    <div class="thremodymaminc-close"><img class="closeInfoWindow" src="../../../static/images/Zgb.png" alt="" /></div>
    <div class="alarm-list">
      <div class="v-table">
        <el-table :data="deviceList" size="mini" height="11.3rem" stripe :border="false">
          <el-table-column label="设备号" :show-overflow-tooltip="true" prop="deviceName" width="200">
          </el-table-column>
          <el-table-column label="位置" :show-overflow-tooltip="true" prop="alarmTime" width="240">
            <template slot-scope="scope">
              {{scope.row.deviceBuild+'-'+scope.row.deviceUnit}}
            </template>
          </el-table-column>
          <el-table-column label="状态" :show-overflow-tooltip="true" prop="deviceOnline" width="100">
            <template slot-scope="scope">
              <span :class="{red:scope.row.deviceOnline!=1}">{{scope.row.deviceOnline==1?'在线':'离线'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :show-overflow-tooltip="true" prop="alarmTime" width="100">
            <template slot-scope="scope">
              <span class="Z-Nountreated cursorPointer" title="查看详情" :oitem='scope.row.obj'><img class="checkdateil" src="../../assets/icon/icon-check.png"></img></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        maxmap: null,
        deviceList: [],
        elecSafetyListfalg: false,
      }
    },
    methods: {
      show(type, oitem, Maxmap) {
        var _this = this;
        this.maxmap = Maxmap;
        this.elecSafetyListfalg = true;
        this.dataInfo = oitem;
        this.$axios.post('/elec/safety/ddeviceLocaMapInfo', {
          "deviceUlng": oitem.deviceUlng||oitem.longitude,
          "deviceUlat": oitem.deviceUlat||oitem.latitude,
        }).then(res => {
          if (res && res.length > 0) {
            this.deviceList = res || [];
            res.forEach((item) => {
              item.obj = JSON.stringify(item);
            })
            _this.$nextTick(function() {
              _this.attributeMon(type, oitem, res)
            });
          }else{
            this.$message.error('数据为空!')
          }
        })
      },
      attributeMon(oType, oitem, data) {
        var vm = this;
        var content = $('#elecSafetyList').html();
        this.infoWindow = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: content,
          anchor: 'top-left',
        });
        var point = new AMap.LngLat(oitem.longitude, oitem.latitude);
        this.infoWindow.open(this.maxmap, point);
        $('#container').on('click', '.closeInfoWindow', function() {
          vm.maxmap.clearInfoWindow();
          vm.infoWindow = null;
        })
        $('#container').on('click', '.Z-Nountreated', function() {
          var oitem = $(this).attr('oitem');
          oitem = JSON.parse(oitem);
          vm.maxmap.clearInfoWindow();
          vm.infoWindow = null;
          vm.bus.$emit("changeListprop", 5, oitem);
        })
      },
      closeInfoWindow() {
        if (this.infoWindow) {
          this.infoWindow.close();
          this.infoWindow = null;
        }
      },
    },

  }
</script>

<style lang="scss">
  .elecSafetyList-mian {
    width: 29.1rem;
    background: #001525;
    border: 1px solid #256080;
    z-index: 9999;
  }

  .checkdateil {
    display: inline-block;
    height: 1.1rem;
    width: 0.9rem;
    cursor: pointer;
  }

  .red {
    color: #d1aa14 !important;
  }

  .cursorPointer {
    cursor: pointer;
  }

  .v-table {}

  .thremodymaminc-close {
    position: absolute;
    top: 10%;
    right: 1%;
    cursor: pointer;
    z-index: 9;
  }

  .thremodymaminc-close img {
    height: 1rem;
    width: 1rem;
  }
</style>
