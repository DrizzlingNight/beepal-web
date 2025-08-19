<template>
  <div class="getMoneyCode">
    <page-head :title="$t('chat.title_5')"></page-head>
    <div class="main-content oh">
      <div class="qrcode-card">
        <div class="card-title flex row-v-c">
          <svg-icon
            :icon-class="settings.MAIN_THEME + '_money'" class-name="money"
          >
          </svg-icon>
          <span class="title-text ft17">{{ $t('scan.text_12') }}</span>
        </div>
        <div class="tip ft15">
          {{ $t('scan.text_4') }}
        </div>
        <div class="qrcode-wrap">
          <fg-qrcode ref="qr" :text="referralUrl"></fg-qrcode>
        </div>
        <div class="mbtn ft16" @click="downloadimg">
          {{ $t('scan.text_11') }}
        </div>
        <div class="dead-line"></div>
        <div class="flex row-v-c row-between card-footer" @click="$router.push('/deal')">
          <div class="flex row-v-c">
            <svg-icon
              icon-class="addresslist" class-name="addresslist"
            >
            </svg-icon>
            <span class="ml10">{{ $t('scan.text_13') }}</span>
          </div>
          <van-icon name="arrow"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Icon } from 'vant'
  import FgQrcode from '@/components/qrcode/Qrcode'
  import { mapGetters } from 'vuex'
  import { download } from '@/utils/downPicture'
  import { settings } from '@/config'

  export default {
    name: 'GetMoneyCode',
    components: {
      pageHead,
      [Icon.name]: Icon,
      FgQrcode,
    },
    data() {
      return {
        settings,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      invitationCode() {
        return (this.VG__userInfo && this.VG__userInfo.id.toString()) || '--'
      },
      referralUrl() {
        return JSON.stringify({
          type: 'senddeal_2',
          userid: this.invitationCode,
          username: this.VG__userInfo.username,
        })
        // else return (
        //     window.location.origin + '/#/register?referral=' + this.invitationCode
        // );
      },
    },
    methods: {
      downloadimg() {
        var picurl = this.$refs.qr.$refs.ewm.querySelector('img').src
        download(picurl)
          .then(res => {
            this.$toast({
              message: this.$t('tip.savesuccess'),
              type: 'success',
              duration: 1500,
            })
          })
          .catch(err => {
            console.log(err)
            this.$toast({
              message: this.$t('tip.savefail'),
              type: 'fail',
            })
          })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .getMoneyCode {
    min-height: 100%;
    background: $cardBgColor !important;
  }

  .page-top-safe-area__has-page-title {
    background-color: rgba(0, 0, 0, 0);
    color: $cardColor;
  }

  .qrcode-card {
    border-radius: 12px;
    margin: 20px 9px;
    background: $pageBgColor;
    overflow: hidden;

    .card-title {
      height: 54px;
      background: $cardTitleBg;

      .money {
        margin-left: 14px;
        width: 1.4em;
        height: 1.4em;
      }

      .title-text {
        margin-left: 8px;
        color: $footerActiveColor;
      }
    }

    .card-footer {
      padding: 20px 15px;

      .addresslist {
        width: 1.4em;
        height: 1.4em;
      }
    }
  }

  .qrcode-wrap {
    width: 240px;
    height: 240px;
    margin: 0px auto 0px;
  }

  .tip {
    max-width: 280px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  .mbtn {
    width: 160px;
    height: 45px;
    margin: 10px auto 0;
    background-color: $pageBgColor;
    border-radius: 8px;
    text-align: center;
    border: 1px solid $BorderColor2;
    line-height: 45px;
  }

  .dead-line {
    margin: 20px 15px 0px;
    height: 1px;
    background: $BorderColor2;
  }

  .oh {
    overflow: hidden
  }

</style>
