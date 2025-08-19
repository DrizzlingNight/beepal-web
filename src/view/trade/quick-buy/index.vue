<!--
 * @Author: your name
 * @Date: 2019-11-18 10:57:01
 * @LastEditTime: 2019-11-18 11:01:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/trade/quick-buy/index.vue
 -->
<template>
  <div class="quick-buy">
    <van-tabs v-model="curIdx">
      <van-tab
        v-for="(o, i) in tokenList"
        :key="i"
        :title="o.token"
        @click="curIdx = i"
      >
        <div class="buy-input-container">
          <div class="line-wrap">
            <div class="title">{{ $t('trade.quickBuy.text_1') }}</div>
          </div>
          <div class="input__wrap">
            <div class="prefix-icon">¥</div>
            <van-field
              :value="inputAmount"
              :placeholder="$t('trade.quickBuy.input_1')"
              readonly
              clickable
              class="input"
              @touchstart.native.stop="showKeyboard = true"
            />
            <van-number-keyboard
              v-model="inputAmount"
              :show="showKeyboard"
              :close-button-text="$t('trade.quickBuy.keyboard_1')"
              safe-area-inset-bottom
              extra-key="."
              @blur="showKeyboard = false"
            />
            <div v-show="inputAmount && Number(inputAmount) < amountLimit.min" class="tips">{{ $t('trade.quickBuy.tip_1') }} {{ amountLimit.min }}</div>
            <div v-show="inputAmount && Number(inputAmount) > amountLimit.max" class="tips">{{ $t('trade.quickBuy.tip_2') }} {{ amountLimit.max }}</div>
          </div>

         <div class="amount-options">
            <div
              v-for="amount in amountOptions.options"
              :class="{active: amountOptions.currentAmount === amount}"
              :key="amount"
              class="amount-options-item"
              @click="inputAmount = amount"
            >
              <div>¥ {{ amount }}</div>
            </div>
          </div>
          <van-dropdown-menu direction="up">
            <van-dropdown-item
              ref="item"
              :title="payType > -1 ? dropdownTitle : $t('trade.quickBuy.dropdown_1')"
            >
              <ul class="payType-list">
                <li>
                  <div class="placeholder">占位</div>
                  <span>{{ $t('trade.quickBuy.dropdown_1') }}</span>
                  <div @click="confirmPayType">{{ $t('trade.quickBuy.dropdown_2') }}</div>
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
          </van-dropdown-menu>
          <button
            :class="[isBtnActive ? 'line-btn__active' : 'line-btn__unactive']"
            :disabled="btnLock"
            class="buy-btn line-btn"
            @click="buy()"
          >
          {{ $t('trade.quickBuy.button_buy') }}
          </button>
        </div>
      </van-tab>
    </van-tabs>

    <van-dialog
      v-model="isDialogVisible"
      :title="$t('trade.quickBuy.dialog_title')"
      show-cancel-button
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <div class="dialog-inner">
        {{ $t('trade.quickBuy.dialog_1') }}
        <span>{{ inputAmount }} RMB</span>
        {{ $t('trade.quickBuy.dialog_2') }}
        <span>{{ billData.crypto_amount_after_fee }}</span> USDT
      </div>
      <div v-if="this.$route.query.from" class="dialog-tips">
        购买成功的 USDT 将自动划转到 {{ thirdPartyAppName }} ，请在{{ thirdPartyAppName }}账户查看
      </div>
    </van-dialog>
  </div>
</template>

