import request from '@/utils/HttpUtils'
// 系统修改密码请求
export function changepassword(data) {
  return request({
    url: '/changePassword',
    method: 'post',
    data: data
  })
}
