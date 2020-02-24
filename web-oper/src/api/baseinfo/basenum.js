import request from '@/utils/HttpUtils'

// 获取表格数据
export function apiList(data) {
  return request({
    url: '/o/basenumber/list',
    method: 'post',
    data: data
  })
}
// 新增
export function apiAdd(data) {
  return request({
    url: '/o/basenumber/add',
    method: 'post',
    data: data
  })
}
// 修改
export function apiModify(data) {
  return request({
    url: '/o/basenumber/modify',
    method: 'post',
    data: data
  })
}
// 删除
export function apiDelete(data) {
  return request({
    url: '/o/basenumber/delete',
    method: 'post',
    data: data
  })
}
