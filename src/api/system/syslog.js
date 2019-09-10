import request from '@/utils/HttpUtils'
import requestUpload from '@/utils/UploadHttpUtils'
// 系统日志请求
export function syslog(data) {
  return request({
    url: '/userlog/page',
    method: 'post',
    data: data
  })
}
// 导入
export function importMehtod(data) {
  return requestUpload({
    url: '/userlog/import',
    method: 'post',
    data: data
  })
}

