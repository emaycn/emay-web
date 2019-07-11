import Main from '@/pages/Main'
import Role from '@/pages/system/Role'
import User from '@/pages/system/User'

const SystemRouter = [{
  path: '/system',
  name: '系统中心',
  component: Main,
  iconCls: 'el-icon-info',
  hidden: false,
  children: [{
    path: '/system/user',
    component: User,
    iconCls: 'el-icon-info',
    name: '用户管理'
  }, {
    path: '/system/role',
    iconCls: 'el-icon-info',
    component: Role,
    name: '角色管理'
  }]
}]

export {
  SystemRouter
}
