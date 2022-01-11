<template>
  <!-- 实时告警的查看详情弹窗 -->
  <div id="showdetail">
    <div class="Z-3Popout" v-if="showimg">
      <h5 class="PopoutTop">{{img.imgname}}
        <p class="Z-close" v-on:click="colseimg()"><img src="../../../static/images/Zgb.png" alt="" /></p>
      </h5>
      <h6 class="PopoutTop2 clearFix">
        <div v-show="img.imgsrc2">
          <p class="fl">
				{{img.alarmTypeName}} 
				<template v-if="img.similary">（{{img.similary}}）</template>
				<template v-if="img.Contrast">相似度{{img.Contrast}}%</template>
		  </p>
          <p class="fr"><i class="Z-misinformation" v-on:click="handleFun(1)">误报</i>
            <i class="Z-pigeonhole" v-on:click="handleFun(2)">归档</i>
            <i style="display:none" class="Z-reporting">上报</i></p>
        </div>
      </h6>
      <div class="Pop3img clearFix">
        <div class="popimg popimgL fl" v-show="img.imgsrc">
          <img class="show_img" :src="img.imgsrc" alt="图片加载中" />
          <img class="alpha_img" src="../../../static/images/aa.png" />
        </div>
        <div class="popimg popimgR fr" v-show="img.imgsrc2">
          <img class="show_img" :src="img.imgsrc2" alt="图片加载中" />
          <img class="alpha_img" src="../../../static/images/aa.png" />
          <div class="carouseLast" style="display:none"></div>
          <div class="carouseNext" style="display:none"></div>
          <div class="carouse" style="display:none"><i class="Z-on"></i><i></i><i></i></div>
        </div>
      </div>
      <p class="pop-p fl"><i v-show="img.imgsrc">目标图片</i><i v-show="img.imgsrc2">抓拍图片</i></p>
    </div>
    <div class="Popout Pop3tab" v-show="showpoputable">
      <h4 class="Z-Btitle2">查看详情</h4>
      <h4 class="numberTimes"><span>{{table.deviceName}}<i>{{table.count}}次</i></span>
        <!--<span >累计离线时长  <i>{{table.duration}}</i></span>-->
      </h4>
      <h5 class="Z-close" v-on:click="colsetable()"><img src="../../../static/images/Zgb.png" alt="" /></h5>
      <table class="AlarmTable">
        <tr>
          <th v-for="data in table.tableth">{{data}}</th>
        </tr>
        <tr v-for="(data,index) in table.rows">
          <td v-for="(value, key) in data">{{value}}</td>
        </tr>

      </table>
      <div class="Z-lyPage fr">
        <img src="../../../static/images/first_page.png" v-on:click='firstPages(1)' />
        <img src="../../../static/images/last.png" v-on:click='uppages()' />
        <p>第<input type="text" v-model='table.currentPage'>页 共<span>{{table.pagecount}}</span>页 <i v-on:click='gogages()'>跳转</i></p>
        <img src="../../../static/images/next.png" v-on:click='nextpags()' /><img src="../../../static/images/last_page.png" v-on:click='lastpages()' />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MapPopup',
    data() {
      return {
        showimg: false, //图片弹出框
        showpoputable: false, //table弹出框
        showvoide: false,
        isHik: false,
        isHik: false,
        img: {
          similary: '',
          alarmTypeName: '',
          alarmDesc: "",
          imgname: "",
          imgsrc: '',
          imgsrc2: '',
          Contrast: '',
        },
        table: {
          tableth: ['序号', '设备编号', '设备名称', '告警时间', '描述', '状态'],
          rows: [],
          currentPage: 1, //当前页
          pageSize: 10, //每页条数
          pagecount: "", //总页数
          count: "",
          deviceName: "",
          duration: '',
          alarmObj: {},
        },
      }
    },
    mounted: function() {
      var _this = this;
      this.bus.$off("mappopup").$on("mappopup", (alarmObj)=>{
					this.bus.$emit('closeParts');//关闭分区
					_this.showimgdetail(alarmObj);
      })
    },
    methods: {
      handleFun: function(type) { //误报归档操作
        var alarmId = this.table.alarmObj.uuid;
        var parameter = new FormData();
        parameter.append('alarmId', alarmId);
        parameter.append('handleStatus', type);
        this.$axios.post('home/alarmProcessing', parameter, { //监控报警处理接口请求函数
          emulateJSON: true
        }).then((res) => {
          this.showimg = false;
        });
      },
      showimgdetail: function(alarmObj) {
        if (alarmObj != "undefined") {
          this.table.alarmObj = alarmObj;
        }
        if (!!alarmObj.picUrl||!!alarmObj.oldpicUrl) {
          this.img.similary = alarmObj.similary;
          this.img.alarmTypeName = alarmObj.alarmTypeName;
          this.img.blackName = alarmObj.blackName;
          this.img.imgname = alarmObj.alarmTypeName;
          this.img.imgsrc = alarmObj.oldpicUrl;
          this.img.imgsrc2 = alarmObj.picUrl;
          this.showimg = true;
        }
        if (!!alarmObj.videoUrl) {
          //this.showvoide = true;
          var objcet = {
            deviceM3u8: alarmObj.deviceM3u8,
            title: alarmObj.devicePosition,
            show: true,
            playUrl: alarmObj.videoUrl,
            isplayback: 1,
          }
          Object.assign(objcet, alarmObj);
          this.bus.$emit('addpop3video', objcet);
          //this.playvideos(alarmObj.videoUrl, alarmObj.alarmTime);
        }
        if (!!alarmObj.hasHistory) {
					this.table.currentPage=1;
          var ro = this.table.alarmObj;
          this.monitorAlarmHistory(ro);
          this.showpoputable = true;
        }
      },
      monitorAlarmHistory: function(alarmObj) {
        var vm = this;
        var alarmType = this.table.alarmObj.alarmType.split(".");
        var parameter = new FormData();
        parameter.append("deviceCode", this.table.alarmObj.deviceCode);
        parameter.append("alarmType", alarmType[1]);
        parameter.append("pageSize", this.table.pageSize);
        parameter.append("currentPage", this.table.currentPage);
        this.$axios.post('/home/monitorAlarmHistory', parameter).then((res) => {
          var data = res.rows || [];
          vm.table.rows = [];
          vm.table.pagecount = Math.ceil(res.total / this.table.pageSize);
          vm.table.deviceName = data[0].deviceName;
          vm.table.count = res.total;
          vm.table.duration = secToTime(res.duration);
          for (var i = 0; i < data.length; i++) {
            var row = {
              index: i + 1,
              deviceCode:data[i].deviceCode,
              deviceName:data[i].deviceName,
              alarmTime:data[i].alarmTime,
              alarmDesc:data[i].alarmDesc,
              handleName: data[i].handleName,
            }
            vm.table.rows.push(row);
          }
        }, function(error) {

        })
      },
      firstPages: function(page) { //第一页
        this.table.currentPage = page;
        this.monitorAlarmHistory();

      },
      uppages: function() { //上一页
        if (this.table.currentPage <= 1) {
          return;
        }
        this.table.currentPage -= 1;
        this.monitorAlarmHistory();

      },
      gogages: function() { //跳页

        if (this.table.currentPage >= this.table.pagecount) {
          return;
        }

        this.monitorAlarmHistory();
      },
      nextpags: function() { //下一页
        if (this.table.currentPage >= this.table.pagecount) {
          return;
        }
        this.table.currentPage += 1;
        this.monitorAlarmHistory();

      },
      lastpages: function() { //最后一页
        this.table.currentPage = this.table.pagecount;
        this.monitorAlarmHistory();
      },
      playvideos: function(Code, oTime) {
        var data = JSON.parse(sessionStorage.getItem("platformdata") || "[]");
        var IP = data.videoPlatformIp; //视频服务器Ip地址
        var port = data.videoPlatformPort; //端口号
        var UserName = data.videoPlatformName; //视频系统用户名
        var Password = data.videoPlatformPassword; //视频系统登录密码
        var videoPlatformType = data.videoPlatformType;
        if (videoPlatformType == 1) {
          document.getElementById('videvo').innerHTML = '<object classid="clsid:BE020CC9-521F-4641-85E1-3B631B7ADDD9" id="starvoid" name="starvoid" width="100%" height="100%"><PARAM NAME="ipname" VALUE="' + IP + '"/><PARAM  NAME="UserName" VALUE="' + UserName + '"/><PARAM  NAME="PrivilegeCode" VALUE="0401,0402,"/></object>';
        }
        var v = "<?xml version=\"1.0\" encoding=\"utf-8\"?><LoginInfo><LoginType>2</LoginType><SynLogin>1</SynLogin><IP>" + IP + "</IP><Port>" + port +
          "</Port><UserName>" + UserName + "</UserName><Password>" + Password + "</Password></LoginInfo>";
        starvoid.LoginPlat(v);
        starvoid.SetLayoutType(1);
        starvoid.SetMainToolBarShow(0);

        var N1 = new Date(oTime - 15000).Format("yyyy-MM-dd");
        var H1 = new Date(oTime - 15000).Format("hh:mm:ss");
        var N2 = new Date(parseInt(oTime) + 15000).Format("yyyy-MM-dd");
        var H2 = new Date(parseInt(oTime) + 15000).Format("hh:mm:ss");
        var beginTime = N1 + 'T' + H1 + 'Z';
        var endTime = N2 + 'T' + H2 + 'Z';
        var _param = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" +
          "<PlaybackBasicInfo><CameraIndexCode>" + Code + "</CameraIndexCode>" +
          "<StoreDeviceType>0</StoreDeviceType>" +
          "<BeginTime>" + beginTime + "</BeginTime><EndTime>" + endTime + "</EndTime>" +
          "</PlaybackBasicInfo>";
        var a = starvoid.SetFitLayout(1 * 1); //设置窗口为1*1
        var d = starvoid.SetBasicInfoEx(_param);

      },
      colseimg: function() {
        this.showimg = false;
      },
      postdetail: function(type) {
        this.showpoputable = true;
      },
      colsetable: function() {
        this.showpoputable = false;
      },
      colsevoide: function() {
        this.showvoide = false;
      },
      //			getDate: function(nS) {
      //				return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
      //			}
    },
  }
