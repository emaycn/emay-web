import request from '@/utils/HttpUtils'

// 接口模块
const apiModel = '/c/systemclientuser'

// #### 通用方法 ####
// 列表
export function apiList(data) {
  return request({
    url: apiModel + '/page',
    method: 'post',
    data: data
  })
}
