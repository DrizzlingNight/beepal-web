<template>
  <div class="offerPrice">
    <my-head :title="isEditMode ? $t('beePal.trade.updateTrade') : $t('beePal.trade.createOffer')" :goBackPath=" isEditMode ? '/trade' : '/createOffer/offerDetail'" border class="head">
      <template #right>
        <div v-if="isEditMode" class="delete" @click="confirmCloseTrade(datas.orderNumber)">
          <svg-icon :class-name="'delete-red'" :icon-class="'delete-red'"></svg-icon>
        </div>
      </template>
    </my-head>
    <div class="main-content">
      <div class="title">
        <van-cell :title="$t('beePal.trade.offerPrice_title')" />
      </div>
      <div class="content">
        <div class="rate">
          <van-cell
            :title="$t('beePal.trade.rate')"
            :is-link="true"
            @click="rateAcitonShow = true"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ $t(`beePal.trade.${rateMap[myDatas.rate]}`) }}
                </div>
              </div>
            </template>
          </van-cell>
          <!-- 交易費率彈窗 -->
          <rate-action
            v-model="rateAcitonShow"
            :rate.sync="myDatas.rate"
            :support-rate="supportRate"
          />
        </div>
        <van-cell-group class="input__wrap">
          <!-- 出售額度 -->
          <van-field
            v-model="myDatas.amount"
            :disabled="isEditMode"
            :border="false"
            :label="$t('beePal.trade.amount')"
            :error-message="errorMsg.amount"
            :placeholder="$t('beePal.trade.placeholder_amount')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="amount"
          ></van-field>
          <!-- 餘額 -->
          <div class="balance">
            <div class="title">
              {{ `${$t('beePal.trade.nowBalance')}: ` }}
              <span class="mr3">{{ money_filter(balance, 2) }}</span>
              <span>{{ supportCoin[datas.coin].name }}</span>
            </div>
            <van-tag
              v-if="!isEditMode"
              class="tag"
              round
              plain
              @click="myDatas.amount = balance"
            >
              {{ $t('beePal.tokenDetail.all') }}
            </van-tag>
          </div>
          <van-field
            v-if="myDatas.rate === 0"
            v-model.trim="myDatas.fixedPrice"
            :border="false"
            :label="$t('beePal.trade.fixedPrice_label')"
            :error-message="errorMsg.fixedPrice"
            :placeholder="$t('beePal.trade.placeholder_fixedPrice')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="fixedPrice"
          />
          <van-field
            v-show="myDatas.rate === 1"
            v-model="myDatas.marketPrice"
            :border="false"
            :label="$t('beePal.trade.marketPrice_label')"
            :error-message="errorMsg.marketPrice"
            :placeholder="$t('beePal.trade.placeholder_marketPrice')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="marketPrice"
          >
            <template #extra>
              <p>{{ $t('beePal.trade.rateUnit') }}</p>
            </template>
          </van-field>
          <van-field
            v-model="myDatas.minLimit"
            :border="false"
            :label="$t('beePal.trade.minLimit')"
            :error-message="errorMsg.minLimit"
            :placeholder="$t('beePal.trade.placeholder_minLimit')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="minLimit"
          >
            <template #extra>
              <p>{{ realCurrency.code }}</p>
            </template>
          </van-field>
          <van-field
            v-model="myDatas.maxLimit"
            :border="false"
            :label="$t('beePal.trade.maxLimit')"
            :error-message="errorMsg.maxLimit"
            :placeholder="$t('beePal.trade.placeholder_maxLimit')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="maxLimit"
          >
            <template #extra>
              <p>{{ realCurrency.code }}</p>
            </template>
          </van-field>
          <van-field
            v-model="myDatas.timeLimit"
            :border="false"
            :label="$t('beePal.trade.timeLimit')"
            :error-message="errorMsg.timeLimit"
            :placeholder="$t('beePal.trade.placeholder_timeLimit')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="timeLimit"
          >
            <template #extra>
              <p>{{ $t('beePal.trade.timeUnit') }}</p>
            </template>
          </van-field>
        </van-cell-group>
        <div class="tip">
          <p>{{ $t('beePal.trade.offerPrice_tip') }}</p>
        </div>
      </div>
      <div class="btnGroup">
        <van-button :disabled="noClick" class="nextStep" @click="nextStep">
          {{ $t('beePal.trade.nextStep') }}
        </van-button>
      </div>
    </div>
    <!-- 安全驗證碼彈窗 -->
    <security-code-modal
      v-if="securityCodeModal.show"
      v-model="securityCodeModal.show"
      @securityCodeChange="securityCodeChange"
      @confrim="closeTrade"
    />
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import FormValidatorMixin from '@/mixins/form-validator'
import RateAction from '../components/rateAction'
import config from '../config'
import { money_filter } from '@/utils/money'
import { positiveNumberFormatter } from '@/utils/formatter'
import { getBeePalWallet } from '@/api/beePal'
// import { settings } from '@/config'
import { Row, Col, Button, Field, Cell, CellGroup, Checkbox, Circle, Loading, Overlay, ActionSheet, Icon, Tag } from 'vant'
import { mapGetters } from 'vuex'
import { closeTrade } from '@/api'
import SecurityCodeModal from '@/components/dialog/SecurityCodeModal'
// import Storage from '@/utils/storage'

