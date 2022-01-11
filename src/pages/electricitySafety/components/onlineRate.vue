<template>
  <div class="onlineRate-mian">
    <div class="online-box">
      <div class="online-linebox quote"  @click="showList(1)"><span class="online-text">设备总数</span><i class="Z-numberf colornumber">{{BasicInfoData.deviceSnum}}</i></div>
      <div class="online-linebox"  @click="showList(2)"><span class="online-text">在线设备</span><i class="Z-numberf colornumber">{{BasicInfoData.onlineNum}}</i></div>
    </div>
    <div class="progress clearFix">
      <div class="linbox">
        <span class="online-text">在线率</span>
      </div>
      <div class="linbox progress-line">
        <section class="container">
          <div class="progress-mi">
            <span class="red" :style="{width: !BasicInfoData.onlineRate?'0%':(BasicInfoData.onlineRate*100)+'%'}">
              <div class="circular-max">
                <div class="circular-min"></div>
              </div>
            </span>
          </div>
        </section>
      </div>
      <span class="online-text linbox lefma">{{!BasicInfoData.onlineRate?'0%':(BasicInfoData.onlineRate*100)+'%'}}</span>
    </div>
    <device-List ref="devicelistfef"></device-List>
  </div>
</template>

<script>
  import deviceList from './deviceList.vue'
  export default {
    name: 'onlineRate',
    components: {
      deviceList
    },
    props: {
      BasicInfoData: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {}
    },
    mounted() {},
    methods: {
      showList(type) {
        this.$refs.devicelistfef.show(type);
      },

    }
  }
</script>

<style lang="scss" scoped="scoped">
  .onlineRate-mian {
    .online-text {
      font-size: 0.8rem;
      transform: scale(1);
      font-weight: 400;
      color: #75c2e5;
      letter-spacing: 0.05rem;
      margin-right: 0.5rem;
    }

    .quote::after {
      content: "|";
      display: inline-block;
      height: 100%;
      float: right;
      width: 1px;
      background: #194a5d;
    }

    .online-box {
      cursor: pointer;
      margin-top: 1.2rem;
    }

    .online-linebox {
      display: inline-block;
      text-align: center;
      width: 49%;
    }

    .colornumber {
      font-size: 1rem;
      font-weight: 500;
      color: #82ecfd;
      letter-spacing: 1px;
    }

    .progress {
      margin-top: 1.8rem;
      width: 100%;
      line-height: 0.8rem;
      position: relative;
	  display: flex;
	  justify-content: center;
	  align-items: center;
    }

    .linbox {
      display: inline-block;
    }

    .lefma {
      margin-left: 0.5rem;
      margin-right: 0.5px;
    }

    .progress-box {
      display: inline-block;
      width: 100%;
      height: 0.4rem;
      line-height: 0.4rem;
      background: #092437;
      border-radius: 0.2rem;
    }

    .progress-line {
      flex: 1;
    }

    .container {
      width: 100%;
    }

    .progress-mi {
      height: 0.4rem;
      background: #092437;
      border-radius: 0.2rem;
    }

    .progress-mi>span {
      position: relative;
      float: left;
      margin: 0 -1px;
      min-width: 0.5rem;
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: right;
      border: 1px solid;
      border-radius: 0.2rem;
    }

    .progress-mi>span:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      height: 0.4rem;
      border-radius: 4px;
    }

    .progress-mi .red {
      background: linear-gradient(to left, #82ECFD, #092437);
    }

    .circular-max {
      position: absolute;
      background: radial-gradient(ellipse at center, rgba(42, 99, 115, .15) 1%, rgba(130, 236, 253, .2) 100%);
      border-radius: 50%;
      text-align: center;
      width: 1.2rem;
      height: 1.2rem;
      top: -0.4rem;
      right: -0.2rem;
      z-index: 12;
    }

    .circular-min {
      float: right;
      background: rgb(130, 236, 253);
      border-radius: 50%;
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
      margin-top: 0.2rem;
      z-index: 12;
    }
  }
</style>
