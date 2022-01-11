<template>
  <div class="AlarmTrend-mian ">
    <h4 class="boxtitle">报警趋势</h4>
    <div class="atrend-title">
      <a @click="operate(1)" class="atrem-boderf" :class="{'active':curr==1}">最近30天</a>
      <a @click="operate(2)" class="atrem-boderr" :class="{'active':curr==2}">最近12个月</a>
    </div>
    <div id="TrendChar"></div>
  </div>
</template>

<script>
  export default {
    name: 'AlarmTrend',
    data() {
      return {
        curr: 2,
        dataMonth: [],
        dataYear: [],
      }
    },
    mounted() {

      this.getdata();
    },
    methods: {
      operate(curr) {
        this.curr = curr;
        var data = [];
        if (curr == 2) {
          data = this.dataYear;
        } else {
          data = this.dataMonth;
        }
        this.initecharts(data);
      },
      getdata() {
        this.$axios.post('/elec/safety/aselectalarmtrend', {}).then(res => {
          var dataYear = res.year || [];
          var dataMonth = res.month || [];
          this.dataYear = dataYear;
          this.dataMonth = dataMonth;
          this.operate(2);
        })
      },
      initecharts(data) {
        let vm = this;
        var xdata = [];
        var ydata = [];
        var date = this.getmoth();
        if (vm.curr == 2) {
          date.motharr.forEach((item) => {
            var num = 0;
            data.forEach((it) => {
              if (item == it.MONTH) {
                num = it.num;
              }
            })
            xdata.push(item);
            ydata.push(num);
          })
        } else {
          date.dayarr.forEach((item) => {
            var num = 0;
            data.forEach((it) => {
              if (item == it.time) {
                num = it.num;
              }
            })
            xdata.push(item);
            ydata.push(num)
          })
        }
        var option = {
          tooltip: {
            trigger: 'axis',
            textStyle: {
              color: '#82ECFD',
              fontFamily: 'DIN Medium',
              fontSize: (16 / 20) * 16,
            },
            borderWidth: 1,
            borderColor: '#0b6189',
            backgroundColor: '#0b3a5e',
            formatter: function(params) {
              // console.log(params)
              return params[0].value;
            },
          },
          grid: {
            left: '10',
            top: '10',
            right: '10',
            bottom: '40',
            containLabel: false
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xdata,
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#4D91B0',
                fontSize: (14 / 20) * 14,
              },
              formatter: function(params) {
                var arr = params.split('-');
                if (vm.curr == 2) {
                  return arr[1]+'月';
                } else {
                  return arr[2]
                }
                return params;
              },
            },
            axisLine: {
              lineStyle: {
                color: '#164254'
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            show: false,
            type: 'value'
          },
          series: [{
            data: ydata,
            type: 'line',
            smooth: "1",
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#72d2e4',
                lineStyle: {
                  color: "#72d2e4",
                  width: 1
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(98, 183,200, 0.3)'
                  }, {
                    offset: 0.5,
                    color: 'rgba(98, 183,200, 0.5)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(98, 183,200, 0.8)'
                  }, {
                    offset: 1,
                    color: 'rgba(98, 183,200, 1)'
                  }]),
                }
              }
            },
          }]
        };
        var myCharts = echarts.init(document.getElementById('TrendChar'));
        myCharts.setOption(option, true);
        myCharts.resize();
        allCharts.push(myCharts);
      },

      getmoth() {
        var dataArr = [];
        var data = new Date();
        var year = data.getFullYear();
        data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
        for (var i = 0; i < 12; i++) {
          data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
          var m = data.getMonth() + 1;
          m = m >= 10 ? m : '0' + m;
          dataArr.push(data.getFullYear() + '-' + m)
        }
        var thrityMonth = [];
        for (var i = 0; i < 30; i++) {
          var date = new Date(new Date().setDate(new Date().getDate() - i))
          var m = date.getMonth() + 1;
          m = m >=10 ? m : '0' + m;
          var d = date.getDate();
          d = d >= 10 ? d : '0' + d;
          thrityMonth.push(date.getFullYear() + '-' + m + '-' + d)
        }
        return {
          motharr: dataArr.reverse(),
          dayarr: thrityMonth.reverse(),
        }
      },
    }
  }
</script>

<style lang="scss">
  .AlarmTrend-mian {
    .boxtitle {
      font-size: 0.8rem;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #75c2e5;
    }

    .atrend-title {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
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
      display: inline-block;
      background: #001423;
      padding: 0.15rem 0.5rem;
      font-size: 0.7rem;
      border: 1px solid #194a5d;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #4d91b0;
      letter-spacing: 0.05rem;
    }

    .active {
      background: #194A5D !important;
      color: #7be1f2 !important;
    }

    #TrendChar {
      height: 100%;
      width: 100%;
    }
  }
</style>
