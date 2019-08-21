// 加载VUE
import Vue from 'vue'
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
import SystemConfig from '@/../public/static/SystemConfig'
import AuthUtils from '@/utils/AuthUtils'
import HttpUtils from '@/utils/HttpUtils'
import SessionStorageUtils from '@/utils/SessionStorageUtils'
import { parseTime } from '@/utils/ParseTime'
Vue.filter('parseTime', function(value) {
  return parseTime(value)
})
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
Vue.prototype.SystemConfig = SystemConfig
Vue.prototype.AuthUtils = AuthUtils
Vue.prototype.HttpUtils = HttpUtils
Vue.prototype.SessionStorageUtils = SessionStorageUtils
const AUTH_WHITE_LIST = ['/login', '/401']
// 路由处理--登录验证
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  if (to.matched.length !== 0) {
    document.title = '亿美数据平台' + (to.meta.title === undefined ? '' : ' - ' + to.meta.title)
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
      if (to.matched.length === 0) {
        next('/404')// 未知页面调错误页
        NProgress.done()
      } else if (to.meta && !AuthUtils.hasAuth(to.meta.auth)) {
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
      // 没有登陆，不在白名单里，跳到登陆页
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
