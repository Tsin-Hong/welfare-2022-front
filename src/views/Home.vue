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
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          }
        ]
      },
      {
        id: 2,
        title: '論功',
        icon: 'hops',
        is_show: false,
        is_click: false,
        couldBeUseByCity: true,
        couldBeUseByOther: false,
        couldBeUseRoleIds: [1, 2],
        items: [
          {
            id: 2001,
            icon: '',
            title: '任命',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 2002,
            icon: '',
            title: '解任',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 2003,
            icon: '',
            title: '招募',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 2004,
            icon: '',
            title: '配給',
            is_show: false,
            couldBeUseRoleIds: [],
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
        couldBeUseByOther: false,
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
            couldBeUseByOther: false
          },
          {
            id: 3003,
            icon: '',
            title: '起義',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3004,
            icon: '',
            title: '逃脫',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3005,
            icon: '',
            title: '交易',
            is_show: false,
            couldBeUseRoleIds: [],
            couldBeUseByCity: true,
            couldBeUseByOther: false
          },
          {
            id: 3006,
            icon: '',
            title: '俘虜',
            is_show: false,
            couldBeUseRoleIds: [],
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
            is_show: false,
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
    ...mapActions(['ApiMove', 'ApiBattle']),
    menuShow: function (item, child) {
      let show = false
      if (
        item.is_show &&
        !['move', 'battal'].includes(this.client.status_type)
      ) {
        if (child) {
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
                (this.currUser.mapNowIsCity && child.couldBeUseByCity) ||
                (!this.currUser.mapNowIsCity && child.couldBeUseByOther)
              ) {
                show = true
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
          default:
            this.ChangeDialogCheck({ content: key })
        }
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
        // cursor: url('../assets/images/mouse.png'), pointer;
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
              rgb(239 234 209 / 80%) 40%,
              rgb(239 234 209 / 100%) 60%
            );
            &.v-list-item--disabled {
              background: #a1a1a1a2 !important;
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
