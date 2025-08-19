<!--
 * @Author: your name
 * @Date: 2019-12-04 11:09:44
 * @LastEditTime: 2019-12-10 14:11:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/App.vue
 -->
<template>
  <div id="app">
    <template v-if="$route.meta.keepAlive">
      <keep-alive>
        <router-view v-if="!isTimeout" />
        <default-page v-else :status="0" />
      </keep-alive>
    </template>
    <template v-else>
      <router-view/>
    </template>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { getUserInfoById } from '@/api'
  import Storage from '@/utils/storage'
  import { lang } from '@/config/mayfly/dgc'
  import { settings } from '@/config'
  import BeePalApp from '@/mixins/BeePalApp'
  import DefaultPage from '@/components/defaultPage'
  // import device from 'current-device' // 偵測當前裝置

  export default {
    name: 'App',
    components: {
      DefaultPage
    },
    mixins: [BeePalApp],
    data() {
      return {
        settings,
        sessionid: null,
        getConversationCount: 0, // 當前call「獲取對話」的API的次數
        getConversationTimes: 5, // 要在mounted時去call幾次「獲取對話」的API
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      ...mapState('tpay', ['init_status', 'JIM', 'Msg']),
      locale() {
        return this.$i18n.locale
      },
      isTimeout() {
        // console.log('isTimeout', Storage.getSession('isTimeout'))
        return Storage.getSession('isTimeout')
      },
    },
    watch: {
      VG__userInfo(val, oldVal) {
        if (val && val.id !== (oldVal && oldVal.id)) {
          this.$store.dispatch('data/getCoinList', null, { root: true })
          this.VA__getUserChannel()
          if (settings.MAIN_THEME === 'tpay') {
            this.tpay_init()
          }
        }
      },
      init_status: {
        handler(newv, oldv) {
          const JIM = this.JIM
          if (newv === true) {
            this.VA__Conversations(JIM)
            this.VA__getMsg(JIM)
          }
        },
        deep: true,
        immediate: true,
      },
      Msg: {
        handler() {
          this.VA__GetHaveBadge()
        },
        deep: true,
        immediate: true,
      },
      locale: {
        handler(newv, oldv) {
          const locale = newv
          const params = {
            page: 1,
            page_size: 10,
            search: lang[locale],
          }
          this.VA__GetNotices(params)
        },
      },
    },
    created() {
      // 2021.11.24 手機跳轉PC判斷改做在proxy.config，這裡就先註解掉
      // // 判斷是否為手機端，進行跳轉 Start
      // if (!device.mobile()) {
      //   // TODO: 2021.11.04 產品正式上線後，跳轉地址要換
      //   // window.location.href = 'http://beepal-pc-dev.eba-csm7axbj.ap-northeast-1.elasticbeanstalk.com/' // 測試網址
      //   window.location.href = 'http://www.baax.uk' // 展示網址
      // }
      //  // 判斷是否為手機端，進行跳轉 End
      this.resetVuexBySessionStorage()
      if (!this.$store.getters['VG__userInfo']) return
      getUserInfoById(this.$store.getters['VG__userInfo'].id).then(res => {
        if (res.code === 0) {
           this.T__init() // 腾讯IM初始化
           this.T__Login() // 腾讯IM登录
        }
      }).catch(err => {
        if (err && (err.status === 403 || err.status === 404)) {
          this.VA__setUserInfo(null)
          Storage.clearLocal()
          if (settings.needLogin) {
            this.VA__logout(false)
          }
          // const vm = this
          // this.$toast({
          //   message: '登录状态过期，请重新登录',
          //   type: 'fail',
          //   duration: 3 * 1000,
          //   onClose() {
          //     vm.$router.push({name: 'my'})
          //     vm.VA__logout(false)
          //   }
          // })
        }
      })
    },
    mounted() {
      if (this.$store.getters['VG__userInfo']) {
        var getConversation = setInterval(() => {
          this.T_getConversationList() // 騰訊IM獲取對話列表
          this.getConversationCount++
          if (this.getConversationCount === this.getConversationTimes) {
            clearInterval(getConversation)
          }
        }, 500)
      }
    },
    methods: {
      ...mapActions('timweb', ['T__init', 'T__Login', 'T_getConversationList']),
      ...mapActions('user', ['VA__setUserInfo', 'VA__setUserWallet', 'VA__getUserChannel', 'VA__logout']),
      ...mapActions('tpay', ['VA__setBalance', 'VA__GetHaveBadge', 'VA__setMonthBill', 'VA__setAdressList', 'VA__JIMINIT', 'VA__Conversations', 'VA__getMsg', 'VA__GetDealList', 'VA__GetNotices']),
      // 当浏览器刷新时，把一些状态重设到vuex里面 tpay錢包
      tpay_init() {
        var JIM = this.JIM
        const params = {
          page: 1,
          page_size: 10,
          search: lang[this.$i18n.locale],
        }
        this.VA__GetNotices(params)
        this.VA__setAdressList()
        this.VA__GetHaveBadge()
        this.VA__JIMINIT({ JIM, nowUser: this.VG__userInfo })
      },
      resetVuexBySessionStorage() {
        const cookie = Storage.getCookie('csrftoken') // 过期后得到 null
        // 未登录或者已经登出，则中断
        if (!cookie) {
          return
        }
        const userInfo = Storage.getLocal('userInfo')
        if (userInfo) {
          this.VA__setUserInfo(userInfo)
        }
        const userWallet = Storage.getLocal('userWallet')
        if (settings.GETWALLET) userWallet && this.VA__setUserWallet(userWallet)
      },
      // 測試用
      aaa() {
        console.log('test')
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  body {
    font-size: 16px;
    background-color: $bodyBgColor;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    // height: 100vh; // 2021.11.23 Safari自適應修改測試
    background-color: $bodyBgColor;
    // overflow: hidden;
  }
</style>
