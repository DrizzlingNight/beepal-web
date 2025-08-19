<template>
  <div class="gathering">
    <my-head :title="$t('beePal.gathering.title', [token.coin_name])"></my-head>
    <div class="main-content">
      <div class="card">
        <div class="card-content">
          <div class="tip">
            {{ $t('beePal.gathering.tip1', [token.coin_name]) }}
          </div>
          <div class="qrcode-box">
            <img src="@/view/assets/fourBorder.png" class="border" />
            <div class="qrcode-wrap">
              <fg-qrcode
                ref="qr"
                :text="token.address ? token.address : ''"
              ></fg-qrcode>
            </div>
          </div>
          <div :class="{'notEOS': !isEOS }" class="address mb30">
            <div class="tip">
              {{
                isEOS
                  ? $t('beePal.gathering.tip2')
                  : $t('beePal.gathering.tip5')
              }}
            </div>
            <div id="address" class="content">
              {{ token.address && token.address.split('|')[0] }}
            </div>
          </div>
          <div v-if="isEOS" class="tag">
            <div class="tip">{{ $t('beePal.gathering.tip3') }}</div>
            <div id="tag" class="content">
              {{ token.address && token.address.split('|')[1] }}
            </div>
          </div>
          <div class="redTip">
              {{ $t('beePal.gathering.tip4') }}
            </div>
        </div>
        <div class="card-footer">
          <van-button class="downloadQR" @click="downloadimg">
            <svg-icon icon-class="download" class-name="download" />
            <span>{{ $t('beePal.gathering.btn1') }}</span>
          </van-button>
          <van-button class="copyAddress" @click="copyText('#address')">
            <svg-icon icon-class="copy_black" class-name="copy_black" />
            <span>{{ $t('beePal.gathering.btn2') }}</span>
          </van-button>
          <van-button v-if="isEOS" class="copyTag" @click="copyText('#tag')">
            <svg-icon icon-class="copy_black" class-name="copy_black" />
            <span>{{ $t('beePal.gathering.btn3') }}</span>
          </van-button>
        </div>
        <div class="copy-full-message" @click="copyFullMessage">
          <div class="button">
            <svg-icon icon-class="copy_black" class-name="copy_black" />
            <p>{{ $t('beePal.gathering.copyFullMessage') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import FgQrcode from '@/components/qrcode/Qrcode'
import { Button } from 'vant'
import { download } from '@/utils/downPicture'
import { copyText, simpleCopyText } from '@/utils/index'
import coinMixin from '@/mixins/coinMixin'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Gathering',
  components: {
    myHead,
    FgQrcode,
    [Button.name]: Button,
  },
  mixins: [coinMixin],
  data() {
    return {
      ethChain: ['EOS_EOS', 'EOS_BAP'], // 備用，之後後端有改的話可以用
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    isEOS() {
      // console.log('this.token', this.token)
      const coin = this.token.coin_code.split('_')
      const coinChain = coin[0] || ''
      const coinName = coin[1] || ''
      if (coinChain === 'EOS') {
        this.$dialog.alert({
          title: this.$t('beePal.gathering.eosTip'),
          message: this.$t('beePal.gathering.eosTipContent', [coinName]),
          confirmButtonText: this.$t('beePal.gathering.confirm'),
          className: 'alertDialog',
        })
        return true
      } else return false
    },
  },
  created() {
    // this.$myConsole.log('token', this.token)
    this.AC_ADDWALLET({ userid: this.VG__userInfo.id, id: this.token.coin })
  },
  methods: {
    ...mapActions('BeePal', ['AC_ADDWALLET']),
    copyText(controller) {
      copyText(controller, () => {
        this.$notify({
          message: this.$t('beePal.payment.copySuccess'),
          className: 'success',
          color: '#ffffff',
          background: '#2A2C38CC',
          duration: '1000',
        })
      })
    },
    copyFullMessage() {
      // this.$myConsole.log('this.token', this.token)
      const address = this.token.address.split('|')
      let text = ''
      if (this.token.coin_chain) {
        text = this.$t('beePal.gathering.fullMessageWithChian', [this.token.coin_chain, this.token.coin_name, address[0], address[1] ? address[1] : this.$t('beePal.gathering.none')])
      } else {
        text = this.$t('beePal.gathering.fullMessage', [this.token.coin_name, address[0], address[1] ? address[1] : this.$t('beePal.gathering.none')])
      }

      simpleCopyText(text, () => {
        this.$notify({
          message: this.$t('beePal.payment.copySuccess'),
          className: 'success',
          color: '#ffffff',
          background: '#2A2C38CC',
          duration: '1000',
        })
      })
    },
    downloadimg() {
      if (!this.$refs.qr.$refs.ewm.querySelector('img')) return
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

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.gathering {
  height: 110%;
  background-color: $gatheringBg;
  background-image: url('../../../assets/img/gathering_logo.png');
  background-repeat: no-repeat;
  background-size: 60px;
  background-position: 50% 95%;
  .page-top-safe-area__has-page-title {
    background: transparent;
    color: $cardColor;
  }
}
.card {
  .card-content {
    padding: 30px 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $labelColor1
  }
  background: $pageBgColor;
  width: calc(100% - 30px);
  border-radius: 12px;
  margin: 30px auto;
  overflow: hidden;
  .tip {
    color: $labelColor20;
    font-size: 14px;
  }
  .qrcode-box {
    margin-top: 20px;
    position: relative;
    .qrcode-wrap {
      width: 200px;
      height: 200px;

      .qrcode {
        position: relative;
      }

      // 2021.12.14 為了配合下載下來的QR Code也要有Logo，改成用套件(@cheprasov/qrcode)把Logo壓上去
      // .qrcode::after {
      //   display: block;
      //   content: '';
      //   justify-content: center;
      //   align-items: center;
      //   width: 45px;
      //   height: 45px;
      //   background: center center no-repeat url('~@/assets/img/logo_BeePal.png');
      //   background-size: 40px 40px;
      //   background-color: #fff;
      //   color: #ffc100;
      //   position: absolute;
      //   top: 50%;
      //   left: 51%;
      //   // border-radius: 50%;
      //   transform: translate(-50%, -50%);
      // }
    }
    .border {
      position: absolute;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
  }
  .address,
  .tag {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    text-align: center;
    word-break: break-all;
    .content {
      font-size: 15px;
      margin-top: 8px;

    }
  }
  .notEOS {
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .redTip {
    color: $tipsColor;
    font-size: 11px;
    margin-bottom: 30px;
    margin-top: 4px;
  }
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: $tintBg;
    .van-button {
      font-size: 14px;
      background: transparent;
      font-weight: bold;
      height: 50px;
      flex: 1;
      border: none;
      &.downloadQR {
        min-width: 125px;
      }
      &:not(:last-child) {
        &::after {
          content: '';
          position: absolute;
          right: 1px;
          top: calc(50% - 7.5px);
          width: 1px;
          height: 15px;
          background: $BorderColor4;
        }
      }
      .van-button__text {
        display: flex;
        color: $labelColor1;
        align-items: center;
        .svg-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
  }

  .copy-full-message {
    cursor: pointer;
    background: #fff;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;

    .button {
      display: flex;
      flex-direction: row;
      align-items: center;

      p {
        font-size: 14px;
        font-weight: bold;
      }

      .copy_black {
        margin-right: 8px;
      }
    }
  }
}
</style>
