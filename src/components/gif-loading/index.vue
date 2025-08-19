<template>
  <div v-show="visible" class="loading-wrap">
    <img src="./loading.gif" style="margin-top: 50%; height: 80px; width: 80px;">
    <div style="color: #fff; font-size: 14px;">
      正在努力加載中……
    </div>
  </div>
</template>

<script>
export default {
  name: "GifLoading",
  props: {
    visible: {
      type: Boolean,
      default: false // FIXME: 2021.07.23 一開始沒給預設值，所以defalut先設false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-wrap{
  background-color: #222;
  position: fixed;
  width: 100vw;
  height: calc(100vh - 57px);
  // left: 50%; top: 30%;
  // transform: translate(-50%);
  text-align: center;
  line-height: 80px;
  z-index: 1;
}
</style>
