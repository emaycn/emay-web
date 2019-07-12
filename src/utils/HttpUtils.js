import axios from 'axios'
import SystemConfig from '@/../static/SystemConfig'

// 发送请求时携带cookie
axios.defaults.withCredentials = true

// 设置超时时间为60s
axios.defaults.timeout = 30000

axios.interceptors.request.use(
  config => {
    let data = config.data
    let key = Object.keys(data)
    console.log(config.data)
    config.data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&'))
    console.log(config.data)
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

export function get (url, params = {}, headers = {}) {
  return axios({
    url: SystemConfig.SERVER_ADDERSS + url,
    method: 'get',
    headers: headers,
    params
  })
}

export function post (url, data = {}, headers = {}) {
  headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return axios({
    url: SystemConfig.SERVER_ADDERSS + url,
    method: 'post',
    headers: headers,
    data: data
  })
}

export function put (url, data = {}, headers = {}) {
  headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return axios({
    url: SystemConfig.SERVER_ADDERSS + url,
    method: 'put',
    headers: headers,
    data: data
  })
}

export function deletes (url, headers = {}) {
  return axios({
    url: SystemConfig.SERVER_ADDERSS + url,
    method: 'delete',
    headers: headers
  })
}

export {
  axios
}
