import axios from 'axios'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'
import SystemConfig from '@/../public/static/SystemConfig'

// 发送请求时携带cookie
axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: SystemConfig.SERVER_ADDERSS, // url = base url + request url
  timeout: SystemConfig.HTTP_TIMEOUT // / 设置超时时间为30s
})

service.interceptors.request.use(
  config => {
    const data = config.data
    if (data !== null && data !== undefined) {
      const key = Object.keys(data)
      config.data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&'))
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    config.headers['x-requested-with'] = 'XMLHttpRequest'
    if (store.state.webToken.token !== null) {
      config.headers['AUTH-WEB-TOKEN'] = store.state.webToken.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(response => {
  if (!response.data.success) {
    if (response.data.code === -222) {
      MessageBox.confirm('您已经登出，请登出后再次登录', '确认登出', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        store.commit('LOGOUT')
      })
    } else {
      Message({
        message: response.data.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(response.data.message || 'Error'))
    }
  } else {
    return response.data
  }
}, error => {
  console.log('err' + error) // for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service
