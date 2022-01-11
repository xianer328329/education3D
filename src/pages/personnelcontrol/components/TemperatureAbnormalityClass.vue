<template>
  <div class="TemperatureAbnormalityClass">
    <h4 class="mdTitle">体温异常班级 <span class="mdTitle-right" @click="showdetail(null,1)">更多</span></h4>
    <div class="temper-box backboxContainer">
      <div class="temper-ul">
        <div class="temper-li" @click="showdetail(item,2)" v-for="item in clList" :key='item.staffClass'>
          <span class="temper-text">{{item.staffClass}}</span>
          <div class="fr Z-numberf temper-number">{{item.count}} <small>人</small></div>
        </div>
      </div>
      <div class="temper-echatr">
        <div class="temer-title">体温异常趋势</div>
        <div id="temperechart"></div>
      </div>
    </div>
    <Details-Of-Temperature ref="DetailsOfTemperatureref"></Details-Of-Temperature>
  </div>
</template>

<script>
  import DetailsOfTemperature from './DetailsOfTemperature.vue' //体温异常班级详情
  export default {
    name: 'TemperatureAbnormalityClass',
    components: {
      DetailsOfTemperature, //体温异常班级详情
    },
    data() {
      return {
        dayList: [],
        tempertime: null,
        barJson: {
          name: '最近30天',
          color: ['#00fffc'],
          grid: {
            left: 10,
            right: 10,
            bottom: 0,
            top: 0,
            containLabel: true
          },
          splitNumber: 3,
          size: 0.7 * fontSize,
        },
        clList: [],
        sdate: '',
        edate: '',
      }
    },
    mounted() {
      this.getdata();
      this.gettempExTrend();
    },
    methods: {
      showdetail(item, type) {
        if (type == 2) {
          item.sdate = this.sdate;
          item.edate = this.edate;
        }
        this.$refs.DetailsOfTemperatureref.init(item, type);
      },
      getdata(sdate, edate) {
        if (!sdate && !edate) {
          var sdate = new Date();
          sdate.setHours(0, 0, 0)
          sdate = this.formatDate(sdate, 'yyyy-MM-dd hh:mm:ss')
          var edate = new Date();
          edate.setHours(23, 59, 59);
          edate = this.formatDate(edate, 'yyyy-MM-dd hh:mm:ss')
        }
        this.sdate = sdate;
        this.edate = edate;
        this.$axios.post('/traffic/people/tempExClass', {
          "limitCount": 3,
          "startTime": sdate,
          "endTime": edate,
        }).then(res => {
          let data = res.rows || [];
          this.clList = data;
        })

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
      gettempExTrend() {
        this.$axios.post('/traffic/people/tempExTrend', {}).then(res => {
          var data = res;
          var dataX = [];
          var barData = [];
          for (var k in data) {
            data[k] = data[k] == null ? '0' : data[k];
            dataX.push(k);
            barData.push(data[k]);
          }
          //					var daydate = this.getday();
          //					this.barJson.dataX = this.FormData(daydate);
          this.barJson.dataX = dataX;
          this.barJson.barData = barData;
          this.initechart();
        })
      },
      initechart() {
        var vm = this;
        var barJson = vm.barJson;
        this.$nextTick(function() {
          var myChart = echarts.init(document.getElementById('temperechart'));
          myChart.setOption(vm.initeoption(barJson), true);
          myChart.resize();
          allCharts.push(myChart);

          myChart.on('click', function(params) {
            let ky = params.name.split('-');
            var date = new Date();
            date.setMonth(ky[0] - 1)
            date.setDate(ky[1])
            date.setHours(0, 0, 0)

            var date2 = new Date();
            date2.setMonth(ky[0] - 1)
            date2.setDate(ky[1])
            date2.setHours(23, 59, 59)

            var sdate = vm.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            var edate = vm.formatDate(date2, 'yyyy-MM-dd hh:mm:ss');
            vm.getdata(sdate, edate);
          })


          var index = 0; //播放所在下标
          clearInterval(vm.tempertime);
          vm.tempertime = setInterval(function() {
            myChart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: index
            });
            index++;
            if (index > barJson.dataX.length - 1) {
              index = 0;
            }
          }, 3000);
        })
      },
      initeoption(barJson) {
        var option = {
          animationEasing: 'SinusoidalIn',
          animationDuration: 10000,
          grid: {
            left: 0,
            right: 10,
            bottom: 5,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{c0}人',
            backgroundColor: '#0A3F5E',
            borderColor: '#00D1D5',
            borderWidth: 1,
            position: function(point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0], '5%'];
            },
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                backgroundColor: '#333'
              }
            }
          },
          xAxis: {
            type: 'category',
            data: barJson.dataX,
            axisTick: false,
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              rotate: 0,
              textStyle: textStyleC,
              formatter: function(params) {
                let ky = params.split('-');
                return ky[1];
              },
            },
            axisLine: axisLineC,
          },
          yAxis: [{
            type: 'value',
            minInterval: 1,
            splitNumber: barJson.splitNumber || 5,
            splitLine: {
              show: false,
            },
            axisLine: axisLineC,
            axisLabel: {
              show: true,
              textStyle: textStyleC,
              formatter: function(e) {
                return Math.abs(e);
              }
            },
            axisTick: {
              show: false,
            }

          }],
          series: [{
            name: '异常',
            type: 'bar',
            stack: '体温',
            barMaxWidth: 8,
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: '#0087C4',
              }
            },
            emphasis: {
              itemStyle: {
                color: '#00FFFF',
              },
            },
            data: barJson.barData
          }]
        };
        return option;

      },
      FormData(dateList) {
        var datas = [];
        dateList.forEach((item) => {
          var day = null;
          if (item) {
            var daylist = item.split('-');
            day = daylist[daylist.length - 1]
          }
          datas.push(day);
        })
        return datas
      },
      getday() {
        //获取最近30天
        var lastMonth = [];
        for (var i = 0; i < 30; i++) {
          var data = new Date(new Date().setDate(new Date().getDate() - i))
          var Month = data.getMonth() + 1;
          Month = Month < 10 ? "0" + Month : Month;
          var day = data.getDate();
          day = day < 10 ? "0" + day : day;
          lastMonth.push(data.getFullYear() + '-' + Month + '-' + day)
        }
        return lastMonth;
      },
    },
  }
