<template>
  <div v-if="datas" class="payfor">
    <my-head border>
      <template #left>
        <van-icon class="ft24" name="arrow-left" @click="exitShow = true" />
      </template>
    </my-head>
    <div class="main-content">
      <div class="info">
        <div class="ft14">{{ $t('beePal.payfor.payfor') }}</div>
        <div class="amount">
          <span>{{ datas.price | money_filter(2) }}</span>
          <span>&nbsp;{{ datas.currency.name }}</span>
        </div>
        <div class="timeRemaining">
          <span>{{ $t('beePal.payment.timeRemaining') }}</span>
          <span class="time">{{ datas.time | dateFormat('mm:ss') }}</span>
        </div>
        <div class="paying">
          {{
            $t('beePal.payfor.paying', [
              settings.MAIN_THEME,
              datas.amount,
              datas.coin.name,
            ])
          }}
        </div>
      </div>
      <div class="seller">
        <van-cell is-link class="box">
          <div class="borderBox">
            <div class="rickname flex row-v-c">
              <img :src="getUserHead(datas.seller.nickname)" width="24" />
              <span>{{ datas.seller.nickname || $t('base.noNicknameUser') }}</span>
            </div>
            <div class="flex recurity">
              <div v-for="(val, key) in recurity" :key="key" class="flex row-v-c">
                <svg-icon
                  class-name="rightCircle"
                  icon-class="rightCircle"
                ></svg-icon>
                <span>{{ $t('beePal.payfor.' + key) }}</span>
              </div>
            </div>
          </div>
        </van-cell>
      </div>
      <div class="detail">
        <van-cell
          :border="false"
          :title="$t(`beePal.payfor.account_payment_${datas.supportedTrans[paymentType]}`)"
          :value="
            (datas.payment && datas.payment.account_name) ||
              datas.trade.payment[paymentType].account_name
          "
          class="account"
        >
          <template #right-icon>
            <svg-icon
              icon-class="copy"
              class-name="copy"
              @click="copyText('.account .van-cell__value span')"
            ></svg-icon>
          </template>
        </van-cell>
        <van-cell
          :border="false"
          :title="$t(`beePal.payfor.cardNum_payment_${datas.supportedTrans[paymentType]}`)"
          :value="
            (datas.payment && datas.payment.account_number) ||
              datas.trade.payment[paymentType].account_number
          "
          class="cardNum"
        >
          <template #right-icon>
            <svg-icon
              icon-class="copy"
              class-name="copy"
              @click="copyText('.cardNum .van-cell__value span')"
            ></svg-icon>
          </template>
        </van-cell>
        <!-- 開戶銀行 -->
        <van-cell
          v-if="datas.supportedTrans[paymentType] === 'bank'"
          :border="false"
          :title="$t('beePal.payfor.bank')"
          :value="
            (datas.payment && datas.payment.bank_name) ||
              datas.trade.payment[paymentType].bank_name
          "
          class="bank"
        >
          <template #right-icon>
            <svg-icon
              icon-class="copy"
              class-name="copy"
              @click="copyText('.bank .van-cell__value span')"
            ></svg-icon>
          </template>
        </van-cell>
        <!-- 收款碼 -->
        <van-cell
          v-else
          :border="false"
          :title="$t('beePal.payfor.paymentQRcode')"
          class="code"
        >
          <template #default>
            <van-uploader v-if="paymentQRcode" v-model="paymentQRcode" :deletable="false" max-count="1" image-fit="contain" class="paymentQRcode"/>
            <p v-else>{{ $t('base.empty') }}</p>
          </template>
        </van-cell>
      </div>
      <!-- 上傳憑證 start -->
      <div v-if="isUploadCertificate" class="uploadCertificate">
        <p class="title">{{ $t('beePal.payment.uploadCertificate') }}</p>
        <van-cell is-link left @click="uploadImg">
          <template #icon>
            <img ref="certificate" :src="certificate || require('@/assets/img/upload-image-icon.png')" class="certificate"/>
            <!-- <van-icon name="arrow" class="van-cell__right-icon"/> -->
          </template>
          <template #right-icon>
          </template>
        </van-cell>
      </div>
      <!-- 上傳憑證 end -->
      <div class="tips">{{ $t('beePal.payfor.tips') }}</div>
      <div class="btn">
        <van-button @click="confirm = true">{{
          $t('beePal.payfor.paySuccess')
        }}</van-button>
      </div>
    </div>
    <!-- 上傳憑證彈窗 start -->
    <my-upload
      v-model="uploadImgShow"
      :width="92"
      :height="92"
      :headers="headers"
      :no-rotate="false"
      :method="uploadMethod"
      :url="uploadUrl + `bill/${datas.bill_no}/upload_receipt_img/`"
      :lang-type="lang[$i18n.locale]"
      :file-name="VG__userInfo.id + '_' + new Date().getTime()"
      :max-size="5120"
      field="receipt_img"
      img-format="png"
      no-circle
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail">
    </my-upload>
    <!-- 上傳憑證彈窗 end -->
    <van-dialog
      v-model="exitShow"
      :title="$t('beePal.payfor.quit')"
      :cancel-button-text="$t('beePal.deal.cancel')"
      :confirm-button-text="$t('beePal.payfor.confirm')"
      :class-name="exitChecked ? 'ensure' : ''"
      show-cancel-button
      @cancel="exitChecked = null"
      @confirm="quit"
    >
      <div class="mt20">
        <div class="redTip">{{ $t('beePal.payfor.tip') }}</div>
        <div class="mt5 tip">
          {{ $t('beePal.payfor.quitTip', [dateFormat(datas.time, 'mm:ss')]) }}
        </div>
      </div>
      <div class="mt20 mb10">
        <van-checkbox v-model="exitChecked" name="cancel">{{
          $t('beePal.payment.notPayTip')
        }}</van-checkbox>
      </div>
    </van-dialog>
    <van-dialog
      v-model="confirm"
      :title="$t('beePal.payfor.payConfirm')"
      :cancel-button-text="$t('beePal.deal.cancel')"
      :confirm-button-text="$t('beePal.transfer.confirm')"
      class-name="ensure"
      show-cancel-button
      @confirm="payConfirm"
    >
      <div class="mt20">
        <div class="">{{ $t('beePal.payfor.confirmTip') }}</div>
        <div class="mt5 redTip mb20">
          {{ $t('beePal.payfor.maliciousClick') }}
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import { money_filter } from '@/utils/money'
import { dateFormat } from '@/utils/time'
import { settings } from '@/config'
import { Icon, Cell, Button, Checkbox, Uploader } from 'vant'
import { getUserHead, copyText } from '@/utils/index'
import { havePaid } from '@/api/beePal'
import { mapGetters, mapActions } from 'vuex'
import myUpload from '@/components/vue-image-upload'
import Storage from '@/utils/storage'

