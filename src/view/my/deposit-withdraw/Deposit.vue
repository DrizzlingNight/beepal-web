<template>
  <div>
    <div class="title">{{ $t('my.depositWithdraw.tab_1') }}</div>
    <fg-dropdown
      :data-list="SupportedCoinList"
      @selectItem="selectToken"
    ></fg-dropdown>
    <!-- <div class="chain-title">链类型</div>
    <div class="btns flex">
      <div v-for="(o, i) in btnList" :key="i" :class="{ btn__active: curBtnIdx === i }" class="btn" @click="curBtnIdx = i">
        {{ o.name }}
      </div>
    </div> -->

    <div class="qr-box">
      <div class="qrcode-box">
        <fg-qrcode :text="address"></fg-qrcode>
      </div>
      <!-- <div class="save-btn">{{ $t('my.depositWithdraw.deposit.save') }}</div> -->
      <div class="tiny-title">{{ $t('my.depositWithdraw.deposit.text_1') }}</div>
      <div class="address">{{ address }}</div>
      <fg-copy :text="address">
        <div class="copy">{{ $t('my.depositWithdraw.deposit.text_2') }}</div>
      </fg-copy>
    </div>

    <div class="tips">
      <div class="tip">
        {{ $t('my.depositWithdraw.deposit.tip_1') }}
      </div>
      <div class="tip">
        {{ $t('my.depositWithdraw.deposit.tip_2') }}
      </div>
      <div class="tip">
        {{ $t('my.depositWithdraw.deposit.tip_3') }}
      </div>
    </div>
  </div>
</template>

<script>
import DepositWithdraw from './mixin/deposit-withdraw'
import FgQrcode from '@/components/qrcode/Qrcode'
import FgCopy from '@/components/copy/Copy'
import { mapGetters } from 'vuex'

export default {
  name: 'Deosit',
  components: {
    FgQrcode,
    FgCopy,
  },
  mixins: [DepositWithdraw],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['VG__getWalletById', 'VG__userWallet']),
    address() {
      if (
        !this.VG__userWallet ||
        !this.VG__userWallet.length ||
        !this.selectedToken.value
      ) {
        return '-'
      } else {
        const tokenObj = this.VG__userWallet.find(
          o => o.coin === this.selectedToken.value
        )
        console.log('tokenObj:', tokenObj)
        if (tokenObj) {
          return tokenObj.address
        } else {
          console.error('can not find tokenobj')
          return 'xx'
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './common.scss';

.qr-box {
  margin-top: 18px;
  background: #222222;
  padding: 30px 47px 23px;
  text-align: center;
}
.save-btn {
  margin-top: 23px;
  margin-bottom: 10px;
  display: inline-block;
  width: 150px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-radius: 2px;
  border: 1px solid #adadad;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
}
.tiny-title {
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: bold;
  color: rgba(136, 136, 136, 1);
}
.address {
  word-break: break-all;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 1px;
}
::v-deep .fg-copy {
  margin-top: 10px;
}
.tips {
  margin-top: 18px;
}
.tip {
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #888888;
  line-height: 1.6;
}
.fg-copy {
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 14px;
  color: rgba(34, 34, 34, 1);
  .copy {
    background: rgba(220, 218, 229, 1);
    border-radius: 3px;
    width: 70px;
    display: inline-block;
    margin: auto;
  }
}
.qrcode-box {
  margin: auto;
  width: 165px;
  height: 165px;
}
</style>
