<template>
  <div class="module">
    <div class="section-left safety-left">
      <back-box class="border-anim visible">
        <Basic-infor></Basic-infor>
        <to-Dayalarm :BasicInfoData="BasicInfoData" />
      </back-box>
      <back-box class="border-anim">
        <online-Rate :BasicInfoData="BasicInfoData" />
      </back-box>
      <back-box class="border-anim">
        <Alarm-Trend />
      </back-box>
      <back-box class="border-anim">
        <Alarm-Comparison />
      </back-box>
      <back-box class="border-anim boder-alarmlog">
        <Alarm-Log />
      </back-box>
    </div>
    <div class="section-bottom safety-bottom">
      <back-box class="border-anim">
        <Alarm-Buttom />
      </back-box>
    </div>

  </div>
</template>

<script>
  import AlarmButtom from './components/AlarmButtom.vue' //
  import AlarmLog from './components/AlarmLog.vue' //报警记录
  import AlarmComparison from './components/AlarmComparison.vue' // 报警同比
  import AlarmTrend from './components/AlarmTrend.vue' //报警趋势
  import onlineRate from './components/onlineRate.vue' //在线率
  import toDayalarm from './components/toDayAlarm.vue' // 今日告警
  import BasicInfor from './components/BasicInformation' //基本信息
  export default {
    name: 'safety',
    components: {
      BasicInfor,
      toDayalarm,
      onlineRate,
      AlarmTrend,
      AlarmComparison,
      AlarmLog,
      AlarmButtom
    },
    data() {
      return {
        BasicInfoData: {},
      }
    },
    mounted() {
      this.getBasicInfo();
    },
    methods: {
      getBasicInfo() {
        this.$axios.post('/elec/safety/aselectinfo', {}).then((res) => {
          if (!isNaN(res.onlineRate) && res.onlineRate != 0) {
            var val = parseFloat(res.onlineRate);
            res.onlineRate = val.toFixed(1);
          }
          res.onlineRate=isNaN(res.onlineRate)?'0':res.onlineRate;
          this.BasicInfoData = res;
        })
      },
    },
  }
</script>

<style lang="scss">
  .boxtitle {
    font-size: 0.8rem;
    font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
    font-weight: 400;
    color: #75c2e5;
  }

  .section-left>.boder-alarmlog {
    padding: 0px !important;
  }
</style>
