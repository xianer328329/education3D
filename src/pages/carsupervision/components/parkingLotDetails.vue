<template>
  <div class="parkingLotDetails-mian">
    <el-dialog title="车位详情" center class="h-mini-dialog" :modal="false" :modal-append-to-body="false" :visible="curr!=''" :before-close="close">
      <div class="parking-box" v-for="(item,index) in dataList" :key="item.uuid">
        <div class="parking-title">
          <span>{{item.parkName}}</span>
        </div>
        <div class="parking-centenbox">
          <div class="echar-box">
            <div class="Z-WMPie" :id="'parkingDetail'+index"></div>
            <div class="Z-WMPieFont"><i class="parking-charnumber">{{item.reaotcout}}<em class="parking-charmb">%</em></i><span class="parking-chartext">车位占用</span></div>
          </div>
          <div class="parkin-li matop">
            <div class="parkin-li-bg">
              <span class="parkin-li-text">剩余车位数</span>
              <span class="parkin-li-number colorbule">{{item.leftPlot}}</span>
            </div>
            <div class="parkin-li-bg">
              <span class="parkin-li-text">已占用车位数</span>
              <span class="parkin-li-number ">{{item.occupiedPlot}}</span>
            </div>
            <div class="parkin-li-bg">
              <span class="parkin-li-text">总车位数</span>
              <span class="parkin-li-number color0ff">{{item.totalPlot}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataList: [],
        pieJsonAlarm: {
          color: ["#ffc000","#31859c"],
          radius: ['70%', '80%'],
          center: ['50%', '50%'],
          emphasis: 'false',
          lege: 'false',
          itemGap: 14,
          fontSize: 18,
          top: 10,
        },
        curr: '',
      }
    },
    mounted() {},
    methods: {
      show() {
        this.getData();
      },
      getData() {
        this.$axios.post("/traffic/pass/traffic/parkingDetails", {
          unitUuid: UNITID
        }).then(res => {
          let data = res || [];
          if (data.length != 0) {
            this.curr = '1';
          } else {
            return
          }
          data.forEach((item, index) => {
            item.reaotcout = 0;
            if (!!item.occupiedPlot) {
              item.reaotcout = ((item.occupiedPlot / item.totalPlot)*100).toFixed(1)
            }

            let pieDatasAlarm = [{
                value: item.occupiedPlot,
                name: "已占用车位"
              },
              {
                value: item.leftPlot,
                name: "总车位"
              },
            ];
            this.$nextTick(function() {
              this.PieDataAlarm('parkingDetail' + index, pieDatasAlarm, this.pieJsonAlarm)
            })
          })

          this.dataList = data;
        })

      },
      PieDataAlarm(Id, pieDatasAlarm, pieJsonAlarm) {
        var vm = this;
        vm.pieJsonAlarm.lege = "false";
        vm.pieJsonAlarm.emphasis = "false";
        var myChart = echarts.init(document.getElementById(Id));
        myChart.setOption(Pie222(pieDatasAlarm, vm.pieJsonAlarm), true);
        allCharts.push(myChart);
        this.$nextTick(function() {
          myChart.resize();
        })
      },
      close() {
        this.curr = '';
      },
    }
  }
</script>

<style lang="scss">
  .parkingLotDetails-mian {
    .Z-WMPie {
      height: 100%;
      width: 100%;
    }

    .parkin-li-number {
      font-size: 0.9rem;
      font-family: "PangMenZhengDao Regular";
      font-weight: 400;
      text-align: right;
      color: #fbcb0e;
    }

    .color0ff {
      color: #4d91b0;
    }

    .colorbule {
      color: #42b7f7;
    }

    .parkin-li-text {
      font-size: 0.8rem;
      font-family: "Microsoft YaHei Regular";
      font-weight: 400;
      text-align: left;
      color: #4d91b0;
    }

    .parkin-li-bg {
      padding: 0rem 0.6rem;
      height: 1.6rem;
      width: 10.1rem;
      line-height: 1.6rem;
      margin-bottom: 0.25rem;
      margin-right: 0.75rem;
      background: #082b45;
      display: flex;
      justify-content: space-between;
    }

    .matop {
      margin-top: 2rem;
    }

    .parkin-li {
      width: 11.45rem;
      height: 100%;
    }

    .parking-charmb {
      font-size: 1rem;
    }

    .parking-charnumber {
      font-size: 1.7rem;
      font-family: "PangMenZhengDao Regular";
      font-weight: 400;
      color: #fbcb0e;
    }

    .parking-chartext {
      font-size: 0.8rem;
      font-family: "Microsoft YaHei Regular";
      font-weight: 400;
      color: #4d91b0;
    }

    .echar-box {
      width: 9.45rem;
      height: 100%;
      position: relative;
    }

    .parking-centenbox {
      height: 9rem;
      width: 100%;
      display: flex;
    }

    .parking-title {
      margin: 0rem 1.05rem 0rem 0.5rem;
      position: relative;
      display: flex;
      align-items: center;

      &:before {
        content: "";
        width: 0.2rem;
        height: 0.85rem;
        background: #75cbf2;
        border-radius: 2px;
      }

      span {
        font-size: 0.9rem;
        font-family: "Microsoft YaHei Regular";
        font-weight: bold;
        text-align: left;
        color: #75cbf2;
        margin-left: 0.25rem;
      }
    }

    .parking-box {
      width: 20.9rem;
      height: 11rem;
      background-color: #002037;
      margin: 0 auto;
      margin-bottom: 0.5rem;
    }

    .el-dialog {
      width: 22.95rem;
    }

    .h-mini-dialog .el-dialog__body {
      min-height: 22.5rem;
      max-height: 32rem;
      overflow-y: auto;
      background: #001525 !important;
      padding: 0.5rem !important;
    }
  }
</style>
