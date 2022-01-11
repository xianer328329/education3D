<template>
  <div class="toDayAlarm-mian">
    <div class="toDayAlarm-bigbox clearFix curpointer">
      <div class="toDayAlarm-box" @click="showAlarmList(1)">
        <div class="dayalarm-number"><i class="Z-numberf color0ff">{{BasicInfoData.alarmNum}}</i></div>
        <div class="dayalarm-span"><span class="dayalarm-text">今日报警</span></div>
        <div class="dayalarm-compare"><span>较上日{{BasicInfoData.compareAlarmNum>=0?'+':''}}{{BasicInfoData.compareAlarmNum}}</span></div>
      </div>
      <div class="toDayAlarm-box matoleft" @click="showAlarmList(2)">
        <div class="dayalarm-number"><i class="Z-numberf color0ff">{{BasicInfoData.waringNum}}</i></div>
        <div class="dayalarm-span"><span class="dayalarm-text">今日预警</span></div>
        <div class="dayalarm-compare"><span>较上日{{BasicInfoData.compareWaringNum>=0?'+':''}}{{BasicInfoData.compareWaringNum}}</span></div>
      </div>
      <div class="toDayAlarm-langbox">
        <ul class="toDayAlarm-ul">
          <li @click="showAlarmList(3)">
            <span> <i class="Z-numberf coloryellow">{{BasicInfoData.cumulativeUnprocessed}}</i></span>
            <span class="dayalarm-text">累计未处理</span>
          </li>
          <li @click="showAlarmList(4)">
            <span><i class="Z-numberf color0ff">{{BasicInfoData.alarmSnum}}</i></span>
            <span class="dayalarm-text">累计总数</span>
          </li>
        </ul>
      </div>
    </div>
    <alarm-List ref="alarmListrefs"></alarm-List>
  </div>
</template>

<script>
  import alarmList from './AlarmList.vue' //报警列表
  export default {
    name: 'toDayAlamr',
    components: {
      alarmList,
    },
    data() {
      return {
        BasicInfoData: {},
      }
    },
    mounted() {
      this.getdata();
    },
    methods: {
      getdata() {
        this.$axios.post('/elec/safety/aselectinfo', {}).then(res => {
          this.BasicInfoData = res || {};
        })
      },
      showAlarmList(type) {
        this.$refs.alarmListrefs.show(type);
      },
    },
  }
</script>

<style lang="scss">
  .toDayAlarm-mian {
    .curpointer {
      cursor: pointer;
    }

    .toDayAlarm-bigbox {
      margin-left: 0.193%;
      margin-top: 0.55rem;
    }

    .toDayAlarm-box {
      float: left;
      height: 7.3rem;
      width: 32.225%;
      background: rgba(7, 61, 91, 0.5);
      border: 1px solid #084d76;
      text-align: center;
    }

    .matoleft {
      margin-left: 1%;
    }

    .dayalarm-number {
      margin-top: 1rem;
      text-align: center;
    }

    .dayalarm-number i {
      font-size: 2.2rem;
      font-weight: 500;
      letter-spacing: 0.1rem;
    }

    .coloryellow {
      color: #ff9900;
    }

    .color0ff {
      color: #82ecfd
    }

    .colorbule {
      color: #71c7d5;
    }

    .dayalarm-text {
      font-size: 0.8rem;
      font-weight: 400;
      color: #4d91b0;
    }

    .dayalarm-compare {
      margin-top: 0.8rem;
    }

    .dayalarm-compare span {
      height: 1.35rem;
      line-height: 1.35rem;
      width:80%;
      color: #75c2e5;
      font-size: 0.8rem;
      font-weight: 400;
      letter-spacing: 0.05rem;
      background: #073d5b;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
    }

    .toDayAlarm-langbox {
      height: 7.3rem;
      width: 32.225%;
      margin-left: 0.245%;
      float: right;
    }

    .toDayAlarm-langbox ul li {
      width: 100%;
      height: 3.35rem;
      background: rgba(7, 61, 91, 0.5);
      border: 0.05rem solid #084d76;
      position: relative;
    }


    .toDayAlarm-ul i {
      font-size: 1rem;
      font-weight: 500;
      text-align: center;
      letter-spacing: 1px;
      display: inline-block;
      margin-top: 0.5rem;
    }

    .toDayAlarm-ul span {
      display: block;
      height: 50%;
      width: 100%;
      text-align: center;
    }

    .toDayAlarm-ul li:nth-child(-n+1) {
      margin-bottom: 0.5rem;
    }
  }
</style>
