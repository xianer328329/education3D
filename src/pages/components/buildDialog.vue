<template>
  <div style="display: none;">
    <div class="buildDialog" ref="buildDialogPopref">     
      <img class="closeBtn closeBuild" src="../../../static/images/Zgb.png" alt="" />
	  <img src="../../../static/images/temp.jpg" class="temp"><!--临时使用，initecharts方法临时被注释了 -->
			<!-- <h1 class="clearFix">{{build.name}}<span class="build-alarmtitle"><span class="build-alarm">监测线路<i class="h-number-text">{{buildAlarm.nodeNum}}</i></span></span></h1>
      <div class="build-alarmboom">
        <div class="build-bootm clearFix">
          <div class="build-basealarm">
            <p><span> <i class="h-number-text inumber">{{buildAlarm.todayAlarms}}</i></span><span>今日告警</span></span></p>
            <p><span> <i class="h-number-text inumber">{{buildAlarm.allUntreatedAlarms}}</i></span><span>累计未处理</span></span></p>
            <p><span> <i class="h-number-text inumber">{{buildAlarm.allAlarms}}</i></span><span>累计告警</span></span></p>
          </div>
          <div class="build-echarts" ref="buildechartsref"></div>
        </div>
        <p class="build-devicenum">
          <span>智能空开总数<i class="h-number-text inumber">{{buildAlarm.deviceNum}}</i></span>
          <span>在线<i class="h-number-text inumber">{{buildAlarm.onlineDeviceNum}}</i></span>
          <span>离线<i class="h-number-text inumber">{{buildAlarm.offlineDeviceNum}}</i></span> 
				</p> -->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        build: {},
        buildAlarm: {
          allAlarms:0,
          todayAlarms:0,
          allUntreatedAlarms:0,
          offlineDeviceNum:0,
          onlineDeviceNum:0,
          deviceNum:0,
          nodeNum:'--',
        },
        buildDevice:{},
        infoWindow: null,
      }
    },
    mounted() {

    },
    methods: {
      handleClickBuild(build, maxmap,markers) {
        let vm = this;
        this.build = build;
        this.$axios.post('/elec/safety/aselectbuildinfo', {
          "buildName": build.name
        }).then(res => {
          var buildAlarm = res.info || {};
          vm.buildAlarm = buildAlarm;


          var buildAlarmList = res.view || [];
          var buildDevice = res.buildDevice || {};
          vm.buildDevice = buildDevice;
          // this.initecharts(buildAlarmList);
          vm.$nextTick(function() {
            var content = vm.$refs.buildDialogPopref;
            vm.infoWindow = new AMap.InfoWindow({
              isCustom: true, //使用自定义窗体
              autoMove: true,
              // closeWhenClickMap: true,
              content: content,
              anchor: 'top-left',
			  map:maxmap,
              offset: new AMap.Pixel(0, 39),
			  position:[build.lng, build.lat]
            });
            $('#container').on('click', '.closeBuild', function() {
				  $('#container .buildingsBtn p').removeClass('active')
				  vm.infoWindow.close();
				  oMaxmap.remove(markers);
            })
            $('#container').on('mousewheel DOMMouseScroll', '.barList', function(e) {
              e.stopPropagation();
            });
          })
        })
      },
      initecharts(buildAlarmList) {
        let vm = this;
        var nameList = [];
        buildAlarmList.forEach((item) => {
          item.value = item.num;
          item.name = item.alarmType;
          nameList.push(item.alarmType);
        })
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
            right: '0',
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
            name: '',
            type: 'pie',
            // roseType:'area',
            radius: ['35%', '50%'],
            center: ['35%', '50%'], //图的位置，距离左跟上的位置
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
            data: buildAlarmList,
          }]
        };
        var myCharts = echarts.init(this.$refs.buildechartsref);
        myCharts.setOption(options, true);
        myCharts.resize();
        allCharts.push(myCharts);
        return options;

      },
      closeInfoWindow() {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
      },
    },
  }
</script>

<style lang="scss">
  
  .buildDialog {
    color: #75CBF2;
    width: 25rem;
    background: #001525;
    position: relative;

	.temp{
		width: 100%;
	}


    .build-devicenum {
      display: flex;
      justify-content: space-between;
    }

    .build-devicenum i {
      margin-left: 5px;
    }

    .build-devicenum span {
      display: block;
      font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
      font-weight: 400;
      color: #74c1e5;
      letter-spacing: 0.05rem;
    }

    .inumber {
      color: #00FFFF;
    }

    .build-basealarm span {
      display: block;
      text-align: center;
    }

    .build-basealarm p {
      padding: 0.5rem 0px;
    }

    .build-echarts {
      width: 11.5rem;
      height: 11.1rem;
      float: right;
    }

    .build-basealarm {
      float: left;
      width: 30%;
      height: 11.1rem;
      background: #112534;
    }

    .build-alarmboom {
      padding: 0.5rem;
    }

    .build-bootm {
      height: 11.25rem;
    }

    h1 {
      line-height: 2.1rem;
      padding: 0px 1rem;
      font-size: 0.9rem;
      background: #001525;
      text-align: left;
    }

    .build-alarmtitle {
      display: inline-block;
      margin-right: 1.5rem;
      float: right;
    }


    .build-alarm {
      display: block;
      width: 100%;
      text-align: right;

      i {
        margin-left: 0.5rem;
      }
    }

    .closeBtn {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
    }
  }
</style>
