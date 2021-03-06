import request from '@/utils/HttpUtils'

// 获取表格数据
export function fetchList(data) {
  return request({
    url: '/o/user/page',
    method: 'post',
    data: data
  })
}
// 启用操作
export function handOnMethod(data) {
  return request({
    url: '/o/user/on',
    method: 'post',
    data: data
  })
}
// 停用操作
export function handOffMethod(data) {
  return request({
    url: '/o/user/off',
    method: 'post',
    data: data
  })
}
// 编辑操作
export function handleUpdateMethod(data) {
  return request({
    url: '/o/user/info',
    method: 'post',
    data: data
  })
}
export function handleUpdateConfirmMethod(data) {
  return request({
    url: '/o/user/modify',
    method: 'post',
    data: data
  })
}
// 删除操作
export function handleDeleteMethod(data) {
  return request({
    url: '/o/user/delete',
    method: 'post',
    data: data
  })
}
// 重置密码操作
export function handleResetMethod(data) {
  return request({
    url: '/o/user/ajax/reset',
    method: 'post',
    data: data
  })
}
// 新增用户请求
export function addConfirm(data) {
  return request({
    url: '/o/user/add',
    method: 'post',
    data: data
  })
}
// 部门查看人员接口请求
export function departmentchildlist(data) {
  return request({
    url: '/o/user/childlist',
    method: 'post',
    data: data
  })
}
