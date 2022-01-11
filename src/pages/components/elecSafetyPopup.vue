<template>
  <div class="elecSafetyPopup-mian" style="display:none">
    <div class="devicePopup">
      <div class="elecSafetyPopup-mian">
        <div class="elecSafety-head">智能空开</div>
        <div class="thremodymaminc-close-popup"><img class="closeInfoWindow" src="../../../static/images/Zgb.png" alt="" /></i></div>
        <ul class="elecSafety-ul">
          <li><span class="elecSafety-title">位置</span><span class="elecSafety-text">{{oitem.deviceBuild+'-'+oitem.deviceUnit+'-'+oitem.deviceRoom}}</span></li>
          <li><span class="elecSafety-title">状态</span><span :class="{yellow:oitem.deviceOnline=='0'}" class="elecSafety-text">{{oitem.deviceOnline=='0'?'离线':'在线'}}</span></li>
          <li><span class="elecSafety-title">设备号</span><span class="elecSafety-text">{{oitem.deviceName}}</span></li>
          <li class="elecSafety-check" id="checkdetilelecsafety" :data="oitem.data">查看详情</li>
        </ul>
      </div>
    </div>
    <div class="alarmPopup">
      <div class="elecSafetyPopup-mian">
        <div id="warning">
          <div class="Z-bowen">
            <i class="Z-dot1"></i>
            <i class="Z-dot2"></i>
            <i class="Z-dot3"></i>
          </div>
        </div>
        <div class="thremodymaminc-close-popup"><img class="closeInfoWindow" src="../../../static/images/Zgb.png" alt="" /></i></div>
        <div class="elecSafety-head">{{oitem.alarmDesc}}</div>
        <ul class="elecSafety-ul">
          <li><span class="elecSafety-title">报警时间</span><span class="elecSafety-text">{{oitem.alarmTime}}</span></li>
          <li class="curpointer" id="alarmPopupnum" :oitem='oitem.data'>
            <span class="elecSafety-title">设备号</span>
            <span class="elecSafety-text">{{oitem.deviceName}}</span>
            <img class="opalarmlist" src="../../../static/images/OPEN.png"></img>
          </li>
          <li><span class="elecSafety-title">位置</span><span class="elecSafety-text">{{oitem.alarmSite}}</span></li>
          <li class="curpointer" id="alarmPopupline" :oitem='oitem.data'>
            <span class="elecSafety-title curpointer">线路</span>
            <span class="elecSafety-text">{{oitem.alarmNode}}</span>
            <img class="opalarmlist" src="../../../static/images/OPEN.png"></img>
          </li>
          <li><span class="elecSafety-title">数值</span><span class="elecSafety-text">{{oitem.alarmUnum||'--'}}</span></li>
          <li><span class="elecSafety-title">状态</span><span class="elecSafety-text" :class="{yellow:oitem.alarmStatus==1}">{{oitem.alarmStatus==1?'未处理':'已处理'}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      oMaxmap: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        alarmPopupfalg: true,
        elecSafetyflag: false,
        infoWindow: null, //监控列表弹框
        oitem: [],
        dataInfo: {},
        maxmap: null,
        marker: [],
      }
    },
    mounted() {},
    methods: {
      show(type, oitem, oMaxmap) {
        // type  1 从今日告警列表过来
        var vm = this;
        oitem.longitude =oitem.deviceUlng;
        oitem.latitude = oitem.deviceUlat;
        vm.maxmap = oMaxmap;
        vm.oitem = oitem;
        vm.oitem.data = JSON.stringify(oitem);
        var content = '';
        vm.$nextTick(() => {
          var point = new AMap.LngLat(oitem.longitude, oitem.latitude);
          if (type == 1) {
            content = $('.alarmPopup').html();
          } else {
            content = $('.devicePopup').html();
            var data = vm.oitem.data;
            var contents = "<div class='mapIcon mapIconA69' oitme='" + data + "'><img src='../../../static/images/map/ele3on.png' alt=''/></div>"
            this.marker = new AMap.Marker({
              position: [vm.oitem.longitude, vm.oitem.latitude],
              content: contents,
              offset: new AMap.Pixel(-15, -15),
              title: '智能空开'
            })
            vm.maxmap.add(this.marker);
          }
          vm.infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            content: content,
            anchor: 'top-left',
          });
          vm.infoWindow.open(this.maxmap, point);
          $('#container').on('click', '#checkdetilelecsafety', function() {
            var data = JSON.parse($(this).attr('data'));
            vm.bus.$emit('changeListprop',8,data)
            vm.maxmap.clearInfoWindow();
             vm.maxmap.remove(vm.marker);
            vm.infoWindow = null;
          })
          $('#container').on('click', '.closeInfoWindow', function() {
            vm.maxmap.clearInfoWindow();
            vm.infoWindow = null;
            vm.maxmap.remove(vm.marker);
          })
          $('#container').on('click', '#alarmPopupline', function() { // 绑定线路点击事件
            var oitem = JSON.parse($(this).attr('oitem'));
            vm.bus.$emit('changeListprop', 6, oitem);
            vm.maxmap.clearInfoWindow();
            vm.infoWindow = null;
          })
          $('#container').on('click', '#alarmPopupnum', function() { // 绑定位置点击事件
            var oitem = JSON.parse($(this).attr('oitem'));
            vm.bus.$emit('changeListprop', 7, oitem);
            vm.maxmap.clearInfoWindow();
            vm.infoWindow = null;
          })
        })
      },
    },
  }
