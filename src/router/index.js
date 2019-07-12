import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/pages/Dashboard'
import Main from '@/pages/system/Main'
import ChangePass from '@/pages/system/ChangePass'
import ErrorPage from '@/pages/system/Error'

import {SystemRouter} from './system'

Vue.use(Router)

let routes = [{
  path: '/',
  component: Main,
  hidden: true,
  children: [{
    path: '/',
    component: Dashboard,
    name: '首页'
  }, {
    path: '/changePass',
    component: ChangePass,
    name: '修改密码'
  }, {
    path: '/error',
    component: ErrorPage,
    name: '错误页面'
  }]
}]

for (let i in SystemRouter) {
  routes.push(SystemRouter[i])
}

const router = new Router({
  routes: routes
})

export default router
