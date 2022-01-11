<template>
  <div>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="crt-modal scaleZoom" v-if="curr!=0" @click="close">
        <div class="crt-modal-content" :class="{fullScreen:full}" @click.stop="">
          <div class="crt-header">
            <h1>{{title}}{{' '+lists.length>0?lists[currIndex].fname:''}}</h1>
            <img :src="require('../../../../static/images/'+(full?'notfull':'full')+'.png')" class="full" @click="toggeleFull" />
            <i class="el-icon el-icon-close close" @click="close"></i>
          </div>
          <div class="fire-container" ref="dragContainer" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <div class="img-c" ref="scaleContainer" :style="styles">
              <div v-for="(list,dataIndex) in lists" v-if="currIndex==dataIndex" :key="dataIndex" :style="{transform:'scale('+rate+')'}">
                <!--<embed src="chinaPolyline.svg" class="main-img" width="900" height="500" type="image/svg+xml"pluginspage="https://www.adobe.com/svg/viewer/install/" />-->
                <img :src="imgPrefix+list.imgSrc" :style="{opacity:list.imgSrc?1:0}" class="main-img" @load="imgLoad" ref="mainImg" />
                <div class="modal-drag"></div>
                <div class="icon-c" :class="{hasWarning:item.alarmType}" v-for="(item,index) in list.icons" :style="{left:item.deviceleft+'px',top:item.devicetop+'px','z-index':item.zIndex||((curr==1&&list.deviceCode==item.devicecode)?6:5)}" :key="index">
                  <div class="icon" @mouseenter="mouseenter(item)" @click="showPop(item)" :class="{'active':item.pop,'fire':item.alarmType==1,'warn':item.alarmType==4,'fault':item.alarmType==2,'other':item.alarmType==3,'normal':item.alarmType==null,'curr':curr==1&&list.deviceCode==item.devicecode}">
                    <img src="../../../../static/images/loc.png" v-if="curr==1&&list.deviceCode==item.devicecode" />
                    <!--pluginspage="https://www.adobe.com/svg/viewer/install/"-->
                    <embed src="../../../../static/images/device.svg" v-else width="15" height="15" type="image/svg+xml"></embed>
                    <div class="modal-drag"></div>
                    <span class="devicename">{{item.devicename}}</span>
                  </div>
                  <div class="H-mapPopoutF" v-show="item.pop" v-loading="item.loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <h5 class="PopoutTop">{{item.alarmTypeName}}<i class="el-icon el-icon-close close" @click.stop="closePop(item)"></i></h5>
                    <ul>
                      <li class="clearFix" v-for="(value,key) in item.rows"><span>{{key}}:</span>
                        <p>
                          <i :class="{'alarmDescLow':key=='示值'&&item.alarmDesc=='偏低','alarmDescUp':key=='示值'&&item.alarmDesc=='偏高'}">
                            {{value}}
                          </i>
                          <!--<em v-show="key=='示值'">安全值: {{item.wminValue}}~{{item.wmaxValue}}{{item.valueUnit}}</em>-->
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="img-placeholder" v-if="(lists.length==0&&!loading)||(lists.length>0&&(lists[currIndex].imgSrc==''||lists[currIndex].imgSrc==null))">暂未配置图片</p>
          <div class="tip-button">
            <span class="fire">火警</span>
            <span class="warn">预警</span>
            <span class="fault">故障</span>
            <span class="other">其他</span>
          </div>
          <div class="slide-page text-center" v-if="lists.length>1">
            <a @click="prevPage" class="mr" v-if="totalPage>1">
              <</a> <el-button class="mb20 mr10" v-if="page>1">...</el-button>
                <el-button class="mb20 mr10" :class="{active:currIndex==dataIndex}" v-if="dataIndex>=(page-1)*size&&dataIndex<page*size" v-for="(list,dataIndex) in lists" @click="changeFloor(dataIndex)" :key="dataIndex">{{list.fname||'未定义'}}</el-button>
                <el-button class="mb20 mr10" v-if="page<totalPage">...</el-button>
                <a @click="nextPage" class="ml" v-if="totalPage>1">></a>
          </div>

          <template v-if="lists.length>1">
            <img src="../../../../static/images/left.png" class="left arrow" @click="prev" />
            <img src="../../../../static/images/right.png" class="right arrow" @click="next" />
          </template>
        </div>
      </div>
    </transition>

    <!--建筑物地图弹窗-->
    <div style="display:none;position: absolute;">
      <div class="buildPop clearFix" ref="pop">
        <h1>{{build.buildname}}</h1>
        <img class="closeBuild" src="../../../../static/images/Zgb.png" alt="" />
        <div class="fl">
          <ul>
            <li class="border-bottom border-right">
              <p class="Z-numberf" :class="{'red':build.fireCount}">{{build.fireCount}}</p>
              <p>火警</p>
            </li>
            <li class="border-bottom">
              <p class="Z-numberf" :class="{'orange':build.faultFireCount}">{{build.faultFireCount}}</p>
              <p>预警</p>
            </li>
            <li class="border-right">
              <p class="Z-numberf" :class="{'orange':build.faultCount}">{{build.faultCount}}</p>
              <p>故障</p>
            </li>
            <li>
              <p class="Z-numberf" :class="{'orange':build.otherCount}">{{build.otherCount}}</p>
              <p>其他</p>
            </li>
          </ul>
          <el-button type="primary" @click="lookDetail(build)">查看详情</el-button>
        </div>

        <div class="fr">
          <div class="content">
            <div class="photo"><img src="../../../../static/images/a10on.png" /></div>
            <p><label>负责人：</label><span>{{build.link_name}}</span></p>
            <p><img src="../../../../static/images/phone.png" /><span>{{build.link_phone}}</span></p>
            <el-button type="primary" size="mini" icon="el-icon-location">定位</el-button>
            <!--<el-button type="warning" size="mini" icon="urge">督促</el-button>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var zIndex = 5,
    timer;
  export default {
    name: 'EmergencyPop3crt',
    data() {
      return {
        curr: '',
        currIndex: 0,
        build: {
          fireCount: '--',
          faultFireCount: '--',
          faultCount: '--',
          otherCount: '--',
          link_name: '',
          link_phone: '',
        }, //当前点击建筑物
        lists: [],
        title: '',
        list: {},
        loading: false,
        styles: {},
        full: false,
        imgPrefix: process.env.API_OHTTP,
        scaleRate: 1, //缩放比率
        dragState: false, //拖拽状态
        dragPosition: {
          x: 0,
          y: 0,
          newx: 0,
          newy: 0
        },
        iconWidth: 20, //图标宽度
        iconHeight: 20, //图标高度
        mw: 0, //图片容器最小宽度
        mh: 0, //图片容器最小高度
        cursor: 'pointer',
        rate: 1,
        totalPage: 0,
        page: 1,
        size: 5,
        infoWindow: null //建筑物信息弹框
      }
    },
    mounted: function() {
      var vm = this;
      //单个设备告警详情
      vm.bus.$on('Pop3crt', function(list) {
        vm.resetInfo();
        vm.title = list.buildName; //+' '+list['position']
        vm.list = list;
        vm.curr = 1;
        vm.getCrtFloorDetails(list);
        vm.init();
      });
    },
    methods: {
      //获取建筑物告警详情
      getCrtBuildDetails(list) {
        var vm = this;
        var params = {
          buildname: list.buildname,
        }
        vm.loading = true;
        vm.$axios.post('home/getAllCrtImage', params).then(function(res) {
          var data = res || [],arr = [];
		  try {
			data.forEach(function(value) {
			  var obj = {
				imgSrc: value.crturl,
				fname: value.fname,
				icons: value.devicecodes
			  }
			  arr.push($.extend(true, obj, list));
			});
			vm.lists = arr;
			vm.totalPage = Math.ceil(vm.lists.length / vm.size);
		  } catch (e) {};
		  vm.loading = false;
        })
      },
      //获取单个设备crt信息
      getCrtFloorDetails(list) {
        var vm = this;
        vm.loading = true;
        var params = {
          buildname: list.buildName,
          //					unituuid:UNITID,
          devicecode: list.deviceCode,
        }
        if (vm.curr == 1) {
          params.uuid = vm.list.uuid;
        }
        vm.$axios.post('home/getCrtFloorDetails', params).then(function(res) {
          var data = res || {},
            arr = [];
          try {
            var obj = {
              imgSrc: data.crturl,
              icons: data.devicecode || []
            }
            arr.push($.extend(true, obj, list));
            vm.lists = arr;
          } catch (e) {};
          vm.loading = false;
        })
      },
      //获取单个设备告警信息
      getAlarmDetailsByDeviceCode(item) {
        var vm = this;
        var params = {
          //					"unituuid":UNITID,
          "devicecode": item.devicecode,
          uuid: item.uuid
        }
        if (vm.curr == 1 && item.devicecode == vm.list.deviceCode) {
          params.alarmId = vm.list.uuid
        }
        vm.$axios.post('home/getAlarmDetailsByDeviceCode', params).then(function(res) {
          var data = res || [];
          if (data.length > 0) {
            var info = data[0];
            //						if(info.alarmType==4){//预警
            var rows = {
              "楼宇": info.buildName,
              "位置": info.position,
              "告警设备": info.deviceName,
              //								"示值":info.buildName,
              "设备编号": info.deviceCode,
              "告警时间": info.alarmTime,
            }
            //						}
            if (info.alarmType == 3) { //其他
              rows["事件"] = info.alarmDesc
            }
            item = $.extend(true, item, info);
            vm.$set(item, 'rows', rows);
          } else {
            vm.$set(item, 'rows', {});
            vm.$set(item, 'alarmTypeName', '该点位无告警信息');
          }
          vm.$set(item, 'hasDetail', true);
          vm.$set(item, 'loading', false);
        })
      },
      //查看建筑物告警详情
      lookDetail(build) {
        var vm = this;
        vm.resetInfo();
        vm.curr = 2;
        vm.title = build.buildname;
        vm.init();
        vm.getCrtBuildDetails(build);
      },
      //切换楼层
      changeFloor(dataIndex) {
        var vm = this;
		vm.loading=true;
        this.scaleRate = 1;
        vm.styles = {
          left: '50%',
          top: '50%',
          cursor: vm.cursor,
          transform: 'translate(-50%,-50%)',
          opacity: 0,
        }
        this.currIndex = dataIndex;
      },
      prev() {
        if (this.currIndex > 0) {
          this.changeFloor(this.currIndex - 1);
        }
      },
      next() {
        if (this.currIndex < (this.lists.length - 1)) {
          this.changeFloor(this.currIndex + 1);
        }
      },
      prevPage() {
        if (this.page > 1) {
          this.page--;
        }
      },
      nextPage() {
        if (this.page < this.totalPage) {
          this.page++;
        }
      },
      handleClickBuild(build, maxmap,markers) { //点击建筑物
        //				console.log(JSON.stringify(build))
        var vm = this;
        var params = {
          buildname: build.name,
          //					unituuid:UNITID
        }
        this.$axios.post('home/getAllFireAlarm', params).then(function(res) {
          var data = res || [];
          if (data.length > 0) {
            data[0].buildname = build.name;
            vm.build = data[0];
            vm.$nextTick(()=>{
				vm.infoWindow = new AMap.InfoWindow({
					isCustom: true, //使用自定义窗体
					content: vm.$refs.pop,
					autoMove: true,
					// closeWhenClickMap:true,
					anchor: 'top-left',
					map:maxmap,
					offset: new AMap.Pixel(0, 39),
					position: [build.lng, build.lat],
				});
				$('#container').on('click', '.closeBuild', function() {
					$('#container .buildingsBtn p').removeClass('active')
					vm.infoWindow.close();
					maxmap.remove(markers)
				})
			})
          } else {
            vm.$message('查询失败')
          }

        })
      },
      closeInfoWindow() {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
      },
      resetInfo() {
        var vm = this;
        vm.lists = [];
        vm.rate = 1;
        vm.currIndex = 0;
        vm.scaleRate = 1;
        vm.dragState = false;
        vm.full = false;
        vm.styles = {
          left: '50%',
          top: '50%',
          cursor: vm.cursor,
          transform: 'translate(-50%,-50%)',
        }
      },
      //初始化
      init: function() {
        var vm = this;
        vm.$nextTick(function() {
          vm.bindDragEvent();
          scale();
          //					vm.bindScaleEvent();
        })
      },
      //绑定整体拖拽事件
      bindDragEvent: function() {
        var vm = this;
        var dragContainer = vm.$refs.dragContainer;
        $(dragContainer).on('mousedown', function(e) {
          vm.dragState = true;
          vm.dragPosition.x = e.pageX;
          vm.dragPosition.y = e.pageY;
          vm.cursor = 'url("https://api0.map.bdimg.com/images/openhand.cur") 8 8, default';
        });
        $(dragContainer).on('mousemove', function(e) {
          e.preventDefault();
          if (vm.dragState) {
            vm.dragPosition.newx = vm.dragPosition.newx + e.pageX - vm.dragPosition.x;
            vm.dragPosition.newy = vm.dragPosition.newy + e.pageY - vm.dragPosition.y;
            vm.dragPosition.x = e.pageX;
            vm.dragPosition.y = e.pageY;
            vm.scale();
          }
        });
        $(dragContainer).on('mouseup', function(e) {
          vm.dragState = false;
          vm.cursor = 'pointer';
          vm.scale();
        });

        $(dragContainer).on('mousewheel DOMMouseScroll', vm.onMouseScroll);
      },
      //绑定整体缩放事件
      bindScaleEvent: function() {
        var vm = this;
        var scaleContainer = vm.$refs.scaleContainer;
        $(scaleContainer).on('mousewheel DOMMouseScroll', vm.onMouseScroll);
      },
      //图片加载完成
      imgLoad: function() {
        var vm = this;
        vm.$nextTick(function() {
          try {
			vm.loading=false;
            var dragContainer = vm.$refs.dragContainer;
            var mainImg = vm.$refs.mainImg[0];
            //						vm.mw=mainImg.offsetWidth;
            //						vm.mh=mainImg.offsetHeight;
            var windowW = 880;
            var windowH = 796;
            var w = mainImg.src.indexOf('.svg') == -1 ? mainImg.naturalWidth : windowW;
            var h = mainImg.src.indexOf('.svg') == -1 ? mainImg.naturalHeight : windowH;
            if ((w / h) > (windowW / windowH)) {
              vm.mw = windowW;
              vm.mh = h * (vm.mw / w)
            } else {
              vm.mh = windowH;
              vm.mw = w * (vm.mh / h)
            }
            vm.dragPosition.newx = (dragContainer.offsetWidth - vm.mw) / 2;
            vm.dragPosition.newy = (dragContainer.offsetHeight - vm.mh) / 2;
            vm.scale();
          } catch (e) {
            console.log(e.message)
          }
        })
      },
      //鼠标滚轮事件监听
      onMouseScroll: function(e) {
        var vm = this;
        e.preventDefault();
        var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        var delta = Math.max(-1, Math.min(1, wheel));
        if (delta < 0) { //向下滚动
          if (vm.scaleRate > 1) {
            vm.scaleRate -= 0.1;
            vm.scale();
          }
        } else { //向上滚动
          vm.scaleRate += 0.1;
          vm.scale();
        }

      },
      //缩放、拖拽图片
      scale: function() {
        var vm = this;
        vm.styles = {
          width: vm.mw + 'px',
          height: vm.mh + 'px',
          left: vm.dragPosition.newx + 'px',
          top: vm.dragPosition.newy + 'px',
          cursor: vm.cursor,
          transform: 'scale(' + vm.scaleRate + ')',
          opacity: 1,
        }
      },
      //显示弹窗
      showPop(item) {
        var vm = this;
        this.$set(item, 'loading', true);
        this.$set(item, 'pop', true);
        this.$set(item, 'zIndex', ++zIndex);
        if (item.alarmType == null) {
          this.$set(item, 'alarmTypeName', '该点位无告警信息');
          this.$set(item, 'loading', false);
          return;
        }
        if (item.hasDetail == undefined) {
          vm.getAlarmDetailsByDeviceCode(item);
        } else {
          this.$set(item, 'loading', false);
        }
      },
      mouseenter(item) {
        this.$set(item, 'zIndex', ++zIndex);
      },
      toggeleFull() {
        this.full = !this.full;
        this.scaleRate = 1;
        this.rate = this.full ? 1.25 : 1;
        this.imgLoad();
      },
      //关闭弹窗
      closePop(item) {

        this.$set(item, 'pop', false);
      },
      close() {
        this.curr = '';

      }
    },
  }
