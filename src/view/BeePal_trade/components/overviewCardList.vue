<template>
  <div class="overviewCardList">
    <div class="content">
      <van-pull-refresh
        v-model="state.refreshing"
        :loading-text="$t('beePal.tokenDetail.loading')"
        :loosing-text="$t('beePal.tokenDetail.loosingText')"
        :pulling-text="$t('beePal.tokenDetail.pullingText')"
        disabled
        @refresh="$emit('onRefresh')"
      >
        <!-- 訂單列表 -->
        <order-list />
        <!-- 支付方式 -->
        <div class="payment" @click="goOtcPayment">
          <van-cell :border="false">
            <template #title>
              <div class="title">
                {{ $t('beePal.trade.payment') }}
              </div>
            </template>
            <template #default>
              <div class="subTitle">
                {{ $t('beePal.trade.firstChoosePayment') }}
              </div>
              <div class="image">
                <img
                  v-for="(item, index) in supportMethod"
                  :key="index"
                  :src="require('@/assets/img/' + methodMap[item.type] + '.png')"
                />
              </div>
              <svg-icon :class-name="'arrow-right-gray'" :icon-class="'arrow-right-gray'" />
            </template>
          </van-cell>
        </div>
        <van-cell-group>
          <!-- 交易率 -->
          <div class="dealRate">
            <van-cell :title="$t('beePal.trade.dealRate')" :border="false" class="title">
              <template #default>
                <div class="month-siwtch" @click="dateTimeShow = true">
                  <svg-icon :class-name="'switch-yellow'" :icon-class="'switch-yellow'" />
                  <p class="text">{{ $t('beePal.trade.monthSiwtch') }}</p>
                </div>
              </template>
            </van-cell>
            <van-cell class="detail">
              <template #title>
                <div class="subTitle">
                  <p>{{ `${dealRate.month}${$t('beePal.trade.month')}${$t('beePal.trade.successDeal')}` }}</p>
                </div>
                <div class="amount">
                  <p class="dealCount">{{ `${dealRate.count} ${$t('beePal.trade.dealUnit')}` }}</p>
                </div>
              </template>
              <template #default>
                <div class="subTitle">
                  <p>{{ `${dealRate.month}${$t('beePal.trade.month')}${$t('beePal.trade.successDealRate')}&nbsp;${dealRate.rate}` }}</p>
                </div>
                <div class="amount">
                  <p>{{ `${$t('beePal.trade.successDealRateDescription')} &nbsp;` }}</p>
                </div>
              </template>
            </van-cell>
          </div>
          <!-- 最成功的出價 -->
          <div class="successTrade">
            <van-cell :border="false" class="title">
              <template #title>
                <p>{{ $t('beePal.trade.successTrade') }}</p>
                <p class="description">{{ $t('beePal.trade.successTradeDescription') }}</p>
              </template>
            </van-cell>
            <van-cell v-if="successTrade" class="detail">
              <template #title>
                <div class="user flex row-v-c">
                  <img :src="successTrade.avatar" class="mr10" width="32" style="border-radius: 100%;"/>
                  <div class="name mr10">{{ successTrade.user.nickname || $t('base.noNicknameUser') }}</div>
                </div>
                <div class="amount">
                  <span>{{ $t('beePal.deal.num') }}&nbsp;</span>
                  <span>{{ money_filter(successTrade.amount, 2) }} {{ successTrade.coin.name }}</span>
                </div>
                <div class="dealnum">
                  <span>
                    {{ $t('beePal.deal.dealnum') }}&nbsp;{{
                      successTrade.bill_completed_count
                    }}
                  </span>
                </div>
                <div class="successRate">
                  <span>
                    {{ $t('beePal.deal.transRate') }}&nbsp;{{
                      successTrade.bill_completed_rate
                    }}
                  </span>
                </div>
              </template>
              <template #default>
                <div class="price">
                  <div>{{ $t('beePal.deal.price') }}</div>
                  <span class="num">{{ money_filter(successTrade.price, 2) }} {{ successTrade.currency.code }}</span>
                </div>
                <div class="payment flex row-v-c">
                  <img
                    v-for="paymode in successTrade.supportedTrans"
                    :key="paymode"
                    :src="require('@/assets/img/' + paymode + '.png')"
                  />
                </div>
              </template>
            </van-cell>
          </div>
          <!-- 最失敗的出價 -->
          <div class="failTrade">
            <van-cell :border="false" class="title">
              <template #title>
                <p>{{ $t('beePal.trade.failTrade') }}</p>
                <p class="description">{{ $t('beePal.trade.failTradeDescription') }}</p>
              </template>
            </van-cell>
            <van-cell v-if="failTrade">
              <template #title>
                <div class="user flex row-v-c">
                  <img :src="failTrade.avatar" class="mr10" width="32" style="border-radius: 100%;"/>
                  <div class="name mr10">{{ failTrade.user.nickname || $t('base.noNicknameUser') }}</div>
                </div>
                <div class="amount">
                  <span>{{ $t('beePal.deal.num') }}&nbsp;</span>
                  <span>{{ money_filter(failTrade.amount, 2) }} {{ failTrade.coin.name }}</span>
                </div>
                <div class="dealnum">
                  <span>
                    {{ $t('beePal.deal.dealnum') }}&nbsp;{{
                      failTrade.bill_completed_count
                    }}
                  </span>
                </div>
                <div class="successRate">
                  <span>
                    {{ $t('beePal.deal.transRate') }}&nbsp;{{
                      failTrade.bill_completed_rate
                    }}
                  </span>
                </div>
              </template>
              <template #default>
                <div class="price">
                  <div>{{ $t('beePal.deal.price') }}</div>
                  <span class="num">{{ money_filter(failTrade.price, 2) }} {{ failTrade.currency.code }}</span>
                </div>
                <div class="payment flex row-v-c">
                  <img
                    v-for="paymode in failTrade.supportedTrans"
                    :key="paymode"
                    :src="require('@/assets/img/' + paymode + '.png')"
                  />
                </div>
              </template>
            </van-cell>
          </div>
          <!-- 月份選擇 -->
          <van-action-sheet v-model="dateTimeShow">
            <van-datetime-picker
              v-model="tempDate"
              :min-date="dateTimeOptions.minDate"
              :max-date="dateTimeOptions.maxDate"
              :confirm-button-text="$t('my.dialog_3')"
              :formatter="dateFormatter"
              class="dateTime"
              type="year-month"
              @confirm="switchMonth"
            >
              <template #cancel><span></span></template>
            </van-datetime-picker>
          </van-action-sheet>
        </van-cell-group>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { ActionSheet, Button, Cell, CellGroup, DatetimePicker, Icon, List, PullRefresh, } from 'vant'
