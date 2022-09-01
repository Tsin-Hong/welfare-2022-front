<template>
  <v-container class="home" fluid>
    <v-card class="left-menu" height="100vh">
      <UserPage :initData="initData" />
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
    initData: {},
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
            is_show: true,
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
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
            couldBeUseByOther: true
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
            is_show: true,
            couldBeUseRoleIds: [2],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          }
        ]
      },
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
          },
          {
            id: 5004,
            icon: '',
            title: '錦囊',
            is_show: true,
            couldBeUseRoleIds: [1, 2],
            couldBeUseByCity: true,
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
    ...mapGetters(['getUser', 'hashMapSellers']),
    currUser: function () {
      return this.getUser()
    },
    isSelectMapMode() {
      return ['move', 'battal'].includes(this.client.status_type)
    },
    myPacketItems() {
      const user = this.user
      const hashItemMap = this.global.itemMap
      const items = this.global.items
      return Object.values(hashItemMap).map((info: any) => {
        const quantity = items.filter((e) => e.itemId == info.id).length
        const allow = quantity > 0 && (info.when == 0 || !user.captiveDate)
        return { quantity, allow, ...info }
      })
    }
  },

  mounted: function () {
    fetch('./data/init.json')
      .then((res) => res.json())
      .then((data) => {
        this.initData = data
      })
    // if (!this.user.connected) {
    //   const token = window.localStorage.getItem('_token_')
    //   if (token) {
    //     this.$socket.emit('AUTHORIZE', { token })
    //   }
    // }
  },

  methods: {
    ...mapMutations(['ChangeState', 'ChangeApiCheck', 'ChangeDialogCheck']),
    ...mapActions([
      'ApiMove',
      'ApiBattle',
      'actAppointOccupation',
      'actDismissOccupation',
      'actShare',
      'actEscape',
      'actSetOriginCity',
      'actRecruit',
      'actRecruitCaptive',
      'actReleaseCaptive',
      'getItems',
      'actRebellion'
    ]),
    menuShow: function (item, child) {
      let show = false
      switch (
        false // 母類別 不顯示的條件
      ) {
        case item.is_show:
        case item.couldBeUseRoleIds.includes(this.currUser.role):
        case this.currUser.mapNowIsCity
          ? item.couldBeUseByCity
          : item.couldBeUseByOther:
        case this.currUser.actPoint > 0 || item.title === '離開':
        case !(
          this.currUser.captiveDate && ['內政', '論功'].includes(item.title)
        ):
        case !this.isSelectMapMode:
          return show
      }

      if (child) {
        switch (
          false // 子類別 不顯示的條件
        ) {
          case child.is_show:
          case child.couldBeUseRoleIds.includes(this.currUser.role):
          case this.currUser.captiveDate
            ? ['逃脫', '錦囊'].includes(child.title)
            : true:
          case this.currUser.mapNowIsCity
            ? child.couldBeUseByCity
            : child.couldBeUseByOther:
          case this.currUser.mapTargetId == 0
            ? true
            : !['移動', '出征'].includes(child.title):
            return show
        }

        switch (
          child.title // 特定子類別 的特殊條件
        ) {
          case '下野':
            {
              show = this.currUser.loyalUserId === 0
            }
            break
          case '配給':
            {
              const occupation =
                this.global.occupationMap[this.currUser.occupationId]
              show =
                this.currUser.role == 1 ||
                (occupation && occupation.isAllowedShare)
            }
            break
          case '招募':
            {
              const occupation =
                this.global.occupationMap[this.currUser.occupationId]
              show =
                this.currUser.role == 1 ||
                (occupation && occupation.isAllowedRecurit)
            }
            break
          case '遷都':
            {
              const mycountry = this.global.countries.find(
                (c) => c.id == this.user.countryId
              )
              show =
                this.currUser.role == 1 &&
                mycountry &&
                mycountry.originCityId == 0
            }
            break
          case '逃脫':
            {
              show = !!this.currUser.captiveDate
            }
            break
          case '叛亂':
            {
              const mapNowUsers = this.global.users.filter(
                (item) => item.mapNowId === this.currUser.mapNowId
              )
              const mapNowUserNum = mapNowUsers.length
              const mapNowUsersHasLoyal = mapNowUsers.find(
                (item) => item.role == 1
              )
              const occupation =
                this.global.occupationMap[this.currUser.occupationId]
              let battleUsersId = []
              for (const i in this.global.battlefieldMap) {
                const curr = this.global.battlefieldMap[i]
                battleUsersId = battleUsersId.concat(
                  curr.atkUserIds,
                  curr.defUserIds
                )
              }
              battleUsersId = [...new Set(battleUsersId)].filter(
                (item) => item != 0
              )
              const userInBattle = mapNowUsers.find((item) =>
                battleUsersId.includes(item.id)
              )
              show =
                occupation &&
                occupation.name == '軍師' &&
                mapNowUserNum >= 5 &&
                !mapNowUsersHasLoyal &&
                !userInBattle
            }
            break
          // case '錦囊':
          //   {
          //     show = this.currUser.role == 1 || this.currUser.occupationId > 0
          //   }
          //   break
          case '交易':
            {
              show = !!this.hashMapSellers[this.currUser.mapNowId]
            }
            break
          default:
            show = true
        }
      } else {
        show = true
      }
      return show
    },
    chickBtn: function (go: any, key = '', index = '', id = 0) {
      // console.log('global: ', this.global)
      if (go) {
        this.ChangeApiCheck({ key: key, index: index, id: id })
        switch (id) {
          case 5001: // 移動
            this.ApiMove()
            break
          case 5002: // 出征
            this.ChangeState(['status_type', 'battal'])
            break
          case 1005: // 建築
            this.ChangeState(['dialog_level_up_city', true])
            break
          case 2001: // 任命
            this.showDialogGCSelection(
              '任命',
              this.getAppointmentData(),
              this.handleAppointment
            )
            break
          case 2002: // 解任
            this.showDialogGCSelection(
              '解任',
              this.getDismissData(),
              this.handleDismiss
            )
            break
          case 2004: // 配給
            this.showDialogGCSelection(
              '配給',
              this.getShareData(),
              this.handleShare
            )
            break
          case 1004: // 遷都
            this.handlePromptMigrateOriginCity()
            break
          case 2003: // 招募
            this.showDialogGCSelection(
              '招募',
              this.getRecuritData(),
              this.handleRecurit
            )
            break
          case 3005: // 交易
            this.startTrade()
            break
          case 3006: // 俘虜
            // this.handlePromptCaptives()
            this.showDialogGCSelection(
              '俘虜',
              this.getCaptivesData(),
              this.handleCaptives
            )
            break
          case 3007: // 叛亂
            this.actRebellion()
            break
          case 5004: // 錦囊
            this.showItemData()
            break
          default:
            this.ChangeDialogCheck({ content: key })
        }
      }
    },
    showDialogGCSelection: function (title: string, data: any, callback: any) {
      if (title && data && data.length > 0) {
        this.ChangeState(['dialog_gc_selection', true])
        this.ChangeState(['dialog_gc_selection_answers', []])
        this.ChangeState([
          'dialog_gc_selection_dataset',
          {
            title,
            callback,
            data
          }
        ])
      } else {
        console.log('showDialogGCSelection failed: ', data)
      }
    },
    getAppointmentData: function () {
      const occupationMap = this.global.occupationMap
      const myself = this.user
      const users = this.global.users.filter(
        (user) => user.countryId == myself.countryId && user.role == 2
      )
      const results = []

      if (occupationMap) {
        let options = []
        let text = '選擇欲任命之官吏'
        Object.values(occupationMap).map((occ: any) => {
          const assignedUser = users.find(
            (user: any) => user.occupationId == occ.id
          )
          let display = ` ${occ.name}  [ ${
            assignedUser
              ? assignedUser.nickname
              : ` 貢獻值需求: ${occ.contributionCondi} `
          } ]  `
          let value = occ
          let enable = !assignedUser
          options.push({ display, value, enable })
        })
        results.push({ text, options })
      }

      if (users.length > 0) {
        let options = []
        let text = '選擇任命武將'
        users.map((user: any) => {
          if (user.occupationId == 0) {
            let display = ` ${user.nickname}   ( 貢獻值: ${user.contribution} )`
            let value = user
            let enable = (parentValue: any) =>
              user.contribution >= parentValue.contributionCondi
            options.push({ display, value, enable })
          }
        })
        options.sort((a, b) => b.value.contribution - a.value.contribution)
        results.push({ text, options })
      }

      return results
    },
    handleAppointment: function (selectedValues) {
      const ary = selectedValues.filter((s) => s && s.id)
      if (ary.length == 2) {
        const yes = window.confirm(
          `是否確定任命 [ ${ary[1].nickname} ] 為 [ ${ary[0].name} ] `
        )
        yes &&
          this.actAppointOccupation({
            userId: ary[1].id,
            occupationId: ary[0].id
          })
      } else {
        console.log('handleAppointment failed: ', selectedValues)
        window.alert('Failed')
      }
    },
    getDismissData: function () {
      const occupationMap = this.global.occupationMap
      const results = []

      if (occupationMap) {
        const myself = this.user
        const users = this.global.users.filter(
          (user: any) =>
            user.countryId == myself.countryId && user.occupationId > 0
        )
        let options = []
        let text = '選擇欲解任之武將'
        Object.values(occupationMap).map((occ: any) => {
          const assignedUser = users.find(
            (user: any) => user.occupationId == occ.id
          )
          if (assignedUser) {
            let display = `[ ${occ.name} ] ${
              assignedUser ? assignedUser.nickname : ''
            } `
            let value = assignedUser
            let enable = true
            options.push({ display, value, enable })
          }
        })
        results.push({ text, options })
      }
      return results
    },
    handleDismiss: function (selectedValues) {
      if (selectedValues.length == 1) {
        const yes = window.confirm(
          `是否確定解任 [ ${selectedValues[0].nickname} ] ?`
        )
        yes && this.actDismissOccupation({ userId: selectedValues[0].id })
      }
    },
    getShareData: function () {
      const result = []
      const myself = this.user
      const users = this.global.users
        .filter(
          (user: any) =>
            user.countryId == myself.countryId && myself.id != user.id
        )
        .map((user: any) => {
          return {
            display: user.nickname,
            value: user,
            enable: true
          }
        })
      result.push({
        text: '選擇想配給的武將',
        options: users
      })
      result.push({
        text: '欲配給的數量',
        inputs: [
          { label: '黃金', type: 'number', max: myself.money, min: 0 },
          { label: '兵力', type: 'number', max: myself.soldier, min: 0 }
        ]
      })
      return result
    },
    handleShare: function (selectedValues) {
      // console.log('handleShare: ', selectedValues)
      const money = selectedValues[1][0]
      const soldier = selectedValues[1][1]
      const yes = window.confirm(
        `確定配給 [ ${selectedValues[0].nickname} ] 黃金: ${money}, 士兵: ${soldier} 嗎?`
      )
      if (yes) {
        this.actShare({ userId: selectedValues[0].id, money, soldier })
      }
    },
    getRecuritData: function () {
      const result = []
      const myself = this.user
      const mymaps = this.global.maps
        .filter((map) => map.ownCountryId == myself.countryId)
        .map((map) => map.id)
      const users = this.global.users
        .filter((user) => user.role == 3)
        .map((user: any) => {
          const ratio = mymaps.includes(user.mapNowId) ? 20 : 10
          return {
            ratio,
            display: `${user.nickname} - 成功率: ${ratio}%`,
            value: user,
            enable: true
          }
        })
      users.sort((a, b) => b.ratio - a.ratio)
      result.push({
        text: '選擇要招募的浪人',
        options: users
      })
      return result
    },
    handleRecurit: function (selectedValues) {
      const yes = window.confirm(
        `確定招募浪人 [${selectedValues[0].nickname}] 嗎?`
      )
      if (yes) {
        this.actRecruit({ userId: selectedValues[0].id })
      }
    },
    handlePromptMigrateOriginCity: function () {
      const cities = this.global.maps.filter(
        (m) => m.ownCountryId == this.user.countryId && m.cityId > 0
      )
      const gameTypes = Object.keys(enums.CHINESE_GAMETYPE_NAMES).map((key) => [
        parseInt(key),
        enums.CHINESE_GAMETYPE_NAMES[key]
      ])
      if (cities.length > 0) {
        const cityId = parseInt(
          window.prompt(
            cities.map((f) => `${f.cityId} -> ${f.name}`).join('\r\n')
          )
        )
        const gameTypeId = parseInt(
          window.prompt(gameTypes.map((f) => `${f[0]} -> ${f[1]}`).join('\r\n'))
        )
        this.actSetOriginCity({ cityId, gameTypeId })
      } else {
        window.alert('沒有城池.')
      }
    },
    getCaptivesData: function () {
      // console.log('global: ', this.global)
      const now = new Date().getTime()
      const result = []
      const myself = this.user
      const ownMapIds = this.global.maps
        .filter((map) => map.ownCountryId == myself.countryId)
        .map((map) => map.id)
      const users = this.global.users
        .filter((user) => user.captiveDate && ownMapIds.includes(user.mapNowId))
        .map((user: any) => {
          const timeGap = now - new Date(user.captiveDate).getTime()
          const ratio = Math.min(
            Math.ceil(timeGap / 1000 / 60 / 60 / 24) * 2.5 + 25,
            100
          )
          return {
            ratio,
            display: `${user.nickname} - 受俘日 (${new Date(
              user.captiveDate
            ).toLocaleDateString()})  招募成功率: ${ratio}%`,
            value: user,
            enable: true
          }
        })
      users.sort((a, b) => b.timeGap - a.timeGap)
      //
      result.push({
        text: '選擇要處置的俘虜',
        options: users
      })
      result.push({
        text: '處置俘虜',
        options: [
          { display: '招募', value: 1, enable: true },
          { display: '釋放', value: 2, enable: true }
        ]
      })
      return result
    },
    handleCaptives: function (selectedValues) {
      let yes = false
      switch (selectedValues[1]) {
        case 1:
          yes = window.confirm(
            `確定招募俘虜 [${selectedValues[0].nickname}] 嗎?`
          )
          break
        case 2:
          yes = window.confirm(
            `確定釋放俘虜 [${selectedValues[0].nickname}] 嗎?`
          )
          break
        default:
          console.log('handleCaptives failed: ', selectedValues)
      }
      if (yes) {
        if (selectedValues[1] == 1) {
          return this.actRecruitCaptive({ userId: selectedValues[0].id })
        } else {
          return this.actReleaseCaptive({ userId: selectedValues[0].id })
        }
      }
    },
    showItemData: function () {
      console.log('global: ', this.global)
      this.getItems()
      this.ChangeState(['dialog_item', true])
    },
    startTrade: function () {
      const curUser = this.currUser
      const sellers = this.hashMapSellers[curUser.mapNowId] || []
      const itemShop = this.global.itemShop;
      if (sellers.length == 0) {
        window.alert('沒有發現隱士!')
      } else {
        const dispatchFn = this.$store.dispatch
        const products = [];
        itemShop.map(itemdata => {
          if (sellers.includes(itemdata.seller)) {
            products.push(itemdata)
          }
        });
        console.log('products: ', products)
        const gcsData = [{text: '選擇要購買的錦囊', options: products.map(product => {
          return {
            display: `(${product.seller}) ${product.name}  -  $${product.price.toLocaleString()}`,
            value: product.itemId,
            enable: curUser.money >= product.price
          }
        })}]
        this.showDialogGCSelection(
          '交易',
          gcsData,
          (res) => {
            const selectedItemId = res[0]
            dispatchFn('actBuyItem', {itemId: selectedItemId})
          }
        )
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
