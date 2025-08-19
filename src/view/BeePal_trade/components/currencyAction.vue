<template>
  <van-action-sheet
    :value="show"
    :title="$t('beePal.trade.changeCurrency')"
    class="actions"
    @click-overlay="$emit('changeShow', false)"
    @cancel="$emit('changeShow', false)"
  >
    <div class="content">
      <div
        v-for="(item, index) in currencyList"
        :key="index"
        class="item"
        @click="
          changeCurrency(index)
          $emit('changeShow', false)
        "
      >
        <div v-if="currencyList[0]" class="borderBox">
          <div class="box">
            <span>{{ item.code }}</span>
          </div>
          <div v-if="currency === item.id" class="checked">
            <van-icon name="success"/>
          </div>
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
import config from '../config'
import { ActionSheet, Icon } from 'vant'

export default {
  name: 'PaymentAction',
  components: {
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
  },
  model: {
    prop: 'show',
    event: 'changeShow',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    currencyList: {
      type: Array,
      default: () => [],
    },
    currency: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      methodMap: config.methodMap,
    }
  },
  created() {
    // this.$myConsole.log('method', this.method)
  },
  methods: {
    changeCurrency(index) {
      const currency = this.currencyList[index]

      this.$emit('update:currency', currency.id)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .actions {
    .van-action-sheet__header {
      padding: 3px 0;
    }
  }

  .content {
    border-top: 0.5px solid $BorderColor4;

    .item {
      font-size: 14px;
      padding: 0 15px;

      &:not(:last-child) {
        .borderBox {
          border-bottom: 0.5px solid $BorderColor4;
        }
      }

      &:active {
        background: rgba($color: #000000, $alpha: 0.05);
      }

      .borderBox {
        padding: 15px 0;
        position: relative;
      }

      .box {
        margin: 0 auto;
        width: 110px;
        display: flex;
        align-items: center;
      }

      .imgbox {
        width: 30px;

        img {
          max-height: 24px;
          max-width: 28px;
          height: auto;
          width: auto;
          margin: 0 auto;
          display: block;
        }
      }

      .checked {
        position: absolute;
        right: 15px;
        top: calc(50% - 10px);
        background: $cardBgColor;
        padding: 3px;
        border-radius: 100%;

        .van-icon {
          display: block;
        }
      }
    }
  }
</style>
