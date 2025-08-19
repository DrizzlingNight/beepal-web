<template>
  <div v-if="token" class="tokenAssets">
    <img :src="`/static/img/coins/BeePal/${token.coin_code }.png`" />
    <van-cell>
      <template #title>
        <!-- 当前token名称 -->
        <div class="token">{{ token.coin_name }}</div>
        <!-- 当前token的别名 -->
        <div class="otherName">{{ token.coin_chain }}</div>
      </template>
      <template #default>
        <!-- 持币数量 -->
        <div class="amount">
          {{ token.amount }}
        </div>
        <!-- 汇率 -->
        <div class="rate">
          <span class="mr3">{{ token.price }}</span>
          <span>{{ realCurrency }}</span>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { Cell } from 'vant'
import { settings } from '@/config'
import Storage from '@/utils/storage'

export default {
  name: 'TokenAssets',
  components: {
    [Cell.name]: Cell,
  },
  props: {
    token: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.tokenAssets {
  background: $pageBgColor;
  display: flex;
  align-items: center;

  // 当前token图标
  img {
    width: 45px;
    margin: 15px;
  }

  .van-cell {
    color: $labelColor1;
    padding: 0 15px 0 0;
    align-items: center;
    .token {
      font-size: 16px;
    }
    .otherName {
      font-size: 14px;
      color: $labelColor19;
    }
    .amount {
      font-size: 18px;
      color: $labelColor1;
    }
    .rate {
      font-size: 13px;
      color: $labelColor19;
    }
  }
}
</style>
