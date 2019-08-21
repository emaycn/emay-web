import request from '@/utils/HttpUtils'
// 系统日志请求
export function syslog(data) {
  return request({
    url: '/user/log/page',
    method: 'post',
    data: data
  })
}
