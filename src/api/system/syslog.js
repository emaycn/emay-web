import request from '@/utils/HttpUtils'
// 系统日志请求
export function syslog(data) {
  return request({
    url: '/userlog/page',
    method: 'post',
    data: data
  })
}
