<!--
 * @Author: your name
 * @Date: 2019-12-06 10:06:28
 * @LastEditTime: 2019-12-10 15:45:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/my/Auth.vue
 -->
<template>
  <div class="auth">
    <my-head :title="$t('my.auth.title')" @goback="goBack"></my-head>
    <div class="main-content flex col">
      <van-form>
        <div class="input__wrap">
          <van-cell is-link @click="countryShow = true">
            <template #title>
              <div class="flex row-v-e">
                <div>{{ $t('my.auth.text_1') }}</div>
                <div class="tip ml5">{{ $t('my.auth.tip_1') }}</div>
              </div>
            </template>
            {{ formData.country !== null ? countryActions[formData.country] : '' }}
          </van-cell>
          <van-cell :title="$t('my.auth.text_2')"
                    is-link @click="certificateShow = true">
            {{ formData.type !== null ? certificateActions[formData.type].name : '' }}
          </van-cell>
        </div>

        <div class="input__wrap pt10 pb10 pl15 pr15 grow">
          <div class="name flex row-v-c">
            <div class="first_name">
              <div class="required title">
                <span>{{ $t('my.auth.text_4') }}</span>
                <span class="grayTips">{{ $t('my.auth.tip_2') }}</span>
              </div>
              <van-field v-model="formData.name"></van-field>
            </div>
            <div class="middle_name">
              <div class="title">
                <span>{{ $t('my.auth.text_5') }}</span>
                <span class="grayTips">{{ $t('my.auth.optional') }}</span>
              </div>
              <van-field v-model="formData.middle_name"></van-field>
            </div>
            <div class="last_name">
              <div class="required title">
                <span>{{ $t('my.auth.text_6') }}</span>
                <span class="grayTips">{{ $t('my.auth.tip_3') }}</span>
              </div>
              <van-field v-model="formData.last_name"></van-field>
            </div>
          </div>
          <div class="tip mt3">{{ $t('my.auth.tip_4') }}</div>
          <div class="phone">
            <!-- van-field 手機輸入 Start-->
            <div class="required title">
              <span>{{ $t('register.input_phone') }}</span>
            </div>
            <!-- 由於vant本身沒辦法支援「下拉選單+輸入框」，所以import用原生html刻的元件 -->
            <counrty-code-input
              :data="formData"
              :placeholder="$t('register.input_phone')"
              :errorMsg="errorMsg.phone"
              :border="false"
              className="countryCode"/>
            <!-- van-field 手機輸入 End-->
            <van-field
              v-model.trim="formData.phoneValidationCode"
              :error-message="errorMsg.phoneValidationCode"
              :placeholder="$t('register.placeholder_validationCode')"
            >
              <template #button>
                <cool-down-btn
                  :callBack="sendPhoneValidationCode"
                  :disabled="sendPhoneValidationCodeBtnDisabled"
                  :pass="passPhone">
                </cool-down-btn>
              </template>
            </van-field>
          </div>
          <div class="cardNum">
            <div class="required title">
              <span>{{ $t('my.auth.text_3') }}</span>
            </div>
            <van-field
              v-model="formData.card_num"
              :placeholder="formData.type!= null ? $t('my.auth.placeholder_' + (formData.type + 1)) : $t('my.auth.placeholder_1')"
              border
              clearable
            >
            </van-field>
          </div>
          <div class="email">
            <div class="required title">
              <span>{{ $t('register.input_email') }}</span>
            </div>
            <van-field
              v-model.trim="formData.email"
              :error-message="errorMsg.email"
              :placeholder="$t('register.input_email')"
              :border="false"
            />
            <van-field
              v-model.trim="formData.emailValidationCode"
              :error-message="errorMsg.emailValidationCode"
              :placeholder="$t('register.placeholder_validationCode')"
            >
              <template #button>
                <cool-down-btn
                  :callBack="sendEmailValidationCode"
                  :disabled="sendEmailValidationCodeBtnDisabled"
                  :pass="passEmail">
                </cool-down-btn>
              </template>
            </van-field>
          </div>
          <div class="birthday mt20">
            <div class="required title">{{ $t('my.auth.text_7') }}</div>
            <van-field v-model="birthday" :placeholder="$t('my.auth.placeholder_3')"
                       clickable disabled right-icon="calendar-o" @click="dateTimeShow = true"></van-field>
          </div>
          <div class="address mt20">
            <div class="required title">{{ $t('my.auth.text_8') }}</div>
            <van-field v-model="formData.address"
                       type="textarea" maxlength="40"></van-field>
          </div>
          <van-button :disabled="noClick" class="submit-btn" native-type="submit" @click="onIdentityAuth">{{ $t('my.auth.submit') }}</van-button>
        </div>
      </van-form>
    </div>
    <van-action-sheet
      v-model="countryShow"
    >
      <div class="head flex row-between">
        <div class="title">{{ $t('my.auth.action_title_1') }}</div>
        <div class="cancel" @click="countryShow = false">{{ $t('beePal.transfer.close') }}</div>
      </div>
      <div class="content">
        <div v-for="(val, key) in countryActions" :key="key" class="action"
             @click="
             formData.country = key;
             countryShow = false ">
          <div>{{ val }}</div>
          <van-icon v-if="formData.country === key" name="success" class="checked"/>
        </div>
      </div>
    </van-action-sheet>
    <van-action-sheet
      v-model="certificateShow"
    >
      <div class="head flex row-between">
        <div class="title">{{ $t('my.auth.action_title_2') }}</div>
        <div class="cancel" @click="certificateShow = false">{{ $t('beePal.transfer.close') }}</div>
      </div>
      <div class="content">
        <div v-for="(item,index) in certificateActions" :key="item.name" class="action"
             @click="
             formData.type = index;
             certificateShow = false ">
          <div>{{ item.name }}</div>
          <van-icon v-if="formData.type === index" name="success" class="checked"/>
        </div>
      </div>
    </van-action-sheet>
    <van-action-sheet v-model="dateTimeShow">
      <van-datetime-picker
        v-model="tempData"
        :min-date="dateTimeOptions.minDate"
        :max-date="dateTimeOptions.maxDate"
        :confirm-button-text="$t('my.dialog_3')"
        :formatter="formatter"
        class="dateTime"
        type="date"
        @confirm="formData.birthday = tempData; dateTimeShow = false"
      >
        <template #cancel><span></span></template>
      </van-datetime-picker>
    </van-action-sheet>
    <van-overlay :show="show">
      <van-loading></van-loading>
    </van-overlay>
  </div>
