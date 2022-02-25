import parser from '../unit/parser'
import algorithm from '../unit/mapAlgorithm'
import enums from '../unit/enum'

const global = {
  state: {
    users: [],
    maps: [],
    cities: [],
    countries: [],
    io: null
  },
  mutations: {
    wsOnMESSAGE: (state: any, message: any) => {
      const parsedMsg = parser.arrayBufferToJSON(message)
      console.log('Socket On Message Parsed: ', parsedMsg)
      const payload = parsedMsg.payload
      switch (parsedMsg.act) {
        case enums.ACT_GET_GLOBAL_DATA:
          state.users = parser.parseArraiesToObjects(payload.users, enums.UserGlobalAttributes)
          state.maps = parser.parseArraiesToObjects(payload.maps, enums.MapsGlobalAttributes)
          state.cities = parser.parseArraiesToObjects(payload.cities, enums.CityGlobalAttributes)
          state.countries = parser.parseArraiesToObjects(payload.countries, enums.CountryGlobalAttributes)
          algorithm.setData(state.maps)
          break
        case enums.ACT_GET_GLOBAL_CHANGE_DATA: {
          const dataset = payload.dataset
          Array.isArray(dataset) && dataset.map(_ => {
            const pointer = _.depth.reduce((p: any, d: any) => {
              if (typeof d === 'string') {
                return p[d]
              } else if (typeof d === 'number' && p.length > 0) {
                for (let i = 0; i < p.length; i++) {
                  if (p[i].id === d) { return p[i] }
                }
              }
              return {}
            }, state)
            console.log('pointer: ', pointer)
            Object.keys(_.update).map((key) => {
              const value = _.update[key]
              if (pointer[key]) { pointer[key] = value }
            })
          })
        } break
        case enums.ALERT:
          window.alert(payload.msg)
          break
        default:
      }
    },
    setIO: (state: any, io: any) => {
      state.io = io
    }
  },
  actions: {
    loadSocketio: (content: any, io: any) => {
      content.commit('setIO', io)
    },
    emitMessage: (content: any, message: any) => {
      content.state.io && content.state.io.emit('MESSAGE', message)
    },
    actMove: (content: any, message: any) => {
      content.dispatch('emitMessage', { act: enums.ACT_MOVE, payload: message })
    }
  },
  getters: {
  }
}

export default global
