// 用户登录信息--用户信息、权限信息、Token信息
export default {
  state: {
    token: null,
    resources: null,
    createTime: null,
    user: null
  },
  mutations: {
    LOGIN (state, webToken) {
      state.token = webToken.token
      state.createTime = webToken.createTime
      state.resources = webToken.resources
      state.user = webToken.user
    },
    LOGOUT (state) {
      state.token = null
      state.createTime = null
      state.resources = null
      state.user = null
    }
  },
  actions: {
    logIn ({ commit }, webToken) {
      commit('LOGIN', webToken)
    },
    logOut ({ commit }) {
      commit('LOGOUT')
    }
  }
}
