import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/index.vue'

Vue.use(Router)

/**
   hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1,默认false
   redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
                                  设置直接跳转到另外的URL
   name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
   meta : {
    title: 'title'                设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'              设置该路由的图标
    noCache: true                 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    affix: true                   在tags-view中永久显示，不能被关闭
    auth:                         路由需要的权限，如果不设置则不需要权限
  }
 */

/**
 * 没有权限要求的基本页
 * 所有用户都可以访问
 */
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    hidden: true
  },
  {
    path: '/401',
    name: 'ErrorOut',
    component: () => import('@/views/401'),
    hidden: true,
    meta: { title: '错误页', icon: 'error', noCache: true }
  },
  {
    path: '/',
    component: Layout,
    name: 'Root',
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      {
        path: '/404',
        name: 'Error',
        component: () => import('@/views/404'),
        hidden: true,
        meta: { title: '错误页', icon: 'error', noCache: true }
      },
      {
        path: '/changepass',
        component: () => import('@/views/ChangePass'),
        name: 'Changepass',
        hidden: true,
        meta: { title: '修改密码', icon: 'user', noCache: true }
      },
      {
        path: '/redirect/:path*',
        component: () => import('@/views/Redirect'),
        hidden: true,
        name: 'Redirect',
        meta: { title: '中转页', icon: 'redirect', noCache: true }
      }
    ]
  }
]

/**
 * 短信业务
 */
const smsRoutes = [
  {
    path: '/sms',
    component: Layout,
    redirect: '/404',
    name: 'Sms', // 设定路由的名字
    meta: { // 页面需要的权限
      title: '短信业务', // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'guide'
    },
    children: [
      // 应用管理
      {
        path: '/sms/app/index',
        component: () => import('@/views/sms/app/App'),
        name: 'Appp',
        meta: { title: '应用管理', icon: 'shopping', auth: 'CLIENT_APP_VIEW' }
      },
      // 信息管理
      {
        path: '/sms/message/index',
        component: () => import('@/views/sms/message/Index'),
        name: 'MessageIndex',
        meta: { title: '信息管理', icon: 'international', auth: 'CLIENT_MESSAGE_MANAGE' }
      }
    ]
  }
]

/**
 * 系统管理
 */
const systemRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/404',
    name: 'SystemSetting',
    meta: { title: '系统管理', icon: 'nested' },
    children: [
      {
        path: '/system/clientuser/index',
        component: () => import('@/views/system/clientuser/ClientUser'),
        name: 'ClientUser',
        meta: { title: '用户管理', icon: 'user', auth: 'CLIENT_USER_VIEW' }
      }
    ]
  }
]

/**
 * 我的公司
 */
const mycompanyRoutes = [
  {
    path: '/mycompany',
    component: Layout,
    redirect: '/404',
    meta: { title: '我的公司', icon: 'nested' },
    children: [
      {
        path: '/mycompany/index',
        component: () => import('@/views/mycompany/MyCompany'),
        name: 'MyCompany',
        meta: { title: '我的公司', icon: 'people', auth: 'CLIENT_COMMPANY_INFO' }
      }]
  }
]

const allRoutes = constantRoutes.concat(smsRoutes, systemRoutes, mycompanyRoutes)

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: allRoutes
})

export default router
