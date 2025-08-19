<template>
  <van-row class="tabs">
    <van-tabs v-model="active" :before-change="$attrs['before-change']" @change="changeActive">
      <template v-for="item in tabs">
        <van-tab :key="item" :title="item"></van-tab>
      </template>
    </van-tabs>
  </van-row>
</template>

<script>
import { Row, Col, Tab, Tabs, } from 'vant'

export default {
  name: 'MyTabs',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      active: this.$attrs['default-active'] || 0,
    }
  },
  mounted() {
    window.onresize = () => {
      setTimeout(() => {
        this.changeWidth(this.active)
      })
    }
    this.$nextTick(() => {
      this.changeWidth(this.active)
      setTimeout(() => {
        const line = document.querySelector('.van-tabs__line')
        line.style.transitionDuration = '0.3s'
      })
    })
  },
  beforeDestroy() {
    window.onresize = () => {
    }
  },
  methods: {
    changeActive(name) {
      setTimeout(() => {
        this.changeWidth(name)
      })
      this.$emit('change')
    },
    changeWidth(active) {
      const width = document.querySelectorAll('.van-tab')[active].clientWidth
      const line = document.querySelector('.van-tabs__line')
      // console.log('width', width)
      //  console.log('line', line)
      line.style.width = width - 6 + 'px'
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

::v-deep .van-tab {
  background: $cardBgColor;
  color: $cardColor;
}
::v-deep .van-tab--active {
  font-size: 18px;
  font-weight: bold;
}
</style>
