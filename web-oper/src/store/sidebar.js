// 左侧导航是否展开
export default {
  state: {
    opened: true
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.opened = !state.opened
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}
