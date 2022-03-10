<template>
  <v-container
    id="userPage"
    class="user-page"
    ref="userPage"
    fluid
    @mousedown="onMouseDown($event)"
    @mousemove="onMouseMove($event)"
    @mouseup="onMouseUp()"
    @mouseleave="onMouseUp()"
    v-cloak
  >
    <div id="mapArea" class="map-area" style="overflow: hidden">
      <img
        class="map"
        src="../assets/images/map.jpg"
        alt=""
        :style="{
          transform: `translate(${viewX}px, ${viewY}px)`,
          transition: 'transform 0.1s linear'
        }"
      />
      <div class="user-area">
        <div class="user-info">
          <div class="img-area d-inline-block">
            <img
              v-if="currUser.code"
              class="user-img"
              :src="require('../assets/images/user/' + currUser.code + '.png')"
              alt=""
            />
            <img
              class="img-border"
              src="../assets/images/人物頭像框.png"
              alt=""
            />
          </div>
          <div class="info-area">
            <div class="info-content">
              <img
                class="flag flag-border"
                src="../assets/images/旗幟_外.png"
                alt=""
              />
              <div
                class="flag flag-content"
                :style="{ background: currUser.countryColors }"
              >
                <div
                  class="flag-vertical name"
                  :style="{ color: currUser.countryColorsT }"
                >
                  {{ currUser.countryName }}
                </div>
                <img src="../assets/images/旗幟_內.png" alt="" />
              </div>
              <div class="info-block">
                <div class="date">{{ today[0] }}{{ today[1] }}</div>
                <div class="user">
                  <div class="block block-1">
                    <span class="name w-33-pct"
                      >{{ user.nickname }}
                      <i class="role_type" v-if="currUser.loyalUserId !== 0"
                        >元老</i
                      ></span
                    ><span class="type w-33-pct">{{ currUser.roleName }}</span>
                    <span class="class-1 w-33-pct"
                      >{{ currUser.mapNowName }}
                      <v-btn
                        x-small
                        elevation="2"
                        color="primary"
                        @click="goToXY(currUser.mapNowIndex)"
                        >前往</v-btn
                      ></span
                    >
                  </div>
                  <div class="block resource">
                    <span class="class-1 w-33-pct"
                      >兵力 {{ user.soldier }}</span
                    >
                    <span class="class-1 w-33-pct">黃金 {{ user.money }}</span>
                  </div>
                  <div class="block block-3">
                    <span class="class-1 w-33-pct"
                      >貢獻 {{ user.contribution }}</span
                    >
                    <span class="class-1 w-33-pct"
                      >行動力 {{ user.actPoint }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-btns">
            <v-checkbox
              v-model="showCountyDetails"
              label="顯示勢力"
              color="orange darken-3"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="showCityDetails"
              label="顯示武力"
              color="orange darken-3"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="showRoninDetails"
              label="顯示浪人"
              color="orange darken-3"
              hide-details
            ></v-checkbox>
          </div>
        </div>
      </div>
      <div
        class="stronghold-list"
        :style="{
          transform: `translate(${viewX}px, ${viewY}px)`,
          transition: 'transform 0.1s linear'
        }"
      >
        <template v-for="(stronghold, stronghold_i) in strongholds">
          <div
            :class="[
              'stronghold',
              {
                castle: stronghold.type == 1,
                jungle: stronghold.type == 2,
                here: stronghold.is_here,
                main: stronghold.is_main,
                show:
                  client.status_type == '' ||
                  (client.status_type == 'move' &&
                    client.could_be_move_to.indexOf(stronghold.id) !== -1) ||
                  user.mapNowId === stronghold.id,
                moveTo:
                  client.status_type == 'move' &&
                  client.could_be_move_to.indexOf(stronghold.id) !== -1,
                power0:
                  0 < stronghold.military_strength &&
                  stronghold.military_strength < 1000,
                power1:
                  1000 <= stronghold.military_strength &&
                  stronghold.military_strength < 5600,
                power2:
                  5600 <= stronghold.military_strength &&
                  stronghold.military_strength < 11200,
                power3: 11200 <= stronghold.military_strength
              }
            ]"
            :style="{ left: stronghold.x + 'px', top: stronghold.y + 'px' }"
            :id="'stronghold_' + stronghold_i"
            :key="stronghold_i"
            :disabled="
              client.status_type == 'move' && stronghold.id == user.mapNowId
            "
            @click="clickThisStronghold(stronghold_i)"
          >
            <div class="stronghold-area">
              <div
                v-if="stronghold.conutry.id && showCountyDetails"
                class="stronghold-context"
              >
                <div class="country">
                  <span
                    class="country-name"
                    :style="{
                      color: stronghold.conutry.color
                    }"
                    >{{ stronghold.conutry.name }}</span
                  >
                  <span class="bottom"></span>
                </div>
              </div>
              <img
                v-if="showCityDetails"
                class="hose soldier"
                src="../assets/images/兵力.png"
                alt=""
              />
              <img
                v-if="showCityDetails"
                class="hose hose1"
                src="../assets/images/武力.gif"
                alt=""
              />
              <img
                v-if="showCityDetails"
                class="hose hose2"
                src="../assets/images/武力.gif"
                alt=""
              />
              <img
                v-if="showCityDetails"
                class="hose hose3"
                src="../assets/images/武力.gif"
                alt=""
              />
              <span class="here-icon"
                ><img src="../assets/images/here.png" alt=""
              /></span>
              <img
                v-if="stronghold.type == 1"
                :src="
                  require('../assets/images/' +
                    (stronghold.is_main ? 'castle_main' : 'castle') +
                    '.png')
                "
                alt=""
              />
              <div
                v-else
                class="jungle-img"
                :style="{ background: stronghold.conutry.color }"
              ></div>
              <div
                class="stronghold-info-area"
                :ref="'stronghold-' + stronghold.id"
                :style="
                  setLeft(
                    stronghold.is_main,
                    stronghold.type,
                    'stronghold-' + stronghold.id
                  )
                "
              >
                <div
                  class="stronghold-name"
                  :style="{
                    background: stronghold.conutry.color
                  }"
                >
                  <span
                    class="name"
                    :style="[
                      stronghold.type == 1
                        ? { color: stronghold.conutry.t_color }
                        : { color: '#FFF' }
                    ]"
                  >
                    {{ stronghold.name }}
                  </span>
                  <div
                    v-if="showRoninDetails && stronghold.ronin_num > 0"
                    class="ronin-icon-area"
                  >
                    <span>{{ stronghold.ronin_num }}x</span
                    ><span
                      ><img src="../assets/images/浪人icon.png" alt=""
                    /></span>
                  </div>
                </div>
              </div>
              <div
                class="stronghold-info"
                :class="{ show: showCityDetails }"
                :ref="'stronghold-details-' + stronghold.id"
                :style="
                  setLeft(
                    stronghold.is_main,
                    stronghold.type,
                    'stronghold-details-' + stronghold.id
                  )
                "
              >
                <div
                  v-if="
                    stronghold.generals_num !== 0 &&
                    stronghold.military_strength !== 0
                  "
                >
                  武 {{ stronghold.generals_num }}、兵
                  {{ stronghold.military_strength }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <v-dialog v-model="client.dialog_check" persistent max-width="500">
      <v-card dark class="dialog-card">
        <v-card-title>
          確定要執行 {{ client.dialog_check_content.content }} ?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="cencel()"> 放棄 </v-btn>
          <v-btn color="green darken-1" text @click="goDoApi()"> 執行 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="client.dialog" persistent width="500">
      <v-card dark class="dialog-card">
        <!-- <v-img
          v-if="client.dialog_content.img"
          :src="require('../assets/images/dialog/' + client.dialog_content.img)"
          height="200px"
          top
        /> -->
        <v-card-title>
          {{ client.dialog_content.title }}
        </v-card-title>
        <v-card-text>{{ client.dialog_content.text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="ChangeState(['dialog', false])">
            知悉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
// import router from '@/router'
// import client from '@/store/client'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default Vue.extend({
  name: 'UserPage',
  data: () => ({
    inCurrStrongholdIndex: '',
    _mouse_dataset: {},
    viewX: 0,
    viewY: 0,
    goToCityId: 0,
    showCityDetails: localStorage.getItem('show_city_details') === 'true',
    showCountyDetails: localStorage.getItem('show_country_details') === 'true',
    showRoninDetails: localStorage.getItem('show_ronin_details') === 'true'
  }),

  computed: {
    ...mapState(['user', 'global', 'client', 'info']),
    ...mapGetters(['getUser']),
    strongholds: function () {
      const state = this.$store.state
      const hashMapIdUser = {}
      state.global.users.map((user: any) => {
        if (hashMapIdUser[user.mapNowId]) {
          hashMapIdUser[user.mapNowId].push(user)
        } else {
          hashMapIdUser[user.mapNowId] = [user]
        }
      })
      const result = state.global.maps
        ? state.global.maps.map((m: any) => {
            const cid = m.ownCountryId
            const country = state.global.countries.find(
              (e: any) => e.id === cid
            )
            const cname = country ? country.name : '空'
            const colors = country
              ? country.color.split(',')
              : ['#A1A1A1', '#000']
            const usersInThisMap = hashMapIdUser[m.id] || []
            // console.log('usersInThisMap: ', usersInThisMap)
            return {
              ...m,
              type: m.cityId > 0 ? 1 : 2,
              generals_num: usersInThisMap.length || 0,
              ronin_num: usersInThisMap.filter((e: any) => e.countryId === 0)
                .length,
              military_strength: usersInThisMap.reduce(
                (last: number, user: any) => {
                  return last + user.soldier
                },
                0
              ),
              is_main: country ? country.originCityId === m.cityId : false,
              is_here: m.id === state.user.mapNowId,
              conutry: {
                id: cid,
                name: cname,
                color: colors[0],
                t_color: colors[1]
              }
            }
          })
        : []
      return result
    },
    currUser: function () {
      return this.getUser()
    },
    today: function () {
      const curr = this.$moment()
      const days = ['日', '一', '二', '三', '四', '五', '六']
      return [curr.format('YYYY年 MM月 DD日 星期'), days[curr.day()]]
    }
  },

  watch: {
    currUser: {
      handler: function (val) {
        if (
          val &&
          val.mapNowIndex !== -1 &&
          this.inCurrStrongholdIndex !== val.mapNowIndex
        ) {
          this.goToXY(val.mapNowIndex)
        }
      },
      deep: true,
      immediate: true
    },
    showCityDetails: function (val) {
      localStorage.setItem('show_city_details', val)
    },
    showCountyDetails: function (val) {
      localStorage.setItem('show_country_details', val)
    },
    showRoninDetails: function (val) {
      localStorage.setItem('show_ronin_details', val)
    },
    'client.dialog_check_curr': {
      handler: function (val) {
        if (val.key === '移動') {
          this.goToXY(this.currUser.mapNowIndex)
        }
      },
      deep: true,
      immediate: true
    }
  },

  mounted: function () {
    this._mouse_dataset = {}
    // localStorage.setItem('show_country_details', 'true')
  },

  methods: {
    ...mapMutations(['ChangeState', 'ChangeApiCheck', 'ChangeDialogCheck']),
    ...mapActions([
      'ApiAddTroops',
      'ApiJoinCountry',
      'actMove',
      'actIncreaseSoldier',
      'actSearchWild',
      'actLeaveCountry',
      'actEnterCountry',
      'ApiRes'
    ]),
    setLeft: function (is_main, is_city, key) {
      let str = ''
      let left = 0
      if (this.$refs[key]) {
        if (key.indexOf('-details-') === -1) {
          if (is_city === 2) {
            left = -(this.$refs[key][0].clientWidth / 2 - 15)
          } else {
            left = -(this.$refs[key][0].clientWidth / 4 < 20
              ? 20
              : this.$refs[key][0].clientWidth / 4 - 20)
          }
        } else {
          if (is_city === 2) {
            left = -(this.$refs[key][0].clientWidth / 2 - 15)
          } else {
            if (is_main) {
              console.log(this.$refs[key][0].clientWidth / 4)
              left = -(this.$refs[key][0].clientWidth / 4 < 20
                ? 20
                : this.$refs[key][0].clientWidth / 4 - 20)
            } else {
              left = -(this.$refs[key][0].clientWidth / 4 < 10
                ? 10
                : this.$refs[key][0].clientWidth / 4 - 10)
            }
          }
        }
        str += 'left: ' + left + 'px;'
      }
      return str
    },
    cencel: function () {
      this.ChangeState(['status_type', ''])
      this.ChangeState(['could_be_move_to', []])
      this.ChangeState(['dialog_check', false])
    },
    goDoApi: function () {
      console.log(this.client.dialog_check_curr)
      let content: ''
      switch (this.client.dialog_check_curr.key) {
        case '增兵':
          this.actIncreaseSoldier()
          content = ''
          // this.ApiRes({ content: content })
          break
        case '入仕':
          this.actEnterCountry()
          content = ''
          // this.ApiRes({ content: content })
          break
        case '下野':
          this.actLeaveCountry()
          content = ''
          // this.ApiRes({ content: content })
          break
        case '探索':
          this.actSearchWild()
          content = ''
          // this.ApiRes({ content: content })
          break
        case '離開':
          this.onClickLogout()
          break
        case '移動':
          this.actMove(this.goToCityId)
          this.goToCityId = 0
          this.ChangeState(['status_type', ''])
          this.ChangeState(['could_be_move_to', []])
          content = ''
          break
      }
      this.ChangeState(['dialog_check', false])
    },
    onClickLogout: function () {
      localStorage.removeItem('_token_')
      window.location.reload()
    },
    goToXY: function (index = 0) {
      const maps = this.global.maps
      this.$nextTick(() => {
        const mapData = maps[index]
        const x = -mapData.x + Math.round(window.innerWidth / 2)
        const y = -mapData.y + Math.round(window.innerHeight / 2)
        const xy = this.getParsedXY([x, y])
        this.viewX = xy[0]
        this.viewY = xy[1]
      })
    },
    clickThisStronghold: function (index = 0) {
      const city = this.strongholds[index]
      if (
        this.client.status_type === 'move' &&
        city.id !== this.user.mapNowId
      ) {
        this.goToCityId = this.strongholds[index].id
        this.ChangeDialogCheck({ content: '移動到 ' + city.name })
      } else if (this.client.status_type === '') {
        this.goToXY(index)
      }
    },
    checkLoginStaus: function () {
      if (this.user.connected) {
        this.ChangeState(['tempName', 'Home'])
      }
    },
    onMouseDown: function (evt: any) {
      evt.preventDefault()
      const x = evt.clientX
      const y = evt.clientY
      this._mouse_dataset = {
        start: { x, y },
        go: true,
        origin: { x: this.viewX, y: this.viewY },
        timestamp: new Date().getTime()
      }
    },
    onMouseUp: function () {
      this._mouse_dataset.go = false
    },
    onMouseMove: function (evt: any) {
      evt.preventDefault()
      const md = this._mouse_dataset || {}
      if (md.go) {
        const nextTimestamp = new Date().getTime()
        if (nextTimestamp - 100 > md.timestamp) {
          const x = evt.clientX
          const y = evt.clientY
          const moveX = x - md.start.x + md.origin.x
          const moveY = y - md.start.y + md.origin.y
          const xy = this.getParsedXY([moveX, moveY])
          this.viewX = xy[0]
          this.viewY = xy[1]
          md.timestamp = nextTimestamp
        }
      }
    },
    getParsedXY: function (xy: any): any {
      const nextx = Math.max(-(3014 - window.innerWidth), xy[0])
      const nexty = Math.max(-(2089 - window.innerHeight), xy[1])
      return [Math.min(0, nextx), Math.min(0, nexty)]
    }
  }
})
</script>

<style lang="scss" scope>
html {
  overflow: hidden !important;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  margin: 80px 0 5px 0;
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 4px;
  border-radius: 4px;
  background: rgb(219, 219, 219);
}
.flag-vertical {
  writing-mode: vertical-lr;
}
.ronin-icon-area {
  position: absolute;
  left: 100%;
  top: 0;
  padding: 0 6px;
  min-width: 50px;
  text-align: left;
  height: 100%;
  background: #0a293c;
  color: #fff;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  span {
    &:nth-child(2) {
      padding: 4px 2px 0px;
    }
  }
  img {
    width: 16px !important;
    height: 16px !important;
  }
}
.container {
  &.user-page {
    width: 100vw;
    height: 100vh;
    overflow: auto;
    position: fixed;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    .map-area {
      position: relative;
      width: 100%;
      height: 100%;
      .stronghold-list {
        .stronghold {
          position: absolute;
          z-index: 10;
          visibility: hidden;
          cursor: pointer;
          .stronghold-area {
            position: relative;
            .stronghold-context {
              display: none;
              position: absolute;
              top: -50px;
              left: 15px;
              font-family: '華康行楷體W5';
              & > span {
                display: inline-block;
              }
              .country {
                padding: 4px;
                background: #cabca6;
                position: relative;
                z-index: -1;
                background: url('../assets/images/大旗.png') no-repeat;
                background-size: contain;
                height: 130px;
                width: 80px;
                .country-name {
                  display: inline-block;
                  text-shadow: 0px 0px 1px #1f1e1c;
                  padding: 2px;
                  color: #111;
                  font-size: 18px;
                  line-height: 20px;
                  padding: 20px 3px;
                  writing-mode: vertical-lr;
                  letter-spacing: 1px;
                }
                .bottom {
                  display: none;
                  position: absolute;
                  top: 47px;
                  left: 0px;
                  width: 0;
                  height: 0;
                  border-width: 5px 15px 0;
                  border-style: solid;
                  border-color: #cabca6 transparent transparent;
                  content: '';
                }
              }
            }
            .stronghold-info {
              visibility: hidden;
              position: absolute;
              font-size: 14px;
              white-space: nowrap;
              margin-top: 23px;
              font-family: '華康行楷體W5';
              background: -webkit-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1) 0%,
                rgba(0, 0, 0, 0.5) 22%,
                rgb(0, 0, 0) 44%,
                rgba(0, 0, 0, 0.5) 72%,
                rgba(0, 0, 0, 0.1) 98%
              );
              filter: drop-shadow(0px 0px 2px #201707);
              & > span {
                display: inline-block;
              }
              padding: 5px 15px 2px;
              color: #fff;
              &.show {
                visibility: inherit;
              }
            }
            $golden: #313131;
            .here-icon {
              position: absolute;
              bottom: calc(100% - 14px);
              left: 8px;
              transform: rotate(15deg);
              display: none;
              img {
                width: 32px !important;
              }
            }
            .stronghold-info-area {
              position: absolute;
              margin-top: 2px;
              text-align: center;
              display: flex;
              font-family: '華康行楷體W5';
              flex-direction: row;
              justify-content: space-around;
              align-content: center;
              align-items: center;
              .stronghold-name {
                display: flex;
                .name {
                  white-space: nowrap;
                  position: relative;
                  color: #fff;
                  border-radius: 0;
                }
              }
            }
          }
          &.show {
            visibility: inherit;
          }
          &.castle {
            z-index: 11;
            img {
              width: 80px;
            }
            .stronghold-area {
              .here-icon {
                left: 55px;
                bottom: 20px;
              }
              .stronghold-info-area {
                top: 36px;
                padding: 0;
              }
              .stronghold-name {
                padding: 3px;
                opacity: 0.9;
                .name {
                  letter-spacing: 2px;
                  box-sizing: border-box;
                  text-align: center;
                  padding: 4px;
                  width: 79px;
                  height: 29px;
                  background-image: url('../assets/images/邊框.png');
                  background-size: contain;
                  background-repeat: no-repeat;
                  line-height: 22px;
                  box-shadow: 0px 0px 4px #1f1f1f;
                }
              }
            }
            .hose {
              &.soldier {
                left: 5px;
                bottom: 25px;
              }
            }
            &.main {
              .here-icon {
                left: 63px;
                bottom: 50px;
              }
              .stronghold-context {
                display: flex;
              }
              .stronghold-area {
                top: -20px;
                left: -10px;
                .stronghold-info-area {
                  top: 66px;
                  left: 10px !important;
                }
                .stronghold-info {
                  margin-top: 10px;
                }
              }
              .hose {
                left: 5px;
                bottom: 35px;
                &.soldier {
                  left: 15px;
                  bottom: 45px;
                }
                &.hose2 {
                  left: -15px;
                  bottom: 35px;
                  z-index: 0;
                }
                &.hose3 {
                  left: 20px;
                  bottom: 20px;
                  z-index: 2;
                }
              }
              img {
                width: 90px;
              }
            }
          }
          &.jungle {
            .stronghold-area {
              .stronghold-info-area {
                padding: 0;
              }
              .stronghold-name {
                opacity: 0.8;
                background: -webkit-linear-gradient(
                  0deg,
                  rgba(0, 0, 0, 0.1) 0%,
                  rgba(0, 0, 0, 0.5) 22%,
                  rgb(0, 0, 0) 44%,
                  rgba(0, 0, 0, 0.5) 72%,
                  rgba(0, 0, 0, 0.1) 98%
                ) !important;
                .name {
                  padding: 0px 16px;
                  font-size: 16px !important;
                }
              }
            }
            .hose {
              left: -30px;
              bottom: -5px;
              &.hose2 {
                left: -25px;
                bottom: 10px;
                z-index: 0;
              }
              &.hose3 {
                left: -5px;
                bottom: 0px;
                z-index: 2;
              }
            }
          }
          &.here {
            z-index: 13;
            .here-icon {
              display: block !important;
            }
          }
          .hose {
            display: none;
            position: absolute;
            bottom: 20px;
            left: -10px;
            width: 70px !important;
            z-index: 1;
            filter: drop-shadow(0px 0px 4px #830b0b);
            // box-shadow: 1px 1px 5px #CCC;
            &.soldier {
              width: 50px !important;
              left: -21px;
              bottom: 3px;
            }
            &.hose2 {
              left: -15px;
              bottom: 35px;
              z-index: 0;
            }
            &.hose3 {
              left: 20px;
              bottom: 20px;
              z-index: 2;
            }
          }
          &.power0 {
            .soldier {
              display: block;
            }
          }
          &.power1 {
            .hose1 {
              display: block;
            }
          }
          &.power2 {
            .hose1,
            .hose2 {
              display: block;
            }
          }
          &.power3 {
            .hose {
              display: block;
            }
          }
          &.moveTo {
            filter: drop-shadow(0px 0px 4px #cabca6);
            z-index: 15;
            &:hover {
              filter: drop-shadow(0px 0px 4px #cabca6);
              z-index: 17;
            }
          }
          &:hover {
            filter: drop-shadow(0px 0px 4px #cabca6);
            z-index: 17;
            .stronghold-info {
              visibility: inherit;
            }
          }
        }

        .jungle-img {
          border: 1px solid #1f1e1c;
          border-radius: 3px;
          width: 25.13px;
          height: 15.53px;
        }
      }
      .map {
        position: absolute;
        left: 0;
        top: 0;
      }
      .content {
        position: relative;
        z-index: 10;
      }
    }
    .user-area {
      position: fixed;
      left: 0;
      top: 0;
      width: 660px;
      padding: 15px;
      z-index: 999;
      .img-area {
        height: 150px;
        width: 150px;
        position: relative;
        border-radius: 999px;
        background: #0a293c;
        overflow: hidden;
        float: left;
        z-index: 1;
        .user-img {
          width: 120%;
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -30%);
        }
        .img-border {
          position: absolute;
          width: 108%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .user-info {
        position: relative;
        width: 100%;
        &:after {
          clear: left;
          content: '.';
          display: block;
          height: 0;
          overflow: hidden;
        }
        .info-area {
          position: absolute;
          z-index: 0;
          top: 15px;
          left: 110px;
          width: 100%;
          // background: rgb(25 25 25 / 70%);
          border-radius: 6px;
          background: -webkit-linear-gradient(
            -90deg,
            rgba(25, 25, 25, 0.9) 10%,
            rgba(25, 25, 25, 0.8) 40%,
            rgba(25, 25, 25, 0.7) 100%
          );
          height: 100px;
          .info-content {
            position: relative;
            margin: 6px 2px 6px 15px;
            padding: 0px 10px 0px 80px;
            box-sizing: border-box;
            color: #fff;
            height: calc(100% - 20px);
            // border: 1px solid #a39800;
            border-radius: 6px;
            .flag {
              position: absolute;
              width: 40px;
              left: 30px;
              top: 0;
              overflow: hidden;
              &.flag-content {
                width: 34px;
                left: 33px;
                top: 2px;
                mask: url('../assets/images/旗幟_內.png') no-repeat;
                mask-size: 100% auto;
                box-shadow: rgb(98 98 98 / 40%) 3px 3px 15px 0px;
                .name {
                  font-family: '華康行楷體W5' !important;
                  padding-top: 3px;
                  font-size: 20px;
                  line-height: 33px;
                  letter-spacing: 3px;
                }
                img {
                  opacity: 0%;
                }
              }
            }
            .info-block {
              & > div {
                text-shadow: 0px 0px 2px #111;
                font-weight: bolder;
                font-family: 'DFKai-sb';
              }
              .date {
                position: absolute;
                top: -30px;
                font-weight: normal;
                letter-spacing: 2px;
              }
              .user {
                font-size: 18px;
                & > div {
                  border-bottom: 1px solid #707070;
                  letter-spacing: 1px;
                  padding: 2px 5px 1px;
                }
                .block {
                  .role_type {
                    font-size: 15px;
                    padding: 3px 8px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                  }
                  span {
                    display: inline-block;
                    width: 50%;
                  }
                  &.resource {
                    span {
                      width: 33%;
                    }
                  }
                }
                .name {
                  width: 60%;
                }
                .type {
                  width: 40%;
                }
                .is_veteran {
                  padding: 2px;
                  border: 1px solid #ccc;
                }
                .block-3 {
                  border: none;
                  .place {
                    width: 50%;
                  }
                }
              }
            }
          }
        }
        .info-btns {
          position: absolute;
          bottom: -5px;
          left: 150px;
          width: 660px;
          display: flex;
          .v-input {
            margin: 0;
            margin-right: 5px;
            padding: 5px 10px;
            background: -webkit-linear-gradient(
              -90deg,
              rgba(25, 25, 25, 0.9) 10%,
              rgba(25, 25, 25, 0.8) 40%,
              rgba(25, 25, 25, 0.7) 100%
            );
            border-radius: 10px;
          }
          .v-icon,
          .v-label {
            color: #fff;
            font-family: '華康行楷體W5' !important;
            text-shadow: 1px 1px 2px #111;
          }
        }
      }
      img {
        width: 100%;
      }
    }
  }
}
.dialog-card {
  background: -webkit-linear-gradient(
    -90deg,
    rgba(25, 25, 25, 0.9) 10%,
    rgba(25, 25, 25, 0.8) 40%,
    rgba(25, 25, 25, 0.7) 100%
  );
  font-family: '華康行楷體W5';
  font-size: 26px;
  .v-card__text {
    font-size: 26px;
  }
  .v-btn {
    font-size: 23px;
  }
}
</style>
