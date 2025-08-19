<template>
  <div class="listContent">
    <van-cell-group v-if="assetsList.length" :border="false">
      <template v-for="item in assetsList">
        <div :key="item.name" class="cell" @click="gotoDetail(item)">
          <!-- 币种图标 -->
          <img
            :src="`/static/img/coins/BeePal/${item.coin_code}.png`"
          />
          <van-cell>
            <template #title>
              <span class="title">{{ item.coin_name }}</span>
              <span v-if="item.coin_chain" class="chain"
                >({{ item.coin_chain }})</span
              >
            </template>
            <template #default>
              <!-- 持币数量 -->
              <div
                :style="{ transform: canSeeAssets ? '' : 'translateY(16%)' }"
                class="amount"
              >
                {{
                  canSeeAssets
                    ? item.amount
                    : '******'
                }}
              </div>
              <!-- 汇率 -->
              <div class="rate flex">
                <div
                  :style="{ transform: canSeeAssets ? '' : 'translateY(16%)' }"
                  class="mr3"
                >
                  {{ canSeeAssets ? item.price : '***' }}
                </div>
                <div>{{ realCoin }}</div>
              </div>
            </template>
          </van-cell>
        </div>
      </template>
    </van-cell-group>
    <van-loading v-if="loading" />
  </div>
</template>

<script>
import { Cell, CellGroup, Loading } from 'vant'
export default {
  name: 'AssetsList',
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Loading.name]: Loading,
  },
  props: {
    // 我的资产列表
    assetsList: {
      type: Array,
      default: () => [],
    },
    // 真实货币 由父组件引入
    realCoin: {
      type: String,
      default: '--',
    },
    // 可视化
    canSeeAssets: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
    }
  },
  watch: {
    assetsList: {
      handler(newv) {
        if (newv && newv.length) {
          this.loading = false
        }
      },
      immediate: true,
    },
  },
  methods: {
    gotoDetail(item) {
      this.$router.push('/detail/' + item.coin_code)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.listContent {
  // 单个列表
  .cell {
    display: flex;
    align-items: center;
    padding: 0 15px;
    &:active {
      background: #f7f7f7;
      .van-cell {
        background: #f7f7f7;
      }
    }

    // 币种图片
    img {
      width: 45px;
      margin: 0 10px;
    }
    .van-cell {
      color: $labelColor1;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid $BorderColor3;
      .van-cell__title {
        font-size: 16px;
        margin-left: 5px;
        height: 48px;
        line-height: 48px;
        vertical-align: middle;
        .chain {
          font-size: 12px;
          margin-left: 6px;
          color: $labelColor20;
        }
      }
      .van-cell__value {
        overflow: visible;
      }

      // 持币数量
      .amount {
        color: $labelColor1;
        font-size: 18px;
      }

      // 汇率
      .rate {
        justify-content: flex-end;
        font-size: 14px;
        color: $labelColor19;
      }
    }
  }
}
.van-loading {
  text-align: center;
}
</style>
