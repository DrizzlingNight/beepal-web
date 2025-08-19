<template>
  <van-popup
    :value="show"
    :close-on-click-overlay="false"
    class="securityCodeModal"
    position="bottom"
  >
    <div class="content">
      <div class="head">
        <div>
          <div class="title">
            {{ $t('lesson.securityValidation') }}
          </div>
        </div>
        <p class="close" @click="$emit('changeShow', false)">{{ $t('base.cancel') }}</p>
      </div>
      <div class="detail">
        <van-field
          v-model.trim="data.securityCode"
          :error-message="errorMsg.securityCode"
          :placeholder="$t('login.input_2')"
          :formatter="value => positiveIntegerNumberFormatter(value)"
          type="number"
          @input="value => { securityCodeChange(value) } "
        />
        <van-cell :value="$t('login.forgetPassword')" value-class="forget-password-btn" class="forget-password"/>
      </div>
      <div class="btnGroups">
        <van-button class="confirm" @click="toPay">{{ $t('base.confirm') }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Button, Field, Form, Popup, Cell } from 'vant'
import { settings } from '@/config'
import { positiveIntegerNumberFormatter } from '@/utils/formatter'
import FormValidatorMixin from '@/mixins/form-validator'
import config from '../config'
import Storage from '@/utils/storage'

export default {
  name: 'SecurityCodeModal',
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
    [Cell.name]: Cell,
  },
  mixins: [FormValidatorMixin],
  model: {
    prop: 'show',
    event: 'changeShow',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: {
        securityCode: '',
      },
      positiveIntegerNumberFormatter,
      eyes: false,
      supportCoin: config.supportCoin,
      lessonTypeMap: config.lessonTypeMap,
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
      errorMsg: {
        securityCode: '',
      },
      rules: {
        securityCode: [
          {
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                callback(`${this.$t('lesson.securityValidationCode')}${this.$t('base.noEmpty')}`)
              } else {
                callback()
              }
            },
          },
        ],
      }
    }
  },
  computed: {
    vicon() {
      return this.eyes ? 'eye-o' : 'closed-eye'
    },
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
    securityCodeChange(value) {
      this.$emit('securityCodeChange', String(value))
    },
    toPay() {
      if (this.$__validate()) {
        this.$emit('toPay')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .securityCodeModal {
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
        // font-weight: bold;
      }

      .close {
        cursor: pointer;
        color: #A6A8B3;
        font-size: 14px;
      }

    }

    .detail {

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

      .forget-password {
        cursor: pointer;
        padding-top: 7px;

        .van-cell__value {
          padding-left: 0px;
        }

        .forget-password-btn {
          font-size: 12px;
          color: #FFC100;

        }
      }
    }

    .btnGroups {
      display: flex;
      align-items: center;
      margin-top: 20px;

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