</script>

<style lang="scss" scoped="scoped">
  .img-placeholder {
    font-size: 20px;
    color: white;
    position: absolute;
    top: 50%;
    line-height: 60px;
    left: 0px;
    width: 100%;
    text-align: center;
    margin-top: -30px;
  }

  .crt-modal {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 1920px;
    height: 1080px;
    /*right: 0px;
		bottom: 0px;*/
    z-index: 99999999;

    .crt-modal-content {
      /*width: 70%;*/
      width: 55%;
      margin: auto;
      top: 100px;
      border: 1px solid #38c1ff;
      background: #00192B;
      position: relative;

      /*transition: all 0.5s linear;*/
      &:hover {
        .arrow {
          opacity: 1;
        }
      }

      &.fullScreen {
        width: 100%;
        top: 0px;

        /*height: 100%;*/
        .fire-container {
          height: 1016px;
        }

        .main-img {
          /*max-width: 1750px;
					max-height:1016px;*/
          width: 100%;
          height: 100%;
        }
      }

      .tip-button {
        position: absolute;
        right: 0px;
        top: 64px;

        span {
          display: inline-block;
          margin-right: 10px;
          color: white;
          font-size: 18px;
          text-align: center;
          line-height: 30px;

          &:before {
            content: '';
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            margin-right: 5px;
          }
        }

        .fire:before {
          background: #DF0024;
        }

        .warn:before {
          background: #D85A06;
        }

        .fault:before {
          background: #E38B00;
        }

        .other:before {
          background: #04B600;
        }
      }

      .crt-header {
        position: relative;

        h1 {
          text-align: center;
          font-size: 18px;
          color: #FFFFFF;
          height: 44px;
          line-height: 44px;
          background: #005794;
        }

        .close {
          position: absolute;
          right: 0px;
          top: 0px;
          color: white;
          cursor: pointer;
          padding: 7px;
          font-size: 28px;
          z-index: 2;
        }

        .full {
          position: absolute;
          right: 50px;
          top: 0px;
          padding: 7px;
          cursor: pointer;
        }
      }

      .slide-page {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, 0);
        max-width: 100%;
        white-space: nowrap;
        font-size: 0px;

        a {
          display: inline-block;
          padding: 0px 15px;
          line-height: 31px;
          background: rgba(0, 78, 129, 1);
          border: 1px solid rgba(76, 162, 205, 1);
          border-radius: 4px;
          color: white !important;
          margin-bottom: 10px;
          vertical-align: middle;
          cursor: pointer;
        }

        .ml {
          margin-left: 10px;
        }

        .mr {
          margin-right: 10px;
        }

        .el-button {
          padding: 0px 15px;
          line-height: 30px;
          background: rgba(0, 78, 129, 1);
          border: 1px solid rgba(76, 162, 205, 1);
          border-radius: 4px;
          color: white !important;
          margin-bottom: 10px;
          vertical-align: middle;

          span {
            color: 20px;
          }

          &.active {
            background: #008BDB;
          }
        }
      }
    }
  }

  .fire-container {
    height: 800px;
    overflow: hidden;
    position: relative;
    user-select: none;

    .img-c {
      position: absolute;
      font-size: 0px;
      left: 50%;
      top: 50%;
      transform-origin: center;
      transform: translate(-50%, -50%);
      cursor: move;

      &>div {
        height: 100%;
      }
    }

    .main-img {
      /*max-width: 1200px;
			max-height:800px;
			min-width: 100px;
			min-height: 100px; */
      width: 100%;
      height: 100%;
    }

    .modal-drag {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.0001);
      z-index: 3;
    }

    .icon-c {
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: 4;

      &.hasWarning {
        z-index: 999999 !important;
      }

      .icon {
        border-radius: 50%;
        display: inline-block;
        position: relative;
        font-size: 0px;
        transform-origin: center;
        transition: all 0.1s linear;
        cursor: pointer;

        &.curr {
          z-index: 9999999;

          &+.H-mapPopoutF {
            left: 70%;
            top: 70%;
          }

          img {
            width: 30px;
            height: 30px;
          }

          &:before {
            display: none;
          }
        }

        &.active {
          embed {
            background: #00FFFF;
          }
        }

        &:hover {
          transform: scale(1.2);

          .devicename {
            display: block;
          }
        }

        embed {
          border-radius: 50%;
          width: 16px;
          height: 16px;
          min-height: 16px;
          background: #006ABC;
          padding: 2px;
          z-index: 2;
          position: relative;
          cursor: pointer;
          transform: scale(0.8);
          transform-origin: center;
        }

        .devicename {
          display: none;
          position: absolute;
          height: 30px;
          background: rgba(5, 45, 72, 1);
          border: 1px solid rgba(49, 133, 156, 1);
          border-radius: 4px;
          line-height: 30px;
          left: 50%;
          transform: translate(-50%, 0);
          padding: 0px 10px;
          color: #00FFFF;
          bottom: 109%;
          white-space: nowrap;
          font-size: 16px;
        }

        &:before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: 1;
        }
      }

      .fire {
        embed {
          background: rgba(223, 0, 36, 1);
        }

        &:before {
          animation: iconRipple 1s ease-in infinite alternate;
          background: rgba(223, 0, 36, 0.5);
          border: 1px solid rgba(223, 0, 36, 1);
        }
      }

      .warn {
        embed {
          background: rgba(216, 90, 6, 1);
        }

        &:before {
          animation: iconRipple 1s ease-in infinite alternate;
          background: rgba(216, 90, 6, 0.5);
          border: 1px solid rgba(216, 90, 6, 1);
        }
      }

      .fault {
        embed {
          background: rgba(227, 139, 0, 1);
        }

        &:before {
          animation: iconRipple 1s ease-in infinite alternate;
          background: rgba(227, 139, 0, 0.5);
          border: 1px solid rgba(227, 139, 0, 1);
        }
      }

      .other {
        embed {
          background: rgba(4, 182, 0, 1);
        }

        &:before {
          animation: iconRipple 1s ease-in infinite alternate;
          background: rgba(4, 182, 0, 0.5);
          border: 1px solid rgba(4, 182, 0, 1);
        }
      }
    }
  }

  @keyframes iconRipple {
    0% {
      width: 90%;
      height: 90%;
    }

    100% {
      width: 130%;
      height: 130%;
    }
  }
