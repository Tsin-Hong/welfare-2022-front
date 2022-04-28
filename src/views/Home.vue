<template>
  <v-container class="home" fluid>
    <v-card class="left-menu" height="100vh">
      <UserPage />
      <v-list class="menu-area" absolute>
        <v-list-item-group>
          <template v-for="(item, index) in items">
            <div
              :key="index"
              class="btn-group"
              @mouseover="currMainMenu = item.title"
              @mouseleave="currMainMenu = ''"
              @click="
                chickBtn(
                  item.is_click,
                  item.title,
                  index + '-' + index,
                  item.id
                )
              "
            >
              <v-list-item class="main-btn" :disabled="!menuShow(item, false)">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-' + item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list
                class="sub-menu-area"
                v-if="item.items && currMainMenu == item.title"
              >
                <template v-for="(child, child_i) in item.items">
                  <v-list-item
                    :key="index + '-' + child_i"
                    :disabled="!menuShow(item, child)"
                    class="sub-btn"
                    @click="
                      chickBtn(
                        true,
                        child.title,
                        index + '-' + child_i,
                        child.id
                      )
                    "
                  >
                    <v-list-item-icon>
                      <v-icon v-text="'mdi-' + child.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="child.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </div>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import UserPage from '../components/UserPage.vue'
import enums from '@/unit/enum'

