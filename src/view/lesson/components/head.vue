<template>
  <div class="lesson-head">
    <van-row class="header" type="flex" justify="space-between" align="center">
      <van-col class="page-left">
         <van-icon class="back" name="arrow-left" @click="goBack" />
      </van-col>
      <van-col class="page-title">
        <slot name="title">{{ title }}</slot>
      </van-col>
      <van-col class="page-title-cs">
        <svg-icon icon-class="refresh" class-name="refresh" @click.native="$emit('onRefresh')"/>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { Icon, Col, Loading, Row, Tab, Tabs } from 'vant'

export default {
  name: 'LessonHead',
  components: {
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [Row.name]: Row,
    [Col.name]: Col,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
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
  position: fixed;
  z-index: 2;
  width: 100vw;
  height: 60px;
  background: $pageBgColor; // 白色
  color: $topColor; // 黑色
  border-bottom: 0.5px solid rgba($color: #000, $alpha: 0.1);

  .page-left {
    padding-top: 6px;
  }

  .page-right {
    padding-top: 2px;
  }

  .refresh {
    color: $topColor; // 黑色
  }
}

// 返回按钮
.back {
  font-size: 24px;
}
</style>