export default {
  name: 'Payfor',
  components: {
    myHead,
    myUpload,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Uploader.name]: Uploader,
  },
  filters: {
    money_filter,
  },
  data() {
    return {
      settings,
      exitShow: false,
      confirm: false,
      exitChecked: null,
      recurity: {
        cashDeposit: true,
        certification: true,
        securedTransaction: true,
      },
      uploadImgShow: false,
      uploadMethod: 'POST',
      uploadUrl: process.env.VUE_APP_BASE_API,
      headers: {
        'Authorization': `Bearer ${Storage.getLocal('token')}`,
      },
      paymentMethodMap: [1, 2, 3],
      lang: {
        cn: 'zh',
        en: 'en',
        tw: 'zh-tw',
      },
      // datas: this.$route.params.datas,
    }
  },
  computed: {
    ...mapGetters(['G_singleOrderById', 'VG__userInfo']),
    datas() {
      return this.G_singleOrderById(this.$route.params.orderid)
    },
    certificate() {
      return this.datas.receipt_img
    },
    isUploadCertificate() {
      return this.datas.status === 1
    },
    paymentType() {
      let type = null
      if (typeof this.datas.method !== 'undefined') {
        type = this.datas.method
      } else {
        type = this.datas.payment.type
      }
      return type
    },
    paymentQRcode() {
      if (this.datas.trade.payment[this.paymentType].qr_code) {
        return [
          { url: this.datas.trade.payment[this.paymentType].qr_code, isImage: true },
          // { url: 'https://i.ibb.co/k2rqHJZ/qrcode.png', isImage: true }, // API沒串接的時候備用(隨便一張QR Code圖檔)
        ]
      } else {
        return null
      }
    }
  },
  watch: {
    datas(newv, oldv) {
      if (!newv) {
        this.$router.push('/deal')
      }
    },
    'datas.time'(newV, oldV) {
      // console.log(`oldV ${oldV} newV ${newV}`)
      if (this.datas.status === 1 && newV <= 0) {
        this.$router.push({ name: 'deal' })
      }
    },
  },
  created() {
    this.$myConsole.log('payfor datas', this.datas)
    if (!this.datas) this.$router.back()
  },
  methods: {
    ...mapActions('user', ['VA__updateUserInfo']),
    ...mapActions('BeePal', ['AC_UPDATEORDER']),
    getUserHead,
    dateFormat,
    copyText(controller) {
      copyText(controller, () => {
        this.$toast(this.$t('beePal.payment.copySuccess'))
      })
    },
    quit() {
      this.datas.myStatus = 0
      this.AC_UPDATEORDER(this.datas)
      this.$router.push({
        name: 'payment',
        params: {
          orderid: this.datas.id,
        },
      })
    },
    payConfirm() {
      const params = {
        payment: this.paymentMethodMap[this.paymentType],
        bill_no: this.datas.bill_no,
      }
      havePaid(this.datas.bill_no, params).then(res => {
        if (res.code === 0) {
          this.datas.myStatus = 1
          this.datas.payment = res.data.payment
          // this.$myConsole.log('this.datas.payment', this.datas.payment)
          this.$router.push({
            name: 'lastLap',
            params: {
              orderid: this.datas.id,
              payment: this.datas.payment
            },
          })
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.$toast(this.$t('base.unknownErr'))
        }
      }).catch(err => {
        console.log('payConfirm-err', err)
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    // 上傳憑證 start
    uploadImg() {
      console.log('uploadImg')
      this.uploadImgShow = !this.uploadImgShow
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
    },
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      // console.log('jsonData', jsonData)
      const certificate = jsonData.data.receipt_img
      const img = this.$refs.certificate
      img.src = certificate
      this.datas.receipt_img = certificate
      this.VA__updateUserInfo()
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
    },
    // 上傳憑證 end
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.payfor {
  height: calc(100% + 80px);
}

.main-content {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: $pageBgColor;
  color: $labelColor1;
}

.info {
  text-align: center;
  padding: 20px 0 50px;
  .amount {
    color: $labelColor13;
    font-size: 30px;
    margin-top: 10px;
  }
  .timeRemaining {
    color: $labelColor20;
    margin-top: 10px;
    margin-bottom: 6px;
    font-size: 14px;
    .time {
      color: $gathering;
      margin-left: 3px;
    }
  }
  .paying {
    font-size: 13px;
    width: fit-content;
    margin: auto;
    background: $tintBg;
    border-radius: 15px;
    padding: 5px 17px;
  }
}

.rickname {
  font-size: 16px;
  color: $labelColor1;
  img {
    margin-right: 5px;
    border-radius: 100%;
  }
}

.recurity {
  font-size: 12px;
  margin-top: 15px;
  color: $labelColor20;
  .rightCircle {
    margin-right: 3px;
  }
  > div:not(:last-child) {
    margin-right: 35px;
  }
}

.box {
  align-items: center;
  padding: 0 15px;
  .van-cell__value {
    overflow: visible;
  }
  .borderBox {
    padding: 5px 0;
    > ::after {
      content: '';
      position: absolute;
      width: calc(100% + 20px);
      bottom: 0;
      border-bottom: 1px solid $BorderColor4;
    }
  }
}

.detail {
  background: #F3F3F3;
  margin-top: 20px;
  margin-left: 16px;
  margin-right: 16px;

  .van-cell {
    background: #F3F3F3;
    color: $labelColor1;
    .van-cell__value {
      overflow: visible;
      color: $labelColor1;
      white-space: nowrap;
    }
    .copy {
      margin: auto 0 auto 8px;
    }
  }

  .code {
    .van-cell__value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    ::v-deep .van-uploader {
      width: 20px;
      height: 20px;
      display: block;

      input {
        pointer-events: none;
      }

      .van-uploader__wrapper {
        opacity: 1;
      }

      .van-uploader__upload, .van-uploader__preview {
        width: 20px;
        height: 20pxx;
        margin: 0;

        &:active {
          background: #f7f8fa;
        }
      }

      .van-uploader__preview-image {
        width: 20px;
        height: 20px;
      }

      .van-uploader__upload-icon {
        font-size: 200px;
      }
    }
  }
}

.uploadCertificate {
  margin-top: 26px;
  .title {
    font-size: 15px;
    font-weight: bold;
    margin-left: 16px;
  }
}

.tips {
  margin-top: 3px;
  margin-bottom: 30px;
  font-size: 11px;
  color: rgba($color: $tipsColor, $alpha: 0.59);
  padding: 0 15px;
}

.certificate {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-top: 17px;
}

.certificate-uploaded {
  cursor: default;
}

.btn {
  margin: auto 25px 50px;
  .van-button {
    background: $linearBgColor-03;
    width: 100%;
    border-radius: 6px;
    border: none;
    color: $cardColor;
    height: 48px;
    font-size: 16px;
  }
}

::v-deep .van-dialog {
  .van-dialog__header {
    color: $labelColor25;
  }
  .van-dialog__content {
    padding: 0 20px;
    font-size: 14px;
    color: $labelColor18;
    .redTip {
      color: $tipsColor;
    }
    .tip {
      color: $labelColor20;
    }
    .van-checkbox__icon {
      font-size: 16px;
    }
    .van-checkbox__label {
      font-size: 12px;
      color: $labelColor1;
    }
  }
  .van-button__content {
    font-size: 16px;
  }
  .van-dialog__cancel {
    background-color: $cancelBgColor;
    color: $labelColor20;
  }
  .van-dialog__confirm {
    background-color: $labelColor20;
    color: $cardColor;
    pointer-events: none;
    transition: all 0.2s;
  }
  .van-checkbox__icon--checked {
    .van-icon-success {
      background-color: $cardBgColor;
      border-color: $cardBgColor;
    }
  }
  &.ensure {
    .van-dialog__confirm {
      background-color: $cardBgColor;
      pointer-events: initial;
    }
  }
}
</style>
