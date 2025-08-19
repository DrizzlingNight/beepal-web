<template>
  <div class="Dapp">
    <van-swipe :autoplay="4000">
      <van-swipe-item v-for="(banner, index) in bannerList" :key="index">
        <img :src="banner.src" :alt="banner.name" class="find-banner" @click="getBannerDetail(banner.id)"/>
      </van-swipe-item>
    </van-swipe>
    <div class="hook line-wrap more">
      <div class="title">{{ $t('find.title_2') }}</div>
      <div class="sort-button line-wrap" @click="$router.push({ name: 'allDapp' })">
        <span>{{ $t('find.more') }}</span>
        <van-icon name="arrow"/>
      </div>
    </div>
    <ul class="app-list flex">
      <li v-for="app in appList" :key="app.id" class="app-item" @click="open(app)">
        <img :src="app.background && app.background.replace('http://', 'https://')" :alt="app.name">
        <div>{{ app.nameArray[0] }}</div>
        <div>{{ app.nameArray[1] }}</div>
      </li>
    </ul>

    <div class="hot">
      <div class="hook line-wrap">
        <div class="title">{{ $t('find.title_3') }}</div>
        <div class="sort-button line-wrap" @click="classifyShow = !classifyShow">
          <span>{{ $t('find.classification') }}</span>
          <van-icon name="wap-nav"/>
        </div>
        <pull-down :is-show="classifyShow" visual-effect="pull">
          <ul class="classify">
            <li v-for="(item, index) in classify" :class="{active: classifyCheck === index}" :key="index"
                @click="classifyCheck = index; classifyShow = false">
              <div class="bd">{{ item.name }}</div>
            </li>
          </ul>
        </pull-down>
      </div>
      <ul class="app-list flex">
        <li v-for="app in hotApp" :key="app.id" class="app-item" @click="open(app)">
          <img :src="app.background && app.background.replace('http://', 'https://')" :alt="app.name">
          <div>{{ app.nameArray[0] }}</div>
          <div>{{ app.nameArray[1] }}</div>
        </li>
      </ul>
    </div>

    <div class="diagram flex">
      <div v-for="(item,index) in diagram" :key="index" class="app-item">
        <img :src="item"/>
      </div>
    </div>

    <!--    <div class="hot-app flex">-->
    <!--      <div v-for="(app, index) in hotApp" :key="index" class="app-item">-->
    <!--       <img :src="app.src" alt="">-->
    <!--      </div>-->
    <!--    </div>-->
    <!--  </div>-->
    <div style="position: absolute;top: 50%;left: 50%;transform: translate3d(-50%,-50%,0);">
      <van-loading v-show="loading" size="148px" vertical>
        {{ $t('base.loading') }}
      </van-loading>
    </div>
    <van-popup v-model="secondCheck" position="bottom" round closeable close-icon-position="top-left">
      <div class="title" style="text-align: center; padding-right: 18px;">{{ $t('find.authorization') }}</div>
      <div class="content">
        <div class="flex">
          <div class="text">{{ $t('find.text_1') }}</div>
          <div class="r">{{ VG__userInfo.username }}
          </div>
        </div>
        <div class="flex">
          <div class="text">{{ $t('find.text_2') }}</div>
          <div class="r">{{ $t('find.text_3') }}</div>
        </div>
        <van-button class="confirm" @click="next(item)">{{ $t('my.dialog_3') }}</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { getThirdPartyList, thirdPartyLogin, getBannerList, getBannerDetail } from '@/api'
  import { mapActions, mapGetters } from 'vuex'
  import { swiperLists } from '@/config/mayfly/dgc'
  import PullDown from '@/components/BeePalComp/PullDown'
  import { Button, Icon, Loading, Popup, Swipe, SwipeItem } from 'vant'
  import Storage from '@/utils/storage.js'

  export default {
    name: 'Dapp',
    components: {
      PullDown,
      [Loading.name]: Loading,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Popup.name]: Popup,
      [Icon.name]: Icon,
      [Button.name]: Button,
    },
    data() {
      return {
        loading: false,
        appList: [],
        isLogined: false,
        classifyShow: false,
        secondCheck: false,
        classify: [
          { name: this.$t('find.classify.hot'), type: 0 },
          { name: this.$t('find.classify.deal'), type: 1 },
          { name: this.$t('find.classify.financial'), type: 2 },
          { name: this.$t('find.classify.game'), type: 3 },
          { name: this.$t('find.classify.movies'), type: 4 },
        ],
        diagram: [
          require('./diagram1.png'),
          require('./diagram2.png'),
        ],
        hotApp: [],
        classifyCheck: 0,
        bannerList: [],
        currentTypeId: 0,
        item: null,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo', 'thirdPartyList']),
    },
    watch: {
      VG__userInfo: {
        immediate: true,
        deep: true,
        handler(v) {
          if (!v) {
            this.isLogined = false
            return
          } else {
            this.isLogined = true
          }
        },
      },
    },
    created() {
      this.getThirdPartyList()
      this.getBannerList()
    },
    methods: {
      ...mapActions('user', ['VA__logout']),
      open(thirdParty) {
        if (!this.isLogined) {
          return this.$toast(this.$t('find.toast_1'))
        }

        this.$myConsole.log('thirdParty', thirdParty)

        // 設置我的足跡Dapp Start
        const footprintList = Storage.getLocal('footprintList') || []
        const footprint = {
          ...thirdParty
        }
        const isIncluded = footprintList.find(item => item.id === footprint.id)

        if (typeof isIncluded === 'undefined') {
          if (footprintList.length >= 10) {
            footprintList.splice(9, 1)
            footprintList.splice(0, 0, footprint)
          } else {
            footprintList.splice(0, 0, footprint)
          }

          Storage.setLocal('footprintList', footprintList)
        }
        // 設置我的足跡Dapp End

        this.$dialog
          .confirm({
            title: this.$t('find.thirdPart_title', [thirdParty.nameArray[0]]),
            message: this.$t('find.thirdPart_tip', [thirdParty.nameArray[0]]),
            className: 'dialog_c',
            confirmButtonText: this.$t('beePal.gathering.confirm'),
            cancelButtonText: this.$t('beePal.deal.cancel'),
          })
          .then(() => {
            this.item = thirdParty
            this.secondCheck = true
          })
      },
      next(thirdParty) {
        this.loading = true
        this.gifLoadingVisible = true
        this.secondCheck = false
        this.item = null
        thirdPartyLogin({ third_party: thirdParty.id }).then(res => {
          this.loading = false
          if (thirdParty.jump_url) {
            if (res.iframe) {
              this.$router.push({
                name: 'frame',
                params: {
                  url: thirdParty.jump_url + res.login_token,
                  title: thirdParty.name,
                  balances: res.balances.map(item => {
                    return item.name
                  }),
                },
              })
            } else {
              window.location.href = thirdParty.jump_url + res.login_token
            }
          } else {
            if (res.iframe && res.is_landscape) {
              return this.$router.push({
                name: 'horizontalFrame',
                params: {
                  url: res.login_token,
                  from: thirdParty.app_id,
                  balances: res.balances.map(item => {
                    return item.name
                  }),
                },
              })
            }
            window.location.href = res.login_token
          }
        }).catch(err => {
          this.loading = false
          this.gifLoadingVisible = false
          if (err && err.status === 403) {
            // const vm = this
            this.$toast({
              message: '登录状态出错，请重新登录',
              type: 'fail',
              duration: 3 * 1000,
              onClose() {
                // vm.$router.push({ name: 'login' })
                // vm.VA__logout(false)
                window.history.go(-1)
              },
            })
          } else {
            this.$toast(err.status)
          }
        })
      },
      async getThirdPartyList() {
        const appListParams = {
          is_recommend: true
        }
        const hotAppParams = {
          is_hot: true
        }

        this.loading = true
        await this.getAppList(appListParams)
        await this.getHotApp(hotAppParams)
        this.loading = false
      },
      async getAppList(params) {
        await getThirdPartyList(params).then(async res => {
          if (!res) {
            this.loading = false
            return
          }
          this.appList = []
          if (res.data.results) res.data.results.forEach(item => { item.nameArray = item.name.split(/\b */) })
          this.appList = res.data.results;
        })
      },
      async getHotApp(params) {
        await getThirdPartyList(params).then(async res => {
          if (!res) {
            this.loading = false
            return
          }
          this.hotApp = []
          if (res.data.results) res.data.results.forEach(item => { item.nameArray = item.name.split(/\b */) })
          this.hotApp = res.data.results;
        })
      },
      async getBannerList() {
        const params = {

        }
        this.loading = true
        await getBannerList(params).then(async res => {
          this.$myConsole.log('getBannerList res', res)
          if (!res) {
            this.loading = false
            return
          }
          if (res.data.results) {
            const list = res.data.results
            this.bannerList = list.map(item => {
              return {
                id: item.id,
                src: item.pic_zh_cn,
                name: item.name,
                jump_url: item.jump_url
              }
            })
          } else {
            this.bannerList = swiperLists
          }
          this.loading = false
        }).catch(err => {
          console.log('getBannerList-err', err)
          this.bannerList = swiperLists
          this.loading = false
        })
      },
      async getBannerDetail(id) {
        await getBannerDetail(id).then(res => {
          this.$myConsole.info('getBannerDetail res', res)
        }).catch(err => {
          console.log('getBannerDetail-err', err)
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .Dapp {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .title {
    padding: 16px 0 16px 18px;
    font-size: 18px;
    font-weight: bold;
    color: $Color;
  }

  .find-banner {
    margin-top: 15px;
    margin-bottom: 17px;
    margin-left: 15px;
    margin-right: 15px;
    height: $bannerHeight;
    width: calc(100vw - 30px); // ml + mr = 30px
    border-radius: 10px;
  }

  .hook {
    position: relative;

    .box {
      position: absolute;
      right: 15px;
      top: calc(100% - 12px);
      z-index: 0;

      .classify {
        background: rgba($labelColor1, 1);
        color: $cardColor;
        border-radius: 8px;
        margin-bottom: 60px;
        overflow: hidden;

        li {
          font-size: 14px;
          padding: 0 15px;

          &.active {
            color: #FFDE00
          }

          &:first-child {
            padding-top: 5px;
          }

          &:last-child {
            padding-bottom: 5px;
          }

          .bd {
            padding: 7px 30px;
          }

          &:active {
            background: rgba($pageBgColor, 0.2)
          }

          &:not(:last-child) {
            .bd {
              border-bottom: 1px solid rgba($labelColor20, 0.2);
            }
          }
        }
      }
    }
  }

  .more {
    cursor: pointer;
  }

  .app-list {
    flex-wrap: wrap;
    padding-left: 3%;
    height: fit-content;
    align-content: start;

    .app-item {
      font-size: 12px;
      text-align: center;
      color: $Color;
      width: 24%;
      min-height: 90px;
      margin-bottom: 20px;

      img {
        width: 70px;
        height: 70px;
      }
    }
  }

  .sort-button {
    padding-top: 2px;
    color: $labelColor20;
    margin-right: 18px;
    font-size: 14px;

    .van-icon {
      margin-left: 5px;
    }
  }

  .diagram {
    padding: 0 18px;
    justify-content: space-between;
    margin-top: auto;

    .app-item {
      width: 48%;

      img {
        width: 100%;
      }
    }
  }

  .van-popup {
    .content {
      padding: 0 40px 10px 40px;

      > div {
        margin: 15px 0;
        font-size: 14px;

        :last-child {
          margin-bottom: 5px;
        }
      }

      .text {
        color: $userIdColor;
        margin-right: 15px
      }

      .r {
        color: $labelColor1
      }

      .confirm {
        width: 100%;
        border-radius: 8px;
        background: $cardBgColor;
        color: $cardColor;
        padding: 10px;
        font-size: 16px;
        margin-bottom: 40px;
      }
    }
  }
</style>
