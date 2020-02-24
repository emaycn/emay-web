// 左侧导航树
export default {
  state: {
    array: []
  },
  mutations: {
    REPLACE_ROUTES: (state, routes) => {
      state.array = routes
    },
    DELETE_ALL_ROUTES: (state) => {
      state.array = []
    }
  },
  actions: {
    replaceRoutes({ commit }, routes) {
      commit('REPLACE_ROUTES', routes)
    },
    deleteAllRoutes({ commit }) {
      commit('DELETE_ALL_ROUTES')
    }
  }
}
