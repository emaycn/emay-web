import store from '@/store'

// 导出Excel
export function exportExcel(url, queryParams) {
  if (queryParams !== null && queryParams !== undefined) {
    const key = Object.keys(queryParams).filter(name => !(queryParams[name] === null || queryParams[name] === undefined))
    queryParams = encodeURI(key.map(name => `${name}=${queryParams[name]}`).join('&'))
  }
  window.location.href = process.env.VUE_APP_BASE_API + url + '?' + queryParams + '&AUTH-WEB-TOKEN=' + store.state.webToken.token
}
