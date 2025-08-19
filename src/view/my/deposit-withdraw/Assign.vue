<template>
  <div class="assign">
    <div v-for="wallet in walletList" :key="wallet.id" class="account-wrapper">
      <h3>{{ wallet.user_name }}</h3>
      <div class="line line--between line--v-c">
        <div class="thirdParty-left line line--v-c">
          <div class="action-btns">
            <!-- 0-deposit， 1-withdraw -->
            <!-- 当没有withdraw时，要显示tips -->
            <div class="action-btn" @click="clickTransfer(wallet, false)"> 划入 </div>
             <div v-if="!wallet.is_parent" class="action-btn" @click="clickTransfer(wallet, true)"> 划出 </div>
          </div>
        </div>
        <div class="thirdParty-right">
          <div class="thirdParty-right-top">可用额度：</div>
          <div class="thirdParty-right-bottom">
            <div class="amount">
              {{ format(wallet.balances, wallet.coin) }}
            </div>
            <div class="token">
              {{ wallet.coin_name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下面是InputDialog弹窗 -->
    <input-dialog
            v-model="isShow"
            :transfer-type="1"
            :available-withdraw-amount="availableWithdrawAmout"
            :available-deposit-amount="availableDepositAmount"
            tips=""
            @confirm="confirmTransfer"
    ></input-dialog>
  </div>
</template>

<script>
import { getCoinWalletList } from '@/api'
import { coinTransfer } from '@/api/beePal'
import InputDialog from '@/components/dialog/InputDialog'
import { mapGetters } from 'vuex'

export default {
  name: "Assign",
  components: {
    InputDialog,
  },
  data() {
    return {
      walletList: [],
      isShow: false,
      availableWithdrawAmout: 0,
      availableDepositAmount: 0,
      coinid: undefined,
      address: undefined,
      memo: undefined,
      user: undefined
    }
  },
  computed: {
    ...mapGetters([
      'VG__coinList',
      'VG__userInfo',
      'VG__getCoinLabelById',
      'VG__getCoinIdByLabel',
      'VG__getCoinDecimalPlacesByLabel',
      'VG__getUSDTId',
    ])
  },
  mounted() {
      this.getList()
  },
  methods: {
    getList() {
        getCoinWalletList().then(res => {
            console.log("getCoinWalletList", res)
            this.walletList = res
        }).catch(err => {
            console.log('getCoinWalletList:', err)
        })
    },
    format(balances, coinId) {
      let amount = 0
      balances.forEach(item => {
        item.coin === coinId ? amount = item.amount : undefined
      })
      return Number(amount).toFixed(4)
    },
    initData() {
        this.coinid = undefined
        this.address = undefined
        this.memo = undefined
        this.user = undefined
    },
    clickTransfer(wallet, out) {
        this.initData()
        this.isShow = true
        this.coinid = this.walletList.length ? this.walletList[0].coin : 0
        this.VG__userInfo.balances.forEach(o => {
            o.coin === this.coinid
                ? this.availableDepositAmount = this.availableWithdrawAmout = o.amount : undefined
        })
        out ? this.user = wallet.user : this.address = wallet.address
    },
    confirmTransfer(amount) {
      const data = {
        coin: this.coinid,
        amount: String(amount),
        fee_amount: 0,
        memo: this.memo,
      }
      this.address ? data.address = this.address : undefined
      this.user ? data.user = this.user : undefined
        coinTransfer(data) // 2021.08.11 舊API transaction()換成新API coinTransfer()
        .then(res => {
          console.log('coinTransfer-res:', res)
          if (res.code === 0) {
            this.$toast(this.$t('my.depositWithdraw.withdraw.toast_8'))
            // 成功之后，重置表单
            this.address = ''
            this.amount = ''
            this.memo = ''
            this.getList()
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
  }
}
</script>

<style lang="scss" scoped>
.assign.assign.components{
  color: #fff;
  padding-left: 0;
  padding-right: 0;
}
.account-wrapper {
  margin-top: 20px;
  background: rgba(34, 34, 34, 1);
  padding: 12px 17px;
  position: relative;
  > h3 {
    margin-top: 12px;
  }
}
.action-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .action-btn + .action-btn {
    background: rgba(52, 127, 255, 1);
    color: rgba(255, 255, 255, 1);
  }
}
.action-btn {
  min-width: 50px;
  padding: 4px 6px;
  margin-right: 10px;
  // line-height: 30px;
  background: linear-gradient(
    153deg,
    rgba(255, 240, 124, 1) 0%,
    rgba(255, 193, 0, 1) 100%
  );
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(10, 10, 10, 1);
  border-radius: 4px;

  &.poa {
    position: absolute;
    top: 9px;
    right: 10px;
  }
  a {
    color: rgba(255, 255, 255, 1);
  }
}
.line {
  height: 70px;
  display: flex;
  align-items: center;
  &.line--between {
    justify-content: space-between;
  }
  &.line--v-c {
    align-items: center;
  }
  // & + .line {
  //   border-top: 1px solid #6c6c6c;
  // }
  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;

    .cny-amount {
      margin-left: 4px;
      line-height: 1.3; // different
      color: rgba(130, 130, 130, 1);
    }
  }
}
.thirdParty-right-top {
  font-size: 12px;
  font-weight: 500;
  color: rgba(158, 158, 158, 1);
  line-height: 28px;
}
.thirdParty-right-bottom {
  display: flex;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 32px;
  .token {
    margin-left: 4px;
  }
}
</style>
