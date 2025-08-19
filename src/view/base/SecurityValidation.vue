<template>
  <div class="security-validation">
    <my-head :title="$t('securityValidation.title')" :goBackBtnShow="true"></my-head>

    <div class="main-content">
      <p class="message_1">{{ `${$t('securityValidation.message_1')}${mode === 'email' ? data.email : data.phone}` }}</p>
      <van-cell-group class="input__wrap">
        <van-field
          v-if="mode === 'email'"
          v-model.trim="data.code"
          :error-message="errorMsg.code"
          :placeholder="$t('securityValidation.placeholder_validationCode')"
        >
          <template #button>
            <cool-down-btn :btnText="$t('securityValidation.button_reSend')" :isBtnForceCoolDown="true" :callBack="__sendValidationCode"></cool-down-btn>
          </template>
        </van-field>
        <van-field
          v-else
          v-model.trim="data.code"
          :error-message="errorMsg.code"
          :placeholder="$t('securityValidation.placeholder_validationCode')"
        >
          <template #button>
            <cool-down-btn :btnText="$t('securityValidation.button_reSend')" :isBtnForceCoolDown="true" :callBack="__sendValidationCode"></cool-down-btn>
          </template>
        </van-field>
      </van-cell-group>
      <!-- <p v-if="isCoolDown"></p> -->
      <!-- 2021.10.29 配合UX，先不要把切換找回模式的按鈕隱藏 -->
      <div class="text-btn">
        <p class="text_btn_1" @click="changeMode()">{{ mode === 'email' ? $t('resetPassword.text_btn_find_phone') : $t('resetPassword.text_btn_find_email') }}</p>
      </div>

      <div class="flex row-h-c">
        <button :disabled="isLoading || noClick" :class="isLoading || noClick ? 'btn_disabled' : ''" class="confirm-btn line-btn" @click="submit">
          {{ $t('securityValidation.button_submit') }}
        </button>
      </div>
    </div>
    <!-- Loading Start -->
    <div style="
      position: absolute;
      z-index:2;
      top: 50%;left: 50%;transform: translate3d(-50%,-50%,0);"
    >
      <van-loading v-show="isLoading" size="40px" vertical />
    </div>
    <!-- Loading End -->
  </div>
</template>

<script>
  import { Cell, CellGroup, Field, Loading } from 'vant'
  import { sendValidationCode, login } from '@/api'
  import FormValidatorMixin from '@/mixins/form-validator'
  import { mapActions, mapGetters } from 'vuex'
  import { settings } from '@/config'
  import myHead from '@/components/head/Normal_head'
  import coolDownBtn from '@/components/button/CoolDownBtn'
  import Storage from '@/utils/storage'

  export default {
    name: 'SecurityValidation',
    components: {
      [Field.name]: Field,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Loading.name]: Loading,
      myHead,
      coolDownBtn
    },
    mixins: [FormValidatorMixin],
    data() {
      return {
        livechat: settings.customerService,
        isValidation: false,
        isLoading: false,
        mode: Storage.getSession('resetPasswordMode') || 'email',
        data: {
          email: Storage.getSession('resetPasswordEmail'),
          phone: Storage.getSession('resetPasswordPhone'),
          countryCode: Storage.getSession('resetPasswordCountryCode'),
          code: ''
        },
        errorMsg: {
          code: ''
        }
      }
    },
    computed: {
      ...mapGetters(['coolDownTime', 'isCoolDown']), // 冷卻時間、冷卻狀態儲存在store裡
      noClick() {
          return !this.data.code
      },
    },
    methods: {
      ...mapActions('app', ['setResetPasswordValidation']),
      ...mapActions('user', ['VA__logout']),
      async __sendValidationCode() {
        this.isLoading = true
        const param = {
          username: this.mode === 'email' ? this.data.email : this.data.phone,
          idd_code: this.data.countryCode,
          sms_type: 2 // 1對應註冊，2對應找回密碼
        }
        await sendValidationCode(param)
          .then(async res => {
            // this.$myConsole.log('sendValidationCode res', res)
            if (res.code === 0) {
              this.$toast(this.$t('tip.sendsuccess'))
            } else if (this.$t(`errorCode.${res.code}`)) {
              this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('tip.sendfail'))
            }
            this.isLoading = false
          })
          .catch(err => {
            console.log('sendValidationCode err', err)
            this.$toast(this.$t('tip.sendfail'))
            this.isLoading = false
          })
      },
      changeMode() {
        const modeChange = this.mode === 'email' ? 'phone' : 'email'
        this.mode = modeChange
        Storage.setSession('resetPasswordMode', modeChange)
        this.$router.push({ path: '/resetPassword' })
      },
      async submit() {
        await this.__login() // 用login來確認身分
        if (this.isValidation) {
          setTimeout(() => {
            this.$router.push({ path: '/resetPassword' })
          }, 1000)
        }
      },
      __login() {
        this.isLoading = true
        const param = {
          username: this.mode === 'email' ? this.data.email : this.data.phone,
          idd_code: this.data.countryCode,
          sms_code: this.data.code
        }
        return login(param)
          .then(async res => {
            if (res.code === 0) {
              this.$toast(this.$t('tip.validSuccess'))
              this.isValidation = true
              this.setResetPasswordValidation(true)
              const token = res.data.access_token
              Storage.setLocal('token', token)
              this.isLoading = false
            } else {
              this.$toast(this.$t('tip.validFail'))
              this.isValidation = false
              this.setResetPasswordValidation(false)
              this.isLoading = false
            }
          })
          .catch(err => {
            console.log('validation err', err)
            this.$toast(this.$t('tip.validFail'))
            this.isValidation = false
            this.setResetPasswordValidation(false)
            this.isLoading = false
          })
      }
    }
  }
</script>

<style lang="scss" >
  .security-validation{
    .main-content{
      .message_1 {
        padding: 4vw 4vw 0.1vw 9vw;
        color: rgb(200, 200, 200);
      }
      .input__wrap{
        .van-button--default, .van-button--primary{
          padding-right: 0;
          font-size: 16px;
          color: rgb(254, 197, 21);
          background-color: white;
          border: none;
        }
      }
      .text-btn {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        .text_btn_1 {
          width: auto;
          cursor: pointer;
          text-align: right;
          padding: 0 9vw 4vw 4vw;
          color: rgb(254, 197, 21);
        }
      }

      .btn_disabled {
        cursor: not-allowed;
        background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .input__wrap {
    margin: 10px 0 20px;
    padding: 0 20px;
  }

  .confirm-btn {
    background-color: $cardBgColor;
    font-size: 16px;
    border: none;
    width: 300px;
    color: $cardColor;
    border-radius: 6px;

    &:active {
      background-color: lighten(#ffc100, 10%);
    }
  }

  ::v-deep .van-cell-group {
    background-color: $pageBgColor;
  }

  ::v-deep .van-cell {
    // line-height: 8vw;
    padding: 15px;
    background-color: $pageBgColor;
    font-weight: bold;
    color: $Color;
    border-bottom: 1px solid $BorderColor;

    &:last-child {
      border: none;
    }
  }

  ::v-deep .van-field__label {
    width: 23vw;
    margin-right: 15px;
  }

  // ::v-deep .van-field__control {
  //   color: #fff;
  // }
  ::v-deep .van-cell:not(:last-child)::after {
    display: none;
  }

  ::v-deep [class*='van-hairline']::after {
    border: none;
  }
</style>
