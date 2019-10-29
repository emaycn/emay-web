import axios from 'axios'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'
import SessionStorageUtils from '@/utils/SessionStorageUtils'
// 发送请求时携带cookie
axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 30000 // / 设置超时时间为30s
})

service.interceptors.request.use(
  config => {
    // const data = config.data
    // if (data !== null && data !== undefined) {
    //   const key = Object.keys(data).filter(name => !(data[name] === null || data[name] === undefined))
    //   config.data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&'))
    // }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    config.headers['x-requested-with'] = 'XMLHttpRequest'
    if (store.state.webToken.token !== null) {
      config.headers['AUTH-WEB-TOKEN'] = store.state.webToken.token
    }
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(response => {
  if (!response.data.success) {
    if (response.data.code === '-222') {
      MessageBox.confirm('您已经登出，请登出后再次登录', '确认登出', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        store.commit('LOGOUT')
        SessionStorageUtils.setStore()
        router.push(`/login`)
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
  setTimeout(() => {
    if (!error.response) {
      if (error.message.includes('timeout')) {
        router.push('/401')
      }
    }
  }, 5000)

  return Promise.reject(error)
})

export default service
