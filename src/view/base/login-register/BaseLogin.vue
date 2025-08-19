<template>
  <div :class="[currentTheme]" class="base-login">
    <van-cell-group class="input__wrap">
      <!-- <van-field
        v-model.trim="data.username"
        :placeholder="$t('login.input_1')"
      /> -->
      <van-field
        v-if="mode === 'email'"
        v-model.trim="data.email"
        :error-message="errorMsg.email"
        :placeholder="$t('login.input_email')"
      />
      <!-- van-field 手機輸入 Start-->
      <!-- 由於vant本身沒辦法支援「下拉選單+輸入框」，所以import用原生html刻的元件 -->
      <counrty-code-input v-else :data="data" :required="false" :placeholder="$t('login.input_phone')" className="countryCode"/>
      <!-- van-field 手機輸入 End-->
      <van-field
        v-model.trim="data.password"
        :error-message="errorMsg.password"
        :placeholder="$t('login.input_2')"
        :right-icon="vicon"
        :type="eyes ? 'text' : 'password'"
        @click-right-icon="eyes = !eyes"
        @keyup.enter="clickLogin"
      />
      <!-- 郵箱登入/手機登入、忘記密碼 Start -->
      <van-row>
        <van-col span="12">
          <van-cell value-class="change-mode-btn">
            <template #default>
              <span @click="changeMode">{{ mode === 'email' ? $t('login.phone') : $t('login.email') }}</span>
            </template>
          </van-cell>
        </van-col>
        <van-col span="12">
          <van-cell value-class="forget-password-btn">
            <template #default>
              <span @click="$router.push('/resetPassword')">{{ $t('login.forgetPassword') }}</span>
            </template>
          </van-cell>
        </van-col>
      </van-row>
      <!-- 郵箱登入/手機登入、忘記密碼 End -->
    </van-cell-group>
    <div
      :style="{ background: appTheme.btnColor, color: appTheme.textColor, backgroundImage: appTheme.btnlinear }"
      :class="{noClick}"
      class="line-btn login-register-btn"
      @click.stop="clickLogin"
    >
      {{ $t('login.button_1') }}
    </div>
    <div style="
      position: absolute;
      z-index:2;
      top: 50%;left: 50%;transform: translate3d(-50%,-50%,0);"
    >
      <van-loading v-show="isLoading" size="40px" vertical />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Cell, CellGroup, Field, Loading, Col, Row } from 'vant'
import { validEmail } from '@/utils/validate'
import { settings } from '@/config'
import { getUserWallet, login, thirdPartyLogin, getUserInfo, getUserCertification, getCoinList } from '@/api'
import { getCoinRate } from '@/api/beePal'
import FormValidatorMixin from '@/mixins/form-validator'
import ThemeConfigMixin from '@/mixins/theme-config'
import Storage from '@/utils/storage'
import counrtyCodeInput from '@/components/input/CounrtyCodeInput'
import { removeCaches } from '@/utils/logout'

