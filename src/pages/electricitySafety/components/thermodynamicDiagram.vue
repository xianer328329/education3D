<template>
  <div class="thermodynamicDiagram-mian" v-show="heatfalg">
    <div class="thremodymaminc-box">
      <div class="thremodymaminc-close" @click="closeheatmap()"><i class="el-dialog__close el-icon el-icon-close"></i></div>
      <div class="thremodymaminc-title">
        <span v-for="(item,index) in dictList" :class="classObject(item.dictValue)" :key="item.uuid" @click="addAlarmType(item.dictValue)">{{item.dictValue}}</span>
      </div>
      <div class="QueryParameters">
        <ul class="Z-QueryList clearFix" id="data-box">
          <li>
            <span class="lable">报警日期</span>
            <div class="timeQuery">
              <two-selc @twodateTimeChange='twodateQuery' :dateTime="dateTime"></two-selc>
            </div>
          </li>
          <li class="QueryBtn" v-on:click='getdata'>生成热力图</li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>
  import TwoSelc from './twodateSelection'
  export default {
    components: {
      TwoSelc,
    },
    data() {
      return {
        dateTime: [],
        dictList: [],
        typeList: [],
        heatfalg: false,
        seachInfo: {
          startTime: '',
          endTime: '',
        },
      }
    },
    computed: {
      classObject: function(i) {
        return function(i) {
          return {
            active: this.typeList.includes(i)
          }
        }
      }
    },
    methods: {
      closeheatmap() {
        this.heatfalg = false;
        this.$emit('heatmapClose')
      },
      show() {
        this.heatfalg = true;
        this.seachInfo.startTime = this.formatDate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30), 'yyyy-MM-dd hh:mm:ss');
        this.seachInfo.endTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        this.dateTime = [this.seachInfo.startTime, this.seachInfo.endTime];
        this.dictList.length > 0 ? '' : this.getdict();
      },
      getdata() {
        this.$axios.post('/elec/safety/dalarmHeatMap', {
          "alarmType": this.typeList.join(','),
          "startTime": this.seachInfo.startTime,
          "endTime": this.seachInfo.endTime
        }).then(res => {
          var data = res || [];
          var arr = [];
          data.forEach((item) => {
            if (!!item.deviceUlng || !!item.deviceUlat) {
              var obj = {
                "count": item.alarmNum,
                "lng": item.deviceUlng,
                "lat": item.deviceUlat,
              };
              arr.push(obj)
            }
          })
          if (arr.length == 0) {
            this.$message.warning('无数据!')
          }
          this.$emit('showHeatmap', arr)
        })

      },
      getdict() {
        this.$axios.post(process.env.API_OHTTPH + '/system/dict/aqueryList', {
          "dictType": "elecAlarm",
          "dictName": "报警"
        }).then(res => {
          this.dictList = res || [];
          this.dictList.forEach((item) => {
            this.typeList.push(item.dictValue);
          })
        })
      },
      twodateQuery(res) {
        if (res) {
          this.seachInfo.startTime = res[0];
          this.seachInfo.endTime = res[1];
        } else {
          this.seachInfo.startTime = null;
          this.seachInfo.endTime = null;
        }
      },
      addAlarmType(i) {
        var index = this.typeList.indexOf(i);
        if (index != -1) {
          if (this.typeList.length == 1) {
            this.dictList.forEach(item => {
              this.typeList.push(item.dictValue);
            })
          }
          this.typeList.splice(index, 1);
        } else {
          this.typeList.push(i);
        }
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

      }
    },
  }
</script>

<style lang="scss">
  .thermodynamicDiagram-mian {
    position: absolute;
    bottom: 7%;
    right: 4%;
    z-index: 5;

    .thremodymaminc-close {
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
      color: #FFFFFF;
      cursor: pointer;
    }

    .QueryBtn {
      padding: 0 5rem;
      height: 1.4rem;
      line-height: 1.4rem;
    }

    #data-box .el-date-editor--daterange.el-input__inner {
      width: 22.15rem;
    }

    .QueryParameters .timeQuery {
      width: 22.15rem;
    }

    .QueryParameters .timeQuery input {
      width: 9.25rem;
    }

    .active {
      color: #00FDFD !important;
      border: 1px solid #00fdfd !important;
    }

    .thremodymaminc-title span {
      width: 3.75rem;
      height: 1.2rem;
      padding: 0.2rem 0.3rem;
      margin: 0 0.25rem;
      line-height: 1.2rem;
      background: #0b3a5e;
      border: 1px solid #0b6189;
      border-radius: 2px;
      display: inline-block;
      font-size: 0.7rem;
      font-family: 'Microsoft YaHei Regular';
      font-weight: 400;
      text-align: center;
      color: #70c4eb;
    }

    .thremodymaminc-title {
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      cursor: pointer;
    }

    .thremodymaminc-box {
      padding-right: 1.5rem;
      height: 5.35rem;
      background: #001c2e;
      border: 1px solid #256080;
    }
  }
</style>
