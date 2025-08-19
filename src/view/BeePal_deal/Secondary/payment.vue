<template>
  <div class="payment">
    <my-head border></my-head>
    <div v-if="datas" class="main-content">
      <div class="head">
        <template v-if="cancel">
          <div class="left">
            <div class="title">{{ $t('beePal.payment.dealCanceled') }}</div>
            <div class="timeRemaining">
              <span>{{ $t('beePal.payment.cancelTip') }}</span>
            </div>
          </div>
          <svg-icon class-name="canceled ft65" icon-class="canceled"></svg-icon>
        </template>
        <template v-else>
          <!-- 訂單進行中（未確認付款）狀態 -->
          <div v-if="isUploadCertificate">
            <div class="left">
              <div class="title">{{ $t('beePal.payment.pay') }}</div>
              <div class="timeRemaining">
                <span>{{ $t('beePal.payment.timeRemaining') }}</span>
                <span class="time">{{ datas.time | dateFormat('mm:ss') }}</span>
              </div>
            </div>
            <van-circle
              v-model="circle"
              :rate="currentRate"
              :speed="20"
              :text="datas.time | dateFormat('mm:ss')"
              :color="style.circleColor"
              :layer-color="style.circleBg"
              stroke-width="60"
              size="65px"
            />
          </div>
          <!-- 已確認付款狀態 -->
          <div v-else>
            <div class="left">
              <div class="title">{{ $t('beePal.payment.orderPending') }}</div>
              <div class="timeRemaining">
                <span>{{ $t('beePal.payment.tip') }}</span>
              </div>
            </div>
          </div>
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
            <span>&nbsp;{{ datas.currency.name }}</span>
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
        <div v-if="!isUploadCertificate" class="certificate">
          <div>{{ $t('beePal.payment.certificate') }}</div>
          <div class="value flex row-v-c">
            <van-uploader v-if="certificate" v-model="certificate" :deletable="false" max-count="1" image-fit="contain" class="image"/>
            <p v-else>{{ $t('base.empty') }}</p>
          </div>
        </div>
      </div>
      <div class="rickname">
        <div>{{ $t('beePal.payment.seller') }}</div>
        <div v-if="datas.seller" class="value flex row-v-c">
          <img :src="getUserHead(datas.seller.nickname)" width="24"/>
          <span>{{ datas.seller.nickname || $t('base.noNicknameUser') }}</span>
        </div>
      </div>
      <div v-if="datas.supportedTrans && datas.supportedTrans.length" class="methods">
        <van-cell
          :title="$t('beePal.payment.method')"
          :is-link="!cancel && !datas.payment && isUploadCertificate"
          @click="!cancel && !datas.payment && isUploadCertificate ? (show = true) : ''"
        >
          <template #default>
            <div class="box flex row-v-c">
              <div class="mr8">
                {{
                $t(
                'beePal.payment.' +
                ((datas.payment &&
                methodMap[datas.payment.type]) ||
                datas.supportedTrans[method]),
                )
                }}
              </div>
              <img
                :src="require('@/assets/img/' +
                  ((datas.payment &&
                    methodMap[datas.payment.type]) ||
                    datas.supportedTrans[method]) +
                    '.png')
                  "
              />
            </div>
          </template>
        </van-cell>
        <buy-mode-action
          v-if="!cancel && !datas.payment"
          v-model="show"
          :method.sync="method"
          :support-method="datas.supportedTrans"
        ></buy-mode-action>
      </div>
      <div v-if="!cancel && isUploadCertificate" class="btnGroup">
        <van-button class="cancel" @click="cancelShow = true">{{
          $t('beePal.payment.cancel')
          }}
        </van-button>
        <van-button class="confirm" @click="confirm">{{
          $t('beePal.payment.confirm')
          }}
        </van-button>
      </div>
      <div v-else class="btnGroup">
        <!-- 申訴按鈕 -->
        <van-button class="appeal" @click="gotoAppeal">{{
          $t('beePal.lastLap.appeal')
          }}
        </van-button>
      </div>
      <van-dialog
        v-model="cancelShow"
        :title="$t('beePal.payment.quit')"
        :cancel-button-text="$t('beePal.payment.pullBack')"
        :confirm-button-text="$t('beePal.transfer.confirm')"
        :class-name="cancelChecked ? 'ensure' : ''"
        show-cancel-button
        @cancel="cancelChecked = null"
        @confirm="quit"
      >
        <div class="mt20">
          <div class="redTip">{{ $t('beePal.payment.tip') }}</div>
          <div class="mt5 tip">{{ $t('beePal.payment.rule') }}</div>
        </div>
        <div class="mt20 mb10">
          <van-checkbox v-model="cancelChecked" name="cancel">{{
            $t('beePal.payment.notPayTip')
            }}
          </van-checkbox>
        </div>
      </van-dialog>
    </div>
    <van-overlay v-else :show="true">
      <van-loading/>
    </van-overlay>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import style from '@/styles/variable.scss'
  // import { settings } from '@/config'
  import { dateFormat } from '@/utils/time'
  import { money_filter } from '@/utils/money'
  import { cancelBill } from '@/api/beePal'
  import { copyText, getUserHead } from '@/utils/index'
  import { Button, Cell, Checkbox, Circle, Loading, Overlay } from 'vant'
  import BuyModeAction from '../components/buyModeAction.vue'
  import { mapActions, mapGetters } from 'vuex'
  import myUpload from '@/components/vue-image-upload'

  // const regex = /.*csrftoken=([^;.]*).*$/
  export default {
    name: 'Payment',
    components: {
      myHead,
      BuyModeAction,
      [Circle.name]: Circle,
      [Cell.name]: Cell,
      [Button.name]: Button,
      [Checkbox.name]: Checkbox,
      [Loading.name]: Loading,
      [Overlay.name]: Overlay,
      myUpload,
    },
    filters: {
      dateFormat,
      money_filter,
    },
    data() {
      return {
        // datas: this.$route.params.datas || {},
        circle: null,
        method: 0,
        cancelShow: false,
        cancelChecked: null,
        cancel: this.$route.params.cancel || false,
        methodMap: require('../config').supportTrans,
        loading: true,
        show: false,
        style,
        lang: {
          cn: 'zh',
          en: 'en',
          tw: 'zh-tw',
        }
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
      isUploadCertificate() {
        return this.datas.status === 1
      }
    },
    watch: {
      datas(newv, oldv) {
        if (!newv) {
          this.$router.push('/deal')
        } else {
          this.loading = false
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
      this.$myConsole.log('payment datas', this.datas)
      if (!this.datas) this.$router.back()
    },
    methods: {
      ...mapActions('BeePal', ['AC_UPDATEORDER', 'AC_REMOVEORDER']),
      getUserHead,
      copyText(controller) {
        copyText(controller, () => {
          this.$toast(this.$t('beePal.payment.copySuccess'))
        })
      },
      quit() {
        // 取消订单
        cancelBill(this.datas.bill_no)
          .then(res => {
            if (res.code === 0) {
              this.cancel = true
              this.AC_REMOVEORDER(res.data.id) // 2021.08.19 配合新API，資料放res.data裡
              this.$notify({
                message: this.$t('beePal.payment.canceled'),
                color: '#ffffff',
                background: '#2A2C38CC',
                className: 'cancel',
                duration: '1000',
              })
            } else if (this.$t(`errorCode.${res.code}`)) {
              this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('base.unknownErr'))
            }
          })
          .catch(err => {
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
      confirm() {
        const datas = this.datas
        datas.myStatus = 0
        datas.method = this.method
        this.AC_UPDATEORDER(datas)
        this.$router.push({
          name: 'payfor',
          params: {
            orderid: this.datas.id,
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

  .payment {
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
    padding: 15px 0 50px;
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
      margin-top: 17px;
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

    .certificate-uploaded {
      cursor: default;
    }

    .total {
      .value {
        font-size: 18px;
        color: $labelColor13;
      }
    }
  }

  .rickname {
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    border-bottom: 0.5px solid $BorderColor4;

    .value {
      font-size: 16px;
      font-weight: bold;

      img {
        margin-right: 5px;
        border-radius: 100%;
      }
    }
  }

  .methods {
    border-bottom: 0.5px solid $BorderColor4;
    margin-bottom: 20px;

    .van-cell {
      padding: 15px 0;
      font-size: 14px;

      .van-cell__value {
        color: $labelColor1;

        .box {
          width: fit-content;
          margin-left: auto;
        }

        img {
          max-height: 24px;
          max-width: 28px;
          height: auto;
          width: auto;
        }
      }
    }
  }

  .btnGroup {
    margin-top: auto;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    .cancel {
      color: $labelColor20;
      width: 100px;
      margin-right: 12px;
      border: 1px solid $cellBorderColor;
      border-radius: 6px;
    }

    .appeal {
      color: $labelColor20;
      width: 100%;
      margin-right: 0px;
      border: 1px solid $cellBorderColor;
      border-radius: 6px;
    }

    .confirm {
      border: none;
      background: $linearBgColor-03;
      color: $cardColor;
      border-radius: 6px;
      flex-grow: 1;
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
