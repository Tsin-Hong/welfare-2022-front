<template>
  <v-app>
    <v-main>
      <component :is="clinet.tempName"></component>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'

import None from '@/views/None.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

export default Vue.extend({
  name: 'App',
  components: {
    None,
    Login,
    Home
  },
  computed: {
    ...mapState(['user', 'global', 'clinet'])
  },
  mounted: function () {
    this.changePage()
  },
  methods: {
    ...mapMutations(['ChangeState']),
    changePage: function () {
      const token = window.localStorage.getItem('_token_')
      if (token) {
        this.ChangeState(['tempName', 'Home'])
      } else {
        this.ChangeState(['tempName', 'Login'])
      }
    }
  },
  sockets: {
    connect: function () {
      const token = window.localStorage.getItem('_token_')
      if (token) {
        this.$socket.emit('AUTHORIZE', { token })
      }
      this.$store.dispatch('loadSocketio', this.$socket)
    }
  }
})
</script>

<style lang="scss">
@import './assets/fonts/fonts.css';
[v-cloak] {
  display: none;
}
</style>
