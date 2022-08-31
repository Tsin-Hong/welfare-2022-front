<template>
  <div class="tool-page">
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'Tool',

  data() {
    return {
      list: []
    }
  },

  mounted() {
    fetch('./data/joinList.json')
      .then((res) => res.json())
      .then((data) => {
        this.list = data
      })
  }
}
</script>

<style lang="scss" scoped>
.tool-page {
  width: 100vh;
  height: 100vh;
  display: flex;
}
</style>