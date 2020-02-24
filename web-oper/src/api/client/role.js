import request from '@/utils/HttpUtils'

// 获取表格数据
export function fetchList(data) {
  return request({
    url: '/o/clientrole/page',
    method: 'post',
    data: data
  })
}

// 添加确定操作 remark ,resourceCodes ,roleName
export function addConfirm(data) {
  return request({
    url: '/o/clientrole/add',
    method: 'post',
    data: data
  })
}
// 编辑操作 角色所有资源，roleId回显
export function handleUpdateMethod(data) {
  return request({
    url: '/o/clientrole/roleResource',
    method: 'post',
    data: data
  })
}
// 修改确定操作 remark ,resourceCodes ,roleId,roleName
export function handleUpdateConfirmMethod(data) {
  return request({
    url: '/o/clientrole/modify',
    method: 'post',
    data: data
  })
}
// 删除操作
export function handleDeleteMethod(data) {
  return request({
    url: '/o/clientrole/delete',
    method: 'post',
    data: data
  })
}
// 所属角色
export function allRoles(data) {
  return request({
    url: '/o/clientrole/allRole',
    method: 'post',
    data: data
  })
}
