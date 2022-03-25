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
      <div class="right-top-area">
        <div class="btn-group">
          <span class="battle" disabled @click="showInfoArea(2)">
            <img src="../assets/images/戰役.png" alt="" />
            <div class="text">戰役</div>
          </span>
          <span class="notice" @click="showInfoArea(0)">
            <img src="../assets/images/公告.png" alt="" />
            <div class="text">活動公告</div>
          </span>
          <span class="game-book" @click="showInfoArea(1)">
            <img src="../assets/images/說明書.png" alt="" />
            <div class="text">遊戲說明</div>
          </span>
        </div>
      </div>
      <div class="bottom-area">
        <div class="d-flex">
          <div class="flex-block flex-1"></div>
          <div class="flex-block flex-2">
            <div v-if="client.status_type != ''" class="btn-area">
              <div class="btn-title">
                請選擇{{ client.dialog_check_curr.key }}目的地
              </div>
              <div v-if="client.status_type == 'move'" class="btn-info">
                只能在勢力所在據點間移動
              </div>
              <v-btn block dark @click="cencel()">取消</v-btn>
            </div>
          </div>
          <div class="flex-block flex-3"></div>
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
            :class="strongholdClass(stronghold)"
            :style="{ left: stronghold.x + 'px', top: stronghold.y + 'px' }"
            :id="'stronghold_' + stronghold_i"
            :key="stronghold_i"
            :disabled="
              client.status_type == 'move' && stronghold.id == user.mapNowId
            "
            @click="clickThisStronghold(stronghold_i)"
          >
            <div class="stronghold-area">
              <div class="here-bg">
                <img src="../assets/images/黃框.png" alt="" />
              </div>
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
                :class="{
                  show:
                    showCityDetails &&
                    stronghold.generals_num !== 0 &&
                    stronghold.military_strength !== 0
                }"
                :ref="'stronghold-details-' + stronghold.id"
                :style="
                  setLeft(
                    stronghold.is_main,
                    stronghold.type,
                    'stronghold-details-' + stronghold.id
                  )
                "
              >
                <div>
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
          <v-btn class="ml-50-px" color="green darken-1" text @click="cencel()">
            否
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="goDoApi()"> 是 </v-btn>
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
          <v-btn color="white" text @click="cencel()"> 知悉 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="client.dialog_battle" persistent width="500">
      <v-card dark class="dialog-battal-card">
        <v-card-title v-if="goToCityObj.conutry"
          >{{ goToCityObj.name }} 守方勢力 {{ goToCityObj.conutry.name }}
        </v-card-title>
        <v-card-text>
          <div>
            戰爭發生時間
            <v-radio-group v-model="goToBattleTime" column>
              <v-radio
                v-for="(time, index) in global.battleAreaPanel.timeOptions"
                :key="index"
                :label="moment(time).format('YYYY-MM-DD HH:mm')"
                :value="time"
              ></v-radio>
            </v-radio-group>
          </div>
          <div>
            派出兵力數
            <v-row>
              <v-col class="pr-4">
                <v-slider
                  v-model="goToBattleSoldier"
                  class="align-center"
                  :max="battalSoldierMax"
                  :min="battalSoldierMin"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="goToBattleSoldier"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </div>
          <div class="red--text pt-6" v-text="errorText"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" text @click="donotBattle()"> 返回 </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="createBattle()"> 出征 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      class="dialog_info-area"
      dark
      v-model="client.dialog_info"
      width="1280"
    >
      <v-card class="dialog_info">
        <v-card-title>{{ infoTitle }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="d-flex">
          <div class="left-list">
            <v-list dense class="w-480-px">
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item
                  v-for="(item, i) in leftList"
                  :key="i"
                  :disabled="item.disabled"
                >
                  <v-list-item-content>
                    <v-list-item-subtitle
                      v-text="numCN[i]"
                    ></v-list-item-subtitle>
                    <v-list-item-title
                      class="fz-20-px"
                      v-text="item.title"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="item.date"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
          <div class="right-content">
            <div class="d-flex mb-1">
              <div class="title">{{ leftList[selectedItem].title }}</div>
              <div class="link">
                <v-btn
                  color="cyan darken-4"
                  dark
                  :href="leftList[selectedItem].link"
                  target="_brank"
                  >詳細規則</v-btn
                >
                <v-btn
                  v-if="leftList[selectedItem].link_res"
                  color="cyan darken-4"
                  dark
                  :href="leftList[selectedItem].link_res"
                  target="_brank"
                  >活動結果</v-btn
                >
              </div>
            </div>
            <div class="img-area">
              <img
                v-if="leftList[selectedItem].hasImg"
                :src="
                  require('../assets/images/active/' +
                    this.leftList[this.selectedItem].title +
                    '活動海報.jpg')
                "
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      class="dialog-battle-area"
      dark
      fullscreen
      hide-overlay
      scrollable
      v-model="client.dialog_battle_list"
    >
      <v-card class="dialog-battle">
        <v-toolbar flat dark>
          <v-toolbar-title>戰役</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="ChangeState(['dialog_battle_list', false])">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title></v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <div
            class="battle-box"
            v-for="(battlefield, index) in battlefields"
            :key="index"
          >
            <div class="battle-info-group">
              <div class="battle-date">
                競賽日
                {{ moment(battlefield.timestamp).format('YYYY-MM-DD HH:mm') }}
              </div>
              <div class="battle-place flag-vertical">
                {{ battlefield.map.name }}之戰
              </div>
            </div>
            <div class="battle-top">
              <img src="../assets/images/border04.png" alt="" />
              <div class="battle-info-text">
                <span>{{ battlefield.defenceSoldierTotal }}</span>
                <span
                  :style="{
                    color: battlefield.defenceCountry.color[1],
                    background: battlefield.defenceCountry.color[0]
                  }"
                  >{{ battlefield.defenceCountry.name }}</span
                >
                VS
                <span
                  :style="{
                    color: battlefield.attackCountry.color[1],
                    background: battlefield.attackCountry.color[0]
                  }"
                  >{{ battlefield.attackCountry.name }}</span
                >
                <span>{{ battlefield.attackSoldierTotal }}</span>
              </div>
            </div>
            <div class="d-flex field-block">
              <div class="battle-team-area d-flex">
                <template v-for="(type, type_i) in battleType">
                  <div
                    v-if="battlefield[type + 'Country']"
                    class="field-group"
                    :class="[type + '-group']"
                    :key="type_i"
                  >
                    <div class="user-group">
                      <template>
                        <div
                          class="user-block"
                          v-for="(user, u_i) in battlefield[type + 'Users']"
                          :key="u_i"
                        >
                          <div class="user">
                            <div
                              class="bd-bg"
                              :style="{
                                background:
                                  battlefield[type + 'Country'].color[0]
                              }"
                            ></div>
                            <img
                              v-if="user"
                              :src="
                                require('../assets/images/user/' +
                                  user.code +
                                  '.png')
                              "
                              alt=""
                            />
                          </div>
                          <div class="bd">
                            <img
                              :src="require('../assets/images/border03.png')"
                              alt=""
                            />
                            <div
                              class="country-name"
                              :style="{
                                color: battlefield[type + 'Country'].color[0]
                              }"
                            >
                              {{ battlefield[type + 'Country'].name }}
                            </div>
                            <div class="user-name">
                              <div class="type">
                                {{ type == 'defence' ? '守' : '攻' }}
                              </div>
                              <div v-if="user" class="name-text flag-vertical">
                                {{ user.nickname }}
                              </div>
                            </div>
                            <div v-if="battlefield" class="soldier-group">
                              {{ battlefield[type + 'Soldier'][u_i] }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <img class="vs-img" src="../assets/images/vs.png" />
              </div>
              <div class="field-group other-group">
                <div class="user-group">
                  <div
                    class="user-block"
                    v-for="(key, u_i) in battleOtherUser"
                    :key="u_i"
                  >
                    <div v-if="battlefield[key]" class="user">
                      <div class="bd-bg"></div>
                      <img
                        :src="
                          require('../assets/images/user/' +
                            battlefield[key].code +
                            '.png')
                        "
                        alt=""
                      />
                    </div>
                    <div class="bd">
                      <img
                        :src="require('../assets/images/border03.png')"
                        alt=""
                      />
                      <div v-if="battlefield[key]" class="country-name">
                        {{ battlefield[key].country.name }}
                      </div>
                      <div class="user-name">
                        <div class="type">
                          {{ key == 'judge' ? '判' : '巡' }}
                        </div>
                        <div
                          v-if="battlefield[key]"
                          class="name-text flag-vertical"
                        >
                          {{ battlefield[key].nickname }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      class="dialog-map-info"
      dark
      v-model="openMapInfo"
      width="600">
      <v-card>
        <div v-if="selectedMapInfo">
          <p class="title">{{selectedMapInfo.name}}</p>
          <table style="width: 100%;">
            <tr>
              <th width="50%">總兵力</th>
              <th width="50%">{{selectedMapInfo.userdata.filter(u => u.countryId == selectedMapInfo.ownCountryId).reduce((a,b) => a + b.soldier, 0)}}</th>
            </tr>
            <tr>
              <th>基本抵禦力</th>
              <th>1000</th>
            </tr>
            <tr v-for="(info, idx) in selectedMapInfo.basicInfos" :key="idx">
              <th>{{info.name}}</th>
              <th>{{info.value}}</th>
            </tr>
            <tr>
              <th colspan="2">所在地將領</th>
            </tr>
            <tr v-for="(uu) in selectedMapInfo.userdata" :key="uu.id" :class="{captived: !!uu.captiveDate}" class="list-people">
              <td>{{uu.occupation}}</td>
              <td>{{uu.nickname}} ( {{uu.soldier}} )</td>
            </tr>
          </table>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
// import router from '@/router'
// import client from '@/store/client'
import client from '@/store/client'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default Vue.extend({
  name: 'UserPage',
  data: () => ({
    inCurrStrongholdIndex: '',
    _mouse_dataset: {},
    viewX: 0,
    viewY: 0,
    errorText: '',
    goToCityId: 0,
    goToCityObj: {},
    goToBattleTime: -1,
    goToBattleSoldier: 0,
    showCityDetails: localStorage.getItem('show_city_details') === 'true',
    showCountyDetails: localStorage.getItem('show_country_details') === 'true',
    showRoninDetails: localStorage.getItem('show_ronin_details') === 'true',
    infoTypeNow: 0,
    selectedItem: 1,
    curStronghold: {},
    numCN: ['壹', '貳', '叁', '肆', '伍', '陸', '柒', '捌', '玖', '拾', '壹拾壹', '壹拾貳', '壹拾叁', '壹拾肆', ],
    leftList: [
      {
        no: '壹',
        title: '群雄割據',
        date: '一月二十四日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBsVWpYGhTV56l0dRiQqBceROWzDRnA',
        disabled: false,
        hasImg: true
      },
      {
        no: '貳',
        title: '萬箭齊發',
        date: '四月一日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nra5tiN6BmPCC9aYX3APBe3Be6Dgd9Tg',
        disabled: false,
        hasImg: true
      },
      {
        no: '叁',
        title: '知己知彼',
        date: '四月三十日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBxWlzg4HdV9UVYeYSCS6GWGu6tMpte',
        link_res: '',
        disabled: false,
        hasImg: true
      },
      {
        no: '伍',
        title: '草船借箭',
        date: '五月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBxSMVAEtR80U5KRxePjV6SjAhJzd8i',
        disabled: true,
        hasImg: true
      },
      {
        no: '陸',
        title: '唉唷我的媽',
        date: '五月六日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBxNZJ934Tb85BxKYU9B3t1QxMQvr9z',
        disabled: true,
        hasImg: true
      },
      {
        no: '柒',
        title: '赤壁之戰',
        date: '六月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBxIADfzbZhAe83qj8XhyxnDINSIkBI',
        disabled: true,
        hasImg: true
      },
      {
        no: '捌',
        title: '官渡之戰',
        date: '七月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBxEc5kcNUP2TZ42jSf0SD0PnPZXuPC',
        disabled: true,
        hasImg: true
      },
      {
        no: '玖',
        title: '甲巴霸找爸爸',
        date: '八月五日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBx7OAjMGPQx27PtwPWexyFSKWBoGPW',
        disabled: true,
        hasImg: true
      },
      {
        no: '拾',
        title: '兵不厭詐、這是戰爭',
        date: '八月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwz6XZUFxz55M77H9T81Mh3dZ9GzZq',
        disabled: true,
        hasImg: true
      },
      {
        no: '壹拾壹',
        title: '草木皆兵',
        date: '九月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwvtPxjpmrowgnhlpfWks5grEjs9Kg',
        disabled: true,
        hasImg: true
      },
      {
        no: '壹拾貳',
        title: '四面楚歌',
        date: '十月七日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwt3iGDhu30Kf0LGLniSrcc47a22W5',
        disabled: true,
        hasImg: true
      },
      {
        no: '壹拾叁',
        title: '一夫當關之我不是拖椅子',
        date: '十一月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwps9RgaGOPJ37b71i0D2DTuPZNIqJ',
        disabled: true,
        hasImg: true
      },
      {
        no: '壹拾肆',
        title: '睿訊群英傳結算',
        date: '十二月二十三日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwhtxoE2kTWi2YHK8xVnXW3lRR9akW',
        disabled: true,
        hasImg: true
      }
    ],
    battleType: ['defence', 'attack'],
    battleOtherUser: ['judge', 'toolman'],
    defaultColor: ['#A1A1A1', '#000'],
    openMapInfo: false,
    openMapInfoIdx: 0,
  }),

  computed: {
    ...mapState(['user', 'global', 'client', 'info']),
    ...mapGetters(['getUser']),
    countries: function () {
      const countries = JSON.parse(JSON.stringify(this.global.countries))
      for (const i in countries) {
        const curr = countries[i]
        curr.color = curr.color.split(',')
      }
      return countries
    },
    users: function () {
      const countries = JSON.parse(JSON.stringify(this.countries))
      const users = JSON.parse(JSON.stringify(this.global.users))
      for (const i in users) {
        const user = users[i]
        const currCountry = countries.find((item) => item.id == user.countryId)
        user.country = currCountry
          ? currCountry
          : { color: this.defaultColer, name: '無' }
      }

      return users
    },
    battlefields: function () {
      const battles = JSON.parse(JSON.stringify(this.global.battlefieldMap))
      const countries = JSON.parse(JSON.stringify(this.countries))
      const users = JSON.parse(JSON.stringify(this.users))
      const strongholds = JSON.parse(JSON.stringify(this.strongholds))
      for (const i in battles) {
        const curr = battles[i]
        curr.attackCountry = countries.find((item) => {
          return item.id == curr.attackCountryIds[0]
        })
        curr.attackUsers = []
        for (const u in curr.atkUserIds) {
          const currUserId = curr.atkUserIds[u]
          curr.attackUsers.push(users.find((item) => item.id == currUserId))
        }
        curr.attackSoldier = curr.detail.atkSoldiers
        curr.attackSoldierTotal = curr.attackSoldier.reduce((a, b) => a + b)

        curr.defenceCountry = countries.find((item) => {
          return item.id == curr.defenceCountryId
        })
        curr.defenceUsers = []
        for (const u in curr.defUserIds) {
          const currUserId = curr.defUserIds[u]
          curr.defenceUsers.push(users.find((item) => item.id == currUserId))
        }
        curr.defenceSoldier = curr.detail.defSoldiers
        curr.defenceSoldierTotal = curr.defenceSoldier.reduce((a, b) => a + b)

        curr.judge = users.find((item) => item.id == curr.judgeId)
        curr.toolman = users.find((item) => item.id == curr.toolmanId)
        curr.map = strongholds.find((item) => item.id == curr.mapId)
      }
      console.log(battles)
      return battles
    },
    battalSoldierMax: function () {
      let max = this.currUser.soldier
      return max
    },
    battalSoldierMin: function () {
      let min = 0
      if (this.client.dialog_check_curr.id == 5002) {
        min = 1000
      }
      return min
    },
    infoTitle: function () {
      let text = '活動公告'
      if (this.infoTypeNow == 1) {
        text = '遊戲說明'
      }
      return text
    },
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
            const country = state.global.countries.find((e) => e.id === cid)
            const cname = country ? country.name : '空'
            const colors = country
              ? country.color.split(',')
              : this.defaultColor
            const usersInThisMap = hashMapIdUser[m.id] || []
            // console.log('usersInThisMap: ', usersInThisMap)
            m.id === state.user.mapNowId && (this.curStronghold = m)
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
    selectedMapInfo: function() {
      const _maps = this.global.maps;
      const _map = _maps[this.openMapInfoIdx]
      const _city = this.global.cities.find(c => c.id == _map.cityId)
      const _occupationMap  = this.global.occupationMap;
      const userdata = this.global.users.filter(u => u.mapNowId == _map.id).map(u => {
        const occ = _occupationMap[u.occupationId]
        let occupation = '浪人'
        switch (u.role) {
          case 1: occupation = '主公'; break
          case 2: occupation =  occ ? occ.name : '武將'; break
          case 3: occupation = '浪人'; break
          default:
        }
        if (u.captiveDate) {
          occupation += '(俘虜)'
        }
        return {...u, occupation}
      })
      const basicInfos = _city ? [
        {cons: 'barrack', name: '徵兵量', value: `${100} - ${300 + (_maps.filter(m => m.cityId > 0 && m.ownCountryId == _map.ownCountryId).length * 15)}` },
        {cons: 'market', name: '商業收益', value: `${50 + _city.addResource} - ${150 + _city.addResource}` },
        {cons: 'stable', name: '移動消耗減免', value: 0 },
        {cons: 'wall', name: '防禦損兵減少量', value: `${0}%` },
      ] : []
      userdata.sort((a,b) => a.role == b.role ? b.soldier - a.soldier : a.role - b.role)
      return {..._map, userdata, basicInfos};
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
        if ([5001, 5002].includes(val.id)) {
          this.goToXY(this.currUser.mapNowIndex)
        }
      },
      deep: true,
      immediate: true
    },
    'global.battleAreaPanel.mapId': function (val) {
      if (val !== 0) {
        this.goToBattleSoldier = 1000
        this.ChangeState(['dialog_battle', true])
      } else {
        this.ChangeState(['dialog_battle', false])
      }
    }
  },

  mounted: function () {
    this._mouse_dataset = {}
    // localStorage.setItem('show_country_details', 'true')
  },

  methods: {
    ...mapMutations([
      'ChangeState',
      'ChangeApiCheck',
      'ChangeDialogCheck',
      'ChangeRootState',
      'ChangeApiResult'
    ]),
    ...mapActions([
      'ApiAddTroops',
      'ApiJoinCountry',
      'actMove',
      'actIncreaseSoldier',
      'actSearchWild',
      'actLeaveCountry',
      'actEnterCountry',
      'ApiRes',
      'actBattle'
    ]),
    moment: function (date) {
      return this.$moment(date)
    },
    createBattle: function () {
      if (this.goToBattleTime == -1) {
        this.errorText = '請選擇戰爭發生時間。'
        return
      }

      const data = {
        mapId: this.goToCityId,
        time: this.goToBattleTime,
        soldier: this.goToBattleSoldier
      }
      this.actBattle(data)
    },
    strongholdClass: function (stronghold) {
      let classNames = 'stronghold'
      if (
        this.client.status_type == '' ||
        (this.client.status_type == 'move' &&
          this.client.could_be_move_to.indexOf(stronghold.id) !== -1) ||
        (this.client.status_type == 'battal' &&
          this.curStronghold.route.includes(stronghold.id) &&
          stronghold.ownCountryId != this.user.countryId) ||
        this.user.mapNowId === stronghold.id
      ) {
        classNames += ' show'
      }

      if (stronghold.type == 2) {
        classNames += ' jungle'
      } else {
        classNames += ' castle'
      }

      if (stronghold.is_here) {
        classNames += ' here'
      }

      if (stronghold.is_main) {
        classNames += ' main'
      }

      if (
        this.client.status_type == 'move' &&
        this.client.could_be_move_to.indexOf(stronghold.id) !== -1
      ) {
        classNames += ' moveTo'
      }

      if (
        0 < stronghold.military_strength &&
        stronghold.military_strength < 1000
      ) {
        classNames += ' power0'
      } else if (
        1000 <= stronghold.military_strength &&
        stronghold.military_strength < 5600
      ) {
        classNames += ' power1'
      } else if (
        5600 <= stronghold.military_strength &&
        stronghold.military_strength < 11200
      ) {
        classNames += ' power2'
      } else if (11200 <= stronghold.military_strength) {
        classNames += ' power3'
      }

      return classNames
    },
    showInfoArea: function (type) {
      switch (type) {
        case 0:
          this.ChangeState(['dialog_info', true])
          break
        case 1:
          window.open(
            'http://172.16.20.73:20221/upload/game_instructions.pdf',
            '_blank'
          )
          break
        case 2:
          // this.ChangeState(['dialog_battle_list', true])
          break
      }
    },
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
      this.ChangeState(['dialog', false])
    },
    goDoApi: function () {
      let content: ''
      // console.log(
      //   'goDoApi this.client.dialog_check_curr: ',
      //   this.client.dialog_check_curr
      // )
      switch (this.client.dialog_check_curr.id) {
        case 1002:
          this.actIncreaseSoldier()
          content = ''
          // this.ApiRes({ content: content })
          break
        case 3001:
          this.actEnterCountry()
          content = ''
          // this.ApiRes({ content: content })
          break
        case 3002:
          this.actLeaveCountry()
          content = ''
          // this.ApiRes({ content: content })
          break
        case 5003:
          this.actSearchWild()
          content = ''
          // this.ApiRes({ content: content })
          break
        case 6:
          this.onClickLogout()
          break
        case 5002:
          this.actBattle({ mapId: this.goToCityId })
          break
        case 5001:
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
      const stronghold = this.strongholds[index]
      if (
        this.client.status_type === 'move' &&
        stronghold.id !== this.user.mapNowId
      ) {
        this.goToCityId = stronghold.id
        this.ChangeDialogCheck({ content: '移動到 ' + stronghold.name })
      } else if (
        this.client.status_type === 'battal' &&
        stronghold.id !== this.user.mapNowId
      ) {
        this.goToCityId = stronghold.id
        this.goToCityObj = stronghold
        this.ChangeDialogCheck({ content: '出征 ' + stronghold.name })
      }
      if (this.client.status_type === '') {
        this.goToXY(index)
        this.openMapInfo = true
        this.openMapInfoIdx = index
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
    },
    donotBattle: function () {
      this.ChangeRootState([
        'global',
        'battleAreaPanel',
        { timeOptions: [], mapId: 0 }
      ])
      this.errorText = ''
    }
  }
})
</script>

<style lang="scss" scope>
@keyframes herebg {
  from {
    transform: scale(2);
  }
  to {
    transform: scale(4);
  }
}
@keyframes herebgcastle {
  from {
    transform: scale(3);
  }
  to {
    transform: scale(6);
  }
}
@keyframes herebgcastlemain {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(2);
  }
}

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
          // cursor: url('../assets/images/mouse.png'), pointer;
          .stronghold-area {
            position: relative;
            .here-bg {
              position: absolute;
              z-index: -1;
              bottom: -5px;
              left: -2px;
              display: none;
              img {
                width: 30px;
                animation-name: herebg;
                animation-duration: 2s;
                animation-iteration-count: infinite;
              }
            }
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
            .stronghold-area {
              & > img {
                width: 80px;
              }
              .here-bg {
                left: 28px;
                bottom: 30px;
                img {
                  animation-name: herebgcastle;
                }
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
              .here-bg {
                left: 28px;
                bottom: 40px;
              }
              .stronghold-context {
                display: flex;
                & > img {
                  width: 90px;
                }
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
            .here-bg {
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
    .right-top-area {
      position: fixed;
      right: 0;
      top: 0;
      z-index: 999;
      padding: 30px;
      .btn-group {
        display: flex;
      }
      span {
        opacity: 0.7;
        &:not([disabled]) {
          opacity: 1;
          cursor: pointer;
          // cursor: url('../assets/images/mouse.png'), pointer;
        }
        text-align: center;
        display: inline-block;
        width: 100px;
        .text {
          width: 100px;
          height: 26px;
          background: url('../assets/images/right-top-btn.png') no-repeat center
            center;
          background-size: contain;
          color: #fff;
          font-size: 12px;
          padding-top: 4px;
          display: none;
        }
        &:hover {
          .text {
            display: block;
          }
        }
        &.battle {
          position: relative;
          top: -14px;
          img {
            height: 70px;
          }
        }
      }
      img {
        width: 70px;
        height: 54px;
        margin: 0 auto;
        filter: drop-shadow(0px 0px 4px #cabca6);
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
.bottom-area {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 20;
  width: 100vw;
  .d-flex {
    flex-direction: row-reverse;
  }
  .flex-block {
    width: calc(100% / 3);
  }
  .btn-area {
    width: 200px;
    margin: 0 auto 60px;
    text-align: center;
    .btn-title {
      font-weight: bolder;
      font-size: 18px;
      color: #fff;
      text-shadow: 0 0 10px #272727;
    }
    .btn-info {
      color: #fff;
      text-shadow: 0 0 10px #272727;
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
}
.dialog-card {
  background: url('../assets/images/dialog/bg.png') no-repeat center center;
  background-size: contain;
  height: 380px;
  font-family: '華康行楷體W5';
  font-size: 26px;
  &.v-card {
    .v-card__title {
      padding: 50px 70px !important;
    }
    .v-card__text {
      font-size: 22px;
      text-align: center;
      line-height: 36px;
    }
    .v-card__actions {
      width: 100%;
      position: absolute;
      bottom: 50px;
      padding-right: 50px !important;
    }
    .v-btn {
      font-size: 23px;
    }
  }
}
.dialog_info_area {
  overflow: hidden;
}
.dialog_info {
  position: relative;
  align-items: center;
  justify-content: center;
  height: 90vh;
  &.v-card {
    // background: transparent !important;
    background: #000000a1;
    // border: 2px solid #b69a1c;
    .v-card__title {
      font-family: '華康行楷體W5';
      padding-top: 25px !important;
      padding-bottom: 20px !important;
      font-size: 28px !important;
    }
    .v-card__text {
      height: calc(100% - 78px);
      text-align: center;
      overflow: hidden;
      .v-list {
        background: transparent !important;
      }
      .v-list-item {
        display: inline-block;
        width: calc(50% - 6px);
        margin: 3px;
        background: #1b252aeb;
      }
      .v-list-item__title {
        font-family: '華康行楷體W5';
      }
      .left-list {
        padding-top: 28px;
        flex: 580px 0;
      }
      .right-content {
        height: 100%;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border: 1px solid #6d6d6d;
        .title,
        .link {
          padding: 10px;
          background: #000;
        }
        .title {
          width: 60%;
          font-family: '華康行楷體W5' !important;
          font-size: 32px !important;
          line-height: 32px;
        }
        .link {
          flex-grow: 1;
        }
        .img-area {
          overflow-y: auto;
          height: calc(100% - 66px);
          img {
            width: 100%;
            display: inline-block;
          }
        }
      }
    }
    .v-card__actions {
    }
  }
}

.dialog-battle {
  font-family: '華康行楷體W5';
  .battle-box {
    width: 100%;
    min-width: 1280px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    background: url('../assets/images/公告紙.png') no-repeat center -100px;
    background-size: 111% auto;
    position: relative;
    .battle-team-area {
      position: relative;
    }
    .battle-info-group {
      position: absolute;
      left: 50px;
      top: 70px;
      width: 300px;
      .battle-date {
        width: 100%;
        height: 80px;
        line-height: 78px;
        background: url('../assets/images/btn01.png') no-repeat center center;
        background-size: 100% auto;
        color: #fff;
        padding-left: 35px;
        font-size: 18px;
        font-weight: 500;
      }
      .battle-place {
        color: rgba(0, 0, 0, 0.85);
        font-family: '華康行楷體W5';
        font-size: 66px;
        line-height: 100%;
        letter-spacing: 3px;
        padding-left: 60px;
        margin-top: 30px;
      }
    }
  }
  .battle-top {
    position: relative;
    height: 120px;
    padding-top: 50px;
    margin-left: -40px;
    .battle-info-text {
      position: relative;
      z-index: 1;
      font-size: 32px;
      line-height: 105%;
      text-align: center;
      color: rgb(255, 255, 255) !important;
      span {
        padding: 8px 15px;
        font-family: '華康行楷體W5';
        opacity: 0.8;
        margin: 0 20px;
        border-radius: 6px;
      }
    }
    img {
      position: absolute;
      top: 0;
      left: calc(50% - (980px / 2));
      width: 980px;
      z-index: 0;
    }
  }
  .soldier-group {
    width: 100%;
    height: 50px;
    line-height: 40px;
    font-size: 20px;
    background: url('../assets/images/soldier.png') no-repeat 60px -6px rgba(0, 0, 0, 0.6);
    background-size: auto 40px;
    text-align: left;
    padding-left: 100px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 2;
    color: #fff;
  }
  .field-block {
    position: relative;
    .vs-img {
      position: absolute;
      left: calc(50% + 20px);
      top: calc(50% - (256px / 2) - 20px);
      z-index: 4;
      opacity: 0.8;
    }
  }
  .type {
    width: 60px;
    position: absolute;
    left: calc(50% - (60px / 2));
    top: 30px;
    z-index: 1;
  }
  .field-group {
    position: relative;
    width: calc(265px * 2);
    &.other-group {
      margin: 0 auto;
      width: 265px;
      margin-right: 80px;
    }
    .user-group {
      text-align: center;
      .user-block {
        display: inline-block;
        width: 265px;
        position: relative;
        text-align: center;
        margin: 10px 0;
        .user {
          background: #9b9b9b;
          position: absolute;
          top: 0;
          left: calc(50% - (245px / 2));
          width: 245px;
          height: 291px;
          overflow: hidden;
          text-align: center;
          img {
            z-index: 2;
            width: 291px;
            position: relative;
            left: calc(50% - (291px / 2));
          }
        }
        .bd {
          width: 245px;
          position: relative;
          left: calc(50% - (245px / 2));
          img {
            position: relative;
            z-index: 3;
          }
          .country-name,
          .user-name {
            position: absolute;
            font-family: '華康行楷體W5';
            z-index: 4;
          }
          .country-name {
            font-size: 50px;
            top: 20px;
            left: 8px;
            line-height: 100%;
            letter-spacing: -5px;
            text-shadow: 0 0 5px #000;
          }
          .user-name {
            top: 0;
            right: 10px;
            height: 100%;
            width: 65px;
            background: url('../assets/images/bg02.png') no-repeat center 25px;
            background-size: 108%;
            .type {
              font-size: 60px;
              line-height: 60px;
              color: rgb(245, 245, 245);
              text-shadow: 0px 0px 5px rgb(255, 255, 255);
            }
            .name-text {
              font-size: 28px;
              line-height: 60px;
              margin-top: 90px;
              margin-bottom: 50px;
              letter-spacing: 2px;
              height: calc(100% - 140px);
            }
            .user-name-bg {
              top: 0;
              right: 0px;
              height: 100%;
              width: auto;
            }
          }
        }
        .bd-bg {
          mask: url('../assets/images/border02.png') no-repeat center center;
          width: 100%;
          height: 291px;
          position: absolute;
          top: 0;
        }

        img {
          display: inline-block;
          width: 100%;
        }
      }
    }
    &.attack-group {
      margin-right: 40px;
      .user-group {
        .user-name {
          .type {
            color: rgb(192, 48, 48) !important;
            margin-top: 3px;
            font-size: 55px !important;
          }
        }
      }
    }
    &.defence-group {
      margin-right: 40px;
      margin-left: 350px;
      .user-group {
        .user-name {
          .type {
            color: #2225b1 !important;
            margin-top: 3px;
            font-size: 55px !important;
          }
        }
      }
    }
  }
  .field-bg {
    height: 100%;
    width: 100%;
  }
}
</style>
