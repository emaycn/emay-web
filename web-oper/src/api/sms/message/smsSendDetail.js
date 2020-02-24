import request from '@/utils/HttpUtils'

// 接口模块
const apiModel = '/o/message'

// #### 通用方法 ####
// 列表
export function apiList(data) {
  return request({
    url: apiModel + '/list',
    method: 'post',
    data: data
  })
}

