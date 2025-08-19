<!--
 * @Author: your name
 * @Date: 2019-11-18 10:57:01
 * @LastEditTime: 2019-11-18 11:01:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/trade/quick-sell/index.vue
 -->
<template>
  <div class="quick-sell">
    <van-tabs v-model="curIdx">
      <van-tab
        v-for="(o, i) in tokenList"
        :key="i"
        :title="o.token"
        @click="curIdx = i"
      >
        <div class="sell-input-container">

          <div class="line-wrap">
            <div class="title">{{ $t('trade.quickSell.text_1') }}</div>
          </div>
          <div class="input__wrap">
            <span style="color: #fff; font-size: 16px;">{{ tokenList[curIdx].token }}</span>
            <van-field
              :value="inputAmount"
              :placeholder="$t('trade.quickSell.input_1')"
              readonly
              clickable
              class="input"
              @touchstart.native.stop="showKeyboard = true"
            />
            <div class="all-in-btn flex row-v-c"
              @click="inputAmount = coinAmount"
            >{{ $t('trade.quickSell.button_allSell') }}</div>
            <van-number-keyboard
              v-model="inputAmount"
              :show="showKeyboard"
              :close-button-text="$t('trade.quickSell.keyboard_1')"
              safe-area-inset-bottom
              extra-key="."
              @blur="showKeyboard = false"
            />
          </div>

          <div v-if="VG__userInfo" class="sell-result-amount line-wrap">
            <div>
              <!-- <div>{{ $t('my.depositWithdraw.withdraw.label_2') }}：{{ currentFee }}</div> -->
              <div>
                {{ $t('trade.quickSell.text_2') }}：{{ coinAmount }}
                <!-- {{ tokenList[curIdx].token }} -->
              </div>
            </div>
            <!-- <div class="tips">
              <div>{{ $t('trade.quickBuy.tip_2') }}</div>
              <div>{{ currentSellMax }}</div>
            </div> -->
          </div>

          <div class="amount-options">
            <div
              v-for="amount in amountOptions.options"
              :class="{active: amountOptions.currentAmount === amount}"
              :key="amount"
              class="amount-options-item"
              @click="inputAmount = amount"
            >
              <div>{{ amount }}</div>
            </div>
          </div>
          <!-- <van-dropdown-menu direction="up">
            <van-dropdown-item
              ref="item"
              :title="payType > -1 ? dropdownTitle : $t('trade.quickSell.dropdown_1')"
            >
              <ul class="payType-list">
                <li>
                  <div class="placeholder">占位</div>
                  <span>{{ $t('trade.quickSell.dropdown_1') }}</span>
                  <div @click="confirmPayType">{{ $t('trade.quickSell.dropdown_2') }}</div>
                </li>
                <li
                  v-for="item in option"
                  :key="item.value"
                  :class="{active: item.value === payType}"
                  @click="payType = item.value"
                >
                  <div class="payType-item-inner" >
                    <div class="placeholder">占位</div>
                    <div>
                      <svg-icon :icon-class="item.icon"></svg-icon>
                      {{ item.text }}
                    </div>
                    <span class="tick tick-success"></span>
                  </div>
                </li>
              </ul>
            </van-dropdown-item>
          </van-dropdown-menu> -->
          <div
            :class="{
              'line-btn__active': btnLock,
            }"
            class="sell-btn line-btn"
            @click="onSell"
          >
          {{ $t('trade.quickSell.button_sell') }}
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <div class="bank-wrap">
      <div
        v-for="item in VG__userChannel"
        :key="item.id"
        class="bank-item"
        @click="clickBank('accountInfo', item)"
      >
        <div class="bank-name">
          <svg-icon icon-class="bank" style="width: 2em; height: 2em"></svg-icon>
          <span>{{ item.bank_name }}</span>
        </div>
        <div class="card">{{ item.account_number }}</div>
      </div>
      <div v-if="VG__userChannel.length === 0" class="add-bank-account" @click="clickBank('setAccount')">
        <div class="plus icon"></div>
        <span>{{ $t('my.payAccount.title_2') }}</span>
      </div>
    </div>

    <van-dialog
      v-model="isSellDialogVisible"
      :title="$t('trade.quickSell.dialog_title')"
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <div class="dialog-inner">
        {{ $t('trade.quickSell.sell_dialog_1') }}
        <span style="font-size: 16px;">{{ billOutData.amount_after_fee }} {{ billOutData.crypto_currency }}</span>
        {{ $t('trade.quickSell.sell_dialog_2') }}
        <!-- <span>{{ billData.crypto_amount_after_fee }}</span> USDT -->
        <span style="font-size: 18px;">{{ billOutData.currency_amount_after_fee }}</span> RMB
      </div>

      <!-- <div style="color: #6E6E6E; text-align: center; font-size: 14px; margin-bottom: 10px;">
        {{$t('trade.quickSell.sell_dialog_fee')}}
        <span style="color: rgb(63, 104, 213)">
          {{ feeDecimalFormat(billOutData.amount_after_fee, billOutData.fee) }} {{ billOutData.crypto_currency }}
        </span>
      </div> -->
    </van-dialog>
    <van-dialog v-model="isBankDialogVisible" :show-confirm-button="false" class="judge-bank-dialog">
      <div class="inner"> {{ $t('my.payAccount.dialog_2') }} </div>
      <div class="btns line-wrap">
        <div class="cancel-btn" @click="isBankDialogVisible = false"> {{ $t('my.payAccount.cancel') }} </div>
        <div class="comfirm-btn" @click="isBankDialogVisible = false"> {{ $t('my.payAccount.confirm') }} </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  Field,
  NumberKeyboard,
  ActionSheet,
  CellGroup,
  Cell,
  DropdownMenu,
  DropdownItem,
  Tab,
  Tabs,
  Dialog
} from 'vant';
// import { cancelBillOut } from '@/api'; // 2021.07.23 沒用到，先注解起來
import { getChannelList, createBillOut, getUserInfoById, getProfitRate } from '@/api';
import Storage from '@/utils/storage'
import { settings } from "@/config";
import { Decimal } from 'decimal.js';

