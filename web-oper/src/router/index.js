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
    // name: 'Sms', // 设定路由的名字
    meta: { // 页面需要的权限
      title: '短信业务', // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'guide'
    },
    children: [
      // 应用
      {
        path: '/sms/app/index',
        component: () => import('@/views/sms/app/App'),
        name: 'Appp',
        meta: { title: '应用管理', icon: 'shopping', auth: 'APP_VIEW' }
      },
      {
        path: '/sms/app/add',
        component: () => import('@/views/sms/app/AppAdd'),
        name: 'AppAdd',
        hidden: true,
        meta: { title: '添加应用', icon: 'shopping', noCache: true, auth: 'APP_ADD' }
      },
      // 信息管理
      {
        path: '/sms/message/index',
        component: () => import('@/views/sms/message/Index'),
        name: 'MessageIndex',
        meta: { title: '信息管理', icon: 'international', auth: 'MESSAGE_VIEW' }
      }
    ]
  }
]

/**
 * 客户管理
 */
const clientRoutes = [
  {
    path: '/client',
    component: Layout,
    redirect: '/404',
    // name: 'Client', // 设定路由的名字
    meta: { // 页面需要的权限
      title: '客户管理', // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'customer'
    },
    children: [
      {
        path: '/client/index', // menu
        component: () => import('@/views/client/clientinfo/Client'),
        name: 'Client',
        meta: { title: '客户信息', icon: 'customerinfo', auth: 'CLIENT_VIEW' }
      },
      {
        path: '/client/add', // action
        component: () => import('@/views/client/clientinfo/ClientAdd'),
        name: 'ClientAdd',
        hidden: true,
        meta: { title: '新增客户', noCache: true, auth: 'CLIENT_ADD' }
      },
      {
        path: '/client/modify', // action
        component: () => import('@/views/client/clientinfo/ClientModify'),
        name: 'ClientModify',
        hidden: true,
        meta: { title: '修改客户', noCache: true, auth: 'CLIENT_MODIFY' }
      },
      {
        path: '/client/charge', // menu
        component: () => import('@/views/client/recharge/ChargeIndex'),
        name: 'ChargeIndex',
        meta: { title: '账务明细', icon: 'money', auth: 'CLIENT_CHARGE' }
      },
      {
        path: '/client/clientuser/index', // menu
        component: () => import('@/views/client/clientuser/ClientUser'),
        name: 'ClientUser',
        meta: { title: '客户用户管理', icon: 'user', auth: 'CLIENTUSER_VIEW' }
      },
      {
        path: '/client/clientuser/add', // action
        component: () => import('@/views/client/clientuser/ClientUserAdd'),
        name: 'ClientUserAdd',
        hidden: true,
        meta: { title: '添加客户用户', icon: 'user', noCache: true, auth: 'CLIENTUSER_ADD' }
      },
      {
        path: '/client/clientuser/modify', // action
        component: () => import('@/views/client/clientuser/ClientUserModify'),
        name: 'ClientUserModify',
        hidden: true,
        meta: { title: '修改客户用户', icon: 'user', noCache: true, auth: 'CLIENTUSER_MODIFY' }
      },
      {
        path: '/client/clientrole/index', // menu
        component: () => import('@/views/client/clientrole/ClientRole'),
        name: 'ClientRole',
        meta: { title: '客户角色管理', icon: 'people', auth: 'CLIENTROLE_VIEW' }
      },
      {
        path: '/client/clientrole/add', // action
        component: () => import('@/views/client/clientrole/ClientRoleAdd'),
        name: 'ClientRoleAdd',
        hidden: true,
        meta: { title: '添加客户角色', icon: 'people', noCache: true, auth: 'CLIENTROLE_ADD' }
      },
      {
        path: '/client/clientrole/modify', // action
        component: () => import('@/views/client/clientrole/ClientRoleModify'),
        name: 'ClientRoleModify',
        hidden: true,
        meta: { title: '修改客户角色', icon: 'people', noCache: true, auth: 'CLIENTROLE_MODIFY' }
      }
    ]
  }
]

/**
 * 基础信息管理
 */
