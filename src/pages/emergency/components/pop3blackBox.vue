<template>
  <div>
    <!--黑箱详情弹窗-->
    <el-dialog class="blackbox-modal" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="460px" center>
      <ul>
        <li>
          <p>{{boxInfo.deviPowe?(boxInfo.deviPowe==0?'无':'有'):'--'}}</p>
          <span>市电供电</span>
        </li>
        <li :class="{'error':boxInfo.deviGate==1}">
          <p>{{boxInfo.deviGate==1?'开':(boxInfo.deviGate==0?'关闭':'--')}}</p>
          <span>电子门锁</span>
        </li>
        <li>
          <p>{{boxInfo.deviElec?boxInfo.deviElec+'A':'--'}}</p>
          <span>电流</span>
        </li>
        <li>
          <p>{{boxInfo.deviVolt?boxInfo.deviVolt+'V':'--'}}</p>
          <span>电压</span>
        </li>
        <li :class="{'error':boxInfo.deviSmok==1}">
          <p>{{boxInfo.deviSmok==1?'有':(boxInfo.deviSmok==0?'无':'--')}}</p>
          <span>烟感</span>
        </li>
        <li :class="{'error':boxInfo.deviWate==1}">
          <p>{{boxInfo.deviWate==1?'有':(boxInfo.deviWate==0?'无':'--')}}</p>
          <span>水浸</span>
        </li>
        <li>
          <p>{{boxInfo.deviTemp?boxInfo.deviTemp+'%':'--'}}</p>
          <span>湿度</span>
        </li>
        <li>
          <p>{{boxInfo.deviHumi?boxInfo.deviHumi+'°C':'--'}}</p>
          <span>温度</span>
        </li>
      </ul>
      <div class="chart-c">
        <div class="chart1" ref="chart1">

        </div>
        <div class="chart2" ref="chart2">

        </div>
      </div>

      <div class="btn-c">
        <a class="btn blue">总容量 {{boxInfo.deviSize||0}}U</a>
        <a class="btn green">在线 {{boxInfo.exchangeOnline||0}}U</a>
        <a class="btn yellow">异常 {{boxInfo.exchangeExcept||0}}U</a>
      </div>
    </el-dialog>


    <!--黑箱建筑物地图弹窗-->
    <div style="display:none">
      <div class="blackBoxBuildPop-c" ref="pop" v-if="build.buildInfo">
        <div class="blackBoxBuildPop">
          <h1>{{build.buildInfo.buildname}}</h1>
          <img class="closeBtn closeBuild" src="../../../../static/images/Zgb.png" alt="" />
          <div class="content">
            <div class="fl section">
              <img src="../../../../static/images/blackbox/blackbox.png" />
              <span>网管工作站</span>
              <b>{{build.buildInfo.countTotal}}</b>
            </div>
            <div class="fr section">
              <img src="../../../../static/images/blackbox/switch.png" />
              <span>在线交换机</span>
              <b>{{build.buildInfo.countTotalOnline}}</b>
            </div>
            <ul>
              <li>
                <div class="box-c">
                  <span>12U</span><i>:</i><b>{{build.buildInfo.count12Total}}</b>
                </div>
                <div class="barList">
                  <div class="listTitle">
                    <div class="fr">
                      <span><i class="normal"></i><b>正常</b></span>
                      <span><i class="fault"></i><b>异常</b></span>
                      <!--<img src="../../../../static/images/Zgb.png" @click="closePop"/>-->
                    </div>
                    <h2>网管工作站列表</h2>
                  </div>

                  <div class="scroll-c">
                    <div class="bar-c fl">
                      <p v-for="item in build.floor12List" :title="item.fname" :key="item.fname">{{item.fname}}</p>
                    </div>
                    <div class="bar-c">
                      <div class="barBg" v-for="item in build.floor12List" :key="item.fname">
                        <div class="bar normal" :style="{width:(max[0]>0?(item.normalCount/max[0]*100):0)+'%'}">{{item.normalCount}}</div>
                        <div class="bar fault" :style="{width:(max[0]>0?(item.countTotalExcept/max[0]*100):0)+'%'}">{{item.countTotalExcept}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="box-c">
                  <span>24U</span><i>:</i><b>{{build.buildInfo.count24Total}}</b>
                </div>
                <div class="barList">
                  <div class="listTitle">
                    <div class="fr">
                      <span><i class="normal"></i><b>正常</b></span>
                      <span><i class="fault"></i><b>异常</b></span>
                    </div>
                    <h2>网管工作站列表</h2>
                  </div>

                  <div class="scroll-c">
                    <div class="bar-c fl">
                      <p v-for="item in build.floor24List" :title="item.fname" :key="item.fname">{{item.fname}}</p>
                    </div>
                    <div class="bar-c">
                      <div class="barBg" v-for="item in build.floor24List" :key="item.fname">
                        <div class="bar normal" :style="{width:(max[1]>0?(item.normalCount/max[1]*100):0)+'%'}">{{item.normalCount}}</div>
                        <div class="bar fault" :style="{width:(max[1]>0?(item.countTotalExcept/max[1]*100):0)+'%'}">{{item.countTotalExcept}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="box-c">
                  <span>48U</span><i>:</i><b>{{build.buildInfo.count48Total}}</b>
                </div>
                <div class="barList">
                  <div class="listTitle">
                    <div class="fr">
                      <span><i class="normal"></i><b>正常</b></span>
                      <span><i class="fault"></i><b>异常</b></span>
                      <!--<img src="../../../../static/images/Zgb.png" @click="closePop"/>-->
                    </div>
                    <h2>网管工作站列表</h2>
                  </div>

                  <div class="scroll-c">
                    <div class="bar-c fl">
                      <p v-for="item in build.floor48List" :title="item.fname" :key="item.fname">{{item.fname}}</p>
                    </div>
                    <div class="bar-c">
                      <div class="barBg" v-for="item in build.floor48List" :key="item.fname">
                        <div class="bar normal" :style="{width:(max[2]>0?(item.normalCount/max[2]*100):0)+'%'}">{{item.normalCount}}</div>
                        <div class="bar fault" :style="{width:(max[2]>0?(item.countTotalExcept/max[2]*100):0)+'%'}">{{item.countTotalExcept}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--黑箱列表地图弹窗-->
    <div style="display:none">
      <div class="blackBoxBuildPop blackBoxPop" ref="boxs">
        <h1>{{build.buildName}}</h1>
        <img class="closeBtn closeBox" src="../../../../static/images/Zgb.png" alt="" />
        <div class="blackBoxPop-scroll">
          <el-table :data="boxs" stripe max-height="300" @row-click="showModal">
            <el-table-column prop="bboxName" label="名称" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="deviCode" label="编号" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="bboxFloor" label="楼层" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="bboxSize" label="容量" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.bboxSize+'U'}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //新告警
  //	{
  //		"code": 200,
  //		"mess": "请求成功",
  //		"data": {
  //			"code": "0",
  //			"mess": "获取新的告警信息成功！",
  //			"data": {
  //				"alarm": [{
  //					"similary": '--',,
  //					"oldpicUrl": '--',,
  //					"alarmTime": "2019-08-13 09:57:19",
  //					"latitude": "29.564668",
  //					"alarmTypeName": "离线报警",
  //					"devicePosition": "江-篮球场环道2",
  //					"deviceCode": "004403",
  //					"blackName": '--',,
  //					"uuid": "ctbu_3485685e77cb4f8f9e74785fa0db0ce5",
  //					"alarmDesc": "江-篮球场环道2设备离线",
  //					"picUrl": "",
  //					"alarmType": "2.1",
  //					"videoUrl": "",
  //					"hasHistory": "1",
  //					"subPlatForm": "1",
  //					"longitude": "106.53728"
  //				}]
  //			}
  //		}
  //	}
  export default {
    name: 'EmergencyPop3crt',
    data() {
      return {
        curr: '',
        build: {

        }, //当前建筑物
        boxs: [], //黑箱列表
        boxInfo: {

        }, //黑箱详情
        max: [0, 0, 0],
        infoWindow: null,
        infoWindowBox: null
      }
    },
    mounted: function() {
      var vm = this;
    },
    methods: {
      handleClickBuild(build, maxmap) { //点击建筑物
        var vm = this;
        var params = {
          buildUuid: build.uuid,
        }
        this.$axios.post('box/statistics/ebuildInfo', params).then(function(res) {
          var data = res || {};
          data.buildInfo.buildname = build.name;
          data.floor12List.forEach(item => {
            item.normalCount = item.countTotalOnline - item.countTotalExcept;
            var count = item.countTotalOnline * 1;
            if (count > vm.max[0]) {
              vm.max[0] = count
            }
          });
          data.floor24List.forEach(item => {
            item.normalCount = item.countTotalOnline - item.countTotalExcept;
            var count = item.countTotalOnline * 1;
            if (count > vm.max[1]) {
              vm.max[1] = count
            }
          });
          data.floor48List.forEach(item => {
            item.normalCount = item.countTotalOnline - item.countTotalExcept;
            var count = item.countTotalOnline * 1;
            if (count > vm.max[2]) {
              vm.max[2] = count
            }
          });
          vm.build = data;
          vm.$nextTick(function() {
            var content = vm.$refs.pop;
            vm.infoWindow = new AMap.InfoWindow({
              isCustom: true, //使用自定义窗体
              autoMove: true,
              closeWhenClickMap: true,
              content: content,
              anchor: 'top-left',
              offset: new AMap.Pixel(0, 39)
            });
            vm.infoWindow.open(maxmap, [build.lng, build.lat]);
            $('#container').on('click', '.closeBuild', function() {
              $('#container .buildingsBtn p').removeClass('active')
              vm.infoWindow.close();
            })
            $('#container').on('mousewheel DOMMouseScroll', '.barList', function(e) {
              e.stopPropagation();
            });

          })
        })
      },
      closeInfoWindow() {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
        if (this.infoWindowBox) {
          this.infoWindowBox.close()
        }
      },
      handleClickBox(build, maxmap) { //点击黑箱
        var vm = this;
        vm.build = build;
        var params = {
          bboxBuild: build.instBuild,
          bboxName: "",
          currentPage: 1,
          deviCode: "",
          pageSize: 10000,
          unitUuid: UNITID,
        }
        this.$axios.post('/box/statistics/efindBox', params).then(function(res) {
          vm.boxs = res.data || [];
          vm.infoWindowBox = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            autoMove: false,
            // closeWhenClickMap:true,
            content: vm.$refs.boxs,
            anchor: 'top-left',
            offset: new AMap.Pixel(10, 10),
            map: oMaxmap,
            position: [build.lng, build.lat],
          });
          $('#container').on('click', '.closeBox', function() {
            vm.infoWindowBox.close();
          })
          $('#container').on('mousewheel DOMMouseScroll', '.blackBoxPop-scroll', function(e) {
            e.stopPropagation();
          });
        })
      },
      //初始化仪表盘
      initGauge(id, data) {
        var vm = this;
        if (vm.$refs[id]) {
          var chart = echarts.init(vm.$refs[id]);
          chart.setOption(vm.getOption(data));
        }

      },
      getOption(data) {
        return {
          min: 0,
          max: data.max,
          series: [{
            name: 'AQI',
            type: 'gauge',
            radius: '100%',
            startAngle: 245,
            endAngle: -65,
            axisLine: {
              show: true,
              lineStyle: {
                width: 10,
                color: [
                  [data.max > 0 ? (data.value / data.max) : 0, '#22B1D4'],
                  [1, '#1D3F65']
                ],
              }
            },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLabel: { show: false },
            pointer: { show: false },
            title: {
              offsetCenter: [0, '0%'],
              color: '#00FFFF',
              fontSize: data.big ? 1.8 * fontSize : 1.2 * fontSize,
            },
            detail: {
              formatter: function(e) {
                return data.label;
              },
              color: '#75CBF2',
              offsetCenter: [0, '32%'],
              fontSize: data.big ? fontSize : 0.8 * fontSize,
            },
            data: [{ value: data.value, name: data.value + '/' + data.max }]
          }]
        }
      },
      showModal(list) {
        var vm = this;
        this.curr = 1;
        vm.getBoxInfo(list);
      },
      getBoxInfo(list) {
        var vm = this;
        var params = {
          uuid: list.deviceUuid || list.uuid,
        }
        this.$axios.post('box/statistics/aqueryboxInfo', params).then(function(data) {
          vm.boxInfo = (data && data.exchangeOnline > 0) ? data : { deviSize: data.deviSize || 0, exchangeOnline: data.exchangeOnline || 0, exchangeExcept: data.exchangeExcept || 0 };
          vm.$nextTick(function() {
            var data = { value: vm.boxInfo.exchangeOnline || 0, label: '在线/总容量', big: true, max: vm.boxInfo.deviSize || 0 };
            vm.initGauge('chart1', data);
            var data = { value: vm.boxInfo.exchangeExcept || 0, label: '异常/在线', big: false, max: vm.boxInfo.exchangeOnline || 0 };
            vm.initGauge('chart2', data);
          });
        });
      },
      close() {
        this.curr = '';
      }
    },
  }