</template>

<script>
  import { createAuth, sendValidationCode } from '@/api'
  import { mapActions, mapGetters } from 'vuex'
  import { ActionSheet, Button, Cell, DatetimePicker, Field, Form, Icon, Loading, Overlay } from 'vant'
  import { dateFormat } from '@/utils/dateFormat'
  import { validEmail, validPhone } from '@/utils/validate'
  import myHead from '@/components/head/Normal_head'
  import coolDownBtn from '@/components/button/CoolDownBtn'
  import counrtyCodeInput from '@/components/input/CounrtyCodeInput'

  export default {
    name: 'Kyc',
    components: {
      myHead,
      coolDownBtn,
      counrtyCodeInput,
      [ActionSheet.name]: ActionSheet,
      [DatetimePicker.name]: DatetimePicker,
      [Cell.name]: Cell,
      [Field.name]: Field,
      [Icon.name]: Icon,
      [Form.name]: Form,
      [Button.name]: Button,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
    },
    data() {
      return {
        countryShow: false,
        certificateShow: false,
        dateTimeShow: false,
        dateTimeOptions: {
          minDate: new Date('1900-01-01'),
          maxDate: new Date(),
        },
        formData: {
          country: null,
          type: null,
          card_num: null,
          name: null,
          middle_name: null,
          last_name: null,
          birthday: null,
          address: null,
          countryCode: '886',
          phone: null,
          phoneValidationCode: null,
          email: null,
          emailValidationCode: null,
        },
        errorMsg: {
          phone: '',
          email: '',
          phoneValidationCode: '',
          emailValidationCode: '',
        },
        tempData: new Date(),
        countryActions: {
          // CN: this.$t('my.auth.country_1'),
          TW: this.$t('my.auth.country_2'),
          HK: this.$t('my.auth.country_3'),
        },
        certificateActions: [
          { name: this.$t('my.auth.certificate_1') },
          { name: this.$t('my.auth.certificate_2') },
        ],
        show: false,
        method: 'post',
        id: '',
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      birthday: {
        get() {
          return this.formData.birthday ? dateFormat(this.formData.birthday, 'yyyy-MM-dd') : ''
        },
      },
      noClick() {
        const keys = Object.keys(this.formData)
        let result = false
        keys.forEach(key => {
          // console.log('this.formData[key]', this.formData[key])
          if (key !== 'middle_name' && !String(this.formData[key])) {
            result = true
          }
        })
        return result
      },
      sendPhoneValidationCodeBtnDisabled() {
        return !this.formData.phone
      },
      passPhone() {
        return validPhone(this.formData.phone)
      },
      sendEmailValidationCodeBtnDisabled() {
        return !this.formData.email
      },
      passEmail() {
        return validEmail(this.formData.email)
      },
    },
    created() {
      if (this.VG__userInfo && Object.keys(this.VG__userInfo.certification).length !== 0) {
        const certificate = this.VG__userInfo.certification
        this.method = 'patch'
        this.id = certificate.id
        if (!certificate.base_certification && certificate.status === 0) {
          this.show = true
          this.$router.push('/onprogress')
        } else if (!certificate.base_certification && certificate.status === -1) {
          this.formData = {
            country: certificate.country,
            type: certificate.kyc_type - 1,
            card_num: certificate.kyc_number,
            name: certificate.kyc_first_name,
            middle_name: certificate.kyc_mid_name,
            last_name: certificate.kyc_last_name,
            birthday: certificate.birthday,
            address: certificate.address,
          }
        } else if (certificate.base_certification) {
          this.$toast(this.$t('my.auth.authSuccess'))
          this.show = true
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        }
      }
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo']),
      formatter(type, val) {
        if (type === 'year') {
          return val + this.$t('my.auth.year')
        }
        if (type === 'month') {
          return val + this.$t('my.auth.month')
        }
        if (type === 'day') {
          return val + this.$t('my.auth.day')
        }
        return val
      },
      // getBirthdayFromIdCard() {
      //   const idCard = this.formData.card_num
      //   let birthday = ''
      //   if (idCard != null && idCard !== '') {
      //     if (idCard.length === 15) {
      //       birthday = '19' + idCard.substr(6, 6)
      //     } else if (idCard.length === 18) {
      //       birthday = idCard.substr(6, 8)
      //     }
      //     birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
      //   }
      //   this.tempData = new Date(birthday)
      //   if (!isNaN(this.tempData.getTime())) {
      //     this.formData.birthday = birthday
      //   } else {
      //
      //   }
      // },
      // handleRouter(router) {
      //   if (this.$route.path.includes(router)) {
      //     return
      //   } else {
      //     this.$router.push(`/${router}`)
      //   }
      // },
      onIdentityAuth() {
        let flag = true
        Object.keys(this.formData).forEach(item => {
          if (item !== 'middle_name' && !this.formData[item] && this.formData[item] !== 0) {
            flag = false
          }
        })
        if (!flag) return
        const params = {
          country: this.formData.country,
          birthday: dateFormat(this.formData.birthday, 'yyyy-MM-dd'),
          kyc_first_name: this.formData.name,
          kyc_type: this.formData.type + 1,
          kyc_mid_name: this.formData.middle_name,
          kyc_last_name: this.formData.last_name,
          address: this.formData.address,
          kyc_number: this.formData.card_num,
          email: this.formData.email,
          mobile: this.formData.phone,
          sms_code: this.formData.phoneValidationCode,
          email_code: this.formData.emailValidationCode,
        }
        this.show = true
        createAuth(params, this.method, this.VG__userInfo.id).then(res => {
          if (res.code === 0) {
            this.$toast(this.$t('tip.sendsuccess'))
            this.VA__updateUserInfo()
            this.$router.push('/onprogress')
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('my.auth.fail'))
          }
          this.show = false
        }).catch(err => {
          console.log('createAuth-err', err)
          if (err.code === 400) {
            this.$toast(this.$t('my.auth.notice'))
          }
          this.$toast(this.$t('my.auth.fail'))
          this.show = false
        })
      },
      goBack() {
        this.$dialog
          .confirm({
            message: this.$t('my.auth.back'),
            className: 'dialog',
            confirmButtonText: this.$t('my.dialog_3'),
            cancelButtonText: this.$t('beePal.deal.cancel'),
          })
          .then(() => {
            this.$router.push('/my/kyc')
          })
      },
      async sendPhoneValidationCode() {
        const param = {
          username: this.formData.phone,
          idd_code: this.formData.countryCode,
          sms_type: 3, // 1對應註冊，2對應找回密碼, 3對應基礎認證
        }
        this.show = true
        if (this.passPhone) {
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
            this.show = false
          })
          .catch(err => {
            console.log('sendValidationCode err', err)
            this.$toast(this.$t('tip.sendfail'))
            this.show = false
          })
        } else {
          this.$toast(this.$t('register.phoneError'))
          this.show = false
        }
      },
      async sendEmailValidationCode() {
        const param = {
          username: this.formData.email,
          sms_type: 3, // 1對應註冊，2對應找回密碼, 3對應基礎認證
        }
        this.show = true
        if (this.passEmail) {
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
            this.show = false
          })
          .catch(err => {
            console.log('sendValidationCode err', err)
            this.$toast(this.$t('tip.sendfail'))
            this.show = false
          })
        } else {
          this.$toast(this.$t('register.emailError'))
          this.show = false
        }
      },
    },
  }
