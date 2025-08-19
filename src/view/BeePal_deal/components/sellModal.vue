<template>
  <van-popup
    :value="show"
    class="sellModal"
    position="bottom"
    @click-overlay="$emit('changeShow', false)"
  >
    <div class="content">
      <div class="head">
        <div>
          <div class="title">
            {{ $t('beePal.deal.sellCoin', [refer.coin.name]) }}
          </div>
          <div class="price">
            <span>{{ $t('beePal.deal.price') }}</span>
            <span class="num">{{ refer.price }} {{ realCurrency }}</span>
          </div>
        </div>
        <img
          :src="`/static/img/coins/BeePal/${refer.coin.code}.png`"
          width="40"
        />
      </div>
      <van-form @submit="placeOrder">
        <div class="buyInput">
          <div class="purchaseBase" @click="changeAccording">
            <svg-icon icon-class="switch" class-name="switch"></svg-icon>
            <span>{{
              accordingTo === 1
                ? $t('beePal.deal.sellByNum')
                : $t('beePal.deal.sellByReal')
            }}</span>
          </div>
          <div class="inputBox">
            <van-field
              ref="amountInput"
              :placeholder="
                accordingTo === 0
                  ? $t('beePal.deal.sellp_num')
                  : $t('beePal.deal.sellp_real')
              "
              v-model="forms.amount"
              :formatter="formatter"
              :border="false"
              type="number"
              class="amount"
              @input="inputAmount"
            >
              <template #extra>
                <div class="flex row-v-c extra">
                  <div class="realCurrency">
                    {{ accordingTo === 0 ? refer.coin.name : realCurrency }}
                  </div>
                  <div class="line">|</div>
                  <div class="all" @click="setAll">
                    {{ $t('beePal.tokenDetail.all') }}
                  </div>
                </div>
              </template>
            </van-field>
            <van-field
              :border="false"
              :placeholder="0 | tofixed_decimal(4)"
              :value="rate"
              class="rate"
              readonly
            >
              <template #extra>
                <div class="flex row-v-c">
                  {{ accordingTo === 1 ? refer.coin.name : realCurrency }}
                </div>
              </template>
            </van-field>
          </div>
          <div class="quota">
            <span>{{ $t('beePal.deal.quota') }}&nbsp;</span>
            <span
            >{{ refer.min_trade_limit }} - {{ refer.max_trade_limit }}
              {{ realCurrency }}</span
            >
          </div>
        </div>
        <div v-if="refer.supportedTrans && refer.supportedTrans.length" class="methods">
          <van-cell
            :title="$t('beePal.deal.collectMethod')"
            :border="false"
            is-link
            @click="actionShow = true"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ $t('beePal.payment.' + refer.supportedTrans[forms.method]) }}
                </div>
                <img
                  :src="
                    require('@/assets/img/' +
                      refer.supportedTrans[forms.method] +
                      '.png')
                  "
                />
              </div>
            </template>
          </van-cell>
          <buy-mode-action
            v-model="actionShow"
            :method.sync="forms.method"
            :need-add="true"
            :support-method="refer.supportedTrans"
          ></buy-mode-action>
        </div>
        <div class="btnGroups">
          <van-button plain disabled class="cancel">{{
            $t('beePal.deal.countDown', [countDown])
            }}
          </van-button>
          <van-button
            :class="{ canClick: forms.amount && Number(forms.amount) != 0 }"
            :disabled="!forms.amount || Number(forms.amount) == 0"
            class="placeOrder"
            native-type="submit"
          >{{ $t('beePal.deal.placeOrder') }}
          </van-button
          >
        </div>
      </van-form>
    </div>
    <div class="orderDetail">
      <div
        class="title flex row-v-c row-between"
        @click="detailShow = !detailShow"
      >
        <span>{{ $t('beePal.deal.orderDetail') }}</span>
        <van-icon
          :style="[
            { transform: detailShow ? 'rotate(-180deg)' : '' },
            { transition: 'all .2s' },
          ]"
          name="arrow-down"
        />
      </div>
      <pull-down
        :is-show="detailShow"
        :duration="250"
        visual-effect="pull"
        @showBox="val => (detailShow = val)"
      >
        <div>
          <van-cell
            :title="$t('beePal.deal.timeLimit')"
            :value="$t('beePal.deal.miniute', [15])"
          ></van-cell>
          <van-cell
            :title="$t('beePal.deal.buyerName')"
            :value="refer.nickname || $t('base.noNicknameUser')"
          ></van-cell>
          <van-cell :title="$t('beePal.deal.translateMode')">
            <div class="supportedTrans">
              <div
                v-for="item in refer.supportedTrans"
                :key="item"
                class="flex row-v-c"
              >
                {{ $t('beePal.payment.' + item) }}
                <img :src="require('@/assets/img/' + item + '.png')"/>
              </div>
            </div>
          </van-cell>
        </div>
      </pull-down>
    </div>
  </van-popup>
