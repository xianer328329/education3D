<template>
  <div>
    <div class="shrinkNav" id="shrinkNav">
      <ul>
        <li class="NO_Auth" @click="shrink(0,$event)" authName="al_schoolfire_fire_fire_baseinfo" authDesc="基础信息">基础信息</li>
      </ul>
    </div>
    <div class="SKRINKBox" id="SKRINKBox">
      <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
        <back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]">
          <ul class="clearFix">
            <li class="divbase">
              <p class="textsize">{{BasicInfoData.buildNum}}</p>
              <p>监测楼宇</p>
            </li>
            <li class="divbase">
              <p class="textsize">{{BasicInfoData.deviceNum}}</p>
              <p>智能空开</p>
            </li>
            <li class="divbase">
              <p class="textsize">{{BasicInfoData.nodeNum}}</p>
              <p>监测线路</p>
            </li>
            <li class="divbase">
              <p class="textsize">{{BasicInfoData.time}}</p>
              <p>接入时间</p>
            </li>
          </ul>

        </back-box>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showSKRINK: [false],
        BasicInfoData: {
          buildNum: '--',
          deviceNum: '--',
          nodeNum: '--',
          time: '--'
        },
      }
    },
    mounted: function() {
      this.getBasic();
    },
    methods: {
      getBasic() {
        this.$axios.post('/elec/safety/aselectbaseinfo', {}).then(res => {
          this.BasicInfoData = res || {};
        })
      },
      shrink(oIndex, event) {
        clickshrink(oIndex, event, this)
      }
    },
  }
</script>

<style>

</style>
