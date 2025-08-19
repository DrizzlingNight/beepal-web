<template>
  <div class="AllDapp">
    <my-head :title="$t('find.allDapp')" border></my-head>
    <van-cell-group class="content">
      <van-cell v-for="(item,index) in appList" :key="index" @click="openApp(item)">
        <template #title>
          <div class="image">
            <img :src="item.background && item.background.replace('http://', 'https://')" :alt="item.name" >
          </div>
        </template>
        <template #default>
          <div class="text">
            <p class="subtitle">{{ item.nameArray[0] || ' ' }}</p>
            <p class="descrpition">{{ item.nameArray[1] || ' ' }}</p>
          </div>
          <div class="icon" @click.stop="setFavoriteDapp(item)">
            <svg-icon v-if="item.is_favorite" icon-class="star" class-name="star"/>
            <svg-icon v-else icon-class="star-empty" class-name="star-empty"/>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <div style="position: absolute;top: 50%;left: 50%;transform: translate3d(-50%,-50%,0);">
      <van-loading v-show="isAppLoading" size="148px" vertical>
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
import { Button, Cell, CellGroup, Loading, Popup } from 'vant'
import { mapGetters } from 'vuex'
import { getThirdPartyList, setFavoriteDapp, thirdPartyLogin } from '@/api'
import Storage from '@/utils/storage.js'
import myHead from '@/components/head/Normal_head'

export default {
  name: 'AllDapp',
  components: {
    myHead,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Loading.name]: Loading,
    [Popup.name]: Popup,
  },
  data() {
    return {
      isLoading: false,
      isAppLoading: false,
      secondCheck: false,
      isLogined: false,
      appList: [],
      item: null,
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
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
  async created() {
    await this.getAppList()
  },
  methods: {
    async getAppList() {
      this.isAppLoading = true
      await getThirdPartyList().then(res => {
        // this.$myConsole.log('getFavoriteList res', res)
        let list = []
        if (res.data.results) {
          list = res.data.results
          list.forEach(item => { item.nameArray = item.name.split(/\b */) })
        }
        this.appList = list
        this.isAppLoading = false
        // this.$myConsole.log('this.appList', this.appList)
      }).catch(err => {
        console.log('getAppList-err', err)
        this.isAppLoading = false
      })
    },
    async setFavoriteDapp(app) {
      this.isLoading = true
      this.$dialog
        .confirm({
          message: app.is_favorite ? this.$t('find.confrimCancelFavorite') : this.$t('find.confrimFavorite'),
          className: 'dialog',
          confirmButtonText: this.$t('base.confirm'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(async() => {
          await setFavoriteDapp(app.id).then(res => {
            // this.$myConsole.log('setFavoriteDapp res', res)

            if (res.code === 0) {
              this.$toast(app.is_favorite ? this.$t('find.cancelFavoriteSuccess') : this.$t('find.favoriteSuccess'))
              this.getAppList()
            } else if (this.$t(`errorCode.${res.code}`)) {
              this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('tip.setFail'))
            }
            this.isLoading = false
          }).catch(err => {
            console.log('setFavoriteDapp-err', err)
            this.$toast(this.$t('base.unknownErr'))
            this.isLoading = false
          })
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 登入Dapp Start
    openApp(app) {
      if (!this.isLogined) {
        return this.$toast(this.$t('find.toast_1'))
      }

      // 設置我的足跡Dapp Start
      const footprint = {
        ...app
      }
      const list = [...Storage.getLocal('footprintList')]
      const isIncluded = list.find(item => item.id === footprint.id)

      if (typeof isIncluded === 'undefined') {
        if (list.length >= 10) {
          list.splice(9, 1)
          list.splice(0, 0, footprint)
        } else {
          list.splice(0, 0, footprint)
        }

        Storage.setLocal('footprintList', list)
      }
      // 設置我的足跡Dapp End

      this.$dialog
        .confirm({
          title: this.$t('find.thirdPart_title', [app.nameArray[0]]),
          message: this.$t('find.thirdPart_tip', [app.nameArray[0]]),
          className: 'dialog_c',
          confirmButtonText: this.$t('beePal.gathering.confirm'),
          cancelButtonText: this.$t('beePal.deal.cancel'),
        })
        .then(() => {
          this.item = app
          this.secondCheck = true
        })
    },
    next(app) {
      this.isAppLoading = true
      this.gifLoadingVisible = true
      this.secondCheck = false
      this.item = null
      thirdPartyLogin({ third_party: app.id }).then(res => {
        this.isAppLoading = false
        if (app.jump_url) {
          if (res.iframe) {
            this.$router.push({
              name: 'frame',
              params: {
                url: app.jump_url + res.login_token,
                title: app.name,
                balances: res.balances.map(item => {
                  return item.name
                }),
              },
            })
          } else {
            window.location.href = app.jump_url + res.login_token
          }
        } else {
          if (res.iframe && res.is_landscape) {
            return this.$router.push({
              name: 'horizontalFrame',
              params: {
                url: res.login_token,
                from: app.app_id,
                balances: res.balances.map(item => {
                  return item.name
                }),
              },
            })
          }
          window.location.href = res.login_token
        }
      }).catch(err => {
        this.isAppLoading = false
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
    // 登入Dapp End
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';

.AllDapp {
  background-color: #F5F5F5;

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }

  .content {
    position: relative;
    margin-top: 60px;

    .image {

      img {
        width: 52px;
        height: 52px;
      }
    }

    .van-cell__title {
      flex-grow: 0.25
    }

    .van-cell__value {
      display: flex;
      flex-direction: row;

      .text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .subtitle {
          font-size: 16px;
          font-weight: bold;
          color: #000;
        }

        .descrpition {
          font-size: 12px;
          color: #A6A8B3;
        }
      }

      .icon {
        cursor: pointer;
        position: absolute;
        top: 30%;
        right: 5px;
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
}

</style>
