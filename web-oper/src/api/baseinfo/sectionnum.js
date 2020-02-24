import request from '@/utils/HttpUtils'

// 获取表格数据
export function apiList(data) {
  return request({
    url: '/o/sectionnumber/list',
    method: 'post',
    data: data
  })
}
// 新增
export function apiAdd(data) {
  return request({
    url: '/o/sectionnumber/add',
    method: 'post',
    data: data
  })
}
// 编辑
export function apiInfo(data) {
  return request({
    url: '/o/sectionnumber/info',
    method: 'post',
    data: data
  })
}
// 修改
export function apiModify(data) {
  return request({
    url: '/o/sectionnumber/modify',
    method: 'post',
    data: data
  })
}
// 删除
export function apiDelete(data) {
  return request({
    url: '/o/sectionnumber/delete',
    method: 'post',
    data: data
  })
}
// 省份列表
export function apiProvinceList(data) {
  return request({
    url: '/o/sectionnumber/provincelist  ',
    method: 'post',
    data: data
  })
}
