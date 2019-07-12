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

Vue.use(Vuex)
Vue.use(ElementUI)

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
