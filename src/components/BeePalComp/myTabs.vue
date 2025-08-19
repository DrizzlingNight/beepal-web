<template>
  <div class="tabs">
    <van-tabs v-model="active" :before-change="$attrs['before-change']" @change="changeActive">
      <template v-for="item in tabs">
        <van-tab :key="item" :title="item"></van-tab>
      </template>
    </van-tabs>
  </div>
</template>

<script>
  import { Tab, Tabs } from 'vant'

  export default {
    name: 'MyTabs',
    components: {
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
      },
      changeWidth(active) {
        const width = document.querySelectorAll('.van-tab')[active].clientWidth
        const line = document.querySelector('.van-tabs__line')
        line.style.width = width - 6 + 'px'
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  ::v-deep .van-tabs {
    border-radius: 100px;
    overflow: hidden;
    height: 32px;

    .van-tabs__wrap {
      height: 32px;
    }
  }

  ::v-deep .van-tabs__nav {
    padding: 0;
    background: rgba($color: $pageBgColor, $alpha: 0.15);
    z-index: 0;

    .van-tab {
      padding: 0 15px;
      color: $labelColor22;

      &.van-tab--active {
        color: $labelColor1;
      }
    }

    .van-tabs__line {
      z-index: -1;
      background-color: $pageBgColor;
      top: 3px;
      height: calc(100% - 6px);
      border-radius: 50px;
    }
  }
</style>
