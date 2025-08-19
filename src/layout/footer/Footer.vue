<template>
  <div class="footer footer__stay-bottom">
    <div style="position: absolute;top: 50%;left: 50%;transform: translate3d(-50%,-50%,0);">
      <van-loading v-show="loading" size="30px" vertical>
        {{ $t('base.loading') }}
      </van-loading>
    </div>
    <!-- 2021.12.09 意義不明的 Casino 判斷式，先註解掉 -->
    <!-- <van-row v-if="Casino" class="h100p" justify="space-around" type="flex">
      <van-col
        v-for="(o, i) in appList"
        :class="{ 'item--active': curIdx === i, 'chat': o.router === 'chat', }"
        :key="i"
        :style="{ width: `${100 / appList.length}%` }"
        class="item"
        @click="open(o)"
        @click.stop="
                      curIdx = i
                      handleRouter(o.router)
                    "
      >
        <svg-icon :class-name="o.svg" :icon-class="o.svg"></svg-icon>
        <div v-if="unreadMessageCount && o.router === 'chat'" class="message-badge">
          {{ unreadMessageCount }}
        </div>
      </van-col>
    </van-row> -->
    <van-row class="h100p" justify="space-around" type="flex">
      <van-col
        v-for="(o, i) in menuList"
        :class="{ 'item--active': curIdx === i, 'chat': o.router === 'chat', }"
        :key="i"
        :style="{ width: `${100 / menuList.length}%` }"
        class="item"
        @click.stop="
                      curIdx = i
                      handleRouter(o.router)
                    "
      >
        <svg-icon :badge="o.badge" :icon-class="curIdx === i?o.active_svg:o.svg"></svg-icon>
        <!--        <svg-icon v-show="curIdx !== i" :icon-class="o.svg" :class-name="o.svg"></svg-icon>-->
        <div class="text">{{ o.name }}</div>
        <div v-if="unreadMessageCount && o.router === 'chat'" class="message-badge">
          {{ unreadMessageCount }}
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  import { getThirdPartyList, thirdPartyLogin } from '@/api'
  import { Col, Loading, Row } from 'vant'
  import { settings } from '@/config'
  import { mapGetters, mapState } from 'vuex'
  import styles from '@/styles/variable.scss'

  export default {
    name: 'Footer',
    components: {
      [Loading.name]: Loading,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    data() {
      return {
        loading: false,
        curIdx: 0,
        appList: [],
        Casino: settings.Casino,
      }
    },
    computed: {
      ...mapGetters(['TG__getConversations']),
      ...mapState('tpay', ['haveBadge']),
      menuList() {
        const array = [
          {
            name: this.$t('base.nav_1'),
            router: 'home',
            svg: 'market',
            active_svg: 'market',
            show: settings.BOTTOM_NAV.MARKET_SHOW,
          },
          {
            name: this.$t('base.nav_6'),
            router: 'buy',
            svg: 'home',
            active_svg: styles.buttonTheme + 'home',
            show: settings.BOTTOM_NAV.BUY_SHOW,
          },
          // {
          //   name: '合约',
          //   router: 'contract',
          //   svg: 'contract',
          // },
          {
            name: this.$t('base.nav_2'),
            router: 'currency',
            svg: 'otc',
            active_svg: 'otc',
            show: settings.otc,
          },
          {
            name: this.$t('base.nav_7'),
            router: 'deal',
            svg: 'property',
            active_svg: styles.buttonTheme + 'property',
            show: settings.BOTTOM_NAV.DEAL_SHOW,
          },
          {
            name: this.$t('base.nav_4'),
            router: 'assets',
            svg: 'contract',
            active_svg: 'contract',
            show: settings.BOTTOM_NAV.PROPERTY_SHOW,
          },
          {
            name: this.$t('base.nav_4'),
            router: 'home',
            svg: 'home',
            active_svg: styles.buttonTheme + 'home',
            show: settings.BOTTOM_NAV.BeePal_HOME_SHOW,
          },
          {
            name: this.$t('base.nav_7'),
            router: 'deal',
            svg: 'property',
            active_svg: styles.buttonTheme + 'property',
            show: settings.BOTTOM_NAV.BeePal_DEAL_SHOW,
          },
          {
            name: this.$t('base.nav_3'),
            router: 'find',
            svg: styles.originIcon + 'find',
            active_svg: styles.buttonTheme + 'find',
            show: settings.BOTTOM_NAV.FIND_SHOW,
          },
          {
            name: this.$t('base.nav_8'),
            router: 'chat',
            svg: 'chat',
            active_svg: styles.buttonTheme + 'chat',
            show: settings.BOTTOM_NAV.CHAT_SHOW,
            badge: this.haveBadge,
          },
          {
            name: this.$t('base.nav_5'),
            router: 'my',
            svg: 'my',
            active_svg: styles.buttonTheme + 'my',
            show: settings.BOTTOM_NAV.MY_SHOW,
          },
        ]

        // if (settings.Appstyle){
        return array.filter(o => o.show)
      },
      unreadMessageCount() {
        let count = 0
        if (this.TG__getConversations[0]) {
          this.TG__getConversations.forEach(item => {
            if (item.unreadCount) count = count + Number(item.unreadCount)
          })
        }
        // console.log('unreadMessageCount', count)
        return count
      },
    },
    watch: {
      // 路由更新之后，看看对应的哪个底部菜单应该激活，手动激活一下
      $route: {
        immediate: true,
        handler(route) {
          for (let i = 0; i < this.menuList.length; i++) {
            if (route.path.includes(this.menuList[i].router)) {
              this.curIdx = i
              break
            } else if (route.path.includes('/depositWithdraw')) {
              // 充币提币属于My.vue模块，是最后一个
              this.curIdx = this.menuList.length - 1
            }
          }
        },
      },

    },
    created() {
      console.log('footer created')
      if (settings.thirdPart) {
        // this.getThirdPartyList() // 2021.09.01 先把Footer這裡拔掉，改成進入發現-Dapp頁面的時候再獲取
      }
    },
    methods: {
      handleRouter(router) {
        if (router === '') {
          return
        }
        if (this.$route.path.includes(router)) {
          this.loading = false
          return
        } else {
          // console.log('router:' + router)
          this.loading = false
          this.$router.push(`/${router}`)
        }
      },
      getThirdPartyList() {
        getThirdPartyList().then(res => {
          if (!res) {
            this.loading = false
            return
          }
          if (res.data.results) res.data.results.forEach(item => { item.nameArray = item.name.split(/\b */) })
          this.$store.dispatch('app/setThirdPartyList', res.data.results)
          // this.appList = res.data.results;
          var count = 0
          for (var val of res.data.results) {
            if (count >= 2) {
              break
            }
            var svg = ''
            if (count === 0) {
              svg = 'cas'
            } else {
              svg = 'qipai'
            }
            // console.log('val.id:' + val.id)
            var data_foot =
              {
                id: val.id,
                name: val.nameArray[1],
                jump_url: val.jump_url,
                router: '',
                svg: svg,
                show: true,
              }

            this.appList.push(data_foot)
            count++
          }
          this.appList.push(
            {
              id: -1,
              name: this.$t('base.nav_4'),
              router: 'assets',
              jump_url: '',
              svg: 'chips',
              show: true,
            },
            {
              id: -1,
              name: this.$t('base.nav_5'),
              router: 'my',
              svg: 'my',
              show: true,
            },
          )
        })
      },
      open(thirdParty) {
        this.loading = true
        if (thirdParty.id === -1) {
          return
        }
        // console.log('thirdparty id:' + thirdParty.id);
        thirdPartyLogin({ third_party: thirdParty.id }).then(res => {
          // this.loading = false;
          if (thirdParty.jump_url) {
            if (res.iframe) {
              this.$router.push({
                name: 'frame',
                params: {
                  url: thirdParty.jump_url + res.login_token,
                  title: thirdParty.name,
                },
              })
              this.loading = false
            } else {
              window.location.href = thirdParty.jump_url + res.login_token
            }
          } else {
            window.location.href = thirdParty.host + '?token=' + res.login_token
          }
        }).catch(err => {
          console.log('thirdPartyLogin err', err)
          this.loading = false
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .footer {
    background: $pageBgColor;
    box-shadow: $footerShadow;
  }

  .img {
    height: 27px;
    width: 27px;
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .text {
    font-size: 12px;
    color: $footerColor;

    .item--active & {
      color: $footerActiveColor;
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // width: 20%; // 需要动态计算，所以写在js
    height: 100%;
  }

  .svg-icon {
    margin-bottom: 6px;
    color: $iconColor;
    width: 18px;
    height: 20px;
    font-size: 22px;

    .item--active & {
      color: $footerActiveColor;
    }
  }

  .chat {
    position: relative;

    .message-badge {
      position: absolute;
      right: 20px;
      top: 10px;
      transform: translate(50%, -50%) scale(0.9, 0.9);
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      background-color: red;
      color: white;
      font-size: 12px;
    }
  }
</style>