export default {
  name: "BaseLogin",
  components: {
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Loading.name]: Loading,
    [Col.name]: Col,
    [Row.name]: Row,
    counrtyCodeInput,
  },
  mixins: [FormValidatorMixin, ThemeConfigMixin],
  data() {
    return {
      getConversationCount: 0, // 當前call「獲取對話」的API的次數
      getConversationTimes: 5, // 要call幾次「獲取對話」的API
      settings,
      isLoading: false,
      eyes: false,
      mode: 'email',
      testUsername: ['ether@gmail.com'], // 測試用
      userInfo: {},
      coinList: [],
      data: {
        appList: [],
        appItem: [],
        username: this.$route.query.username,
        email: '',
        phone: '',
        countryCode: '886',
        password: '',
      },
      errorMsg: {
        username: '',
        email: '',
        phone: '',
        password: '',
      },
      rules: {
        // username: [{ required: true, message: this.$t('login.rule_1') }],
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(this.$t('login.rule_2'))
              } else if (value.length < 6 || value.length > 14) {
                callback(this.$t('login.rule_3'))
              } else {
                callback()
              }
            },
          },
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              if (this.mode !== 'phone') {
                callback()
              // 2021.08.05 因為有不同國家的手機號，所以先把長度驗證拔掉
              // } else if (/^[1][0-9]{10}$/.test(value)) {
              //   callback()
              } else if (!value) {
                callback(this.$t('login.rule_phone'))
              } else {
                callback()
              }
            },
          },
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              if (this.mode !== 'email') {
                callback()
              } else if (validEmail(value)) {
                callback()
              } else {
                callback(this.$t('login.rule_email'))
              }
            },
          },
        ],
      },
    }
  },
  computed: {
    vicon() {
      return this.eyes ? 'eye-o' : 'closed-eye'
    },
    noClick() {
      if (this.mode === 'email') {
        return !this.data.email || !this.data.password
      } else {
        return !this.data.phone || !this.data.password
      }
    }
  },
  mounted() {
    this.$bus.on('autoLogin', params => {
      console.log('autoLogin')
      this.__doLogin(params.username, params.password)
    })
  },
  methods: {
    ...mapActions('timweb', ['T__init', 'T__Login', 'T_getConversationList']),
    ...mapActions('user', ['VA__setUserInfo', 'VA__setUserWallet']),
    ...mapActions('BeePal', ['AC_UPDATEWALLET', 'AC_COINRATE']),
    ...mapActions('data', ['setCoinList']),
    clickLogin() {
      if (this.$__validate()) {
        this.__doLogin()
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
    // 切換登入模式
    changeMode() {
      const modeChange = this.mode === 'email' ? 'phone' : 'email'
      this.mode = modeChange
    },
    // 执行登录
    __doLogin(username, password) {
      if (this.isLoading) return
      this.isLoading = true
      const param = {
        username: username || (this.mode === 'email' ? this.data.email : this.data.phone),
        password: password || this.data.password,
        idd_code: this.data.countryCode,
      }

      // 測試用
      if (this.testUsername.includes(param.username)) {
        this.$dialog
          .confirm({
            message: '絕命六龜葡萄！ 2022-02-11 16.29',
            className: 'dialog',
            confirmButtonText: '捏Me啦你懂',
            cancelButtonText: '快樂888',
          })
          .then(() => {
            // 沒事
          })
          .catch(() => {
            // 沒事
          })
      }
      login(param)
        .then(async res => {
          if (typeof res === 'undefined') {
            console.error('res=undefined --> 请求超时，无返回结果！')
            return
          }

          if (res.code === 0) {
            // 因为刷新浏览器就会导致vuex里面的状态丢失，所以需要保存在storage里面
            // 有些数据可以存在localStorage，有些可以存在sessionStorage

            // 2021.08.03 新增token驗證的登入機制
            // this.$myConsole.log('token', res)
            const token = res.data.access_token
            Storage.setLocal('token', token)

            await this.__getCoinList() // 獲取幣種
            await this.__getCoinRate() // 获取币种汇率
            await this.__getUserInfo(token) // 獲取userInfo
            await this.__getUserCertification(this.userInfo.id) // 獲取userCertification，順便set VG__userInfo

            await this.AC_UPDATEWALLET() // 獲取user balance，順便set G_wallet
            await this.__getUserWallet(this.userInfo.id)

            await this.T__init() // 腾讯IM初始化
            await this.T__Login() // 腾讯IM登录
            var getConversation = setInterval(() => {
              this.T_getConversationList() // 騰訊IM獲取對話列表
              this.getConversationCount++
              if (this.getConversationCount === this.getConversationTimes) {
                clearInterval(getConversation)
              }
            }, 500)

            this.$router.push('/') // 直接跳轉首頁

            // 2021.08.02 這邊因為$route.query沒東西，暫時先註解掉
            // const routeQueryRedirect = this.$route.query['redirect']
            // console.log(this.$route.query.urlname);
            // if (this.$route.query.from || this.$route.query.urlname) {
            //   const key = this.$route.query.from || this.$route.query.urlname
            //   this.__getThirdPartyList(key)
            // } else {
            //   if (settings.GETCOIN) await this.__getCoinList()
            //   this.isLoading = false
            //   this.$router.replace(routeQueryRedirect || '/')
            // }
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('base.unknownErr'))
          }
          this.isLoading = false
        })
        .catch(err => {
          console.log('err', err)
          this.isLoading = false
          this.$toast(this.$t('login.toast_1'))
          removeCaches() // 有錯誤的話就清除Storage
        })
    },
    __getUserInfo(token) {
      return getUserInfo(token)
        .then(async res => {
          // this.$myConsole.log('this.coinList', this.coinList)
          if (res.code === 0) {
            const userInfo = res.data
            const coin = this.coinList.find(item => item.id === userInfo.currency)
            const mainCoinSymbol = coin ? coin.code : 'TWD' // 這裡配合「默認法幣」去做更改

            this.userInfo = userInfo
            Storage.setLocal('mainCoinSymbol', mainCoinSymbol) // 設置貨幣單位
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('base.unknownErr'))
          }
          this.isLoading = false
        })
        .catch(err => {
          console.log('getUserInfo-err', err)
          this.isLoading = false
          removeCaches() // 有錯誤的話就清除Storage
        })
    },
    __getUserCertification(user) {
      return getUserCertification(user)
        .then(async res => {
          const certification = res.data
          this.userInfo.certification = certification
          this.$myConsole.info('userInfo', this.userInfo)
          Storage.setLocal('userInfo', this.userInfo)
          this.VA__setUserInfo(this.userInfo)
        })
        .catch(err => {
          this.userInfo.certification = {}
          this.$myConsole.error('getUserCertification-err', err)
          this.$myConsole.info('userInfo', this.userInfo)
          Storage.setLocal('userInfo', this.userInfo)
          this.VA__setUserInfo(this.userInfo)
          // removeCaches() // 有錯誤的話就清除Storage
        })
    },
    async __getUserWallet() {
      await getUserWallet()
      .then(async res => {
        const userWallet = res.data.results
        Storage.setLocal('userWallet', userWallet)
        this.VA__setUserWallet(userWallet)
      })
      .catch(err => {
        console.log('userWallet-err', err)
        // removeCaches() // 有錯誤的話就清除Storage
      })
    },
    async __getCoinList() {
      // 去请求数据
      const params = {
        page_size: 100,
      }
      await getCoinList(params).then(res => {
        const list = res.data.results
        this.coinList = list.map(o => {
          const obj = {}
          obj.id = o.id
          obj.value = o.id
          obj.label = o.name
          obj.name = o.name
          obj.code = o.code
          obj.huobiCode = o.huobi_code
          obj.active = o.active
          obj.isCrypto = o.is_crypto
          obj.decimalPlaces = o.decimal_places
          obj.withdrawFee = o.withdraw_fee
          obj.withdrawFeeInner = o.withdraw_fee_inner
          obj.chain_tx_check = o.chain_tx_check
          obj.is_show = o.is_show
          obj.chain = o.chain
          return obj
        })
        Storage.setLocal('coinList', this.coinList)
        this.setCoinList(this.coinList)
      })
    },
    __getCoinRate() {
      return getCoinRate()
        .then(async res => {
          // this.$myConsole.log('getCoinRate res:', res)
          // 以下從getCoinRate獲得的response拼出G_coinRate匯率對應清單
          const coin = res.data
          const temp = {}
          coin.forEach(item => {
            let code = ''
            let rate = 1
            if (item.from_coin.id === 9) {
              code = item.to_coin.code
              rate = Number(1 / item.rate)
            } else {
              code = item.from_coin.code
              rate = Number(item.rate)
            }
            temp[code] = rate
          })
          // this.$myConsole.log('temp', temp)
          this.AC_COINRATE(temp)
        })
        .catch(error => {
          console.error(error)
          this.__getCoinRate()
        })
    },
    // -- 跳转第三方应用 --
    __getThirdPartyList(urlname) {
      // getThirdPartyList().then(res => {
        // this.data.appList = res.data.results // 2021.08.16 配合新API，資料放res.data裡
        this.data.appList = this.$store.getters['thirdPartyList']
        if (!this.data.appList.some(item => item.app_id === urlname)) {
          this.isLoading = false
          this.$toast.fail(`第三方应用中找不到 ${urlname} 应用`)
          return
        }
        this.data.appList.map((item, index) => {
          if (item.app_id === urlname) {
            this.data.appItem = item
            this.__open(this.data.appItem)
            return
          }
        })
      // })
    },
    __open(thirdParty) {
      thirdPartyLogin({ third_party: thirdParty.id }).then(res => {
        this.isLoading = false
        if (thirdParty.jump_url) {
          top.location.href = thirdParty.jump_url + res.login_token
        } else {
          top.location.href = thirdParty.host + '?token=' + res.login_token
        }
      })
    },
  }
}
</script>

