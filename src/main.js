import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import httpRequest from './assets/httpRequest' // api: https://github.com/axios/axios
Vue.config.productionTip = false
Vue.use(ElementUI);
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
new Vue({
  render: h => h(App),
}).$mount('#app')
