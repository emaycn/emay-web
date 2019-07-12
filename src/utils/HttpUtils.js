import axios from 'axios'
import Vue from 'vue'
import store from '@/store/index'

// 发送请求时携带cookie
axios.defaults.withCredentials = true

// 设置超时时间为60s
axios.defaults.timeout = 30000

axios.interceptors.request.use(
  config => {
    let data = config.data
    let key = Object.keys(data)
    config.data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&'))
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(response => {
  if (response.data.code === -222) {
    this.$store.commit('logOut')
  }
  return response
}, error => {
  return Promise.reject(error)
})

var fillHeader = function (headers) {
  headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  if (store.state.webToken !== null) {
    headers['AUTH-WEB-TOKEN'] = store.state.webToken.sessionId
  }
  return headers
}

export default {
  get: function (url, params = {}, headers = {}) {
    headers = fillHeader(headers)
    return axios({
      url: Vue.prototype.SystemConfig.SERVER_ADDERSS + url,
      method: 'get',
      headers: headers,
      params
    })
  },
  post: function (url, data = {}, headers = {}) {
    headers = fillHeader(headers)
    return axios({
      url: Vue.prototype.SystemConfig.SERVER_ADDERSS + url,
      method: 'post',
      headers: headers,
      data: data
    })
  },
  put: function (url, data = {}, headers = {}) {
    headers = fillHeader(headers)
    return axios({
      url: Vue.prototype.SystemConfig.SERVER_ADDERSS + url,
      method: 'put',
      headers: headers,
      data: data
    })
  },
  delete: function (url, headers = {}) {
    headers = fillHeader(headers)
    return axios({
      url: Vue.prototype.SystemConfig.SERVER_ADDERSS + url,
      method: 'delete',
      headers: headers
    })
  }

}
