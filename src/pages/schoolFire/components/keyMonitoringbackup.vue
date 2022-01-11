<template>
	<div class="keyMonitoring">
  		<h4 class="mdTitle">重点监控</h4>
  		<div class="Z-L fl">
					<ul class="Z-tabulate" id="Z-tabulate">
					<li class="monitorTitle">监控总览 </li>
                         <!--<li><p class="fl" title="重点监控">重点监控</p><img class="fr" src="../../../../static/images/add15.png" alt=""></li>
                        <li class="Z-on">消防重点部位</li>
                        <li>避难层/间</li>
                        <li>疏散通道</li>
                        <li>安全出口</li>
                        <li>防火卷帘</li>
                        <li>消防电梯</li>
                        <li>消防车通道</li>
                        <li>救援场地</li>
                        <li>微型站</li>
                        <li>人流集中场所</li>-->
					</ul>
					<div class="Z-btnM">
						<span class="Z-spn1" id="pageLast"></span>
						<span class="Z-spn2" id="addVideo"></span>
						<span class="Z-spn3" id="delVideo"></span>
						<span class="Z-spn4" id="pageNext"></span>
						<div class="Z-addVideopop" id="Z-addNamepop">
							<div class="Z-input" style="margin-top:64px;"><label>监控类别</label><input id="addNameint" type="text"  placeholder="输入重点监控类别名称 " /></div>
							<div class="Z-btnVideo clearFix">
								<button type="button" class="fl Z-yes" id="addNamebtn">添加</button>
								<button type="button" class="fr Z-cancel Z-slideUp">取消</button>
							</div>
						</div>
						<div class="Z-addVideopop" id="Z-delNamepop">
							<p>确定删除？？？</p>
							<div class="Z-btnVideo clearFix">
								<button type="button" class="fl Z-yes" id="delNamebtn">确定</button>
								<button type="button" class="fr Z-cancel Z-slideUp">取消</button>
							</div>
						</div>
						<div class="Z-addVideopop" id="Z-addVideopop">
							<div class="Z-close Z-slideUp"></div>
							<div class="Z-videoType">
								<h6 id="partName">监控总览</h6>
								<div class="Z-videoTypeList">
									<ul></ul>
								</div>
							</div>
							<div class="Z-input clearFix"><input class="fl" id="seekInt" type="text" placeholder="输入监控名称"/><span  class="fr Z-seek" id="videoSeek"></span></div>
							<div class="Z-delList">
								<ul id="addAllList">
									<!-- <li><p>A区-十一舍外</p></li> -->
								</ul>
							</div>
							<div class="Z-btnVideo clearFix">
								<button type="button" class="fl Z-yes" id="addVideo2">添加</button>
								<button type="button" class="fr Z-cancel Z-slideUp">取消</button>
							</div>
						</div>
						<div class="Z-addVideopop" id="Z-delVideopop">
							<div class="Z-close Z-slideUp"></div>
							<div class="Z-videoType">
								<h6>监控总览</h6>
								<div class="Z-videoTypeList">
									<ul id="delvideoType"></ul>
								</div>
							</div>
							<div class="Z-delList">
								<ul id="delPartList"></ul>
							</div>
							<div class="Z-btnVideo clearFix">
								<button type="button" class="fl Z-yes" id="delPartVedio">删除</button>
								<button type="button" class="fr Z-cancel Z-slideUp">取消</button>
							</div>
						</div>
					</div>
				</div>
				<div class="Z-R fr">
					<div class="Z-top clearFix">
						<h4 class="fl">重点部位监控</h4>
						
					</div>
					<div class="Z-vdo" id="vlcVideo" ></div>
					<div class="Z-btnM fr">
							<i class="Z-numberf" id="Z-numberf">0</i>
							<span id="Z-last" class="Z-spn1 fl"></span>
							<span id="Z-next" class="Z-spn2 fl"></span>
					</div>
				</div>

		
	</div>
</template>
<script>
/* eslint-disable */
export default {
  name: 'keyMonitoring',
  data(){
  	return {
  		
  	}
  },
  methods:{
 	
  },
  mounted:function(){

    MLoginPlat();
	MaddVideo();
	Mtabulate(); //重点监控导航栏
	MmListpage(); //重点监控分页
	MlistPartIdAndName(); //获取本单位重点监控部位信息
	MdelPartList();
	MvideoSeek();
	MpartNameClick();
	
  },
}
</script>