</script>

<style lang="scss">
  .TemperatureAbnormalityClass {
    height: 100%;

    .temer-title {
      font-size: 0.6rem;
      font-family: "Adobe Heiti Std R";
      font-weight: normal;
      position: absolute;
      color: rgba(117, 203, 242, 1);
    }

    #temperechart {
      height: 100%;
      width: 100%;
      position: relative;
      z-index: 3;
    }

    .temper-echatr {
      width: 100%;
      margin-top: 0.5rem;
      flex: 1;
    }

    .temper-number {
      height: 100%;
      line-height: 2.5rem;
      font-size: 1.1rem;
      font-weight: 500;
      color: rgba(255, 204, 0, 1);
    }

    .temper-li small {
      font-size: 0.6rem;
      color: #75cbf2;
      margin-right: 0.2rem;
    }

    .temper-text {
      font-size: 0.8rem;
      font-weight: 400;
      color: rgba(117, 203, 242, 1);
      margin-left: 1%;
    }

    .temper-li {
      width: 100%;
      height: 2.1rem;
      line-height: 2.1rem;
      background: rgba(10, 63, 94, 1);
      border: 1px solid rgba(10, 80, 122, 1);
      cursor: pointer;
      margin-top: 1%;
    }

    .temper-ul {
      height: 7.5rem;
      width: 100%;
    }

    .temper-box {
      display: flex;
      flex-direction: column;
    }

    .mdTitle-right {
      text-align: center;
      width: 12%;
      border: 1px solid rgba(255, 255, 255, 1);
      opacity: 0.5;
      border-radius: 1px;
      color: rgba(254, 254, 254, 1);
      float: right;
      cursor: pointer
    }
  }
</style>
