<template>
  <div class="cardList">
    <!-- // 2021.10.25 設計圖修改 把創建出價變成圓圈icon、關閉出價做在卡片裡 -->
    <!-- <div class="button">
      <van-cell>
        <template #title>
          <van-button>{{ $t('beePal.trade.closeAllOffer') }}</van-button>
        </template>
        <template #default>
          <van-button @click="goCreateOffer">
            {{ $t('beePal.trade.createNewOffer') }}
          </van-button>
        </template>
      </van-cell>
    </div> -->
    <div class="content">
      <van-pull-refresh
        v-model="state.refreshing"
        :loading-text="$t('beePal.tokenDetail.loading')"
        :loosing-text="$t('beePal.tokenDetail.loosingText')"
        :pulling-text="$t('beePal.tokenDetail.pullingText')"
        @refresh="$emit('onRefresh')"
      >
        <van-list
          v-model="state.loading"
          :finished="state.finished"
          :finished-text="finishedText"
          :loading-text="$t('beePal.tokenDetail.loading')"
          @load="$emit('onLoad')"
        >
          <div v-if="tradeList[0]">
            <template v-for="(item,index) in tradeList">
              <div :key="index" class="tradeList">
                <van-cell :border="false">
                  <template #title>
                    <div class="flex row-v-c">
                      <img :src="item.avatar" class="mr10" width="32" style="border-radius: 100%;"/>
                      <div class="name mr10">{{ item.user.nickname ||$t('base.noNicknameUser') }}</div>
                      <svg-icon
                        v-if="item.user.VIP"
                        class-name="vip"
                        icon-class="vip"
                      ></svg-icon>
                    </div>
                    <!-- <div class="quota">
                      <span>{{ $t('beePal.deal.quota') }}&nbsp;</span>
                      <span
                      >{{ item.min_trade_limit }} - {{ item.max_trade_limit }}
                        {{ realCurrency }}</span
                      >
                    </div> -->
                    <div class="amount">
                      <span>{{ $t('beePal.deal.num') }}&nbsp;</span>
                      <span>{{ money_filter(item.amount, 2) }} {{ item.coin.name }}</span>
                    </div>
                    <div class="dealnum">
                      <span>
                        {{ $t('beePal.deal.dealnum') }}&nbsp;{{
                          item.bill_completed_count
                        }}
                      </span>
                    </div>
                    <div class="successRate">
                      <span>
                        {{ $t('beePal.deal.transRate') }}&nbsp;{{
                          item.bill_completed_rate
                        }}
                      </span>
                    </div>
                  </template>
                  <template #default>
                    <div class="price">
                      <div>{{ $t('beePal.deal.price') }}</div>
                      <span class="num">{{ money_filter(item.current_price, 2) }} {{ item.currency.code }}</span>
                    </div>
                    <div class="payment">
                      <img
                        v-for="paymode in item.supportedTrans"
                        :key="paymode"
                        :src="require('@/assets/img/' + paymode + '.png')"
                      />
                    </div>
                  </template>
                </van-cell>
                <van-cell class="bottom">
                  <template #title>
                    <div class="button" @click="confirmCloseTrade(item)">
                      <svg-icon icon-class="cross-red" class-name="cross-red" />
                      <p>{{ $t('base.delete') }}</p>
                    </div>
                  </template>
                  <template #default>
                    <div class="button" @click="goEditTrade(item)">
                      <svg-icon icon-class="edit-gray" class-name="edit-gray" />
                      <p>{{ $t('base.edit') }}</p>
                    </div>
                  </template>
                </van-cell>
              </div>
            </template>
          </div>
          <default-page v-if="!tradeList[0] && state.finished" :status="1" />
        </van-list>
      </van-pull-refresh>
      <div class="create-offer" @click="goCreateOffer">
        <svg-icon icon-class="add-trade" class-name="add-trade" />
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
import { Button, Cell, Icon, List, PullRefresh, } from 'vant'
import { mapGetters } from 'vuex'
import { settings } from '@/config'
import { money_filter } from '@/utils/money'
import { closeTrade } from '@/api'
import SecurityCodeModal from '@/components/dialog/SecurityCodeModal'
import Storage from '@/utils/storage'
import DefaultPage from '@/components/defaultPage'

