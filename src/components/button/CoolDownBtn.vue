<template>
  <div>
    <van-button v-if="!isBtnCoolDown" :type="btnType" :disabled="disabled" @click.stop="buttonClick">{{ btnText }}</van-button>
    <van-button v-if="isBtnCoolDown" disabled>{{ `${btnCoolDownTextBefore}${second}${btnCoolDownUnit}${btnCoolDownTextAfter}` }}</van-button>
  </div>
</template>

<script>
import { Button } from 'vant'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    [Button.name]: Button,
  },
  props: {
    btnType: {
      type: String,
      require: false,
      default: 'primary'
    },
    btnText: {
      type: String,
      require: false,
      default: function() { return this.$t('base.getValidationCode') }
    },
    // 按鈕冷卻單位字元
    btnCoolDownUnit: {
      type: String,
      require: false,
      default: 's'
    },
    // 按鈕冷卻時的文字（放在數字之前）
    btnCoolDownTextBefore: {
      type: String,
      require: false,
      default: ''
    },
    // 按鈕冷卻時的文字（放在數字之後）
    btnCoolDownTextAfter: {
      type: String,
      require: false,
      default: ''
    },
    // 按鈕冷卻秒數
    coolDownSecond: {
      type: Number,
      require: false,
      default: 60
    },
    // 設定按鈕是否為掛載即進入冷卻
    isBtnForceCoolDown: {
      type: Boolean,
      require: false,
      default: false
    },
    // 設定按鈕是否為禁用狀態
    disabled: {
      type: Boolean,
      require: false,
      default: false
    },
    // 設定按鈕點擊後是否能進入冷卻
    pass: {
      type: Boolean,
      require: false,
      default: true
    },
    callBack: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      second: 60,
      isBtnCoolDown: false,
    }
  },
  computed: {
    ...mapGetters(['coolDownTime', 'isCoolDown']), // 冷卻時間、冷卻狀態儲存在store裡
  },
  created() {
    this.second = this.coolDownSecond
  },
  mounted() {
    // 取得按鈕的冷卻時間、冷卻狀態
    this.getStorage()
    // 如果按鈕設定掛載後就要進冷卻，就強制按鈕進入冷卻
    this.isBtnCoolDown = this.isBtnForceCoolDown ? true : this.isBtnCoolDown
    if (this.isBtnCoolDown) {
      this.setBtnTimer(this.second)
    }
  },
  methods: {
    ...mapActions('app', ['setCoolDownTime', 'setIsCoolDown']),
    // 設定按鈕倒計時
    setBtnTimer(sec) {
      this.second = sec
      if (this.isBtnCoolDown) {
        // IOS按鈕冷卻離開網頁不到數的問題解決測試
        this.countdownSubtract()
        // const interval = setInterval(() => {
        //    this.setStorage(this.second, true)
        //   if (this.second-- <= 0) {
        //     this.second = this.coolDownSecond
        //     this.isBtnCoolDown = false
        //     this.setStorage(this.coolDownSecond, false)
        //     clearInterval(interval)
        //   }
        // }, 1000)
      }
    },
    countdownSubtract() {
      if (this.second > 0) {
        setTimeout(() => {
          this.second -= 1
          this.countdownSubtract()
        }, 1000)
      } else {
        this.second = this.coolDownSecond
        this.isBtnCoolDown = false
      }
    },
    // 儲存「按鈕」冷卻時間資訊
    setStorage(second, isBtnCoolDown) {
      this.setCoolDownTime(second)
      this.setIsCoolDown(isBtnCoolDown)
    },
    // 取得「按鈕」冷卻時間資訊
    getStorage() {
      this.second = this.coolDownTime
      this.isBtnCoolDown = this.isCoolDown
    },
    buttonClick() {
      if (this.pass) {
        this.isBtnCoolDown = true
        this.setBtnTimer(this.coolDownSecond)
      }
      this.callBack()
    }
  }
}
</script>
