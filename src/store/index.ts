import Vue from 'vue'
import Vuex from 'vuex'

import client from './client'
import user from './user'
import global from './global'
import info from './info'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    client,
    user,
    global,
    info
  },
  mutations: {
    ChangeRootState: function (rootState, payload) {
      const key = payload[0]
      rootState[key][payload[1]] = payload[2]
    },
  }
})
