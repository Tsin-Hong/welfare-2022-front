<template>
  <div class="tool-page">
    <div class="list d-flex justify-center flex-wrap">
      <div
        v-for="(item, index) in list"
        :key="index"
        style="width: 5%"
        class="img-area m-5-px"
        :class="{ active: false }"
      >
        <v-img
          :src="getUserImgUrl(item)"
          :aspect-ratio="9 / 12"
          class="pt-5"
          style="top: -30px"
        />
      </div>
    </div>
    <div class="vs">
      <div class="group d-flex">
        <div v-for="(item, index) in vsList" :key="index" class="vs-block">
          <div class="vs-user-area">
            <v-img
              class="img"
              :src="getUserImgUrl(item)"
              contain
              max-height="100%"
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
                'text-shadow': '0px 0px 80px ' + item.countryColor[1]
              }"
            >
              {{ item.countryName }}
            </div>
            <div
              class="country-name-bg"
              :style="{
                background: item.countryColor[1]
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="title-area d-flex">
        <div class="title">官渡之戰 個人賽</div>
        <div class="times align-self-end">第一輪</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tool',

  data() {
    return {
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
      // list:人選清單
      list: [],
      // vsList: 對抗清單
      vsList: []
    }
  },

  mounted() {
    fetch('./data/joinList.json')
      .then((res) => res.json())
      .then((data) => {
        this.list = data.map((item) => {
          item.countryColor = item.countryColor.split(',')
          return item
        })

        // 正式資料來要刪掉的
        this.vsList = this.vsList.concat(data)
      })
  },

  methods: {
    getUserImgUrl: function (user) {
      const useUserKey = user.occupationId > 0 ? 'occupationId' : 'role'
      const mapObj = this[useUserKey + 'MapObj']
      return '/images/user/' + user.code + mapObj[user[useUserKey]] + '.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-page {
  width: 100vw;
  height: 100vh;
  background: url('/images/left_menu_bg - 複製.jpg') center center;
  background-size: contain;
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
    overflow: hidden;
    height: 60px;
    border: 2px solid #777777;
    background: #fff;
    border-radius: 3px;
    .active {
      border-color: #d8b585;
    }
  }
  .vs {
    width: 100%;
    padding: 0 120px;
    position: relative;
    .title-area {
      position: absolute;
      left: calc(50% - 50px);
      width: 100px;
      background: #d8b585;
      top: 0;
      z-index: 5;
      padding: 30px 10px;
      div {
        font-family: '華康行楷體W5' !important;
        writing-mode: vertical-lr;
        font-size: 36px !important;
      }
    }
  }
  .group {
    width: 100%;
    border: 1px solid #d8b585;
    margin-bottom: 30px;
    height: 95%;
  }
  .vs-block {
    position: relative;
    width: 50%;
    height: 100%;
    background: #00000086;
    overflow: hidden;
    font-family: '華康行楷體W5';
    .vs-user-area {
      position: relative;
      width: 100%;
      height: 100%;
      .user-name {
        position: absolute;
        z-index: 3;
        bottom: 20%;
        color: #fff;
        right: 65%;
        font-size: 70px;
        writing-mode: vertical-lr;
        -webkit-text-stroke: 1px black;
        text-shadow: 5px 5px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000,
          -1px 1px 0 #000, 1px 1px 0 #000;
      }
    }
    .country-name {
      position: absolute;
      top: 0;
      z-index: 0;
      font-size: 120px;
      height: 100%;
      width: 60%;
      right: 0;
      text-align: right;
      padding-right: 10%;
    }
    .country-name-bg {
      position: absolute;
      top: 0;
      z-index: 1;
      height: 70%;
      width: 76%;
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 0);
      clip-path: polygon(100% 0, 100% 100%, 0 0);
      right: 0;
      text-align: right;
      padding-right: 10%;
      opacity: 0.6;
    }

    &:first-child {
      border-right: 1px solid #d8b585;
      .country-name {
        left: 0;
        padding-left: 10%;
        padding-right: 0;
        text-align: left;
      }
      .country-name-bg {
        -webkit-clip-path: polygon(100% 0, 0 0, 0 100%);
        clip-path: polygon(100% 0, 0 0, 0 100%);
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
}
</style>