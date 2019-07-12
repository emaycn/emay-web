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

import SystemConfig from '@/../static/SystemConfig'
import HttpUtils from '@/utils/HttpUtils'
import AuthUtils from '@/utils/AuthUtils'

Vue.use(Vuex)
Vue.use(ElementUI)

// 设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false

Vue.prototype.SystemConfig = SystemConfig
Vue.prototype.HttpUtils = HttpUtils
Vue.prototype.AuthUtils = AuthUtils

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/')
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
