import request from '@/utils/HttpUtils'
// 客户信息请求
export function clientList(data) {
  return request({
    url: '/o/client/list',
    method: 'post',
    data: data
  })
}
// 修改客户信息
export function clientModify(data) {
  return request({
    url: '/o/client/modify',
    method: 'post',
    data: data
  })
}
// 新增客户信息
export function clientAdd(data) {
  return request({
    url: '/o/client/add',
    method: 'post',
    data: data
  })
}
// 查看客户详情
export function clientInfo(data) {
  return request({
    url: '/o/client/info',
    method: 'post',
    data: data
  })
}
// 充值
export function rechargeMethod(data) {
  return request({
    url: '/o/client/recharge',
    method: 'post',
    data: data
  })
}
// 扣费
export function chargeMethod(data) {
  return request({
    url: '/o/client/charge',
    method: 'post',
    data: data
  })
}
// 查询客户名称
export function findByClientName(data) {
  return request({
    url: '/o/client/findbyname',
    method: 'post',
    data: data
  })
}
