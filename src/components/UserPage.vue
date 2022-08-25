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
        src="/images/map.jpg"
        alt=""
        :style="{
          transform: `translate(${viewX}px, ${viewY}px)`,
          transition: 'transform 0.1s linear'
        }"
      />
      <div class="user-area">
        <div class="user-info">
          <div class="img-area d-inline-block" @click="onClickHeadImage">
            <img
              v-if="currUser.code"
              class="user-img"
              :src="getUserImgUrl()"
              alt=""
            />
            <img class="img-border" src="/images/人物頭像框.png" alt="" />
          </div>
          <div class="info-area">
            <div class="info-content">
              <img class="flag flag-border" src="/images/旗幟_外.png" alt="" />
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
                <img src="/images/旗幟_內.png" alt="" />
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
                    ><span class="type w-33-pct"
                      >{{ currUser.roleName
                      }}<i
                        class="role_type"
                        v-if="
                          currUser.occupationId > 0 &&
                          global.occupationMap[currUser.occupationId]
                        "
                        >{{
                          global.occupationMap[currUser.occupationId].name
                        }}</i
                      ></span
                    >
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
            <v-checkbox
              v-model="showBattles"
              label="顯示戰役"
              color="orange darken-3"
              hide-details
            ></v-checkbox>
          </div>
        </div>
      </div>
      <div class="right-top-area">
        <div class="btn-group">
          <span class="battle" :disabled="false" @click="showInfoArea(2)">
            <img src="/images/戰役.png" alt="" />
            <div class="text">戰役</div>
          </span>
          <span class="battle" :disabled="false" @click="showInfoArea(3)">
            <img src="/images/競賽說明.png" alt="" />
            <div class="text">競賽說明</div>
          </span>
          <span class="notice" @click="showInfoArea(0)">
            <img src="/images/公告.png" alt="" />
            <div class="text">活動公告</div>
          </span>
          <span class="game-book" @click="showInfoArea(1)">
            <img src="/images/說明書.png" alt="" />
            <div class="text">遊戲說明</div>
          </span>
        </div>
      </div>
      <div class="notification-area">
        <v-tabs class="tab" v-model="tab">
          <v-tab key="notifications">公開事件</v-tab>
          <v-tab key="domesticMessages">國內事件</v-tab>
        </v-tabs>
        <div class="list-group px-3-px">
          <div
            class="list d-flex"
            v-for="(notice, index) in notices"
            :key="index"
          >
            <span>{{ notice[0] }}</span>
            <span>{{ notice[1] }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-btn-area" v-if="client.status_type != ''">
        <div class="btn-title">
          請選擇{{ client.dialog_check_curr.key }}目的地
        </div>
        <div v-if="client.status_type == 'move'" class="btn-info">
          只能在勢力所在據點間移動
        </div>
        <v-btn block dark @click="cencel()">取消</v-btn>
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
              <img
                v-if="showBattles && stronghold.is_fire"
                class="battle-icon"
                src="/images/battle.png"
                alt=""
              />
              <div class="here-bg">
                <img src="/images/黃框.png" alt="" />
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
              <div v-if="showCityDetails" class="horse">
                <div class="img"></div>
              </div>
              <img
                v-if="stronghold.type == 1"
                :src="
                  '/images/' +
                  (stronghold.is_main ? 'castle_main' : 'castle') +
                  '.png'
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
                    ><span><img src="/images/浪人icon.png" alt="" /></span>
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
        <v-card-title
          :class="{ 'h-80-px': !client.dialog_check_input_name }"
        ></v-card-title>
        <v-card-text>
          <div v-html="client.dialog_check_content.content"></div>
          <div class="px-30-px mt-2" v-if="client.dialog_check_input_name">
            {{ client.dialog_check_input_name }}
            <v-row>
              <v-col class="pr-4">
                <v-slider
                  v-model="goToBattleSoldier"
                  class="align-center"
                  :max="currUser.soldier"
                  :min="battalSoldierMin"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="goToBattleSoldier"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      :max="currUser.soldier"
                      :min="battalSoldierMin"
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
          <v-btn class="ml-50-px" color="green darken-1" text @click="cencel()">
            否
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="goDoApi()"> 是 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="client.dialog" persistent width="500">
      <v-card dark class="dialog-card req-dialog">
        <!-- <v-img
          v-if="client.dialog_content.img"
          :src="require('/images/dialog/' + client.dialog_content.img)"
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
        <v-card-title
          v-if="goToCityObj.conutry"
          :style="{
            background: goToCityObj.conutry.color,
            color: goToCityObj.conutry['t_color']
          }"
          >{{ goToCityObj.name }} 守方勢力 {{ goToCityObj.conutry.name }}
        </v-card-title>
        <v-card-text>
          <div class="pt-20-px">
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
                  :max="currUser.soldier"
                  :min="battalSoldierMin"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="goToBattleSoldier"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      :max="currUser.soldier"
                      :min="battalSoldierMin"
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
                  '/images/active/' +
                  this.leftList[this.selectedItem].title +
                  '活動海報.jpg'
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
        <v-toolbar class="toolbar" flat dark>
          <v-tabs v-if="!selectedMapInfo" dark v-model="battleTypeTab">
            <v-tab><v-toolbar-title> 未來戰役 </v-toolbar-title></v-tab>
            <v-tab><v-toolbar-title> 待判戰役 </v-toolbar-title></v-tab>
            <v-tab><v-toolbar-title> 歷史戰役 </v-toolbar-title></v-tab>
          </v-tabs>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="ChangeState(['dialog_battle_list', false])">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title></v-card-title>
        <v-card-text v-if="battleTypeTab != 2">
          <template v-for="(battlefield, index) in battlefieldList">
            <div class="battle-box" :key="index">
              <div class="battle-info-group">
                <div
                  class="battle-date"
                  @click="onClickBattleDate(battlefield.map.id)"
                >
                  競賽日
                  {{ moment(battlefield.timestamp).format('YYYY-MM-DD HH:mm') }}
                </div>
                <div
                  v-if="
                    battlefield.map.is_main &&
                    battlefield.map.conutry.id == currUser.countryId &&
                    (currUser.role == 1 || currUser.occupationId > 0)
                  "
                  class="grey darken-4 p-10-px"
                >
                  開放選擇競賽項目截止時間<br />
                  {{
                    moment(battlefield.timestamp)
                      .subtract(3, 'days')
                      .format('YYYY-MM-DD HH:mm')
                  }}
                  <v-overflow-btn
                    class="my-2"
                    :disabled="
                      battlefield.timestampLimit < dateFormat ||
                      battlefield.gameId > 0
                    "
                    :items="beAbleToSelectGameList(battlefield)"
                    item-text="name"
                    item-value="id"
                    label="選擇競賽項目"
                    dense
                    dark
                    hide-details
                    @change="selectGame(battlefield, $event)"
                  ></v-overflow-btn>
                </div>
                <div class="battle-place flag-vertical">
                  <div>{{ battlefield.map.name }}之戰</div>
                  <div
                    v-if="battlefield.gameId > 0"
                    class="fz-22-px mt-80-px grey--text text--darken-1"
                  >
                    {{ battlefield.game.name }}
                  </div>
                </div>
              </div>
              <div class="battle-top text-center">
                <div class="battle-info-text">
                  <div class="area area-l flex-row-reverse">
                    <span
                      class="country-name"
                      :style="{
                        color: battlefield.attackCountry.color[1],
                        background: battlefield.attackCountry.color[0]
                      }"
                      >{{ battlefield.attackCountry.name }}</span
                    >
                    <span>{{ battlefield.attackSoldierTotal }}</span>
                  </div>
                  <div class="area area-c">VS</div>
                  <div class="area area-r">
                    <span
                      class="country-name"
                      :style="{
                        color: battlefield.defenceCountry.color[1],
                        background: battlefield.defenceCountry.color[0]
                      }"
                      >{{ battlefield.defenceCountry.name }}</span
                    >
                    <span>{{ battlefield.defenceSoldierTotal }}</span>
                  </div>
                </div>
                <span
                  class="d-inline-block px-10-px py-6-px posi-re fz-16-px"
                  :z-index="3"
                  >※ 【攻方】總兵力於截止時間結算小於【守方】直接戰敗 ※</span
                >
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
                      <div
                        class="user-group"
                        :class="{
                          overtime: battlefield.timestamp < dateFormat,
                          'curr-user-judge':
                            battlefield.timestamp < dateFormat &&
                            battlefield.judgeId == currUser.id
                        }"
                        @click="
                          whoIsWinner(
                            battlefield,
                            battlefield[type + 'Country']
                          )
                        "
                      >
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
                                :src="'/images/user/' + user.code + '.png'"
                                alt=""
                              />
                            </div>
                            <div class="bd">
                              <img :src="'/images/border03.png'" alt="" />
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
                                <div
                                  v-if="user"
                                  class="name-text flag-vertical"
                                >
                                  {{ user.nickname }}
                                </div>
                              </div>
                              <div v-if="!user && battlefield" class="join-btn">
                                <v-btn
                                  :disabled="
                                    disabledBattlefieldJoinBtn(
                                      battlefield,
                                      'join',
                                      type
                                    )
                                  "
                                  class="fz-16-px"
                                  @click="joinBattleBtn(battlefield, u_i)"
                                  >加入</v-btn
                                >
                                <div class="limit-time">
                                  截止時間<br />{{ battlefield.timestampLimit }}
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
                  <img class="vs-img" src="/images/vs.png" />
                </div>
                <div class="field-group other-group">
                  <div class="user-group">
                    <div
                      class="user-block"
                      v-for="(type, key) in client.battle_worker_type"
                      :key="key"
                    >
                      <div v-if="battlefield[key].id" class="user">
                        <div
                          class="bd-bg"
                          :style="{
                            background: battlefield[key].country.color[0]
                          }"
                        ></div>
                        <img
                          :src="
                            '/images/user/' + battlefield[key].code + '.png'
                          "
                          alt=""
                        />
                      </div>
                      <div class="bd">
                        <img :src="'/images/border03.png'" alt="" />
                        <div
                          v-if="battlefield[key]"
                          class="country-name"
                          :style="{
                            color: battlefield[key].country.color[0]
                          }"
                        >
                          {{ battlefield[key].country.name }}
                        </div>
                        <div class="user-name">
                          <div class="type">
                            {{ type[0] }}
                          </div>
                          <div
                            v-if="battlefield[key]"
                            class="name-text flag-vertical"
                          >
                            {{ battlefield[key].nickname }}
                          </div>
                        </div>
                        <div
                          v-if="battlefield[key + 'Id'] == 0"
                          class="join-btn"
                        >
                          <v-btn
                            :disabled="
                              disabledBattlefieldJoinBtn(
                                battlefield,
                                'be',
                                type
                              )
                            "
                            class="fz-16-px"
                            @click="joinBattleWorkerBtn(battlefield, type)"
                            >擔任</v-btn
                          >
                          <div class="limit-time">
                            截止時間<br />{{ battlefield.timestampLimit }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="battlefieldList.length == 0">
            <div class="fz-48-px text-center text--darken-1 grey--text">
              空空如也
            </div>
          </template>
        </v-card-text>
        <v-card-text v-if="battleTypeTab == 2">
          <template>
            <v-simple-table
              v-if="battleDetailCurrId == 0"
              class="battle-records-table"
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">戰役發生日期</th>
                    <th class="text-left">戰役名稱</th>
                    <th class="text-left">勝利勢力</th>
                    <th class="text-left">攻擊方</th>
                    <th class="text-left">防守方</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in battleRecords"
                    :key="item.id"
                    @click="clickBattleRecord({ battleId: item.id })"
                  >
                    <td>{{ item.date }}</td>
                    <td>{{ item.mapName }}之戰</td>
                    <td>{{ item.winnerCountryName }}</td>
                    <td>{{ item.attackCountryName }}</td>
                    <td>{{ item.defenceCountryName }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div
              v-if="
                battleDetailCurrId != 0 &&
                battleDetailCurrId == battleRecordDetails.id
              "
              class="battle-box"
            >
              <div class="battle-info-group">
                <div class="battle-date">
                  競賽日
                  {{
                    moment(battleRecordDetails.timestamp).format(
                      'YYYY-MM-DD HH:mm'
                    )
                  }}
                </div>
                <div class="battle-place flag-vertical">
                  <div>{{ battleRecordDetails.map.name }}之戰</div>
                  <div
                    v-if="battleRecordDetails.gameId > 0"
                    class="fz-22-px mt-80-px grey--text text--darken-1"
                  >
                    {{ battleRecordDetails.game.name }}
                  </div>
                </div>
              </div>
              <div class="battle-top text-center">
                <div class="battle-info-text">
                  <v-btn icon dark @click="battleDetailCurrId = 0">
                    <v-icon>mdi-reply</v-icon>
                  </v-btn>
                  <div class="area area-l flex-row-reverse">
                    <span>勝利！</span>
                    <span
                      class="country-name"
                      :style="{
                        color: battleRecordDetails.attackCountry.color[1],
                        background: battleRecordDetails.attackCountry.color[0]
                      }"
                      >{{ battleRecordDetails.attackCountry.name }}</span
                    >
                    <!-- <span>{{ battleRecordDetails.attackSoldierTotal }}</span> -->
                  </div>
                  <!-- <div class="area area-c">VS</div>
                  <div class="area area-r">
                    <span
                      class="country-name"
                      :style="{
                        color: battleRecordDetails.defenceCountry.color[1],
                        background: battleRecordDetails.defenceCountry.color[0]
                      }"
                      >{{ battleRecordDetails.defenceCountry.name }}</span
                    >
                    <span>{{ battleRecordDetails.defenceSoldierTotal }}</span>
                  </div> -->
                </div>
                <!-- <span
                  class="d-inline-block px-10-px py-6-px posi-re fz-16-px"
                  :z-index="3"
                  >※ 【攻方】總兵力於截止時間結算小於【守方】直接戰敗 ※</span
                > -->
              </div>
              <div class="d-flex field-block">
                <div class="battle-team-area d-flex">
                  <template v-for="(type, type_i) in battleType">
                    <div
                      v-if="battleRecordDetails[type + 'Country']"
                      class="field-group"
                      :class="[type + '-group']"
                      :key="type_i"
                    >
                      <div
                        class="user-group"
                        :class="{
                          winner:
                            battleRecordDetails.winId ==
                            battleRecordDetails[type + 'Country'].id
                        }"
                      >
                        <template>
                          <div
                            class="user-block"
                            v-for="(user, u_i) in battleRecordDetails[
                              type + 'Users'
                            ]"
                            :key="u_i"
                          >
                            <div class="user">
                              <div
                                class="bd-bg"
                                :style="{
                                  background:
                                    battleRecordDetails[type + 'Country']
                                      .color[0]
                                }"
                              ></div>
                              <img
                                v-if="user"
                                :src="'/images/user/' + user.code + '.png'"
                                alt=""
                              />
                            </div>
                            <div class="bd">
                              <img :src="'/images/border03.png'" alt="" />
                              <div
                                class="country-name"
                                :style="{
                                  color:
                                    battleRecordDetails[type + 'Country']
                                      .color[0]
                                }"
                              >
                                {{ battleRecordDetails[type + 'Country'].name }}
                              </div>
                              <div class="user-name">
                                <div class="type">
                                  {{ type == 'defence' ? '守' : '攻' }}
                                </div>
                                <div
                                  v-if="user"
                                  class="name-text flag-vertical"
                                >
                                  {{ user.nickname }}
                                </div>
                              </div>
                              <div
                                v-if="battleRecordDetails"
                                class="soldier-group"
                              >
                                {{ battleRecordDetails[type + 'Soldier'][u_i] }}
                                <span style="color: red">
                                  -
                                  {{
                                    battleRecordDetails[type + 'SoldierLoses'][
                                      u_i
                                    ]
                                  }}</span
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                  <img class="vs-img" src="/images/vs.png" />
                </div>
                <div class="field-group other-group">
                  <div class="user-group">
                    <div
                      class="user-block"
                      v-for="(type, key) in client.battle_worker_type"
                      :key="key"
                    >
                      <div v-if="battleRecordDetails[key].id" class="user">
                        <div
                          class="bd-bg"
                          :style="{
                            background:
                              battleRecordDetails[key].country.color[0]
                          }"
                        ></div>
                        <img
                          :src="
                            '/images/user/' +
                            battleRecordDetails[key].code +
                            '.png'
                          "
                          alt=""
                        />
                      </div>
                      <div class="bd">
                        <img :src="'/images/border03.png'" alt="" />
                        <div
                          v-if="battleRecordDetails[key]"
                          class="country-name"
                          :style="{
                            color: battleRecordDetails[key].country.color[0]
                          }"
                        >
                          {{ battleRecordDetails[key].country.name }}
                        </div>
                        <div class="user-name">
                          <div class="type">
                            {{ type[0] }}
                          </div>
                          <div
                            v-if="battleRecordDetails[key]"
                            class="name-text flag-vertical"
                          >
                            {{ battleRecordDetails[key].nickname }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="battleRecords.length == 0">
            <div class="fz-48-px text-center text--darken-1 grey--text">
              空空如也
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog dark v-model="openMapInfo" width="600">
      <v-card class="dialog-map-info">
        <template v-if="selectedMapInfo">
          <v-toolbar
            flat
            dark
            :style="{
              background: selectedMapInfo.ownCountry.color[0],
              color: selectedMapInfo.ownCountry.color[1]
            }"
          >
            <v-toolbar-title v-if="selectedMapInfo.name" class="d-block">
              <span>{{ selectedMapInfo.name }}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="openMapInfo = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="py-15-px">
            <v-card-subtitle class="grey--text"
              >據點資訊<span
                style="font-size: 12px; padding: 2px 16px; float: right"
              >
                屬性: {{ selectedMapInfo.gameTypes.join(',') }}</span
              ></v-card-subtitle
            >
            <v-divider class="mb-10-px"></v-divider>
            <table class="map-info-table">
              <tr>
                <th>基本抵禦力</th>
                <th>
                  {{ selectedMapInfo.basicDefense }}
                </th>
                <th>總兵力</th>
                <th>
                  {{
                    selectedMapInfo.userdata
                      .filter(
                        (u) => u.countryId == selectedMapInfo.ownCountryId
                      )
                      .reduce((a, b) => a + b.soldier, 0)
                  }}
                </th>
              </tr>
              <template v-if="selectedMapInfo.basicInfos">
                <tr
                  v-for="(info, idx) in selectedMapInfo.basicInfos"
                  :key="`${selectedMapInfo.id}_${idx}`"
                >
                  <th>{{ info.name }}</th>
                  <th v-text="info.value"></th>
                  <th>{{ constructionName[info.cons] }}</th>
                  <th>LV {{ info._lv }}</th>
                </tr>
              </template>
            </table>
            <template v-if="battlefields[selectedMapInfo.id]">
              <v-card-subtitle class="grey--text mt-15-px"
                >戰役資訊</v-card-subtitle
              >
              <v-divider class="mb-10-px"></v-divider>
              <div class="battle-info">
                <span class="battle-btn"
                  ><img src="/images/battle.png" alt=""
                /></span>
                <span
                  >{{ battlefields[selectedMapInfo.id].timestamp }} 勢力【{{
                    battlefields[selectedMapInfo.id].attackCountry.name
                  }}】 將對此據點發動戰爭。</span
                >
                <v-btn small @click="showInfoArea(2)">查看</v-btn>
              </div>
            </template>
            <v-card-subtitle class="grey--text mt-15-px"
              >在據點中的人員名冊</v-card-subtitle
            >
            <v-divider class="mb-10-px"></v-divider>
            <span
              class="user-blcok"
              v-for="uu in selectedMapInfo.userdata"
              :key="uu.id"
              :class="{ captived: !!uu.captiveDate }"
            >
              <span class="title-name">{{ uu.occupation }}</span>
              <span class="user-name" :title="uu.code">{{ uu.nickname }}</span>
              <span class="user-other-info">( {{ uu.soldier }} )</span>
            </span>
          </v-card-text>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog dark v-model="client.dialog_level_up_city" width="600">
      <v-card class="dialog-level-up-city ff-wkw5">
        <template>
          <v-toolbar
            flat
            dark
            :style="{
              background: currUser.countryColors,
              color: currUser.countryColorsT
            }"
          >
            <v-toolbar-title v-if="currUser.mapNowName" class="d-block">
              {{ currUser.mapNowName }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              icon
              dark
              @click="ChangeState(['dialog_level_up_city', false])"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="py-15-px">
            <v-card
              :color="item.color"
              dark
              v-for="(item, key) in constructionName"
              :key="key"
              class="d-inline-block ff-wkw5 ma-1-pct construction"
              elevation="0"
              width="48%"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <v-avatar class="ma-3" size="125" tile>
                  <v-img :src="'/images/' + key + '.png'"></v-img>
                </v-avatar>
                <div v-if="currUser.mapNowCity">
                  <v-card-title
                    class="ff-wkw5 fz-32-px"
                    v-text="item"
                  ></v-card-title>
                  <v-card-subtitle
                    >LV
                    {{
                      currUser.mapNowCity.jsonConstruction[key].lv
                    }}</v-card-subtitle
                  >

                  <v-card-actions>
                    <v-btn
                      v-if="currUser.mapNowCity.jsonConstruction[key].lv < 10"
                      class="ml-2 mt-5 ff-wkw5 fz-16-px"
                      outlined
                      small
                      @click="
                        actLevelUpCity({
                          cityId: currUser.mapNowCityId,
                          constructionName: key
                        })
                      "
                    >
                      升級
                    </v-btn>
                  </v-card-actions>
                  <v-card-subtitle
                    v-if="currUser.mapNowCity.jsonConstruction[key].lv < 10"
                    class="grey--text"
                    >下一級需要
                    <br />
                    {{
                      (currUser.mapNowCity.jsonConstruction[key].lv + 1) * 300
                    }}
                    黃金</v-card-subtitle
                  >
                </div>
              </div>
            </v-card>
          </v-card-text>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog v-model="client.dialog_gc_selection" width="600">
      <DailogGCSection />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
// import router from '@/router'
// import client from '@/store/client'
// import client from '@/store/client'
import enums from '@/unit/enum'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import DailogGCSection from '@/components/DailogGCSelection.vue'

export default Vue.extend({
  name: 'UserPage',
  data: () => ({
    date: new Date(),
    battleTypeTab: 0,
    tab: 0,
    // inCurrStrongholdIndex: '',
    _mouse_dataset: {},
    viewX: 0,
    viewY: 0,
    errorText: '',
    goToCityId: 0,
    goToCityObj: {},
    goToBattleTime: -1,
    goToBattleSoldier: 0,
    showBattles: localStorage.getItem('show_battles') === 'true',
    showCityDetails: localStorage.getItem('show_city_details') === 'true',
    showCountyDetails: localStorage.getItem('show_country_details') === 'true',
    showRoninDetails: localStorage.getItem('show_ronin_details') === 'true',
    infoTypeNow: 0,
    curStronghold: {},
    constructionName: enums.CHINESE_CONSTRUCTION_NAMES,
    numCN: [
      '壹',
      '貳',
      '叁',
      '肆',
      '伍',
      '陸',
      '柒',
      '捌',
      '玖',
      '拾',
      '壹拾壹',
      '壹拾貳',
      '壹拾叁',
      '壹拾肆'
    ],
    selectedItem: 2,
    leftList: [
      {
        title: '群雄割據',
        date: '一月二十四日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBsVWpYGhTV56l0dRiQqBceROWzDRnA',
        disabled: false,
        hasImg: true
      },
      {
        title: '萬箭齊發',
        date: '四月一日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nra5tiN6BmPCC9aYX3APBe3Be6Dgd9Tg',
        disabled: false,
        hasImg: true
      },
      {
        title: '官渡之戰',
        date: '九月',
        img: '',
        link: 'http://172.16.20.73:20221/upload/官渡之戰.pdf',
        disabled: false,
        hasImg: true
      },
      {
        title: '知己知彼',
        date: '十月十五日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBxWlzg4HdV9UVYeYSCS6GWGu6tMpte',
        link_res: '',
        disabled: true,
        hasImg: true
      },
      {
        title: '四面楚歌',
        date: '十一月二十五日',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwt3iGDhu30Kf0LGLniSrcc47a22W5',
        disabled: true,
        hasImg: true
      },
      {
        title: '睿訊群英傳結算',
        date: '十二月',
        img: '',
        link: 'https://rv.rv88.tw/office/oo/r/nsBwhtxoE2kTWi2YHK8xVnXW3lRR9akW',
        disabled: true,
        hasImg: true
      }
    ],
    battleType: ['attack', 'defence'],
    battleOtherUser: ['judge', 'toolman'],
    defaultColor: ['#A1A1A1', '#000'],
    openMapInfo: false,
    openMapInfoIdx: -1,
    storage: {},
    formateStr: 'YYYY-MM-DD HH-mm',
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
      9: '_4',
    },
    setWiner: {},
    setGame: {},
    battleDetailCurrId: 0
  }),

  computed: {
    ...mapState(['user', 'global', 'client', 'info']),
    ...mapGetters(['getUser']),
    dateFormat: function () {
      return this.$moment(this.date).format(this.formateStr)
    },
    notices: function () {
      const tabs = ['notifications', 'domesticMessages']
      const notices = JSON.parse(JSON.stringify(this.global[tabs[this.tab]]))

      for (const i in notices) {
        const curr = notices[i]
        curr[0] = this.$moment(curr[0]).format('YYYY-MM-DD HH:mm')
      }
      return notices
    },
    countries: function () {
      const countries = JSON.parse(JSON.stringify(this.global.countries))
      const maps = JSON.parse(JSON.stringify(this.global.maps))

      for (const i in countries) {
        const curr = countries[i]
        curr.color = curr.color.split(',')
        curr.cityNum = 0
        for (const j in maps) {
          const currMap = maps[j]
          if (currMap.cityId > 0 && currMap.ownCountryId == curr.id) {
            curr.cityNum += 1
          }
        }
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
          : { color: this.defaultColor, name: '無' }
      }

      return users
    },
    battlefields: function () {
      const battles = JSON.parse(JSON.stringify(this.global.battlefieldMap))

      for (const i in battles) {
        battles[i] = this.setBattleFieldData(battles[i])
      }
      return battles
    },
    battlefieldList: function () {
      const newBattles = []
      const battles = JSON.parse(JSON.stringify(this.battlefields))
      for (const i in battles) {
        const curr = battles[i]
        if (this.selectedMapInfo) {
          if (curr.mapId == this.selectedMapInfo.id) {
            newBattles.push(curr)
            break
          }
        } else {
          if (this.battleTypeTab == 0 && curr.timestamp >= this.dateFormat) {
            newBattles.push(curr)
          } else if (
            this.battleTypeTab == 1 &&
            curr.timestamp < this.dateFormat
          ) {
            newBattles.push(curr)
          }
        }
      }
      return newBattles
    },
    battalSoldierMin: function () {
      let min = 0
      if (this.currUser.soldier != 0) {
        switch (this.client.dialog_check_curr.id) {
          case 5002:
            min = 1000
            break
          case 9002:
            min = 1
            break
        }
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
      const battles = Object.values(
        JSON.parse(JSON.stringify(this.global.battlefieldMap))
      )
      const result = state.global.maps
        ? state.global.maps.map((m: any) => {
            const cid = m.ownCountryId
            const country = state.global.countries.find((e) => e.id === cid)
            const cname = country ? country.name : '空'
            const colors = country
              ? Array.isArray(country.color)
                ? country.color
                : country.color.split(',')
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
              is_fire: battles.find((e: any) => e.mapId == m.id) ? true : false,
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
    selectedMapInfo: function () {
      const _maps = JSON.parse(JSON.stringify(this.global.maps))
      if (this.openMapInfoIdx == -1) {
        return false
      }
      const _map = _maps[this.openMapInfoIdx]

      if (!_map) return null

      const _city = this.global.cities.find((c) => c.id == _map.cityId)
      const _country = JSON.parse(JSON.stringify(this.countries)).find(
        (c) => c.id == _map.ownCountryId
      )
      const _occupationMap = this.global.occupationMap

      const userdata = this.global.users
        .filter((u) => u.mapNowId == _map.id)
        .map((u) => {
          const occ = _occupationMap[u.occupationId]
          let occupation = '浪人'
          switch (u.role) {
            case 1:
              occupation = '主公'
              break
            case 2:
              occupation = occ ? occ.name : '武將'
              break
            case 3:
              occupation = '浪人'
              break
            default:
          }
          if (u.captiveDate) {
            occupation += '(俘虜)'
          }
          return { ...u, occupation }
        })

      const basicInfos =
        _map.ownCountryId > 0 && _city
          ? [
              {
                cons: 'barrack',
                name: '徵兵量',
                _lv: _city.jsonConstruction.barrack.lv,
                value: `${
                  100 + Number(_city.jsonConstruction.barrack.lv) * 10
                } - ${
                  300 +
                  _maps.filter(
                    (m) => m.cityId > 0 && m.ownCountryId == _map.ownCountryId
                  ).length *
                    15 +
                  Number(_city.jsonConstruction.barrack.lv) * 10
                }`
              },
              {
                cons: 'market',
                name: '商業收益',
                _lv: _city.jsonConstruction.market.lv,
                value: `${
                  50 +
                  _city.addResource +
                  Number(_city.jsonConstruction.market.lv) * 6
                } - ${
                  150 +
                  _city.addResource +
                  Number(_city.jsonConstruction.market.lv) * 6
                }`
              },
              {
                cons: 'stable',
                name: '移動消耗減免',
                _lv: _city.jsonConstruction.stable.lv,
                value: Number(_city.jsonConstruction.stable.lv)
              },
              {
                cons: 'wall',
                name: '防禦損兵減少量',
                _lv: _city.jsonConstruction.wall.lv,
                value: `${
                  0 + Number(_city.jsonConstruction.wall.lv) * 0.09 * 100
                }%`
              }
            ]
          : []

      const ownCountry =
        _map.ownCountryId > 0 ? _country : { color: this.defaultColor }

      userdata.sort((a, b) =>
        a.role == b.role ? b.soldier - a.soldier : a.role - b.role
      )

      const basicDefense =
        _map.ownCountryId > 0 && _city
          ? 1000 + 900 * _city.jsonConstruction.wall.lv
          : 1000

      const city = _city
      !Array.isArray(ownCountry.color) &&
        (ownCountry.color = ownCountry.color.split(','))

      // const battle = this.battlefields[_map.id] ? this.battlefields[_map.id] : false
      const gameTypes = String(_map.gameType)
        .split('')
        .map((t) => enums.CHINESE_GAMETYPE_NAMES[t])

      return {
        ..._map,
        userdata,
        basicInfos,
        ownCountry,
        city,
        gameTypes,
        basicDefense
        // battle
      }
    },
    currUser: function () {
      const user = JSON.parse(JSON.stringify(this.getUser()))
      // const battlefields = JSON.parse(JSON.stringify(this.battlefields))
      const battles = Object.values(this.battlefields)
      user.alreadeyWorking = false
      user.alreadyJoined = user.mapTargetId > 0
      battles.map((battle: any) => {
        if ([battle.judgeId, battle.toolmanId].includes(user.id)) {
          user.alreadeyWorking = true
        }
      })
      // let userIds = []

      // for (const i in battlefields) {
      //   const curr = battlefields[i]
      //   userIds = [].concat(curr.atkUserIds, curr.defUserIds, [
      //     curr.judgeId,
      //     curr.toolmanI
      //   ])
      // }
      // if (userIds.includes(user.id)) {
      //   user.alreadyJoined = true
      // }
      return user
    },
    today: function () {
      const curr = this.$moment()
      const days = ['日', '一', '二', '三', '四', '五', '六']
      return [curr.format('YYYY年 MM月 DD日 星期'), days[curr.day()]]
    },
    battleRecordDetails: function () {
      let detail = JSON.parse(JSON.stringify(this.global.battleRecordDetails))
      if (detail.id != 0) {
        detail = this.setBattleFieldData(detail)
      }
      return detail
    },
    battleRecords: function () {
      const records = JSON.parse(JSON.stringify(this.global.warRecords))
      for (const i in records) {
        const record = records[i]
        record.attackCountryId = record.attackCountryIds[0]
        const attackCountry = this.countries.find(
          (e) => e.id == record.attackCountryId
        )
        record.attackCountryName = attackCountry ? attackCountry.name : ''
        const defenceCountry = this.countries.find(
          (e) => e.id == record.defenceCountryId
        )
        record.defenceCountryName = defenceCountry ? defenceCountry.name : ''
        const winnerCountry = this.countries.find(
          (e) => e.id == record.winnerCountryId
        )
        record.winnerCountryName = winnerCountry ? winnerCountry.name : ''
        const map = this.global.maps.find((e) => e.id == record.mapId)
        record.mapName = map ? map.name : ''

        record.date = this.$moment(record.timestamp).format('YYYY-MM-DD HH:mm')
      }
      return records
    }
  },

  watch: {
    currUser: {
      handler: function (val, oldVal) {
        if (val && val.mapNowIndex !== -1) {
          if (!oldVal || oldVal.mapNowIndex != val.mapNowIndex) {
            this.goToXY(val.mapNowIndex)
          }
        }
      },
      deep: true,
      immediate: true
    },
    showBattles: function (val) {
      localStorage.setItem('show_battles', val)
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
    openMapInfo: function (val) {
      if (!val) {
        this.openMapInfoIdx = -1
      }
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
      if (parseInt(val) !== 0) {
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

  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
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
      'actRaiseCountry',
      'actEscape',
      'actBusiness',
      'ApiRes',
      'actBattle',
      'actLevelUpCity',
      'actBattleJoin',
      'actBattleJudge',
      'actSelectGame',
      'getWarRecord'
    ]),
    getUserImgUrl: function () {
      const user = this.currUser
      const useUserKey = user.occupationId > 0 ? 'occupationId'  : 'role'
      const mapObj = this[useUserKey + 'MapObj']
      return '/images/user/' +
                user.code +
                mapObj[user[useUserKey]] +
                '.png'
    },
    clickBattleRecord: function (data) {
      this.battleDetailCurrId = data.battleId
      this.getWarRecord(data)
    },
    setBattleFieldData: function (data) {
      // console.log(data)
      const games = JSON.parse(JSON.stringify(this.global.gameMap))
      const countries = JSON.parse(JSON.stringify(this.countries))
      const users = JSON.parse(JSON.stringify(this.users))
      const strongholds = JSON.parse(JSON.stringify(this.strongholds))
      const currDate = this.$moment(data.timestamp)
      data.timestamp = currDate.format('YYYY-MM-DD HH:mm')
      data.timestampLimit = currDate
        .subtract(3, 'days')
        .format('YYYY-MM-DD HH:mm')

      data.game = games[data.gameId] ? games[data.gameId] : {}

      data.attackCountry = countries.find((item) => {
        return item.id == data.attackCountryIds[0]
      })
      data.attackUsers = []
      for (const u in data.atkUserIds) {
        const currUserId = data.atkUserIds[u]
        data.attackUsers.push(users.find((item) => item.id == currUserId))
      }
      data.attackSoldier = data.detail.atkSoldiers
      data.attackSoldierLoses = data.detail.atkSoldierLoses || [0, 0, 0, 0]
      data.attackSoldierTotal = data.attackSoldier.reduce((a, b) => a + b)

      data.defenceCountry = countries.find((item) => {
        return item.id == data.defenceCountryId
      })
      data.defenceUsers = []
      for (const u in data.defUserIds) {
        const currUserId = data.defUserIds[u]
        data.defenceUsers.push(users.find((item) => item.id == currUserId))
      }
      data.defenceSoldier = data.detail.defSoldiers
      data.defenceSoldierLoses = data.detail.defSoldierLoses || [0, 0, 0, 0]
      data.defenceSoldierTotal = data.defenceSoldier.reduce((a, b) => a + b)

      data.judge = users.find((item) => item.id == data.judgeId)
      data.toolman = users.find((item) => item.id == data.toolmanId)
      data.map = strongholds.find((item) => item.id == data.mapId)

      if (!data.judge) {
        data.judge = {
          country: {
            color: this.defaultColor
          }
        }
      }
      if (!data.toolman) {
        data.toolman = {
          country: {
            color: this.defaultColor
          }
        }
      }
      return data
    },
    moment: function (date) {
      return this.$moment(date)
    },
    beAbleToSelectGameList: function (battlefield) {
      const gameType = battlefield.map.gameType
      const games = JSON.parse(
        JSON.stringify(Object.values(this.global.gameMap))
      )
      const attackUserIds = battlefield.atkUserIds.filter((e) => e != 0)
      const defenceUserIds = battlefield.defUserIds.filter((e) => e != 0)
      const vsNum = [attackUserIds.length, defenceUserIds.length]
      vsNum.sort()
      const newGames = games.filter((e) => e.type == gameType)
      const vsNumKey = 'b' + vsNum[0] + 'v' + vsNum[1]
      const beUseGames = []
      for (const i in newGames) {
        const curr = newGames[i]
        if (curr[vsNumKey]) {
          beUseGames.push(curr)
        }
      }
      return beUseGames
    },
    selectGame: function (battlefield, event) {
      this.setGame = {
        gameId: event,
        battleId: battlefield.id,
        mapId: battlefield.mapId
      }
      this.ChangeDialogCheck({
        content:
          '將【' +
          battlefield.map.name +
          '】此競賽遊戲定為<br>" ' +
          this.global.gameMap[event].name +
          ' "'
      })
      this.ChangeApiCheck({ id: 9003, key: '', index: -1 })
    },
    whoIsWinner: function (battlefield, country) {
      if (
        battlefield.timestampLimit < this.dateFormat &&
        battlefield.judgeId == this.currUser.id
      ) {
        this.ChangeDialogCheck({
          content: '由【' + country.name + '】獲得此戰役的勝利'
        })
        this.setWiner = {
          mapId: battlefield.mapId,
          battleId: battlefield.id,
          winId: country.id
        }
        this.ChangeApiCheck({ id: 9004, key: '', index: -1 })
      }
    },
    setNow: function () {
      this.timer = setInterval(function (this) {
        console.log(this)
        this.date = new Date()
      }, 1000)
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
    joinBattleBtn: function (battlefield, u_i) {
      this.storage = { battlefield, u_i }
      this.ChangeDialogCheck({
        input_name: '派出兵力數',
        content:
          '加入<br>' +
          battlefield.timestampLimit +
          '<br>在【' +
          battlefield.map.name +
          '】<br> 【' +
          battlefield.defenceCountry.name +
          '】與【' +
          battlefield.attackCountry.name +
          '】戰役'
      })
      this.ChangeApiCheck({ id: 9002, key: '', index: -1 })
    },
    joinBattleWorkerBtn: function (battlefield, type) {
      this.storage = { battlefield, type }
      this.ChangeDialogCheck({
        content:
          '擔任<br>【' +
          battlefield.defenceCountry.name +
          '】與【' +
          battlefield.attackCountry.name +
          '】於<br>' +
          battlefield.timestampLimit +
          '<br>在【' +
          battlefield.map.name +
          '】戰役的' +
          type[1]
      })
      this.ChangeApiCheck({ id: 9001, key: '', index: -1 })
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
        classNames += ' power power0'
      } else if (
        1000 <= stronghold.military_strength &&
        stronghold.military_strength < 5600
      ) {
        classNames += ' power power1'
      } else if (
        5600 <= stronghold.military_strength &&
        stronghold.military_strength < 11200
      ) {
        classNames += ' power power2'
      } else if (11200 <= stronghold.military_strength) {
        classNames += ' power power3'
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
          this.ChangeState(['dialog_battle_list', true])
          this.battleTypeTab = 0
          this.battleDetailCurrId = 0
          break
        case 3:
          window.open(
            'http://172.16.20.73:20221/upload/battlegame_instructions.pdf',
            '_blank'
          )
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
      this.goToBattleSoldier = 0
    },
    goDoApi: function () {
      // console.log(this.storage, this.client.dialog_check_curr.id)
      switch (this.client.dialog_check_curr.id) {
        case 1002:
          this.actIncreaseSoldier()
          break
        case 3001:
          this.actEnterCountry()
          break
        case 3002:
          this.actLeaveCountry()
          break
        case 3003:
          {
            const here = this.currUser.mapNowId
            const users = Object.values(this.global.users).filter(
              (user: any) => user.mapNowId == here
            )
            const freemans = users.filter(
              (user: any) => user.role == enums.ROLE_FREEMAN
            )
            if (freemans.length >= 5 && users.length == freemans.length) {
              this.actRaiseCountry()
            } else {
              this.ChangeApiResult({
                title: '',
                text: '人數不足 或 城池有其他人，不能起義',
                img: ''
              })
            }
          }
          break
        case 3004:
          {
            const inputed = window.prompt(
              '請輸入要花多少黃金疏通 (不需要則輸入0):'
            )
            if (typeof inputed == 'string' && inputed.length > 0) {
              const money = parseInt(inputed) || 0
              this.actEscape({ money })
            }
          }
          break
        case 1001:
          this.actBusiness()
          break
        case 5003:
          this.actSearchWild()
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
          break
        case 9001: {
          const battlefield = this.storage.battlefield
          const type = this.storage.type
          const position = type[2]
          const mapId = battlefield.mapId
          const battleId = battlefield.id
          // const soldier = 0
          this.actBattleJoin({ position, mapId, battleId })
          break
        }
        case 9002: {
          const battlefield = this.storage.battlefield
          const position = this.storage.u_i
          const mapId = battlefield.mapId
          const battleId = battlefield.id
          const soldier = this.goToBattleSoldier

          if (
            soldier < this.battalSoldierMin ||
            soldier > this.currUser.soldier
          ) {
            this.ChangeApiResult({
              title: '',
              text: '派遣兵力數錯誤。',
              img: ''
            })
          } else {
            this.actBattleJoin({ position, mapId, battleId, soldier })
          }

          break
        }
        case 9003: {
          this.actSelectGame(this.setGame)
          this.setGame = {}
          break
        }
        case 9004: {
          this.actBattleJudge(this.setWiner)
          this.setWiner = {}
          break
        }
      }
      this.ChangeDialogCheck({
        content: ''
      })
      this.ChangeState(['dialog_check', false])
      this.goToBattleSoldier = 0
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
    disabledBattlefieldJoinBtn: function (battlefield, key, type) {
      // 到期、已加入、行動力不足
      if (
        battlefield.timestampLimit < this.dateFormat ||
        // this.currUser.alreadyJoined ||
        this.currUser.actPoint == 0
      ) {
        return true
      }

      switch (key) {
        case 'join':
          if (
            battlefield[type + 'Country'].id != this.currUser.countryId ||
            (!battlefield.map.route.includes(this.currUser.mapNowId) &&
              this.currUser.mapNowId != battlefield.mapId) ||
            this.currUser.soldier == 0 ||
            this.currUser.alreadyJoined
          ) {
            return true
          }
          break
        case 'be':
          if (
            [
              battlefield.defenceCountry.id,
              battlefield.attackCountry.id
            ].includes(this.currUser.countryId) ||
            this.currUser.alreadeyWorking
          ) {
            return true
          }
          break
      }

      return false
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
    },
    isAllowedQA: function () {
      return !window.location.port.match(/20221/g)
    },
    onClickHeadImage: function () {
      if (!this.isAllowedQA()) {
        return console.log('PROD not allowed.')
      }
      const myselfIddd = this.user.id - 5
      const selected = window.prompt(
        this.global.users
          .filter((user) => user.id > myselfIddd)
          .map((user) => `${user.id}  > ${user.code} ${user.nickname}`)
          .join('\r\n')
      )
      const findUser = this.global.users.find(
        (user) => user.code == selected || user.id == selected
      )
      if (findUser) {
        this.global.io.emit('ADMINCTL', { userid: findUser.id })
      } else {
        console.log('not found user: ', selected)
      }
    },
    onClickBattleDate: function (mapId) {
      if (!this.isAllowedQA()) {
        return console.log('PROD not allowed.')
      }
      if (window.confirm('確定減少1天嗎?')) {
        this.global.io.emit('ADMINCTL', { battlemap: mapId })
      }
    }
  },

  components: {
    DailogGCSection
  }
})
</script>

<style lang="scss" scope>
@keyframes herebg {
  from {
    transform: scale(1);
    opacity: 1;
  }
  75% {
    opacity: 0.6;
  }
  to {
    transform: scale(3);
    opacity: 0;
  }
}
@keyframes herebgcastle {
  from {
    transform: scale(2);
    opacity: 1;
  }
  75% {
    opacity: 0.7;
  }
  to {
    transform: scale(6);
    opacity: 0;
  }
}

@keyframes battleIcon {
  from {
    filter: drop-shadow(0px 0px 6px #9e2626);
    width: 30px;
    right: calc(50% - 15px);
    bottom: calc(50% - 15px);
  }
  50% {
    filter: drop-shadow(0px 0px 10px #9e2626);
    width: 50px;
    right: calc(50% - 25px);
    bottom: calc(50% - 25px);
  }
  to {
    filter: drop-shadow(0px 0px 6px #9e2626);
    width: 30px;
    right: calc(50% - 15px);
    bottom: calc(50% - 15px);
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
          // cursor: url('/images/mouse.png'), pointer;
          .stronghold-area {
            position: relative;
            .battle-icon {
              position: absolute;
              z-index: 2;
              animation-name: battleIcon;
              animation-duration: 3s;
              animation-iteration-count: infinite;
              // filter: drop-shadow(0px 0px 4px #9e2626);
            }
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
                background: url('/images/大旗.png') no-repeat;
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
              font-weight: bold;
              white-space: nowrap;
              margin-top: 23px;
              background: rgba(0, 0, 0, 0.6);
              font-family: '華康行楷體W5';
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
                z-index: 1;
                backdrop-filter: blur(5);
                .name {
                  white-space: nowrap;
                  position: relative;
                  color: #fff;
                  border-radius: 0;
                }
              }
            }
          }
          .horse {
            display: none;
            position: absolute;
            bottom: 20px;
            left: -10px;
            width: 70px !important;
            height: 70px;
            z-index: 1;

            filter: drop-shadow(0px 0px 4px #bebebe);
            &.hose2 {
            }
            &.hose3 {
            }
          }
          &.power {
            .horse {
              display: block;
            }
          }
          &.power0 {
            .horse {
              left: -21px;
              bottom: 3px;
              background: url('/images/兵力.png') no-repeat center center;
              background-size: 50px;
            }
          }
          &.power1,
          &.power2,
          &.power3 {
            .horse {
              .img {
                position: relative;
                width: 100%;
                height: 100%;
                background: url('/images/武力.gif') no-repeat 10px -10px;
                background-size: 60px;
                bottom: -5px;
              }
            }
          }
          &.power2,
          &.power3 {
            .horse {
              display: block;
              .img {
                &::before {
                  position: absolute;
                  display: block;
                  content: '';
                  width: 100%;
                  height: 100%;
                  background: url('/images/武力.gif') no-repeat center center;
                  background-size: 60px;
                  top: 0;
                  left: -10px;
                }
              }
            }
          }
          &.power3 {
            .horse {
              display: block;
              .img {
                &::after {
                  position: absolute;
                  display: block;
                  content: '';
                  width: 100%;
                  height: 100%;
                  background: url('/images/武力.gif') no-repeat center center;
                  background-size: 60px;
                  top: 5px;
                  right: -20px;
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
                  background-image: url('/images/邊框.png');
                  background-size: contain;
                  background-repeat: no-repeat;
                  line-height: 22px;
                  box-shadow: 0px 0px 4px #1f1f1f;
                }
              }
            }
            &.power0 {
              .horse {
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
                  margin-top: 20px;
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
            &.power {
              .horse {
                bottom: -10px;
                left: -35px;
              }
            }
          }
          &.here {
            z-index: 13;
            .here-bg {
              display: block !important;
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
          // cursor: url('/images/mouse.png'), pointer;
        }
        text-align: center;
        display: inline-block;
        width: 100px;
        .text {
          width: 100px;
          height: 26px;
          background: url('/images/right-top-btn.png') no-repeat center center;
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
        backdrop-filter: blur(5px);
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
            rgba(25, 25, 25, 0.8) 10%,
            rgba(25, 25, 25, 0.6) 40%,
            rgba(25, 25, 25, 0.4) 100%
          );
          backdrop-filter: blur(5px);
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
                mask: url('/images/旗幟_內.png') no-repeat;
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
.bottom-btn-area {
  position: fixed;
  left: calc(50% - 100px);
  bottom: 0;
  z-index: 20;
  width: 200px;
  margin: 80px auto 60px;
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
.notification-area {
  width: 560px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  padding: 20px;
  border-top-left-radius: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 3;
  .tab {
    margin-bottom: 3px;
    .v-item-group {
      background: transparent !important;
      .v-tabs-slider-wrapper {
        display: none;
      }
      .v-tab {
        background: url('/images/邊框.png') no-repeat center center
          rgb(129, 129, 129);
        background-size: auto 100%;
        color: rgb(134, 134, 134);
        width: 131px;
        font-family: '華康行楷體W5';
        font-size: 20px;
        opacity: 0.6;
        &:hover {
          opacity: 0.8;
        }
        &.v-tab--active {
          background: url('/images/邊框.png') no-repeat center center
            rgb(189, 156, 65);
          background-size: auto 100%;
          color: rgb(14, 14, 14);
          opacity: 1 !important;
        }
      }
    }
  }
  .list-group {
    height: 250px;
    overflow-y: scroll;
  }
  .list {
    color: #fff;
    span {
      &:first-child {
        flex: 0 0 130px;
      }
      &:not(:first-child) {
        flex: 1;
      }
    }
  }
}
.dialog-card {
  background: url('/images/dialog/bg.png') no-repeat center center;
  background-size: contain;
  height: 380px;
  font-family: '華康行楷體W5';
  font-size: 26px;
  &.v-card {
    &.req-dialog {
      .v-card__title {
        padding: 50px 70px !important;
      }
    }
    .v-card__title {
      min-height: 30px;
      // padding: 50px 70px !important;
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
    backdrop-filter: blur(3px);
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
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px);
  .battle-records-table {
    background: transparent !important;
    tr {
      th,
      td {
        font-size: 26px !important;
      }
    }
  }
  .toolbar {
    background: transparent !important;
  }
  .battle-box {
    width: 1800px;
    padding: 160px 0 20px;
    margin: 0 auto;
    position: relative;
    background: url('/images/公告紙_中.png') repeat-x center 120px;
    &::before {
      position: absolute;
      top: 0;
      left: -32px;
      display: block;
      content: '';
      width: 85px;
      height: 100%;
      background: url('/images/公告紙_左.png') no-repeat left 120px;
    }
    &::after {
      position: absolute;
      top: 0;
      right: -32px;
      display: block;
      content: '';
      width: 85px;
      height: 100%;
      background: url('/images/公告紙_右.png') no-repeat right 120px;
    }
    .battle-team-area {
      position: relative;
    }
    .battle-info-group {
      position: absolute;
      left: 50px;
      top: 160px;
      width: 300px;
      z-index: 2;
      .battle-date {
        width: 100%;
        height: 80px;
        line-height: 78px;
        background: url('/images/btn01.png') no-repeat center center;
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
    position: absolute;
    top: 0;
    left: calc(50% - 280px);
    &::before {
      content: '';
      display: block;
      background: url('/images/border05_上.png') no-repeat top center;
      height: 55px;
    }
    &::after {
      content: '';
      display: block;
      background: url('/images/border05_下.png') no-repeat bottom center;
      height: 25px;
    }
    .battle-info-text {
      background: url('/images/border05_中.png') repeat-y center center;
      position: relative;
      z-index: 1;
      font-size: 32px;
      line-height: initial;
      width: 560px;
      height: 36px;
      text-align: center;
      color: rgb(255, 255, 255) !important;
      display: flex;
      margin: 0 auto;
      .area {
        font-family: '華康行楷體W5';
        &.area-l,
        &.area-r {
          width: calc(50% - 25px);
          display: flex;
          padding: 0 8px;
          .country-name {
            width: 86px;
            text-align: center;
            padding: 2px 5px;
            margin: 0 10px;
            border-radius: 3px;
            border: 1px solid #d0ba0d;
          }
          span {
            display: inline-block;
          }
        }
        &.area-l {
          text-align: right;
        }
        &.area-c {
          width: 50px;
          text-align: center;
        }
      }
    }
  }
  .soldier-group {
    width: 100%;
    height: 50px;
    line-height: 40px;
    font-size: 20px;
    background: url('/images/soldier.png') no-repeat 60px -6px rgba(0, 0, 0, 0.6);
    background-size: auto 40px;
    text-align: left;
    padding-left: 100px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 2;
    color: #fff;
  }
  .join-btn {
    width: 100%;
    position: absolute;
    left: 0;
    top: 40%;
    z-index: 5;
    text-align: center;
    color: #272727;
    text-shadow: 0 0 3px #ccc;
    .limit-time {
      margin-top: 8px;
    }
  }
  .field-block {
    position: relative;
    .vs-img {
      position: absolute;
      left: calc(50% + 20px);
      top: calc(50% - (256px / 2) - 50px);
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
    margin-bottom: 100px;
    &.other-group {
      margin: 0 auto;
      width: 265px;
      margin-right: 80px;
    }
    .user-group {
      text-align: center;
      &.overtime {
        &.winner {
          &::after {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 4;
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background: url('/images/win.png') no-repeat center center;
            filter: drop-shadow(0 0 3px #111);
          }
        }
        &.curr-user-judge {
          cursor: pointer;
          opacity: 0.8;
          &::after {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 4;
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background: url('/images/win.png') no-repeat center center;
            filter: grayscale(1);
            opacity: 0.6;
          }
          &:hover {
            opacity: 1;
            &::after {
              filter: grayscale(0);
              opacity: 1;
              filter: drop-shadow(0 0 3px #111);
            }
          }
        }
      }
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
          height: 291px;
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
            background: url('/images/bg02.png') no-repeat center 25px;
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
          mask: url('/images/border02.png') no-repeat center center;
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
      margin-left: 350px;
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
.dialog-map-info {
  background: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(5px);
  .battle-info {
    & > span {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .battle-btn {
    margin-left: 15px;
    img {
      height: 30px;
    }
  }
  .user-blcok {
    display: inline-block;
    border: 1px solid rgb(139, 139, 139);
    margin: 1%;
    padding: 6px 10px;
    width: 48%;
    .title-name {
      margin-right: 6px;
    }
    .user-name {
      margin-right: 5px;
    }
    span {
      display: inline-block;
    }
  }
}
.dialog-level-up-city {
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(5px);
  .construction {
    background: transparent !important;
  }
}

.map-info-table {
  width: 100%;
  th,
  td {
    width: 25%;
    padding: 10px 15px;
  }
}
</style>
