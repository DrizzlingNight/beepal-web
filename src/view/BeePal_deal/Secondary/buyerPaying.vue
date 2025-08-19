<template>
  <div class="payment">
    <my-head border></my-head>
    <div v-if="datas" class="main-content">
      <div class="head">
        <template v-if="haveReceived">
          <div class="left">
            <div class="title">{{ $t('beePal.lastLap.success') }}</div>
            <div class="timeRemaining">
              <span>{{
                $t('beePal.waiting.successTip', [
                  Number(datas.amount),
                  datas.coin.name,
                ])
              }}</span>
            </div>
          </div>
          <svg-icon
            class-name="confirmed ft65"
            icon-class="confirmed"
          ></svg-icon>
        </template>
        <template v-else-if="received">
          <div class="left">
            <div class="title">{{ $t('beePal.waiting.title2') }}</div>
            <div class="timeRemaining">
              <span>{{ $t('beePal.waiting.tip2') }}</span>
            </div>
          </div>
        </template>
        <template v-else-if="cancel">
          <div class="left">
            <div class="title">{{ $t('beePal.payment.dealCanceled') }}</div>
            <div class="timeRemaining">
              <span>{{ $t('beePal.payment.cancelTip') }}</span>
            </div>
          </div>
          <svg-icon class-name="canceled ft65" icon-class="canceled"></svg-icon>
        </template>
        <template v-else>
          <div class="left">
            <div class="title">{{ $t('beePal.waiting.title1') }}</div>
            <div class="timeRemaining">
              <span>{{ $t('beePal.lastLap.tip') }}</span>
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
        </template>
      </div>
      <div class="detail">
        <div class="flex row-v-c">
          <img
            :src="`/static/img/coins/BeePal/${datas.coin.code}.png`"
            width="24"
          />
          <span class="title">{{
            $t('beePal.deal.sellCoin', [datas.coin.name])
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
            <span>{{ Number(datas.amount) }}</span>
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
      </div>
      <div class="buyer-detail">
        <div class="rickname">
          <div class="flex row-v-c row-between">
            <div>{{ $t('beePal.waiting.buyer') }}</div>
            <div class="value flex row-v-c">
              <img :src="getUserHead(datas.buyer.nickname)" width="24"/>
              <span>{{ datas.buyer.nickname || $t('base.noNicknameUser') }}</span>
            </div>
          </div>
        </div>
        <div class="realname flex row-v-c row-between mt10">
          <div>{{ $t('beePal.waiting.buyerRealname') }}</div>
          <div class="value flex row-v-c">
            <span>{{ datas.buyer.username }}</span>
          </div>
        </div>
        <div v-if="datas.status !== 1" class="certificate">
          <div>{{ $t('beePal.payment.certificate') }}</div>
          <div class="value flex row-v-c">
            <van-uploader v-if="certificate" v-model="certificate" :deletable="false" max-count="1" image-fit="contain" class="image"/>
            <p v-else>{{ $t('base.empty') }}</p>
          </div>
        </div>
        <div v-if="datas.payment" class="methods">
          <van-cell :title="$t('beePal.payment.method')">
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  {{ $t('beePal.payment.' + methodMap[datas.payment.type]) }}
                </div>
                <img
                  :src="
                    require('@/assets/img/' +
                      methodMap[datas.payment.type] +
                      '.png')
                  "
                />
              </div>
            </template>
          </van-cell>
        </div>
      </div>
      <div v-if="!cancel && !haveReceived" class="btnGroup">
        <van-button v-if="received" class="cancel" @click="gotoAppeal">{{
          $t('beePal.lastLap.appeal')
          }}
        </van-button>
        <van-button
          :class="{ canClick: received }"
          :disabled="!received"
          class="confirm"
          @click="haveReceiveShow = true"
        >{{ $t('beePal.waiting.confirm') }}
        </van-button
        >
      </div>
      <van-dialog
        v-model="haveReceiveShow"
        :title="$t('beePal.waiting.modal1')"
        :cancel-button-text="$t('beePal.deal.cancel')"
        :confirm-button-text="$t('beePal.transfer.confirm')"
        :class-name="check ? 'ensure' : ''"
        show-cancel-button
        @cancel="check = null"
        @confirm="permit"
      >
        <div class="mt20">
          <div class="redTip">{{ $t('beePal.waiting.content1') }}</div>
          <!-- <div class="mt5 tip">{{ $t('beePal.waiting.check1') }}</div> -->
        </div>
        <div class="mt20 mb10">
          <van-checkbox v-model="check" name="cancel">{{
            $t('beePal.waiting.check1')
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
  import { dateFormat } from '@/utils/time'
  import { money_filter } from '@/utils/money'
  import { copyText, getUserHead } from '@/utils/index'
  import { finishBill } from '@/api/beePal'
  import { Button, Cell, Checkbox, Circle, Loading, Overlay, Uploader } from 'vant'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Waiting',
    components: {
      myHead,
      [Circle.name]: Circle,
      [Cell.name]: Cell,
      [Button.name]: Button,
      [Checkbox.name]: Checkbox,
      [Loading.name]: Loading,
      [Overlay.name]: Overlay,
      [Uploader.name]: Uploader,
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
        received: this.$route.params.received || false,
        haveReceiveShow: false,
        check: null,
        haveReceived: this.$route.params.haveReceived || false,
        cancel: this.$route.params.cancel || false,
        methodMap: require('../config').supportTrans,
        loading: true,
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
          this.datas &&
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
      isTrading() {
        return this.datas.myStatus === 0
      }
    },
    watch: {
      datas: {
        handler(newv, oldv) {
          if (!newv) {
            this.$router.push('/deal')
          } else {
            this.loading = false
             if (newv.status === 5) {
              this.received = true
            } else if (newv.status === 3) {
              this.$notify({
                message: this.$t('beePal.payment.canceled'),
                color: '#ffffff',
                background: '#2A2C38CC',
                className: 'cancel',
                duration: '1000',
              })
              this.received = false
              this.haveReceived = false
              this.cancel = true
            } else if (newv.myStatus === 1) {
              this.received = true
            }
          }
        },
      },
      'datas.time'(newV, oldV) {
        // console.log(`oldV ${oldV} newV ${newV}`)
        if (this.datas.status === 1 && newV <= 0) {
          this.$router.push({ name: 'deal' })
        }
      },
    },
    created() {
      this.$myConsole.log('buyerPaying datas', this.datas)
      if (!this.datas) this.$router.push('deal')
      if (this.datas.status === 5) this.received = true
    },
    methods: {
      ...mapActions('BeePal', ['AC_REMOVEORDER', 'AC_UPDATEORDER', 'AC_UPDATEWALLET']),
      getUserHead,
      copyText(controller) {
        copyText(controller, () => {
          this.$toast(this.$t('beePal.payment.copySuccess'))
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
      permit() {
        this.haveReceived = true
        finishBill(this.datas.bill_no).then(res => {
          if (res.code === 0) {
            res.myStatus = 5
            res.payment = res.payment && res.payment[0]
            this.AC_UPDATEORDER(res)
            setTimeout(() => {
              this.AC_REMOVEORDER(res.id)
            })
            this.AC_UPDATEWALLET()
            this.$notify({
              message: this.$t('beePal.waiting.permitThrough'),
              color: '#ffffff',
              background: '#2A2C38CC',
              className: 'success',
              duration: '1000',
            })
          } else if (this.$t(`errorCode.${res.code}`)) {
              this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('base.unknownErr'))
          }
        }).catch(err => {
          console.log('permit-err', err)
          this.$toast(this.$t('base.unknownErr'))
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
    height: 70px;

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
    .orderID {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 17px;
    }

    .total {
      .value {
        font-size: 18px;
        color: $labelColor13;
      }
    }
  }
  .buyer-detail {
    .rickname {
      padding: 15px 0;
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

    .realname,
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

    .confirm {
      border: none;
      background: $linearBgColor-06;
      color: $cardColor;
      border-radius: 6px;
      flex-grow: 1;
      opacity: 1;

      &.canClick {
        background: $linearBgColor-04;
      }
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
