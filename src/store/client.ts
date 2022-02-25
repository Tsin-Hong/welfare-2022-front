import mapAlgorithm from '@/unit/mapAlgorithm'

const client = {
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
      title: '',
      content: ''
    },
    status_type: '',
    could_be_move_to: []
  },
  mutations: {
    ChangeState: function (state: any, payload = []) {
      // console.log(payload)
      const key = payload[0]
      state[key] = payload[1]
    },
    ChangeDialogCheck: function (state: any, payload = { content: '' }) {
      console.log(payload)
      state.dialog_check_content.content = payload.content
      state.dialog_check = true
    },
    ChangeApiCheck: function (state: any, payload = { key: '', index: '' }) {
      state.dialog_check_curr.key = payload.key
      state.dialog_check_curr.index = payload.index
    },
    ChangeApiResult: function (state: any, payload = { }) {
      state.dialog_content = payload
      state.dialog = true
    }
  },
  getters: {

  },
  actions: {
    ApiMove: function ({ commit, rootState }, payload) {
      const user = rootState.user
      const res = mapAlgorithm.getAllowedPosition(user.mapNowIndex, user.actPoint)
      commit('ChangeState', ['status_type', 'move'])
      commit('ChangeState', ['could_be_move_to', res.all])
    },
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

export default client