<style lang="scss" >
.base-login{
  .input__wrap{
    .countryCode{
      background-color: white;
      border: none;
      option{
        background-color: white;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media (min-width: 100px){
  $radius: 6px;

  .login-register-btn{
    background: #FFCA00;
    border-radius: $radius;
    color: #000;
    font-size: 16px;
    height: 100%;
    line-height: 44px;
    margin-top: 60px;
    margin-bottom: 60px;
    &.noClick {
      cursor: not-allowed;
      background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
    }
    &:active{ background: #888; }
  }

  .change-mode-btn {
    text-align: left;

    span {
      cursor: pointer;
    }
  }

  .forget-password-btn {
    text-align: right;

    span {
      cursor: pointer;
    }
  }

  ::v-deep .van-cell-group{ background-color: transparent; }
  ::v-deep .van-cell{
    background-color: #ffffffcc;
    //border-radius: $radius;
    margin-bottom: 20px;
    padding-left: 24px;
  }
  ::v-deep .van-field__control{
    &::-webkit-input-placeholder{color:#E2E2E2;}
    &:-moz-input-placeholder{color:#E2E2E2;}
    &::-moz-input-placeholder{color:#E2E2E2;}
    &::-ms-input-placeholder{color:#E2E2E2;}
    &::-o-input-placeholder{color:#E2E2E2;}
  }
  ::v-deep .van-cell:not(:last-child)::after{ display: none; }

  ::v-deep .van-cell-group{
    margin-bottom: 20px;
  }
  ::v-deep .van-field{
    margin-bottom: 30px;
    line-height: 20px;
    width: 100%;
    height: 55px;
    //border-radius: .5rem;
    padding-top: 12px;
    padding-bottom: 10px;
    box-sizing: border-box;
    outline: 0;
    border-bottom: 0.5px solid #CCCCCC;
    .van-icon {
      font-size: 22px;
    }
  }
  ::v-deep .van-hairline--top-bottom::after,
  ::v-deep .van-hairline-unset--top-bottom::after {
    border: none;
  }
}
</style>
