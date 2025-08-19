<template>
  <div :class="[currentTheme]" class="base-register">
    <van-cell-group class="input__wrap">
      <!-- <van-field
        v-model.trim="data.username"
        :placeholder="$t('register.input_1')"
        :required="settings.registerRequire.username"
      /> -->
      <van-field
        v-if="registerMode === 'email'"
        v-model.trim="data.email"
        :error-message="errorMsg.email"
        :required="settings.registerRequire.email"
        :placeholder="$t('register.input_email')"
      />
      <!-- van-field 手機輸入 Start-->
      <!-- 由於vant本身沒辦法支援「下拉選單+輸入框」，所以import用原生html刻的元件 -->
      <counrty-code-input
        v-else
        :data="data"
        :placeholder="$t('register.input_phone')"
        :errorMsg="errorMsg.phone"
        className="countryCode"/>
      <!-- van-field 手機輸入 End-->
      <van-field
        v-model.trim="data.validationCode"
        :error-message="errorMsg.validationCode"
        :required="settings.registerRequire.validationCode"
        :placeholder="textMap.placeholder[registerMode]"
      >
        <template #button>
          <cool-down-btn
            :callBack="__sendValidationCode"
            :btnCoolDownTextAfter="` ${$t('register.button_coolDown')}`"
            :disabled="sendValidationCodeBtnDisabled"
            :pass="pass">
          </cool-down-btn>
        </template>
      </van-field>
      <van-field
        v-model.trim="data.password"
        :error-message="errorMsg.password"
        :type="pwdType"
        :placeholder="$t('register.input_password')"
        :required="settings.registerRequire.password"
        :right-icon="eyes ? 'closed-eye' : 'eye-o'"
        @click-right-icon="togglePwdType();eyes = !eyes"
      />
      <van-field
        v-model.trim="data.password2"
        :error-message="errorMsg.password2"
        :type="pwdType"
        :placeholder="$t('register.input_confirmPassword')"
        :required="settings.registerRequire.password_confirm"
      />
      <van-field
        v-if="!data.invitation_r"
        v-model.trim="data.invitationCode"
        :error-message="errorMsg.invitationCode"
        :placeholder="$t('register.input_invitationCode')"
        class="overflow"
      />
      <van-field
        v-if="data.invitation_r"
        v-model.trim="data.invitationCode"
        :error-message="errorMsg.invitationCode"
        :placeholder="$t('register.input_invitationCode')"
        class="overflow"
        required
      />
    </van-cell-group>
    <div class="text-btn">
      <p class="text_btn_1" @click="changeMode()">
        {{ textMap.button[registerMode] }}
      </p>
    </div>

    <div
      :style="{ background: appTheme.btnColor, color: appTheme.textColor, backgroundImage: appTheme.btnlinear }"
      :class="{noClick}"
      class="line-btn login-register-btn"
      @click.stop="clickSignup"
    >
      {{ $t('register.button_1') }}
    </div>

    <!-- loading -->
    <div style="
      position: absolute;
      z-index:2;
      top: 50%;left: 50%;transform: translate3d(-50%,-50%,0);"
    >
      <van-loading v-show="isLoading" size="40px" vertical/>
    </div>
  </div>
</template>

