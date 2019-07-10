let ss = {
  setItem: function (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  getItem: function (key) {
    return JSON.parse(sessionStorage.getItem(key)) || null
  },
  removeItem: function (key) {
    sessionStorage.removeItem(key)
  }
}

let getItem = function (item) {
  var token = ss.getItem('webToken')
  return token == null ? null : token[item]
}

export default {
  state: {
    user: getItem('user'),
    sessionId: getItem('sessionId'),
    resources: getItem('resources'),
    createTime: getItem('createTime')
  },
  mutations: {
    logIn (state, token) {
      ss.setItem('webToken', token)
      state.user = token.user
      state.sessionId = token.sessionId
      state.resources = token.resources
      state.createTime = token.createTime
    },
    logOut (state) {
      ss.removeItem('webToken')
      state.user = null
      state.sessionId = null
      state.resources = null
      state.createTime = null
    }
  },
  actions: {
    logIn ({commit}, token) {
      commit('logIn', token)
    },
    logOut ({commit}) {
      commit('logOut')
    }
  }
}