</script>
<style lang="scss">
  .h-infoBox {
    margin-left: 250px;
    z-index: 10;
  }

  .blackbox-modal {
    .el-dialog__header {
      padding: 0px;

      .el-dialog__headerbtn {
        top: 4px;
        right: 4px;
      }
    }

    ul {
      margin-left: -5px;
      font-size: 0px;

      li {
        display: inline-block;
        text-align: center;
        width: 95px;
        padding: 15px 0px;
        background: rgba(10, 63, 94, 1);
        border: 1px solid rgba(10, 80, 122, 1);
        margin-left: 10px;
        margin-bottom: 10px;

        &.error {
          background: #CC1010;

          * {
            color: white;
          }
        }

        p {
          color: #00FFFF;
          margin-bottom: 0.25rem;
          height: 1.2rem;
        }

        span {
          color: #75CBF2;
          font-size: 0.8rem;
        }
      }
    }

    .chart-c {
      margin: 1.5rem 0px;

      .chart1 {
        display: inline-block;
        width: 237px;
        height: 218px;
      }

      .chart2 {
        display: inline-block;
        width: 150px;
        height: 150px;
        margin-left: 20px;
      }
    }

    .btn-c {
      text-align: center;
      margin-left: -10px;
      margin-bottom: 20px;

      .btn {
        display: inline-block;
        font-size: 0.8rem;
        margin-left: 0.9rem;
        text-align: center;
        width: 6rem;
        line-height: 2rem;
        color: white;

        &.blue {
          background: #0A3F5E;
          color: #75CBF2;
        }

        &.green {
          background: #32C872;
        }

        &.yellow {
          background: #ED7703;
        }
      }
    }
  }
