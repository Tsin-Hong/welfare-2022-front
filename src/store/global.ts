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
    itemMap: {},
    items: [],
    itemSellerMap: {/* name: mapId */},
    itemShop: [],
    selectedItemId: 0,
    datetime: null,
    keepAliveNum: 0,
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
            state.domesticMessages = payload.domesticMessages.map(e => [new Date(e[0]), e[1]])
            state.domesticMessages.sort((a,b) => b[0] - a[0])
          }
          if (payload.battlefieldMap) {
            state.battlefieldMap = payload.battlefieldMap
          }
          if (payload.occupationMap) {
            state.occupationMap = payload.occupationMap
          }
          if (payload.gameMap) {
            state.gameMap = payload.gameMap
          }
          if (payload.itemMap) {
            state.itemMap = payload.itemMap
            state.itemShop = payload.itemShop
            state.itemSellerMap = payload.itemSellerMap
            // console.log('itemSellerMap: ', state.itemSellerMap)
          }
          if (payload.datetime) {
            state.datetime = new Date(payload.datetime)
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
          if (payload.datetime) {
            state.datetime = new Date(payload.datetime);
          }
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
          state.warRecords = state.warRecords.concat([payload])
          state.warRecords.sort((a,b) => b.id - a.id);
        } break
        case enums.ACT_NOTIFICATION_DOMESTIC: {
          const newmsg = [new Date(payload[0]), payload[1]]
          state.domesticMessages = [newmsg].concat(state.domesticMessages)
        } break
        case enums.ACT_RAISE_COUNTRY: {
          const newCountry = payload.newCountry
          const mapId = payload.mapId
          const gameType = payload.gameType
          const idx = state.maps.findIndex(m => m.id == mapId)
          state.maps[idx].gameType = gameType
          state.maps[idx].ownCountryId = newCountry.id
          const newCountries = state.countries.slice()
          newCountries.push(newCountry)
          state.countries = newCountries
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
        case enums.ACT_GET_ITEMS: {
          state.items = payload
        } break
        case enums.ACT_GET_ITEM_SELLER: {
          state.itemSellerMap = payload.itemSellerMap;
        } break
        case enums.ACT_GET_TIME: {
          if (payload.datetime) {
            state.datetime = new Date(payload.datetime);
            state.keepAliveNum = 0;
          }
        } break
        default:
      }
    },
    setIO: (state: any, io: any) => {
      state.io = io
    },
    updateGlobal: (state: any, payload: any) => {
      if (payload) {
        Object.keys(payload).map(key => {
          if (typeof state[key] != 'undefined') {
            state[key] = payload[key]
          } else {
            console.log('payload key not found: ', key, payload)
          }
        })
      } else {
        console.log('global mutation failed: ', payload)
      }
    },
    addDatetimeSeconds: (state: any, seconds = 1) => {
      // console.log('state.datetime: ', state.datetime);
      if (state.datetime) {
        state.datetime = new Date(state.datetime.getTime() + (seconds*1000));
        state.keepAliveNum = state.keepAliveNum + 1;
      }
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
    actAppointOccupation: (content: any, args: any) => {
      /**
       * 任命官吏
       * @param {number} userId
       * @param {number} occupationId
       * 
       * occupationId 參考 occupationMap 裡的資料中id
       */
      content.dispatch('emitMessage', {act: enums.ACT_APPOINTMENT, payload: args});
    },
    actDismissOccupation: (content: any, args: any) => {
      /**
       * 解除官吏
       * @param {number} userId
       * 
       */
      content.dispatch('emitMessage', {act: enums.ACT_DISMISS, payload: args});
    },
    actLevelUpCity: (content: any, args: any) => {
      /**
       * 升級建築
       * @param {number} cityId
       * @param {string} constructionName  [ "barrack" , "market" , "stable" , "wall" ]
       * 
       * cityId 指的是 cities 全域資料裡的id  並非 maps 裡的id
       * constructionName 請參考 enum 裡的 CHINESE_CONSTRUCTION_NAMES KEY
       */
      content.dispatch('emitMessage', {act: enums.ACT_LEVELUP_CITY, payload: args});
    },
    actShare: (content: any, args: any) => {
      /**
       * 配給
       * @param {number} userId
       * @param {number} money
       * @param {number} soldier
       * 
       * 暫時先開放配給 黃金跟士兵 直接指定要給的數量 如果money或soldier其一沒有則給 0
       */
      content.dispatch('emitMessage', {act: enums.ACT_SHARE, payload: args});
    },
    actEscape: (content: any, args: any) => {
      /**
       * 逃脫
       * @param {number} money
       * 
       * 被俘虜時有10%機率逃往主城 解除俘虜狀態 每多100黃金增加機率1%  如不花費黃金則給 0
       */
      content.dispatch('emitMessage', {act: enums.ACT_ESCAPE, payload: args});
    },
    actSelectGame: (content: any, args: any) => {
      /**
       * 主城選遊戲項
       * @param {number} battleId
       * @param {number} mapId
       * @param {number} gameId
       */
      content.dispatch('emitMessage', {act: enums.ACT_BATTLE_SELECT_GAME, payload: args});
    },
    getWarRecord: (content: any, args: any) => {
      /**
       * 歷史戰鬥
       * @param {number} battleId
       */
      content.dispatch('emitMessage', {act: enums.ACT_GET_BATTLE_DETAIL, payload: args});
    },
    actRecruit: (content: any, args: any) => {
      /**
       * 招募
       * @param {number} userId
       */
      content.dispatch('emitMessage', {act: enums.ACT_RECRUIT, payload: args});
    },
    actRecruitCaptive: (content: any, args: any) => {
      /**
       * 招募俘虜
       * @param {number} userId
       */
      content.dispatch('emitMessage', {act: enums.ACT_RECRUIT_CAPTIVE, payload: args});
    },
    actReleaseCaptive: (content: any, args: any) => {
      /**
       * 釋放俘虜
       * @param {number} userId
       */
      content.dispatch('emitMessage', {act: enums.ACT_RELEASE_CAPTIVE, payload: args});
    },
    actSetOriginCity: (content: any, args: any) => {
      /**
       * 重設主城
       * @param {number} cityId
       * @param {number} gameTypeId
       */
      content.dispatch('emitMessage', {act: enums.ACT_SET_ORIGIN_CITY, payload: args});
    },
    actRaiseCountry: (content: any) => {
      /**
       * 起義
       * @param {number} countryName
       * @param {number} colorBg
       * @param {number} colorText
       * @param {number} gameTypeId
       */
      const countryName = window.prompt('輸入國家名稱(兩中文字內): ')
      const colorBg = window.prompt('輸入國家背景色(RGB, 例如#ff00ff): ')
      const colorText = window.prompt('輸入國家字色(RGB, 例如#ffff00): ')
      const gameTypes = Object.keys(enums.CHINESE_GAMETYPE_NAMES).map(key => [parseInt(key), enums.CHINESE_GAMETYPE_NAMES[key]])
      const gameTypeId = parseInt(window.prompt(gameTypes.map(f => `${f[0]} -> ${f[1]}`).join('\r\n')))
      content.dispatch('emitMessage', {act: enums.ACT_RAISE_COUNTRY, payload: {countryName, colorBg, colorText, gameTypeId}});
    },
    actRebellion: (content: any) => {
      /**
       * 叛亂
       * @param {number} countryName
       * @param {number} colorBg
       * @param {number} colorText
       * @param {number} gameTypeId
       */
       const countryName = window.prompt('輸入國家名稱(兩中文字內): ');
       const colorBg = window.prompt('輸入國家背景色RGB,例如#ff00ff): ');
       const colorText = window.prompt('輸入國家字色(RGB,例如#ffff00): ');
       const gameTypes = Object.keys(enums.CHINESE_GAMETYPE_NAMES).map(key => [parseInt(key), enums.CHINESE_GAMETYPE_NAMES[key]]);
       const gameTypeId = parseInt(window.prompt(gameTypes.map(f => `${f[0]} -> ${f[1]}`).join('\r\n')));
      content.dispatch('emitMessage', {act: enums.ACT_REBELLION, payload: {countryName, colorBg, colorText, gameTypeId}});
    },
    getItems: (content: any) => {
      content.dispatch('emitMessage', {act: enums.ACT_GET_ITEMS});
    },
    clearItems: (content: any) => {
      content.commit('updateGlobal', {items: []});
    },
    actUseItem: (content: any, args: any) => {
      /**
       * 使用錦囊
       * @param {number} itemId
       * @param {number} itemPkId
       * @param {number} mapId
       */
      content.dispatch('emitMessage', {act: enums.ACT_USE_ITEM, payload: args});
    },
    actBuyItem: (content: any, args: any) => {
      /**
       * 交易錦囊
       * @param {number} itemId
       */
      content.dispatch('emitMessage', {act: enums.ACT_BUY_ITEM, payload: args});
    },
  },
  getters: {
    mapIdMap (state) {
      const hashmap = {}
      state.maps.map(map => {
        hashmap[map.id] = map
      })
      return hashmap
    },
    getItemAllowedMapIds (state, getters) {
      const mapIdMap = getters.mapIdMap
      const itemMap = state.itemMap
      const maps = state.maps
      const selectedItemId = state.selectedItemId
      return (myself, itemid = 0) => {
        const itemdata = itemid ? itemMap[itemid] : itemMap[selectedItemId]
        if (!itemdata) return []
        let filterFn = null
        let filterMaps = []
        if (itemdata.lv == 0) {
          filterMaps = maps.map(m => m.id)
        } else if (itemdata.lv == 1) {
          const standMap = mapIdMap[myself.mapNowId]
          filterMaps = !!standMap ? standMap.route.concat(myself.mapNowId) : []
        }
        // console.log('filterMaps: ', filterMaps)
        switch (itemdata.object) {
            case 1: /* '任意據點' */ break;
            case 2: /* '己方據點' */ filterFn = (mid) => mapIdMap[mid].ownCountryId == myself.countryId; break;
            case 3: /* '敵方據點' */ filterFn = (mid) => mapIdMap[mid].ownCountryId !== myself.countryId; break;
            case 4: /* '任何城池' */ filterFn = (mid) => mapIdMap[mid].cityId > 0; break;
            case 5: /* '友方城池' */ filterFn = (mid) => mapIdMap[mid].cityId > 0 && mapIdMap[mid].ownCountryId == myself.countryId;break;
            case 6: /* '敵方城池' */ filterFn = (mid) => mapIdMap[mid].cityId > 0 && mapIdMap[mid].ownCountryId !== myself.countryId;break;
            case 7: /* '任意野區' */ filterFn = (mid) => mapIdMap[mid].cityId == 0; break;
            case 8: /* '友方野區' */ filterFn = (mid) => mapIdMap[mid].cityId == 0 && mapIdMap[mid].ownCountryId == myself.countryId;break;
            case 9: /* '敵方野區' */ filterFn = (mid) => mapIdMap[mid].cityId == 0 && mapIdMap[mid].ownCountryId !== myself.countryId;break;
            default:

        }
        if (typeof filterFn == 'function') {
          filterMaps = filterMaps.filter(filterFn)
        }
        if (itemdata.staticKey == '_STRATEGY_SNEAK_' || itemdata.staticKey == '_STRATEGY_SEIZE_') {
          filterMaps = filterMaps.filter(mid => !state.battlefieldMap[mid])
        }
        return filterMaps
      }
    },
    hashMapSellers (state) {
      const result = {}
      const itemSellerMap = state.itemSellerMap
      itemSellerMap && Object.keys(itemSellerMap).map(key => {
        const mapId = itemSellerMap[key]
        if (result[mapId]) {
          result[mapId].push(key)
        } else {
          result[mapId] = [key]
        }
      });
      return result
    },
  }
}

export default global
