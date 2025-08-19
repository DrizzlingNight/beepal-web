<template>
  <div class="withdraw has-bottom-action-btn">
    <div class="title">{{ $t('my.depositWithdraw.tab_2') }}</div>
    <fg-dropdown
      :is-auto-slected-first-item="true"
      :data-list="SupportedCoinList"
      @selectItem="selectToken"
    ></fg-dropdown>
    <!-- <div class="chain-title">链类型</div>
    <div class="btns flex">
      <div v-for="(o, i) in btnList" :key="i" :class="{ btn__active: curBtnIdx === i }" class="btn" @click="curBtnIdx = i">
        {{ o.name }}
      </div>
    </div>-->

    <div class="label">{{ $t('my.depositWithdraw.withdraw.text_1') }}</div>
    <van-cell-group>
      <van-field v-model="address" :placeholder="`${$t('my.depositWithdraw.withdraw.input_1_1')}${selectedToken.name}${$t('my.depositWithdraw.withdraw.input_1_2')}`" />
    </van-cell-group>
    <div class="address-tip">
      {{ $t('my.depositWithdraw.withdraw.tip_1_1') }}{{
      selectedToken.name
      }}{{ $t('my.depositWithdraw.withdraw.input_1_2') }}
    </div>

    <div class="label">Memo</div>
    <van-cell-group>
      <van-field v-model="memo" placeholder="memo(选填)" />
    </van-cell-group>
    <div class="label">{{ $t('my.depositWithdraw.withdraw.label_1') }}</div>
    <van-cell-group>
      <van-field v-model="amount" :placeholder="`${$t('my.depositWithdraw.withdraw.placeholder_1')}${selectedToken.name}${$t('my.depositWithdraw.withdraw.label_1')}`" />
      <div class="right">
        <div class="usdt">{{ selectedToken.name }} |</div>
        <div class="all" @click="clickAll">{{ $t('my.depositWithdraw.withdraw.button_1') }}</div>
      </div>
    </van-cell-group>
    <div class="amount-tip">
      {{ $t('my.depositWithdraw.withdraw.tip_2') }}: {{
      SelfAccountSelectedItemBalances | findCoinAndGetAmount(selectedToken)
      }}
    </div>
    <div class="label">{{ $t('my.depositWithdraw.withdraw.label_2') }}</div>
    <van-cell-group>
      <van-field v-model="selectedTokenFee" readonly />
      <div class="right">
        <div class="usdt">{{ selectedToken.name }}</div>
      </div>
    </van-cell-group>

    <div class="withdraw-btn" @click="withdrawValid()">{{ $t('my.depositWithdraw.withdraw.button_2') }}</div>

    <van-dialog
      v-model="show"
      :title="$t('my.depositWithdraw.withdraw.dialog_title')"
      show-cancel-button
      @confirm="doWithdraw"
      @cancel="show = false"
    >
      <div class="address">{{ address }}</div>
      <div class="amount">{{ $t('my.depositWithdraw.withdraw.dialog_1') }}{{ amount }} {{ selectedToken.name }}</div>
      <div
        class="amount"
      >{{ $t('my.depositWithdraw.withdraw.dialog_2') }}{{ amount - (settings.withdrawfeein ? selectedTokenFee : 0 ) }} {{ selectedToken.name }}</div>
      <div class="tip">{{ $t('my.depositWithdraw.withdraw.dialog_3') }}{{ selectedTokenFee }} {{ selectedToken.name }}</div>
    </van-dialog>
  </div>
</template>

<script>
import DepositWithdraw from './mixin/deposit-withdraw'
import { CellGroup, Field } from 'vant'
import { mapGetters } from 'vuex'
import { settings } from '@/config'
import { coinTransfer } from '@/api/beePal'

