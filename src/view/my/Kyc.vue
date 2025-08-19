<!--
 * @Author: your name
 * @Date: 2019-12-06 10:06:28
 * @LastEditTime: 2019-12-10 15:45:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/my/Kyc.vue
 -->
<template>
  <div class="kyc">
    <!-- <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('my.kyc.title') }}</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
        icon-class="livechat"
        class-name="livechat" @click.stop="
          handleRouter('livechat')
        ">
        </svg-icon>
      </div>
    </div> -->
    <my-head :title="$t('my.kyc.title')" @goback="$router.push(Storage.getSession('kyc_back'))"></my-head>
    <div class="main-content">
      <div class="auth__wrap">
        <h2 class="auth-title">
          {{ $t('my.kyc.text_4') }}
          <div
            :class="(baseAuth === -1 || baseAuth === 0) ? 'go-auth-btn'
            : baseAuth === 1 ? 'on-auth-btn' : 'has-auth-btn'"
            @click="gotoAuth(0)">
            <span>{{ baseAuth === -1 ? $t('my.kyc.text_6')
              : baseAuth === 0 ? $t('my.kyc.text_9')
              : baseAuth === 1 ? $t('my.kyc.text_7')
              : $t('my.kyc.text_5') }}</span>
          </div>
          <!--          <div class="on-auth-btn">-->
          <!--            {{ $t('my.kyc.text_7') }}-->
          <!--          </div>-->
        </h2>
        <div class="desc__wrap">
          <!-- <div class="desc">认证后可以提币，24小时限额 100 USDT</div> -->
          <div class="desc">{{ $t('my.kyc.' + authText + 'text_7') }}</div>
          <div class="desc mt4">{{ $t('my.kyc.' + authText + 'text_8') }}</div>
        </div>
        <div v-if="baseAuth === 2" class="detail__wrap">
          <div v-for="(value, key) in $t('my.kyc.detail')" :key="key" class="flex row-v-c row-between mt10">
            <div class="key">{{ value }}</div>
            <div class="value">{{ key === 'name' ? [VG__userInfo.certification.kyc_last_name,
              VG__userInfo.certification.kyc_mid_name, VG__userInfo.certification.kyc_first_name].join('') :
              key === 'email' ? VG__userInfo.email : key === 'country' ? country[VG__userInfo[key]] :
              VG__userInfo.certification[key] }}
            </div>
          </div>
        </div>
      </div>

      <div class="auth__wrap">
        <h2 class="auth-title">
          {{ $t('my.kyc.text_8') }}
          <div
            :class="(advancedAuth === 0 || advancedAuth === -1 || advancedAuth === -2) ? 'go-auth-btn'
               : advancedAuth === 1 ? 'on-auth-btn'
               : 'has-auth-btn'"
            @click="gotoAuth(1)">
            <span>{{ advancedAuth === -2 ? $t('my.kyc.text_6')
              : advancedAuth === -1 ? $t('my.kyc.text_6')
              : advancedAuth === 0 ? $t('my.kyc.text_9')
              : advancedAuth === 1 ? $t('my.kyc.text_7')
              : $t('my.kyc.text_5') }}</span>
          </div>
        </h2>
        <div class="desc__wrap">
          <!-- <div class="desc">认证后可以提币，24小时限额 100 USDT</div> -->
          <div class="desc">{{ $t('my.kyc.' + authText + 'text_9') }}</div>
          <div class="desc mt15">{{ $t('my.kyc.' + authText + 'text_10') }}</div>
        </div>
        <div class="detail__wrap"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { settings } from '@/config'
  import { authText } from '@/styles/variable.scss'
  import myHead from '@/components/head/Normal_head'
  import Storage from '@/utils/storage'
  import { getUserCertification } from '@/api'

  export default {
    name: 'Kyc',
    components: {
      myHead,
    },
    data() {
      return {
        livechat: settings.customerService,
        authText,
        country: {
          HK: '香港',
          TW: '台灣',
          CN: '中国',
        },
        Storage,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      // 是否kyc过
      baseAuth() {
        if (!this.VG__userInfo.certification) return -1
        const base = this.VG__userInfo.certification.base_certification
        const status = this.VG__userInfo.certification.status
        if (!base && status === -1) return 0
        else if (!base && status === 0) return 1
        else if (base) return 2
        return -1
      },
      advancedAuth() {
        if (!this.VG__userInfo.certification) return -2
        if (!this.VG__userInfo.certification.base_certification) return -2
        const adv = this.VG__userInfo.certification.high_certification
        const status = this.VG__userInfo.certification.status
        if (!adv && status === 1) return -1
        else if (!adv && status === -1) return 0
        else if (!adv && status === 0) return 1
        else if (adv) return 2
        return -2
      },
    },
    beforeRouteEnter(to, from, next) {
      if (from.path.toLowerCase() === '/editinfo') {
        // this.kyc_back = '/editinfo'
        Storage.setSession('kyc_back', '/editInfo')
      } else {
        Storage.setSession('kyc_back', '/my')
      }
      next()
    },
    created() {
      this.getUserCertification(this.VG__userInfo.id)
    },
    mounted() {
      this.VA__updateUserInfo()
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo', 'VA__setUserInfo']),
      handleRouter(router) {
        if (this.$route.path.includes(router)) {
          return
        } else {
          this.$router.push(`/${router}`)
        }
      },
      gotoAuth(type) {
        if (type === 0 && (this.baseAuth === -1 || this.baseAuth === 0)) {
          this.$router.push('auth')
        } else if (type === 0 && this.baseAuth === 1) {
          this.$router.push('/onprogress')
        } else if (type === 1 && ((this.advancedAuth !== 1 && this.advancedAuth !== 2) || this.baseAuth === 0)) {
          if (!this.VG__userInfo.certification || !this.VG__userInfo.certification.base_certification) {
            this.$toast(this.$t('my.advanceAuth.tip6'))
            return
          }
          this.$router.push('/advanceAuth')
        } else if (type === 1 && this.advancedAuth === 1) {
          this.$router.push('/onprogress')
        }
      },
      async getUserCertification(user) {
        const userInfo = { ...this.VG__userInfo }
        await getUserCertification(user)
          .then(async res => {
            const certification = res.data
            userInfo.certification = certification
            this.$myConsole.info('userInfo', userInfo)
            Storage.setLocal('userInfo', userInfo)
            this.VA__setUserInfo(userInfo)
          })
          .catch(err => {
            userInfo.certification = {}
            this.$myConsole.error('getUserCertification-err', err)
            this.$myConsole.info('userInfo', userInfo)
            Storage.setLocal('userInfo', userInfo)
            this.VA__setUserInfo(userInfo)
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .kyc {
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom: 60px;
  }

  .svg-icon {
    margin-bottom: 0px;
    color: #d1d1d1;
    width: 22px;
    height: 24px;
    font-size: 24px;
  }

  .title {
    margin-top: 20px;
    margin-left: 14px;
    font-size: 18px;
    font-weight: bold;
    color: $Color;
    color: $labelColor1
  }

  .no-auth-tip,
  .has-auth-tip {
    margin-top: 8px;
    margin-left: 14px;
    margin-bottom: 30px;
    font-size: 14px;
    color: $labelColor9;
  }

  .detail__wrap {
    margin-top: 10px;
    font-size: 14px;

    .key {
      color: $labelColor1;
    }
  }

  .has-auth-tip {
    color: $labelColor15;
  }

  .auth__wrap {
    margin-top: 10px;
    padding: 20px 14px;
    background-color: $pageBgColor;

    .auth-title {
      margin: 0;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: normal;
      color: $labelColor1
    }

    .go-auth-btn {
      @extend .auth-btn;
      background: $authErr;
      color: $cardColor;

      &::before {
        background-image: url(~@/assets/icons/noAuth.png);
      }
    }

    .on-auth-btn {
      @extend .auth-btn;
      background: $onAuth;
      color: $cardColor;

      &::before {
        background-image: url(~@/assets/icons/info.png);
      }
    }

    .has-auth-btn {
      @extend .auth-btn;
      background: $gathering;
      color: $cardColor;

      &::before {
        background-image: url(~@/assets/icons/check-icon.png);
      }
    }

    .desc__wrap {
      padding-top: 13px;
      border-top: 1px solid $BorderColor;
    }

    .desc {
      font-size: 14px;
      font-weight: 400;
      color: $labelColor9;
    }
  }

  .auth-btn {
    padding: 12px 16px 13px 8px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    border-radius: 15px;
    font-size: 14px;
    box-sizing: border-box;
    font-weight: bold;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      width: 15px;
      height: 15px;
      margin-right: 6px;
      margin-top: 0.5px;
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
</style>
