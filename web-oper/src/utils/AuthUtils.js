import store from '@/store'
import router from '@/router'
import { deepClone } from '@/utils/CommonUtils'

export default {
  hasAuth: function(code) {
    if (code === null || code === undefined) {
      return true
    }
    return store.state.webToken.resources !== null && store.state.webToken.resources[code] === true
  },
  isLogin: function() {
    return store.state.webToken.user !== null
  },
  resetRoutes: function() {
    const routes = deepClone(router.options.routes)
    const newAuthRoute = []
    for (const i in routes) {
      const root = routes[i]
      if (root.meta && !this.hasAuth(root.meta.auth)) {
        root.hidden = true
        continue
      }
      const children = []
      for (const j in root.children) {
        const item = root.children[j]
        if (item.meta && !this.hasAuth(item.meta.auth)) {
          item.hidden = true
          continue
        }
        children.push(item)
      }
      if (children.length < 1) {
        continue
      }
      root.children = children
      newAuthRoute.push(root)
    }
    store.commit('REPLACE_ROUTES', newAuthRoute)
  },
  resetTagsView: function() {
    const newVisitedViews = []
    if (store.state.tagsView.visitedViews) {
      for (const i in store.state.tagsView.visitedViews) {
        const view = store.state.tagsView.visitedViews[i]
        if (view.meta === null || view.meta === undefined || this.hasAuth(view.meta.auth)) {
          newVisitedViews.push(view)
        }
      }
    }
    store.dispatch('delAllVisitedViews')
    for (const j in newVisitedViews) {
      store.dispatch('addVisitedView', newVisitedViews[j])
    }
  },
  resetKeepalive: function() {
    store.dispatch('delAllCachedViews')
  }
}