export default {
  name: 'Withdraw',
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
  },
  filters: {
    findCoinAndGetAmount(list, selectedToken) {
      if (!list) return '-'
      const obj = list.find(o => o.name === selectedToken.name)
      if (obj && obj.hasOwnProperty('amount')) {
        return obj['amount']
      }
      return '-'
    },
  },
  mixins: [DepositWithdraw],
  data() {
    return {
      settings,
      show: false,
      address: '',
      amount: '',
      memo: '',
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo', 'VG__coinList']),
    SelfAccountList() {
      return [
        {
          name: this.$t('my.depositWithdraw.withdraw.text_2'),
          balances: this.VG__userInfo.balances
            .map(o => ({
              ...o,
              ...this.VG__coinList.find(p => o.coin === p.id),
            }))
            .filter(o => o.isCrypto),
        },
      ]
    },
    SelfAccountSelectedItem() {
      return this.SelfAccountList[0]
    },
    SelfAccountSelectedItemBalances() {
      return this.SelfAccountSelectedItem.balances || []
    },

    selectedTokenInfo() {
      if (!this.selectedToken) {
        return {
          fee: '-',
          min: '-',
          max: '-',
        }
      }
      return this.settings.TOKEN_TRANSFER_CONFIG_LIST.find(
        o => o.code === this.selectedToken.code
      )
    },
    selectedTokenFee() {
      console.log('this.selectedTokenInfo:', this.selectedTokenInfo)
      return (this.selectedTokenInfo && this.selectedTokenInfo.fee) || '0'
    },
    selectedTokenMin() {
      return (this.selectedTokenInfo && this.selectedTokenInfo.min) || '-'
    },
    selectedTokenMax() {
      return (this.selectedTokenInfo && this.selectedTokenInfo.max) || '-'
    },
  },
  methods: {
    withdrawValid() {
      const yuE = this.__getCoinAmount(
        this.SelfAccountSelectedItemBalances,
        this.selectedToken
      )
      if (this.address === '') {
        this.$toast(this.$t('my.depositWithdraw.withdraw.toast_2'))
        return false
      }
      if (this.amount === '') {
        this.$toast(this.$t('my.depositWithdraw.withdraw.toast_3'), this.$t('my.depositWithdraw.withdraw.toast_1'))
        return false
      } else if (Number.isNaN(parseFloat(this.amount))) {
        this.$toast(this.$t('my.depositWithdraw.withdraw.toast_4'), this.$t('my.depositWithdraw.withdraw.toast_1'))
        return false
      } else if (Number(this.amount) > yuE) {
        this.$toast(`${this.$t('my.depositWithdraw.withdraw.toast_5')}${yuE}`, this.$t('my.depositWithdraw.withdraw.toast_1'))
        return false
      }
      if (this.amount < this.selectedTokenMin) {
        this.$toast(
          `${this.$t('my.depositWithdraw.withdraw.toast_6')}${this.selectedTokenMin} ${this.selectedToken.name}`,
          this.$t('my.depositWithdraw.withdraw.toast_1')
        )
        return false
      } else if (this.amount > this.selectedTokenMax) {
        this.$toast(
          `${this.$t('my.depositWithdraw.withdraw.toast_7')}${this.selectedTokenMax} ${this.selectedToken.name}`,
          this.$t('my.depositWithdraw.withdraw.toast_1')
        )
        return false
      }
      this.show = true
    },
    doWithdraw() {
      const data = {
        coin: this.selectedToken.id,
        amount: String(this.amount),
        target_address: this.address, // 2021.08.11 新API address改成target_address
        fee_amount: this.selectedTokenFee,
        memo: this.memo,
      }
      coinTransfer(data) // 2021.08.11 舊API transaction()換成新API coinTransfer()
        .then(res => {
          console.log('coinTransfer-res:', res)
          if (res.code === 0) {
            this.$toast(this.$t('my.depositWithdraw.withdraw.toast_8'))
            // 成功之后，重置表单
            this.address = ''
            this.amount = ''
            this.memo = ''
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('base.unknownErr'))
          }
        })
        .catch(err => {
          console.log('coinTransfer-err:', err)
          this.$toast(this.$t('my.depositWithdraw.withdraw.toast_9'))
          // 失败之后，重置表单
          this.address = ''
          this.amount = ''
          this.memo = ''
        })
    },
    __getCoinAmount(list, selectedToken) {
      if (!list) return '-'
      const obj = list.find(o => o.name === selectedToken.name)
      if (obj && obj.hasOwnProperty('amount')) {
        return obj['amount']
      }
      return '-'
    },
    clickAll() {
      this.amount = this.__getCoinAmount(
        this.SelfAccountSelectedItemBalances,
        this.selectedToken
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import './common.scss';

.label {
  margin-top: 30px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
}
.input {
  font-size: 18px;
}
::v-deep .van-cell {
  padding-left: 0;
  background-color: #111111;
}
.right {
  position: absolute;
  right: 10px;
  top: 1em;
  display: flex;
  align-items: center;
  line-height: 20px;
}
.usdt {
  font-size: 14px;
  font-weight: bold;
  color: #888888;
}
.all {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin-left: 6px;
}

.withdraw-btn {
  position: absolute;
  left: 5vw;
  bottom: 80px;
  width: 90vw;
  height: 46px;
  line-height: 46px;
  text-align: center;
  background: rgba(0, 122, 255, 1);
  border-radius: 2px;
  font-size: 18px;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);

  &:active {
    background-color: #0069db;
  }
}
::v-deep .van-field__control {
  color: #fff;
}
::v-deep [class*='van-hairline']::after {
  border: none;
  border-bottom: 1px solid #595959;
}
::v-deep .van-cell:not(:last-child)::after {
  border: none;
}
// 保证内容不会被底部的操作按钮遮挡住
.components.has-bottom-action-btn {
  padding-bottom: 90px;
}

.amount-tip {
  margin-top: 4px;
  color: #fff;
  font-size: 12px;
}

.van-dialog {
  background-color: #242424;
  text-align: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);

  ::v-deep.van-dialog__header {
    font-weight: bold;
    color: rgba(255, 193, 0, 1);
  }
  ::v-deep.van-dialog__content {
    line-height: 1.6;
    padding: 20px 0;
    .amount {
      font-weight: 600;
    }
    .tip {
      font-size: 12px;
      font-weight: 600;
      color: #848484;
    }
  }
  ::v-deep.van-button--default {
    background-color: #242424;
  }
  ::v-deep.van-dialog__cancel {
    color: #999999;
  }
  ::v-deep[class*='van-hairline']::after {
    border: none;
    border-top: 1px solid #4f4f4f;
  }
}

// placeholder
input::-webkit-input-placeholder {
  color: #424242;
}
.address-tip {
  font-size: 12px;
  color: #a32d2d;
}
</style>