</script>

<style lang="scss" >
@import '@/styles/variable.scss';

// 2021.11.09 新加的欄位手機驗證、Email驗證
.auth {
  $radius: 6px;

  .input__wrap {
    .phone,
    .email {
      margin-top: 10.5px;
      margin-bottom: 12.5px;

      .van-button {
        height: auto;
      }

      .van-button--default, .van-button--primary {
        // margin-bottom: 1.5vw;
        background-color: #FFC006;
        border: none;
        width: 100px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #FFFFFF;
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
  }
}
</style>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .auth {
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    /*padding-bottom: 60px;*/
  }

  .input__wrap {
    width: 100%;
    background-color: $pageBgColor;
    min-height: 20px;
    margin-top: 10px;
    box-sizing: border-box;
    font-size: 14px;
    color: $labelColor1;
    display: flex;
    flex-direction: column;
  }

  .van-cell {
    color: $labelColor1;

    .van-cell__value {
      max-width: 60px;
      /*overflow: visible;*/
      /*white-space: nowrap;*/
      /*direction: rtl;*/
    }
  }

  .van-field {
    margin-top: 10px;
    padding: 5px 0 5px 0;
    border-bottom: 1px solid $BorderColor3;
    user-focus: none;

    &:focus-within {
      border-color: $labelColor13;
    }

    ::v-deep .van-icon {
      font-size: 20px;
    }

    ::v-deep input {
      font-size: 16px;

      &:focus {
        caret-color: $labelColor13;
      }

      &::placeholder {
        font-size: 16px;
      }
    }

    ::v-deep textarea {
      font-size: 16px;
      line-height: 36px;
    }
  }

  .van-field--min-height {
    border: 1px solid $BorderColor3;
    border-radius: 6px;
    padding: 2px 10px;
    position: relative;

    &:focus-within {
      ::v-deep .van-cell__value::after {
        background-color: $labelColor13;
      }
    }

    ::v-deep .van-field__control {
      &:focus {
        caret-color: $labelColor13;
      }
    }

    ::v-deep .van-cell__value::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      top: 50%;
      left: 0;
      background-color: $BorderColor3;
    }
  }

  .tip {
    font-size: 11px;
    color: rgba($tipsColor, 0.59);
    line-height: 22px;
  }

  .required::before {
    content: '*';
    display: inline-block;
    margin-right: 3px;
    font-size: 16px;
    transform: translateY(2.5px);
    color: $tipsColor;
  }

  .name {
    margin-top: 25px;
    justify-content: space-between;

    .grayTips {
      color: $labelColor20;
      font-size: 13px;
      display: inline-block;
    }

    .title {
      line-height: 21px;
    }

    .first_name, .middle_name, .last_name {
      word-break: break-all;
    }

    .first_name {
      width: 35%;
      margin-right: 8px;
    }

    .middle_name {
      width: 35%;
      margin-right: 8px;
    }

    .last_name {
      width: 26%;
    }
  }

  .address {
    margin-bottom: 30px;
  }

  .submit-btn {
    margin: auto 14px 20px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background: $linearBgColor-02;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);

    &:active {
      background-color: #1174dd;
    }
  }

  .van-button--disabled {
     background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
  }

  .van-action-sheet__content {
    color: $labelColor1;

    .head {
      padding: 20px 20px;
      border-bottom: 1px solid $BorderColor3;
      font-size: 16px;

      .cancel {
        color: $labelColor20;
        font-size: 14px;
      }
    }

    .content {
      padding: 0 20px;

      .action {
        padding: 15px 0;
        border-bottom: 1px solid $BorderColor3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;

        .checked {
          background-color: $labelColor13;
          border-radius: 100%;
          padding: 2px;
        }
      }
    }
  }
</style>