import { mapActions, mapGetters } from 'vuex'
import { getDealRate, getSpecialTrade } from '@/api'
import config from '../config'
import OrderList from './orderList'
import { settings } from '@/config'
import Storage from '@/utils/storage'
import { toPercent } from '@/utils/number'
import { money_filter } from '@/utils/money'

export default {
  name: 'OverviewCardList',
  components: {
    OrderList,
    [ActionSheet.name]: ActionSheet,
    [DatetimePicker.name]: DatetimePicker,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    state: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      money_filter,
      isMounted: false,
      // 月份選擇相關 Start
      dateTimeShow: false,
      dateTimeOptions: {
        minDate: new Date('1900-01-01'),
        maxDate: new Date(),
      },
      tempDate: new Date(),
      chosenMonth: new Date(),
      // 月份選擇相關 End
      dealRate: {
        month: new Date().getMonth() + 1,
        count: 0,
        rate: ''
      },
      successTrade: null,
      failTrade: null,
      supportMethod: [], // 首選支付方式（默認支付方式）
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
      supportCoin: config.supportCoin,
      methodMap: config.methodMap,
      supportTrans: config.supportTrans, // 支持的支付方式
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo', 'VG__userChannel']),
    finishedText() {
      // 2021.08.13 不確定正式串API會不會需要顯示幾筆，也就是「沒有更多了」，所以先拿掉
      // if (this.successTradeList.length) return this.$t('beePal.tokenDetail.noMore')
      // else return ''
      return ''
    },
  },
  async created() {
    Storage.setSession('goBackPath', null) // 先把goBackPath重置
    // 取得用戶設置的默認支付方式
    await this.VA__getUserChannel()
    this.supportMethod = this.VG__userChannel.filter(item => item.is_default === true)

    await this.getDealRate() // 取得交易率
    await this.getSuccessTrade() // 取得最成功的出價
    await this.getFailTrade() // 取得最失敗的出價
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    ...mapActions('user', ['VA__getUserChannel']),
    beforeChange(index) {
      if (index === 0) {
        this.$notify({ type: 'primary', message: this.$t('beePal.deal.comeSoon') })
        return false
      }
      return true
    },
    onChange() {
      this.$emit('onChange')
    },
    goOtcPayment() {
      Storage.setSession('goBackPath', '/trade')
      this.$router.push('/otcPayment')
    },
    dateFormatter(type, val) {
      if (type === 'year') {
        return val + this.$t('my.auth.year')
      }
      if (type === 'month') {
        return val + this.$t('my.auth.month')
      }
      if (type === 'day') {
        return val + this.$t('my.auth.day')
      }
      return val
    },
    async switchMonth() {
      this.chosenMonth = this.tempDate
      this.dateTimeShow = false
      await this.getDealRate()
      await this.getSuccessTrade()
      await this.getFailTrade()
    },
    async getDealRate() {
      // console.log('chosenMonth', this.chosenMonth)
      const year = this.chosenMonth.getFullYear()
      const month = this.chosenMonth.getMonth()
      let endDate = new Date(year, month + 1 === 12 ? 0 : month + 1, 1)
      endDate = new Date(Number(endDate.getTime()) - (60 * 60 * 24 * 1000))
      // console.log(`start date: ${year}-${month + 1}-01, end date: ${year}-${month + 1}-${endDate.getDate()}`)
      const params = {
        created_time_after: `${year}-${month + 1}-01`,
        created_time_before: `${year}-${month + 1}-${endDate.getDate()}`,
        self_trade: true, // 篩選當前用戶的數據
      }
      await getDealRate(params).then(res => {
        if (res.code === 0) {
          this.dealRate = {
            month: month + 1,
            count: res.data.count,
            rate: toPercent(res.data.completed_count, res.data.count)
          }
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.$toast(this.$t('base.unknownErr'))
        }
      }).catch(err => {
        console.log('getDealRate-err', err)
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    async getSuccessTrade() {
      // console.log('chosenMonth', this.chosenMonth)
      const year = this.chosenMonth.getFullYear()
      const month = this.chosenMonth.getMonth()
      let endDate = new Date(year, month + 1 === 12 ? 0 : month + 1, 1)
      endDate = new Date(Number(endDate.getTime()) - (60 * 60 * 24 * 1000))
      // console.log(`start date: ${year}-${month + 1}-01, end date: ${year}-${month + 1}-${endDate.getDate()}`)
      const params = {
        created_time_after: `${year}-${month + 1}-01`,
        created_time_before: `${year}-${month + 1}-${endDate.getDate()}`,
        ordering: '-bill_completed_rate',
        page_size: 1,
        user: this.VG__userInfo.id, // 篩選當前用戶的數據
      }

      await getSpecialTrade(params).then(res => {
        if (res.code === 0) {
          const result = res.data.results[0]
          if (result) {
            const supportedTrans = []
            result.payment.forEach(item => {
              supportedTrans.push(this.supportTrans[item.type])
            })
            this.successTrade = {
              ...result,
              supportedTrans: supportedTrans, // 支持的支付方式
              avatar: result.user.avatar || require('@/assets/img/avatar.png'), // 頭像
            }
          } else {
            this.successTrade = null
          }
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.$toast(this.$t(`errorCode.${res.code}`))
          this.successTrade = null
        } else {
          this.$toast(this.$t('base.unknownErr'))
          this.successTrade = null
        }
      }).catch(err => {
        console.log('getDealRate-err', err)
        this.$toast(this.$t('base.unknownErr'))
        this.successTrade = null
      })
    },
    async getFailTrade() {
      // console.log('chosenMonth', this.chosenMonth)
      const year = this.chosenMonth.getFullYear()
      const month = this.chosenMonth.getMonth()
      let endDate = new Date(year, month + 1 === 12 ? 0 : month + 1, 1)
      endDate = new Date(Number(endDate.getTime()) - (60 * 60 * 24 * 1000))
      // console.log(`start date: ${year}-${month + 1}-01, end date: ${year}-${month + 1}-${endDate.getDate()}`)
      const params = {
        created_time_after: `${year}-${month + 1}-01`,
        created_time_before: `${year}-${month + 1}-${endDate.getDate()}`,
        ordering: 'bill_completed_rate',
        page_size: 1,
        user: this.VG__userInfo.id, // 篩選當前用戶的數據
      }

      await getSpecialTrade(params).then(res => {
        if (res.code === 0) {
          const result = res.data.results[0]
          if (result) {
            const supportedTrans = []
            result.payment.forEach(item => {
              supportedTrans.push(this.supportTrans[item.type])
            })
            this.failTrade = {
              ...result,
              supportedTrans: supportedTrans, // 支持的支付方式
              avatar: result.user.avatar || require('@/assets/img/avatar.png'), // 頭像
            }
          } else {
            this.failTrade = null
          }
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.$toast(this.$t(`errorCode.${res.code}`))
          this.failTrade = null
        } else {
          this.$toast(this.$t('base.unknownErr'))
          this.failTrade = null
        }
      }).catch(err => {
        console.log('getDealRate-err', err)
        this.$toast(this.$t('base.unknownErr'))
        this.failTrade = null
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.overviewCardList {
  flex-grow: 1;
  background-color: $bodyBgColor;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 10px;

  .button {
    ::v-deep .van-button {
      width: 95%;
      border-radius: 5px;
    }
  }

  .content {
    // flex: 1;
    height: calc(100% - 58px);
    display: flex;
    padding: 10px 20px 10px 20px;

    .van-pull-refresh {
      // padding-bottom: 97px;
      flex-grow: 1;
      overflow: hidden;

      ::v-deep .van-list__finished-text {
        color: $tabsInactiveColor;
        font-size: 14px;
      }

      .noRecord {
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: $completeColor;
      }
    }

    ::v-deep .van-pull-refresh__track {
      // padding-bottom: 97px;
      height: 100%;

      .van-list {
        background: $bodyBgColor;
      }
    }

    .payment,
    .dealRate {
      margin-bottom: 20px;

      .title {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0,0,0,0.7);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .detail {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      img {
        max-height: 100%;
        max-width: 22px;
        height: auto;
        width: auto;

        &:not(:last-child) {
          margin-right: 5px;
        }
      }
    }

    .payment {
      cursor: pointer;

      .van-cell__title {
        flex: 0.4;
      }

      .van-cell__value {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .subTitle {
          text-align: left;
          margin-right: 13.5px;

          span {
            color: rgba(106,106,106,0.7);
            font-size: 11px;
            letter-spacing: 0.5px;
          }
        }

        .image {
          display: flex;
          align-items: center;
          margin-right: 14.5px;
        }

        .arrow-right-gray {
          width: 7px;
          height: 12px;
        }
      }
    }

    .dealRate {

      .title {
        padding-bottom: 0px;

        .van-cell__value {
          .month-siwtch {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            .switch-yellow {
              width: 12.5px;
              height: 9px;
              margin-right: 2.5px;
            }

            .text {
              font-size: 9px;
              color: #FFC100;
            }

          }
        }
      }

      .detail {
        .van-cell__title {
          .subTitle {
            p {
              color: rgba(106,106,106,0.7);
              font-size: 9px;
            }
          }

          .amount {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: -5px;

            .dealCount {
              font-size: 12px;
              font-weight: bold;
            }
          }
        }

        .van-cell__value {
          padding-right: 30px;

          .subTitle {
            p {
              color: #000000;
              font-size: 12px;
              font-weight: bold;
            }
          }

          .amount {
            margin-top: -5px;

            p {
              color: rgba(106,106,106,0.7);
              font-size: 9px;
            }
          }
        }
      }
    }

    .successTrade,
    .failTrade {
      .title {
        padding-top: 0px;

        p {
          font-size: 15px;
          font-weight: bold;
          color: black;
        }

        .van-cell__title {
          display: flex;
          flex-direction: row;

          .description {
            font-size: 10.5px;
            font-weight: normal;
            color: #999999;
            padding-top: 2px;
            margin-left: 7.5px;
          }
        }
      }

      .van-cell {
        // padding-top: 20px;
        // padding-bottom: 20px;
        // border-top: 1px solid $BorderColor3;
        // border-bottom: 1px solid $BorderColor3;
        // border-radius: 10px;

        .van-cell__title {
          width: 0;
          white-space: nowrap;

          .user {
            margin-bottom: 12px;

            .name {
              font-size: 14px;
              color: $labelColor1;
              font-weight: bold;
            }
          }

          .quota {
            color: #929292;
            font-size: 12px;
            line-height: 20px;
            margin-top: 6px;
          }

          .amount {
            color: #929292;
            line-height: 25px;
            font-size: 12px;
          }

          .dealnum {
            color: #929292;
            font-size: 12px;
          }

          .successRate {
            color: #929292;
            font-size: 12px;
            margin-top: 4px;
            height: 24px;
          }
        }

        .van-cell__value {
          font-size: 12px;
          white-space: nowrap;
          overflow: visible;
          color: #929292;

          .price {
            margin-top: 22px;
            line-height: 20px;

            .num {
              font-size: 24px;
              line-height: 25px;
              color: $labelColor1;
            }
          }

          .payment {
            margin-top: 22px;
            margin-bottom: 18px;
            height: 23px;
            justify-content: flex-end;

            img {
              max-height: 100%;
              max-width: 28px;
              height: auto;
              width: auto;

              &:not(:last-child) {
                margin-right: 15px;
              }
            }
          }
        }
      }
    }
  }

  .successTrade {
    .detail {
      border-bottom: 1px solid $BorderColor3;
    }
  }

  .failTrade {
    .title {
      margin-top: 16px;
    }
  }
}
</style>
