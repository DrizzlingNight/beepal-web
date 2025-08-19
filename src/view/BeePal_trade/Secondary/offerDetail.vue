<template>
  <div class="offerDetail">
    <my-head :title="isEditMode ? $t('beePal.trade.updateTrade') : $t('beePal.trade.createOffer')" :goBackPath="'/trade'" border></my-head>
    <div class="main-content">
      <div class="title">
        <van-cell :title="$t('beePal.trade.offerDetail_title')" />
      </div>
      <div class="content">
        <div class="coin">
          <van-cell
            :title="$t('beePal.trade.changeCoin')"
            :is-link="true"
            @click="coinAcitonShow = true"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ supportCoin[myDatas.coin].name }}
                </div>
                <img :src="`/static/img/coins/BeePal/${supportCoin[myDatas.coin].code}.png`" />
              </div>
            </template>
          </van-cell>
          <!-- 加密貨幣彈窗 -->
          <coin-action
            v-model="coinAcitonShow"
            :coin.sync="myDatas.coin"
            :support-coin="supportCoin"
          />
        </div>
        <div class="type">
          <van-cell
            :title="$t('beePal.trade.changeType')"
            :is-link="true"
            @click="typeAcitonShow = true"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ $t(`beePal.trade.${typeMap[myDatas.type]}`) }}
                </div>
              </div>
            </template>
          </van-cell>
          <!-- 出價方式彈窗 -->
          <type-action
            v-model="typeAcitonShow"
            :type.sync="myDatas.type"
            :offer-type="offerType"
          />
        </div>
        <div class="payment">
          <van-cell
            :title="$t('beePal.trade.changePayment')"
            :is-link="true"
            @click="paymentAcitonShow = true"
          >
            <template #default>
              <div v-for="(item,index) in myDatas.method" :key="index">
                <div class="box flex row-v-c">
                  <div class="mr8">
                    {{ $t(`beePal.payment.${methodMap[getMethodDetail(item).type]}`) }}
                  </div>
                  <img :src="require(`@/assets/img/${methodMap[getMethodDetail(item).type]}.png`)"/>
                </div>
              </div>
            </template>
          </van-cell>
          <!-- 支付/收款方式彈窗 -->
          <payment-action
            v-model="paymentAcitonShow"
            :method.sync="myDatas.method"
            :support-method="supportMethod"
          />
        </div>
        <div class="currency">
          <van-cell
            :title="$t('beePal.trade.changeCurrency')"
            :is-link="true"
            :border="false"
            @click="currencyAcitonShow = true"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ realCurrency.code }}
                </div>
              </div>
            </template>
          </van-cell>
          <p class="description">{{ $t('beePal.trade.changeCurrencyDescription') }}</p>
          <!-- 支付/收款貨幣彈窗 -->
          <currency-action
            v-model="currencyAcitonShow"
            :currency.sync="myDatas.currency"
            :currency-list="currencyList"
          />
        </div>
        <div class="tradeFee">
          <van-cell
            :title="`${$t('beePal.trade.tradeFee')}（${myDatas.tradeFee.coin_code || ''}）`"
            :border="false"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ myDatas.tradeFee.fee }}
                </div>
              </div>
            </template>
          </van-cell>
          <div class="description">
            <div class="balance">
              <p class="text">{{ `${$t('beePal.trade.walletBalance')}：` }}</p>
              <span class="amount">{{ balance }}</span>
            </div>
            <p class="credit" @click="myDatas.tradeFee.coin_code ? goCredit() : ''">{{ $t('beePal.trade.goCredit') }}</p>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <van-button :disabled="noClick || !myDatas.tradeFee.coin_code" class="nextStep" @click="nextStep">
          {{ $t('beePal.trade.nextStep') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import CoinAction from '../components/coinAction'
import TypeAction from '../components/typeAction'
import PaymentAction from '../components/paymentAction'
import CurrencyAction from '../components/currencyAction'
import config from '../config'
import { getCoinList, updateUser, getTradeFee } from '@/api'
import { getBeePalWallet } from '@/api/beePal'
import { money_filter } from '@/utils/money'
// import { settings } from '@/config'
import { mapActions, mapGetters } from 'vuex'
import { Row, Col, Button, Cell, Checkbox, Circle, Loading, Overlay, ActionSheet, Icon } from 'vant'
import Storage from '@/utils/storage'

export default {
  name: 'OfferDetail',
  components: {
    myHead,
    CoinAction,
    TypeAction,
    PaymentAction,
    CurrencyAction,
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
      // ---初始化資料
      initDatas: {
        orderNumber: '',
        coin: 0,
        type: this.$route.params.type || 0,
        method: [],
        bank: '',
        bankNumber: '',
        currency: null,
        tradeFee: {},
        amount: 0,
        rate: 0,
        fixedPrice: '',
        marketPrice: '',
        minLimit: '',
        maxLimit: '',
        timeLimit: '',
        needAdvanceAuth: false,
        count: '',
        newUserLimit: '',
      },
      // ---初始化資料
      myDatas: {
        coin: 0,
        type: 0,
        method: [],
        currency: 1,
        tradeFee: {},
      },
      currencyList: [], // 法幣列表
      userBalance: [],
      step: 1,
      coinAcitonShow: false,
      typeAcitonShow: false,
      paymentAcitonShow: false,
      currencyAcitonShow: false,
      offerType: config.offerType,
      typeMap: config.typeMap,
      supportMethod: config.supportMethod,
      methodMap: config.methodMap,
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo', 'VG__userChannel', 'supportCoin', 'VG__getCoinInfoById']),
    datas() {
      return this.$Storage.getSession('createOfferDatas') || this.initDatas
    },
    balance() {
      let coin = {}
      if (this.userBalance[0]) {
        coin = this.userBalance.find(item => item.coin_code === this.myDatas.tradeFee.coin_code)
      }
      return money_filter(coin.amount, 2) || 0
    },
    noClick() {
      const keys = Object.keys(this.myDatas)
      const needKeys = ['coin', 'type', 'method']
      let result = false
      keys.forEach(key => {
        if (needKeys.includes(key)) {
          // console.log('this.myDatas[key]', key, this.myDatas[key])
          if (Array.isArray(this.myDatas[key]) && !this.myDatas[key][0]) {
            result = true
          } else if (!String(this.myDatas[key])) {
            result = true
          }
        }
      })
      return result
    },
    isEditMode() {
      const createOfferDatas = this.$Storage.getSession('createOfferDatas')
      return createOfferDatas ? createOfferDatas.isEditMode : false
    },
    realCurrency() {
      const coinList = this.$Storage.getLocal('coinList')
      const realCurrency = coinList.find(item => item.id === this.myDatas.currency)
      return realCurrency
    },
  },
   created() {
    // this.$myConsole.log('supportCoin', this.supportCoin)
    Storage.setSession('goBackPath', null) // 先把goBackPath重置
    // 取得用戶設置的默認支付方式
    this.VA__getUserChannel()
    this.supportMethod = this.VG__userChannel.filter(item => item.is_default === true)
    // this.$myConsole.log('supportMethod', this.supportMethod)

    this.myDatas = {
      ...this.datas
    }

    if (!this.myDatas.currency) {
      // 取得法幣列表、用戶設置的默認法幣
      this.getCoinList()
      if (!this.VG__userInfo.currency) {
        // 這裡配合「默認法幣」去做更改
        this.setCurrency({
          id: 3,
          name: 'TWD',
          code: 'TWD',
        })
      } else {
        this.myDatas.currency = this.VG__userInfo.currency
      }
    }

    this.getUserBalance()
    this.getTradeFee()
  },
  mounted() {
    if (!this.supportMethod[0]) {
      this.$dialog
        .confirm({
          message: this.$t('beePal.trade.needSetDefaultOTCPayment'),
          className: 'dialog',
          confirmButtonText: this.$t('base.goSet'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          this.goOtcPayment()
        })
      this.$router.push('/trade')
    }
  },
  methods: {
    ...mapActions('user', ['VA__getUserChannel']),
    nextStep() {
      if (Number(this.myDatas.tradeFee.fee) > Number(this.balance)) {
        this.$toast(this.$t('beePal.trade.noEnoughFee'))
        return
      }
      this.setStorage()
      setTimeout(() => {
        this.$router.push({
          name: 'offerPrice',
          params: {
            step: 2,
          }
        })
      })
    },
    setStorage() {
      this.$Storage.setSession('createOfferDatas', this.myDatas)
    },
    getMethodDetail(id) {
      return this.VG__userChannel.find(item => item.id === id)
    },
    goOtcPayment() {
      Storage.setSession('goBackPath', '/trade')
      this.$router.push('/otcPayment')
    },
    async getCoinList() {
      const params = {
        page_size: 100,
      }
      await getCoinList(params).then(res => {
        const currency = res.data.results.filter(item => !item.is_crypto && item.active && item.code !== 'CNY') // 2021.12.08 因應營運需求,BeePal移除關於大陸的相關顯示
        this.$myConsole.log('currency', currency)
        this.currencyList = currency.map(item => {
          return {
            id: item.id,
            name: item.name,
            code: item.code,
          }
        })
      })
    },
    async setCurrency(item) {
      this.isLoading = true
      const params = {
        currency: item.id
      }
      await updateUser(this.VG__userInfo.id, params).then(res => {
        if (res.code === 0) {
          console.log('setCurrency-success')
          this.myDatas.currency = item.id
          Storage.setLocal('mainCoinSymbol', item.code)
        } else {
          console.log('setCurrency-err')
        }
        this.isLoading = false
      }).catch(err => {
        console.log('setCurrency-err', err)
        this.isLoading = false
      })
    },
    async getTradeFee() {
      await getTradeFee().then(res => {
        const coin = this.VG__getCoinInfoById(res.data.trade_publish_fee_coin)
        this.myDatas.tradeFee = {
          coin_id: coin.id,
          coin_code: coin.code,
          fee: money_filter(res.data.trade_publish_fee, 2)
        }
      }).catch(err => {
        console.log('getTradeFee-err', err)
      })
    },
    async getUserBalance() {
      await getBeePalWallet().then(async res => {
        this.userBalance = res.data.results
      }).catch(err => {
        console.log('getUserBalance-err', err)
      })
    },
    goCredit() {
      this.$router.push({
        name: 'gathering',
        params: {
          token: this.myDatas.tradeFee.coin_code,
        },
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

$radius: 6px;

.offerDetail {
  height: 100%;

  .main-content {
    display: flex;
    height: 100%;
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

    .content {
      .coin {
        border-bottom: 0.5px solid $BorderColor4;
        img {
          max-height: 24px;
          max-width: 28px;
          height: auto;
          width: auto;
        }
      }

      .type {
        border-bottom: 0.5px solid $BorderColor4;
      }

      .payment {
        border-bottom: 0.5px solid $BorderColor4;
        img {
          max-height: 24px;
          max-width: 28px;
          height: auto;
          width: auto;
        }

        .account-number {
          text-align: left;
          margin-bottom: 2px;
          border-bottom: 0.5px solid $BorderColor4;
        }

      }

      .currency {
        .van-cell {
          border-bottom: 0.5px solid $BorderColor4;
        }

        .description {
          font-size: 10px;
          color: #ED0000;
          padding-top: 4px;
        }
      }

      .tradeFee {
        .van-cell {
          border-bottom: 0.5px solid $BorderColor4;
          padding-bottom: 5px;
        }

        .description {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 6.5px;

          .balance {
            display: flex;
            flex-direction: row;

            .text {
              font-size: 12px;
              color: #666666;
            }
            .amount {
              font-size: 12px;
              color: #ED0000;
            }
          }

          .credit {
            cursor: pointer;
            font-size: 12px;
            color: #FFC006;
          }
        }
      }

      .van-cell {
        padding: 15px 0;
        font-size: 14px;

        .van-cell__title {
          font-weight: 500;
        }

        .van-cell__value {
          color: $labelColor1;

          .box {
            width: fit-content;
            margin-left: auto;
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

    .van-button--disabled {
      background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
    }
  }
}

</style>
