<template>
  <div class="offerConfirm">
    <my-head :title="$t('beePal.trade.offerConfirm_title')" :goBackPath="'/createOffer/offerAuth'" border></my-head>
    <div class="main-content">
      <div class="detail">
        <div class="payment">
          <div class="title">
            <van-cell :title="$t('beePal.trade.paymentDetail')"/>
          </div>
          <!-- 訂單號 -->
          <!-- <van-cell :title="$t('beePal.trade.orderNumber')" :value="datas.orderNumber" :border="false" /> -->
          <!-- 加密貨幣 -->
          <van-cell :title="$t('beePal.trade.orderCoin')" :value="supportCoin[datas.coin].name" :border="false" />
          <!-- 購買/出售 -->
          <van-cell :title="$t('beePal.trade.orderType')" :value="$t(`beePal.trade.${typeMap[datas.type]}`)" :border="false" />
          <!-- 支付方式 -->
          <van-cell
            :title="$t('beePal.trade.orderMethod')"
            :border="false"
          >
            <template #default>
              <div class="method">
                <div v-for="(item,index) in datas.method" :key="index" class="image">
                  <img :src="require(`@/assets/img/${methodMap[getMethodDetail(item).type]}.png`)"/>
                </div>
              </div>
            </template>
          </van-cell>
          <!-- 開戶行 -->
          <!-- <van-cell :title="$t('beePal.trade.orderBank')" :value="datas.bank" :border="false" /> -->
          <!-- 銀行卡號 -->
          <!-- <van-cell :title="$t('beePal.trade.orderBankNumber')" :value="datas.bankNumber" :border="false" /> -->
          <!-- 首選貨幣 -->
          <!-- <van-cell :title="$t('beePal.trade.orderCurrency')" :value="datas.currency" :border="false" /> -->
        </div>
        <div class="price">
          <div class="title">
            <van-cell :title="$t('beePal.trade.priceDetail')"/>
          </div>
          <!-- 出售額度 -->
          <van-cell :title="$t('beePal.trade.amount')" :value="`${datas.amount}`" :border="false" />
          <!-- 交易費率 -->
          <van-cell :title="$t('beePal.trade.orderRate')" :value="$t(`beePal.trade.${rateMap[datas.rate]}`)" :border="false" />
          <!-- 最低限額 -->
          <van-cell :title="$t('beePal.trade.orderMinLimit')" :value="`${datas.minLimit} ${realCurrency.code}`" :border="false" />
          <!-- 最高限額 -->
          <van-cell :title="$t('beePal.trade.orderMaxLimit')" :value="`${datas.maxLimit} ${realCurrency.code}`" :border="false" />
          <!-- 出價價格 -->
          <van-cell v-if="datas.rate === 0" :title="$t('beePal.trade.orderPrice')" :value="`${datas.fixedPrice}`" :border="false" />
          <!-- 出價差額 -->
          <van-cell v-else :title="$t('beePal.trade.orderDifferent')" :value="`${datas.marketPrice}${$t('beePal.trade.rateUnit')}`" :border="false" />
          <!-- 出價時間限制 -->
          <van-cell :title="$t('beePal.trade.orderTimeLimit')" :value="`${datas.timeLimit}${$t('beePal.trade.timeUnit')}`" :border="false" />
        </div>
        <div class="auth">
          <div class="title">
            <van-cell :title="$t('beePal.trade.authDetail')"/>
          </div>
          <!-- 交易限制 -->
          <van-cell :title="$t('beePal.trade.orderAuth')" :value="datas.needAdvanceAuth ? $t('beePal.trade.advanceAuth') : $t('beePal.trade.normalAuth') " :border="false" />
          <!-- 交易次數要求 -->
          <!-- 2021.10.26 新設計把「交易次數要求」拿掉 -->
          <!-- <van-cell :title="$t('beePal.trade.orderCount')" :value="datas.count" :border="false" /> -->
          <!-- 新用戶限額 -->
          <!-- 2021.09.01 設計說暫時先把「新用戶限額」拿掉 -->
          <!-- <van-cell :title="$t('beePal.trade.orderNewUserLimit')" :value="datas.newUserLimit" :border="false" /> -->
        </div>
      </div>
      <div class="btnGroup">
        <van-button class="nextStep" @click="nextStep">
          {{ isEditMode ? $t('beePal.trade.updateTrade') : $t('beePal.trade.confirmAndSubmit') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import config from '../config'
import { createTrade, editTrade } from '@/api'
import { mapActions, mapGetters } from 'vuex'
import { Row, Col, Button, Cell, Checkbox, Circle, Loading, Overlay, ActionSheet, Icon } from 'vant'

export default {
  name: 'OfferConfirm',
  components: {
    myHead,
    [Row.name]: Row,
    [Col.name]: Col,
    [Circle.name]: Circle,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
  },
  data() {
    return {
      step: 4,
      typeMap: config.typeMap,
      methodMap: config.methodMap,
      paymentIdMap: config.paymentIdMap,
      rateMap: config.rateMap,
    }
  },
  computed: {
    ...mapGetters(['VG__userChannel', 'supportCoin']),
    datas() {
      return this.$Storage.getSession('createOfferDatas')
    },
    isEditMode() {
      const createOfferDatas = this.$Storage.getSession('createOfferDatas')
      return createOfferDatas ? createOfferDatas.isEditMode : false
    },
    realCurrency() {
      const coinList = this.$Storage.getLocal('coinList')
      const realCurrency = coinList.find(item => item.id === this.datas.currency)
      return realCurrency
    },
  },
  created() {
    this.VA__getUserChannel()
    if (!this.datas) {
      this.$router.push({
        name: 'offerDetail',
        params: {
          step: 1,
        }
      })
    }
  },
  mounted() {

  },
  methods: {
    ...mapActions('user', ['VA__getUserChannel']),
    async nextStep() {
      const params = {
        type: this.datas.type,
        coin_id: this.supportCoin[this.datas.coin].id,
        currency_id: this.realCurrency.id,
        payment_id: this.datas.method,
        min_trade_limit: this.datas.minLimit,
        max_trade_limit: this.datas.maxLimit,
        bid_time_limit: this.datas.timeLimit * 60, // 分鐘轉換成秒
        taker_limit: this.datas.needAdvanceAuth ? 2 : 1,
        // trade_count_limit: this.datas.count, // 2021.10.26 新設計把「交易次數要求」拿掉
        amount: this.datas.amount,
      }
      // 依照「交易費率」的選擇來加入price, rate兩個參數
      if (this.datas.rate === 0) {
        params.price = this.datas.fixedPrice
      } else {
        params.rate = this.datas.marketPrice / 100
      }

      if (this.isEditMode) {
        await this.editTrade(this.datas.orderNumber, params)
      } else {
        await this.createTrade(params)
      }
    },
    async createTrade(params) {
      await createTrade(params).then(async res => {
        if (res.code === 0) {
          setTimeout(() => {
            this.$router.push({
              name: 'offerSuccess',
              params: {
                step: 5,
              },
            })
          })
        } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.$toast(this.$t('base.unknownErr'))
        }
      }).catch(err => {
        console.log('cerateTrade-err', err)
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    async editTrade(id, params) {
      await editTrade(id, params).then(async res => {
        if (res.code === 0) {
          setTimeout(() => {
            this.$router.push({
              name: 'offerSuccess',
              params: {
                step: 5,
              },
            })
          })
        } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.$toast(this.$t('base.unknownErr'))
        }
      }).catch(err => {
        console.log('editTrade-err', err)
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    getMethodDetail(id) {
      return this.VG__userChannel.find(item => item.id === id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

$radius: 6px;

.offerConfirm {
  height: 100%;

  .main-content {
    display: flex;
    height: 200%;
    box-sizing: border-box;
    flex-direction: column;
    background: $pageBgColor;
    color: $labelColor1;
    padding-left: 15px;
    padding-right: 15px;

    .title {
      .van-cell {
        padding: 15px 0;
        font-size: 24px;
        font-weight: bold;
      }
    }

    .detail {
      .title {
        .van-cell {
          padding: 15px 0;
          font-size: 24px;
          font-weight: bold;
          color: black;
        }
      }

      .van-cell {
        padding: 15px 0;
        font-size: 14px;
        color: #666666;

        .van-cell__title {
          font-weight: 500;
        }

        .van-cell__value {

          .box {
            width: fit-content;
            margin-left: auto;
          }
        }
      }

      .payment {
        // border-bottom: 0.5px solid $BorderColor4;
        .method {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: flex-end;

          .image {
            margin-right: 5px;

            img {
              max-height: 24px;
              max-width: 28px;
              height: auto;
              width: auto;
            }
          }
        }
      }
    }

    .btnGroup {
      display: flex;
      justify-content: center;

      .nextStep {
        background: #FFCA00;
        border-radius: $radius;
        color: #fff;
        font-size: 16px;
        width: 80%;
        line-height: 44px;
        margin-top: 60px;
        margin-bottom: 60px;
      }
    }
  }
}

</style>