</script>

<style lang="stylus" scoped>
  .Z-3Popout,
  .MonitorImg {
    // width: 60.5rem;
    height: 31rem;
    border: 1px solid #38c1ff;
    border-radius: 6px;
    overflow: hidden;
    background: #001c2e;
    z-index: 9999;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .Z-3Popout .PopoutTop {
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
  }

  .Z-3Popout .PopoutTop i {
    color: #fff;
    margin-right: 20px;
  }

  #Popout .Z-3Popout .Z-close {
    top: 16px;
    right: 20px;
    width: 30px;
    height: 30px;
  }

  .PopoutTop2 {
    font-size: 1rem;
    height: 3.5rem;
    line-height: 3.5rem;
    padding: 0 1rem;
  }

  .PopoutTop2 p {
    color: #00ffff;
  }

  .PopoutTop2 p i {
    cursor: pointer;
    display: inline-block;
    font-size: 0.9rem;
    color: #fff;
    height: 1.6rem;
    border-radius: 2px;
    text-align: center;
    line-height: 1.6rem;
    padding: 0 0.5rem;
    margin-left: 1rem;
  }

  .Z-3Popout .Pop3img {
    height: 22rem;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .Z-3Popout .popimg {
    width: 22rem;
    height: 22rem;
    border: 1px solid #38c1ff;
    font-size: 0px;
    text-align: center;
  }

  .Z-3Popout .Pop3img .show_img {
    max-width: 21rem;
    max-height: 21rem;
    vertical-align: middle;
    display: inline-block;
  }

  .Z-3Popout .Pop3img .alpha_img {
    height: 100%;
    width: 1px;
    vertical-align: middle;
    display: inline-block;
  }

  .pop-p {
    width: 100%;
    font-size: 18px;
    text-align: center;
  }

  .pop-p i {
    color: #fff;
    display: inline-block;
    width: 50%;
  }

  .popimgR {
    position: relative;
	margin-left:1rem;
  }

  .popimgR .carouseLast {
    width: 50px;
    height: 107px;
    position: absolute;
    top: 233px;
    left: 10px;
    background: url(../../../static/images/zuoyizhang.png) no-repeat center;
  }

  .popimgR .carouseNext {
    width: 50px;
    height: 107px;
    position: absolute;
    top: 233px;
    right: 10px;
    background: url(../../../static/images/youyizhang.png) no-repeat center;
  }

  .popimgR .carouse {
    margin-top: -27px;
  }

  .popimgR .carouse i {
    width: 15px;
    height: 15px;
    background: #9b9b9b;
    border-radius: 50%;
    margin: 0 3px;
    display: inline-block;
  }

  .popimgR .carouse .Z-on {
    background: #4f4f4f;
  }

  #Popout .Pop3tab {
    width: 1100px;
    height: 430px;
    border: 1px solid #38c1ff;
    border-radius: 6px;
    background: #001c2e;
    z-index: 999;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -550px;
    margin-top: -205px;
  }

  .Pop3tab .Z-lyPage {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  #Popout .MonitorImg .carimg {
    height: 600px;
  }

  .numberTimes {
    font-size: 1rem;
    color: #fff;
  }

  .numberTimes span {
    margin-left: 0.5rem;
    margin-right: 4.75rem;
  }

  .numberTimes i {
    color: #00ffff;
    margin-left: 0.2rem;
  }

  #Z-mapPopout .Z-operation {
    z-index: 9;
    position: absolute;
    top: 56px;
    right: 7px;
    width: 58px;
    background: rgba(0, 78, 129, 0.8);
    border-radius: 6px;
    padding-top: 9px;
  }

  #Z-mapPopout .Z-operation i {
    display: block;
    font-size: 14px;
    color: #fff;
    width: 43px;
    height: 15px;
    border-radius: 4px;
    text-align: center;
    line-height: 15px;
    margin: 0 auto;
    margin-bottom: 5px;
  }

  #Z-mapPopout .Z-misinformation {
    background: #1b8cb8;
  }

  #Z-mapPopout .Z-pigeonhole {
    background: #ff9900;
  }

  #Z-mapPopout .Z-reporting {
    background: #ff1111;
  }

  .Z-3Popout .videoPlay {
    height: 700px;
  }

  #Popout .carimg {
    width: 1160px;
    height: 570px;
    margin-top: 50px;
    text-align: center;
  }

  #showdetail .carimg .show_img {
    max-width: 100%;
    max-height: 570px;
    vertical-align: middle;
    display: inline-block;
  }

  #showdetail .carimg .alpha_img {
    height: 100%;
    width: 1px;
    vertical-align: middle;
    display: inline-block;
  }

  #showdetail .carimg p {
    font-size: 18px;
    color: #00ffff;
    text-align: center;
    margin-top: 20px;
  }

  #showdetail .Z-3Popout .Z-close {
    top: 16px;
    right: 20px;
    width: 30px;
    height: 30px;
  }

  #showdetail .Z-misinformation {
    background: #1b8cb8;
  }

  #showdetail .Z-pigeonhole {
    background: #ff9900;
  }

  #showdetail .Z-reporting {
    background: #ff1111;
  }

  #showdetail .Z-3Popout .Z-close {
    top: 0.8rem;
    right: 1rem;
    width: 1.5rem;
    height: 1.5rem;
  }

  #showdetail .Z-3Popout .Z-close img {
    height: 100%;
    width: 100%;
  }

  #showdetail .Z-close {
    position: absolute;
    top: 0.25rem;
    right: 0.5rem;
    width: 1.1rem;
    height: 1.1rem;
    cursor: pointer;
  }

  #showdetail .Z-close img {
    width: 100%;
  }

  #showdetail .Popout .AlarmTable {
    text-align: center;
    background: #073452;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 30px;
  }

  #showdetail .Pop3tab {
    width: 55rem;
    /*height: 430px;*/
    border: 1px solid #38c1ff;
    border-radius: 6px;
    background: #001c2e;
    z-index: 9999;
    position: absolute;
    top: 10%;
    left: 50%;
    margin-left: -27.5rem;
  }
</style>
