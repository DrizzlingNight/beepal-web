<template>
  <van-action-sheet
    :value="show"
    :title="$t('beePal.trade.changeType')"
    class="actions"
    @click-overlay="$emit('changeShow', false)"
    @cancel="$emit('changeShow', false)"
  >
    <div class="content">
      <div
        v-for="(item, index) in supportRate"
        :key="index"
        class="item"
        @click="
          changeType(index)
          $emit('changeShow', false)
        "
      >
        <div class="borderBox">
          <div class="box">
            <span>{{ $t('beePal.trade.' + item) }}</span>
          </div>
          <div v-if="index === rate" class="checked">
            <van-icon name="success"/>
          </div>
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
  import { ActionSheet, Icon } from 'vant'

  export default {
    name: 'RateAction',
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
      supportRate: {
        type: Array,
        default: () => [],
      },
      rate: {
        type: Number,
        default: 0,
      },
      needAdd: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      changeType(index) {
        this.$emit('update:rate', index)
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
