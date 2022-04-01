import mapAlgorithm from '@/unit/mapAlgorithm'

const client = {
  state: {
    tempName: 'None',
    dialog_battle_list: false,
    dialog_battle: false,
    dialog_info: false,
    dialog: false,
    dialog_level_up_city: false,
    dialog_content: {
      title: '',
      text: '',
      img: ''
    },
    dialog_check_input_name: '',
    dialog_check: false,
    dialog_check_curr: {
      key: '',
      index: '',
      id: 0
    },
    dialog_check_content: {
      title: '',
      content: ''
    },
    status_type: '',
    could_be_move_to: [],
    battle_worker_type: {
      judge: ['判', '裁判', 4],
      toolman: ['攝', '攝影師', 5],
    },
    rolesObj: {
      1: {
        name: '君主'
      },
      2: {
        name: '武將'
      },
      3: {
        name: '浪人'
      }
    }
  },
  mutations: {
    ChangeState: function (state, payload) {
      const key = payload[0]
      state[key] = payload[1]
    },
    ChangeDialogCheck: function (state, payload) {
      state.dialog_check_content.content = '確定要執行' + payload.content + '?'
      state.dialog_check_input_name = payload.input_name ? payload.input_name : ''
      state.dialog_check = true
    },
    ChangeApiCheck: function (state: any, payload = { key: '', index: '', id: 0 }) {
      state.dialog_check_curr.key = payload.key
      state.dialog_check_curr.index = payload.index
      state.dialog_check_curr.id = payload.id
    },
    ChangeApiResult: function (state: any, payload = {}) {
      state.dialog_content = payload
      state.dialog = true
    }
  },
  getters: {},
  actions: {
    ApiMove: function ({ commit, rootState }, payload) {
      const user = rootState.user
      const res = mapAlgorithm.getAllowedPosition(user.mapNowId, user.actPoint, user.countryId)
      if (user.countryId > 0) {
        const mapIds = rootState.global.maps.filter((e: any) => e.ownCountryId === user.countryId).map((e: any) => e.id)
        res.all = res.all.filter((id: any) => mapIds.includes(id))
      }

      commit('ChangeState', ['status_type', 'move'])
      commit('ChangeState', ['could_be_move_to', res.all])
    },
    ApiRes: function ({ state, commit }, payload) {
      const res = {
        img: state.dialog_check_curr.index + '.jpg',
        // title: state.dialog_check_curr.key + '成功',
        title: state.dialog_check_curr.key,
        text: payload.content
      }
      // '你已加入 叡迅君主 謝小白 麾下，為國家建立豐功偉業是臣子光榮的義務。'
      commit('ChangeApiResult', res)
    }
  }
}

export default client
