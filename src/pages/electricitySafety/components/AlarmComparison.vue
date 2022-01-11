<template>
  <div class="AlarmComparison-mian">
    <h4 class="boxtitle">报警同比</h4>
    <div class="acomparison-title">
      <span class="aclegend-box boxtitle aclegend-box-left">本期</span>
      <span class="aclegend-box boxtitle aclegend-box-right">上期</span>
    </div>
    <div id="comcharts"></div>
  </div>
</template>

<script>
  export default {
    name: 'AlarmComparison',
    data() {
      return {

      }
    },
    mounted() {
      this.getdata();
    },
    methods: {
      getdata() {
        let vm = this;
        this.$axios.post('/elec/safety/aSelectAlarmCompare', {}).then(res => {
          var lastYear = res.lastYear || [];
          var beforeYear = res.beforeYear || [];
          var lastlist = [];
          var beforeList = [];
          var dataList = [];
          var dateTime = {};
          dateTime = vm.getmoth();
          dateTime.dataArr.forEach((item) => {
            var num = 0;
            lastYear.forEach((it) => {
              if (item == it.MONTH) {
                num = it.num;
              }
            })
            lastlist.push(num)
            dataList.push(item)
          })
          dateTime.beforeArr.forEach((item) => {
            var num = 0
            beforeYear.forEach((it) => {
              if (item == it.MONTH) {
                num = itm.num;
              }
            })
            beforeList.push(num);
          })
          vm.initechatrs(dataList, lastlist, beforeList);
        })
      },
      initechatrs(dataList, data1, data2) {
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
              return params[0].value + '/' + params[1].value
            },
            position: function(point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0], '10%'];
            },
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '20',
            top: '20',
            right: '20',
            bottom: '40',
            containLabel: false
          },
          legend: {
            show: false,
            data: ['本期', '上期'],
            right: 0,
            top: 0,
            // icon: 'rect',
            itemheight: 6,
            itemWidth: 20,
            textStyle: {
              color: '#4d91b0',
            },
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: dataList,
            axisLabel: {
              interval: 0,
              formatter: function(params) {
                var arr = params.split('-');
                var moth = arr[1] > 10 ? arr[1] : parseInt(arr[1]);
                return moth + '月'
              },
              textStyle: {
                color: '#4D91B0',
                fontSize: (14 / 20) * 14,
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
          }],
          yAxis: [{
            show: false,
            type: 'value'
          }],
          series: [{
              name: '本期',
              type: 'bar',
              barGap: 0,
              barWidth: '8',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 1,
                  color: 'rgba(130,236,253,1)'
                }, {
                  offset: 0.8,
                  color: 'rgba(130,236,253, 0.8)'
                }, {
                  offset: 0.5,
                  color: 'rgba(130,236,253, 0.5)'
                }, {
                  offset: 0,
                  color: 'rgba(130,236,253, 0.3)'
                }]),
              },
              data: data1
            },
            {
              name: '上期',
              type: 'bar',
              barWidth: '8',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 1,
                  color: 'rgba(54,121,152,1)'
                }, {
                  offset: 0.8,
                  color: 'rgba(54,121,152, 0.8)'
                }, {
                  offset: 0.5,
                  color: 'rgba(66,129,158,0.5)'
                }, {
                  offset: 0,
                  color: 'rgba(66,129,158,0.3)'
                }]),
              },
              data: data2
            }
          ]
        };
        var myCharts = echarts.init(document.getElementById('comcharts'));
        myCharts.setOption(option, true);
        myCharts.resize();
        allCharts.push(myCharts);
      },
      getmoth() {
        var dataArr = [];
        var beforeArr = [];
        var data = new Date();
        var year = data.getFullYear();
        data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
        for (var i = 0; i < 24; i++) {
          data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
          var m = data.getMonth() + 1;
          m = m >= 10 ? m : '0' + m;
          if (i < 12) {
            dataArr.unshift(data.getFullYear() + '-' + m)
          } else {
            beforeArr.unshift(data.getFullYear() + '-' + m)
          }
        }
        let obj = {};
        obj.beforeArr = beforeArr;
        obj.dataArr = dataArr;
        return obj;
      },
    },

  }
</script>

<style lang="scss">
  .AlarmComparison-mian {
    .boxtitle {
      font-size: 0.8rem;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #75c2e5;
    }

    #comcharts {
      height: 100%;
      width: 100%;
    }

    .aclegend-box {
      display: inline-block;
      position: relative;
      margin-right: 0.5rem;
    }

    .aclegend-box-left {
      margin-right: 1rem;
    }

    .aclegend-box {
      font-size: 0.7rem;
    }

    .aclegend-box:before {
      content: '';
      height: 0.45rem;
      width: 0.9rem;
      background: rgba(130, 236, 253, 1);
      display: inline-block;
      margin-right: 0.3rem;
      line-height: 0.45rem;
    }

    .aclegend-box-right:before {
      background: rgba(54, 121, 152, 1);
    }

    .acomparison-title {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
    }
  }
</style>