window.Decimal = Decimal

const tokenList = [
  {
    token: 'USDT',
    code: "ETH_USDT",
    cnyRate: 7,
  },
  {
    token: 'BTC',
    code: "BTC_BTC",
    cnyRate: 50000,
  },
  {
    token: 'ETH',
    code: "ETH",
    cnyRate: 1200,
  },
  {
    token: 'EOS',
    code: "EOS_EOS",
    cnyRate: 22,
  },
].filter(o => settings.otc.coinList.indexOf(o.code) > -1);

export default {
  name: 'QuickSell',
  components: {
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [ActionSheet.name]: ActionSheet,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Dialog.name]: Dialog,
  },
  data() {
    const payChannel = [
      { text: this.$t('trade.payType.payType_1'), value: 0, icon: 'bank' },
      { text: this.$t('trade.payType.payType_2'), value: 1, icon: 'alipay' },
      { text: this.$t('trade.payType.payType_3'), value: 3, icon: 'alipay' },
      { text: this.$t('trade.payType.payType_4'), value: 5, icon: 'alipay' },
      { text: this.$t('trade.payType.payType_5'), value: 6, icon: 'alipay' },
    ].filter(o => settings.otc.payChannel.indexOf(o.value) > -1);

    return {
      curIdx: 0, // 切换币种
      // isBuyByAmount: true, // 购买方式，按金额、按数量
      tokenList: tokenList,
      inputAmount: this.$route.params.amount || '',
      showKeyboard: false,
      // selectedToken: tokenList.length ? tokenList[0] : null,
      payType: 0,
      // // option: [
      // //   { text: '银行卡', value: 0, icon: 'bank' },
      // //   { text: '支付宝', value: 1, icon: 'alipay' },
      // //   { text: '支付宝代付', value: 3, icon: 'alipay' },
      // //   { text: '支付宝（手输金额）', value: 5, icon: 'alipay' },
      // //   { text: '支付宝（金额可编辑）', value: 6, icon: 'alipay' },
      // // ],
      option: payChannel,
      amountOptions: {
        currentAmount: '',
        options: ['100', '500', '1000', '2000', '5000', '10000'],
      },
      isSellDialogVisible: false,
      isBankDialogVisible: false,
      billOutData: {
        id: '',
        amount_after_fee: '',
        currency_amount_after_fee: 0,
        status: -1,
        fee: 0
      },
      btnLock: false,
      profit: 0
    };
  },
  computed: {
    ...mapGetters(['VG__userInfo', 'VG__userChannel']),
    isBtnActive() {
      return this.inputAmount > 0 && this.payType > -1;
    },
    dropdownTitle() {
      let title = ''
      this.option.forEach(item => {
        if (item.value === this.payType) {
          title = item.text
        }
      })
      return title
    },
    coinAmount() {
      let coinId = 0
      let amount = 0
      this.$store.getters['VG__coinList'].forEach(coin => {
        if (this.tokenList[this.curIdx].token === coin.name) {
          coinId = coin.id
        }
      })
      this.$store.getters['VG__userInfo'].balances.forEach(i => {
        if (i.coin === coinId) {
          amount = i.amount
        }
      })
      return (new Decimal(amount)).toFixed(4, Decimal.ROUND_DOWN).toString()// (parseInt(amount * 10000) / 10000).toFixed(4)
    },
    // currentFee() {
    //   if(Number(this.inputAmount) !== Number(this.inputAmount)) return 'Error'
    //   return this.feeDecimalFormat(this.inputAmount, this.profit)
    // },
  },
  watch: {
    inputAmount(newValue, oldValue) {
      this.amountOptions.currentAmount = newValue
    }
  },
  // mounted() {
  //   this.getProfitRate()
  // },
  methods: {
    feeDecimalFormat(a, b) {
      return new Decimal(Number(a)).times(new Decimal(b)).toFixed(2, Decimal.ROUND_UP).toString()
    },
    confirmPayType() {
      this.$refs.item[0].toggle();
    },
    getProfitRate() {
      let channel = this.payType
      if (settings.otc.thirdParty) {
        channel = 7
      }
      return getProfitRate(1, channel).then(res => {
        this.profit = Number(res.max_profit)
      }).catch(err => {
        console.log('getProfitRate:', err);
      })
    },
    async onSell() {
      if (!this.VG__userInfo) {
        this.$toast({
          message: this.$t('find.toast_1'),
          type: 'fail',
          duration: 5 * 1000,
        })
        return
      }

      if (this.btnLock) return

      if (this.inputAmount <= 0) {
        return this.$toast(this.$t('trade.quickBuy.toast_1'));
      }
      // if(!this.profit) {
      //   return this.$toast('Fee Error');
      // }
      // FIXME: 2021.07.23 自己跟自己比較有點意義不明，待確認
      if (Number(this.inputAmount) !== Number(this.inputAmount)) {
        return this.$toast('Error');
      }
      if (Number(this.inputAmount) < 10) {
        return this.$toast(this.$t('trade.quickSell.input_1'));
      }
      if (Number(this.inputAmount) > Number(this.coinAmount)) {
        return this.$toast(`${this.$t('trade.quickBuy.toast_3')}${this.$t('my.depositWithdraw.withdraw.tip_2')}`);
      }

      this.btnLock = true

      // await this.getProfitRate()

      getChannelList().then(res => {
        if (!res.data.results.length) { // 2021.08.16 配合新API，資料放res.data裡
          this.isBankDialogVisible = true
          this.btnLock = false
        } else {
          const data = {
            expired: 10 * 60, // 10min 过期
            amount: new Decimal(Number(this.inputAmount)).toString(),
            channel: this.payType,
            merchant_bill_number:
              this.VG__userInfo.username + '@' + new Date().getTime().toString(),
            from_tp: this.$route.query.from
          }
          if (settings.otc.thirdParty) {
            data.channel = 7
            data.tp_channel = this.payType
          }
          createBillOut(data).then(res => {
            this.btnLock = false

            if (!res.currency_amount_after_fee) {
              return this.$toast({
                message: this.$t('trade.quickBuy.toast_5'),
                type: 'fail',
                duration: 5 * 1000,
              });
            }
            Object.assign(this.billOutData, res)
            this.billOutData.amount_after_fee = new Decimal(res.amount_after_fee).toFixed(4, Decimal.ROUND_DOWN).toString()
            this.billOutData.currency_amount_after_fee = new Decimal(res.currency_amount_after_fee).toFixed(2, Decimal.ROUND_DOWN).toString()
            this.billOutData.fee =
              Number(res.team_channel_range_platform_profit) +
              Number(res.team_channel_range_pool) +
              Number(res.team_channel_range_assurer_profit) +
              Number(res.team_channel_range_proxy_profit)
            // this.billOutData.id = res.id
            // this.billOutData.amount_after_fee = parseInt(res.amount_after_fee * 100) / 100
            // this.billOutData.status = res.status
            // this.billOutData.currency_amount_after_fee = parseInt(res.currency_amount_after_fee * 100) / 100

            this.isSellDialogVisible = true
            // 重新获取账户余额
            this.__getUserInfoById()
          }).catch(err => {
            this.btnLock = false
            console.error(err);
          })
        }
      })
    },
    dialogConfirm() {
      // Inited = 0
      // InProcess = 1
      // Completed = 2
      // Failed = 3
      // Expired = 4
      // Auditing = 5
      switch (this.billOutData.status) {
        case 0:
          console.log('Inited');
          this.isSellDialogVisible = false
          break;
        case 1:
          console.log('InProcess');
          this.isSellDialogVisible = false
          this.$router.push({ name: 'orderStatus', query: { id: this.billOutData.id }})
          break;
        case 2:
          console.log('Completed');
          this.isSellDialogVisible = false
          this.$router.push({ name: 'orderStatus', query: { id: this.billOutData.id }})
          break;
        case 3:
          console.log('Failed! Status: 3');
          this.isSellDialogVisible = false
          this.$toast({
            message: 'Failed! Status: 3',
            type: 'fail',
            duration: 5 * 1000,
          });
          break;
        case 4:
          console.log('Expired');
          this.isSellDialogVisible = false
          break;
        case 5:
          console.log('Auditing');
          this.isSellDialogVisible = false
          break;
      }
    },
    dialogCancel() {
      this.isSellDialogVisible = false
      // cancelBillOut(this.billOutData.id).then(res => {
      //   console.log(res, 'cancel');
      // }).catch(err => {
      //   console.error(err);
      // });
    },
    __getUserInfoById() {
      const id = this.$store.getters['VG__userInfo'].id
      getUserInfoById(id).then(res => {
        if (!res) return
        Storage.setLocal('userInfo', res)
        this.$store.dispatch('user/VA__setUserInfo', res)
      })
    },
    clickBank(route, params) {
      if (this.$route.name.includes('third')) {
        const fistUpperCase = route.slice(0, 1).toUpperCase() + route.slice(1)
        this.$router.push({ name: `third${fistUpperCase}`, params })
      } else {
        this.$router.push({ name: route })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.quick-sell {
  background: $bodyBgColor;
  // height: 70vh;
  padding-bottom: 100px;
}

.token-container {
  display: flex;
  overflow: auto;

  .token-item {
    font-size: 14px;
    font-weight: 800;
    color: rgba(36, 38, 43, 1);
    text-align: center;
    position: relative;
    line-height: 2.4;
    width: 40px;

    & + .token-item {
      margin-left: 2em;
    }

    &__active::after {
      content: '';
      position: absolute;
      bottom: 0;
      height: 3px;
      left: 0;
      right: 0;
      background: rgba(36, 38, 43, 1);
    }
  }
}

.sell-input-container {
  background-color: #232124;
  padding: 10px 20px 20px;
  margin-top: 20px;

  .title {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
  .toggle-buy {
    font-size: 10px;
    font-weight: 400;
    color: rgba(25, 25, 25, 1);
  }
}

.input__wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
  height: 50px;
  border-bottom: 1px solid #39B167;
  .prefix-icon {
    font-size: 20px;
    margin-right: 4px;
    color: #fff;
  }
}
.sell-result-amount {
  font-size: 12px;
  color: rgba(25, 25, 25, 1);
  height: 4em;
  color: #39B167;

}
.sell-btn {
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  background-color: #39B167;
  color: #fff;

  &.line-btn__active{
    background: #7ed29e;
  }
}
.btn__wrap {
  margin: 10px 0;
}
.payType-list{
  li{
    text-align: center;
    line-height: 4em;
    background-color: #222;
    color: #fff;
    padding: 0 20px;

    .placeholder{
      opacity: 0;
    }

    &.active{
      .tick{
        opacity: 1;
      }
    }

    .payType-item-inner{
      border-bottom: 1px solid #535353;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .tick {
      $size: 25px;
      $line: 3px;
      $space: 20%;
      $success: #39B167;
      $sign: #000;
      // display: none;
      opacity: 0;
      display: inline-block;
      position: relative;
      width: $size; height: $size;
      border-radius: $size/2;
      &:before, &:after {
        background: $sign;
        position: absolute;
        content: ' ';
        left: $space*1.5;
        right: $space*1.5;
        top: 50%;
        height: $line;
        bottom: auto;
      }
      &-success{
        background: $success;
        transform: rotate(45deg);

        &:after{
          height: $line; bottom: 25%;
          left: 30%; right: 45%;
          top: auto;
        }
        &:before{
          width: $line; height: auto; bottom: 25%;
          top: $space; left: 55%; right:auto;
        }
      }
    }

    &:first-child{
      border-bottom: 1px solid #535353;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.amount-options {
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-column-gap: 5%;
  grid-row-gap: 20px;
  margin: 10px 0 20px;

  .amount-options-item {
    border: 1px solid #6b6b6b;
    text-align: center;
    border-radius: 4px;
    padding: 20px 0;
    color: #fff;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    span {
      color: #9f9f9f;
      font-size: 14px;
    }

    &.active {
      background-color: #39B167;
      border: none;

      span {
        color: #fff;
      }
    }
  }
}
.all-in-btn{
  width: 120px;
  height: 40px;
  text-align: center;
  color: #fff;
  border-left: 1px solid #979797;
  padding-left: 10px;

}
.dialog-inner{
  text-align: center;
  line-height: 40px;
  color: #6E6E6E;
  span:first-child{
    color: #385bf6;
  }
  span:last-child{
    color: #2C59FF;
    font-size: 20px;
  }
}
.tips{
  color: #e05454;
  width: 110px;
  font-size: 12px;
  text-align: end;
}
.judge-bank-dialog{
  background-color: #242424;
  padding: 20px 0;
  border:1px solid rgba(83,83,83,1);
  .inner{
    padding: 20px 0 40px;
    text-align: center;
    color: #fff;
  }
  .btns{
    justify-content: space-around;
    padding: 0 60px;

    div{
      border-radius: 4px;
      padding: 0 20px;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      color: #000;
    }
    .cancel-btn{ background-color: #D8D8D8; }
    .comfirm-btn{ background-color: #FFC100; }
  }
}

.bank-wrap{
  color: #fff;
  .add-bank-account{
    width: 90%;
    margin: 20px auto;
    background-color: #222;
    display: flex;
    align-items: center;
    padding: 20px 0;

    > span{
      margin-left: 20px;
      font-size: 18px;
    }

    &:active{
      background-color: lighten($color: #222, $amount: 4%);
    }
  }
  .bank-item{
    box-sizing: border-box;
    width: 90%;
    margin: 20px auto;
    padding: 20px;
    background-color: #222;
    .bank-name{
      display: flex;
      align-items: center;
      margin-bottom: 4px;

      .svg-icon{
        margin-right: 14px;;
      }
    }
    .card{
      margin-left: calc(2em + 14px);
    }
  }
  .plus.icon {
    color: #000;
    position: relative;
    height: 40px;
    width: 40px;
    user-select: none;
    margin-left: 40px;

    &::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 4px;
      border-radius: 2px;
      background-color: #fff;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -60%);
    }
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 4px;
      border-radius: 2px;
      background-color: #fff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%) rotate(90deg);
    }
  }
}

::v-deep .van-tabs__nav {
  background: $bodyBgColor;
}
::v-deep .van-hairline--top-bottom::after,
::v-deep .van-hairline-unset--top-bottom::after {
  border: none;
}
::v-deep .van-cell:not(:last-child)::after {
  border: none;
}
::v-deep .van-popup,
::v-deep .van-cell {
  // background-color: transparent;
  background-color: #eee;
}
::v-deep .van-tab--active {
  color: #fff;
}
::v-deep .van-tabs__line {
  background-color: #39B167;
}
::v-deep .van-cell.van-field {
  background-color: $topBgColor;
  border-radius: 10px;
}
::v-deep .van-field__control {
  color: #fff;
  font-size: 18px;
  &::-webkit-input-placeholder{ font-size: 14px; }
  &:-moz-input-placeholder{ font-size: 14px; }
  &::-moz-input-placeholder{ font-size: 14px; }
  &::-ms-input-placeholder{ font-size: 14px; }
  &::-o-input-placeholder{ font-size: 14px; }
}
::v-deep .van-dropdown-menu {
  background-color: transparent;
  border: 1px solid #2e543a;
  border-radius: 4px;
}
::v-deep .van-dropdown-menu__item{
  justify-content: start;
}
::v-deep .van-dropdown-menu__title {
  color: #b0b0b0;
  width: 100%;
}
::v-deep .van-dropdown-menu__title::after{
  top: 20%;
  right: 4vw;
  transform: rotate(-45deg);
  border: 1.4vw solid;
  border-color: transparent transparent #fff #fff;
  opacity: 1;
  margin-top: -1px;
}
::v-deep .van-dropdown-item__content .van-cell {
  background-color: #fff;
  border-radius: 10px;
}
::v-deep .van-dropdown-item--up{
  bottom: 0px !important;
}
</style>
