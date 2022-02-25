<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'App',
  computed: {
    ...mapState(['user'])
  },
  methods: {
  },
  sockets: {
    connect: function () {
      this.$store.dispatch('loadSocketio', this.$socket)
    }
  }
})
</script>

<style lang="scss">
@import './assets/fonts/fonts.css';
</style>
