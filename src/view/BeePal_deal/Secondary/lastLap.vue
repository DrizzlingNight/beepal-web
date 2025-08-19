<template>
  <div v-if="datas" class="lastLap">
    <my-head border></my-head>
    <div class="main-content">
      <div class="head">
        <template v-if="success">
          <div class="left">
            <div class="title">{{ $t('beePal.lastLap.success') }}</div>
            <div class="timeRemaining">
              <span>{{
                $t('beePal.lastLap.confirmTip', [datas.amount, datas.coin.name])
              }}</span>
            </div>
          </div>
          <svg-icon
            class-name="confirmed ft65"
            icon-class="confirmed"
          ></svg-icon>
        </template>
        <template v-else>
          <div class="left">
            <div class="title">{{ $t('beePal.lastLap.waitConfirm') }}</div>
            <div class="timeRemaining">
              <span>{{ $t('beePal.lastLap.tip') }}</span>
            </div>
          </div>
          <!-- <van-circle
            v-model="circle"
            :rate="currentRate"
            :speed="20"
            :text="datas.time | dateFormat('mm:ss')"
            :color="style.circleColor"
            :layer-color="style.circleBg"
            stroke-width="60"
            size="65px"
          /> -->
        </template>
      </div>
      <div class="detail">
        <div class="flex row-v-c">
          <img
            :src="`/static/img/coins/BeePal/${datas.coin.code}.png`"
            width="24"
          />
          <span class="title">{{
            $t('beePal.deal.buyCoin', [datas.coin.name])
          }}</span>
        </div>
        <div class="total">
          <div>{{ $t('beePal.payment.total') }}</div>
          <div class="value">
            <span>{{ datas.price | money_filter(2) }}</span>
            <span>&nbsp;CNY</span>
          </div>
        </div>
        <div class="price">
          <div>{{ $t('beePal.deal.price') }}</div>
          <div>
            <span>{{ datas.rate | money_filter }}</span>
            <span>&nbsp;{{ datas.currency.name }}/{{ datas.coin.name }}</span>
          </div>
        </div>
        <div class="number">
          <div>{{ $t('beePal.deal.num') }}</div>
          <div>
            <span>{{ datas.amount }}</span>
            <span>&nbsp;{{ datas.coin.name }}</span>
          </div>
        </div>
        <div class="orderID">
          <div>{{ $t('beePal.payment.orderID') }}</div>
          <div class="flex row-v-c">
            <span class="copyOrder">{{ datas.bill_no }}</span>
            <svg-icon
              icon-class="copy"
              class-name="ml5 ft14"
              @click="copyText('.copyOrder')"
            ></svg-icon>
          </div>
        </div>
        <div class="certificate">
          <div>{{ $t('beePal.payment.certificate') }}</div>
          <div class="value flex row-v-c">
            <van-uploader v-if="certificate" v-model="certificate" :deletable="false" max-count="1" image-fit="contain" class="image"/>
            <p v-else>{{ $t('base.empty') }}</p>
          </div>
        </div>
      </div>
      <div class="rickname">
        <div>{{ $t('beePal.payment.seller') }}</div>
        <div class="value flex row-v-c">
          <img :src="getUserHead(datas.seller.nickname)" width="24"/>
          <span>{{ datas.seller.nickname || $t('base.noNicknameUser') }}</span>
        </div>
      </div>
      <div v-if="!success" class="orderDetail">
        <van-cell
          :border="false"
          :title="$t(`beePal.payfor.account_payment_${datas.supportedTrans[paymentType]}`)"
          :value="datas.payment.account_name"
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
          :value="datas.payment.account_number"
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
      <div class="btnGroup">
        <!-- <van-button
          class="cancel"
          @click="success ? $router.push('/otcHistory') : (cancelShow = true)"
        >{{
          success
          ? $t('beePal.lastLap.checkTheBalance')
          : $t('beePal.payment.cancel')
          }}
        </van-button> -->
        <van-button
          class="appeal"
          @click="success ? $router.push('/deal') : gotoAppeal()"
        >{{
          success ? $t('beePal.lastLap.back') : $t('beePal.lastLap.appeal')
          }}
        </van-button
        >
      </div>
    </div>
    <van-dialog
      v-model="cancelShow"
      :title="$t('beePal.payment.quit')"
      :cancel-button-text="$t('beePal.deal.cancel')"
      :confirm-button-text="$t('beePal.transfer.confirm')"
      :class-name="cancelChecked ? 'ensure' : ''"
      show-cancel-button
      @cancel="cancelChecked = null"
      @confirm="quit"
    >
      <div class="mt20">
        <div class="redTip">{{ $t('beePal.lastLap.quitTip') }}</div>
        <div class="mt5 tip">{{ $t('beePal.lastLap.quitTip2') }}</div>
      </div>
      <div class="mt20 mb10">
        <van-checkbox v-model="cancelChecked" name="cancel">{{
          $t('beePal.lastLap.check')
          }}
        </van-checkbox>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import style from '@/styles/variable.scss'
  import { dateFormat } from '@/utils/time'
  import { money_filter } from '@/utils/money'
  import { cancelBill } from '@/api/beePal'
  import { copyText, getUserHead } from '@/utils/index'
  import { Button, Cell, Checkbox, Circle, Icon, Uploader } from 'vant'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'LastLap',
    filters: {
      dateFormat,
      money_filter,
    },
    components: {
      myHead,
      [Circle.name]: Circle,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Checkbox.name]: Checkbox,
      [Uploader.name]: Uploader,
    },
    data() {
      return {
        circle: null,
        success: this.$route.params.success || false,
        // datas: this.$route.params.datas,
        cancelChecked: null,
        cancelShow: false,
        style,
      }
    },
    computed: {
      ...mapGetters(['G_singleOrderById', 'VG__userInfo']),
      datas() {
        return this.G_singleOrderById(this.$route.params.orderid)
      },
      currentRate() {
        return (
          ((this.datas.tempTime - this.datas.time) / this.datas.tempTime) * 100
        )
      },
      certificate() {
        if (this.datas.receipt_img) {
          return [
            { url: this.datas.receipt_img, isImage: true },
          ]
        } else {
          return null
        }
      },
      isOrderPaying() {
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
      },
    },
    watch: {
      datas(newv, oldv) {
        if (newv && newv.status === 2) {
          this.success = true
          this.AC_UPDATEWALLET()
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
      this.$myConsole.log('lastLap datas', this.datas)
      if (!this.datas) this.$router.back()
      if (!this.datas.payment) this.datas.payment = this.$route.params.payment || {}
    },
    methods: {
      ...mapActions('BeePal', ['AC_REMOVEORDER', 'AC_UPDATEWALLET']),
      getUserHead,
      copyText(controller) {
        copyText(controller, () => {
          this.$toast(this.$t('beePal.payment.copySuccess'))
        })
      },
      quit() {
        // 取消订单
        cancelBill(this.datas.bill_no).then(res => {
          if (res.code === 0) {
            this.AC_REMOVEORDER(res.id)
            this.$notify({
              message: this.$t('beePal.payment.canceled'),
              color: '#ffffff',
              background: '#2A2C38CC',
              className: 'cancel',
              duration: '1000',
            })
            this.$router.push({
              name: 'payment',
              params: {
                orderid: this.datas.id,
                cancel: true,
              },
            })
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('base.unknownErr'))
          }
        }).catch(err => {
          console.log('cancelBill-err', err)
          this.$toast(this.$t('base.unknownErr'))
          this.$router.push('deal')
        })
      },
      gotoAppeal() {
        this.$router.push({
          name: 'appeal',
          params: {
            order: this.datas,
          },
        })
      },
      // TODO:暫時把需要串API的Function寫在這裡，等接口出來再修改
      getOrderCertificate(data) {
        // this.$myConsole.log('getOrderCertificate', data)
        return this.certificate
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .lastLap {
    height: 100%;
  }

  .main-content {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: $pageBgColor;
    color: $labelColor1;
    padding-left: 15px;
    padding-right: 15px;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 0.5px solid $BorderColor4;

    .left {
      .title {
        font-size: 22px;
      }

      .timeRemaining {
        color: $labelColor20;
        margin-top: 3px;
        font-size: 14px;

        .time {
          color: $labelColor13;
          margin-left: 2px;
          font-size: 14px;
        }
      }
    }

    ::v-deep .van-circle__text {
      color: $labelColor13;
    }
  }

  .detail {
    padding: 15px 0 25px;
    border-bottom: 0.5px solid $BorderColor4;

    .title {
      font-size: 16px;
      margin-left: 5px;
    }

    .total,
    .price,
    .number,
    .orderID,
    .certificate {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
    }

    .total {
      .value {
        font-size: 18px;
        color: $labelColor13;
      }
    }

    .certificate {
      ::v-deep .van-uploader {
        width: 24px;
        height: 24px;
        display: block;

        input {
          pointer-events: none;
        }

        .van-uploader__wrapper {
          opacity: 1;
        }

        .van-uploader__upload, .van-uploader__preview {
          width: 24px;
          height: 24pxx;
          margin: 0;

          &:active {
            background: #f7f8fa;
          }
        }

        .van-uploader__preview-image {
          width: 24px;
          height: 24px;
        }

        .van-uploader__upload-icon {
          font-size: 200px;
        }
      }
    }
  }

  .rickname {
    padding: 16px 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;

    .value {
      font-size: 16px;
      font-weight: bold;

      img {
        margin-right: 5px;
        border-radius: 100%;
      }
    }
  }

  .orderDetail {
    .van-cell {
      color: $labelColor1;
      padding: 8px 0;

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

  .btnGroup {
    margin-top: auto;
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    .van-button {
      color: $labelColor20;
      width: 100%;
      border: 1px solid $cellBorderColor;
      height: 46px;
      border-radius: 6px;

      .van-button__text {
        font-size: 16px;
      }

      &:first-child {
        margin-right: 18px;
      }
    }

    .appeal {
      color: $labelColor20;
      width: 100%;
      margin-right: 0px;
      border: 1px solid $cellBorderColor;
      border-radius: 6px;
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