const baseInfoRoutes = [
  {
    path: '/baseinfo',
    component: Layout,
    redirect: '/404',
    // name: 'BaseInfo', // 设定路由的名字
    meta: { // 页面需要的权限
      title: '基础信息', // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'message'
    },
    children: [
      {
        path: '/baseinfo/empty/index',
        component: () => import('@/views/baseinfo/empty/Empty'),
        name: 'Empty',
        meta: { title: '空号', icon: 'bug', auth: 'EMPTY_VIEW' }
      },
      {
        path: '/baseinfo/empty/upload',
        component: () => import('@/views/excel/UploadExcel'),
        name: 'UploadExcel',
        hidden: true,
        meta: { title: '文件上传', icon: 'bug', noCache: true }
      },
      {
        path: '/baseinfo/portable/index',
        component: () => import('@/views/baseinfo/portable/Portable'),
        name: 'Portable',
        meta: { title: '携号转网', icon: 'example', auth: 'PORTABLE_VIEW' }
      },
      {
        path: '/baseinfo/basenum/index',
        component: () => import('@/views/baseinfo/basenum/Basenum'),
        name: 'Basenum',
        meta: { title: '基础号段', icon: 'nested', auth: 'BASENUMBER_VIEW' }
      },
      {
        path: '/baseinfo/secionnum/index',
        component: () => import('@/views/baseinfo/sectionnum/Sectionnum'),
        name: 'Sectionnum',
        meta: { title: '详细号段', icon: 'list', auth: 'NUMBER_VIEW' }
      }
    ]
  }
]

/**
 * 系统管理路由表
 */
const systemRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/404',
    // name: 'SystemSetting',
    meta: { title: '系统管理', icon: 'nested' },
    children: [
      {
        path: '/system/user/index',
        component: () => import('@/views/system/user/User'),
        name: 'User',
        meta: { title: '用户管理', icon: 'user', auth: 'USER_VIEW' }
      },
      {
        path: '/system/user/useradd',
        component: () => import('@/views/system/user/Useradd'),
        name: 'Useradd',
        hidden: true,
        meta: { title: '新增用户', icon: 'user', noCache: true, auth: 'USER_ADD' }
      },
      {
        path: '/system/user/usermodify',
        component: () => import('@/views/system/user/Usermodify'),
        name: 'Usermodify',
        hidden: true,
        meta: { title: '修改用户', icon: 'user', noCache: true, auth: 'USER_MODIFY' }
      },
      {
        path: '/system/department/index',
        component: () => import('@/views/system/department/Department'),
        name: 'Department',
        meta: { title: '部门管理', icon: 'tree', auth: 'DEPARTMENT_VIEW' }
      },
      {
        path: '/system/department/checkstaff',
        component: () => import('@/views/system/department/Checkstaff'),
        name: 'Checkstaff',
        hidden: true,
        meta: { title: '查看部门人员', icon: 'user', noCache: true, auth: 'DEPARTMENT_VIEW' }
      },
      {
        path: '/system/role/index',
        component: () => import('@/views/system/role/Role'),
        name: 'Role',
        meta: { title: '角色管理', icon: 'people', auth: 'ROLE_VIEW' }
      },
      {
        path: '/system/role/roleadd',
        component: () => import('@/views/system/role/Roleadd'),
        name: 'Roleadd',
        hidden: true,
        meta: { title: '添加角色', icon: 'user', noCache: true, auth: 'ROLE_ADD' }
      },
      {
        path: '/system/role/rolemodify',
        component: () => import('@/views/system/role/Rolemodify'),
        name: 'Rolemodify',
        hidden: true,
        meta: { title: '修改角色', icon: 'user', noCache: true, auth: 'ROLE_MODIFY' }
      },
      {
        path: '/system/log/index',
        component: () => import('@/views/system/syslog/Log'),
        name: 'Log',
        meta: { title: '日志管理', icon: 'education', auth: 'LOG_VIEW' }
      }
    ]
  }
]

const allRoutes = constantRoutes.concat(smsRoutes, clientRoutes, baseInfoRoutes, systemRoutes)

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: allRoutes
})

export default router
