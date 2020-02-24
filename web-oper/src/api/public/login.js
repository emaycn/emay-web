import request from '@/utils/HttpUtils'
// 系统登录请求
export function login(data) {
  return request({
    url: '/p/login',
    method: 'post',
    data: data
  })
}
