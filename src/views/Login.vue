<template>
  <div class="login-page">
    <div class="login-area">
      <img class="img img-02" src="/images/logo.png" alt="" />
      <img class="img img-01" src="/images/user.png" alt="" />
      <v-card class="mx-auto login-block" dark>
        <v-list-item three-line>
          <v-list-item-content>
            <img class="img img-03" src="/images/text.png" alt="" />
            <v-divider class="my-3"></v-divider>
            <form @keyup.enter="login">
              <v-text-field
                v-model="account"
                label="員編"
                required
              ></v-text-field>
              <v-chip
                v-if="error.staffCode.includes(account)"
                class="mb-2 red red--text"
                label
                outlined
              >
                因違反福委網站安全性規範，即刻起禁用至 {{ error.endDate }} 恢復。
              </v-chip>
              <v-text-field
                v-model="password"
                label="密碼"
                required
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                :type="passwordShow ? 'text' : 'password'"
                @click:append="passwordShow = !passwordShow"
              ></v-text-field>
              <v-text-field
                v-if="firstLogin"
                ref="confirmPassword"
                v-model="passwordCheck"
                label="密碼確認"
                required
                :append-icon="passwordCheckShow ? 'mdi-eye' : 'mdi-eye-off'"
                :type="passwordCheckShow ? 'text' : 'password'"
                @click:append="passwordCheckShow = !passwordCheckShow"
              ></v-text-field>
              <v-switch v-model="firstLogin" label="首次登入"></v-switch>
              <v-btn rounded block class="mx-auto" @click="login"
                >進入遊戲</v-btn
              >
              <v-btn
                v-if="showTool()"
                rounded
                block
                class="mx-auto m-3 yellow darken-3"
                @click="tool"
                >武朝名冊</v-btn
              >
            </form>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <span :class="{ connected: user.connected }"></span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
import setting from '@/unit/setting'

export default {
  name: 'Login',
  data: () => ({
    account: '',
    firstLogin: false,
    passwordShow: false,
    passwordCheckShow: false,
    password: '',
    passwordCheck: '',
    error: {
      staffCode: [],
      endDate: ''
    }
  }),
  computed: {
    ...mapState(['user', 'client'])
  },
  created: function () {
    fetch('./data/errorStaff.json')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        this.error = data
      })
  },
  updated: function () {
    this.checkLoginStaus()
  },
  methods: {
    ...mapMutations(['ChangeState']),
    change: function () {
      this.$store.commit('user/changeState', ['code', this.account])
      this.$store.commit('user/changeState', ['pwd', this.password])
      this.$store.commit('user/changeState', ['code', this.passwordCheck])
    },
    login: function () {
      var data = { code: this.account.toUpperCase(), pwd: this.password }
      if (this.error && this.error.staffCode.includes(data.code)) {
        return window.alert('違反福委網站安全性規範')
      }
      if (this.firstLogin) {
        data.pwdre = this.passwordCheck
        var registerUrl = `${setting.getSocketLocation()}/login`
        // console.log(registerUrl)
        // var registerUrl = 'http://172.16.20.73:20221/login'
        axios.post(registerUrl, data).then((e) => {
          console.log(e)
          if (e.status === 200) {
            window.alert('註冊成功 請登入.')
            this.firstLogin = false
          } else {
            window.alert('註冊失敗.')
          }
        })
      } else {
        this.$socket.emit('AUTHORIZE', data)
      }
      this.checkLoginStaus()
    },
    checkLoginStaus: function () {
      if (this.user.connected) {
        this.ChangeState(['tempName', 'Home'])
      } else {
        this.ChangeState(['tempName', 'Login'])
      }
    },
    showTool: function () {
      const { toolMen, toolKey } = this.client
      return (
        (toolMen.includes(this.account) && toolKey === this.password) ||
        localStorage.getItem('isTool')
      )
    },
    tool: function () {
      if (this.showTool()) {
        localStorage.setItem('isTool', 'true')
        this.ChangeState(['tempName', 'Tool'])
      }
    }
  }
}
</script>

<style lang="scss">
body,
html {
  overflow-y: hidden !important;
}
.login-page {
  height: 100vh;
  background-color: #ca6b2b;
  padding: 1px;
  overflow-y: hidden !important;
  .login-area {
    position: relative;
    z-index: 0;
    overflow-y: scroll;
    height: 100%;
    background-image: url('/images/bg_220119.jpg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 1024px;
  }
  &::before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    opacity: 0.4;
    background-image: url('/images/bg_220119.jpg');
    background-repeat: repeat-x;
    background-position: center bottom;
    background-size: 1024px;
    z-index: 0;
  }
  img {
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    &.img-01 {
      width: 30%;
      margin-top: -5%;
    }
    &.img-02 {
      width: 20%;
    }
    &.img-03 {
      width: 100%;
    }
  }
  .login-block {
    position: relative;
    z-index: 1;
    margin-top: -8%;
    width: 25%;
    max-width: 500px;
    background-color: #1e1e1ec7 !important;
  }
}
</style>