</style>

<style lang="scss" scoped="scoped">
  .buildPop {
    height: 17rem;
    color: #75CBF2;
    width: 25rem;
    background: #001525;
    text-align: center;
    position: relative;
	.red{
		color: #cc1010 !important;
	}
	.orange{
		color: #ec7a00 !important;
	}
    .closeBuild {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
    }

    h1 {
      line-height: 2.1rem;
      padding: 0px 1rem;
      font-size: 0.9rem;
      color: white;
      background: #001525;
      text-align: left;
    }

    .fl {
      width: 50%;
      padding: 1.5rem 0.25rem;
      box-sizing: border-box;

      ul {
        display: inline-block;
        min-width: 8.15rem;
        /*margin: auto;*/
        text-align: center;
        overflow: hidden;

        li {
          float: left;
          width: 50%;
          padding: 0.75rem 0px;
          box-sizing: border-box;
          height: 4.05rem;

          p {
            font-size: 0.9rem;
          }

          .Z-numberf {
            font-size: 1.2rem;
            margin-bottom: 0.25rem;
            min-height: 1.1rem;
          }

          &.border-bottom {
            border-bottom: 1px solid #004E81;
          }

          &.border-right {
            border-right: 1px solid #004E81;
          }
        }
      }

      .el-button {
        margin-top: 1.4rem;
        height: 2rem;
        padding: 0.6rem 1rem;
        font-size: 0.7rem;
      }
    }

    .fr {
      float: right;
      width: 50%;
      padding: 5px;
      padding-top: 2.2rem;
      box-sizing: border-box;

      .content {
        width: 10rem;
        height: 10rem;
        border: 1px solid #004E81;
        position: relative;
        padding: 0px 0.5rem 0.5rem;
        padding-top: 2.8rem;
        margin-top: 1rem;
        box-sizing: border-box;

        .photo {
          position: absolute;
          top: -1.75rem;
          left: 50%;
          margin-left: -1.75rem;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 78, 129, 1);

          img {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;
          }
        }

        p {
          line-height: 1.5rem;
          text-align: center;

          * {
            vertical-align: middle;
          }

          span {
            color: #0ff;
          }

          label {
            color: #75CBF2;
          }

          img {
            display: inline-block;
            margin-right: 0.25rem;
          }
        }

        .el-button {
          display: block;
          margin: auto;
          min-width: 5rem;
          margin-top: 1.05rem;
          padding: 0.35rem 0.75rem;
        }
      }
    }
  }

  .arrow {
    position: absolute;
    left: 20px;
    top: 50%;
    width: 51px;
    height: 106px;
    z-index: 6;
    transform: translate(0, -50%);
    cursor: pointer;
    opacity: 0;
    transition: all .2s linear;

    &.right {
      left: auto;
      right: 20px;
    }
  }

  .el-button--warning {
    color: #fff;
    background-color: #ED7703;
    border-color: #ED7703;
  }
