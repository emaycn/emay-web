import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/pages/Dashboard'
import Main from '@/pages/Main'

import {
  SystemRouter
} from './system'

Vue.use(Router)

let routes = [{
  path: '/',
  component: Main,
  hidden: true,
  children: [{
    path: '/',
    component: Dashboard,
    name: '首页'
  }]
}]

for (let i in SystemRouter) {
  routes.push(SystemRouter[i])
}

const router = new Router({
  routes: routes
})

export default router