</script>

<style lang="scss">
  .elecSafetyPopup-mian {
    min-width: 17.95rem;
    background: #001525;
    border: 1px solid #256080;
    z-index: 9999;
  }

  .deviceimg {
    font-size: 0.9rem;
    position: absolute;
    z-index: 99999;
    top: -30px;
    left: -28px;
  }

  .deviceicon {}

  .yellow {
    color: #d4ac11 !important;
  }

  .curpointer {
    cursor: pointer;
  }

  .opalarmlist {
    display: inline-block;
    margin-right: 0.5rem;
    width: 1rem;
    height: 1.5rem;
  }

  .elecSafety-ul li {
    width: 100%;
    background: #011f35;
    word-break: break-all;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .elecSafety-ul li:nth-child(2n+1) {
    background: #001525 !important;
  }

  .elecSafety-ul li:nth-child(-n+3) {}

  .elecSafety-check {
    height: 2rem;
    width: 100%;
    font-size: 0.8rem;
    font-family: 'Microsoft YaHei Regular';
    font-weight: 400;
    color: #e1e3e4;
    letter-spacing: 1px;
    cursor: pointer;
  }

  .elecSafety-text {
    margin-left: 1rem;
    width: 70%;
    display: inline-block;
    font-size: 0.8rem;
    font-family: 'Microsoft YaHei Regular';
    font-weight: 400;
    text-align: left;
    color: #e1e3e4;
    letter-spacing: 1px;
    margin-right: 1rem;
  }

  .elecSafety-title {
    display: inline-block;
    height: 1.5rem;
    min-width: 4.5rem;
    margin: 0 auto;
    width: 20%;
    line-height: 1.5rem;
    font-size: 0.8rem;
    font-family: 'Microsoft YaHei Regular';
    font-weight: 400;
    text-align: right;
    color: #75cbf2;
    letter-spacing: 1px;
  }

  .elecSafety-head {
    height: 2rem;
    line-height: 2rem;
    width: 100%;
    background: #004d80;
    text-align: center;
    font-size: 1rem;
    font-family: 'Microsoft YaHei Regular';
    font-weight: bold;
    color: #e5eaea;
    letter-spacing: 1px;
  }

  .thremodymaminc-close-popup {
    position: absolute;
    top: 8%;
    right: 2%;
    z-index: 9;
    color: #FFFFFF;
    cursor: pointer;
  }

  .thremodymaminc-close-popup img {
    height: 1rem;
    width: 1rem;
  }
</style>