</style>
<style lang="scss">
  .build-unfoBox {
    margin-left: 210px;
  }

  .urge {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(../../../../static/images/urge.png) no-repeat center 1px;
    background-size: 100%;
    vertical-align: middle;

    &+span {
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>
<style lang="scss" scoped="scoped">
  .H-mapPopoutF {
    border: 1px solid #38c1ff;
    overflow: hidden;
    background: #052D48;
    min-width: 355px;
    position: absolute;
    top: 90%;
    left: 90%;
  }

  .H-mapPopoutF * {
    color: #fff;
    font-size: 16px;
  }

  .Z-mapPopout em {
    font-size: 20px;
    color: red;
    margin-left: 6px;
  }

  .PopoutTop {
    height: 39px;
    line-height: 39px;
    font-size: 18px;
    color: #fff;
    background: #004e81;
    padding: 0px 10px;
    position: relative;

    .close {
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 10px;
      font-size: 20px;
    }
  }

  .H-mapPopoutF ul li {
    min-height: 33px;
    line-height: 33px;
    padding: 0px 10px;
    font-size: 20px;
  }

  .H-mapPopoutF ul li:nth-of-type(2n+2) {
    background: #073452
  }

  .H-mapPopoutF ul li i {
    color: #75CBF2;
  }

  .H-mapPopoutF ul li i strong {
    color: #75CBF2;
  }

  .H-mapPopoutF ul li p {
    float: left;
    margin-left: 10px;
    width: 200px;
  }

  .H-mapPopoutF ul li span {
    width: 85px;
    float: left;
  }

  .H-mapPopoutF ul li .alarmDescLow {
    background: url(../../../../static/images/down.png) no-repeat right;
    background-size: 10px 20px;
    padding-right: 20px;
  }

  .H-mapPopoutF ul li .alarmDescUp {
    background: url(../../../../static/images/up.png) no-repeat right;
    background-size: 10px 20px;
    padding-right: 20px;
  }

  .H-mapPopoutF ul li em {
    font-size: 16px;
    color: #fff;
    display: block;
  }

  .Z-mapHandle button {
    font-size: 18px;
    color: #fff;
    height: 39px;
    width: 49.5%;
    background: #0478B7;
    border: none;
    cursor: pointer;
  }

  .Z-mapHandle .Z-butMap2 {
    margin-right: 1%;
  }

  .Z-mapHandle .Z-butMap2:last-child {
    margin-right: 0;
  }

  .Z-mapHandle .Z-butMap3 {
    margin-right: 0.5%;
    width: 33%
  }

  .Z-mapHandle .Z-butMap3:last-child {
    margin-right: 0;
  }

  .Z-mapHandle .Z-butMap1 {
    width: 100%;
  }

  .Z-misinformation {
    background: #1b8cb8;
  }

  .Z-pigeonhole {
    background: #ff9900;
  }

  .mapLatAnimate {
    animation: jump 1s;
  }

  @keyframes jump {
    0% {
      transform: translate(0, 0)
    }

    50% {
      transform: translate(0, 30px)
    }

    100% {
      transform: translate(0, 0)
    }
  }
</style>
