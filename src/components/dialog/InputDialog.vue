<template>
  <div v-show="value" class="fg-dialog">
    <div class="mask-layer"></div>
    <div class="dialog-box">
      <div class="header title">
        {{ title }}
      </div>
      <div class="body">
        <div class="input-wrap">
          <div class="minus opration-btn" @click="clickMinus()">-</div>
          <input v-model="inputVal" type="number" />
          <div class="plus opration-btn" @click="clickPlus()">+</div>
        </div>
      </div>
      <div class="footer">
        <div class="cancel action-btn" @click="clickCancel()">{{ $t('my.payAccount.cancel') }}</div>
        <div class="confirm action-btn" @click="clickConfirm()">{{ $t('my.payAccount.confirm') }}</div>
      </div>
      <div class="tip-wrap">
        <template v-if="typeof tips === 'string'">
          <p class="tip">{{ tips }}</p>
        </template>
        <template v-else>
          <p v-for="(tip, i) in tips" :key="i" class="tip">{{ tip }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputDialog',
  props: {
    title: {
      type: String,
      default: '輸入金額',
    },
    // 要說明的tips
    tips: {
      // 字符串或者字符串數組
      type: String | Array,
      default: '*精彩視頻產品只支持充值，充值後無法轉出提現*',
    },
    // isShow的狀態
    value: {
      type: Boolean,
      default: false,
    },
    // 0-deposit, 1-withdraw
    transferType: {
      type: Number,
      require: true,
      default: 0,
    },
    // 可以體現的金額，即應用裏面的餘額
    availableWithdrawAmount: {
      type: Number | String,
      default: 0,
    },
    // 可以充值的金額，即錢包餘額
    availableDepositAmount: {
      type: Number | String,
      default: 0,
    },
  },
  data() {
    return {
      inputVal: 0,
    }
  },
  methods: {
    clickMinus() {
      if (this.inputVal >= 1) {
        this.inputVal--
      }
    },
    clickPlus() {
      this.inputVal++
    },
    clickCancel() {
      this.$emit('input', false)
    },
    clickConfirm() {
        if (
        this.transferType === 0 &&
        +this.inputVal > +this.availableDepositAmount
      ) {
        this.$toast(
          `輸入金額不能超過可用金額，當前錢包餘額爲 ${this.availableDepositAmount}`
        )
        return
      } else if (
        this.transferType === 1 &&
        +this.inputVal > +this.availableWithdrawAmount
      ) {
        this.$toast(
          `輸入金額不能超過可用金額，當前應用餘額爲 ${this.availableWithdrawAmount}`
        )
        return
      } else if (+this.inputVal === 0) {
        this.$toast(`輸入金額不能爲0`)
        return
      } else {
        this.$emit('input', false)
        this.$emit('confirm', this.inputVal)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fg-dialog {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  .mask-layer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(17, 17, 17, 0.6);
  }
  .dialog-box {
    padding: 20px 22px 18px;
    background: rgba(36, 36, 36, 1);
    border-radius: 12px;
    border: 1px solid rgba(83, 83, 83, 1);
    z-index: 2;
  }
}

.title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}
.input-wrap {
  margin-top: 20px;
  margin-bottom: 27px;
  height: 47px;
  padding: 4px;
  border-radius: 7px;
  border: 1px solid rgba(243, 243, 243, 1);

  display: flex;
  justify-content: space-between;

  .opration-btn {
    width: 58px;
    background: rgba(255, 255, 255, 0.96);
    border-radius: 5px;
    color: rgba(0, 0, 0, 1);
    font-size: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  input {
    margin-left: 6px;
    background-color: transparent;
    border: none;
    outline: none;
    color: #fff;

    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    text-align: center;
  }
}
.footer {
  margin-left: -19px;
  display: flex;
  justify-content: center;
  align-items: center;
  .action-btn {
    margin-left: 19px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    background-color: rgba(216, 216, 216, 1);
    border-radius: 4px;

    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(10, 10, 10, 1);
    &.confirm {
      background-color: #347fff;
      color: #ffffff;
    }
  }
}
.tip-wrap {
  margin-top: 10px;
  .tip {
    text-align: center;
    font-size: 11px;
    font-weight: 400;
    color: rgba(255, 63, 83, 1);
  }
}
</style>