</template>

<script>
  import { Button, Cell, Field, Form, Icon, Popup } from 'vant'
  import { money_filter, tofixed_decimal } from '@/utils/money'
  import BuyModeAction from './buyModeAction.vue'
  import PullDown from '@/components/BeePalComp/PullDown'
  import { mapGetters } from 'vuex'
  // import { settings } from '@/config'
  // import Storage from '@/utils/storage'

  export default {
    name: 'SellModal',
    filters: {
      money_filter,
      tofixed_decimal,
    },
    components: {
      BuyModeAction,
      PullDown,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Button.name]: Button,
      [Form.name]: Form,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
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
      forms: {
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
        countDown: 45, // 45秒倒计时
        timer: null, // 定时器
        actionShow: false, // 收款方式动作面板显示
        detailShow: false, // 订单信息显示
        methodMap: require('../config').supportTrans,
      }
    },
    computed: {
      ...mapGetters(['G_singleCoin', 'VG__userChannel']),
      accordingTo: {
        get: function() {
          return this.forms.type
        },
        set: function(val) {
          this.forms.type = val
        },
      },
      rate: {
        get: function() {
          const coin = this.G_singleCoin(this.refer.coin.code)
          return this.forms.type === 1
            ? money_filter(this.forms.rate, coin.decimal)
            : money_filter(this.forms.rate, 2)
        },
        set: function(val) {
          this.forms.rate = val
        },
      },
      realCurrency() {
        return this.refer.currency ? this.refer.currency.code : ''
      }
    },
    watch: {
      show(newV) {
        if (newV) {
          // this.$data.countDown = this.$options.data().countDown
          this.$nextTick(() => {
            if (this.$refs.amountInput) {
              this.$refs.amountInput.focus()
            }
          })
          this.timer = setInterval(() => {
            this.countDown -= 1
            if (this.countDown === 0) {
              this.$emit('changeShow', false)
              this.$toast(this.$t('beePal.deal.overtime'))
            }
          }, 1000)
        } else {
          clearInterval(this.timer)
          this.timer = null
          setTimeout(() => {
            this.$data.countDown = this.$options.data().countDown
          }, 500)
        }
      },
    },
    methods: {
      placeOrder() {
        if (JSON.stringify(this.refer) === '{}') return
        const channelExist = this.VG__userChannel.some(item => {
          if (
            item.type === this.methodMap[this.refer.supportedTrans[this.forms.method]]
          ) {
            this.forms.channel = item
            return item
          }
        })
        if (!channelExist) {
          this.$dialog
            .confirm({
              message: this.$t('beePal.deal.openTip'),
              className: 'dialog',
              confirmButtonText: this.$t('beePal.deal.openNow'),
              cancelButtonText: this.$t('beePal.deal.cancel'),
            })
            .then(() => {
              this.$router.push('/otcPayment')
            })
          return
        }
        if (
          (this.forms.type === 1 &&
            (Number(this.forms.amount) < this.refer.temp_min ||
              Number(this.forms.amount) > this.refer.temp_max)) ||
          (this.forms.type === 0 &&
            (Number(this.forms.rate) < this.refer.temp_min ||
              Number(this.forms.rate) > this.refer.temp_max))
        ) {
          this.$toast({
            message: this.$t('beePal.deal.outOfRange'),
            position: 'bottom',
          })
        } else {
          this.$parent.subtend = this.refer
          this.$parent.endForms = this.forms
          this.$emit('changeShow', false)
          this.$parent.type = 'sell'
          // this.$parent.securityShow = true
          this.$emit('toSell', 'toSell')
        }
      },
      formatter(val) {
        const coin = this.G_singleCoin(this.refer.coin.code)
        const splitVal = val.split('.')
        if (val === '-') {
          return 0
        } else if (
          Number(val) > Number(this.refer.temp_max / this.refer.endRate) &&
          this.forms.type === 0
        ) {
          this.$toast({
            message: this.$t('beePal.deal.notCrossMax'),
            position: 'bottom',
          })
          return Number(this.refer.temp_max / this.refer.endRate)
        } else if (
          Number(val) > Number(this.refer.temp_max) &&
          this.forms.type === 1
        ) {
          this.$toast({
            message: this.$t('beePal.deal.notCrossMax'),
            position: 'bottom',
          })
          return Number(this.refer.temp_max)
        } else if (Number(val) > Number(coin.amount) && this.forms.type === 0) {
          this.$toast({
            message: this.$t('beePal.deal.notthrough'),
            position: 'bottom',
          })
          return Number(coin.amount)
        } else if (
          Number(val) > Number(coin.amount * this.refer.endRate) &&
          this.forms.type === 1
        ) {
          this.$toast({
            message: this.$t('beePal.deal.notthrough'),
            position: 'bottom',
          })
          return Number(coin.amount * this.refer.endRate)
        } else if (
          splitVal[1] &&
          splitVal[1].length > coin.decimal &&
          this.forms.type === 0
        ) {
          return splitVal[0] + '.' + splitVal[1].substr(0, coin.decimal)
        } else if (
          splitVal[1] &&
          splitVal[1].length > 2 &&
          this.forms.type === 1
        ) {
          return splitVal[0] + '.' + splitVal[1].substr(0, 2)
        } else {
          return val
        }
      },
      inputAmount(val) {
        if (this.forms.type === 0) {
          const rate = val * this.refer.endRate
          this.rate = rate
        } else {
          const rate = val / this.refer.endRate
          this.rate = rate
        }
      },
      changeAccording() {
        this.accordingTo === 0 ? (this.accordingTo = 1) : (this.accordingTo = 0)
        this.forms.amount = ''
        this.forms.rate = ''
      },
      setAll() {
        const coin = this.G_singleCoin(this.refer.coin.code)
        const amount = Number(coin.amount)
        const rate = amount * this.refer.endRate
        if (rate > this.refer.temp_max) {
          if (this.forms.type === 0) {
            this.forms.amount = Number(this.refer.temp_max / this.refer.endRate)
          } else {
            this.forms.amount = Number(this.refer.temp_max)
          }
        } else {
          if (this.forms.type === 0) {
            this.forms.amount = Number(amount)
          } else {
            this.forms.amount = Number(rate)
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .sellModal {
    min-height: 200px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .content {
    padding: 20px 15px 15px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
      border-bottom: 0.5px solid $BorderColor4;

      .title {
        color: $labelColor1;
        font-size: 20px;
      }

      .price {
        font-size: 12px;
        color: $labelColor23;

        .num {
          color: $labelColor13;
          margin-left: 8px;
        }
      }
    }

    .buyInput {
      margin-top: 20px;

      .purchaseBase {
        font-size: 13px;
        color: $labelColor13;
        display: flex;
        width: fit-content;
        margin-left: auto;
        align-items: center;

        .switch {
          margin-right: 6px;
        }
      }

      .inputBox {
        margin-top: 8px;
        padding: 0 15px;
        border: 1px solid $labelColor8;
        border-radius: 6px;

        &:focus-within {
          border-color: $labelColor13
        }

        .van-field {
          padding: 0;

          .extra {
            margin-left: 10px;
            font-size: 15px;

            .realCurrency {
              color: $labelColor1;
            }

            .line {
              margin: 0 5px;
              transform: scale(0.6, 1.5) translateY(-0.5px);
              color: $labelColor8;
            }

            .all {
              color: $labelColor13;
            }
          }

          height: fit-content;
          padding: 13px 0;

          ::v-deep .van-field__body {
            height: 100%;

            .van-field__control {
              color: $labelColor1;
              height: 100%;
            }
          }

          &.amount {
            border-bottom: 1px solid $labelColor8;

            &:focus-within {
              border-color: $labelColor13
            }

            ::v-deep .van-field__control {
              font-size: 22px;

              &:focus {
                caret-color: $labelColor13;
              }
            }
          }

          &.rate {
            ::v-deep .van-field__control {
              font-size: 15px;
            }
          }
        }
      }

      .quota {
        color: $labelColor24;
        font-size: 13px;
        line-height: 20px;
        margin-top: 6px;
      }
    }

    .methods {
      margin-top: 15px;
      margin-bottom: 15px;

      .van-cell {
        padding: 10px 0;
        font-size: 14px;

        .van-cell__value {
          color: $labelColor1;

          .box {
            width: fit-content;
            margin-left: auto;
          }

          img {
            max-height: 24px;
            max-width: 28px;
            height: auto;
            width: auto;
          }
        }
      }
    }

    .btnGroups {
      display: flex;
      align-items: center;

      .cancel {
        color: $labelColor20;
        width: 100px;
        margin-right: 12px;
        border: 1px solid $cellBorderColor;
        border-radius: 6px;
      }

      .placeOrder {
        background: $linearBgColor-06;
        border: none;
        border-radius: 6px;
        color: $cardColor;
        flex-grow: 1;

        &.canClick {
          background: $linearBgColor-03;
        }
      }
    }

    .van-button--disabled {
      opacity: 1;
    }
  }

  .orderDetail {
    .title {
      padding: 10px 20px 10px;
      border-bottom: 0.5px solid $BorderColor4;

      &:active {
        background-color: $background;
      }
    }

    .van-cell {
      padding: 10px 20px;

      .van-cell__title {
        color: $labelColor20;
        font-size: 14px;
      }

      .van-cell__value {
        color: $labelColor1;
        font-size: 14px;
      }
    }

    .supportedTrans {
      div {
        text-align: right;
        justify-content: flex-end;

        &:not(:first-child) {
          margin-top: 10px;
        }

        img {
          max-height: 24px;
          max-width: 28px;
          height: auto;
          width: auto;
          margin-left: 10px;
        }
      }
    }
  }
</style>
