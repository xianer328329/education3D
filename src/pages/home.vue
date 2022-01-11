<template>
  <div class="main-container" @click="publiclose()">
    <header>
      <div class="title">
        <img :src="logSrc" alt="" />
        <!--<h5>{{unitName}}</h5>-->
      </div>
      <div class="rightHead clearFix">
        <time-com class="fl"></time-com>
        <weather-com class="fl"></weather-com>		
		<realAlarmConfig ref="realAlarmConfig"></realAlarmConfig>		
        <div class="dropdown fl Btn">
          <a href="javascript:;">
          	<img title="进入系统" src="../../static/images/header/enter.png" class="enterSystem"  @click.stop="switcuu(curr)"/>
          </a>
		  <div class="dropdown-content clearFix" v-show="curr">
            <a href="javascript:;" @click="enterIntoShelter()">
              <i class="eliof el-icon-news"></i>
              <span class="dropdown-text">宣教与应急服务管理平台</span>
              <i class="elioc el-icon-arrow-right"></i>
            </a>
            <a href="javascript:;" @click="setOpen(item)" v-for="(item,index) in dataList" :key="item.uuid">
              <i class="eliof el-icon-news"></i>
              <span class="dropdown-text">{{item.jumpSysn}}</span>
              <i class="elioc el-icon-arrow-right"></i>
            </a>
            <span class="dropdown-button" @click="addschool()">查看/建立映射</span>
            <div style="clear:both"></div>
          </div>
        </div>
        <div class="Btn fl">
          <!-- <a href="javascript:;" @click="BackChinaMap()" style="display: none;"><img title="返回" src="../../static/images/d64_03.png" alt="" /></a>
          <a href="javascript:;" style="display: none;"><img title="主页面" src="../../static/images/first.png" alt="" /></a>
          <a href="javascript:;" style="display: none;"><img title="修改密码" src="../../static/images/setting.png" alt="" /></a> -->
          
          <a href="javascript:;" @click="logOut"><img title="退出" src="../../static/images/exit.png" alt="" /></a>
        </div>
      </div>
    </header>
    <div class="nav" v-if="NavList.length" @mouseleave="outStyle">
      <p class="site" ref="sit"><img id="navBtn" @click="navToggl" src="../../static/images/nav.png" alt="" /><i>当前位置：</i>
        <a href="javascript:;">{{positio}}</a>
      </p>
      <transition-group name="fade" tag="ul" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
		<!-- <li key="microMap">
			<router-link :to="{path:'/microMap'}" class="haveData">微地图</router-link>
		</li> -->

		<li v-for="(item,index) of NavList" :class="{NO_AuthNav:item.Auth}" v-show="show" :key="item.id" @mouseover="selectStyle(index)" :authName="item.authName" :authDesc="item.name">
          <a @click="returnSystem" :class="{child:item.child,active:active==index,haveData:item.rou}" v-if="item.name=='系统管理'">
            <img class="img" :src="require('../../static/images/'+item.imgUrl+'.png')" alt="">
            <img class="imgon" :src="require('../../static/images/'+item.imgUrl+'on.png')" alt="" /> {{item.name}}
          </a>
          <a href="javascript:;" :class="{child:item.child,active:active==index,haveData:item.rou}" v-else-if="item.child">
            <img class="img" :src="require('../../static/images/'+item.imgUrl+'.png')" alt="">
            <img class="imgon" :src="require('../../static/images/'+item.imgUrl+'on.png')" alt="" /> {{item.name}}
          </a>
          <router-link :to="roterPath(item.rou)" :class="{child:item.child,active:active==index,haveData:item.rou}" v-else>
            <img class="img" :src="require('../../static/images/'+item.imgUrl+'.png')" alt="">
            <img class="imgon" :src="require('../../static/images/'+item.imgUrl+'on.png')" alt="" /> {{item.name}}
          </router-link>
          <ul v-show="item.child" class="nav-2" @click.stop>
            <li v-for="(data,i) of item.child" :key="i" :class="{NO_AuthNav:data.Auth}" v-show="nav2show==index" :authName="data.authName" :authDesc="data.name">
              <router-link :to="'/'+data.rou" class="childLi" :class="{haveData:data.rou,active:active2==i}">
                {{data.name}}
              </router-link>
            </li>

          </ul>
        </li>
      </transition-group>
    </div>
	<template v-if="!alone">
		<div class="max-container">
			<map-com></map-com>
		</div>
		<year-review></year-review>
		<Mappopup></Mappopup>
		<videoLogin />
	</template>
	
    <el-dialog title="查看映射" class="defence-modal" center width="750px" :modal-append-to-body="false" :visible="addcolse" :before-close="closeSub">
      <div class="homes-button fr">
        <el-button type="primary" @click="showform(1)">新增映射</el-button>
      </div>
      <el-table :data="dataList" stripe height="300">
        <el-table-column prop="jumpSysn" label="系统名称"> </el-table-column>
        <el-table-column prop="jumpName" label="用户名"> </el-table-column>
        <el-table-column prop="jumpPass" label="密码">
          <template slot-scope="scope">
            <span>**********</span>
          </template>
        </el-table-column>
        <el-table-column prop="jumpType" label="请求方式"> </el-table-column>
        <!-- <el-table-column prop="jumpPage" label="成功页面"> </el-table-column> -->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <span class="table-button" @click="showform(2,scope.row)">修改</span>
            <span class="table-button" @click="deletejump(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="types==1?'新增映射':'修改'" class="defence-modal" center width="550px" :close-on-click-modal="false" :modal-append-to-body="false" :visible="visibleform" :before-close="closefrom">
      <el-form label-width="80px" :model="formInline">
        <el-form-item label="系统名称">
          <el-input v-model="formInline.jumpSysn" placeholder="请输入系统名称"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formInline.jumpName" placeholder="请输入用户名"></el-input> 
		  <el-input tabindex="-1" style="position: fixed;bottom: -9999px;"></el-input>
        </el-form-item>
        <el-form-item label="密码">
		  <el-input type="password" tabindex="-1" style="position: fixed;bottom: -9999px;"></el-input>
          <el-input v-model="formInline.jumpPass" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input v-model="formInline.jumpType" placeholder="请输入请求方式" show-password></el-input>
        </el-form-item>
        <el-form-item label="成功页面">
          <el-input v-model="formInline.jumpPage" placeholder="请输入成功页面" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import qs from 'qs'
  import timeCom from '../components/time'
  import weatherCom from '../components/weather'
  import Mappopup from '../../src/pages/components/MapPopup'
  import MapCom from '../../src/pages/components/map'
  import YearReview from '../../src/pages/components/review' //学年回顾
  //import navJson from "../../static/mock/nav.json" //菜单json
  import videoLogin from './components/videoLogin'
  import realAlarmConfig from './realAlarmConfig' //实时告警显示配置
  export default {
    name: 'App',
    components: {
      timeCom,
      weatherCom,
      MapCom,
      YearReview,
      //MapMonitoring,
      Mappopup,
      videoLogin,
	  realAlarmConfig,
    },
    data() {
      return {
        types: '',
        curr: false,
        formInline: {},
        dataList: [],
        tableData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
		alone:false,
        unitName: "",
        show: false,
        nav2show: 0, //是否有2级导航栏
        addcolse: false,
        visibleform: false,
        active: false, //导航栏选中
        active2: 999, //2级导航栏选中
        positio: "数据总览",
        width: window.innerWidth,
        height: window.innerHeight,
        NavList: [],
        navData: [],
        logSrc: '../../static/images/defaultLOG.png'

      }
    },
    methods: {
      publiclose() {
        if (this.curr == true) {
          this.curr = !this.curr;
        }
      },
      getjump() {
        this.$axios.post('home/jump/select', {
          userUuid: JSON.parse(localStorage.getItem('USER')).uuid,
        }).then(res => {
          this.dataList = res || [];
        })
      },
      addschool() {
        this.curr = !this.curr;
        this.addcolse = true;;
      },
      deletejump(row) {
        this.$axios.post('/home/jump/delete', {
          uuid: row.uuid,
          userUuid: row.userUuid,
          jumpSysn: row.jumpSysn,
        }).then(res => {
          this.$message({
            message: res.mess,
            type:'success'
          });
          this.getjump();
        })
      },
      closeSub() {
        this.addcolse = false;
      },
      closefrom() {
        this.formInline = {};
        this.visibleform = false;
      },
      switcuu(curr) {
        if (!curr) {
          this.getjump();
        }
        this.curr = !curr;
      },
      platformName() { //获取平台名称
        this.$axios.post('/home/platformName', {
          emulateJSON: true
        }).then((res) => {
          if (res && res.paramsValue) {
            this.logSrc = process.env.IMG_URL + res.paramsValue
          } else {
            this.logSrc = "../../static/images/defaultLOG.png"
          }
        })
      },
      hFindMenu() { //获取菜单
        return this.$axios.post('/home/hFindMenu', {
          emulateJSON: true
        }).then((res)=>{
			this.hFindMenuSucc(res);
			return res;
		})
      },
      hFindMenuSucc(res) {
        this.navData = res;
        res.forEach((itme, index) => {
          if (itme.childNode == 1) {
            this.hFindChildNodeMenu(itme.id, index)
          }
        })
      },
      hFindChildNodeMenu(oid, index) { //获取子菜单
        this.$axios.post('/home/hFindChildNodeMenu', { uuid: oid }, {
          emulateJSON: true
        }).then((res) => {
          this.hFindChildNodeMenuSucc(res, index)
        })
      },
      hFindChildNodeMenuSucc(res, index) {
        this.navData[index].child = res;
        this.ctokenUser();
      },
      reviewCache() {
        this.$axios.post('/home/reviewCache', {
          emulateJSON: true
        }).then()
      },
      navToggl() {
        this.show = !this.show

      },
      selectStyle(index) { //导航栏hover
        this.nav2show = index
      },
      outStyle(index) { //导航栏hover
        this.show = false;
        this.nav2show = false;
      },
      markPositio() {
        this.bus.$emit('handleCloseMapPop');
        var routePath = this.$route.path;
        for (var i = 0; i < this.NavList.length; i++) {
          if (this.NavList[i].childNode == 1&&this.NavList[i].child) {
            for (var j = 0; j < this.NavList[i].child.length; j++) {
              if ('/' + this.NavList[i].child[j].rou == routePath) {
                this.active = i;
                this.active2 = j;
                this.positio = this.NavList[i].child[j].name;
                localStorage.setItem('moduleType', this.NavList[i].child[j].rou);			  
				this.moveSearchCameraEle();//移动id名为searchCamera的元素的位置
                return
              }
            }
          } else {
            if ('/' + this.NavList[i].rou == routePath) {
              this.active = i;
              this.positio = this.NavList[i].name
              localStorage.setItem('moduleType', this.NavList[i].rou);			  
			  this.moveSearchCameraEle();//移动id名为searchCamera的元素的位置
              return;
            }

          }
        }
        if (this.$route.path == "/EmergencySafeguard") {
          this.active = "18000";
          this.active2 = "18000";
          this.positio = "预警中心";
          localStorage.setItem('moduleType', "EmergencySafeguard")
        }
		
		this.moveSearchCameraEle();//移动id名为searchCamera的元素的位置
      },
	  //移动id名为searchCamera的元素的位置
	  moveSearchCameraEle(){
		 this.$nextTick(()=>{
			 // debugger;
			 var ele=document.getElementById('searchCamera');
			 if(ele&&this.$refs.sit){
			   ele.style.left=this.$refs.sit.offsetWidth/fontSize+'rem';
			 }
		 })
	  },
      roterPath(rou) { //路由路径
        if (rou) {
          return '/' + rou
        } else {
          return this.$route.path
        }
      },
      logOut() { //退出登录
        this.$axios.post('user/blogout', {
            emulateJSON: true
          })
          .then(this.logoutSucc);
      },
      logoutSucc(res) {
        localStorage.removeItem('TOKEN');
        this.$router.push({
          path: "/login",
        });
      },
      seeMapSize() {
        if (this.$route.path == "/Index" || this.$route.path == "/") { //首页
          $('#app').removeClass('map-index map-emergency map-shelter map-normal map-emergency-big').addClass('map-index');
        } else if (this.$route.path == "/EmergencySafeguard") {
          $('#app').removeClass('map-index map-emergency map-shelter map-normal map-emergency-big').addClass('map-emergency');
        } else if (this.$route.path == "/Shelter") {
          $('#app').removeClass('map-index map-emergency map-shelter map-normal map-emergency-big').addClass('map-shelter');
        } else {
          $('#app').removeClass('map-index map-emergency map-shelter map-normal map-emergency-big').addClass('map-normal');
        }
      },

      BackChinaMap() {
        window.location.href = "https://edu.cqtss.net:13000/index.html#/ChinaMap";
      },
      ctokenUser() {
        localStorage.removeItem('AuthList');
        this.$axios.post('user/ctokenUser', {
            emulateJSON: true
          })
          .then(this.ctokenUserSucc)
      },
      ctokenUserSucc(mes) {
        AuthList = mes.authList;
        var dept = mes.dept;
        localStorage.setItem('UNITName', dept.deptName)
        localStorage.setItem('unitid', dept.uuid);
        localStorage.setItem('AuthList', JSON.stringify(mes.authList));
        localStorage.setItem("OHTTP", process.env.API_OHTTP); //测试地址
        localStorage.setItem("OHTTPC", process.env.API_OHTTPC); //云端跳转地址
        OHTTPC = localStorage.getItem("OHTTPC");
        OHTTP = localStorage.getItem("OHTTP");
        UNITID = localStorage.getItem('unitid');
        TOKEN = localStorage.getItem('TOKEN');
        UNITName = localStorage.getItem('UNITName');
        this.NavList = NavAuthList(this.navData);
				
        // this.NavList=require('../../static/mock/nav.json').data;
        // this.NavList.forEach((itme,index)=>{
        // 	if(itme.name=="宣教应急"){
        // 		itme.Auth=false
        // 	}
        // })
        this.markPositio()
        this.unitName = localStorage.getItem('UNITName');
        addAuthList();
        this.bus.$emit('AuthLoad', AuthList);
      },

      returnSystem() {
        //返回后台管理系统
        // window.location.href = "https://edu.cqtss.net:36062/#/Home/Emergencysupport?route=0&&token=" + TOKEN;
        window.location.href = process.env.EDU_URL + "#/Home/Emergencysupport?route=0&&token=" + TOKEN;
      },
      enterIntoShelter() { //进入宣教平台
        this.$axios.post(process.env.API_OHTTPH + '/user/demerTokenUser', {
            emulateJSON: true
          })
          .then(this.enterIntoShelterSucc)
      },
      enterIntoShelterSucc(res) {
        var otoken = res.token;
        var href = process.env.API_SELTER + "#/bigPage?route=0&token=" + otoken;
        window.open(href, '_blank');
      },
      getctokenUser() { //宣教跳转到教育保障  获取教育用户信息
        var url = window.location.href; //获取url中"?"符后的字串
        var str = url.slice(url.indexOf("?") + 1)
        if (str.indexOf("TYPE=SHELTER")>-1) {
          if (url.indexOf("token") && url.indexOf("token")>-1) {
            var arr = str.split("&");
            localStorage.setItem('TOKEN', arr[1].split("=")[1]);
            this.ctokenUser()
          } else {
            this.ctokenUser();
          }
        } else {
           this.ctokenUser();
        }
      },
      setOpen(row) {
				// 15025461109、18623110296
		  // http://localhost:8030/=bmFtZSUzRGNxd2wlMjZwYXNzJTNEMTUxNzg5OTAwMDAlMjZ0aW1lJTNEMTYyNzk3OTY3MTE4Mw
			// http://security.cqtss.net/=bmFtZSUzRGNxd2wlMjZwYXNzJTNEMTUxNzg5OTAwMDAlMjZ0aW1lJTNEMTYyNzk3OTY3MTE4Mw  最新
			
        if (row.jumpPage) {
			let index=row.jumpPage.indexOf('?'),url=row.jumpPage;
			if(index>-1){
			   url=url.substring(0,index);
			}
			let card=this.getQueryVariable(row.jumpPage,'card').split(',');
			let jumpPage=url+'='+window.btoa(encodeURIComponent('name='+card[0]+'&pass='+card[1]+'&time='+(new Date().getTime())));
			console.log(jumpPage)
			window.open(jumpPage, '_blank');
        }
      }, 
	  showform(type, row) {
	    // 1 新增 2 修改
	    this.types = type;
	    if (type == 1) {
	      this.formInline = {};
	    } else {
	      this.formInline ={...row};
		  let i=row.jumpPage.indexOf('?');
		  if(i>-1){
			  this.formInline.jumpPage=row.jumpPage.substring(0,i)
		  }
	    }
	    this.visibleform = true;
	  },
	  onSubmit() {
	    this.formInline.userUuid = JSON.parse(localStorage.getItem('USER')).uuid;
	    var URl = "/home/jump/update",row=this.formInline;
	    if (this.types == 1) {
	      URl = "/home/jump/insert"
	    }
		let params={
			...this.formInline,
			jumpPage:row.jumpPage+'?card='+row.jumpName+','+row.jumpPass
		}
	    this.$axios.post(URl,params).then(res => {
	      this.$message({
	        message: res.mess,
	        type: 'success'
	      });
	      this.getjump();
	      this.visibleform = false;
	    })
	  },
	  getQueryVariable(url,variable){
		  let index=url.indexOf('?'),query=url;
		  if(index>-1){
			  query=url.substring(index+1);
		  }
		 var vars = query.split("&");
		 for (var i=0;i<vars.length;i++) {
				 var pair = vars[i].split("=");
				 if(pair[0] == variable){return pair[1];}
		 }
		 return '';
	  },
		getlocalIp() {//获取视频服务地址
			this.$axios.post('home/localIp', {}).then(res => {
				if (res.length == 0) {
					this.$message.error('未配置视频服务地址')
				}
				localStorage.setItem("videoUrl",JSON.stringify(res || []));
				// return [{params_value:'ws:192.168.0.114:7070'}]
			});
		}
    },
    async mounted() {
		  this.alone=this.$route.meta&&this.$route.meta.alone;
		  this.platformName();		  
		  this.reviewCache();
		  this.seeMapSize();
		  this.getlocalIp();
		  await this.hFindMenu();		  
		  this.getctokenUser();

    },

    watch: {
      $route(to, from) {
		this.alone=to.meta&&to.meta.alone;
        allCharts = [];
        this.seeMapSize();
        this.markPositio();
        getpageAuthList();
        this.$nextTick(function() {
          addAuthList();
        })

      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
  .rightHead .Btn img {
    width: 1.5rem;
    height: 1.5rem;
  }

  /* 下拉按钮样式 */
  .dropbtn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #CBCED0;
    padding: 0px 5px 0px 5px;
    margin-top: 3px;
  }

  /* 容器 <div> - 需要定位下拉内容 */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* 下拉内容 (默认隐藏) */
  .dropdown-content {
    display: block;
    position: absolute;
    background-color: rgba(7, 55, 88, 0.8);
    border: solid 1px #0184DB;
    border-radius: 4px;
    margin-top: 2rem;
    min-width: 7.5rem;
    right: -2rem;
    z-index: 2;
    box-sizing: border-box;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  }

  /* 下拉菜单的链接 */
  .dropdown-content a {
    color: #75CBF2;
    padding: 5px 1.5rem 5px 0.5rem;
    text-decoration: none;
    display: block;
	width: 100%;
	box-sizing: border-box;
    position: relative;
	white-space: nowrap;
	float: none;
  }

  .dropdown-text {
    margin-left: 1rem;
  }

  .elioc {
    position: absolute;
    right: 0.25rem;
    top: 0.55rem;
  }

  .eliof {
    position: absolute;
    left: 0.25rem;
    top: 0.55rem;
  }

  .dropdown-content .dropdown-button {
    text-align: center;
    display: block;
    padding: 3px 0px;
    margin: 0.5rem 0.5rem;
    cursor: pointer;
    background: #0479b7;
	clear: both;
  }

  /* 鼠标移上去后修改下拉菜单链接颜色 */
  .dropdown-content a:hover {
    background-color: rgba(6, 122, 183, 0.5);
  }

  /* 在鼠标移上去后显示下拉菜单 */
  .dropdown:hover .dropdown-content {
    display: block;
  }

  /* 当下拉内容显示后修改下拉按钮的背景颜色 */
  .dropdown:hover .dropbtn {
    background-color: rgba(1, 132, 219, 0.2);
  }

  .homes-button {
    margin-bottom: 5px;
  }

  .homes-button span {
    text-align: center;
    display: block;
    padding: 4px 16px;
    border-radius: 2px;
    cursor: pointer;
    color: #75CBF2;
    background: #004e81;
  }

  .table-button {
    cursor: pointer;
  }
</style>