export default {
  name: 'OfferPrice',
  components: {
    myHead,
    RateAction,
    SecurityCodeModal,
    [Row.name]: Row,
    [Col.name]: Col,
    [Circle.name]: Circle,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
  },
  mixins: [FormValidatorMixin],
  data() {
    return {
      money_filter,
      positiveNumberFormatter,
      myDatas: {
        amount: '',
        rate: 0,
        fixedPrice: '',
        marketPrice: '',
        minLimit: '',
        maxLimit: '',
        timeLimit: '',
      },
      // 安全驗證碼彈窗
      securityCodeModal: {
        show: false,
        securityCode: '',
        tradeId: '',
      },
      userBalance: [],
      setp: 2,
      rateAcitonShow: false,
      supportRate: config.supportRate,
      rateMap: config.rateMap,
      errorMsg: {
        amount: '',
        fixedPrice: '',
        marketPrice: '',
        minLimit: '',
        maxLimit: '',
        timeLimit: '',
      },
      rules: {
        amount: [
          {
            validator: (rule, value, callback) => {
              value = this.myDatas.amount
              if (!value && value !== 0) {
                callback(`${this.$t('beePal.trade.amount')}${this.$t('base.noEmpty')}`)
              } else if (Number(value) <= 0) {
                callback(`${this.$t('beePal.trade.amount')}${this.$t('base.noZero')}`)
              } else if (Number(value) > parseFloat(this.balance)) {
                callback(`${this.$t('beePal.trade.amount')}${this.$t('base.noMaxThan')}${this.$t('beePal.trade.nowBalance')}`)
              } else {
                callback()
              }
            },
          },
        ],
        fixedPrice: [
          {
            validator: (rule, value, callback) => {
              value = this.myDatas.fixedPrice
              if (this.myDatas.rate === 1) {
                callback()
              } else if (!value && value !== 0) {
                callback(`${this.$t('beePal.trade.fixedPrice')}${this.$t('base.noEmpty')}`)
              } else if (Number(value) <= 0) {
                callback(`${this.$t('beePal.trade.fixedPrice')}${this.$t('base.noZero')}`)
              } else {
                callback()
              }
            },
          },
        ],
        marketPrice: [
          {
            validator: (rule, value, callback) => {
              value = this.myDatas.marketPrice
              if (this.myDatas.rate === 0) {
                callback()
              } else if (!value && value !== 0) {
                callback(`${this.$t('beePal.trade.marketPrice')}${this.$t('base.noEmpty')}`)
              } else if (Number(value) <= 0) {
                callback(`${this.$t('beePal.trade.marketPrice')}${this.$t('base.noZero')}`)
              } else {
                callback()
              }
            },
          },
        ],
        minLimit: [
          {
            validator: (rule, value, callback) => {
              value = this.myDatas.minLimit
              if (!value && value !== 0) {
                callback(`${this.$t('beePal.trade.minLimit')}${this.$t('base.noEmpty')}`)
              } else if (Number(value) > Number(this.myDatas.maxLimit)) {
                callback(`${this.$t('beePal.trade.minLimit')}${this.$t('base.noMaxThan')}${this.$t('beePal.trade.maxLimit')}`)
              } else if (Number(value) <= 0) {
                callback(`${this.$t('beePal.trade.minLimit')}${this.$t('base.noZero')}`)
              } else {
                callback()
              }
            },
          },
        ],
        maxLimit: [
          {
            validator: (rule, value, callback) => {
              value = this.myDatas.maxLimit
              if (!value && value !== 0) {
                callback(`${this.$t('beePal.trade.maxLimit')}${this.$t('base.noEmpty')}`)
              } else if (Number(value) < Number(this.myDatas.minLimit)) {
                callback(`${this.$t('beePal.trade.maxLimit')}${this.$t('base.noMinThan')}${this.$t('beePal.trade.minLimit')}`)
              } else if (Number(value) <= 0) {
                callback(`${this.$t('beePal.trade.maxLimit')}${this.$t('base.noZero')}`)
              } else {
                callback()
              }
            },
          },
        ],
        timeLimit: [
          {
            validator: (rule, value, callback) => {
              value = this.myDatas.timeLimit
              if (!value && value !== 0) {
                callback(`${this.$t('beePal.trade.timeLimit')}${this.$t('base.noEmpty')}`)
              } else if (Number(value) <= 0) {
                callback(`${this.$t('beePal.trade.timeLimit')}${this.$t('base.noZero')}`)
              } else if (Number(value) < 5) {
                callback(`${this.$t('beePal.trade.timeLimit')}${this.$t('base.noMinThan')} 5 ${this.$t('beePal.trade.timeUnit')}`)
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
    ...mapGetters(['supportCoin']),
    datas() {
      return this.$Storage.getSession('createOfferDatas')
    },
    balance() {
      let coin = {}
      if (this.userBalance[0]) {
        coin = this.userBalance.find(item => item.coin_code === this.supportCoin[this.datas.coin].code)

        // 如果出售的貨幣跟廣告費一樣就要先減掉廣告費
        if (coin.coin_code === this.datas.tradeFee.coin_code) {
          coin.amount = Number(coin.amount) - Number(this.datas.tradeFee.fee)
        }
      }

      return coin.amount || 0
    },
    noClick() {
      const keys = Object.keys(this.myDatas)
      const needKeys = {
        0: ['amount', 'rate', 'fixedPrice', 'minLimit', 'maxLimit', 'timeLimit'],
        1: ['amount', 'rate', 'marketPrice', 'minLimit', 'maxLimit', 'timeLimit'],
      }
      let result = false
      keys.forEach(key => {
        if (needKeys[this.myDatas.rate].includes(key)) {
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
    if (!this.datas) {
      this.$router.push({
        name: 'offerDetail',
        params: {
          step: 1,
        }
      })
    } else {
      this.myDatas = {
        ...this.datas
      }
      this.getUserBalance()
    }
  },
  mounted() {
  },
  methods: {
    nextStep() {
      if (this.$__validate()) {
        this.setStorage()
        setTimeout(() => {
          this.$router.push({
            name: 'offerAuth',
            params: {
              step: 3,
            },
          })
        })
      }
    },
    setStorage() {
      this.$Storage.setSession('createOfferDatas', this.myDatas)
    },
    async getUserBalance() {
      await getBeePalWallet().then(async res => {
        this.userBalance = res.data.results
      }).catch(err => {
        console.log('getUserBalance-err', err)
      })
    },
    confirmCloseTrade(tradeId) {
      this.$dialog
        .confirm({
          message: this.$t('beePal.trade.deleteTradeMessage'),
          className: 'dialog',
          confirmButtonText: this.$t('base.confirm'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          this.securityCodeModal.show = true
          this.securityCodeModal.tradeId = tradeId
        })
        .catch(() => {
        })
    },
    securityCodeChange(code) {
      // console.log('securityCodeChange', code)
      this.securityCodeModal.securityCode = code
    },
    async closeTrade() {
      const params = {
        security_code: this.securityCodeModal.securityCode
      }
      await closeTrade(this.securityCodeModal.tradeId, params).then(res => {
        if (res.code === 0) {
          this.$toast(this.$t('tip.deleteSuccess'))
          setTimeout(() => {
            this.$router.push('/trade')
          }, 1000)
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.$toast(this.$t('base.unknownErr'))
        }
        this.securityCodeModal.show = false
      }).catch(err => {
        console.log('closeTrade-err', err)
        this.securityCodeModal.show = false
        this.$toast(this.$t('base.unknownErr'))
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

$radius: 6px;

.offerPrice {
  height: 100%;

  .head {
    .delete {
      cursor: pointer;
      display: flex;
      width: 23.5px;
      font-size: 12px;
      color: #ED0000;
    }
  }

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
      .amount,
      .fixedPrice,
      .marketPrice,
      .minLimit,
      .maxLimit,
      .timeLimit {
        border-bottom: 0.5px solid $BorderColor4;
        p {
          color: #969799;
        }
      }

      .balance {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        // padding: 0 15px 15px 15px;
        background-color: $pageBgColor;

        .title {
          font-size: 12px;
          color: #969799;
        }

        .tag {
          margin-top: 5px;
          // color: $labelColor21;
          // border-color: $BorderColor4;
          color: $labelColor13;
          border-color: $labelColor13;
          padding: 1px 6px;
        }
      }

      .tip {
        color: #969799;
        font-size: 12px;
        border-bottom: 0px;
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
