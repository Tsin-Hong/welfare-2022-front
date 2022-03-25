import parser from '../unit/parser'
import algorithm from '../unit/mapAlgorithm'
import enums from '../unit/enum'
import valication from './client-validation'

const global = {
  state: {
    users: [],
    maps: [],
    cities: [],
    countries: [],
    notifications: [],
    battlefieldMap: {/*0: {id: 0, attackCountryIds: [], defenceCountryId: 0, detail: {}, judgeId: 0, mapId: 0, round: 0, timestamp: 0, winnerCountryId: 0}*/},
    battleAreaPanel: {
      timeOptions: [],
      mapId: 0
    },
    occupationMap: {/*0: {id: 0, name: '', contributionCondi: 999, addActPoint: 5, isAllowedRecurit: false, isAllowedShare: false}*/},
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
          if (payload.notifications) {
            state.notifications = payload.notifications.map((e: any) => [new Date(e[0]), e[1]])
            state.notifications.sort((a: any, b: any) => b[0] - a[0])
          }
          if (payload.battlefieldMap) {
            state.battlefieldMap = payload.battlefieldMap;
          }
          if (payload.occupationMap) {
            state.occupationMap = payload.occupationMap;
          }
          valication.cacheGlobal(state)
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
            // console.log('pointer: ', pointer)
            Object.keys(_.update).map((key) => {
              const value = _.update[key]
              if (pointer.hasOwnProperty(key)) { pointer[key] = value }
            })
          })
        } break
        case enums.ACT_NOTIFICATION: {
          const newNoti = [new Date(payload[0]), payload[1]]
          state.notifications = [newNoti].concat(state.notifications);
        } break
        case enums.ACT_BATTLE: {
          const timeOptions = payload.options;
          const mapId = payload.mapId;
          if (timeOptions) {
            state.battleAreaPanel.timeOptions = timeOptions;
            state.battleAreaPanel.mapId = mapId;
          } else {
            state.battleAreaPanel.timeOptions = [];
            state.battleAreaPanel.mapId = 0;
          }
        } break
        case enums.ACT_BATTLE_ADD: {
          const mapId = payload.mapId;
          const nextBattlefield = { ...state.battlefieldMap };
          nextBattlefield[mapId] = payload.jsondata;
          state.battlefieldMap = nextBattlefield;
        } break
        case enums.ACT_BATTLE_DONE: {
          const mapId = payload.mapId;
          const nextBattlefield = { ...state.battlefieldMap };
          delete nextBattlefield[mapId];
          state.battlefieldMap = nextBattlefield;
        } break
        // case enums.ALERT:
        //   window.alert(payload.msg)
        //   break
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
      const validatedMessage = valication.validate(content.rootState.user , message, content.state)
      if (validatedMessage) {
        // window.alert(validatedMessage)
        console.log('validatedMessage: ', validatedMessage, ' | message: ', message)
        content.dispatch('showClientDialog', validatedMessage)
      } else {
        content.state.io && content.state.io.emit('MESSAGE', message)
      }
    },
    actMove: (content: any, message: any) => {
      // 移動  需要判斷 1.行動力能否抵達 2. 只能是自己的國家 or 是浪人
      return content.dispatch('emitMessage', { act: enums.ACT_MOVE, payload: message })
    },
    actIncreaseSoldier: (content: any) => {
      // 徵兵  需要判斷 1.行動點數夠 2. 是否在城市 3. 不能是浪人
      return content.dispatch('emitMessage', { act: enums.ACT_INCREASE_SOLDIER })
    },
    actSearchWild: (content: any) => {
      // 探索  需要判斷 1.行動點數夠 2. 是否在野區 3. 不能是浪人
      return content.dispatch('emitMessage', { act: enums.ACT_SEARCH_WILD })
    },
    actLeaveCountry: (content: any) => {
      // 下野  需要判斷 1.要有行動點 2.身分為武將 3.(效忠主公)loyalUserId=0 或滅過國
      content.dispatch('emitMessage', { act: enums.ACT_LEAVE_COUNTRY })
    },
    actEnterCountry: (content: any) => {
      // 入仕  需要判斷 1.要有行動點 2.不能被此國家滅過 3.所站之處必須有國家
      content.dispatch('emitMessage', { act: enums.ACT_ENTER_COUNTRY })
    },
    actBattle: (content: any, args: any) => {
      /** 
       * 出征
       * @param {number} mapId
       * @param {number} time  - 可選
       * @param {number} soldier    - 可選
       * 
       * 只帶 mapId 時會反推送 {number} options[] 會有可進行競賽的五個時間點
       * 有帶 timestamp 與 soldier 會確定攻打某處
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE, payload: args});
    },
    actBattleJoin: (content: any, args: any) => {
      /**w
       * 加入戰役
       * @param {number} mapId
       * @param {number} battleId
       * @param {number} soldier
       * @param {number} position
       * 
       * soldier  是指定派出的士兵數量
       * position 為 0 ~ 3 時是用來指定加入戰役中哪一個位置 (攻守方由server判斷)
       * position 為 4 時指定成為裁判
       * position 為 5 時指定成為工作人員
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE_JOIN, payload: args});
    },
    actBattleJudge: (content: any, args: any) => {
      /**
       * 判決結果
       * @param {number} mapId
       * @param {number} battleId
       * @param {number} winId
       * 
       * winId 為指定一個勝利國家的 country id, 必須是此戰役中的其中一方國家
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE_JUDGE, payload: args});
    },
    actBusiness: (content: any) => {
      /**
       * 商業
       * 
       * 可以獲得 [隨機 50 ~ 150 + 城池 addResource 值] 的黃金量
       */
      content.dispatch('emitMessage', {act: enums.ACT_BUSINESS});
    },
  },
  getters: {
  }
}

export default global
