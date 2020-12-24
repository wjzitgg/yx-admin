// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'default-passive-events'
import App from './App'
import router from './router'
import axios from 'axios'
import { get, post, del, put } from "@/api/api.js"


Vue.use(ElementUI);
Vue.config.productionTip = false
// 请求路由
Vue.prototype.$axios = axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$del = del;
Vue.prototype.$put = put;
// axios.defaults.withCredentials=true;
axios.defaults.baseURL = 'http://5343.94un.com/admin/';
// axios.defaults.baseURL = '/api';


// request拦截器
axios.interceptors.request.use(
  config => {
    // console.log(config);
    config.headers['Content-Type'] = 'application/json'
    let token = window.localStorage.getItem('token')
    if (token) {
      // console.log(token);
      config.headers['token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // let cooke = this.$cookies.get("PHPSESSID");
    // if (cooke) {
    //   console.log(123);
    //   config.headers['Set-Cookie'] = 'PHPSESSID=' + this.$cookies.get("PHPSESSID");
    // }
    return config
  },
  error => {
    Promise.reject(error)
  }
)



//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if(!token && to.path !== '/login'){
      next('/login');
  }else{
      next();
  }
})





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