<script>
  import { CellGroup, Field, Loading } from 'vant'
  import { validEmail, validPhone } from '@/utils/validate'
  import { signup, sendValidationCode } from '@/api'
  import FormValidatorMixin from '@/mixins/form-validator'
  import ThemeConfigMixin from '@/mixins/theme-config'
  import { settings } from '@/config'
  import coolDownBtn from '@/components/button/CoolDownBtn'
  import counrtyCodeInput from '@/components/input/CounrtyCodeInput'
  import Storage from '@/utils/storage'

  export default {
    name: 'BaseRegister',
    components: {
      [Field.name]: Field,
      [Loading.name]: Loading,
      [CellGroup.name]: CellGroup,
      coolDownBtn,
      counrtyCodeInput,
    },
    mixins: [FormValidatorMixin, ThemeConfigMixin],
    data() {
      return {
        settings,
        pwdType: 'password',
        registerMode: 'email',
        textMap: {
          placeholder: {
            email: this.$t('register.placeholder_validationCode'),
            phone: this.$t('register.placeholder_validationCode')
          },
          button: {
            email: this.$t('register.button_phone'),
            phone: this.$t('register.button_email')
          }
        },
        // 備用，如果要新增/減少國際碼，直接傳入counrtyCodeInput元件就好
        countryCodeOption: [
          { text: '+886', country: this.$t('country.taiwan'), value: "886" },
          { text: '+852', country: this.$t('country.hongKong'), value: "852" },
          { text: '+86', country: this.$t('country.china'), value: "86" },
        ],
        isLoading: false,
        eyes: false,
        data: {
          username: '',
          password: '',
          password2: '',
          countryCode: '886',
          phone: '',
          email: '',
          validationCode: '',
          validationCode_confirm: '',
          invitationCode: this.$route.query.referral,
          invitation_r: settings.invitation,
        },
        errorMsg: {
          password: '',
          password2: '',
          phone: '',
          email: '',
          validationCode: '',
          invitationCode: '',
        },
        rules: {
          phone: [
            {
              validator: (rule, value, callback) => {
                if (this.registerMode !== 'phone') {
                  callback()
                // 2021.08.05 因為有不同國家的手機號，所以先把長度驗證拔掉
                // } else if (/^[1][0-9]{10}$/.test(value)) {
                //   callback()
                } else if (validPhone(value)) {
                  callback()
                } else {
                  callback(this.$t('register.rule_7'))
                }
              },
            },
          ],
          email: [
            {
              validator: (rule, value, callback) => {
                if (this.registerMode !== 'email') {
                  callback()
                } else if (validEmail(value)) {
                  callback()
                } else {
                  callback(this.$t('register.rule_8'))
                }
              },
            },
          ],
          validationCode: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(this.$t('register.rule_validationCode'))
                }
              },
            },
          ],
          password: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(this.$t('register.rule_2'))
                } else if (value.length < 6 || value.length > 14) {
                  callback(this.$t('register.rule_3'))
                } else {
                  callback()
                }
              },
            },
          ],
          password2: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(this.$t('register.rule_4'))
                } else if (value !== this.data.password) {
                  callback(this.$t('register.rule_5'))
                } else {
                  callback()
                }
              },
            },
          ],
          invitationCode: [
            {
              // 长度是40
              validator: (rule, value, callback) => {
                if (!value && this.data.invitation_r) {
                  callback(this.$t('register.rule_9')) // 不是必须的
                } else if (value && value.length !== 40) {
                  callback(this.$t('register.rule_10'))
                } else {
                  callback()
                }
              },
            },
          ],
        },
      }
    },
    computed: {
      noClick() {
        if (this.registerMode === 'email') {
          return !this.data.email || !this.data.password || !this.data.password2 || !this.data.validationCode
        } else {
          return !this.data.phone || !this.data.password || !this.data.password2 || !this.data.validationCode
        }
      },
      sendValidationCodeBtnDisabled() {
        if (this.registerMode === 'email') {
          return !this.data.email
        } else {
          return !this.data.phone
        }
      },
      pass() {
        if (this.registerMode === 'email') {
            return validEmail(this.data.email)
        } else {
            return validPhone(this.data.phone)
        }
      }
    },
    beforeDestroy() {
      this.$bus.$off('autoLogin')
    },
    methods: {
      clickSignup() {
        // console.log(this.data.countryCode)
        if (this.$__validate()) {
          this.__doSignup()
        }
        // 2021.09.06 先把$toast顯示拔掉，讓錯誤直接顯示在欄位底下
        // } else {
        //   let msg = ''
        //   Object.keys(this.errorMsg).forEach(error => {
        //     if (this.errorMsg[error] && !msg) {
        //       msg = this.errorMsg[error]
        //     }
        //   })
        //   this.$toast(msg)
        // }
      },
      togglePwdType() {
        this.pwdType === '' ? this.pwdType = 'password' : this.pwdType = ''
      },
      changeMode() {
        const modeChange = this.registerMode === 'email' ? 'phone' : 'email'
        this.registerMode = modeChange
        Storage.setSession('registerMode', modeChange)
      },
      async __sendValidationCode() {
        const param = {
          username: this.registerMode === 'email' ? this.data.email : this.data.phone,
          idd_code: this.data.countryCode,
          sms_type: 1 // 1對應註冊，2對應找回密碼
        }
        if (this.pass) {
          await sendValidationCode(param)
          .then(res => {
            // this.$myConsole.log('sendValidationCode res', res)
            if (res.code === 0) {
              this.$toast(this.$t('tip.sendsuccess'))
            } else if (this.$t(`errorCode.${res.code}`)) {
              this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('tip.sendfail'))
            }
          })
          .catch(err => {
            console.log('sendValidationCode err', err)
            this.$toast(this.$t('tip.sendfail'))
          })
        } else {
          this.$toast(this.$t('register.phoneOrEmailError'))
        }
      },
      // 执行注册
      __doSignup() {
        if (this.isLoading) return
        this.isLoading = true

        const param = {
          username: this.registerMode === 'email' ? this.data.email : this.data.phone,
          password: this.data.password,
          idd_code: this.data.countryCode,
          sms_code: this.data.validationCode,
          invite_code: this.data.invitationCode,
        }
        // if (this.data.invitationCode && this.data.invitationCode !== '') {
        //   param.code = this.data.invitationCode
        // }

        signup(param)
          .then(res => {
            this.isLoading = false
            const vm = this
            if (res.code === 0) {
              this.$toast({
                duration: 3000,
                message: this.$t('register.toast_1'),
                onClose() {
                  vm.$router.push({
                    name: 'LoginRegister',
                    query: {
                      username: param.username,
                      from: vm.$route.query.from,
                      urlname: vm.currentTheme, // 数据来自 ThemeConfigMixin
                    },
                  })
                  window.location.reload()

                  // LoginRegister 页面直接打开便为 register tab 时，则无触发 login tab 中第 97 行的监听事件，便无法注册后自动登录。
                  // if(vm.$route.params.type || vm.$route.query.type){
                  //   vm.$router.push({
                  //     name: 'LoginRegister',
                  //     query: {
                  //       username: param.username,
                  //       from: vm.$route.query.from,
                  //       urlname: vm.currentTheme  // 数据来自 ThemeConfigMixin
                  //     }
                  //   })
                  //   window.location.reload()
                  // } else {
                  //   vm.autoLogin(param.username, param.password)
                  // }
                },
              })
            } else if (this.$t(`errorCode.${res.code}`)) {
              this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('register.registerFail'))
            }
          })
          .catch(err => {
            this.isLoading = false
            console.log('signup-err', err)
            this.$toast(this.$t('base.unknownErr'))
          })
      },
      autoLogin(username, password) {
        this.isLoading = true
        this.$bus.emit('autoLogin', { username, password })
      },
    },
  }
