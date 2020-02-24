import request from '@/utils/HttpUtils'
// 客户端日志请求
export function clientlog(data) {
  return request({
    url: '/o/clientlog/page',
    method: 'post',
    data: data
  })
}
