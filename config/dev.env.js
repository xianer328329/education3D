'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

/*
 * 每次改变URL都要重启项目
 * 调用方式  process.env.API_OHTTPH
 * 			process.env.API_OHTTP
 * */

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	API_HOST: "/log/",
	//用户管理后台地址
	// API_OHTTPH: '"http://192.168.0.29:19090/"',
	//前端页面后台地址
	// API_OHTTP: '"http://192.168.0.29:18080/"',
	// 用户管理后台地址
	API_OHTTPH: '"https://edu.cqtss.net:36063/reuser3/"',
	// 前端页面后台地址
	API_OHTTP: '"https://edu.cqtss.net:36063/rebuild3/"',
	// 跳转后台页面地址
	EDU_URL:'"https://edu.cqtss.net:36063/backstage/"',
	// 图片服务器的地址
	IMG_URL: '"https://edu.cqtss.net:36063/fastdfs/"',
	// 黑箱管理后台地址
	API_BLACKBOX:'"https://edu.cqtss.net:36063/emerapi/"',
	// 宣教考培地址
	// API_EMER:'"http://192.168.0.29:9092/"',
	API_EMER:'"https://emer.cqtss.net/exam/"',
	// 跳转云端页面地址
	API_OHTTPC: '"https://120.77.45.59:13000/"',
	// 跳转宣教页面地址
	API_SELTER:'"http://192.168.0.137:8080/"',
	WS_URL:'"wss://emer.cqtss.net/conn"',  //宣教websocket地址
})
