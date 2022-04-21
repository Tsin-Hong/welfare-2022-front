<template>
  <div v-if="battleDetailCurrId != 0" class="battle-box">
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
        <div class="area area-l flex-row-reverse">
          <span
            class="country-name"
            :style="{
              color: battleRecordDetails.attackCountry.color[1],
              background: battleRecordDetails.attackCountry.color[0]
            }"
            >{{ battleRecordDetails.attackCountry.name }}</span
          >
          <span>{{ battleRecordDetails.attackSoldierTotal }}</span>
        </div>
        <div class="area area-c">VS</div>
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

<script lang="ts">
import enums from '@/unit/enum'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default Vue.extend({
  name: 'UserPage',
  data: () => ({
  }),
  computed: {
  },
  mounted() {

  },
  methods: {

  },
});