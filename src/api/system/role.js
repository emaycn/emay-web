import request from '@/utils/HttpUtils'

// 获取表格数据
export function fetchList(data) {
  return request({
    url: '/role/page',
    method: 'post',
    data: data
  })
}

// 添加确定操作 remark ,resourceCodes ,roleName
export function addConfirm(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data: data
  })
}
// 编辑操作 角色所有资源，roleId回显
export function handleUpdateMethod(data) {
  return request({
    url: '/role/roleResource',
    method: 'post',
    data: data
  })
}
// 修改确定操作 remark ,resourceCodes ,roleId,roleName
export function handleUpdateConfirmMethod(data) {
  return request({
    url: '/role/modify',
    method: 'post',
    data: data
  })
}
// 删除操作
export function handleDeleteMethod(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data: data
  })
}
// 所属角色
export function alongRoles(data) {
  return request({
    url: '/role/allRole',
    method: 'post',
    data: data
  })
}