export default {
  name: 'CardList',
  components: {
    SecurityCodeModal,
    DefaultPage,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
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
    active: {
      type: Number,
      default: 0,
    },
    tradeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      money_filter,
      isMounted: false,
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
      // 安全驗證碼彈窗
      securityCodeModal: {
        show: false,
        securityCode: '',
        tradeId: '',
      },
    }
  },
  computed: {
    ...mapGetters(['supportCoin']),
    finishedText() {
      if (this.tradeList.length) return this.$t('beePal.tokenDetail.noMore')
      else return ''
    },
  },
  mounted() {
    this.isMounted = true
    this.$myConsole.log('tradeList', this.tradeList)
  },
  methods: {
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
    goCreateOffer() {
      this.$Storage.setSession('createOfferDatas', null)
      setTimeout(() => {
        this.$router.push({
          name: 'offerDetail',
          params: {
            step: 1,
            type: this.active === 1 ? 0 : 1, // 根據active的tab去預設 出售/購買
          },
        })
      })
    },
    goEditTrade(trade) {
      this.$dialog
        .confirm({
          message: this.$t('beePal.trade.editTradeMessage'),
          className: 'dialog',
          confirmButtonText: this.$t('base.confirm'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          let coin = 0
          this.supportCoin.forEach((item, index) => {
            if (item.id === trade.coin.id) {
              coin = index
            }
          })
          const createOfferDatas = {
            isEditMode: true,
            orderNumber: trade.id,
            coin: coin,
            type: trade.type,
            method: trade.payment.map(item => { return item.id }),
            bank: '',
            bankNumber: '',
            currency: trade.currency.id,
            amount: Number(trade.amount),
            rate: trade.rate ? 1 : 0,
            fixedPrice: trade.price || 0,
            marketPrice: trade.rate ? trade.rate * 100 : 0, // 小數點(百分比)轉換成數字
            minLimit: Number(trade.min_trade_limit),
            maxLimit: Number(trade.max_trade_limit),
            timeLimit: trade.bid_time_limit / 60, // 秒轉換成分鐘數
            needAdvanceAuth: trade.taker_limit === 2,
            count: '',
            newUserLimit: '',
          }
          // this.$myConsole.log('createOfferDatas', createOfferDatas)
          this.$Storage.setSession('createOfferDatas', createOfferDatas)
          setTimeout(() => {
            this.$router.push({
              name: 'offerPrice',
              params: {
                step: 2,
              },
            })
          })
        })
        .catch(() => {
        })
    },
    confirmCloseTrade(trade) {
      this.$dialog
        .confirm({
          message: this.$t('beePal.trade.deleteTradeMessage'),
          className: 'dialog',
          confirmButtonText: this.$t('base.confirm'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          this.securityCodeModal.show = true
          this.securityCodeModal.tradeId = trade.id
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
          this.$emit('onRefresh')
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

.cardList {
  flex-grow: 1;
  background-color: $bodyBgColor;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 76.5px; // 配合fixed屬性的創建廣告按鈕而添加

  .button {
    ::v-deep .van-button {
      width: 95%;
      border-radius: 5px;
    }
  }

  .content {
    // flex: 1;
    height: calc(100vh - 100px);
    display: flex;
    padding: 10px 20px 10px 20px;
    overflow: auto;

    .van-pull-refresh {
      // padding-bottom: 97px;
      flex-grow: 1;
      overflow: auto;

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

    .tradeList {
      padding-top: 10px;

      .van-cell {
        padding-top: 20px;
        padding-bottom: 20px;
        // border-top: 1px solid $BorderColor3;
        border-bottom: 1px solid $BorderColor3;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        .van-cell__title {
          width: 0;
          white-space: nowrap;

          .name {
            font-size: 15px;
            color: $labelColor1;
            font-weight: bold;
          }

          .vip {
            font-size: 18px;
            transform: translateY(-2px);
          }

          .quota {
            color: $labelColor24;
            font-size: 13px;
            line-height: 20px;
            margin-top: 6px;
          }

          .amount {
            color: $labelColor23; // 灰色
            line-height: 25px;
            font-size: 13px;
            margin-top: 13px;
          }

          .dealnum {
            color: $labelColor23; // 灰色
          }

          .successRate {
            color: $labelColor23; // 灰色
            margin-top: 4px;
            height: 24px;
          }
        }

        .van-cell__value {
          font-size: 13px;
          white-space: nowrap;
          overflow: visible;
          color: $labelColor23;

          .price {
            margin-top: 10px;
            line-height: 20px;
            padding-top: 19px;

            .num {
              font-size: 24px;
              line-height: 25px;
              color: $labelColor1;
            }
          }

          .payment {
            margin-top: 20px;
            height: 23px;
            justify-content: end;

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

      .bottom {
        padding: 0px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        .van-cell__title {
          display: flex;
          flex-direction: row;
          justify-content: center;
          border-right: 1px solid $BorderColor3;

          .button {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 12px;
            margin-bottom: 12px;

            p {
              font-size: 14px;
              color: red;
              margin-left: 5.5px;
            }
          }
        }

        .van-cell__value {
          display: flex;
          flex-direction: row;
          justify-content: center;

          .button {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 12px;
            margin-bottom: 12px;

            p {
              font-size: 14px;
              margin-left: 5.5px;
            }
          }
        }
      }
    }

    .create-offer {
      position: fixed;
      right: 9px;
      bottom: 9px;

      .add-trade {
        cursor: pointer;
        width: 67.5px;
        height: 67.5px;
      }
    }
  }

  // 缺省頁
  .default-page {
    background: #F5F5F5;
    height: 100%;
    padding-top: 130px;
  }
}
</style>
