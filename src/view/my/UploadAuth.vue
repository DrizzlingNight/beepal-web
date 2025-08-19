<template>
  <div class="upload">
    <my-head :title="titleHandler()" border></my-head>
    <div :class="step !== -1 && step !== 0 ? '' : 'bg-white'" class="description">
      <p v-if="next[1] && step === 1">{{ $t('my.advanceAuth.description_bill') }}</p>
      <p v-if="next[2] && step === 2">{{ $t('my.advanceAuth.description_bank') }}</p>
    </div>
    <div class="main-content">
      <div v-if="next[2] && step === 2" class="bankNumber">
        <div class="title">
          <span>{{ $t('my.advanceAuth.bankNumber') }}</span>
        </div>
        <van-field
          v-model.trim="bankNumber"
          :placeholder="$t('my.advanceAuth.bankNumber_placeholder')"
          :border="true"
        />
      </div>
      <div class="upload-box">
        <div class="title">
          {{ $t('my.advanceAuth.tip1') }}
        </div>
        <!-- 上傳身分證 -->
        <div v-if="type === 'IDCard' && !next[0]" class="idCard-uploader">
          <div>
            <van-uploader ref="idcard_front_uploader" v-model="idcard_front" :deletable="false"
                          :upload-icon="require('@/assets/img/idcard_front_taiwan.png')" max-count="1" image-fit="contain"
            ></van-uploader>
            <van-button @click="uploader('idcard_front')">
              {{ idcard_front.length ? $t('my.advanceAuth.reupload') : $t('my.advanceAuth.upload') + ' ' +
              $t('my.advanceAuth.frontSide') }}
            </van-button>
            <van-uploader ref="idcard_back_uploader" v-model="idcard_back" :deletable="false"
                          :upload-icon="require('@/assets/img/idcard_back_taiwan.png')" max-count="1" image-fit="contain"
                          class="mt20"
            ></van-uploader>
            <van-button @click="uploader('idcard_back')">{{
              idcard_back.length ? $t('my.advanceAuth.reupload') : $t('my.advanceAuth.upload') + ' ' +
              $t('my.advanceAuth.backSide') }}
            </van-button>
          </div>
        </div>
        <!-- 上傳護照 -->
        <div v-if="type === 'passport' && !next[0]" class="passport-uploader">
          <van-uploader ref="passport_uploader" v-model="passport" :deletable="false"
                        :upload-icon="require('@/assets/img/passport.png')" max-count="1" image-fit="contain"
                        class="mt20"
          ></van-uploader>
          <van-button @click="uploader('passport')">{{ passport.length ? $t('my.advanceAuth.reupload') :
            $t('my.advanceAuth.upload2') }}
          </van-button>
        </div>
        <!-- 上傳手持證件照 -->
        <div v-if="next[0] && step === 0" class="in-hand-uploader">
          <van-uploader ref="in_hand_uploader" v-model="in_hand" :deletable="false"
                        :upload-icon="require('@/assets/img/in_hand.png')" max-count="1" image-fit="contain"
                        class="mt20"
          ></van-uploader>
          <van-button @click="uploader('in_hand')">{{ in_hand.length ? $t('my.advanceAuth.reupload') :
            $t('my.advanceAuth.title4') }}
          </van-button>
        </div>
        <!-- 上傳水電費帳單 -->
        <div v-if="next[1] && step === 1" class="bill-uploader">
          <van-uploader ref="bill_uploader" v-model="bill" :deletable="false"
                        :upload-icon="require('@/assets/img/bill_or_bank.png')" max-count="1" image-fit="contain"
                        class="mt20"
          ></van-uploader>
          <van-button @click="uploader('bill')">{{ bill.length ? $t('my.advanceAuth.reupload') :
            `${$t('my.advanceAuth.upload')} ${$t('my.advanceAuth.bill')}` }}
          </van-button>
        </div>
        <!-- 上傳銀行存摺 -->
        <div v-if="next[2] && step === 2" class="bank-uploader">
          <van-uploader ref="bank_uploader" v-model="bank" :deletable="false"
                        :upload-icon="require('@/assets/img/bill_or_bank.png')" max-count="1" image-fit="contain"
                        class="mt20"
          ></van-uploader>
          <van-button @click="uploader('bank')">{{ bank.length ? $t('my.advanceAuth.reupload') :
            `${$t('my.advanceAuth.upload')} ${$t('my.advanceAuth.bank')}` }}
          </van-button>
        </div>
      </div>
      <ul class="tipList">
        <li v-if="next[2] && step === 2">{{ $t('my.advanceAuth.tip_bank_1') }}</li>
        <li>{{ $t('my.advanceAuth.tip2') }}</li>
        <li v-if="step === -1 || step === 0">{{ $t('my.advanceAuth.tip3', [type === 'IDCard'? $t('my.auth.certificate_1') : $t('my.auth.certificate_2')])
          }}
        </li>
        <li v-if="next[1] && step === 1">{{ $t('my.advanceAuth.tip3', [$t('my.advanceAuth.foreignAddress')]) }}</li>
        <li v-if="next[2] && step === 2">{{ $t('my.advanceAuth.tip3', [$t('my.advanceAuth.foreignAddress')]) }}</li>
        <li v-if="step === -1 || step === 0">{{ $t('my.advanceAuth.tip4') }}</li>
        <li v-if="next[1] && step === 1">{{ $t('my.advanceAuth.tip_bill') }}</li>
        <li v-if="next[2] && step === 2">{{ $t('my.advanceAuth.tip_bank_2') }}</li>
      </ul>
      <van-button :disabled="!canGoNext" :class="{notGo: !canGoNext, step1: step === -1, step2: step === 0, step3: step === 1, step4: step === 2, }" class="next" @click="goNext">{{
        $t('my.advanceAuth.next') }}
      </van-button>
    </div>
    <van-overlay :show="loading">
      <van-loading v-show="!success"></van-loading>
    </van-overlay>
  </div>
