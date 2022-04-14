<template>
  <v-app>
    <v-main>
      <component :is="client.tempName"></component>
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
    ...mapState(['user', 'global', 'client'])
  },
  mounted: function () {
    this.changePage()
  },
  watch: {
    'client.tempName': function (val, oldVal) {
      if (oldVal === 'Login') {
        this.$nextTick(function () {
          this.ChangeState(['dialog_info', true])
        })
      }
    }
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
@import '/fonts/fonts.css';
[v-cloak] {
  display: none;
}

.ff-wkw5 {
  font-family: '華康行楷體W5' !important;
}

body,
html,
.dialog {
  min-width: 1280px;
}

.posi-re {
  position: relative;
}

@for $i from 0 through 5000 {
  .fz-#{$i}-px {
    font-size: #{$i}px !important;
    line-height: #{$i + 6}px !important;
  }
  .ltsc-#{$i} {
    letter-spacing: #{$i}px !important;
  }
  .w-#{$i}-pct {
    width: #{$i} + '%' !important;
  }
  .h-#{$i}-pct {
    height: #{$i} + '%' !important;
  }
  .w-#{$i}-px {
    width: #{$i} + 'px' !important;
  }
  .h-#{$i}-px {
    height: #{$i} + 'px' !important;
  }
  .minw-#{$i}-px {
    min-width: #{$i} + 'px' !important;
  }
  .minh-#{$i}-px {
    min-height: #{$i} + 'px' !important;
  }
  .maxw-#{$i}-px {
    min-width: #{$i} + 'px' !important;
  }
  .maxh-#{$i}-px {
    min-height: #{$i} + 'px' !important;
  }

  .p-#{$i}-px {
    padding: #{$i}px !important;
  }
  .py-#{$i}-px {
    padding-top: #{$i}px !important;
    padding-bottom: #{$i}px !important;
  }
  .px-#{$i}-px {
    padding-left: #{$i}px !important;
    padding-right: #{$i}px !important;
  }
  .pt-#{$i}-px {
    padding-top: #{$i}px !important;
  }
  .pb-#{$i}-px {
    padding-bottom: #{$i}px !important;
  }
  .pr-#{$i}-px {
    padding-right: #{$i}px !important;
  }
  .pl-#{$i}-px {
    padding-left: #{$i}px !important;
  }

  .m-#{$i}-px {
    margin: #{$i}px !important;
  }
  .my-#{$i}-px {
    margin-top: #{$i}px !important;
    margin-bottom: #{$i}px !important;
  }
  .mx-#{$i}-px {
    margin-left: #{$i}px !important;
    margin-right: #{$i}px !important;
  }
  .mt-#{$i}-px {
    margin-top: #{$i}px !important;
  }
  .mb-#{$i}-px {
    margin-bottom: #{$i}px !important;
  }
  .mr-#{$i}-px {
    margin-right: #{$i}px !important;
  }
  .ml-#{$i}-px {
    margin-left: #{$i}px !important;
  }

  .my-rev-#{$i}-px {
    margin-top: -#{$i}px !important;
    margin-bottom: -#{$i}px !important;
  }
  .mx-rev-#{$i}-px {
    margin-left: -#{$i}px !important;
    margin-right: -#{$i}px !important;
  }
  .mt-rev-#{$i}-px {
    margin-top: -#{$i}px !important;
  }
  .mb-rev-#{$i}-px {
    margin-bottom: -#{$i}px !important;
  }
  .mr-rev-#{$i}-px {
    margin-right: -#{$i}px !important;
  }
  .ml-rev-#{$i}-px {
    margin-left: -#{$i}px !important;
  }

  .ma-#{$i}-pct {
    margin: #{$i} + '%' !important;
  }

  .my-#{$i}-pct {
    margin-top: #{$i} + '%' !important;
    margin-bottom: #{$i} + '%' !important;
  }
  .mx-#{$i}-pct {
    margin-left: #{$i} + '%' !important;
    margin-right: #{$i} + '%' !important;
  }
  .mt-#{$i}-pct {
    margin-top: #{$i} + '%' !important;
  }
  .mb-#{$i}-pct {
    margin-bottom: #{$i} + '%' !important;
  }
  .mr-#{$i}-pct {
    margin-right: #{$i} + '%' !important;
  }
  .ml-#{$i}-pct {
    margin-left: #{$i} + '%' !important;
  }
}
</style>
