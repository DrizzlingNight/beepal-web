<template>
  <div class="reset-password">
    <my-head :title="$t('resetPassword.title')" :goBackPath="goBackPath"></my-head>

    <div class="main-content">
      <!-- 設置密碼模式 -->
      <van-cell-group v-if="isResetPasswordValidation" class="input__wrap">
        <van-field
          :label="$t('setPassword.new_password')"
          v-model.trim="data.new_password"
          :placeholder="$t('setPassword.placeholder_2')"
        />
        <van-field
          :label="$t('setPassword.confirm_password')"
          v-model.trim="data.confirm_password"
          :placeholder="$t('setPassword.placeholder_3')"
        />
      </van-cell-group>
      <!-- 傳送驗證碼模式 -->
      <van-cell-group v-else class="input__wrap">
        <van-field
          v-if="mode === 'email'"
          :label="$t('resetPassword.email')"
          v-model.trim="data.email"
          :placeholder="$t('resetPassword.placeholder_email')"
        />
        <!-- van-field 手機輸入 Start-->
        <!-- 由於vant本身沒辦法支援「下拉選單+輸入框」，所以用引入用原生html刻的元件 -->
        <counrty-code-input
          v-else
          :data="data"
          :required="false"
          :label="$t('resetPassword.phone')"
          :placeholder="$t('resetPassword.placeholder_phone')"
          ::errorMsg="errorMsg.phone"
          className="countryCode"/>
         <!-- van-field 手機輸入 End-->
      </van-cell-group>
      <div class="text-btn">
        <p v-if="!isResetPasswordValidation" class="text_btn_1" @click="changeMode()">{{ mode === 'email' ? $t('resetPassword.text_btn_find_phone') : $t('resetPassword.text_btn_find_email') }}</p>
      </div>

      <div class="flex row-h-c">
        <button v-if="isResetPasswordValidation" :disabled="isLoading || noClick" :class="isLoading || noClick ? 'btn_disabled' : ''" class="confirm-btn line-btn" @click="onSetPassword">
          {{ $t('setPassword.button_1') }}
        </button>
        <button v-else :disabled="isLoading || isCoolDown || noClick" :class="isLoading || isCoolDown || noClick ? 'btn_disabled' : ''" class="confirm-btn line-btn" @click="nextStep">
          {{ $t('resetPassword.button_nextStep') }}
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
  import { setPassword, sendValidationCode } from '@/api'
  import { CellGroup, Field, Loading } from 'vant'
  import FormValidatorMixin from '@/mixins/form-validator'
  import { validEmail, validPhone } from '@/utils/validate'
  import { mapActions, mapGetters } from 'vuex'
  import { settings } from '@/config'
  import myHead from '@/components/head/Normal_head'
  import counrtyCodeInput from '@/components/input/CounrtyCodeInput'
  import Storage from '@/utils/storage'

  export default {
    name: 'ResetPassword',
    components: {
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Loading.name]: Loading,
      myHead,
      counrtyCodeInput,
    },
    mixins: [FormValidatorMixin],
    data() {
      return {
        livechat: settings.customerService,
        mode: Storage.getSession('resetPasswordMode') || 'email',
        isNextStep: false,
        isLoading: false,
        goBackPath: '/loginRegister',
        data: {
          email: '',
          phone: '',
          countryCode: '886',
          new_password: '',
          confirm_password: ''
        },
        passwordData: {
          old_password: '',
          new_password: '',
          confirm_password: '',
        },
        errorMsg: {
          email: '',
          phone: '',
          new_password: '',
          confirm_password: ''
        },
        rules: {
          email: [
            {
              validator: (rule, value, callback) => {
                if (this.isResetPasswordValidation) {
                  callback()
                }
                if (!value && this.mode !== 'email') {
                  callback() // 不是必须的
                } else if (validEmail(value)) {
                  callback()
                } else {
                  callback(this.$t('register.rule_8'))
                }
              },
            },
          ],
          phone: [
            {
              validator: (rule, value, callback) => {
                if (this.isResetPasswordValidation) {
                  callback()
                }
                if (!value && this.mode !== 'phone') {
                  callback() // 不是必须的
                // 2021.08.06 因為有不同國家的手機號，所以先把長度驗證拔掉
                // } else if (/^[1][0-9]{10}$/.test(value)) {
                //   callback()
                } else if (validPhone(value)) {
                  callback()
                } else {
                  callback(this.$t('login.rule_5'))
                }
              },
            },
          ],
          new_password: [
            {
              validator: (rule, value, callback) => {
                if (!this.isResetPasswordValidation) {
                  callback()
                }
                if (!value) {
                  callback(this.$t('setPassword.rule_1'))
                } else if (value.length < 6 || value.length > 14) {
                  callback(this.$t('setPassword.rule_2'))
                } else {
                  callback()
                }
              },
            },
          ],
          confirm_password: [
            {
              validator: (rule, value, callback) => {
                if (!this.isResetPasswordValidation) {
                  callback()
                }
                if (!value) {
                  callback(this.$t('setPassword.rule_1'))
                } else if (value !== this.data.new_password) {
                  callback(this.$t('setPassword.rule_3'))
                } else {
                  callback()
                }
              },
            },
          ]
        },
      }
    },
    computed: {
      ...mapGetters(['isResetPasswordValidation', 'isCoolDown']),
      noClick() {
        if (this.isResetPasswordValidation) {
          return !this.data.new_password || !this.data.confirm_password
        } else {
          if (this.mode === 'email') {
            return !this.data.email
          } else {
            return !this.data.phone
          }
        }
      },
    },
    watch: {
    },
    created() {
      console.log('isResetPasswordValidation', this.isResetPasswordValidation)
    },
    beforeDestroy() {
      this.setResetPasswordValidation(false)
    },
    methods: {
      ...mapActions('app', ['setResetPasswordValidation']),
      ...mapActions('user', ['VA__logout']),
      onSetPassword() {
        if (this.$__validate()) {
          this.$toast.loading({ forbidClick: true, duration: 0 })

          setPassword({
            new_password: this.data.new_password,
          })
            .then(() => {
              this.data.new_password = ''
              this.data.confirm_password = ''

              const vm = this
              this.$toast({
                message: this.$t('setPassword.toast_1'),
                duration: 3 * 1000,
                onClose() {
                  vm.$router.push({ name: 'login' })
                  vm.VA__logout(false)
                },
              })
            })
            .catch(err => {
              this.$toast(this.$t('setPassword.toast_2'))
              console.error(err)
            })
        }
      },
      changeMode() {
        const modeChange = this.mode === 'email' ? 'phone' : 'email'
        this.mode = modeChange
        Storage.setSession('resetPasswordMode', modeChange)
      },
      async nextStep() {
        if (this.$__validate()) {
            Storage.setSession('resetPasswordEmail', this.data.email)
            Storage.setSession('resetPasswordPhone', this.data.phone)
            Storage.setSession('resetPasswordCountryCode', this.data.countryCode)
            await this.__sendValidationCode()
            if (this.isNextStep) {
              setTimeout(() => {
                this.$router.push({ path: '/securityValidation' })
              }, 1000)
            }
        } else {
          let msg = ''
          Object.keys(this.errorMsg).forEach(error => {
            if (this.errorMsg[error] && !msg) {
              msg = this.errorMsg[error]
            }
          })
          this.$toast(msg)
        }
      },
      __sendValidationCode() {
        this.isLoading = true
        const param = {
          username: this.mode === 'email' ? this.data.email : this.data.phone,
          idd_code: this.data.countryCode,
          sms_type: 2 // 1對應註冊，2對應找回密碼
        }
        return sendValidationCode(param)
          .then(async res => {
            // this.$myConsole.log('sendValidationCode res', res)
            if (res.code === 0) {
              this.$toast(this.$t('tip.sendsuccess'))
              this.isNextStep = true
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
            this.isNextStep = false
            this.isLoading = false
          })
      },
    }
  }
</script>

<style lang="scss">
.reset-password{
  .main-content{
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
    .van-field__label {
      width: 15vw;
      margin-right: 0;
    }
    .countryCode{
      background-color: white;
      border: none;
      option{
        background-color: white;
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
