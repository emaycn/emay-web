import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/index.vue'

Vue.use(Router)

/**
 * hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1,默认false
 * alwaysShow: true               如果设置为true，将始终显示根菜单
*                                 如果不设置alwaysShow, 当项目有多个子路由时，它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 *                                设置直接跳转到另外的URL
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    title: 'title'                设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'              设置该路由的图标
    noCache: true                 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    affix: true                   在tags-view中永久显示，不能被关闭
    breadcrumb: false             如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/example/list'   如果设置路径，侧栏将突出显示您设置的路径
    auth:                         路由需要的权限，如果不设置则不需要权限
  }
 */

/**
 * 没有权限要求的基本页
 * 所有用户都可以访问
 */
const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * 动态需要根据权限加载的路由表
 */
const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'system',
    meta: {
      title: '系统中心',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user'),
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'user',
          auth: 'USER_VIEW'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'role',
        meta: {
          title: '角色管理',
          icon: 'lock',
          auth: 'ROLE_VIEW'
        }
      }
    ]
  }
]

const allRoutes = constantRoutes.concat(asyncRoutes)

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: allRoutes
})

export default router
