<template>
  <div class="tokenDetail">
    <my-head
      :title="token.coin_name"
      @goback="$router.push('/')"
    ></my-head>
    <div class="main-content">
      <token-assets :token="token" class="mb10"></token-assets>
      <token-history
        ref="history"
        v-model="historyLists"
        :token="token"
        :total="total"
        @onLoad="onLoad"
      ></token-history>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import tokenAssets from './components/tokenAssets'
  import tokenHistory from './components/tokenHistory'
  import { dateFormat } from '@/utils/time'
  import { supplementZero } from '@/utils/money'
  import { coinTransaction } from '@/api/beePal'
  import coinMixin from '@/mixins/coinMixin'

  export default {
    name: 'TokenDetail',
    components: {
      myHead,
      tokenAssets,
      tokenHistory,
    },
    mixins: [coinMixin],
    data() {
      return {
        historyLists: [],
        page: 1,
        total: 100,
        typeMap: [null, 2, 1], // 2021.08.12 新API type 1為轉入(收款)、2為轉出
        func: null,
        iTime: null,
      }
    },
    methods: {
      onLoad(callback) {
        if (this.token.have === false) {
          this.func = callback
          return
        }
        const active = this.$refs.history.active
        const page = this.page
        const data = {
          coin: this.token.coin,
          page: this.page,
          type: this.typeMap[this.$refs.history.active],
        }
        coinTransaction(data).then(res => {
          callback()
          res = res.data // 2021.08.10 配合新API，資料放res.data裡
          const result = res.results
          this.total = res.count
          if (
            this.$refs.history &&
            active === this.$refs.history.active &&
            page === this.page
          ) {
            this.page += 1
            result.forEach(item => {
              const amount = supplementZero(
                Number(item.amount).toFixed(this.token.decimal),
                2,
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
                time: dateFormat(item.created_time, 'dd/MM hh:mm'),
                amount: item.type === 2 ? '-' + amount : '+' + amount, // 2021.08.12 新API type 1為轉入(收款)、2為轉出
                coin: this.token.coin_code,
                type: item.type,
                status: item.status,
                lightning: isInternal, // 內部轉帳=閃電轉帳
                tx_id: item.tx_id,
              }
              this.historyLists.push(obj)
            })
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .tokenDetail {
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
