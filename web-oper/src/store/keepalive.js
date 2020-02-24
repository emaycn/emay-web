// 缓存页面状态
export default {
  state: {
    cachedViews: []
  },
  mutations: {
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) {
        return
      }
      if (view.meta.noCache) {
        return
      }
      state.cachedViews.push(view.name)
    },
    DEL_CACHED_VIEW: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },
    DEL_ALL_CACHED_VIEWS: (state) => {
      state.cachedViews = []
    }
  },
  actions: {
    addCachedView({ commit }, view) {
      commit('ADD_CACHED_VIEW', view)
    },
    delCachedView({ commit }, view) {
      commit('DEL_CACHED_VIEW', view)
    },
    delOthersCachedViews({ commit }, view) {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
    },
    delAllCachedViews({ commit }) {
      commit('DEL_ALL_CACHED_VIEWS')
    }
  }
}

