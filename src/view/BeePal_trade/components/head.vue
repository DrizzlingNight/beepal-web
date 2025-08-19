<template>
  <div class="trade-head">
    <van-row class="header" type="flex" justify="space-between" align="center">
      <van-col class="page-left">
         <van-icon class="back" name="arrow-left" @click="goBack" />
      </van-col>
      <van-col class="page-title">
        <slot name="title">{{ $t('home.trade') }}</slot>
      </van-col>
      <van-col class="page-title-cs">
        <span></span>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { Icon, Col, Loading, Row, Tab, Tabs } from 'vant'

export default {
  name: 'TradeHead',
  components: {
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [Row.name]: Row,
    [Col.name]: Col,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  props: {
    goBackPath: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      isMounted: false,
    }
  },
  computed: {
  },
  mounted() {
    this.isMounted = true
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
@import '@/styles/variable.scss';

.header {
  height: 60px;
  background: $cardBgColor;
  color: $cardColor;

  .right {
    color: $cardColor;
  }
}

// 返回按钮
.back {
  font-size: 24px;
}
</style>
