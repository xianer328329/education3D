import axios from './index.js';
import Vue from 'vue';
var el=new Vue({});

const newAxios={	
	/* post请求
	   @param url{string} 请求地址
	   @param params{object} 请求参数
	   @param errorCallback{string|function} 错误回调函数，或者是headers参数
	   @param noLoading{boolean} true:不显示加载框,false:显示加载框
	 */
	post(url,params,errorCallback,noLoading){
		var headers=typeof(errorCallback)=='object'?errorCallback:{};
		return axios.post(url,params,headers).then(res=>{
			return res
		}).catch(data=>{
			if(errorCallback&&typeof(errorCallback)!='object'){
				errorCallback(data,data.mess||data.msg||'请求失败,请稍后重试')
			}else{
				if(data.code1==401){//无权限
					// console.log(data.mess)
				}else{
					messtips(data.mess)
				}	
			}
			return new Promise(()=>{
				console.log(url,data.mess)
			})
		})
	},	
	/* get请求
	   @param url{string} 请求地址
	   @param params{object} 请求参数
	   @param errorCallback{string|function} 错误回调函数，或者是headers参数
	   @param noLoading{boolean} true:不显示加载框,false:显示加载框
	 */
	get(url,params,errorCallback,noLoading){
		var headers=typeof(errorCallback)=='object'?errorCallback:{};
		return axios.get(url,params,headers).then(res=>{
			return res
		}).catch(data=>{
			console.log(url);
			if(errorCallback&&typeof(errorCallback)!='object'){
				errorCallback(data,data.mess||data.msg||'请求失败,请稍后重试')
			}else{
				messtips(data.mess)
			}
			return new Promise(()=>{
				console.log(data)
			})
		})
	},
	all:axios.all,
	spread:axios.spread
}
function messtips(mess) {
	el.$message.error(mess||'请求失败,请稍后重试');
};
export default newAxios;