</style>
<style lang="scss" scoped="scoped">
  .blackBoxBuildPop-c {
    height: 21.5rem;
  }

  .blackBoxBuildPop {
    height: 11.5rem;
    color: #75CBF2;
    width: 25rem;
    background: #001525;
    text-align: center;
    position: relative;

    &.blackBoxPop {
      height: auto;

      h1 {
        background: transparent;
        text-align: left;
      }
    }

    h1 {
      line-height: 2.15rem;
      padding: 0px 1rem;
      font-size: 0.9rem;
      color: white;
      background: #001525;
      text-align: left;
    }

    .content {
      padding: 0.75rem;

      .section {
        margin-bottom: 1.25rem;

        * {
          display: inline-block;
          vertical-align: middle;
        }

        span {
          color: #75CBF2;
          font-size: 0.8rem;
        }

        b {
          margin-left: 1rem;
          color: #00FFFF;
        }
      }

      ul {
        font-size: 0px;
        text-align: center;
        clear: both;
        position: relative;

        * {
          vertical-align: top;
        }

        li {
          display: inline-block;
          margin-left: 0.5rem;
          width: 7.25rem;
          line-height: 1rem;
          height: 5.85rem;
          cursor: pointer;
          box-sizing: border-box;

          .box-c {
            padding: 1.75rem 0px;
            background: #0A3F5E;
            border-radius: 0.2rem;
            cursor: pointer;
            border: 1px solid #0A3F5E;
            box-sizing: border-box;
            position: relative;
          }

          &:hover {
            .box-c {
              background: #014674;
              border-color: #00FFFF;

              &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 100%;
                border: 0.5rem solid transparent;
                border-top-color: #014674;
                border-top-width: 0.9rem;
                margin-top: -0.1rem;
                transform: translateX(-50%);
              }

              &:before {
                content: '';
                position: absolute;
                left: 50%;
                top: 100%;
                border: 0.5rem solid transparent;
                border-top-color: #00FFFF;
                border-top-width: 0.9rem;
                transform: translateX(-50%);
              }
            }

            .barList {
              display: block;
            }
          }

          span {
            color: #75CBF2;
          }

          i {
            color: #75CBF2;
            margin: 0px 0.15rem;
          }

          b {
            color: #0ff;
          }
        }
      }

      .barList {
        width: 24rem;
        padding: 0.5rem 0.5rem 1rem;
        background: rgba(0, 32, 55, 1);
        border: 1px solid rgba(49, 133, 156, 1);
        position: absolute;
        top: 5.6rem;
        left: 0px;
        display: none;

        * {
          color: #75CBF2;
        }

        .normal {
          background: rgba(50, 200, 114, 1);
        }

        .fault {
          background: #ED7703;
        }

        .listTitle {
          margin-bottom: 0.4rem;

          h2 {
            overflow: hidden;
            text-align: left;
          }

          span {
            display: inline-block;
            margin-left: 1.25rem;
            vertical-align: middle;
          }

          i {
            display: inline-block;
            width: 0.3rem;
            height: 0.9rem;
            margin-right: 0.2rem;
            vertical-align: middle;
          }

          b {
            display: inline-block;
            vertical-align: middle;
          }

          img {
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.75rem;
            width: 1.25rem;
            cursor: pointer;
          }
        }

        .scroll-c {
          min-height: 1.6rem;
          max-height: 7.5rem;
          overflow: auto;
        }

        .bar-c {
          overflow: hidden;

          p {
            height: 1rem;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            text-align: right;
            padding-right: 0.5rem;
            max-width: 7.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .barBg {
            /*font-size: 0px;*/
            margin-top: 0.5rem;
            text-align: left;

            .bar {
              display: inline-block;
              height: 1rem;
              text-align: center;
              font-size: 0.8rem;
              color: white;
              line-height: 1rem;
            }
          }

        }
      }

    }
  }

  .arrow {
    position: absolute;
    left: 1rem;
    top: 50%;
    width: 2.55rem;
    height: 5.3rem;
    z-index: 6;
    transform: translate(0, -50%);
    cursor: pointer;
    opacity: 0;
    transition: all .2s linear;

    &.right {
      left: auto;
      right: 1rem;
    }
  }

  .el-button--warning {
    color: #fff;
    background-color: #ED7703;
    border-color: #ED7703;
  }

  .blackBoxBuildPop .closeBtn {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
  }
</style>
