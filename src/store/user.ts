import parser from '../unit/parser'
import enums from '../unit/enum'
import client from './client'
import global from './global'

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
      const payload = parsedMsg.payload || {}

      switch (parsedMsg.act) {
        case enums.FAILED: {
          window.localStorage.removeItem('_token_')
          window.alert(parsedMsg.reason)
          window.location.reload()
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

      if (parsedMsg.logout) {
        window.localStorage.removeItem('_token_')
        window.alert('有其他裝置也登入了此帳號.')
        window.location.reload()
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
    getUser: (state, rootState) => () => {
      const stateUser = state
      const user = {
        roleName: '',
        mapNowName: '',
        mapNowIndex: -1,
        mapNowIsCity: false,
        countryColors: '#fff',
        countryColorsT: '#000',
        countryName: '',
        ...stateUser
      }
      user.roleName = user.role === 0 ? '' : client.state.rolesObj[user.role].name

      for (const i in global.state.maps) {
        const curr = global.state.maps[i]
        if (curr.id === user.mapNowId) {
          user.mapNowName = curr.name
          user.mapNowIsCity = curr.cityId > 0
          user.mapNowIndex = parseInt(i)
          user.mapNowCityId = curr.cityId
        }
      }

      if (user.mapNowIsCity) {
        for (const i in global.state.cities) {
          const curr = global.state.cities[i]
          if (curr.id == user.mapNowCityId) {
            user.mapNowCity = curr
          }
        }
      }
      
      if (stateUser.countryId === 0) {
      } else {
        for (const i in global.state.countries) {
          const curr = global.state.countries[i]
          if (curr.id === stateUser.countryId) {
            const countryColors = curr.color.split(',')
            user.countryColors = countryColors[0]
            user.countryColorsT = countryColors[1]
            user.countryName = curr.name
          }
        }
      }

      return user
    }
  }
}

export default user
