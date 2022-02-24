<template>
  <v-container id="userPage" class="user-page" ref="userPage" fluid>
    <div id="mapArea" class="map-area">
      <img class="map" src="../assets/images/map.jpg" alt="" />
      <div class="user-area">
        <div class="user-info">
          <div class="img-area">
            <img class="user-img" src="../assets/images/user/R064.png" alt="" />
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
              <div class="flag flag-content" style="background-color: #fff">
                <div class="flag-vertical name" style="color: #111"></div>
                <img src="../assets/images/旗幟_內.png" alt="" />
              </div>
              <div class="info-block">
                <div class="date">2022年2月21日 星期一</div>
                <div class="user">
                  <div class="block block-1">
                    <span class="name">程寶寶</span
                    ><span class="type">浪人</span>
                  </div>
                  <div class="block resource">
                    <span class="class-1">兵力 0</span>
                  </div>
                  <div class="block block-3">
                    <span class="place">天水</span
                    ><span class="power">行動力 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="stronghold-list">
        <div
          v-for="(stronghold, stronghold_i) in strongholds"
          :class="[
            'stronghold',
            { castle: stronghold.type == 1 },
            { jungle: stronghold.type == 2 },
            { here: stronghold.is_here }
          ]"
          :style="{ left: stronghold.x + 'px', top: stronghold.y + 'px' }"
          :id="'stronghold_' + stronghold_i"
          :key="stronghold_i"
          @click="showThisStronghold(stronghold_i)"
        >
          <div class="stronghold-area">
            <div class="stronghold-context">
              <div class="country">
                <span
                  class="country-name"
                  :style="{
                    background: stronghold.conutry.color,
                    color: stronghold.conutry.t_color
                  }"
                  >{{ stronghold.conutry.name }}</span
                >
                <span class="bottom"></span>
              </div>
              <div class="stronghold-info-area">
                <div class="stronghold-name">{{ stronghold.name }}</div>
                <div class="stronghold-info">
                  武 {{ stronghold.generals_num }}、兵
                  {{ stronghold.military_strength }}、浪
                  {{ stronghold.ronin_num }}
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog_check" persistent max-width="290">
      <v-card dark class="dialog-card">
        <v-card-title>
          確定要執行 {{ this.dialog_check_curr.key }} ?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="ChangeState(['dialog_check', false])"
          >
            放棄
          </v-btn>
          <v-btn color="green darken-1" text @click="goDoApi()"> 執行 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" persistent width="500">
      <v-card dark class="dialog-card">
        <v-img
          v-if="dialog_content.img"
          :src="require('../assets/images/dialog/' + dialog_content.img)"
          height="200px"
          top
        />
        <v-card-title>
          {{ dialog_content.title }}
        </v-card-title>
        <v-card-text>{{ dialog_content.text }}</v-card-text>
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
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default Vue.extend({
  name: 'HelloWorld',
  data: () => ({
    strongholds: [
      {
        id: 1,
        name: '西涼',
        x: 213,
        y: 592,
        type: 1,
        generals_num: 8,
        ronin_num: 0,
        military_strength: 500,
        is_main: true,
        is_here: false,
        conutry: {
          id: 1,
          name: '空幹',
          color: '#FFF',
          t_color: '#000'
        }
      },
      {
        id: 2,
        name: '天水',
        x: 378,
        y: 804,
        type: 1,
        generals_num: 0,
        ronin_num: 0,
        military_strength: 0,
        is_main: false,
        is_here: false,
        conutry: {
          id: 0,
          name: '',
          color: '#CCC',
          t_color: '#000'
        }
      },
      {
        id: 3,
        name: '天水渡口',
        x: 272.81,
        y: 760.03,
        type: 2,
        generals_num: 0,
        ronin_num: 0,
        military_strength: 0,
        is_main: false,
        is_here: false,
        conutry: {
          id: 0,
          name: '',
          color: '#CCC',
          t_color: '#000'
        }
      },
      {
        id: 4,
        name: '漢中',
        x: 512,
        y: 1022,
        type: 1,
        generals_num: 15,
        ronin_num: 0,
        military_strength: 1500,
        is_main: true,
        is_here: true,
        conutry: {
          id: 2,
          name: '叡迅',
          color: 'green',
          t_color: 'white'
        }
      },
      {
        id: 5,
        name: '漢中道',
        x: 440.81,
        y: 934.03,
        type: 2,
        generals_num: 3,
        ronin_num: 0,
        military_strength: 800,
        is_here: false,
        conutry: {
          id: 2,
          name: '叡迅',
          color: 'green',
          t_color: 'white'
        }
      },
      {
        id: 5,
        name: '漢中谷',
        x: 734.81,
        y: 1174.03,
        type: 2,
        generals_num: 3,
        ronin_num: 0,
        military_strength: 800,
        is_here: false,
        conutry: {
          id: 2,
          name: '叡迅',
          color: 'green',
          t_color: 'white'
        }
      },
      {
        id: 6,
        name: '梓潼',
        x: 213,
        y: 1098,
        type: 1,
        generals_num: 15,
        ronin_num: 0,
        military_strength: 1500,
        is_main: false,
        is_here: false,
        conutry: {
          id: 2,
          name: '叡迅',
          color: 'green',
          t_color: 'white'
        }
      },
      {
        id: 5,
        name: '梓潼道',
        x: 372.81,
        y: 1046.03,
        type: 2,
        generals_num: 3,
        ronin_num: 0,
        military_strength: 800,
        is_here: false,
        conutry: {
          id: 2,
          name: '叡迅',
          color: 'green',
          t_color: 'white'
        }
      },
      {
        id: 7,
        name: '成都',
        x: 331,
        y: 1344,
        type: 1,
        generals_num: 15,
        ronin_num: 0,
        military_strength: 1500,
        is_main: false,
        is_here: false,
        conutry: {
          id: 2,
          name: '叡迅',
          color: 'green',
          t_color: 'white'
        }
      }
    ]
  }),

  computed: {
    ...mapState([
      'dialog',
      'dialog_content',
      'dialog_check',
      'dialog_check_curr'
    ])
  },

  created: function () {
    // 要去得當前使用者所在城池
    this.goToXY(3)
  },

  methods: {
    ...mapMutations(['ChangeState']),
    ...mapActions(['ApiAddTroops', 'ApiJoinCountry']),
    goDoApi: function () {
      switch (this.dialog_check_curr.key) {
        case '增兵':
          this.ApiAddTroops()
          break
        case '入仕':
          this.ApiJoinCountry()
      }
      this.ChangeState(['dialog_check', false])
    },
    goToXY: function (index = 0) {
      this.$nextTick(() => {
        const strongholdId = '#stronghold_' + index
        this.$scrollTo(strongholdId, 500, {
          container: '#userPage',
          offset: -450,
          x: true
        })
        // element.$scrollTo(stronghold.x, stronghold.y)
      })
    },
    showThisStronghold: function (index = 0) {
      this.goToXY(index)
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
          cursor: pointer;

          .stronghold-area {
            position: relative;
            .stronghold-context {
              position: absolute;
              top: -50px;
              display: flex;
              font-family: '華康行楷體W5';
              background: -webkit-linear-gradient(
                0deg,
                rgb(0, 0, 0) 44%,
                rgba(0, 0, 0, 0.5) 72%,
                rgba(0, 0, 0, 0.1) 98%
              );
              filter: drop-shadow(0px 0px 2px #201707);
              & > span {
                display: inline-block;
              }
              .country {
                padding: 4px;
                background: #cabca6;
                position: relative;
                height: 47px;
                .country-name {
                  display: inline;
                  border: 1px solid #413227;
                  padding: 2px 2px 0px;
                  color: #333;
                  font-size: 14px;
                  line-height: 16px;
                  letter-spacing: 3px;
                  writing-mode: vertical-lr;
                  background: #ccc;
                  width: 22px;
                  height: 38px;
                }
                .bottom {
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
              .stronghold-info-area {
                padding: 5px 15px 2px 8px;
                color: #fff;
                .stronghold-name {
                  font-size: 18px;
                  line-height: 19px;
                  white-space: nowrap;
                }
                .stronghold-info {
                  font-size: 14px;
                  white-space: nowrap;
                }
              }
            }
          }
          &.jungle {
            .stronghold-area {
              .stronghold-context {
                top: -60px;
                left: -10px;
              }
            }
          }
          &.here {
            z-index: 11;
            .stronghold-name {
              color: #eac927;
            }
          }
          &:hover {
            filter: drop-shadow(0px 0px 4px #cabca6);
            z-index: 12;
          }
        }
        .castle {
          img {
            width: 72px;
            height: 46px;
          }
        }
        .jungle-img {
          border: 1px solid #413d30;
          border-radius: 3px;
          width: 25.13px;
          height: 15.53px;
          box-shadow: 0 10px 25px #9898988a, 0px -10px 25px #ffffffb8,
            inset 0 -5px 10px #9898988a, inset 0 5px 10px #ffffffb8;
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
      width: 500px;
      padding: 15px;
      z-index: 999;
      .img-area {
        height: 150px;
        width: 150px;
        position: relative;
        border-radius: 999px;
        background: #0a293c;
        overflow: hidden;
        .user-img {
          width: 150%;
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
        .info-area {
          position: absolute;
          z-index: -1;
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
                  span {
                    display: inline-block;
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
  font-size: 16px;
}
</style>
