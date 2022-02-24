<template>
  <v-container class="home" fluid>
    <v-card class="left-menu" height="100vh">
      <user-page />
      <v-list class="menu-area" absolute>
        <v-list-item-group>
          <template v-for="(item, index) in items">
            <div
              v-if="item.is_show"
              :key="index"
              class="btn-group"
              @mouseover="currMainMenu = item.title"
              @mouseleave="currMainMenu = ''"
            >
              <v-list-item class="main-btn">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-' + item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list class="sub-menu-area" v-if="currMainMenu == item.title">
                <template v-for="(child, child_i) in item.items">
                  <v-list-item
                    :key="index + '-' + child_i"
                    v-if="item.is_show && child.is_show"
                    class="sub-btn"
                    @click="chickBtn(child.title, index + '-' + child_i)"
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
import { mapActions, mapMutations, mapState } from 'vuex'
import UserPage from '../components/UserPage.vue'

export default Vue.extend({
  name: 'Home',

  data: () => ({
    currMainMenu: '',
    items: [
      {
        title: '內政',
        icon: 'home-flood',
        is_show: true,
        items: [
          { icon: '', title: '商業', is_show: false },
          { icon: '', title: '增兵', is_show: true },
          { icon: '', title: '政策', is_show: false },
          { icon: '', title: '擁立', is_show: false }
        ]
      },
      {
        title: '論功',
        icon: '',
        is_show: false,
        items: [
          { icon: '', title: '任命', is_show: false },
          { icon: '', title: '解任', is_show: false },
          { icon: '', title: '招募', is_show: false },
          { icon: '', title: '配給', is_show: false },
          { icon: '', title: '進貢', is_show: false }
        ]
      },
      {
        title: '攻略',
        icon: 'baseball-diamond',
        is_show: true,
        items: [
          { icon: '', title: '入仕', is_show: true },
          { icon: '', title: '下野', is_show: true },
          { icon: '', title: '起義', is_show: false },
          { icon: '', title: '釋放', is_show: false },
          { icon: '', title: '交易', is_show: false },
          { icon: '', title: '裁判', is_show: false },
          { icon: '', title: '叛亂', is_show: false }
        ]
      },
      {
        title: '外交',
        icon: '',
        is_show: false,
        items: [
          { icon: '', title: '親善', is_show: false },
          { icon: '', title: '同盟', is_show: false },
          { icon: '', title: '請求攻擊', is_show: false }
        ]
      },
      {
        title: '軍議',
        icon: 'axe-battle',
        is_show: true,
        items: [
          { icon: '', title: '移動', is_show: true },
          { icon: '', title: '出征', is_show: false },
          { icon: '', title: '探索', is_show: false }
        ]
      }
    ]
  }),

  computed: {
    ...mapState(['dialog', 'dialog_imgs'])
  },

  components: {
    UserPage
  },

  methods: {
    ...mapMutations(['ChangeState', 'ChangeApiCheck']),
    chickBtn: function (key = '', index = '') {
      this.ChangeApiCheck({ key: key, index: index })
    }
  }
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
            &:last-child {
              border: none;
            }
            .v-list-item__icon {
              margin-right: 30px;
            }
            .v-list-item__title {
              color: #2b323f;
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
