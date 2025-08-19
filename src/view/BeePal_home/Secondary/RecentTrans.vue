<template>
  <div class="recentTrans">
    <my-head
      :title="$t('beePal.recentTrans.title')"
      :border="true"
      @goback="
        $router.push({
          name: 'transfer',
          params: {
            token: $route.params.token,
          },
        })
      "
    ></my-head>
    <div class="main-content">
      <token-list
        :state="state"
        :list="list"
        @onRefresh="onRefresh"
        @onLoad="onLoad"
        @goPage="goPage"
      ></token-list>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import tokenList from './components/tokenList'
import { List, PullRefresh, Cell } from 'vant'
import { coinTransaction, getOneUWallet } from '@/api/beePal'
import { dateFormat } from '@/utils/time'
import { supplementZero } from '@/utils/money'
import coinMixin from '@/mixins/coinMixin'
export default {
  name: 'RecentTrans',
  components: {
    myHead,
    tokenList,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Cell.name]: Cell,
  },
  mixins: [coinMixin],
  data() {
    return {
      list: [],
      state: {
        loading: false,
        finished: false,
        refreshing: false,
      },
      page: 1,
    }
  },
  methods: {
    onRefresh() {
      this.page = 1
      // 清空列表数据
      this.state.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.state.loading = true
      this.onLoad()
    },
    onLoad() {
      const data = {
        coin: this.token.coin,
        page: this.page,
      }
      if (this.state.refreshing) {
        this.list = []
        this.state.refreshing = false
      }
      const page = this.page
      coinTransaction(data).then(res => {
        setTimeout(() => {
          // 加载状态结束
          this.state.loading = false
          // 数据全部加载完成
          if (this.list.length >= res.count) {
            this.state.finished = true
          }
        }, 0)
        if (page !== this.page) return
        res = res.data // 2021.08.10 配合新API，資料放res.data裡
        const result = res.results
        this.page += 1
        result.forEach(item => {
          const amount = supplementZero(
            Number(item.amount).toFixed(this.token.decimal),
            2
          )
          const isInternal = Boolean(item.user && item.target_user) // user target_user都不为空时表示内部转账
          const targetUser = isInternal ? item.target_user : {
            // 如果是外部轉帳，target_user為null的情況
            id: item.target_address, // id用target_address代替
            nickname: `${item.target_address.split('', 12).join('')}...`, // 把target_address取12個字+...當成nickname
            avatar: 'https://i.ibb.co/wSC47M6/01.png', // 隨便用一張圖替代
            username: item.target_address, // username也用target_address代替
          }
          const obj = {
            id: item.id,
            address: item.type === 2 ? item.target_address : item.source_address, // 2021.08.12 新API type 1為轉入(收款)、2為轉出
            username: isInternal ? `(${this.$t('beePal.tokenDetail.username')})${targetUser.nickname}` : targetUser.nickname,
            target_user: targetUser,
            internal: isInternal,
            time: dateFormat(item.created_time, 'dd/MM hh:mm'),
            memo: item.memo,
            amount: item.type === 2 ? '-' + amount : '+' + amount, // 2021.08.12 新API type 1為轉入(收款)、2為轉出
            coin: this.token.coin_code,
            type: item.type,
            userid: targetUser && targetUser.id,
            coinid: item.coin,
            status: item.status,
          }
          this.list.push(obj)
        })
      })
    },
    goPage(item) {
      const params = {
        user_id: item.userid,
        coin: item.coinid,
      }
      if (item.address) {
        this.$router.push({
          name: 'transfer',
          params: {
            token: this.$route.params.token,
            payee: item.address,
            memo: item.memo,
          },
        })
      } else {
        getOneUWallet(params).then(res => {
          this.$router.push({
            name: 'transfer',
            params: {
              token: this.$route.params.token,
              payee: res.address,
              memo: item.memo,
            },
          })
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.recentTrans {
  height: 100%;
  background: $background;
}

.main-content {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

::v-deep .van-pull-refresh {
  background-color: $pageBgColor;
  .van-list {
    .cell {
      &:active {
        background-color: rgba($color: $Color, $alpha: 0.04);
      }
    }
    .van-cell {
      background-color: initial;
    }
    .noRecord {
      color: $tabsInactiveColor;
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      position: absolute;
      top: 40%;
      width: 100%;
    }
  }
}
</style>
