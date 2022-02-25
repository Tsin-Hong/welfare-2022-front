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
        console.log('[INFO] wsOnReceiveAUTHORIZE recived: ', received)
        if (typeof received.act === 'number') {
          let msg = '成功!'
          switch (received.act) {
            case enums.ACT_MOVE:
              msg = '行軍成功!'
              break
            case enums.ACT_LEAVE_COUNTRY:
              msg = '下野成功!'
              break
            case enums.ACT_ENTER_COUNTRY:
              msg = '入仕成功!'
              break
            case enums.ACT_SEARCH_WILD:
              msg = '探索成功!'
              break
            case enums.ACT_INCREASE_SOLDIER:
              msg = '徵兵成功!'
              break
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
