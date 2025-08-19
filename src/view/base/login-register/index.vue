<template>
  <div :class="[currentTheme]"
   :style="{
    'background-color': appTheme.bgColor,
    'background-image': `url(${appTheme.bgImg})`,
    'color': appTheme.inactive_label
  }"
   class="login-register-wrap">
    <div class="inner-content">
      <div v-if="!inFrame && appTheme.goBack" class="top-bar">
        <div class="back-btn" @click="goBack">
          <van-icon name="arrow-left" size="22" />
          <span>返回首页</span>
        </div>
      </div>

      <div v-if="appTheme.logo" class="theme-logo">
        <div class="logo">
          <img :src="appTheme.logo" alt="">
        </div>
      </div>

      <van-tabs
        v-model="active"
        :line-width="50"
        :color="appTheme.btnColor"
        :title-inactive-color= "appTheme.inactive_label"
        :title-active-color= "appTheme.active_label"
        class="login-register-tabs"
      >
        <van-tab :title="$t('login.button_1')">
          <base-login />
        </van-tab>
        <van-tab :title="$t('register.title_1')">
          <base-register app-theme="igk" />
        </van-tab>
      </van-tabs>
      <footer>
        <div class="com">{{ appTheme.compony ? $t(appTheme.compony) : '' }}</div>
        <div class="flex row-vh-c">
          <div class="tip">{{ appTheme.tip ? $t(appTheme.tip) : '' }}</div>
          <div v-if="appTheme.userAgreement" class="userAgree">{{ $t('beePal.userAgreement') }}</div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { Icon, Tab, Tabs } from 'vant'
import { getThirdPartyList } from '@/api'
import BaseLogin from './BaseLogin'
import BaseRegister from './BaseRegister'
import ThemeConfigMixin from '@/mixins/theme-config'
import Storage from '@/utils/storage'
import { mapActions, mapState } from 'vuex'
import { settings } from '@/config'

export default {
  name: 'LoginRegister',
  components: {
    [Icon.name]: Icon,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    BaseLogin,
    BaseRegister
  },
  mixins: [ThemeConfigMixin],
  data() {
    return {
      // type 用于判断激活哪个 tab
      active: this.$route.query.type === 'register' ? 1 : 0,
      // isFrame: window.self === window.top
      inFrame: true,
    }
  },
  computed: {
    ...mapState('tpay', ['JIM']),
  },
  mounted() {
    this.tpayInit();
    // 2021.08.11 先把登入頁面取得getThirdPartyList()拔掉，因為會回401
    // if (this.$store.getters['thirdPartyList'].length === 0) {
    //   this.getThirdPartyList()
    // }
    this.inFrame = window.self !== window.top
    this.$route.params.theme || this.$route.query.urlname
      ? Storage.setLocal('current_theme', this.$route.params.theme || this.$route.query.urlname)
      : undefined
  },
  beforeDestroy() {
    Storage.removeLocal('current_theme')
  },
  methods: {
    ...mapActions('tpay', ['VA__AllStateInit']),
    tpayInit() {
      if (settings.INIT) {
        this.VA__AllStateInit();
        this.JIM.loginOut();
      }
    },
    async goBack() {
      const urlname = this.$route.query.urlname

      if (urlname && this.$store.getters['thirdPartyList'].length === 0) {
        await this.getThirdPartyList()
      }

      const thirdPartyList = this.$store.getters['thirdPartyList']
      if (!urlname || thirdPartyList.length === 0) {
        this.$router.push('/')
      } else {
        window.location.href = thirdPartyList.find(item => item.app_id === urlname).host
      }
    },
    getThirdPartyList() {
      return getThirdPartyList().then(res => {
        this.$store.dispatch('app/setThirdPartyList', res.data.results) // 2021.08.16 配合新API，資料放res.data裡
      }).catch(() => {
        // this.$toast.fail('获取第三方应用失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 100px){
  .login-register-wrap{
    box-sizing: border-box;
    padding: 20px 20px 20px;
    //color: #fff;
    height: 100vh;
    background-size: 100%;

    .inner-content{
      max-width: 640px;
      margin: 0 auto;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .top-bar{
    height: 40px;
    .back-btn{
      font-size: 16px;
      height: 100%;
      display: inline-flex;
      align-items: center;
      color: #999999;

      .jimu &{ color: #000; }
    }
  }
  .theme-logo{
    height: 120px;
    padding: 20px 0;

    .logo{
      height: 100px;
      width: 100px;
      text-align: center;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  ::v-deep .van-tabs__wrap{ padding: 0 30px 20px; height: 40px;}
  ::v-deep .van-tab__text{ font-size: 24px; } // TODO: 2021.11.29 先把登入註冊的字型調大，等設計改了再說
  ::v-deep .van-tab{ padding: 0; font-size: 18px; line-height: 24px; }
  ::v-deep .van-tabs__nav{background-color: transparent; height: 84%;}
  ::v-deep .van-hairline--top-bottom::after{ border: none; }

  ::v-deep .van-cell__value{
    height: 24px;
  }

  .jimu ::v-deep .van-tab.van-tab--active{ color: #000 !important }
  .jimu ::v-deep .van-tab{ color: #9E9E9E !important }
  .jimu ::v-deep .van-cell{
    background-color: #F6F6F6;

  }

}

.inner-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  // TODO: 2021.11.29 先把登入註冊的字型調大，等設計改了再說
  ::v-deep .van-cell {
    font-size: 16px;
  }

  ::v-deep .countryCode {
    font-size: 16px;
  }

  ::v-deep .text-btn {
    font-size: 16px;
  }

  ::v-deep .login-register-btn {
    font-size: 20px;
  }
}

// TODO: 2021.11.29 先把登入註冊的字型調大，等設計改了再說
footer {
  text-align: center;
    margin-top: auto;
    color: #939393;
    font-size: 16px;
    .com {
      margin-bottom: 5px;
    }
    .tip {
      font-size: 14px;
      color:#A2A2A2;
    }
    .userAgree {
      font-size: 14px;
      color: #6153EB;
      margin-left: 5px;
    }
  }

</style>
