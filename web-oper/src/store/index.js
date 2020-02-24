import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './sidebar'
import tagsView from './tagsView'
import keepalive from './keepalive'
import webToken from './webToken'
import routes from './routes'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sidebar,
    tagsView,
    keepalive,
    webToken,
    routes
  }
})

