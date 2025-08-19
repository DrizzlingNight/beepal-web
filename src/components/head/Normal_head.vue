<template>
  <my-head :border="border">
    <template #left>
      <slot v-if="goBackBtnShow" name="left">
        <van-icon class="back" name="arrow-left" @click="goBack" />
      </slot>
      <slot v-else name="left">
        <!-- 2021.08.09 為了讓icon不要出來，所以用<p></p>代替 -->
        <p></p>
      </slot>
    </template>
    <template #title>
      <slot name="title">{{ title }}</slot>
    </template>
    <template #right>
      <slot name="right">
        <span></span>
      </slot>
    </template>
  </my-head>
</template>

<script>
import myHead from './BeePal_head'
import { Icon } from 'vant'
export default {
  name: 'NormalHead',
  components: {
    myHead,
    [Icon.name]: Icon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    goBackBtnShow: {
      type: Boolean,
      default: true,
    },
    goBackPath: {
      type: String,
      default: null,
    }
  },
  methods: {
    goBack() {
      if (this.$listeners['goback']) {
        this.$emit('goback')
      } else if (this.goBackPath) {
         this.$router.push({ path: this.goBackPath })
      } else {
        this.$router.back()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// 返回按鈕
.back {
  font-size: 24px;
}
</style>
