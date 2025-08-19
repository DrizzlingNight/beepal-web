<template>
  <div class="card">
    <!-- 眼睛（隐藏和显示资产） -->
    <svg-icon
      :icon-class="canSeeAssets ? 'canSeen' : 'notSeen'"
      class-name="seen"
      @click="changeSeen"
    ></svg-icon>

    <!-- 卡片内容 -->
    <div class="content">
      <!-- 标题 -->
      <div class="title">{{ $t('beePal.home.wallet') }}({{ realCoin }})</div>
      <!-- 当前总资产 -->
      <div
        :style="{
          transform: canSeeAssets ? 'translateY(20%)' : 'translateY(36%)',
        }"
        class="total"
      >
        {{ canSeeAssets ? money_filter(currentTotal, 2) : '******' }}
      </div>
    </div>
  </div>
</template>

<script>
import { money_filter } from '@/utils/money'
export default {
  name: 'Card',
  model: {
    prop: 'canSeeAssets',
    event: 'changeSeen',
  },
  props: {
    // 真实货币 由父组件引入
    realCoin: {
      type: String,
      default: '--',
    },
    // 当前总资产
    currentTotal: {
      type: Number,
      default: 0,
    },
    // 可视化
    canSeeAssets: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    money_filter,
    changeSeen() {
      window.sessionStorage.setItem('seen', !this.canSeeAssets)
      this.$emit('changeSeen', !this.canSeeAssets)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.card {
  background: $cardlinearBg;
  height: 60px;
  border-radius: 10px;
  position: relative;
  padding: 20px 15px;
  color: $cardColor;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 20%;
    width: 30%;
    z-index: 0;
    height: 100%;
    transform: skew(-25deg);
    background-color: $cardMiddleBg;
  }

  // 我的资产眼睛图标
  .seen {
    font-size: 20px;
    position: absolute !important;
    right: 12px;
    top: 18px;
  }

  // 卡片内容
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // 标题
    .title {
      font-size: 12px;
    }
    // 总资产显示
    .total {
      font-size: 28px;
      position: relative;
      z-index: 1;
    }
  }
}
</style>
