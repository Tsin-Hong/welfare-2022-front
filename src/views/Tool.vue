<template>
  <div class="tool-page">
    <table class="list" border="1">
      <tbody>
        <tr>
          <td v-for="index in count" :key="index" class="img-area">
            <v-img :src="getUserImgUrl(list[0])" aspect-ratio="1" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Tool',

  data() {
    return {
      count: 0,
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
      list: []
    }
  },

  mounted() {
    fetch('./data/joinList.json')
      .then((res) => res.json())
      .then((data) => {
        this.list = data
        this.count = 100
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
  width: 100vh;
  height: 100vh;
  .list {
  }
  .img-area {
    display: inline-block;
    width: 60px;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>