import Main from '@/pages/system/Main'
import Role from '@/pages/system/Role'
import User from '@/pages/system/User'

import Vue from 'vue'

const SystemRouter = [{
  path: '/system',
  name: '系统中心',
  component: Main,
  iconCls: 'el-icon-info',
  auth: null,
  children: [{
    path: '/system/user',
    component: User,
    iconCls: 'el-icon-info',
    name: '用户管理',
    auth: 'USER_VIEW'
  }, {
    path: '/system/role',
    iconCls: 'el-icon-info',
    component: Role,
    name: '角色管理',
    auth: 'ROLE_VIEW'
  }]
}]

var toMap = function () {
  var map = {}
  for (var i in SystemRouter) {
    var children = SystemRouter[i].children
    if (children === null || children.length === 0) {
      continue
    }
    for (var j in children) {
      var item = children[j]
      map[item.path] = item.auth
    }
  }
  return map
}

Vue.prototype.PAGE_AUTH = toMap()

export {
  SystemRouter
}
