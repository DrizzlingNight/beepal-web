<template>
  <div class="home">
    <my-head>
      <template #right>
        <!-- 2021.11.16 先暫時把首頁掃碼隱藏起來（因為有不同的用途，暫時無法判斷） -->
        <div class="right flex row-v-c ft14">
        </div>
      </template>
    </my-head>
    <div class="main-content">
      <!-- 我的总资产 -->
      <div class="assets">
        <card
          :real-coin="realCurrency"
          v-model="canSeeAssets"
          :current-total="G_total"
        ></card>
      </div>

      <!-- 资讯天地 -->
      <info class="mb10"></info>

      <!-- 资产列表 -->
      <div class="assetsList">
        <div class="title">
          {{ $t('beePal.home.assets') }}
        </div>
        <div class="list">
          <assets-list
            :can-see-assets="canSeeAssets"
            :real-coin="realCurrency"
            :assets-list="wallet_balance_list"
          ></assets-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/BeePal_head'
  import card from './components/Card'
  import info from './components/Info'
  import assetsList from './components/AssetsList'
  import { money_filter, supplementZero } from '@/utils/money'
  import { mapActions, mapGetters } from 'vuex'
  import { settings } from '@/config'
  import Storage from '@/utils/storage'

  export default {
    name: 'Home',
    components: {
      myHead,
      card,
      info,
      assetsList,
    },
    data() {
      return {
        canSeeAssets: window.sessionStorage.getItem('seen') === 'true' || false, // 控制资产显示（默认隐藏资产）
        realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
      }
    },
    computed: {
      ...mapGetters([
        'G_wallet_list',
        'G_coinRate',
        'VG__getCoinInfoByCode',
      ]),
      G_total() {
        // this.$myConsole.info('G_coinRate', this.G_coinRate)
        let total = 0
        if (!this.G_wallet_list) {
          return 0
        }
        this.G_wallet_list.forEach(item => {
          // 計算貨幣匯率 Start
          const coin = this.VG__getCoinInfoByCode(item.coin_code)
          // this.$myConsole.log('coin', coin)

          let rate = 1

          if (coin.id === 9) {
            rate = 1
          } else {
            rate = this.G_coinRate[coin.code]
          }

          // 如果法幣不是USD，就要依照匯率表再做一次轉換
          if (this.realCurrency !== 'USD' && typeof rate !== 'undefined') {
            rate = rate / this.G_coinRate[this.realCurrency]
          }
          // 計算貨幣匯率 End

          if (typeof rate !== 'undefined') {
            total += item.amount * rate
            this.$set(this.G_wallet_list, 'price', item.amount * rate)
          }
        })
        return total
      },
      wallet_balance_list() {
        const walletList = this.G_wallet_list || []
        // this.$myConsole.info('walletList', walletList)
        walletList.forEach(item => {
          // 計算貨幣匯率 Start
          const coin = this.VG__getCoinInfoByCode(item.coin_code)
          // this.$myConsole.log('coin', coin)

          let rate = 1

          if (coin.id === 9) {
            rate = 1
          } else {
            rate = this.G_coinRate[coin.code]
          }

          // 如果法幣不是USD，就要依照匯率表再做一次轉換
          if (this.realCurrency !== 'USD' && typeof rate !== 'undefined') {
            rate = rate / this.G_coinRate[this.realCurrency]
          }

          if (typeof rate !== 'undefined') {
            item.price = money_filter(item.amount * rate, 2)
          } else {
            item.price = '--'
          }
          // 計算貨幣匯率 End

          item.amount = supplementZero(
            Number(item.amount).toFixed(coin.decimalPlaces),
            2,
          )
          item.decimal = coin.decimalPlaces
          item.coin_name = coin.name
          item.coin_chain = coin.chain
        })
        return walletList
      },
    },
    created() {
      this.AC_UPDATEWALLET()
    },
    mounted() {
      this.VA__updateUserInfo()
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo']),
      ...mapActions('BeePal', ['AC_UPDATEWALLET']),
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .home {
    height: 100%;
  }

  .main-content {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  // 我的总资产卡片
  .assets {
    padding: 2px 15px 15px;
    background-color: $pageBgColor;
    margin-bottom: 10px;
  }

  // 我的资产列表
  .assetsList {
    background-color: $pageBgColor;
    flex-grow: 1;
    padding-bottom: 65px;

    // 标题
    .title {
      padding: 15px;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
