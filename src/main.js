import Vue from 'vue'
// 加载App.vue 组件
import App from './App.vue'
// 引入router配置文件
import router from './router'

import Vuex from 'vuex'
// 引入vuex配置文件
import store from './store'

// 引入ElementUI，可以使用其组件
import ElementUI from 'element-ui'
// css文件需手动引入
import 'element-ui/lib/theme-chalk/index.css'

// 引入ajax框架axios配置
import axios from 'axios'

Vue.use(Vuex)
// 代表使用ElementUI组件
Vue.use(ElementUI)
// 设置超时时间为3s
axios.defaults.timeout = 30000
// 配置axios发送请求时携带cookie
axios.defaults.withCredentials = true
// 设置content-type
// 这里处理的是 针对SpringMVC Controller 无法正确获得请求参数的问题
axios.interceptors.request.use(
  config => {
    let data = config.data
    let key = Object.keys(data)
    // 重写data，由{"name":"name","password":"password"} 改为 name=name&password=password
    config.data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&'))
    // 设置Content-Type
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 异常及公共处理
// axios.interceptors.response.use(response => {
//   if (response.data.code === -222) {
//     this.$store.commit('logOut')
//   }
// }, error => {
//   console.log('err:' + error)
//   return Promise.reject(error)
// })

// 将axios挂载到Vue原型上方便调用
Vue.prototype.$axios = axios

// 设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