</script>

<style lang="scss" >
.base-register {
  $radius: 6px;
  .input__wrap {
    .van-field__body {
      height: 3vw;
    }

    .van-button {
      height: auto;
    }
    .van-button--default, .van-button--primary {
      // margin-bottom: 1.5vw;
      background-color: rgb(254, 197, 21);
      border: none;
      width: 118px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #2A2C38;
      line-height: 33px;
      border-radius: 30px;
    }

    .van-button--disabled {
      cursor: not-allowed;
      background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
    }
    .countryCode {
      background-color: white;
      border: none;
      option {
        background-color: white;
      }
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
      padding: 0 4vw 4vw 4vw;
      color: rgb(254, 197, 21);
    }
  }
  .login-register-btn {
    background: #FFCA00;
    border-radius: $radius;
    color: #000;
    font-size: 16px;
    height: 100%;
    line-height: 44px;
    margin-bottom: 40px;

    &.noClick {
      cursor: not-allowed;
      background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
    }

    &:active {
      background: #888;
    }
  }
}
</style>

<style lang="scss" scoped>
  @media (min-width: 100px) {
    $radius: 6px;
    ::v-deep .van-cell-group {
      background-color: transparent;
    }
    ::v-deep .van-cell {
      background-color: #ffffffcc;
      //border-radius: $radius;
      margin-bottom: 10px;
      padding: 8px 0;
      padding-left: 24px;
    }
    ::v-deep .van-field__control {
      //font-size: 18px;
      &::-webkit-input-placeholder {
        color: #E2E2E2;
      }

      &:-moz-input-placeholder {
        color: #E2E2E2;
      }

      &::-moz-input-placeholder {
        color: #E2E2E2;
      }

      &::-ms-input-placeholder {
        color: #E2E2E2;
      }

      &::-o-input-placeholder {
        color: #E2E2E2;
      }
    }
    ::v-deep .van-cell:not(:last-child)::after {
      display: none;
    }
    ::v-deep .van-cell--required::before {
      color: #AB0000;
      font-size: 20px;
      top: 16px;
      left: 10px;
    }
    ::v-deep .van-icon {
      font-size: 22px;
    }

    ::v-deep .van-cell-group {
      margin-bottom: 20px;
    }
    ::v-deep .van-field {
      margin-bottom: 10px;
      line-height: 20px;
      width: 100%;
      height: auto;
      //border-radius: .5rem;
      padding-top: 12px;
      padding-bottom: 10px;
      box-sizing: border-box;
      //font-size: 14px;
      outline: 0;
      border-bottom: 0.5px solid #CCCCCC;
    }
    ::v-deep .van-hairline--top-bottom::after,
    ::v-deep .van-hairline-unset--top-bottom::after {
      border: none;
    }
  }
</style>
