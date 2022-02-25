const clinet = {
  state: {
    tempName: 'None',
    dialog: false,
    dialog_content: {
      title: '',
      text: '',
      img: ''
    },
    dialog_check: false,
    dialog_check_curr: {
      key: '',
      index: ''
    },
    dialog_check_content: {
      title: ''
    }
  },
  mutations: {
    ChangeState: function (state: any, payload = []) {
      // console.log(payload)
      const key = payload[0]
      state[key] = payload[1]
    },
    ChangeApiCheck: function (state: any, payload = { key: '', index: '' }) {
      state.dialog_check = true
      state.dialog_check_content.title = payload.key
      state.dialog_check_curr.key = payload.key
      state.dialog_check_curr.index = payload.index
    },
    ChangeApiResult: function (state: any, payload = {}) {
      state.dialog_content = payload
      state.dialog = true
    }
  },
  getters: {

  },
  actions: {
    ApiJoinCountry: function ({ state, commit }: { state: any, commit: any }) {
      const res = {
        img: state.dialog_check_curr.index + '.jpg',
        title: '入仕成功',
        text: '你已加入 叡迅君主 謝小白 麾下，為國家建立豐功偉業是臣子光榮的義務。'
      }

      commit('ChangeApiResult', res)
    },
    ApiAddTroops: function ({ state, commit }: { state: any, commit: any }) {
      const res = {
        img: state.dialog_check_curr.index + '.jpg',
        title: '增兵成功',
        text: '本次有 500 兵力加入你的軍隊。'
      }

      commit('ChangeApiResult', res)
    }
  }
}

export default clinet
