import Vue from 'vue'
Vue.component('back-box', {
  template: `<div class="Z-border">
			  <i class="Z-bLT Z-b"></i>
			  <i class="Z-bRT Z-b"></i>
			  <i class="Z-bLB  Z-b"></i>
			  <i class="Z-bRB Z-b"></i>
			  <slot></slot>
			</div>`,
})
Vue.component('section-box', {
  template: `<div class="nav-section">
				<back-box>
					 <slot></slot>
				</back-box>
			  </div>`,
})
export const Bus=Vue.prototype.bus=new Vue({
	methods:{
		//获取数据字典
		getDic(dictType,dictName,dictUuid){
			var vm=this;
			var params={};
			dictType?params.dictType=dictType:null;
			dictName?params.dictName=dictName:null;
			dictUuid?params.dictUuid=dictUuid:null;
			return new Promise(function(resolve,reject){
				vm.$axios.post(process.env.API_OHTTPH+'system/dict/aqueryList',params,()=>{
					resolve([]);
				},true).then((res) => {
					resolve(res||[]);
				})
			})
		},
		getVideoPlayUrl(obj){
			/*
			 * {传入参数}
			 * obj:{
			 *  
			 * subPlatform:平台 1海康 2大华 3宇视 4 华为  5 海康插件播放
			 * 
			 * 	isplayback:要播放的类型  1实时 2回放
			 *  deviceLocation:录像存储位置：0-中心存储(cvr)，1-设备存储(nvr)
			 *  deviceCode:摄像头编号
			 * 	startTime:播放开始时间 格式yyyy-MM-dd hh:mm:ss
			 * 	endTime:播放结束时间 格式yyyy-MM-dd hh:mm:ss
			 * 	deviceName:当类型为宇视时需要 设备名称
			 * 
			 * deviceIp:摄像头ip地址
			 * deviceUser:摄像头用户名
			 * devicePass:摄像头密码
			 *
			 * nvrDeviceIp: nvr ip地址
			 * nvrDeviceUser: nvr 用户名
			 * nvrDevicePass: nvr 密码
			 * deviceNo:nvr通道号
			 * 
			 * deviceRstp  插件播放所需参数 '{ip,APPKEY,SECRET}'
			 * 
			 * }
			 * */
			
			obj.subPlatform = obj.subplatform||obj.subPlatform || obj.subPlatForm || obj.subPlatforma||obj.subPlatForma;
			let deviceCode = obj.deviceCode;
			obj.id=deviceCode;
			
			let deviceIp=obj.deviceIp,deviceUser=obj.deviceUser,devicePass=obj.devicePass;
			
			// obj.subPlatform==1  
			if(obj.isplayback!=1){
				  deviceIp=obj.nvrDeviceIp||obj.deviceIp;
				  deviceUser=obj.nvrDeviceUser||obj.deviceUser;
				  devicePass=obj.nvrDevicePass||obj.devicePass;
			}
			
			obj.chl = obj.deviceNo;
				
			if (obj.subPlatform== 2 && deviceCode) {
				let code = deviceCode.split('$');
				obj.chl = parseInt(code[code.length - 1]) + 1;
			}
			if (obj.subPlatform == 3 && deviceCode) {
				// obj.chl = deviceCode[deviceCode.length - 2].toString();
				// obj.chl += deviceCode[deviceCode.length - 1].toString();
				obj.chl=deviceCode;
			}
			if (obj.subPlatform == 4) {
				// 华为摄像机 特殊处理# 替换成‘%23’
				if (deviceCode.indexOf('#') != -1) {
					obj.id= deviceCode.replace('#', '%23');
				} else {
					this.$message.error('错误 deviceCode=' + deviceCode)
				}
			}	
			
			var start='',end='';
			obj.startTime=obj.startTime||obj.alarmTime;
			obj.alarmTime=obj.alarmTime||obj.startTime;
			if(obj.startTime){//回放时间段
				try{
					var d1=new Date(obj.startTime);
					if(obj.endTime){
						var d2=new Date(obj.endTime);
					}else{
						var d2=new Date(obj.startTime);
						d2.setTime(d2.getTime()+5*60*1000);
					}
					
					if(obj.subPlatform ==3){//宇视视频
						start=d1.Format('yyyyMMdd')+'T'+d1.Format('hhmmss')+'Z';
						end=d2.Format('yyyyMMdd')+'T'+d2.Format('hhmmss')+'Z';
					} else{
						start=obj.startTime;
						end=d2.Format('yyyy-MM-dd hh:mm:ss');
					}		
				}catch(e){
					//TODO handle the exception
				}
			}
		
			obj.realurl='?firm='+obj.subPlatform+'&id='+obj.id+'&ip='+obj.deviceIp+'&user='+obj.deviceUser+'&pwd='+obj.devicePass+'&deviceCode='+obj.deviceCode+'&chl='+(obj.subPlatform==1?obj.chl:1)+'&subtype=1&playback=0';	
			obj.backurl='?firm='+obj.subPlatform+'&id='+obj.id+'&ip='+deviceIp+'&user='+deviceUser+'&pwd='+devicePass+'&deviceCode='+obj.deviceCode+'&chl='+obj.chl+'&subtype=1&playback=1&start='+start+'&end='+end;
			
			console.log(obj);
			return obj;
		},
		exportExcel(url,params,filename) {
			this.$confirm("此操作将导出数据, 是否继续?", '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  // customClass: "PromptDelete",
			  type: 'warning'
			}).then((res) => {
			  this.$axios.post(url,params,{responseType: 'arraybuffer'}).then((res) => {
				var blob = new Blob([res.data]);
				var downloadElement = document.createElement('a');
				var href = window.URL.createObjectURL(blob); //创建下载的链接
				downloadElement.href = href;
				downloadElement.download = filename+".xls"; //下载后文件名
				document.body.appendChild(downloadElement);
				downloadElement.click(); //点击下载
				document.body.removeChild(downloadElement); //下载完成移除元素
				window.URL.revokeObjectURL(href); //释放掉blob对象
			  })
			}).catch((e) => {
			  
			});
		  },
	}
})



