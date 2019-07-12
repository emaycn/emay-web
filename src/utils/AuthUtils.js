import store from '@/store/index'

let hasAuth = function (code) {
  if (code === null) {
    return true
  }
  return store.state.webToken.resources !== null && store.state.webToken.resources[code] === true
}

let isLogin = function () {
  return store.state.webToken.user !== null
}

let currentUser = function () {
  return store.state.webToken.user
}

export {
  hasAuth, isLogin, currentUser
}
