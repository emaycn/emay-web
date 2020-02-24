import request from '@/utils/HttpUtils'
// 客户充值信息请求
export function chargeList(data) {
  return request({
    url: '/o/charge/list',
    method: 'post',
    data: data
  })
}
