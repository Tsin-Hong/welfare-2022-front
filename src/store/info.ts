import parser from '../unit/parser'
import enums from '../unit/enum'

const info = {
  state: {
    successMsg: '',
    successOpen: false,
    errorMsg: '',
    errorOpen: false,
    padding: []
  },
  mutations: {
  },
  actions: {
    showClientDialog: function (content: any, payload: any) {
      content.dispatch('ApiRes', { content: payload })
    },
    wsOnReceiveAUTHORIZE: (content: any, message: any) => {
      if (message.byteLength < 0x0400) {
        const received = parser.arrayBufferToJSON(message)
        // console.log('[INFO] wsOnReceiveAUTHORIZE recived: ', received)
        // console.log('content.rootState: ', content.rootState)
        if (typeof received.act === 'number') {
          let msg = '成功!'
          switch (received.act) {
            case enums.ACT_MOVE:
              msg = '行軍成功!'
              break
            case enums.ACT_LEAVE_COUNTRY:
              msg = '下野成功! 可以開始浪跡天涯'
              break
            case enums.ACT_ENTER_COUNTRY: {
              const cid = received.payload.countryId || 0;
              const conntry = content.rootState.global.countries.find(c => c.id == cid)
              if (cid > 0) {
                msg = `入仕成功! 成功加入國家【 ${conntry ? conntry.name : ''} 】`
              } else {
                msg = '入仕失敗, 請恢復行動力後再嘗次'
              }
            }  break
            case enums.ACT_SEARCH_WILD: {
              const adds = received.payload.money - content.rootState.user.money
              msg = `探索成功! 找到了【黃金】X ${adds}`
            } break
            case enums.ACT_INCREASE_SOLDIER: {
              const adds = received.payload.soldier - content.rootState.user.soldier
              msg = `徵兵成功! 有 【 ${adds} 】 位士兵願意追隨您`
            } break
            case enums.ACT_BUSINESS: {
              const adds = received.payload.money - content.rootState.user.money
              msg = `商業執行成功! 獲得【黃金】X ${adds}`
            } break
            default:
          }
          content.dispatch('showClientDialog', msg)
        }
      }
    },
    wsOnReceiveMESSAGE: (content: any, message: any) => {
      if (message.byteLength < 0x0400) {
        const decoded = parser.arrayBufferToJSON(message)
        if (decoded.act === enums.ALERT) {
          const payload = decoded.payload
          let errorMsg = '未知錯誤'
          switch (payload.act) {
            case enums.ACT_LEVELUP_CITY:
              errorMsg = '建築失敗'
              if (payload.msg == 'Money Not Enough.') {
                errorMsg += '，黃金不足。'
              } else if (payload.msg == 'Lv Out Of Max.') {
                errorMsg += '，該建築已達最高等級。'
              }
              break
            case enums.ACT_MOVE:
              errorMsg = '行軍失敗'
              break
            case enums.ACT_LEAVE_COUNTRY:
              errorMsg = '下野失敗'
              break
            case enums.ACT_ENTER_COUNTRY:
              errorMsg = '入仕失敗'
              break
            case enums.ACT_SEARCH_WILD:
              errorMsg = '探索未知失敗'
              break
            case enums.ACT_INCREASE_SOLDIER:
              errorMsg = '徵兵未能成功'
              break
            default:
          }
          content.dispatch('showClientDialog', errorMsg)
        }
      }
    }
  }
}

export default info