<script>
import Storage from '@/utils/storage'
import { mapGetters, mapActions } from 'vuex';
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
} from 'vant';
import { createBill, cancelBill } from '@/api';
import { settings } from "@/config";

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
  name: 'QuickBuy',
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
  },
  data() {
    const payChannel = [
        { text: this.$t('trade.payType.payType_1'), value: 0, icon: 'bank' },
        { text: this.$t('trade.payType.payType_2'), value: 1, icon: 'alipay' },
        { text: this.$t('trade.payType.payType_6'), value: 2, icon: 'wechatpay' },
        { text: this.$t('trade.payType.payType_3'), value: 3, icon: 'alipay' },
        { text: this.$t('trade.payType.payType_4'), value: 5, icon: 'alipay' },
        { text: this.$t('trade.payType.payType_5'), value: 6, icon: 'alipay' },
    ].filter(o => settings.otc.payChannel.indexOf(o.value) > -1);

    return {
      curIdx: 0, // 切换币种
      isBuyByAmount: true, // 购买方式，按金额、按数量
      tokenList: tokenList,
      inputAmount: '',
      showKeyboard: false,
      selectedToken: tokenList.length ? tokenList[0] : null,
      payType: -1,
      // option: [
      //   { text: '银行卡', value: 0, icon: 'bank' },
      //   { text: '支付宝', value: 1, icon: 'alipay' },
      //   { text: '支付宝代付', value: 3, icon: 'alipay' },
      //   { text: '支付宝（手输金额）', value: 5, icon: 'alipay' },
      //   { text: '支付宝（金额可编辑）', value: 6, icon: 'alipay' },
      // ],
      option: payChannel,
      amountOptions: {
        currentAmount: '',
        options: ['100', '500', '1000', '2000', '5000', '10000'],
      },
      isDialogVisible: false,
      btnLock: false,
      billData: {
        id: '',
        crypto_amount_after_fee: 0,
        status: -1
      }
    };
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    isBtnActive() {
      return this.inputAmount > 0 && this.payType > -1 && this.inputAmount >= this.amountLimit.min && this.inputAmount <= this.amountLimit.max
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
    amountLimit() {
      if (!settings.otc.limit) {
        return { max: 100000, min: 100 }
      } else {
        return {
          max: Number(settings.otc.limit.max) || 100000,
          min: Number(settings.otc.limit.min) || 100
        }
      }
    },
    thirdPartyAppName() {
      let app_name = ''
      this.$store.getters['thirdPartyList'].forEach(item => {
        if (item.app_id === this.$route.query.from) {
          app_name = item.name
        }
      })
      return app_name
    }
  },
  watch: {
    inputAmount(newValue, oldValue) {
      this.amountOptions.currentAmount = newValue
    }
  },
  methods: {
    ...mapActions('user', ['VA__logout']),
    confirmPayType() {
      this.$refs.item[0].toggle();
    },
    buy() {
      if (!this.VG__userInfo) {
        this.$toast({
          message: this.$t('find.toast_1'),
          type: 'fail',
          duration: 5 * 1000,
        })
        return
      }

      // btnLock 防止多次点击购买
      if (this.btnLock) return

      if (!this.isBtnActive) {
        // FIXME: 2021.07.23 自己跟自己比較有點意義不明，待確認
        if (Number(this.inputAmount) !== Number(this.inputAmount)) {
          this.$toast('Error');
        } else if (this.inputAmount <= 0) {
          this.$toast(this.$t('trade.quickBuy.toast_1'));
        } else if (this.inputAmount < this.amountLimit.min) {
          this.$toast(`${this.$t('trade.quickBuy.toast_2')} ${this.amountLimit.min}`);
        } else if (this.inputAmount > this.amountLimit.max) {
          this.$toast(`${this.$t('trade.quickBuy.toast_3')} ${this.amountLimit.max}`);
        } else if (this.payType === -1) {
          this.$toast(this.$t('trade.quickBuy.toast_4'));
        }
        return;
      }
      this.inputAmount = String(Number.parseFloat(this.inputAmount));
      this.btnLock = true
      this.__doBuy()
    },
    __doBuy() {
      const data = {
        expired: 10 * 60, // 10min 过期
        amount: String(this.inputAmount),
        channel: this.payType,
        merchant_bill_number:
          this.VG__userInfo.username + '@' + new Date().getTime().toString(),
        from_tp: this.$route.query.from,
        return_url: window.location.origin + '/#/orderStatus?type=0'
      };
      if (settings.otc.thirdParty) {
          data.channel = 7
          data.tp_channel = this.payType
      }
      console.log(JSON.stringify(data));
      createBill(data)
        .then(res => {
          console.log('createBill-res:', res);
          if (!res.crypto_amount_after_fee) {
            return this.$toast({
              message: this.$t('trade.quickBuy.toast_5'),
              type: 'fail',
              duration: 5 * 1000,
            });
          }

          Storage.setLocal('returnOrderId', res.id)
          this.billData.id = res.id
          this.billData.status = res.status
          this.billData.crypto_amount_after_fee = parseInt(res.crypto_amount_after_fee * 100) / 100
          this.isDialogVisible = true
          this.billData.local_bill_url = res.local_bill_url
          this.btnLock = false
        })
        .catch(err => {
          console.error(err.response);
          this.btnLock = false

          if (err.status === 403) {
            const vm = this
            this.$toast({
              message: '登录状态出错，请重新登录',
              type: 'fail',
              duration: 3 * 1000,
              onClose() {
                vm.$router.push({ name: 'login' })
                vm.VA__logout(false)
              }
            })
            return
          }

          this.$toast({
            message: '生成订单错误',
            type: 'fail',
            duration: 5 * 1000,
          })
        });
    },
    dialogConfirm() {
      // Inited = 0
      // InProcess = 1
      // Completed = 2
      // Failed = 3
      // Expired = 4
      switch (this.billData.status) {
        case 0:
          console.log('Inited');
          break;
        case 1:
          // window.location.href = `/api/open/checkout/${this.billData.id}/`
          window.location.href = this.billData.local_bill_url
          // this.$router.push({
          //     name: 'frame',
          //     params: {
          //       url: `/api/open/checkout/${this.billData.id}/`,
          //       title: ' '
          //     },
          //   });
          break;
        case 2:
          console.log('Completed');
          break;
        case 3:
          console.log('Failed! Status: 3');
          this.$toast({
            message: 'Failed! Status: 3',
            type: 'fail',
            duration: 5 * 1000,
          });
          break;
        case 4:
          console.log('Expired');
          break;
      }
    },
    dialogCancel() {
      cancelBill(this.billData.bill_no).then(res => {
        this.btnLock = false
        console.log(res, 'cancel');
      }).catch(err => {
        this.btnLock = false
        console.error(err);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.quick-buy {
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

.buy-input-container {
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
  border-bottom: 1px solid #ffcd30;
  .prefix-icon {
    font-size: 20px;
    margin-right: 4px;
    color: #fff;
  }
}
.buy-btn {
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  background-color: #FFC100;
  width: 100%;
  border: none;

  &:disabled{
    background: rgb(255, 228, 148);
    color: #fff;
    cursor: not-allowed;
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
      $success: #FFC100;
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
.tips{
  color: #e05454;
  width: 350px;
  font-size: 12px;
  text-align: center;
}
.amount-options {
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-column-gap: 5%;
  grid-row-gap: 20px;
  margin: 20px 0;

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
      background-color: #ffc100;
      border: none;
      color: #000;

      span {
        color: #000;
      }
    }
  }
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
.dialog-tips{
  color: rgb(255, 43, 46); font-size: 14px; text-align: center; padding: 0 40px 10px;
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
  background-color: $yellow;
}
::v-deep .van-cell.van-field {
  background-color: $topBgColor;
  border-radius: 10px;
}
::v-deep .van-field__control {
  color: #fff;
  font-size: 18px;
}
::v-deep .van-dropdown-menu {
  background-color: transparent;
  border: 1px solid #7a6428;
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
