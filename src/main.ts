import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueScrollTo from 'vue-scrollto'

import VueSocketIO from 'vue-socket.io'
import socketio from 'socket.io-client'
import setting from './unit/setting'

const io = socketio(setting.getSocketLocation())

Vue.use(new VueSocketIO({
  debug: true,
  connection: io,
  vuex: {
    store,
    actionPrefix: 'wsOnReceive',
    mutationPrefix: 'wsOn'
  }
}))

Vue.use(VueScrollTo)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
