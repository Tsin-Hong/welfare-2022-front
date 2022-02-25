import Vue from 'vue'
import Vuex from 'vuex'

import client from './client'
import user from './user'
import global from './global'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    client,
    user,
    global
  }
})
