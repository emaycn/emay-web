// 加载VUE
import Vue from 'vue'
// import axios from 'axios'
// Vue.prototype.$axios = axios
// 加载App.vue 组件
import App from './App.vue'
// 引入router配置文件
import router from './router'
// 引入vuex配置文件
import Vuex from 'vuex'
import store from './store'
// a modern alternative to CSS resets
import 'normalize.css/normalize.css'
// 引入ElementUI，可以使用其组件
import Element from 'element-ui'
// css文件需手动引入
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'
// global css
import '@/styles/index.scss'
// icon
import '@/components/icons'
// properties
import AuthUtils from '@/utils/AuthUtils'
import HttpUtils from '@/utils/HttpUtils'
import UploadHttpUtils from '@/utils/UploadHttpUtils'
// import DownloadUtils from '@/utils/DownloadUtils'
import SessionStorageUtils from '@/utils/SessionStorageUtils'
import { parseTime, transferText } from '@/utils/CommonUtils'
// 进度条

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// NProgress Configuration 是否有转圈效果
NProgress.configure({ showSpinner: false })
// component
Vue.use(Vuex)
Vue.use(Element, { size: 'small' })
// 设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false
// 将Utils加载到VUE原型
Vue.prototype.AuthUtils = AuthUtils
Vue.prototype.HttpUtils = HttpUtils
Vue.prototype.UploadHttpUtils = UploadHttpUtils
Vue.prototype.transferText = transferText
// Vue.prototype.DownloadUtils = DownloadUtils
Vue.prototype.SessionStorageUtils = SessionStorageUtils
Vue.filter('parseTime', function(value) {
  if (value === null || value === undefined) {
    return ''
  } else {
    return parseTime(value)
  }
})
const AUTH_WHITE_LIST = ['/login', '/401']
// 路由处理--登录验证
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  if (to.matched.length !== 0) {
    document.title = '示例项目-客户端 ' + (to.meta.title === undefined ? '' : ' - ' + to.meta.title)
  }
  // 判断是否登录时，因为页面刷新后内存中还没有token信息，额外从session中判断一次
  if (!AuthUtils.isLogin()) {
    const sessionStore = SessionStorageUtils.getStore()
    store.replaceState(Object.assign({}, store.state, sessionStore))
  }

  if (AuthUtils.isLogin()) {
    // 已经登录的，不能跳到登陆页面，跳到首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (to.matched.length === 0) { // to.matched.length代表是否匹配到当前要跳转的路由
        next('/404')// 未知页面调错误页
        NProgress.done()
      } else if (to.meta && !AuthUtils.hasAuth(to.meta.auth)) { // 需要验证当前路由否有权限，没有跳404，有就继续走
        next('/404')// 无权限跳404
        NProgress.done()
      } else {
        next()
        NProgress.done()
      }
    }
  } else {
    if (AUTH_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else if (to.matched.length === 0) {
      next('/401')// 未知页面调错误也
    } else {
      // 没有登陆，不在白名单里，重定向到登陆页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

// 启动VUE
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