<style lang="stylus">
.keyMonitoring .Z-L{margin-top:10px;}
.keyMonitoring .Z-L .Z-tabulate{width:114px; height:288px; border:1px solid #384e5e;}
.keyMonitoring .Z-L .Z-tabulate li{height:21px; line-height:21px; border-bottom:1px solid #526876; font-size:16px; color:#83919b; padding-left:10px;cursor:pointer;}
.keyMonitoring .Z-L .Z-tabulate li img{width:12px; height: 20px; margin-right: 7px;}
.keyMonitoring .Z-L .Z-tabulate .minus{width:12px; height:21px; background:url(../../../../static/images/add15.png) no-repeat center;    background-size: 14px 14px;    margin-right: 6px;}
.keyMonitoring .Z-L .Z-tabulate li p{width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size: 16px;}
.keyMonitoring .Z-L .Z-tabulate .Z-on{color:#00ffff; background:rgba(0,255,255,0.1);}
.keyMonitoring .Z-L .Z-tabulate li:not(.monitorTitle):hover{border:none; color:#00ffff; background-size:100% 100%;}
.keyMonitoring .Z-L .Z-btnM{margin-top:22px; position:relative;}
.keyMonitoring .Z-L .Z-btnM span{float:left;cursor:pointer; }
.keyMonitoring .Z-L .Z-btnM .Z-spn1{width:20px; height:24px; background:url(../../../../static/images/d205_03.png) no-repeat center; background-size:100% 100%; margin-right:13px; opacity:0.5}
.keyMonitoring .Z-L .Z-btnM .Z-spn4{width:20px; height:24px; background:url(../../../../static/images/d205.png) no-repeat center;  background-size:100% 100%; }
.keyMonitoring .Z-L .Z-btnM .Z-spn2{width:20px; height:20px; background:url(../../../../static/images/d207_03.png) no-repeat center; background-size:100% 100%; margin-top:4px; margin-right:10px;}
.keyMonitoring .Z-L .Z-btnM .Z-spn3{width:20px; height:20px; background:url(../../../../static/images/d208_03.png) no-repeat center; background-size:100% 100%; margin-top:4px; margin-right:12px;}
.keyMonitoring  .Z-R{width:338px;}
.keyMonitoring  .Z-R .Z-top h4{width:150px; height:30px; font-size:16px; color:#00ffff; line-height:30px; text-align:center;}
.keyMonitoring  .Z-R .Z-top {    margin-top: -19px;
    float: right;}
.keyMonitoring .Z-R .Z-btnM{}
.keyMonitoring .Z-R .Z-btnM i{font-size:20px; color:#a8a9b6;text-align: center; border:1px solid #8e90ab; background:#072133; height:22px; line-height:22px; min-width:50px; padding:0 15px; float:left;}
.keyMonitoring .Z-R .Z-btnM{cursor:pointer;  margin-top:22px;}
.keyMonitoring .Z-R .Z-btnM .Z-spn1{width:24px; height:24px; background:url(../../../../static/images/d205_03.png) no-repeat center; background-size:100% 100%;  margin-left:11px;opacity:0.5;}
.keyMonitoring .Z-R .Z-btnM .Z-spn2{width:24px; height:24px; background:url(../../../../static/images/d205.png) no-repeat center;  background-size:100% 100%; margin-left:8px;}
.keyMonitoring.Z-R .Z-vdo{width:392px; height:200px; border:1px solid #fff; margin-top:9px; position:relative; z-index:1;top: 0px;left: 0px;}
/*.keyMonitoring .Z-R .Z-vdo  object{width:422px !important; height:244px !important;}*/
.Z-addVideopop{background: url(../../../../static/images/add9.png) no-repeat center; background-size:100% 100%;cursor: pointer;width:294px; height:266px; position:absolute; top:-289px; left:-178px; color:#fff; font-size:16px;z-index:99; display:none; }
.Z-addVideopop .Z-close{background: url(../../../../static/images/add10.png) no-repeat center; width:30px; height:30px;position:absolute; top:0px; right:0px;cursor: pointer;z-index: 99;}
.Z-addVideopop h6{height:30px; display:inline-block;padding-right: 32px; border-bottom:1px solid #36373e; text-align:center; line-height:30px; font-size:18px;background: url(../../../../static/images/add11.png) no-repeat right;background-size: 12px;}
.Z-addVideopop .Z-input{height:30px; border-bottom:1px solid #36373e;line-height:30px;}
.Z-addVideopop .Z-input label{margin-left:15px;}
.Z-addVideopop .Z-input em{color:red; margin-left:6px;}
.Z-addVideopop .Z-input input{background:none; font-size:16px; color:#fff; margin-left:12px; width:165px; height:30px;}
.Z-addVideopop .Z-btnVideo button{font-size:16px; color:#fff; background:none; border:none;}
.Z-addVideopop .Z-btnVideo .Z-yes{background:#008085; border:none; padding:1px 8px; border-radius:2px;}
.Z-addVideopop .Z-btnVideo{width:90%; position: absolute;bottom: 17px;left: 5%}
.Z-videoType{text-align:center; position:relative; }
.Z-videoType ul{height:150px;overflow:auto; width: 158px; }
.Z-videoTypeList{height:150px;width: 140px;overflow: hidden;position:absolute; top:30px; left:27%; border:1px solid #00ffff;padding:6px 0px; z-index: 999; background:#00010a;display:none;}
.Z-videoTypeList ul .Z-on{color:#00ffff;}
.Z-delList{height:180px;overflow: hidden;width:100%; }
.Z-delList ul{height:180px; overflow:auto; width:320px; } 
.Z-delList ul li{height:30px; border-bottom:1px solid #36373e;line-height:30px; padding:0 15px;}
.Z-delList ul p{height:30px;line-height:30px;background:url(../../../../static/images/add12.png) no-repeat left; padding-left:17px;font-size: 14px;width:250px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.Z-delList ul .Z-on p{background:url(../../../../static/images/add13.png) no-repeat left;}
.Z-tabulate .monitorTitle {background:url(../../../../static/images/add14.png) no-repeat 95px; background-size:12px 12px;}
#Z-delNamepop p{text-align: center;margin-top:60px;font-size: 18px;}
#Z-delNamepop{z-index:999;}
#Z-addVideopop .Z-seek{background: url(../../../../static/images/x49.png) no-repeat center;width: 30px;height: 30px;cursor: pointer;}
#Z-addVideopop .Z-delList{height:155px;}
#Z-addVideopop .Z-delList ul{height:155px; } 
#Z-xfvideo{width:100%; height:100%;}
#vlcVideo{    position: relative; width:338px; height:286px; overflow: hidden;    border: 1px solid #526876;}
</style>
