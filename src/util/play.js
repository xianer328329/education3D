import Vue from 'vue'
import axios from '../axios';
import { EventBus } from "./event-bus.js";
import { Bus } from "./bus.js";
import { Message } from 'element-ui';
var ws_back = null; //ws 地址
//回放
var objcect = null;
var partId = null;
var oid = null;
var palery = null;
// 实时
var previewobj = null; //播放所需的字段
var previewpid = null; //父级元素的id
var previewoid = null; //播放元素自身的id
async function SplicingRstp(obj) {
  /*
   * 拼接 实时rtsp
   */
  obj.subPlatForma = obj.subplatform||obj.subPlatform || obj.subPlatForm || obj.subPlatforma||obj.subPlatForma;
  let rtsp = null;
  const localIp = await getlocalIp();
  if (localIp.length == 0) {
    return '';
  }
  rtsp = localIp[0].params_value + '/rtsp';
  rtsp+=Bus.getVideoPlayUrl(obj).realurl; 
  return rtsp;;
}

async function SplicingplaybackRstp(obj) {
  /*
   * 拼接 回放rtsp
   */
  let rtsp = null;
  const localIp = await getlocalIp();
  if (localIp.length == 0) {
    return '';
  }
  rtsp = localIp[0].params_value + '/rtsp';
  rtsp+=Bus.getVideoPlayUrl(obj).backurl;
  return rtsp;
}
async function getlocalIp() {
  /*
   * 获取实时预览服务地址
   */
   return new Promise((resolve,reject)=>{
		var videoUrls=JSON.parse(localStorage.getItem("videoUrl")||'[]');
		resolve(videoUrls)
   })
}

function userLogin(flag, type) {
  let obj = {
    flag: flag,
    type: type
  };
  EventBus.$emit('videoLogin', obj)
}

function usersubnmit() {
  EventBus.$on("formInline", function(mes) {
    if (mes.type == 1) {
      //实时
      previewobj.deviceUser = mes.user;
      previewobj.devicePass = mes.passw;
      preview(previewobj, previewpid, previewoid);
      setipcpassw(previewobj); //修改密码
    } else {
      objcect.deviceUser = mes.user;
      objcect.devicePass = mes.passw;
      playback(objcect, partId, oid);
      wsbackclose();
    }

  })
}

function setipcpassw(obj) {
  axios.post('/home/updateDevice', obj).then(res => {

  });
}
export async function preview(obj, parteId, id, id2) {
  /*
   * 实时预览
   */
  //	console.log("----------实时---------------")
  // console.log(obj)
  //

   obj.subPlatForma = obj.subplatform||obj.subPlatform || obj.subPlatForm || obj.subPlatforma||obj.subPlatForma;
   
  previewobj = obj;
  previewpid = parteId;
  previewoid = id;
  const elment = document.getElementById(id);
  if (elment == null) {
		// class="video-js vjs-default-skin" 
    document.getElementById(parteId).innerHTML = '<video id="' + id + '"  autoplay muted preload="auto"></video> <canvas class="videocanvas" id="' + id2 + '" style="display:none"></canvas>';
  }
  if (window.Streamedian) {
    let deviceRstp, wsrtsp;
    const localIp = await getlocalIp();
    wsrtsp = localIp[0].params_value
    wsrtsp = await SplicingRstp(obj);
    // wsrtsp += 'ws://192.168.0.29:7070/rtsp?firm=2&id=cameraCode&ip=192.168.0.45&user=admin&pwd=admin123&chl=1&subtype=1'
    if (wsrtsp == '') return
    console.log("-------------" + wsrtsp + "--------------")
    usersubnmit(); //加载监听事件
    let errorHandler = function(err) {
      let mess;
      if (err.length > 0) {
        mess = err[0];
        if (mess.indexOf('401') != -1) { // 用户名或密码错误
          userLogin(true, 1);
        }
      } else {
        console.log(err)
      }
    };

    if (palery) {
      palery.destroy();
      palery = null;
    }
    const playerOptions = {
      socket: wsrtsp,
      redirectNativeMediaErrors: true,
      rtspUrll: deviceRstp,
      bufferDuration: 0,
      errormessage: errorHandler,
    };
    console.log('-------------开始播放-------------')
    palery = Streamedian.player(id, playerOptions, id2);
  }
}
export async function playback(obj, parteId, id, id2) {
  objcect = obj;
  partId = parteId;
  oid = id;
  //	console.log("---------------------回放----------------------------")
  //	console.log(obj)
  /*
   * 视频回放
   */
  usersubnmit(); // 加载事件监听
  const elment = document.getElementById(id);
  //  class="video-js vjs-default-skin"
  document.getElementById(parteId).innerHTML = '<video id="' + id + '"  autoplay muted preload="auto"></video> <canvas class="videocanvas" id="' + id2 + '" style="display:none"></canvas>';
  let deviceRstp;
  // let wsrtsp = 'ws://192.168.0.29:7070/rtsp?firm=2&id=cameraCode&ip=192.168.0.45&user=admin&pwd=admin123&chl=1&subtype=1&playback=0&start=2020-08-04 12:00:00"';
  let wsrtsp = await SplicingplaybackRstp(obj);
  if (wsrtsp == '') return
  console.log("----------" + wsrtsp + "------------------")
  let errorHandler = function(err) {
    let mess;
    if (err.length > 0) {
      mess = err[0];
      if (mess.indexOf('401') != -1) { // 用户名或密码错误
        userLogin(true, 1);
      }
    } else {
      console.log(err)
    }
  };
  const playerOptions = {
    socket: wsrtsp,
    redirectNativeMediaErrors: true,
    rtspUrll: deviceRstp,
    bufferDuration: 0,
    errormessage: errorHandler,
  };
  // con
  Streamedian.player(id, playerOptions, id2);
}

export function wsbackclose() {
  console.log("-------关闭--------");
  if (palery) {
    palery.destroy();
  }
  if (!ws_back)
    return
  ws_back.close();
}
export default {
  preview,
  playback,
  wsbackclose
}
