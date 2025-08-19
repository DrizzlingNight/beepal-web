<template>
  <div class="orderList">
    <van-cell class="head">
      <template #title>
        <div class="title">
          <p>
            {{ $t('beePal.trade.orderStatus') }}
            &nbsp;
            <span> {{ $t('beePal.trade.orderStatus_description') }}</span>
          </p>
        </div>
      </template>
       <template #default>
        <div class="coin-type" @click="coinTypeShow = !coinTypeShow">
          <p>{{ $t('beePal.trade.coinType') }}</p>
          <svg-icon :class-name="'arrow-right-gray'" :icon-class="'arrow-right-gray'" />
        </div>
        <div class="all-status" @click="orderStatusShow = !orderStatusShow">
          <p>{{ $t('beePal.trade.allStatus') }}</p>
          <svg-icon :class-name="'arrow-right-gray'" :icon-class="'arrow-right-gray'" />
        </div>
      </template>
    </van-cell>
    <!-- 幣種篩選下拉 -->
    <pull-down :is-show="coinTypeShow" visual-effect="pull" class="coin-type-pull-down">
      <ul class="coin-type">
        <li
          v-for="(item, index) in supportCoin"
          :key="index"
          :class="{active: coinTypeCheck === index}"
          @click="selectCoinType(item, index)"
        >
          <div class="bd">
            <img :src="`/static/img/coins/BeePal/${item.code}.png`" />
            <p>{{ item.name }}</p>
          </div>
        </li>
      </ul>
    </pull-down>
    <!-- 訂單狀態篩選下拉 -->
    <pull-down :is-show="orderStatusShow" visual-effect="pull" class="order-status-pull-down">
      <ul class="order-status">
        <li
          v-for="(item, index) in orderStatusList"
          :key="index"
          :class="{active: orderStatusCheck === index}"
          @click="selectOrderStatus(item, index)"
        >
          <div class="bd">
            <p>{{ $t(`beePal.trade.orderStatus_${item}`) }}</p>
          </div>
        </li>
      </ul>
    </pull-down>
    <van-list
      v-model="state.loading"
      :finished="state.finished"
      :finished-text="list[0] ? finishedText : ''"
      :loading-text="$t('beePal.tokenDetail.loading')"
      @load="onLoad"
    >
      <div class="thead">
        <div class="time">
          {{ $t('beePal.trade.time') }}
        </div>
        <div class="coin">
          {{ $t('beePal.trade.coinType') }}
        </div>
        <div class="type">
          {{ $t('beePal.trade.buyOrSell') }}
        </div>
        <div class="amount">
          {{ $t('beePal.trade.orderAmount') }}
        </div>
        <div class="price">
          {{ $t('beePal.trade.price') }}
        </div>
        <div class="status">
          {{ $t('beePal.trade.orderStatus') }}
        </div>
      </div>
      <div v-if="list[0]">
        <template v-for="(item, index) in list">
          <div :key="index" :class="`row-${index}`" class="row">
            <div class="time">
              {{ item.created_time }}
            </div>
            <div class="coin">
              {{ item.coin.name }}
            </div>
            <div class="type">
              {{ item.type }}
            </div>
            <div class="amount">
              {{ item.amount }}
            </div>
            <div class="price">
              {{ item.price }}
            </div>
            <div :class="`orderStatus-${item.status}`" class="status">
              {{ $t(`beePal.trade.orderStatus_${item.status}`) }}
            </div>
          </div>
        </template>
      </div>
      <default-page v-if="!list[0] && state.finished" :status="1" />
    </van-list>
    <div class="footer">
      <div v-if="list[0]" class="text">
        <svg-icon :class-name="'arrow-down-yellow'" :icon-class="'arrow-down-yellow'" />
        <p>{{ $t('beePal.trade.slideToView') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderList } from '@/api'
import { dateFormat } from '@/utils/dateFormat'
import { money_filter } from '@/utils/money'
import { Button, Cell, List, PullRefresh, } from 'vant'
import { mapGetters } from 'vuex'
import config from '../config'
import PullDown from '@/components/BeePalComp/PullDown'
import DefaultPage from '@/components/defaultPage'

export default {
  name: 'OrderList',
  components: {
    PullDown,
    DefaultPage,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Cell.name]: Cell,
    [Button.name]: Button,
  },
  data() {
    return {
      list: [],
      state: {
        loading: false,
        finished: false,
        refreshing: false,
      },
      coinTypeShow: false,
      coinTypeCheck: -1,
      coinType: null,
      orderStatusShow: false,
      orderStatusCheck: -1,
      orderStatus: null,
      count: 0,
      page: 1,
      typeMap: config.typeMap,
      orderStatusList: config.orderStatusList,
    }
  },
  computed: {
    ...mapGetters(['supportCoin']),
    finishedText() {
      if (this.list.length >= this.count) return this.$t('beePal.tokenDetail.noMore')
      else return ''
    },
  },
  methods: {
    async onRefresh() {
      this.state.refreshing = true
      // 清空列表數據
      this.state.finished = false
      this.page = 1
      // 重新加載數據
      // 將 loading 設置爲 true，表示處於加載狀態
      this.state.loading = true
      await this.onLoad()
    },
    async onLoad() {
      if (this.state.refreshing) {
        this.list = []
        this.state.refreshing = false
      }
      await this.getOrderList()
    },
    async getOrderList() {
      const params = {
        self_trade: true, //  self_trade=True表示查改廣告商的廣告對應的訂單，False表示非該廣告商的廣告對應的訂單,不傳表示不進行廣告篩選
        page: this.page,
        ordering: '-created_time', // ordering表示排序方式   created_time是排序的字段   '-'號表示從大到小
      }
      if (this.coinType) params.coin = this.coinType.id // 幣種篩選
      if (this.orderStatus) params.status = this.orderStatus // 訂單狀態篩選
      await getOrderList(params).then(res => {
        setTimeout(() => {
          if (res.code === 0) {
            const results = res.data.results
            results.forEach(item => {
              item.created_time = dateFormat(item.created_time, 'yyyy.MM.dd hh:mm')
              item.type = this.$t(`beePal.trade.orderStatus_${this.typeMap[item.type]}`)
              item.amount = Number(item.amount)
              item.price = money_filter(Number(item.amount) * Number(item.rate), 2)
              this.list.push(item)
            })
            this.count = res.data.count
            this.page = this.page + 1
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
            this.list = []
            this.count = 0
            this.page = 1
          } else {
            this.list = []
            this.count = 0
            this.page = 1
            this.$toast(this.$t('base.unknownErr'))
          }

          // 加載狀態結束
          this.state.loading = false
          // 數據全部加載完成
          if (this.list.length >= this.count) {
            this.state.finished = true
          }
        })
      }).catch(err => {
        console.log('getOrderList-err', err)
        this.list = []
        this.count = 0
        this.page = 1
        // 加載狀態結束
        this.state.loading = false
        // 數據全部加載完成
        if (this.list.length >= this.count) {
          this.state.finished = true
        }
      })
    },
    async selectCoinType(coin, index) {
      if (this.coinTypeCheck === index) {
        this.coinTypeCheck = -1
        this.coinTypeShow = false
        this.coinType = null
        await this.onRefresh()
      } else {
        this.coinTypeCheck = index
        this.coinTypeShow = false
        this.coinType = coin
        await this.onRefresh()
      }
    },
    async selectOrderStatus(status, index) {
      if (this.orderStatusCheck === index) {
        this.orderStatusCheck = -1
        this.orderStatusShow = false
        this.orderStatus = null
        await this.onRefresh()
      } else {
        this.orderStatusCheck = index
        this.orderStatusShow = false
        this.orderStatus = status
        await this.onRefresh()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.orderList {
  position: relative;
  height: 291px;
  background: #ffffff;
  margin-bottom: 120px;

  .van-pull-refresh {
    flex-grow: 1;
    overflow: auto;
  }

  ::v-deep .van-list {
    width: 345.5px;
    height: 291px;
    padding: 10px 12px;
    overflow: auto;
    background: #ffffff !important;

    .van-list__finished-text {
      margin-top: 20px;
    }
  }

  ::v-deep .van-loading {
    margin-top: 30px;
  }

  .head {
    .van-cell__title {
      display: flex;
      flex-direction: row;

      .title {
        p {
          color: black;
          font-size: 15px;
          font-weight: bold;

          span {
            font-size: 8px;
            color: #999999;
          }
        }
      }
    }

    .van-cell__value {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding-right: 7.5px;

      .coin-type,
      .all-status {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border: 1px solid $BorderColor3;

        p {
          font-size: 10.5px;
          color: #2A2C38;
        }

        .arrow-right-gray {
          width: 5px;
          height: 8px;
          margin-left: 6px;
        }
      }

      .coin-type {
        width: 48.5px;
        margin-right: 14.5px;
      }

      .all-status {
        width: 65.5px;
      }
    }
  }

  // 幣種篩選下拉
  .coin-type-pull-down {
    position: absolute;
    left: 180px;
    top: 38px;
    z-index: 3;
    box-shadow: 0px 2px 12px -3px rgba(125, 125, 125, 0.5);
    border-radius: 5px;

    .coin-type {
      background: #fff;
      color: #2A2C38;
      border-radius: 5px;
      overflow: hidden;

      li {
        font-size: 9px;

        &.active {
          color: #FFDE00
        }

        &:first-child {
          padding-top: 5px;
        }

        &:last-child {
          padding-bottom: 5px;
        }

        .bd {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          width: auto;
          padding: 7px 9px;

          img {
            width: 11.5px;
            height: 11.5px;
          }

          p {
            word-break: break-all;
            margin-left: 5px;
          }

        }

        &:active {
          background: rgba($pageBgColor, 0.2)
        }

        &:not(:last-child) {
          .bd {
            border-bottom: 1px solid rgba($labelColor20, 0.2);
          }
        }
      }
    }
  }

  // 訂單狀態篩選下拉
  .order-status-pull-down {
    position: absolute;
    left: 245px;
    top: 38px;
    z-index: 3;
    box-shadow: 0px 2px 12px -3px rgba(125, 125, 125, 0.5);
    border-radius: 5px;

    .order-status {
      background: #fff;
      color: #2A2C38;
      border-radius: 5px;
      overflow: hidden;

      li {
        font-size: 9px;

        &.active {
          color: #FFDE00
        }

        &:first-child {
          padding-top: 5px;
        }

        &:last-child {
          padding-bottom: 5px;
        }

        .bd {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          width: auto;
          padding: 7px 9px;

          img {
            width: 11.5px;
            height: 11.5px;
          }

          p {
            word-break: break-all;
            margin-left: 5px;
          }

        }

        &:active {
          background: rgba($pageBgColor, 0.2)
        }

        &:not(:last-child) {
          .bd {
            border-bottom: 1px solid rgba($labelColor20, 0.2);
          }
        }
      }
    }
  }

  .thead {
    background: #ffffff;
    position: absolute;
    top: 47px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: center;
    border-bottom: 1px solid $BorderColor3;
    padding-top: 14px;
    padding-bottom: 12px;
    color: #666666;

    .time {
      font-size: 10.5px;
      width: 50px;
    }

    .coin {
      font-size: 10.5px;
      width: 50px;
    }

    .type {
      font-size: 10.5px;
      width: 50px;
    }

    .amount {
      font-size: 10.5px;
      width: 50px;
    }

    .price {
      font-size: 10.5px;
      width: 50px;
    }

    .status {
      font-size: 10.5px;
      width: 70px;
    }
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: center;
    border-bottom: 1px solid $BorderColor3;
    padding-top: 14px;
    padding-bottom: 12px;

    .time {
      font-size: 9px;
      width: 50px;
    }

    .coin {
      font-size: 10.5px;
      width: 50px;
    }

    .type {
      font-size: 10.5px;
      width: 50px;
    }

    .amount {
      font-size: 10.5px;
      width: 50px;
    }

    .price {
      font-size: 10.5px;
      width: 50px;
    }

    .status {
      font-size: 10.5px;
      width: 70px;
    }
    // .time,
    // .coin,.type,.amount,.price,.status {
    //   text-align: left;
    // }
  }

  .footer {
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;

    .text {
      display: flex;
      flex-direction: row;

      p {
        font-size: 10.5px;
        color: #FFC006;
        margin-left: 5.5px;
      }
    }
  }

  .row-0 {
    margin-top: 31px;
  }

  // 訂單狀態顏色
  .orderStatus-1 {
    color: #FF6600;
  }
  .orderStatus-2 {
    color: #07A300;
  }
  .orderStatus-3 {
    color: #CA1C1C;
  }
  .orderStatus-4 {
    color: #CA1C1C;
  }
  .orderStatus-5 {
    color: #FF6600;
  }

  // 缺省頁
  ::v-deep .default-page {
    height: 100%;
    padding-top: 30px;

    .image {
      width: 190px;
      height: 160px;
    }

    .title {
      margin-right: 30px;
    }

    .description {
      margin-right: 30px;
    }
  }
}

</style>
