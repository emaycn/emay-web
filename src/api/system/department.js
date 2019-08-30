import request from '@/utils/HttpUtils'
// 部门树形图请求
export function treeLists(data) {
  return request({
    url: '/department/getTree',
    method: 'post',
    data: data
  })
}
// 部门子节点树形图请求
export function treechildrenList(data) {
  return request({
    url: '/department/showChildrenNode',
    method: 'post',
    data: data
  })
}
// 新增部门请求
export function departmentadd(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data: data
  })
}
// 部门详情分页请求
export function departmentlist(data) {
  return request({
    url: '/department/list',
    method: 'post',
    data: data
  })
}
// 部门删除接口请求
export function departmentdelete(data) {
  return request({
    url: '/department/delete',
    method: 'post',
    data: data
  })
}
// 编辑部门接口请求
export function departmentmodify(data) {
  return request({
    url: '/department/modify',
    method: 'post',
    data: data
  })
}
