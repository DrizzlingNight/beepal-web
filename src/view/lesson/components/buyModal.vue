<template>
  <van-popup
    :value="show"
    :close-on-click-overlay="false"
    class="buyModal"
    position="bottom"
  >
    <div class="content">
      <div class="head">
        <div>
          <div class="title">
            {{ $t('lesson.buyDetail') }}
          </div>
        </div>
        <p class="close" @click="$emit('changeShow', false)">{{ $t('lesson.close') }}</p>
      </div>
      <div class="detail">
        <van-cell :title="$t('lesson.lessonPrice')" :value="`${money_filter(refer.price,3)} ${getCoinName(refer.coin)}`" :border="false" class="price" />
        <van-cell :title="$t('lesson.lessonName')" :value="refer.title" class="name" />
        <van-cell :title="$t('lesson.lessonType')" :value="$t('lesson.lesson_type_' + lessonTypeMap[refer.type])" :border="false" class="type" />
        <van-cell :title="$t('lesson.lessonTime')" :value="`${refer.sections}${$t('lesson.sectionTime')}  ${hourFormate(refer.duration)}${$t('lesson.hour')}`" :border="false" class="time" />
      </div>
      <div class="btnGroups">
        <van-button class="confirm" @click="$emit('toSecurityValidation')">{{ $t('lesson.confirmPay') }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Button, Field, Form, Popup, Cell } from 'vant'
import { money_filter } from '@/utils/money'
import { settings } from '@/config'
import config from '../config'
import Storage from '@/utils/storage'

export default {
  name: 'BuyModal',
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
    [Cell.name]: Cell,
  },
  model: {
    prop: 'show',
    event: 'changeShow',
  },
  props: {
    refer: {
      type: Object,
      default: () => {
        return {}
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      money_filter,
      supportCoin: config.supportCoin,
      lessonTypeMap: config.lessonTypeMap,
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getCoinName(id) {
      const coin = this.supportCoin.find(item => item.id === id)
      return coin.name
    },
    hourFormate(sec, digits = 1) {
      const hour = (sec / 60) / 60
      if (hour % 1 === 0) {
        return hour
      } else {
        return hour.toFixed(digits)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .buyModal {
    min-height: 200px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .content {
    padding: 20px 15px 25px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
      border-bottom: 0.5px solid $BorderColor4;

      .title {
        color: $labelColor1; // 黑色
        font-size: 16px;
        font-weight: bold;
      }

      .close {
        cursor: pointer;
        color: #A6A8B3;
        font-size: 14px;
      }

    }

    .detail {

      .van-cell {
        border-bottom: 0.5px solid $BorderColor4;
      }

      .van-cell__title {
        flex: 0.3;
        color: #A6A8B3;
        font-size: 14px;
        text-align: right;
      }

      .van-cell__value {
        flex: 1;
        color: $labelColor1; // 黑色
        font-size: 14px;
        text-align: left;
        padding-left: 17px;
      }

      .price {
        min-height: 50px;

        .van-cell__title {
          line-height: 36px;
        }

        .van-cell__value {
          color: $labelColor1; // 黑色
          font-size: 36px;
          font-weight: bold;
          line-height: 36px;
        }
      }
    }

    .btnGroups {
      display: flex;
      align-items: center;
      margin-top: 30px;

      .confirm {
        background: linear-gradient(315deg, #FFBC00 0%, #FFD92A 100%);
        border: none;
        border-radius: 6px;
        color: $cardColor;
        flex-grow: 1;
      }
    }

    .van-button--disabled {
      opacity: 1;
    }
  }
</style>
