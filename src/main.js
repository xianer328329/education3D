// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'　
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/styles/base.css'
import './assets/styles/animate.css'
import './assets/styles/borderAnimation.css'
import './assets/styles/video-js.min.css'
import './assets/styles/selfAdaption.css'

import axios from './axios/newAxios.js'
import ElementUI from 'element-ui';// elementUi
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/elementUi.css';// 覆盖elementUi样式
import countTo from 'vue-count-to';//数字动态变化
import './util/bus.js';

Vue.prototype.$axios = axios;

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
