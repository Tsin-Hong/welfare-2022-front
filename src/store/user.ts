import parser from '../unit/parser'
import enums from '../unit/enum'

const userInitState = {
  id: 0,
  code: '',
  nickname: '',
  nameZh: '',
  nameEn: '',
  countryId: 0,
  loyalUserId: 0,
  loyalty: 0,
  contribution: 0,
  occupationId: 0,
  role: 0,
  money: 0,
  actPoint: 0,
  actPointMax: 0,
  mapTargetId: 0,
  mapNowId: 0,
  mapNextId: 0,
  mapPathIds: [],
  destoryByCountryIds: [],
  soldier: 0,
  captiveDate: 0,
  connected: false
}

const user = {
  state: { ...userInitState },
  mutations: {
    wsOnAUTHORIZE: (state: any, message: any) => {
      const parsedMsg = parser.arrayBufferToJSON(message) // byte array 轉回 json
      console.log('Socket On Authorize Parsed: ', parsedMsg)
      const payload = parsedMsg.payload

      switch (parsedMsg.act) {
        case enums.FAILED: {
          window.localStorage.removeItem('_token_')
          window.alert(parsedMsg.reason)
          break
        }
        case enums.AUTHORIZE:
        default:
          Object.keys(payload).map(key => {
            state[key] = payload[key]
          })
          state.connected = true
          break
      }

      if (parsedMsg.redirect) {
        window.location.href = parsedMsg.redirect
      }
      if (parsedMsg.token) {
        window.localStorage.setItem('_token_', parsedMsg.token)
      }
    }
  },
  actions: {
  },
  getters: {

  }
}

export default user
