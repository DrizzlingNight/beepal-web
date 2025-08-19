<template>
  <div class="third-withdraw-check">
    <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="goBack"></div>
      <div class="page-title">{{ transferToItem.name }} 取款</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
        icon-class="livechat"
        class-name="livechat" @click.stop="handleRouter('livechat')">
        </svg-icon>
      </div>
    </div>

    <div v-if="isLoading" class="main-content">
      <van-loading size="48px" color="#1989fa" class="loading-data" vertical style="height: 100%">
        {{ $t('base.loading') }}
      </van-loading>
    </div>

    <div v-else class="main-content">
      <div class="part-wrap">
        <div class="part-title">待提取金额划转至 BEEX 账户</div>
        <div class="part-content">
          <div class="input-container">
            <span class="tips">输入提取金额</span>

            <div class="input__wrap">
              <div class="line-wrap">
                <van-field
                  :value="transferAmount"
                  readonly
                  clickable
                  class="input"
                  @touchstart.native.stop="showKeyboard = true"
                />
                <span style="white-space:nowrap;">{{ rateToCoinName }}</span>
              </div>
              <van-number-keyboard
                v-model="transferAmount"
                :show="showKeyboard"
                :close-button-text="$t('trade.quickSell.keyboard_1')"
                style="color: #000;"
                safe-area-inset-bottom
                extra-key="."
                @blur="showKeyboard = false"
              />
            </div>
            <div class="all-amount line-wrap">
              <span class="amount">当前账户余额 {{ transferToItem.rateToBalances && transferToItem.rateToBalances.amount }} {{ rateToCoinName }}</span>
              <span class="select-all" @click="transferAmount = transferToItem.rateToBalances.amount ">全部</span>
            </div>
            <div :class="{btn_active: transferLock}" class="common-btn transfer-btn" @click="transferSubmit">划转至您的 BEEX</div>
          </div>

          <div class="account-balance line-wrap">
            <div>
              <div>当前 Beex 账户：</div>
              <div>{{ selectTokenInfo.amount && Decimal(selectTokenInfo.amount).toFixed(4, Decimal.ROUND_DOWN).toString() }} {{ selectTokenInfo.name }}</div>
            </div>
            <div
            class="common-btn sell-btn" @click="onJumpSell('')">去卖币</div>
          </div>
        </div>
      </div>
      <div class="part-wrap">
        <div class="part-title">操作历史</div>
        <div class="part-content">
          <van-tabs v-model="activeTab">
            <van-tab title="划转">
              <history-list v-if="historyRefresh" :third-party-app="transferToItem" />
            </van-tab>
            <van-tab title="卖币">
              <sell-order-list />
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>

    <van-popup v-model="showHasBankPopup" :closeable="true">
      <div class="popup-container">
        <div class="img-wrap">
          <img src="./bank.png" alt="bank" width="50%">
        </div>
        <h1>绑定银行卡</h1>
        <p>为保障您的账号资金安全，需先成功绑定银行卡才能进行安全提现</p>
        <div class="common-btn yellow-btn" @click="$router.push({ name: 'thirdPayAccount' })">绑定银行卡</div>
        <span @click="$router.push({ name: 'thirdWithdraw' })">提币到其他数字钱包</span>
      </div>
    </van-popup>
    <van-popup v-model="showCheckStatusPopup">
      <!-- <div class="check waiting">划转申请已提交，请等待审核</div> -->
      <div class="check done">划转申请成功，您可以去买币提现啦！</div>
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { settings } from '@/config'
import Storage from '@/utils/storage.js'
import { Decimal } from 'decimal.js'
import HistoryList from './HistoryList'
import SellOrderList from '@/view/trade/order/thirdSellOrder/SellOrderList'
import { getThirdPartyList, getUserInfoById, thirdPartyLogin, transferThirdParty } from '@/api'
import { Field, Loading, NumberKeyboard, Popup, Tab, Tabs } from 'vant'

