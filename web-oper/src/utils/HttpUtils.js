import axios from 'axios'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
import SessionStorageUtils from '@/utils/SessionStorageUtils'
// 发送请求时携带cookie
axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 30000 // / 设置超时时间为30s
})

service.interceptors.request.use(
  config => {
    var data = config.data
    if (data !== null && data !== undefined) {
      var key = Object.keys(data).filter(name => !(data[name] === null || data[name] === undefined))
      key = key.map(name => `${name}=${encodeURIComponent(data[name])}`)
      config.data = key.join('&')
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
    if (response.data.code === '-222') {
      MessageBox.confirm('您已经登出，请登出后再次登录', '确认登出', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        store.commit('LOGOUT')
        SessionStorageUtils.setStore()
        router.push(`/login`)
      })
    } else if (response.data.code === '-111') {
      MessageBox.confirm('首次登陆，请修改密码', '修改密码', {
        confirmButtonText: '修改密码',
        type: 'warning'
      }).then(() => {
        router.push(`/changepass`)
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
