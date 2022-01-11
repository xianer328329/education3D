<template>
  <div class="AlarmButtom-mian clearFix">
    <div class="buttom-box">
      <div class="title-box proportion">
        <span>报警占比</span>
        <div class="atrend-title fr">
          <a @click="operate(2)" class="atrem-boderf" :class="{'active':curr==2}">预警</a>
          <a @click="operate(1)" class="atrem-boderr" :class="{'active':curr==1}">报警</a>
        </div>
      </div>
      <div id="proporecharts" class="bar-box"></div>
    </div>
    <div class="buttom-box ">
      <div class="title-box ranking">
        <span>楼宇报警排行</span>
      </div>
      <div id="rankbar" class="bar-box"></div>
    </div>
    <div class="buttom-box">
      <div class="title-box devicerank">
        <span>设备报警排行</span>
      </div>
      <div id="devicerankeh" class="bar-box"></div>
    </div>
    <div class="date-box">
      <div class="date-c">
        <a v-for="(item,index) in dates" :key="index" :class="{'dot':item==12}">
          <img :src="require('../../../../static/images/login/'+item+'.png')" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AlarmButtom',
    data() {
      return {
        curr: 1,
        dateTime: '',
        dates: [],
        timer: '',
        dateList: [],
      }
    },
    mounted() {
      this.getdata();
    },
    methods: {
      operate(curr) {
        this.curr = curr;
        this.getdata();
      },
      getdata() {
        let vm = this;
        this.$axios.post('/elec/safety/apropAndSort', {
          "alarmClass": this.curr,
          "monthNum": 6,
          "sortNum": 10
        }).then((res) => {
          var propList = res.propList || [];
          var sortBuildList = res.sortBuildList || [];
          var sortDeviceList = res.sortDeviceList || [];
          let plist = vm.firterdata(propList);
          let slist = vm.firterdata(sortBuildList, 1);
          let dlist = vm.firterdata(sortDeviceList);
          let len = slist.length;
          var i = 0;
          vm.timer = setInterval(function() {
            if (i == len) {
              i = 0;
            }

            vm.dates = vm.dateList[i];
            vm.propList = plist.length == 0 ? [] : plist[i].child;
            vm.sortBuildList = slist.length == 0 ? [] : slist[i].child;
            vm.sortDeviceList = dlist.length == 0 ? [] : dlist[i].child;
            vm.initecharts();
            i++
          }, 5000);
          vm.dates = vm.dateList[0];
          vm.propList = plist.length == 0 ? [] : plist[0].child;
          vm.sortBuildList = slist.length == 0 ? [] : slist[0].child;
          vm.sortDeviceList = dlist.length == 0 ? [] : dlist[0].child;
          vm.initecharts();
          i += 1
        })
      },
      firterdata(data, type) { // 将数据按月分
        let vm = this;
        let dataInfo = {};
        let dates = [];
        data.forEach((item, index) => {
          let { alarmTime } = item;
          if (!dataInfo[alarmTime]) {
            dataInfo[alarmTime] = {
              alarmTime,
              child: []
            }
          }
          dataInfo[alarmTime].child.push(item);
          dataInfo[alarmTime].child.sort(function(a, b) { // 排序
            return a.alarmTotal - b.alarmTotal;
          })
        });
        var list = Object.values(dataInfo) || [];
        if (type == 1) {
          list.forEach((item) => {
            var arr = item.alarmTime.split('-');
            vm.dateList.push(arr[0].split('').concat([12]).concat(arr[1].split('')))
          })
        }
        return list;
      },
      initecharts() {
        let vm = this;
        var list = this.propList;
        var nameList = [];
        list.forEach((item) => {
          item.value = item.alarmTotal;
          item.name = item.alarmType;
          nameList.push(item.alarmType);
        })
        var myPie = echarts.init(document.getElementById('proporecharts'));
        myPie.setOption(vm.pieOptions(nameList, list), true);
        myPie.resize();
        allCharts.push(myPie);

        var sortBuildList = this.sortBuildList;
        var BuildName = [];
        var DataList = [];
        sortBuildList.forEach((item) => {
          BuildName.push(item.deviceBuild)
          DataList.push(item.alarmTotal)
        })
        if (BuildName.length < 5) {
          for (let i = BuildName.length; i < 5; i++) {
            BuildName.unshift('');
            DataList.unshift('');
          }
        }
        var myrankbar = echarts.init(document.getElementById('rankbar'));
        myrankbar.setOption(vm.barOptions(BuildName, DataList), true);
        myrankbar.resize();
        allCharts.push(myrankbar);

        var sortDeviceList = this.sortDeviceList;
        var DeviceName = [];
        var DeviceList = [];
        sortDeviceList.forEach((item) => {
          DeviceName.push(item.deviceName)
          DeviceList.push(item.alarmTotal)
        })
        if (DeviceName.length < 5) {
          for (let i = DeviceName.length; i < 5; i++) {
            DeviceName.unshift('');
            DeviceList.unshift('');
          }
        }
        var mydevice = echarts.init(document.getElementById('devicerankeh'));
        mydevice.setOption(vm.barOptions(DeviceName, DeviceList), true);
        mydevice.resize();
        allCharts.push(mydevice);
      },
      barOptions(nameList, dataList) {
        var option = {
          tooltip: {
            show: false,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '1%',
            left: '3%',
            right: '15%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            show: false,
            type: 'value',
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#4d91b0'
              },
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: nameList,
          },
          series: [{
            name: '2012年',
            type: 'bar',
            barWidth: '7',
            itemStyle: {
              normal: {
                color: '#82ecfd',
                barBorderRadius: 30,
                label: {
                  show: true, //开启显示
                  position: 'right', //在上方显示
                  textStyle: { //数值样式
                    color: '#4d91b0',
                    fontSize: (16 / 20) * 16
                  }
                }
              }
            },
            data: dataList,
          }]
        };
        return option;
      },
      pieOptions(nameList, list) {
        var options = {
          color: ['#7159e8', '#6674d1', '#c5e2f1', '#7bb8df', '#313964', '#007ace', '#03679c', '#03457d', '#202e78'],
          tooltip: {
            trigger: 'item',
            textStyle: {
              color: '#82ECFD',
              fontFamily: 'DIN Medium',
              fontSize: (16 / 20) * 16,
            },
            borderWidth: 1,
            borderColor: '#0b6189',
            backgroundColor: '#0b3a5e',
            formatter: function(params) {
              return params.name + '</br>' + params.value + '&nbsp;&nbsp;&nbsp;' + params.percent + '%';
            },
          },
          legend: {
            orient: 'vertical',
            top: '15',
            right: '35',
            itemHeight: 9,
            itemWidth: 18,
            icon: 'orient',
            symbolKeepAspect: false,
            textStyle: {
              color: '#4d91b0',
              fontWeight: '400',
              fontFamily: 'Microsoft YaHei',
              fontSize: (16 / 20) * 16
            },
            formatter: function(val) {
              var strs = val.split(''); //字符串数组
              var str = ''
              for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
                str += s;
                if (!(i % 6)) str += '\n'; //按需要求余
              }
              return str
            },
            data: nameList,
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            // roseType:'area',
            radius: ['55%', '75%'],
            center: ['28%', '50%'], //图的位置，距离左跟上的位置
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: list,
          }]
        };
        return options;
      },
      getTime() {
        var oDate = new Date();
        var oYea = oDate.getFullYear();
        var mon = oDate.getMonth() + 1;
        var arry = new Array();
        for (var i = 0; i < 6; i++) {
          mon = mon - 1;
          if (mon <= 0) {
            year = year - 1;
            mon = mon + 12;
          }
          if (mon < 10) {
            mon = "0" + mon;
          }
          oYea = oYea.toString();
          // let date = oYea.split('').concat([12]).concat(mon.split(''));
          arry[i] = oYea + "-" + mon;
        }
        return arry;
      },
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style lang="scss">
  .AlarmButtom-mian {
    .date-box {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      padding: 0.3rem;
      background: url(../../../assets/icon/icon-datebg.png) no-repeat center;
      background-size: 100% 100%;

      img {
        display: inline-block;
        vertical-align: middle;
      }

      .date-c {
        a {
          img {
            width: 0.9rem;
          }

          &.dot {
            img {
              width: 1rem;
              padding: 0px 0.25rem;
              vertical-align: bottom;
            }
          }
        }
      }
    }

    .bar-box {
      height: 90%;
      width: 100%;
    }

    .atrend-title {
      position: absolute;
      top: 0rem;
      right: 2rem;
      cursor: pointer;
      display: table;
      word-spacing: -1em;
    }

    .atrem-boderr {
      border-top-right-radius: 11px;
      border-bottom-right-radius: 11px;
    }

    .atrem-boderf {
      border-top-left-radius: 11px;
      border-bottom-left-radius: 11px;
    }

    .atrend-title a {
      background: #001423;
      padding: 0rem 0.5rem;
      font-size: 0.7rem;
      border: 1px solid #194a5d;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #74c1e5;
      letter-spacing: 0.05rem;
    }

    .active {
      background: #194A5D !important;
      color: #7be1f2 !important;
    }

    .title-box {
      font-size: 0.9rem;
      position: relative;
    }

    .title-box span {
      padding-left: 1.5rem;
    }

    .proportion span {
      background: url(../../../assets/icon/icon-security.png) no-repeat left;
      background-size: 1.1rem 1.1rem;
    }

    .ranking {
      background: url(../../../assets/icon/icon-ranking.png) no-repeat left;
      background-size: 1.1rem 1.1rem;
    }

    .devicerank {
      background: url(../../../assets/icon/icon-devicerank.png) no-repeat left;
      background-size: 1.1rem 1.1rem;
    }

    .buttom-box {
      float: left;
      width: 33.333%;
      height: 100%;
      font-size: 0.9rem;
      font-family: "Microsoft YaHei Regular, Microsoft YaHei Regular-Regular";
      font-weight: 400;
      color: #74c1e5;
    }
  }
</style>