</template>

<script>
  import { createAuth } from '@/api'
  import myHead from '@/components/head/Normal_head'
  import { Button, Field, Loading, Overlay, Uploader } from 'vant'
  import { mapActions, mapGetters } from 'vuex'
  import * as imageConversion from 'image-conversion'

  export default {
    name: 'UploadAuth',
    components: {
      myHead,
      [Uploader.name]: Uploader,
      [Button.name]: Button,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
      [Field.name]: Field,
    },
    data() {
      return {
        type: this.$route.params.type,
        next: [false, false, false],
        step: -1,
        idcard_front: [],
        idcard_back: [],
        passport: [],
        in_hand: [],
        bill: [],
        bank: [],
        bankNumber: null,
        loading: false,
        success: false,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      canGoNext() {
        const type = this.type
        this.$myConsole.log(this.next[0], this.step)
        if (this.next[0] && this.step === 0) {
          if (this.in_hand.length) return true
          else return false
        } else if (this.next[1] && this.step === 1) {
          if (this.bill.length) return true
          else return false
        } else if (this.next[2] && this.step === 2) {
          if (this.bank.length && this.bankNumber) return true
          else return false
        } else if (type === 'IDCard' && this.idcard_front.length && this.idcard_back.length) {
          return true
        } else if (type === 'passport' && this.passport.length) {
          return true
        } else {
          return false
        }
      },
      needBill() {
        return this.VG__userInfo.country !== 'TW'
      },
      needBank() {
        return this.VG__userInfo.country === 'TW'
      },
    },
    created() {
      if (this.type !== 'IDCard' && this.type !== 'passport') this.$router.push('/advanceAuth')
      if (this.VG__userInfo && this.VG__userInfo.certification) {
        const certificate = this.VG__userInfo.certification
        if (!certificate.base_certification) {
          this.$toast(this.$t('my.advanceAuth.tip6'))
          this.loading = true
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        } else if (!certificate.high_certification && certificate.base_certification && certificate.status === 0) {
          this.loading = true
          this.$router.push('/onprogress')
        } else if (certificate.high_certification) {
          this.$toast(this.$t('my.auth.authSuccess'))
          this.loading = true
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        }
      }
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo']),
      titleHandler() {
        let title = null
        const nextTitleMap = {
          0: this.$t('my.advanceAuth.title4'),
          1: this.$t('my.advanceAuth.title_bill'),
          2: this.$t('my.advanceAuth.title_bank'),
        }

        this.next.forEach((item, index) => {
          if (item) {
            title = nextTitleMap[index]
          }
        })

        if (!title) {
          if (this.type === 'IDCard') {
            title = this.$t('my.advanceAuth.title2')
          } else if (this.type === 'passport') {
            title = this.$t('my.advanceAuth.title3')
          } else {
            title = ''
          }
        }
        return title
      },
      uploader(controller) {
        if (this[controller].length) this[controller] = []
        setTimeout(() => {
          this.$refs[controller + '_uploader'].chooseFile()
        })
      },
      goNext() {
        const id = this.VG__userInfo.id
        let isComplete = true
        if (this.step === -1) isComplete = false
        if (this.needBill && !this.next[1]) isComplete = false
        if (this.needBank && !this.next[2]) isComplete = false

        if (isComplete) {
          this.$dialog
            .confirm({
              message: this.$t('my.advanceAuth.tip5'),
              className: 'dialog',
              confirmButtonText: this.$t('my.dialog_3'),
              cancelButtonText: this.$t('beePal.deal.cancel'),
            })
            .then(async() => {
              this.loading = true
              const params = {
                kyc_type: this.type === 'IDCard' ? 1 : this.type === 'passport' ? 2 : '',
                kyc_hand_img: await this.compressImage(this.in_hand[0].file),
              }
              // console.log('this.type', this.type)
              // console.log('this.in_hand.file,', this.in_hand)
              // console.log('this.idcard_front,', this.idcard_front)
              // console.log('this.idcard_back,', this.idcard_back)
              if (this.type === 'IDCard') {
                params.kyc_facade_img = await this.compressImage(this.idcard_front[0].file)
                params.kyc_back_img = await this.compressImage(this.idcard_back[0].file)
              } else if (this.type === 'passport') {
                params.kyc_facade_img = await this.compressImage(this.passport[0].file)
              }

              if (this.needBill) params.utility_bill_img = await this.compressImage(this.bill[0].file)
              if (this.needBank) {
                params.bank_number = this.bankNumber
                params.bank_card_img = await this.compressImage(this.bank[0].file)
              }

              // console.log('params', params)

              // 手機測試用
              // this.$dialog
              // .confirm({
              //   message: `params：${params.kyc_hand_img},${params.kyc_facade_img},${params.kyc_back_img},${params.utility_bill_img},${params.bank_card_img}`,
              //   className: 'dialog',
              //   confirmButtonText: this.$t('my.dialog_3'),
              //   cancelButtonText: this.$t('beePal.deal.cancel'),
              // }).then(
              //   // do nothing
              // )

              // 轉換成FormData格式
              const form_data = new FormData()
              for (const key in params) {
                  form_data.append(key, params[key]);
              }

              // console.log('params', params)

              createAuth(form_data, 'patch', id).then(res => {
                if (res.code === 0) {
                  this.success = true
                  this.$toast.success(this.$t('my.advanceAuth.success'))
                  this.VA__updateUserInfo()
                  setTimeout(() => {
                    this.$router.push('/onprogress')
                  }, 1000)
                } else if (this.$t(`errorCode.${res.code}`)) {
                  this.$toast(this.$t(`errorCode.${res.code}`))
                } else {
                  this.$toast.fail(this.$t('my.advanceAuth.fail'))
                  // this.$toast.fail(`res:${res}`)
                }
                this.loading = false
              }).catch(err => {
                console.log('createAuth-err', err)
                this.$toast.fail(this.$t('my.advanceAuth.fail'))
                // this.$toast.fail(`err:${err}`)
                this.loading = false
              })
            })
        } else {
          if (this.step === 0 && !this.needBill) {
            this.step = 2
            this.next[1] = true
          } else {
            this.step = this.step + 1
          }

          this.next[this.step] = true
          this.$forceUpdate()

          // 捲動視窗到最上面
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          })
          // console.log(this.step, this.next[this.step])
        }
      },
      afterRead(file) {
        // 此时可以自行将文件上传至服务器
        console.log('file', file);
      },
      // 壓縮圖片，maxSize: 單位Byte, toSize: 單位KB
      async compressImage(file, maxSize = 1024 * 1024 * 5, toSize = 4096) {
        if (file.size >= maxSize) {
          const resBlob = await imageConversion.compressAccurately(file, toSize);
          const resFile = new window.File(
            [resBlob],
            file.name,
            { type: file.type },
          )
          return resFile
        } else {
          return file
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .upload {
    height: 100%;

    .description {

      margin-top: 57px;
      margin-bottom: 11.5px;

      p {
        font-size: 12px;
        color: #FFC006;
        text-align: center;
      }
    }

    .bg-white {
      background: $pageBgColor;
      margin-top: 51px;
      margin-bottom: 0px;
    }
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    background: $pageBgColor;
    /*padding-bottom: 60px;*/
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 0px;

    .bankNumber {
      .title {
        span {
          font-size: 13px;
          font-weight: bold;
        }
      }

      .van-field {
        font-size: 16px;
        padding-left: 0px;
        border-bottom: 1px solid $BorderColor3;
      }
    }
  }

  .upload-box {
    .title {
      font-size: 13px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }

  .van-button {
    width: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: none;
    height: 50px;
    font-size: 16px;
    background: $cardBgColor;
    color: $cardColor;
  }

  ::v-deep .van-uploader {
    width: 100%;
    height: auto;
    display: block;

    input {
      pointer-events: none;
    }

    .van-uploader__wrapper {
      opacity: 1;
    }

    .van-uploader__upload, .van-uploader__preview {
      width: 100%;
      height: 180px;
      margin: 0;

      &:active {
        background: #f7f8fa;
      }
    }

    .van-uploader__preview-image {
      width: 100%;
      height: 100%;
    }

    .van-uploader__upload-icon {
      font-size: 200px;
    }
  }

  .tipList {
    font-size: 12px;
    color: rgba($labelColor1, 0.6);
    list-style: inside;

    li {
      padding-left: 3px;
      margin-top: 2px;

      &:first-child {
        margin-top: 10px;
      }

      &:last-child {
        margin-bottom: 20px;
      }
    }
  }

  .next {
    border-radius: 8px;
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    opacity: 1;
    height: 45px;

    &.notGo {
      background: $linearBgColor-06
    }

    &.step1 {
      margin-bottom: 30px;
    }

    &.step2 {
      margin-bottom: 80px;
    }

    &.step3 {
      margin-bottom: 110px;
    }

    &.step4 {
      margin-bottom: 110px;
    }
  }
</style>
