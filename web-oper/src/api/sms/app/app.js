import request from '@/utils/HttpUtils'

// 接口模块
const apiModel = '/o/app'

// #### 通用方法 ####
// 列表
export function apiList(data) {
  return request({
    url: apiModel + '/list',
    method: 'post',
    data: data
  })
}
// 新增
export function apiAdd(data) {
  return request({
    url: apiModel + '/add',
    method: 'post',
    data: data
  })
}
// 信息
export function apiInfo(data) {
  return request({
    url: apiModel + '/info',
    method: 'post',
    data: data
  })
}
// 修改
export function apiModify(data) {
  return request({
    url: apiModel + '/modify',
    method: 'post',
    data: data
  })
}
// 删除
export function apiDelete(data) {
  return request({
    url: apiModel + '/delete',
    method: 'post',
    data: data
  })
}

// #### 自定义方法 ####
// 设置价格
export function apiPrice(data) {
  return request({
    url: apiModel + '/price',
    method: 'post',
    data: data
  })
}
// 通道启停 【参数appId和state（1,0）】
export function apiOnoff(data) {
  return request({
    url: apiModel + '/onoff',
    method: 'post',
    data: data
  })
}
