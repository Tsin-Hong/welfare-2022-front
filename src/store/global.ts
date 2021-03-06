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
    domesticMessages: [],
    warRecords: [],
    battlefieldMap: {/*0: {id: 0, attackCountryIds: [], defenceCountryId: 0, detail: {}, judgeId: 0, mapId: 0, round: 0, timestamp: 0, winnerCountryId: 0}*/},
    gameMap: {/*0: {id: 0, name: '', type: 0, b1v1: true, b2v2: false, b3v3: false, b4v4: false,..} */},
    occupationMap: {/*0: {id: 0, name: '', contributionCondi: 999, addActPoint: 5, isAllowedRecurit: false, isAllowedShare: false}*/},
    battleAreaPanel: {
      timeOptions: [],
      mapId: 0
    },
    battleRecordDetails: { id: 0, winnerCountryId: 0, defenceCountryId: 0, attackCountryIds: [0], atkUserIds: [0,0,0,0], defUserIds: [0,0,0,0], judgeId: 0, toolmanId: 0, gameId: 0, timestamp: '', detail: {}},
    io: null
  },
  mutations: {
    wsOnMESSAGE: (state: any, message: any) => {
      const parsedMsg = parser.arrayBufferToJSON(message)
      // console.log('Socket On Message Parsed: ', parsedMsg)
      const payload = parsedMsg.payload
      switch (parsedMsg.act) {
        case enums.ACT_GET_GLOBAL_DATA:
          state.users = parser.parseArraiesToObjects(payload.users, enums.UserGlobalAttributes)
          state.maps = parser.parseArraiesToObjects(payload.maps, enums.MapsGlobalAttributes)
          state.cities = parser.parseArraiesToObjects(payload.cities, enums.CityGlobalAttributes)
          state.countries = parser.parseArraiesToObjects(payload.countries, enums.CountryGlobalAttributes)
          state.warRecords = parser.parseArraiesToObjects(payload.warRecords, enums.WarRecordGlobalAttributes)
          state.warRecords.sort((a,b) => b.id - a.id)
          algorithm.setData(state.maps)
          if (payload.notifications) {
            state.notifications = payload.notifications.map((e: any) => [new Date(e[0]), e[1]])
            state.notifications.sort((a: any, b: any) => b[0] - a[0])
          }
          if (payload.domesticMessages) {
            state.domesticMessages = payload.domesticMessages.map(e => [new Date(e[0]), e[1]]);
            state.domesticMessages.sort((a,b) => b[0] - a[0]);
          }
          if (payload.battlefieldMap) {
            state.battlefieldMap = payload.battlefieldMap;
          }
          if (payload.occupationMap) {
            state.occupationMap = payload.occupationMap;
          }
          if (payload.gameMap) {
            state.gameMap = payload.gameMap;
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
        case enums.ACT_GET_GLOBAL_USERS_INFO: {
          state.users = parser.parseArraiesToObjects(payload.users, enums.UserGlobalAttributes)
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
          state.warRecords = state.warRecords.concat([payload]);
          state.warRecords.sort((a,b) => b.id - a.id);
        } break
        case enums.ACT_NOTIFICATION_DOMESTIC: {
          const newmsg = [new Date(payload[0]), payload[1]]
          state.domesticMessages = [newmsg].concat(state.domesticMessages)
        } break
        case enums.ACT_BATTLE_GAME_SELECTED: {
          const mapId = payload.mapId;
          const gameId = payload.gameId;
          const nextBattlefield = { ...state.battlefieldMap };
          nextBattlefield[mapId].gameId = gameId;
          state.battlefieldMap = nextBattlefield;
        } break
        case enums.ACT_GET_BATTLE_DETAIL: {
          state.battleRecordDetails = payload;
        } break
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
      // ??????  ???????????? 1.????????????????????? 2. ???????????????????????? or ?????????
      return content.dispatch('emitMessage', { act: enums.ACT_MOVE, payload: message })
    },
    actIncreaseSoldier: (content: any) => {
      // ??????  ???????????? 1.??????????????? 2. ??????????????? 3. ???????????????
      return content.dispatch('emitMessage', { act: enums.ACT_INCREASE_SOLDIER })
    },
    actSearchWild: (content: any) => {
      // ??????  ???????????? 1.??????????????? 2. ??????????????? 3. ???????????????
      return content.dispatch('emitMessage', { act: enums.ACT_SEARCH_WILD })
    },
    actLeaveCountry: (content: any) => {
      // ??????  ???????????? 1.??????????????? 2.??????????????? 3.(????????????)loyalUserId=0 ????????????
      content.dispatch('emitMessage', { act: enums.ACT_LEAVE_COUNTRY })
    },
    actEnterCountry: (content: any) => {
      // ??????  ???????????? 1.??????????????? 2.???????????????????????? 3.???????????????????????????
      content.dispatch('emitMessage', { act: enums.ACT_ENTER_COUNTRY })
    },
    actBattle: (content: any, args: any) => {
      /** 
       * ??????
       * @param {number} mapId
       * @param {number} time  - ??????
       * @param {number} soldier    - ??????
       * 
       * ?????? mapId ??????????????? {number} options[] ???????????????????????????????????????
       * ?????? timestamp ??? soldier ?????????????????????
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE, payload: args});
    },
    actBattleJoin: (content: any, args: any) => {
      /**w
       * ????????????
       * @param {number} mapId
       * @param {number} battleId
       * @param {number} soldier
       * @param {number} position
       * 
       * soldier  ??????????????????????????????
       * position ??? 0 ~ 3 ???????????????????????????????????????????????? (????????????server??????)
       * position ??? 4 ?????????????????????
       * position ??? 5 ???????????????????????????
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE_JOIN, payload: args});
    },
    actBattleJudge: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} mapId
       * @param {number} battleId
       * @param {number} winId
       * 
       * winId ?????????????????????????????? country id, ??????????????????????????????????????????
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE_JUDGE, payload: args});
    },
    actBusiness: (content: any) => {
      /**
       * ??????
       * 
       * ???????????? [?????? 50 ~ 150 + ?????? addResource ???] ????????????
       */
      content.dispatch('emitMessage', {act: enums.ACT_BUSINESS});
    },
    actAppointOccupation: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} userId
       * @param {number} occupationId
       * 
       * occupationId ?????? occupationMap ???????????????id
       */
      content.dispatch('emitMessage', {act: enums.ACT_APPOINTMENT, payload: args});
    },
    actDismissOccupation: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} userId
       * 
       */
      content.dispatch('emitMessage', {act: enums.ACT_DISMISS, payload: args});
    },
    actLevelUpCity: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} cityId
       * @param {string} constructionName  [ "barrack" , "market" , "stable" , "wall" ]
       * 
       * cityId ????????? cities ??????????????????id  ?????? maps ??????id
       * constructionName ????????? enum ?????? CHINESE_CONSTRUCTION_NAMES KEY
       */
      content.dispatch('emitMessage', {act: enums.ACT_LEVELUP_CITY, payload: args});
    },
    actShare: (content: any, args: any) => {
      /**
       * ??????
       * @param {number} userId
       * @param {number} money
       * @param {number} soldier
       * 
       * ????????????????????? ??????????????? ??????????????????????????? ??????money???soldier?????????????????? 0
       */
      content.dispatch('emitMessage', {act: enums.ACT_SHARE, payload: args});
    },
    actEscape: (content: any, args: any) => {
      /**
       * ??????
       * @param {number} money
       * 
       * ???????????????10%?????????????????? ?????????????????? ??????100??????????????????1%  ???????????????????????? 0
       */
      content.dispatch('emitMessage', {act: enums.ACT_ESCAPE, payload: args});
    },
    actSelectGame: (content: any, args: any) => {
      /**
       * ??????????????????
       * @param {number} battleId
       * @param {number} mapId
       * @param {number} gameId
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE_SELECT_GAME, payload: args});
    },
    getWarRecord: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} battleId
       */
      content.dispatch('emitMessage', {act: enums.ACT_GET_BATTLE_DETAIL, payload: args});
    },
    actRecruit: (content: any, args: any) => {
      /**
       * ??????
       * @param {number} userId
       */
      content.dispatch('emitMessage', {act: enums.ACT_RECRUIT, payload: args});
    },
    actRecruitCaptive: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} userId
       */
      content.dispatch('emitMessage', {act: enums.ACT_RECRUIT_CAPTIVE, payload: args});
    },
    actReleaseCaptive: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} userId
       */
      content.dispatch('emitMessage', {act: enums.ACT_RELEASE_CAPTIVE, payload: args});
    },
    actSetOriginCity: (content: any, args: any) => {
      /**
       * ????????????
       * @param {number} cityId
       * @param {number} gameTypeId
       */
      content.dispatch('emitMessage', {act: enums.ACT_SET_ORIGIN_CITY, payload: args});
    },
    actRaiseCountry: (content: any) => {
      /**
       * ??????
       * @param {number} countryName
       * @param {number} colorBg
       * @param {number} colorText
       * @param {number} gameTypeId
       */
      const countryName = window.prompt('??????????????????(???????????????): ')
      const colorBg = window.prompt('?????????????????????(RGB, ??????#ff00ff): ')
      const colorText = window.prompt('??????????????????(RGB, ??????#ffff00): ')
      const gameTypes = Object.keys(enums.CHINESE_GAMETYPE_NAMES).map(key => [parseInt(key), enums.CHINESE_GAMETYPE_NAMES[key]])
      const gameTypeId = parseInt(window.prompt(gameTypes.map(f => `${f[0]} -> ${f[1]}`).join('\r\n')))
      content.dispatch('emitMessage', {act: enums.ACT_RAISE_COUNTRY, payload: {countryName, colorBg, colorText, gameTypeId}});
    },
    getItems: (content: any) => {
      content.dispatch('emitMessage', {act: enums.ACT_GET_ITEMS});
    },
    clearItems: (content: any) => {
      content.commit('updateGlobal', {items: []});
    },
    actUseItem: (content: any, args: any) => {
      content.dispatch('emitMessage', {act: enums.ACT_USE_ITEM, payload: args});
    },
  },
  getters: {
  }
}

export default global