export default {
  name: "ThirdWithdrawCheck",
  components: {
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [Popup.name]: Popup,
    [Loading.name]: Loading,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    HistoryList,
    SellOrderList
  },
  data() {
    return {
      Decimal,
      livechat: settings.customerService,
      showKeyboard: false,
      showHasBankPopup: false,
      showCheckStatusPopup: false,
      isLoading: true,
      historyRefresh: true,
      activeTab: 0,
      coinName: this.$route.query.coinName || 'ETH_USDT',
      rateToCoinName: this.$route.query.to || 'TWD', // 這裡配合「默認法幣」去做更改

      transferAmount: '',
      transferType: 1, // 0-deposit， 1-withdraw
      transferToItem: {},
      transferLock: false,
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo', 'VG__coinList', 'VG__userChannel']),
    balances() {
      if (!this.VG__userInfo) {
        return []
      }
      return this.VG__userInfo.balances
        .map(o => ({
          ...o,
          ...this.VG__coinList.find(p => o.coin === p.id),
        }))
        .filter(o => o.isCrypto)
    },
    tokenList() {
      return this.balances || []
    },
    selectTokenInfo() {
      return this.tokenList.filter(token => token.coin === 2)[0] || { coin: 2 }
    },
  },
  mounted() {
    this.getThirdPartyInfo(this.$route.query.app_id || 'baaxbet')
  },
  methods: {
    ...mapActions('user', ['VA__setUserInfo']),
    goBack() {
      window.history.go(-1)
    },
    onJumpSell(sellAmount) {
      this.VG__userChannel[0]
        ? this.$router.push({ name: 'thirdCurrency', params: { isSell: 1, amount: sellAmount || '' }})
        : this.showHasBankPopup = true
    },

    getThirdPartyInfo(app_id = 'test') {
      getThirdPartyList().then(res => {
        if (!res.data.results.some(o => o.app_id === app_id)) return this.$toast.fail(`匹配不到 ${app_id} 应用`) // 2021.08.16 配合新API，資料放res.data裡

        res.data.results.forEach(async o => { // 2021.08.16 配合新API，資料放res.data裡
          if (o.app_id === app_id) {
            if (!Object.keys(o.rate_dict).length) return this.$toast.fail('汇率不存在')

            this.transferToItem = { ...o, balances: {}}
            await this.__getThirdPartyByID(o.id).catch(err => console.log('__getThirdPartyByID', ' err:', err))
            this.isLoading = false
          }
        })
      }).catch(err => console.log(err))
    },
    __getThirdPartyByID(id) {
      return thirdPartyLogin({ third_party: id }).then(i => {
        // 查询参数选择第三方应用的划转币种
        const coinName = this.$route.query.coinName || 'ETH_USDT'
        const balances = i.balances.filter(balance => balance.id === coinName)[0]

        if (!balances) return this.$toast.fail(`当前账户找不到 ${coinName} 币种`)

        this.transferToItem = { ...this.transferToItem, balances }
        this.transferToItem.rateToBalances = {
          name: this.rateToCoinName,
          amount:
            Decimal(this.transferToItem.balances.amount)
              .mul(this.transferToItem.rate_dict[`${coinName}-${this.rateToCoinName}`])
              .toFixed(2, Decimal.ROUND_DOWN).toString()
        }
      }).catch(err => {
        console.log(err)
        if (err && err.status === 403) {
          this.$toast.fail('账户获取失败，请重新登录')
          setTimeout(() => {
            this.goBack()
          }, 2000)
        }
      })
    },
    __getUserInfoById() {
      return getUserInfoById(this.VG__userInfo.id)
        .then(res => {
          if (!res) return
          Storage.setLocal('userInfo', res)
          this.VA__setUserInfo(res)
        })
        .catch(err => {
          console.log('getUserInfoById-errr:', err)
        })
    },
    rateToTransferAmount() {
      return Decimal(this.transferAmount).div(this.transferToItem.rate_dict[`${this.coinName}-${this.rateToCoinName}`])
    },
    async transferSubmit() {
      if (this.transferLock) return
      if (!Number(this.transferAmount)) return this.$toast('请输入提取金额')
      // FIXME: 2021.07.23 自己跟自己比較有點意義不明，待確認
      if (Number(this.transferAmount) !== Number(this.transferAmount)) {
        this.transferAmount = ''
        return
      }
      if (this.transferToItem.balances && Decimal(this.transferToItem.rateToBalances.amount).comparedTo(this.transferAmount) < 0) return this.$toast('当前账户余额不足')

      this.transferLock = true

      const transferAmount = this.rateToTransferAmount()

      const data = {
        amount: transferAmount.toDP(8, Decimal.ROUND_DOWN).toString(),
        type: this.transferType,
        third_party: this.transferToItem.id,
        coin: this.selectTokenInfo.id,
        login_token: this.transferToItem.login_token,
      }
      await transferThirdParty(data)
        .then(async res => {
          await this.__getThirdPartyByID(this.transferToItem.id).catch(err => console.log('__getThirdPartyByID', ' err:', err))
          await this.__getUserInfoById().catch(err => console.log('__getUserInfoById', ' err:', err))
        })
        .catch(err => {
          this.$toast(this.$t('assets.toast_5'))
          console.log(err)
        })

      this.historyRefresh = false
      this.showCheckStatusPopup = true
      this.transferAmount = ''
      this.transferLock = false
      // 控制 v-if 重新加载一次历史记录
      setTimeout(() => { this.historyRefresh = true }, 0)
      setTimeout(() => {
        this.showCheckStatusPopup = false
        this.onJumpSell(transferAmount.toDP(4, Decimal.ROUND_DOWN).toString())
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
$green: #32a85c;

.main-content{
  padding-left: 12px;
  padding-right: 12px;
  color: #fff;
  font-size: 16px;
}
.part-wrap{
  .part-title{
    padding: 12px 0;
  }
}

.common-btn{
  border-radius: 6px;
  padding: 8px 24px;
  background-color: $green;
  text-align: center;
  transition: all 250ms;

  &:active{ background-color: #d2ffe2d9; }
  &.btn_active{ background-color: #d2ffe2d9; }

  &.transfer-btn{ padding: 12px; }
  &.yellow-btn{ border-radius: 24px; background-color: #FFC100; width: 60%; margin: 24px auto; color: #000;}
}

.input-container,
.account-balance,
.history-item{
  padding: 12px;
  background-color: #222;
  border-radius: 6px;
  margin-bottom: 14px;
}
.input-container{
  padding: 20px;
  .tips{ font-size: 14px; color: #ffffffb0 }
  .input__wrap{ border-bottom: 1px solid #ffffff40;}
  .input__wrap > .line-wrap{
    font-size: 24px;
  }

}
.history-item{
  color: #ffffffb0;
  .info{
    margin-bottom: 8px;
    &:last-child{ margin: 0; }
  }
}

.all-amount{
  margin: 12px 0 24px;
  font-size: 14px;

  .amount{ color: #FFC100 }
  .select-all{ color: $green; cursor: pointer;}
}

.popup-container{
  background-color: #222;
  width: 300px;
  padding: 18px 0 32px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  border-radius: 12px;

  .img-wrap{ min-height: 160px; }
  h1{ margin: 12px 0; font-size: 24px;}
  p{ color: #ffffffa2; font-size: 14px; width: 80%; margin: 0 auto;}
  span{ font-size: 14px; cursor: pointer; }
}
.check{
  width: 300px;
  background-color: #3F3F3F;
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  color: #fff;
}

::v-deep .van-tabs__nav{ background-color: transparent; }
::v-deep .van-tab{ color: #fff }
::v-deep .van-tabs__line{ background-color: $green; }
::v-deep [class*=van-hairline]::after{ border: none; }
::v-deep .van-popup{ background-color: transparent; }
::v-deep .van-cell{ padding: 0; }
::v-deep .van-cell::after{ border: none; }
::v-deep .van-cell:not(:last-child):after{ border: none; }
::v-deep .van-cell.van-field {
  background-color: $topBgColor;
  border-radius: 10px;
}
::v-deep .van-field__value{ padding-left: 4px;}
::v-deep .van-field__control {
  color: #fff;
  font-size: 34px;
  &::-webkit-input-placeholder{ font-size: 14px; }
  &:-moz-input-placeholder{ font-size: 14px; }
  &::-moz-input-placeholder{ font-size: 14px; }
  &::-ms-input-placeholder{ font-size: 14px; }
  &::-o-input-placeholder{ font-size: 14px; }
}
</style>
