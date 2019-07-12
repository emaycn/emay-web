import store from '@/store/index'

export default {
  hasAuth: function (code) {
    if (code === null) {
      return true
    }
    return store.state.webToken.resources !== null && store.state.webToken.resources[code] === true
  },
  isLogin: function () {
    return store.state.webToken.user !== null
  },
  currentUser: function () {
    return store.state.webToken.user
  },
  webToken: function () {
    return store.state.webToken
  }
}
