import request from '@/utils/HttpUtils'
// 退出登录请求
export function logOut(data) {
  return request({
    url: '/logout',
    method: 'post',
    data: data
  })
}
