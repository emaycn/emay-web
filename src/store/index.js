// 先引入垫片，以支持低版本内核，如IE9
import 'babel-polyfill'

import Vue from 'vue'
import Vuex from 'vuex'

import webToken from './webToken'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    webToken
  }
})