export default Vue.extend({
  name: 'Home',
  components: {
    UserPage
  },
  data: () => ({
    currMainMenu: '',
    items: [
      {
        id: 1,
        title: '內政',
        icon: 'castle',
        is_show: true,
        is_click: false,
        couldBeUseRoleIds: [1, 2],
        couldBeUseByCity: true,
        couldBeUseByOther: false,
        items: [
          {
            id: 1005,
            icon: '',
            title: '建築',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 1001,
            icon: '',
            title: '商業',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 1002,
            icon: '',
            title: '徵兵',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 1003,
            icon: '',
            title: '政策',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 1004,
            icon: '',
            title: '遷都',
            is_show: true,
            couldBeUseRoleIds: [1],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          }
        ]
      },
      {
        id: 2,
        title: '論功',
        icon: 'hops',
        is_show: true,
        is_click: false,
        couldBeUseByCity: true,
        couldBeUseByOther: false,
        couldBeUseRoleIds: [1, 2],
        items: [
          {
            id: 2001,
            icon: '',
            title: '任命',
            is_show: true,
            couldBeUseRoleIds: [1],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 2002,
            icon: '',
            title: '解任',
            is_show: true,
            couldBeUseRoleIds: [1],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 2003,
            icon: '',
            title: '招募',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 2004,
            icon: '',
            title: '配給',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          }
          // {
          //   id: 2005,
          //   icon: '',
          //   title: '進貢',
          //   is_show: false,
          //   couldBeUseRoleIds: [],
          //   couldBeUseByCity: true,
          //   couldBeUseByOther: false
          // }
        ]
      },
      {
        id: 3,
        title: '攻略',
        icon: 'baseball-diamond',
        is_show: true,
        is_click: false,
        couldBeUseByCity: true,
        couldBeUseByOther: true,
        couldBeUseRoleIds: [1, 2, 3],
        items: [
          {
            id: 3001,
            icon: '',
            title: '入仕',
            is_show: true,
            couldBeUseRoleIds: [3],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3002,
            icon: '',
            title: '下野',
            is_show: true,
            couldBeUseRoleIds: [2],
            couldBeUseByCity: true,
            couldBeUseByOther: true
          },
          {
            id: 3003,
            icon: '',
            title: '起義',
            is_show: false,
            couldBeUseRoleIds: [3],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3004,
            icon: '',
            title: '逃脫',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: true
          },
          {
            id: 3005,
            icon: '',
            title: '交易',
            is_show: false,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3006,
            icon: '',
            title: '俘虜',
            is_show: true,
            couldBeUseRoleIds: [1],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3007,
            icon: '',
            title: '叛亂',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          }
        ]
      },
      // {
      //   id: 4,
      //   title: '外交',
      //   icon: 'hexagon-multiple',
      //   is_show: false,
      //   is_click: false,
      //   couldBeUseByCity: true,
      //   couldBeUseByOther: false,
      //   couldBeUseRoleIds: [1, 2, 3],
      //   items: [
      //     {
      //       id: 4001,
      //       icon: '',
      //       title: '親善',
      //       is_show: false,
      //       couldBeUseRoleIds: [],
      //       couldBeUseByCity: true,
      //       couldBeUseByOther: false
      //     },
      //     {
      //       id: 4002,
      //       icon: '',
      //       title: '同盟',
      //       is_show: false,
      //       couldBeUseRoleIds: [],
      //       couldBeUseByCity: true,
      //       couldBeUseByOther: false
      //     },
      //     {
      //       id: 4003,
      //       icon: '',
      //       title: '合攻',
      //       is_show: false,
      //       couldBeUseRoleIds: [],
      //       couldBeUseByCity: true,
      //       couldBeUseByOther: false
      //     }
      //   ]
      // },
      {
        id: 5,
        title: '軍議',
        icon: 'axe-battle',
        is_show: true,
        is_click: false,
        couldBeUseByCity: true,
        couldBeUseByOther: true,
        couldBeUseRoleIds: [1, 2, 3],
        items: [
          {
            id: 5001,
            icon: '',
            title: '移動',
            is_show: true,
            couldBeUseRoleIds: [1, 2, 3],
            couldBeUseByCity: true,
            couldBeUseByOther: true
          },
          {
            id: 5002,
            icon: '',
            title: '出征',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: true
          },
          {
            id: 5003,
            icon: '',
            title: '探索',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: false,
            couldBeUseByOther: true
          }
        ]
      },
      {
        id: 6,
        title: '離開',
        icon: 'arrow-left-top-bold',
        is_show: true,
        is_click: true,
        couldBeUseRoleIds: [1, 2, 3],
        couldBeUseByCity: true,
        couldBeUseByOther: true
      }
    ]
  }),

  computed: {
    ...mapState(['user', 'global', 'client']),
    ...mapGetters(['getUser']),
    currUser: function () {
      return this.getUser()
    }
  },

  mounted: function () {
    // if (!this.user.connected) {
    //   const token = window.localStorage.getItem('_token_')
    //   if (token) {
    //     this.$socket.emit('AUTHORIZE', { token })
    //   }
    // }
  },

  methods: {
    ...mapMutations(['ChangeState', 'ChangeApiCheck', 'ChangeDialogCheck']),
    ...mapActions(['ApiMove', 'ApiBattle', 'actAppointOccupation', 'actDismissOccupation', 'actShare', 'actEscape', 'actSetOriginCity', 'actRecruit', 'actRecruitCaptive', 'actReleaseCaptive']),
    menuShow: function (item, child) {
      let show = false
      const mapTargetIdUnableTitle = ['移動', '出征']
      if (
        item.is_show &&
        !['move', 'battal'].includes(this.client.status_type)
      ) {
        if (child) {
          if (this.currUser.captiveDate && item.title != '攻略') {
            return show
          }
          if (
            child.is_show &&
            this.currUser.actPoint > 0 &&
            child.couldBeUseRoleIds.indexOf(this.currUser.role) !== -1
          ) {
            if (
              child.title !== '下野' ||
              (child.title === '下野' && this.currUser.loyalUserId === 0)
            ) {
              if (
                ((this.currUser.mapNowIsCity && child.couldBeUseByCity) ||
                  (!this.currUser.mapNowIsCity && child.couldBeUseByOther)) &&
                (!mapTargetIdUnableTitle.includes(child.title) ||
                  (mapTargetIdUnableTitle.includes(child.title) &&
                    this.currUser.mapTargetId == 0))
              ) {
                switch (child.title) {
                  case '配給': {
                    const occupation = this.global.occupationMap[this.currUser.occupationId]
                    show = this.currUser.role == 1 || (occupation && occupation.isAllowedShare)
                  } break
                  case '遷都': {
                    const mycountry = this.global.countries.find(c => c.id == this.user.countryId)
                    show = this.currUser.role == 1 && mycountry && mycountry.originCityId == 0
                  } break
                  case '招募': {
                    const occupation = this.global.occupationMap[this.currUser.occupationId]
                    show = this.currUser.role == 1 || (occupation && occupation.isAllowedRecurit)
                  } break
                  case '逃脫': {
                    show = !!this.currUser.captiveDate
                  } break
                  default:
                    show = true
                }
              }
            }
          }
        } else {
          if (
            item.title === '離開' ||
            (item.title !== '離開' &&
              this.currUser.actPoint > 0 &&
              item.couldBeUseRoleIds.indexOf(this.currUser.role) !== -1)
          ) {
            if (
              (this.currUser.mapNowIsCity && item.couldBeUseByCity) ||
              (!this.currUser.mapNowIsCity && item.couldBeUseByOther)
            ) {
              show = true
            }
          }
        }
      }

      return show
    },
    chickBtn: function (go: any, key = '', index = '', id = 0) {
      if (go) {
        this.ChangeApiCheck({ key: key, index: index, id: id })
        switch (id) {
          case 5001:
            this.ApiMove()
            break
          case 5002:
            this.ChangeState(['status_type', 'battal'])
            break
          case 1005:
            this.ChangeState(['dialog_level_up_city', true])
            break
          case 2001: // 任命
            this.handlePromptAppointment()
            break
          case 2002: // 解任
            this.handlePromptDismiss()
            break
          case 2004: // 配給
            this.handlePromptShare()
            break
          case 1004: // 遷都
            this.handlePromptMigrateOriginCity()
            break
          case 2003: // 招募
            this.handlePromptRecurit()
            break
          case 3006: // 俘虜
            this.handlePromptCaptives()
            break
          default:
            this.ChangeDialogCheck({ content: key })
        }
      }
    },
    handlePromptAppointment: function () {
      const occupationMap = this.global.occupationMap
      const users = this.global.users.filter(user => user.countryId == this.user.countryId && user.role == 2)
      let occListString = '請輸入你想任命的官吏ID: \r\n'
      Object.values(occupationMap).map((occ: any) => {
        const assignedUser = users.find(user => user.occupationId == occ.id)
        let _str = `[ ${occ.id} ] ${occ.name} => ${assignedUser ? assignedUser.nickname : '空'}\r\n`
        occListString += _str
      })
      const occId = window.prompt(occListString)
      const selected = occupationMap[occId]
      if (selected) {
        const matchedUsers = users.filter(user => user.contribution >= selected.contributionCondi && user.occupationId == 0)
        if (matchedUsers.length > 0) {
          let showOccStr = `官吏 [ ${selected.name} ] 所需貢獻直: ${selected.contributionCondi} \r\n`
          showOccStr += '請輸入欲任命的武將編號 (以下為符合條件的武將): \r\n'
          matchedUsers.sort((a,b) => b.contribution - a.contribution)
          matchedUsers.map((user, idx) => {
            showOccStr += `${idx}. ${user.nickname}`.padEnd(10, '　')
            if (idx % 3 == 2) { showOccStr+= '\r\n' }
          })
          const selectedUserIdx = window.prompt(showOccStr)
          if (matchedUsers[selectedUserIdx]) {
            this.actAppointOccupation({userId: matchedUsers[selectedUserIdx].id, occupationId: parseInt(occId)})
          }
        } else {
          window.alert('沒有武將符合條件')
        }
      } else {
        occId && window.alert('錯誤的ID')
      }
    },
    handlePromptDismiss: function() {
      const occupationMap = this.global.occupationMap
      const users = this.global.users.filter(user => user.countryId == this.user.countryId && user.occupationId > 0)
      let occListString = '請輸入你想解任的官吏: \r\n'
      users.map((user:any, idx) => {
        const occ = occupationMap[user.occupationId]
        if (occ) {
          occListString += `${idx}. [ ${occ.name} ] => ${user.nickname}\r\n`
        }
      })
      const useridx = window.prompt(occListString)
      if (users[useridx]) {
        this.actDismissOccupation({userId: users[useridx].id})
      }
    },
    handlePromptShare: function() {
      const users = this.global.users.filter(user => user.countryId == this.user.countryId && this.user.id != user.id)
      let _str = '請選擇想配給的武將: \r\n'
      users.map((user, idx) => {
        _str += `${idx}. ${user.nickname}`.padEnd(8, '　')
        if (idx % 4 == 3) { _str+= '\r\n' }
      })
      const userIdx = window.prompt(_str)
      const selectedUser = users[userIdx]
      if (selectedUser) {
        const money = parseInt(window.prompt(`請輸入要贈與 [ ${selectedUser.nickname} ] 的黃金`)) || 0
        const soldier = parseInt(window.prompt(`請輸入要託付給 [ ${selectedUser.nickname} ] 的士兵`)) || 0
        if (isNaN(money) || isNaN(soldier) || (money == 0 && soldier == 0)) {
          window.alert('取消配給')
        } else {
          this.actShare({userId: selectedUser.id, money, soldier})
        }
      }
    },
    handlePromptMigrateOriginCity: function() {
      const cities = this.global.maps.filter(m => m.ownCountryId == this.user.countryId && m.cityId > 0)
      const gameTypes = Object.keys(enums.CHINESE_GAMETYPE_NAMES).map(key => [parseInt(key), enums.CHINESE_GAMETYPE_NAMES[key]])
      if (cities.length > 0) {
        const cityId = parseInt(window.prompt(cities.map(f => `${f.cityId} -> ${f.name}`).join('\r\n')))
        const gameTypeId = parseInt(window.prompt(gameTypes.map(f => `${f[0]} -> ${f[1]}`).join('\r\n')))
        this.actSetOriginCity({cityId, gameTypeId})
      } else {
        window.alert('沒有城池.')
      }
    },
    handlePromptRecurit: function() {
      const users = this.global.users.filter(user => user.role == 3);
      if (users.length > 0) {
        const _str = '請選擇要招募的浪人: \r\n';
        const userIdx = parseInt(window.prompt(_str + users.map((u, idx) => `${idx} -> ${u.nickname}`).join('\r\n')))
        if (users[userIdx]) {
          const userId = users[userIdx].id || 0;
          this.actRecruit({userId})
        } else {
          window.alert('取消.')
        }
      } else {
        window.alert('沒有浪人.')
      }
    },
    handlePromptCaptives: function() {
      const ownMapIds = this.global.maps.filter(map => map.ownCountryId == this.user.countryId).map(map => map.id)
      const users = this.global.users.filter(user => user.captiveDate && ownMapIds.includes(user.mapNowId))
      if (users.length > 0) {
        const _str = '請選擇要處置的俘虜: \r\n';
        const userIdx = parseInt(window.prompt(_str + users.map((u, idx) => `${idx} -> ${u.nickname}`).join('\r\n')))
        const user = users[userIdx]
        if (user) {
          const doing = parseInt(window.prompt(`請選擇要針對俘虜 ( ${user.nickname} ) 的處置 \r\n1.招募該俘虜. \r\n2.釋放該俘虜. `))
          if (doing==1) {
            return this.actRecruitCaptive({userId: user.id})
          } else if (doing ==2) {
            return this.actReleaseCaptive({userId: user.id})
          }
        }
        window.alert('取消.')
      } else {
        window.alert('沒有俘虜.')
      }
    }
  }

  // sockets: {
  //   connect: function () {
  //     const token = window.localStorage.getItem('_token_')
  //     if (token) {
  //       this.$socket.emit('AUTHORIZE', { token })
  //     }
  //   }
  // }
})
</script>

