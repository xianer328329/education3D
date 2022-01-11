import axios from 'axios';
import config from '../../config';
import { Message, Loading } from 'element-ui';
import router from '../router'
/**
 * http配置
 */
// 超时时间
axios.defaults.timeout = 300000
// http请求拦截器

axios.interceptors.request.use(
	config => {
		var oUrl = config.url||'';
		if(oUrl.substring(0, 4) != "http") {
			if(oUrl.substring(0, 4) != "/api"){
				if((oUrl.indexOf('user/blogout') > -1) || (oUrl.indexOf('user/ctokenUser') > -1) || (oUrl.indexOf('xfbd/fireMonitor') > -1)) {
					config.url = process.env.API_OHTTPH + oUrl;
				} else if(oUrl.indexOf('box/') > -1) {
					config.url = process.env.API_BLACKBOX + oUrl;
				} else {
					config.url = process.env.API_OHTTP + oUrl;
				}
			}
			if(oUrl.indexOf('edu/') != -1) { //宣教应急
				config.url = process.env.API_BLACKBOX + oUrl;
			}
		}
		
		if(localStorage.getItem('TOKEN') && oUrl != "https://free-api.heweather.com/s6/weather/forecast?location=auto_ip&key=0c45d1ee66e54915a3b065d68b053814") {
			// header都加上token
			config.headers.token = `${localStorage.getItem('TOKEN')}`;
		}
		return config;
	},
	error => {
		
		return Promise.reject(error);
	}
)

// http响应拦截器
axios.interceptors.response.use(
	response => {
		if(response.status == "200") {
			let head = response.headers;
			/**
			 * 导出配置
			 */
			if (head['content-type'].indexOf('application/octet-stream')>-1) {
				return response;
			}
			
			var res = response.data;
			if(res.code == "200") {
				if(res.data) { //老接口 res.data有可能不存在  直接是 list :[]数据
					if(res.data.code == 0) {
						if(res.data.total||res.data.camerList) {
							return res.data
						} else if(res.data.data) {
							return res.data.data
						} else {
							return res.data
						}
					} else if(res.data.code > 0) {
						return res.data.data
					} else if(res.data.code < 0) {
						// Message.error({
						// 	message: res.data.mess || '操作失败'
						// });

						// return res.data || []; //必须返回错误信息 获取验证码接口需要code进行判断
						return Promise.reject(res.data||{})	
					} else {
						return res.data
					}
				} else {
					return res
				}

			} else {
				if(res.code=='501'){
					router.replace({
						path: "/login"
					})
				}
				if(response.config.url == "https://free-api.heweather.com/s6/weather/forecast?location=auto_ip&key=0c45d1ee66e54915a3b065d68b053814") {
					return res
				} 
				
				return Promise.reject({...(response||{}),mess:res.mess||response.mess|| '操作失败',code1:res.code})	
				
			}
		} else {			
			return Promise.reject({...(response||{}),mess:response.data&&response.data.mess})
		}

	},
	error => {
		// 返回接口返回的错误信息
		return Promise.reject(error);
	}
)

export default axios