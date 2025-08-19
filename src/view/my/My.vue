<template>
  <div class="my">
    <!--    <div class="page-top-safe-area__has-page-title">-->
    <!--      <div class="page-title">{{ $t('my.title') }}</div>-->
    <!--      <div v-if="livechat" class="page-title-cs">-->
    <!--        <svg-icon-->
    <!--        icon-class="livechat" class-name="livechat"-->
    <!--        @click.stop="-->
    <!--          handleRouter('livechat')-->
    <!--        ">-->
    <!--        </svg-icon>-->
    <!--      </div>-->
    <!--    </div>-->
    <page-head>
      <template v-slot:left><span></span></template>
      <template v-slot:title>{{ $t('my.title') }}</template>
      <template v-slot:right><span></span></template>
    </page-head>
    <div class="main-content">
      <div v-if="isLogined" class="login__wrapper flex">
        <div class="left avatar">
          <img :src="avatar"/>
        </div>
        <van-cell class="right flex row-v-c" is-link @click="$router.push('/editInfo')">
          <div class="flex row-v-c row-between">
            <div>
              <div class="name_tip">{{ (VG__userInfo && VG__userInfo.nickname) || '-' }}</div>
              <!-- <div v-if="isShow.ID_SHOW" class="id-tip">{{ 'ID: ' + (VG__userInfo && VG__userInfo.id) || '-' }}</div> -->
              <div
                :class="VG__userInfo.certification_level && VG__userInfo.certification_level !== 0 ? 'auth' : 'no_auth'"
                class="auth_tip">
                {{ auth }}
              </div>
            </div>
            <van-icon name="qr"/>
          </div>
        </van-cell>
      </div>
      <div v-else class="not-login__wrapper flex" @click="goLogin()">
        <div class="left avatar">
          <img src="./avatar.png"/>
        </div>
        <div class="right">
          <div class="login-tip">{{ $t('my.text_1') }}</div>
          <div class="go-login">{{ $t('my.text_2') }}</div>
        </div>
      </div>
    </div>

    <van-cell-group class="mt10">
      <van-cell v-if="isShow.IS_OTC_PAYMENT" :title="$t('my.label_11')" is-link url="#/otcPayment"/>
      <van-cell v-if="isShow.IS_MODIFY_PWD" :title="$t('my.label_9')" is-link url="#/my/setPassword"/>
      <van-cell v-if="isShow.IS_MODIFY_PWD" :title="$t('setPassword.setSecurityPassword')" is-link url="#/my/securityPassword"/>
      <van-cell v-if="isShow.IS_OTC_HISTORY" :title="$t('my.label_10')" is-link url="#/otcHistory"/>
      <!-- 2021.10.22 IS_CURRENCY_UNIT 線上config檔吃不到，先把v-if拿掉 -->
      <van-cell :title="$t('my.label_currencyUnit')" is-link url="#/currencyUnit"/>
    </van-cell-group>

    <van-cell-group class="mt10">
      <van-cell v-if="isShow.IS_LANG" :title="$t('my.label_6')" is-link url="#/langChange">
        <!--        @click="langDialog.show = true"-->
        <span>{{ $t('name') }}</span>
      </van-cell>
      <van-cell v-if="isShow.IS_WALLET" :title="$t('my.label_1')" is-link url="#/assets"/>
      <van-cell v-if="isShow.IS_NOTICE" :title="$t('my.label_4')" is-link url="#/Announcement">
        <div class="flex row-v-c row-reverse h24">
          <span :class="{ 'badge':haveBadge }"></span>
        </div>
      </van-cell>
      <van-cell v-if="isShow.IS_HELP" :title="$t('my.label_5')" is-link url="#"/>
      <van-cell v-if="isShow.IS_DOWNLOAD" v-show="!isInApp" :title="$t('my.label_8')" class="apk">
        <a :href="settings.APK_URL" class="btn-apk">{{ $t('my.download_1') }}</a>
      </van-cell>
    </van-cell-group>

    <div v-if="isLogined" class="line-btn line-btn__unactive logout-btn mt10">
      <div class="logout" @click.stop="logout">{{ $t('my.logout') }}</div>
    </div>

    <van-dialog :title="$t('my.lang')" v-model="langDialog.show" :confirm-button-text="$t('my.dialog_3')"
                @confirm="setLocale">
      <div style="padding: 20px">
        <van-radio-group v-model="langDialog.radio">
          <van-radio v-if="settings.lang.ch" :name="langDialog.keys[0]" class="lang-radio">简体</van-radio>
          <van-radio v-if="settings.lang.tw" :name="langDialog.keys[1]" class="lang-radio">繁體</van-radio>
          <van-radio v-if="settings.lang.en" :name="langDialog.keys[2]" class="lang-radio">English</van-radio>
          <van-radio v-if="settings.lang.my" :name="langDialog.keys[3]" class="lang-radio">Malay</van-radio>
        </van-radio-group>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import { Cell, CellGroup, Dialog, Icon, Loading, Radio, RadioGroup, Toast } from 'vant'
  import pageHead from '@/components/head'
  import { mapActions, mapGetters } from 'vuex'
  import { Decimal } from 'decimal.js'
  import Storage from '@/utils/storage'
  import { settings } from '@/config'
  import { isInApp } from '../../utils'
  import { loginOut } from '@/utils/logout'
  import notices from '@/mixins/notices'

  export default {
    name: 'My',
    components: {
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [Loading.name]: Loading,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Icon.name]: Icon,
      pageHead,
    },
    mixins: [notices],
    data() {
      return {
        settings,
        Decimal,
        isInApp: false,
        usdtToCnyRatio: '7.00',
        livechat: settings.customerService,
        isShow: settings.MY_PAGE,
        langDialog: {
          show: false,
          radio: this.$i18n.locale,
          keys: Object.keys(this.$i18n.messages),
        },
        // certification_level 0-未认证 1-初级 2-高级
        certificationMap: [this.$t('my.kyc.text_3'), this.$t('my.kyc.text_2'), this.$t('my.kyc.text_10')]
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      isLogined() {
        return !!this.VG__userInfo
      },
      avatar() {
        return this.VG__userInfo.avatar || require('./avatar.png')
      },
      auth() {
        const certificate = this.VG__userInfo.certification_level
        if (certificate) {
          return this.certificationMap[certificate]
        } else {
          return this.$t('my.kyc.text_3')
        }
      },
    },
    created() {
      this.isInApp = isInApp()
      // 移到 App.vue 统一处理
      // if (this.isLogined) {
      //   this.__getUserInfoById()
      // }
    },
    mounted() {
      this.VA__updateUserInfo()
    },
    methods: {
      ...mapActions('user', ['VA__logout', 'VA__updateUserInfo']),
      handleRouter(router) {
        if (this.$route.path.includes(router)) {
          return
        } else {
          this.$router.push(`/${router}`)
        }
      },
      setLocale() {
        this.$i18n.locale = this.langDialog.radio
        Storage.setLocal('locale', this.$i18n.locale)
      },
      // ...mapActions('user', ['VA__setUserInfo', 'VA__setUserWallet']),
      // __getUserInfoById() {
      //   console.log('this.VG__userInfo.id:', this.VG__userInfo.id)
      //   getUserInfoById(this.VG__userInfo.id)
      //     .then(res => {
      //       console.log('getUserInfoById-res:', res)
      //       if (!res) {
      //         return
      //       }
      //       Storage.setLocal('userInfo', res)
      //       this.VA__setUserInfo(res)
      //     })
      //     .catch(err => {
      //       console.log('getUserInfoById-errr:', err)
      //     })
      // },
      jumpRoute(routeName) {
        if (this.isLogined) {
          this.$router.push({
            name: routeName,
          })
        } else {
          this.$toast(this.$t('my.toast_1'))
        }
      },
      goLogin() {
        var theme = settings.MAIN_THEME
        this.$router.push({
          name: 'LoginRegister',
          params: {
            theme: theme,
          },
        })
        // this.$router.push(`/login_${theme}?redirect=my`)
      },
      logout() {
        Dialog.confirm({
          title: this.$t('my.dialog_1'),
          message: this.$t('my.dialog_1'),
          confirmButtonText: this.$t('my.dialog_3'),
          // confirmButtonColor: '#20ddc1',
          cancelButtonText: this.$t('tip.cancel'),
        })
          .then(() => {
            Toast.loading({
              forbidClick: true,
              duration: 0,
            })
            loginOut(1)
          })
          .catch(() => {
            // on cancel
          })
      },
      disableTip() {
        this.toast = this.$toast(this.$t('my.toast_2'))
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .svg-icon {
    margin-bottom: 0px;
    color: $iconColor;
    width: 22px;
    height: 24px;
    font-size: 24px;
  }

  .assets-card {
    background: linear-gradient(153deg,
      rgba(255, 240, 124, 1) 0%,
      rgba(255, 193, 0, 1) 100%);
    border-radius: 8px;
    padding: 12px 15px;
    color: #222222;
    margin-bottom: 12px;
    position: relative;

    .action-btn {
      padding: 3px 12px;
      border-radius: 12px;
      border: 1px solid rgba(34, 34, 34, 1);

      position: absolute;
      top: 9px;
      right: 10px;
      font-size: 12px;
      font-weight: bold;

      a {
        color: rgba(34, 34, 34, 1);
      }
    }

    .title {
      font-size: 12px;
      font-weight: bold;
      line-height: 30px;
    }

    .amount {
      font-size: 20px;
    }

    .cny-amount {
      font-size: 12px;
    }

    .flex {
      .item {
        flex: 1;

        &.flex4 {
          flex: 4;
        }

        &.flex5 {
          flex: 5;
        }
      }
    }

    .item + .item {
      border-left: 1px solid #222222;
    }
  }

  .bt {
    position: relative;

    &::before {
      position: absolute;
      left: 0;
      right: 0;
      content: '';
      transform: scaleY(0.5);
      top: 0;
      border-top: 1px solid #222222;
    }
  }

  .bb {
    position: relative;

    &::after {
      position: absolute;
      left: 0;
      right: 0;
      content: '';
      transform: scaleY(0.5);
      bottom: 0;
      border-bottom: 1px solid #222222;
    }
  }

  ::v-deep .van-cell-group {
    background: $listGroupBgColor;
  }

  ::v-deep .van-cell-group .van-cell {
    color: $Color;
    background-color: $listBgColor;
    //font-weight: bold;
    margin-bottom: 1px;

    &:active {
      background-color: $listActiveBgColor;
    }
  }

  ::v-deep .van-cell--clickable:active {
    background-color: inherit;
  }

  ::v-deep .van-cell:not(:last-child)::after {
    left: 0;
    border-bottom: none;
  }

  ::v-deep [class*='van-hairline']::after {
    border: none;
  }

  .fg-divider {
    height: 15px;
    background-color: #111;
  }

  // loading
  .loading-data {
    margin-top: 0%;
    height: auto;
    text-align: center;
    color: #444;
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
  }

  .apk {
    line-height: 40px;
  }

  .btn-apk {
    width: 140px;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 198, 41, 1);
    border-radius: 6px;

    font-weight: 500;
    color: rgba(0, 0, 0, 1);

    display: flex;
    align-items: center;
    justify-content: center;

    float: right;

    &::before {
      margin-right: 8px;
      content: '';
      height: 20px;
      width: 18px;
      background-repeat: no-repeat;
      background-size: 100%;
      background-image: url(~@/assets/icons/android.png);
    }
  }

  .general__wrapper {
    margin-top: $loginMarginTop;
    height: 95px;
    box-sizing: border-box;
    background: $listBgColor;
    padding: 25px 20px;

    .left {
      margin-right: 14px;
      height: 45px;
      width: 55px;
      border-radius: 5px;
      overflow: hidden;
      //background-color: $headBgColor;
      //background-repeat: no-repeat;
      //background-size: cover;
      //background-image: url(~./avatar.png);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .login__wrapper {
    align-items: center;
    @extend .general__wrapper;

    .right {
      margin-top: 4px;
      padding: 0px;
      font-size: 20px;
      background-color: $listBgColor;

      .name_tip {
        font-size: 19px;
        font-weight: bold;
        color: $Color;
      }

      .id-tip {
        font-size: 12px;
        font-weight: bold;
        color: $userIdColor;
      }

      .auth_tip {
        font-size: 12px;
        font-weight: bold;
      }

      .auth {
        color: $gathering;
      }

      .no_auth {
        color: $errorColor;
      }
    }
  }

  .not-login__wrapper {
    @extend .general__wrapper;

    .right {
      margin-top: 4px;

      .login-tip {
        font-size: 19px;
        font-weight: bold;
        color: $Color;
      }

      .go-login {
        font-size: 12px;
        font-weight: bold;
        color: $my-goLogin;
      }
    }
  }

  .balance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 57px;

    position: relative;

    &::after {
      content: '';
      background-color: #684e00;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      transform: scaleY(0.5);
    }

    .left {
      display: flex;
      align-items: center;

      .balance-name {
        margin-top: 4px; // 垂直居中
        font-size: 14px;
        color: rgba(0, 0, 0, 1);
      }
    }

    .right {
      text-align: right;

      display: flex;

      .cny-amount {
        margin-left: 4px;
        line-height: 2.4; // different
      }
    }
  }

  .do-btns-wrap {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }

  .do-btns {
    display: flex;
    align-items: center;

    .do-btn {
      border-radius: 12px;
      border: 1px solid rgba(34, 34, 34, 0.5);

      width: 52px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      box-sizing: border-box;

      a {
        color: rgba(10, 10, 10, 1);
      }

      & + .do-btn {
        margin-left: 12px;
      }
    }
  }

  .logout-btn {
    background: $buttonBgColor;
    font-size: 16px;
    font-weight: 600;
    color: $Color;
  }

  .lang-radio {
    margin-bottom: 10px;
  }

  .badge {
    display: table-cell;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: red;
  }
</style>
