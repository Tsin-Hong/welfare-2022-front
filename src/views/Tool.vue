<template>
  <div class="tool-page">
    <div v-if="finished" class="final">
      <div class="final-title">
        <div class="main-title">{{ title }}</div>
        <div class="sub-title">{{ subTitle }} 對戰配對結果</div>
      </div>
      <v-row class="p-24-px">
        <v-col
          class="p-6-px"
          cols="3"
          v-for="(items, indexs) in results"
          :key="indexs"
        >
          <div class="vs">
            <div class="group d-flex">
              <div v-for="(code, index) in items" :key="index" class="vs-block">
                <div
                  class="vs-user-area"
                  :class="[listObj[code].name == '武將' && 'no-one']"
                >
                  <v-img
                    v-if="listObj[code] && !listObj[code].userImageDone"
                    class="img"
                    :src="'/images/user/' + listObj[code].code + '.png'"
                    contain
                    max-height="100%"
                  />
                  <v-img
                    v-else
                    class="img unImg"
                    contain
                    max-height="100%"
                    :src="getUserImgUrl(listObj[code])"
                    @error="onUserImgLoadA(code)"
                  />
                  <div class="user-name">
                    {{ listObj[code].name }}
                  </div>
                </div>
                <div class="w-50-pct">
                  <div
                    class="country-name"
                    :style="{
                      color: listObj[code].countryColor[0],
                      'text-shadow':
                        '0px 0px 10px ' + listObj[code].countryColor[1]
                    }"
                  >
                    {{ listObj[code].countryName }}
                  </div>
                  <div
                    class="country-name-bg"
                    :style="{
                      background: listObj[code].countryColor[0]
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="title-area-bg"></div>
            <div class="vs-icon"></div>
          </div>
        </v-col>
      </v-row>
    </div>
    <template v-else>
      <div class="vs">
        <div class="group d-flex">
          <div v-for="(item, index) in vsList" :key="index" class="vs-block">
            <div
              class="vs-user-area"
              :class="[item.name == '武將' && 'no-one']"
            >
              <v-img
                v-if="item.code === 'R000' || (item.code && item.userImageDone)"
                class="img"
                :src="getUserImgUrl(item)"
                contain
                max-height="100%"
              />
              <v-img
                v-else
                class="img unImg"
                contain
                max-height="100%"
                :src="'/images/user/' + item.code + '.png'"
              />
              <div class="user-name">
                {{ item.name }}
              </div>
            </div>
            <div class="w-50-pct">
              <div
                class="country-name"
                :style="{
                  color: item.countryColor[0],
                  'text-shadow': '0px 0px 10px ' + item.countryColor[1]
                }"
              >
                {{ item.countryName }}
              </div>
              <div
                class="country-name-bg"
                :style="{
                  background: item.countryColor[0]
                }"
              ></div>
            </div>
          </div>
        </div>
        <div class="title-area-bg"></div>
        <div class="title-area d-flex">
          <div class="title">{{ title }}</div>
          <div class="times align-self-end">{{ subTitle }}</div>
        </div>
        <div class="vs-icon"></div>
      </div>
      <div class="list d-flex justify-center flex-wrap">
        <div
          v-for="(item, index) in list"
          :key="index"
          style="width: 8%; height: 100px"
          class="img-area m-5-px"
          :class="{
            active: item.disable,
            selected: animationSelectedCode == item.code
          }"
        >
          <div class="w-100-pct">
            <v-img
              v-if="item.code && !item.userImageDone"
              :src="'/images/user/' + item.code + '.png'"
              :aspect-ratio="9 / 12"
              class="pt-5 real-img"
              style="top: -30px"
            />
            <v-img
              v-else
              class="pt-5 un-img"
              :aspect-ratio="9 / 12"
              style="top: -30px"
              :src="getUserImgUrl(item)"
              @error="onUserImgLoad(index)"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Tool',

  data() {
    return {
      title: '官渡之戰 個人賽',
      subTitle: '第二輪',
      roleMapObj: {
        1: '_1',
        2: '',
        3: '_0'
      },
      occupationIdMapObj: {
        1: '_2',
        2: '_2',
        3: '_3',
        4: '_3',
        5: '_3',
        6: '_3',
        7: '_3',
        8: '_3',
        9: '_4'
      },
      defaultVsObj: {
        code: 'R000',
        role: 2,
        name: '武將',
        occupationId: 0,
        countryName: '國家',
        countryColor: ['#A1A1A1', '#FFF']
      },
      // list:人選清單
      list: [],
      // vsList: 對抗清單
      vsList: [],
      animationSelectedCode: '',
      results: []
    }
  },

  computed: {
    finished() {
      return this.results.length * 2 === this.list.length
    },
    enableList() {
      return this.list.filter((e) => !e.disable)
    },
    listObj() {
      return this.list.reduce(function (target, key, index) {
        target[key.code] = key
        return target
      }, {})
    }
  },

  mounted() {
    fetch('./data/joinList.json')
      .then((res) => res.json())
      .then((data) => {
        const userMap = {}
        data[1].map((user) => {
          user.countryColor = user.countryColor.split(',')
          user.disable = false
          user.userImageDone = true
          userMap[user.code] = user
        })
        this.list = data[0]
          .map((item) => {
            return userMap[item.code]
          })
          .filter((e) => !!e)
        console.log('list: ', this.list)

        this.resetVsList()
        this.bindKeyboardEvent()
        this.load()
      })
  },

  methods: {
    onUserImgLoadA(code) {
      const index = this.list.findIndex((item) => item.code === code)
      this.list[index].userImageDone = false
    },
    onUserImgLoad(index) {
      this.list[index].userImageDone = false
    },
    resetVsList() {
      this.vsList = [this.defaultVsObj, this.defaultVsObj]
    },
    getUserImgUrl(user) {
      const useUserKey = user.occupationId > 0 ? 'occupationId' : 'role'
      const mapObj = this[useUserKey + 'MapObj']
      return '/images/user/' + user.code + mapObj[user[useUserKey]] + '.png'
    },
    onKeyboard(evt) {
      console.log('enter key: ', evt.key)
      switch (evt.key) {
        case 'Enter':
          this.goNext()
          break
        case 'd':
          window.confirm('移除當前結果嗎?') && this.delete()
          break
        case 'l':
          if (window.confirm('重選左側玩家嗎?')) {
            this.reRandomAgain('left')
          }
          break
        case 'r':
          if (window.confirm('重選右側玩家嗎?')) {
            this.reRandomAgain('right')
          }
          break
        case 'Control':
          this.download()
          break
        case 'Escape':
          if (window.confirm('是否離開?')) {
            window.localStorage.removeItem('isTool')
            window.location.href = '/'
          }
          break
        default:
      }
    },
    bindKeyboardEvent() {
      if (window.binded) {
        return
      }
      window.binded = true
      document.addEventListener('keydown', this.onKeyboard)
    },
    goNext() {
      if (this.tmpLock) {
        return
      }
      this.tmpLock = true
      const vs = this.vsList
      if (vs.filter((e) => e.code != 'R000').length == 2) {
        // 確認有兩角色
        if (
          vs[0].countryName == vs[1].countryName &&
          this.enableList.length > 0 &&
          this.enableList.filter(
            (item) => item.countryName !== vs[0].countryName
          ).length > 0
        ) {
          const yes = window.confirm('對戰雙方為同國家，是否重新配對?')
          if (yes) {
            return this.reRandomAgain('right').then(() => {
              this.tmpLock = false
            })
          }
        }
        this.results.push(vs.map((e) => e.code))
        this.save()
        this.resetVsList()
        this.tmpLock = false
      } else {
        // 有一邊需要隨機
        const key = this.vsList[0].code == 'R000' ? 'left' : 'right'
        this.randCode(key).then(() => {
          this.tmpLock = false
        })
      }
    },
    randCode(key) {
      return this.enableList.length == 0
        ? new Promise(() => true)
        : this.animationResult()
            .then((code) => {
              console.log('animationResult: ', code)
              const nextItem = this.list.find((e) => e.code == code)
              if (key == 'left') {
                this.vsList = [nextItem, this.vsList[1]]
              } else {
                this.vsList = [this.vsList[0], nextItem]
              }
              nextItem.disable = true
              this.list = this.list.slice()
              return code
            })
            .catch((err) => {
              console.log('err: ', err)
            })
    },
    reRandomAgain(key) {
      const idx = key == 'left' ? 0 : 1
      const oldCode = this.vsList[idx].code
      return this.randCode(key).then(() => {
        const _item = this.list.find((e) => e.code == oldCode)
        _item.disable = false
        this.list = this.list.slice()
      })
    },
    animationResult() {
      return new Promise(this.aniLoop)
    },
    aniLoop(resolve, reject) {
      const _list = this.enableList
      let times = 32
      let randCode = ''
      const loopFn = () => {
        let go = true
        if (times <= 24) {
          go = times % 2 == 0
        } else if (times <= 10) {
          go = times % 5 == 0
        }
        if (go) {
          randCode = _list[Math.floor(Math.random() * _list.length)].code
          this.animationSelectedCode = randCode
        }
        if (times <= 0) {
          window.clearInterval(_timer)
          resolve(randCode)
        }
        times -= 1
      }
      const _timer = window.setInterval(loopFn, 100)
    },
    save() {
      const vsResults = this.results
      localStorage.setItem('__event9__result__', JSON.stringify(vsResults))
    },
    load() {
      const resultstr = localStorage.getItem('__event9__result__')
      if (resultstr) {
        const _ary = JSON.parse(resultstr)
        if (typeof _ary == 'object' && Array.isArray(_ary)) {
          this.results = _ary
          const codes = this.list.map((e) => e.code)
          const nextList = this.list.slice()
          _ary.map((vs) => {
            vs.map((_) => {
              const cidx = codes.indexOf(_)
              if (cidx >= 0) nextList[cidx].disable = true
            })
          })
          this.list = nextList
        }
      }
    },
    delete() {
      this.results = []
      this.list.map((e) => {
        e.disable = false
      })
      this.list = this.list.slice()
      this.resetVsList()
      localStorage.removeItem('__event9__result__')
    },
    download() {
      let csvContent = 'data:text/csv;charset=utf-8,'
      const listMap = {}
      this.list.map((e) => {
        listMap[e.code] = e
      })
      this.results.forEach((ary) => {
        let codeLeft = ary[0]
        let codeRight = ary[1]
        let leftName = listMap[codeLeft].name
        let rightName = listMap[codeRight].name
        let row = `${codeLeft} [${leftName}] ,  VS  ,  ${codeRight} [${rightName}]`
        csvContent += row + '\r\n'
      })
      const universalBOM = '\uFEFF'
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'event9_match.csv')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-page {
  width: 100vw;
  height: 100vh;
  background: url('/images/left_menu_bg - 複製.jpg') center center no-repeat;
  background-size: cover;
  .list,
  .vs {
    height: 50vh;
  }
  .list {
    width: 100%;
    padding: 5px;
  }
  .img-area {
    position: relative;
    border: 2px solid #777777;
    background: #fff;
    border-radius: 3px;
    & > div {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    &.active {
      border-color: #d8b585;
      filter: opacity(0.3);
    }
    &.selected {
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: -5px;
        top: -5px;
        border: 5px solid #f82e27;
        box-shadow: 0 0 8px #f82e27;
        width: calc(100% + 10px);
        height: calc(100% + 10px);
      }
    }
  }
  .vs {
    width: 100%;
    padding: 1px 120px;
    position: relative;
    .title-area-bg,
    .title-area {
      position: absolute;
      left: calc(50% - 50px);
      width: 100px;
      top: 20px;
      z-index: 5;
      padding: 25px 10px;
    }

    .title-area-bg {
      background: #d8b585;
      height: calc(100% - 25px);
    }
    .title-area {
      div {
        font-family: '華康行楷體W5' !important;
        writing-mode: vertical-lr;
        font-size: 36px !important;
      }
    }
    .vs-icon {
      width: 160px;
      height: 160px;
      position: absolute;
      bottom: 0;
      left: calc(50% - 85px);
      z-index: 6;
      background-color: #f82e27;
      mask: url('/images/vs.png') center center no-repeat;
      mask-size: contain;
    }
  }
  .group {
    width: 100%;
    border: 1px solid #d8b585;
    margin-top: 20px;
    height: 95%;
    border-radius: 15px;
  }
  .vs-block {
    position: relative;
    width: 50%;
    height: 100%;
    background: #00000086;
    overflow: hidden;
    font-family: '華康行楷體W5';
    border-radius: 15px;
    .vs-user-area {
      position: relative;
      width: 100%;
      height: 100%;
      &.no-one {
        .img {
          filter: drop-shadow(5px 0 #ccc) !important;
          transform: translateX(0px) !important;
        }
      }
      .user-name {
        position: absolute;
        z-index: 3;
        bottom: 20%;
        color: #fff;
        right: 65%;
        font-size: 70px;
        writing-mode: vertical-lr;
        text-shadow: 5px 5px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000,
          -1px 1px 0 #000, 1px 1px 0 #000;
      }
    }
    .country-name {
      position: absolute;
      bottom: 0;
      z-index: 0;
      font-size: 120px;
      width: 60%;
      right: 0;
      text-align: right;
      padding-right: 8%;
    }
    .country-name-bg {
      position: absolute;
      top: 0;
      z-index: 1;
      height: 100%;
      width: 100%;
      clip-path: polygon(100% 45%, 0% 100%, 100% 100%);
      right: 0;
      text-align: right;
      opacity: 0.6;
    }

    &:first-child {
      border-right: 1px solid #d8b585;
      .country-name {
        left: 0;
        padding-left: 8%;
        padding-right: 0;
        text-align: left;
      }
      .country-name-bg {
        clip-path: polygon(100% 100%, 0 45%, 0 100%);
        left: 0;
      }
      .user-name {
        left: 65%;
      }
    }
    .img {
      position: relative;
      z-index: 2;
    }
  }
  .final {
    .final-title {
      text-align: center;
      color: #d8b585;
      .main-title,
      .sub-title {
        font-family: '華康行楷體W5';
      }
      .main-title {
        font-size: 58px;
      }
      .sub-title {
        font-size: 32px;
      }
    }
    .group {
      margin: 0;
    }
    .vs {
      height: 120px;
      width: 100%;
      padding: 0;
      .vs-icon {
        width: 60px;
        height: 60px;
        top: 20%;
        left: calc(50% - 30px);
      }
      .title-area-bg,
      .title-area {
        left: calc(50% - 8px);
        width: 16px;
        z-index: 5;
        top: 0;
        padding: 10px 10px;
      }
      .title-area-bg {
        display: none;
        height: calc(100% - 6px);
      }
      .title-area {
        div {
          font-size: 18px !important;
        }
      }
      .vs-block {
        .country-name {
          font-size: 30px;
        }
      }
      .vs-user-area {
        .user-name {
          bottom: 10%;
          right: 65%;
          font-size: 22px;
        }
      }
    }
  }
}
</style>