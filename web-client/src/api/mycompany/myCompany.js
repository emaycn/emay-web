import request from '@/utils/HttpUtils'

// 接口模块
const apiModel = '/c/clientself'

// #### 通用方法 ####
export function apiInfo(data) {
  return request({
    url: apiModel + '/info  ',
    method: 'post',
    data: data
  })
}
