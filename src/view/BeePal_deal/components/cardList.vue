<template>
  <div class="cardList">
    <div class="flex row-v-c tabs">
      <van-tabs
        v-model="active"
        scrollspy
        swipe-threshold="5"
        line-width="20"
        @change="onChange"
      >
        <van-tab v-for="item in coinList" :key="item.id">
          <template #title>
            <div class="title">{{ item.name }}</div>
            <div v-if="item.chain" class="chain">({{ item.chain }})</div>
          </template>
          <p></p>
        </van-tab>
      </van-tabs>
      <van-icon name="arrow" class="mr10"/>
    </div>
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
          <template v-for="(item,index) in dealList">
            <div :key="index" class="dealList">
              <van-cell>
                <template #title>
                  <div class="flex row-v-c">
                    <img :src="item.avatar" class="mr10" width="32" style="border-radius: 100%;"/>
                    <div class="name mr10">{{ item.nickname || $t('base.noNicknameUser') }}</div>
                    <!-- <svg-icon
                      v-if="item.VIP"
                      class-name="vip"
                      icon-class="vip"
                    ></svg-icon> -->
                    <svg-icon
                      v-if="item.taker_limit === 2 && $i18n.locale === 'tw'"
                      class-name="advance-auth-chinese"
                      icon-class="advance-auth-chinese"
                    ></svg-icon>
                    <svg-icon
                      v-if="item.taker_limit === 2 && $i18n.locale !== 'tw'"
                      class-name="advance-auth-engilish"
                      icon-class="advance-auth-engilish"
                    ></svg-icon>
                  </div>
                  <div class="quota">
                    <span>{{ $t('beePal.deal.quota') }}&nbsp;</span>
                    <span
                    >{{ item.min_trade_limit }} - {{ item.max_trade_limit }}
                      {{ item.currency.code }}</span
                    >
                  </div>
                  <div class="amount">
                    <span>{{ $t('beePal.deal.num') }}&nbsp;</span>
                    <span>{{ item.amount }} {{ item.coin.name }}</span>
                  </div>
                  <div class="payment flex row-v-c">
                    <img
                      v-for="paymode in item.supportedTrans"
                      :key="paymode"
                      :src="require('@/assets/img/' + paymode + '.png')"
                    />
                  </div>
                </template>
                <template #default>
                  <div class="successRate">
                    <span
                    >{{ $t('beePal.deal.dealnum') }}&nbsp;{{
                        item.user_bill_count
                      }}</span
                    >
                    <span>&nbsp;|&nbsp;</span>
                    <span
                    >{{ $t('beePal.deal.transRate') }}&nbsp;{{
                        item.ratio
                      }}</span
                    >
                  </div>
                  <div class="price">
                    <div>{{ $t('beePal.deal.price') }}</div>
                    <span class="num">{{ item.price }} {{ item.currency.code }}</span>
                  </div>
                  <van-button
                    :disabled="item.taker_limit === 2 && !advanceAuth"
                    :class="{ sell: dealActive === 1 }"
                    @click="
                      dealActive === 0
                        ? $emit('buyConfirm', item)
                        : $emit('sellConfirm', item)
                    "
                  >{{
                    dealActive === 0
                    ? $t('beePal.deal.buyConfirm')
                    : $t('beePal.deal.sellConfirm')
                    }}
                  </van-button>
                  <p v-if="item.taker_limit === 2 && !advanceAuth" class="need-advance-auth-text">{{ $t('beePal.deal.needAdvanceAuth') }}</p>
                </template>
              </van-cell>
            </div>
          </template>
        </van-list>
        <div v-show="!dealList.length && !state.loading" class="noRecord">
          {{ $t('beePal.deal.noRecord') }}
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import { Button, Cell, Icon, List, PullRefresh, Tab, Tabs } from 'vant'
  import { mapGetters } from 'vuex'
  import { settings } from '@/config'
  import Storage from '@/utils/storage'

  export default {
    name: 'CardList',
    components: {
      [Tabs.name]: Tabs,
      [Tab.name]: Tab,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Button.name]: Button,
      [PullRefresh.name]: PullRefresh,
      [List.name]: List,
    },
    props: {
      coinList: {
        type: Array,
        default: () => [],
      },
      dealList: {
        type: Array,
        default: () => [],
      },
      state: {
        type: Object,
        default: () => {
          return {}
        },
      },
      dealActive: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        active: 0,
        realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol, // 2021.10.19 這裡是根據廣告商設置的貨幣單位顯示，所以用不到
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      finishedText() {
        if (this.dealList.length) return this.$t('beePal.tokenDetail.noMore')
        else return ''
      },
      advanceAuth() {
        return this.VG__userInfo.certification_level === 2
      },
    },
    methods: {
      onChange() {
        this.$emit('onChange')
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .cardList {
    flex-grow: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: $bodyBgColor;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .tabs {
      border-bottom: 1px solid $BorderColor3;
      padding-top: 5px;
      background: $pageBgColor;
    }
  }

  ::v-deep .van-tabs {
    width: calc(100% - 26px);
    height: 52px;

    .van-tabs__wrap {
      height: 52px;

      .van-tabs__nav {
        padding-left: 8px;
      }
    }

    .van-tabs__line {
      background: $tabsActiveBorderBg;
    }

    .van-tab {
      width: auto;
      color: $labelColor20;
      flex: initial;
      font-size: 14px;

      &.van-tab--active {
        color: $labelColor13;
      }

      .title {
        font-size: 16px;
      }

      .chain {
        position: absolute;
        bottom: 3px;
        left: 0;
        font-size: 12px;
        text-align: center;
        width: 100%;
      }
    }
  }

  .van-icon-arrow {
    color: $labelColor20;
  }

  .content {
    // flex: 1;
    height: calc(100% - 58px);
    display: flex;
    overflow: auto;
  }

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
      background: $pageBgColor;
    }
  }

  .van-cell {
    padding-top: 20px;
    padding-bottom: 20px;
    border-top: 1px solid $BorderColor3;
    border-bottom: 1px solid $BorderColor3;

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

      .advance-auth-chinese,
      .advance-auth-english {
        width: 18.5px;
        height: 18.5px;
      }

      .quota {
        color: $labelColor24;
        font-size: 13px;
        line-height: 20px;
        margin-top: 6px;
      }

      .amount {
        color: $labelColor23;
        line-height: 25px;
        font-size: 13px;
      }

      .payment {
        margin-top: 15px;
        height: 23px;

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

    .van-cell__value {
      font-size: 13px;
      white-space: nowrap;
      overflow: visible;
      color: $labelColor23;

      .successRate {
        margin-top: 4px;
        height: 24px;
      }

      .price {
        margin-top: 10px;
        line-height: 20px;

        .num {
          font-size: 24px;
          line-height: 25px;
          color: $labelColor1;
        }
      }

      .van-button {
        background: $linearBgColor-03;
        border: none;
        color: $cardColor;
        border-radius: 6px;
        font-size: 14px;
        height: 32px;
        margin-top: 10px;
        width: 100px;

        &.sell {
          background: $linearBgColor-04;
        }
      }

      .van-button--disabled {
        background: linear-gradient(to right, #DCDCDC, #B9B9B9) !important;
      }

      .need-advance-auth-text {
        font-size: 9px;
        color: #B6B6B6;
        margin-right: 5.35px;
      }
    }
  }
</style>
