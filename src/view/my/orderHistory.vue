<template>
  <div class="orderHistory">
    <my-head :title="$t('my.label_10')"></my-head>
    <div class="main-content">
      <van-tabs
        v-model="active"
        :border="false"
        background="inherit"
        line-height="5"
        line-width="20"
        @change="change"
      >
        <van-tab :title="$t('beePal.tokenDetail.all')"></van-tab>
        <van-tab :title="$t('beePal.otcHistory.buy')"></van-tab>
        <van-tab :title="$t('beePal.otcHistory.sell')"></van-tab>
      </van-tabs>
      <van-pull-refresh
        v-model="state.refreshing"
        :loading-text="$t('beePal.tokenDetail.loading')"
        :loosing-text="$t('beePal.tokenDetail.loosingText')"
        :pulling-text="$t('beePal.tokenDetail.pullingText')"
        @refresh="onRefresh"
      >
        <van-list
          v-model="state.loading"
          :finished="state.finished"
          :finished-text="finishedText"
          :loading-text="$t('beePal.tokenDetail.loading')"
          @load="onLoad"
        >
          <template v-for="(item, index) in list">
            <!-- :key="item.id" -->
            <div
              :key="index"
              :class="[
                !item.buyIn ? '_transfer' : '_gathering',
                {
                  onprogress:
                    item.status === 0 || item.status === 1 || item.status === 6,
                },
              ]"
              class="flex cell"
              @click="myClick(item)"
            >
              <svg-icon
                :icon-class="!item.buyIn ? 'send' : 'gathering'"
                class-name="left"
              />
              <van-cell>
                <template #title>
                  <div class="account">
                    {{
                    item.buyIn
                    ? $t('beePal.otcHistory.buyCoin', [
                    item.coin.name,
                    ])
                    : $t('beePal.otcHistory.sellCoin', [
                    item.coin.name,
                    ])
                    }}
                  </div>
                  <div class="time">{{ item.created_time }}</div>
                  <div class="user">
                    {{
                    item.buyIn
                    ? item.seller.nickname || `ID: ${item.seller.id}`
                    : item.buyer.nickname || `ID:${item.buyer.id}`
                    }}
                  </div>
                </template>
                <template #default>
                  <div :class="statusMap[item.status]" class="ft12">
                    {{ $t('beePal.deal.' + statusMap[item.status]) }}
                  </div>
                  <div class="amount flex row-v-c">
                    <span
                    >{{ item.amount }} {{ item.coin.name }} ≈
                      {{ item.price }} {{ item.currency.name }}</span
                    >
                  </div>
                </template>
              </van-cell>
            </div>
          </template>
          <div v-show="list.length === 0 && !state.loading" class="noRecord">
            {{ $t('beePal.tokenDetail.noRecord') }}
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { getOTCHistory } from '@/api/beePal'
  import { Button, Cell, List, PullRefresh, Tab, Tabs } from 'vant'
  import { mapGetters, mapActions } from 'vuex'
  import { dateFormat } from '@/utils/dateFormat'
  import { money_filter } from '@/utils/money'
  import { setOrder } from '@/view/BeePal_deal/config'

  export default {
    name: 'OrderHistory',
    components: {
      myHead,
      [Tabs.name]: Tabs,
      [Tab.name]: Tab,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
      [Cell.name]: Cell,
      [Button.name]: Button,
    },
    data() {
      return {
        list: [],
        buyList: [],
        sellList: [],
        state: {
          loading: false,
          finished: false,
          refreshing: false,
        },
        typeMap: [null, 1, 0],
        active: 0,
        count: 0,
        page: 1,
        statusMap: require('../BeePal_deal/config').orderStatus,
        buyerStatus: require('../BeePal_deal/config').buyerStatus,
        sellerStatus: require('../BeePal_deal/config').sellerStatus,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo', 'G_singleOrderById', 'G_userOrderList', 'G_sellOrderList']),
      finishedText() {
        if (this.list.length) return this.$t('beePal.tokenDetail.noMore')
        else return ''
      },
    },
    methods: {
      ...mapActions('BeePal', ['AC_ORDERLIST', 'AC_SELLORDERLIST']),
      getThisType(item) {
        const userid = this.VG__userInfo && this.VG__userInfo.id
        // 2021.08.13 新API merchant換成buyer handler換成seller
        if (item.buyer.id === userid) return true
        else if (item.seller.id === userid) return false
      },
      change() {
        this.state.refreshing = true
        this.onRefresh()
      },
      onRefresh() {
        // 清空列表数据
        this.state.finished = false
        this.page = 1
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.state.loading = true
        this.onLoad()
      },
      async onLoad() {
        if (this.state.refreshing) {
          this.list = []
          this.buyList = []
          this.sellList = []
          this.state.refreshing = false
        }
        const active = this.active
        const params = {
          // 2021.08.04 新的API沒有必帶參數，所以先註解掉
          // type: 4,
          page: this.page,
          ordering: '-created_time', // ordering表示排序方式   created_time是排序的字段   '-'号表示从大到小
          // ad_type: this.typeMap[active],
        }
        // 2021.08.13 新API merchant換成buyer handler換成seller
        if (active === 1) {
          params.buyer = this.VG__userInfo.id
        } else if (active === 2) {
          params.seller = this.VG__userInfo.id
        }
        // this.$myConsole.log('params', params)
        await getOTCHistory(params).then(async res => {
          if (active === this.active) {
            res = res.data // 2021.08.10 配合新API，資料放res.data裡
            const results = res.results
            results.forEach(async item => {
              // 更新訂單詳情 Start
              await setOrder({ ...item }, async res => {
                if (res.buyIn) {
                  const buyList = this.buyList
                  buyList.push(res)
                  await this.AC_ORDERLIST(buyList)
                } else {
                  const sellList = this.sellList
                  sellList.push(res)
                  await this.AC_SELLORDERLIST(sellList)
                }
              })
              // 更新訂單詳情 End
              const buyIn = this.getThisType(item)
              item.buyIn = buyIn
              item.created_time = dateFormat(item.created_time, 'MM-dd hh:mm')
              item.amount = Number(item.amount)
              item.price = money_filter(Number(item.amount) * Number(item.rate), 2)
              this.list.push(item)
            })
            // this.$myConsole.log('this.G_userOrderList', this.G_userOrderList)
            // this.$myConsole.log('this.G_sellOrderList', this.G_sellOrderList)
            this.count = res.count
            this.page = this.page + 1
          }
          setTimeout(() => {
            // 加载状态结束
            this.state.loading = false
            // 数据全部加载完成
            if (this.list.length >= this.count) {
              this.state.finished = true
            }
          })
        })
      },
      myClick(item) {
        const currentOrder = this.G_singleOrderById(item.id)
        if (currentOrder) {
          if (item.buyIn) {
            this.gotoDetail(currentOrder, 'buy')
          } else {
            this.gotoDetail(currentOrder, 'sell')
          }
        }
      },
      gotoDetail(item, type) {
        let params = {
          orderid: item.id,
        }
        params = Object.assign(params, this.buyerStatus[item.myStatus].params, this.sellerStatus[item.myStatus].params)
        this.$router.push({
          name: type === 'buy'
            ? this.buyerStatus[item.myStatus].path
            : this.sellerStatus[item.myStatus].path,
          params,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .orderHistory {
    height: 100%;
  }

  .main-content {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: $pageBgColor;
    color: $labelColor1;
  }

  ::v-deep .van-tabs {
    border-bottom: 1px solid $BorderColor3;

    .van-tabs__line {
      background: $tabsActiveBorderBg;
    }

    .van-tab {
      color: $tabsInactiveColor;
      width: 90px;
      flex: inherit;
      font-size: 14px;

      &.van-tab--active {
        color: $labelColor1;
      }
    }
  }

  .van-pull-refresh {
    // padding-bottom: 97px;
    flex-grow: 1;
    overflow: auto;

    ::v-deep .van-list__finished-text {
      color: $tabsInactiveColor;
      font-size: 14px;
    }
  }

  ::v-deep .van-pull-refresh__track {
    // padding-bottom: 97px;
    height: 100%;
  }

  .van-list {
    height: auto;

    .cell {
      position: relative;
      align-items: center;
      font-size: 18px;

      &:active {
        background: rgba($color: #000000, $alpha: 0.03);
      }

      .left {
        margin: 0px 15px;
      }

      .van-cell {
        height: 100%;
        background: initial;
        align-items: flex-start;
        padding: 15px 15px 15px 0;
        border-bottom: 1px solid $BorderColor3;
        color: $labelColor1;

        .van-cell__value {
          overflow: visible;
          white-space: nowrap;
          line-height: 18px;
        }

        .van-cell__title {
          line-height: 15px;
          white-space: nowrap;
          width: 0;
        }

        .account {
          font-size: 14px;
          margin-bottom: 3px;
          width: 156px;
          overflow-wrap: break-word;
        }

        .user {
          font-size: 12px;
        }

        .time {
          color: $labelColor19;
          font-size: 12px;
        }

        .amount {
          color: $labelColor19;
          font-size: 12px;
          justify-content: flex-end;
        }

        .complete {
          color: $gathering;
        }

        .past {
          color: $completeColor;
        }

        .paid {
          color: $transfer;
        }

        .error {
          color: $errorColor;
        }

        .onprogress {
          color: $transfer;
        }
      }
    }
  }

  ::v-deep .noRecord {
    color: $tabsInactiveColor;
    padding-top: 20px;
    text-align: center;
    font-size: 14px;
  }
</style>