<style lang="scss" scope>
.home {
  padding: 0;
  margin: 0;
  .left-menu {
    z-index: 999;
    background: transparent !important;
    top: 200px;
    .menu-area {
      margin-left: 10px;
      width: 120px;
      position: relative;
      background: transparent;
      .v-list-item--link {
        cursor: pointer;
        // cursor: url('/images/mouse.png'), pointer;
      }
      .btn-group {
        position: relative;
        font-family: '華康行楷體W5';
        .main-btn {
          position: relative;
          z-index: 99;
          margin-bottom: 10px;
          background: -webkit-linear-gradient(
            257deg,
            hsl(50deg 49% 88%) 10%,
            rgb(255 252 240) 40%,
            rgb(234 229 214) 100%
          );
          backdrop-filter: blur(2px);
          border-radius: 3px;
          color: #2b323f;
          padding: 0 8px;
          text-align: center;
          .v-list-item__icon {
            margin: 12px 6px 8px;
            i {
              color: #2b323f;
              font-size: 32px;
            }
          }
          .v-list-item__title {
            font-size: 28px !important;
            line-height: 30px !important;
          }
        }

        .main-btn,
        .sub-btn {
          &.v-list-item--disabled {
            color: rgba(0, 0, 0, 0.7) !important;
            background: #a1a1a1 !important;
            backdrop-filter: blur(2px);
            .v-icon {
              color: rgba(0, 0, 0, 0.7) !important;
            }
          }
        }
        .sub-menu-area {
          position: absolute;
          z-index: 98;
          left: 100px;
          top: 0px;
          width: 150px;
          border-radius: 3px;
          padding: 0;
          padding-top: 20px;
          background: transparent;
          .sub-btn {
            border-bottom: 1px solid #a0a0a0;
            background: -webkit-linear-gradient(
              0deg,
              rgb(239 234 209 / 0%) 0%,
              rgb(239 234 209 / 60%) 35%,
              rgb(239 234 209 / 70%) 40%,
              rgb(239 234 209 / 100%) 60%
            );
            backdrop-filter: blur(2px);
            &.v-list-item--disabled {
              background: -webkit-linear-gradient(
                0deg,
                rgb(161 161 161 / 0%) 0%,
                rgb(161 161 161 / 60%) 35%,
                rgb(161 161 161 / 70%) 40%,
                rgb(161 161 161 / 80%) 60%
              ) !important;
            }
            &:last-child {
              border: none;
            }
            .v-list-item__icon {
              margin-right: 30px;
            }
            .v-list-item__title {
              font-size: 26px !important;
              letter-spacing: 2px;
            }
          }
        }
      }
    }
    .user-type {
      font-size: 16px;
    }
  }
}
</style>
