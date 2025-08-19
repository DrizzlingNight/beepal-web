<template>
  <div class="channelOption">
    <my-head :title="$route.query.edit ?
    $t('my.channelOption.modify', [$t(`beePal.payment.${methods[opt]}`)]) :
    $t('my.channelOption.title', [$t(`beePal.payment.${methods[opt]}`)])" border
             @goback="$route.query.edit ? $router.push('/otcPayment') : $router.push('/addChannel')">
      <template #right>
        <div v-if="$route.query.edit" class="delete" @click="deleteChannel">{{ $t('my.payAccount.remove') }}</div>
      </template>
    </my-head>
    <div class="main-content">
      <template v-for="item in fields">
        <div v-if="!item.opt || item.opt === opt || (opt != 'Bank' && item.opt === 'Other')" :key="item.field"
             class="field">
          <div class="title">
            {{ $t(item.field) }}
            <span v-if="!item.required">({{ $t('my.channelOption.optional') }})</span>
          </div>
          <template v-if="!item.uploader">
            <van-field
              v-model="formData[item.params]"
              :placeholder="$t(item.placeholder)"
              :error-message="errorMsg[item.params]"
              :disabled="item.disabled"
              @focus="myFocus(item)">
            </van-field>
          </template>
          <template v-else>
            <!-- <vue-qrcode v-if="formData.qrcodeURL" :value="formData.qrcodeURL"/> -->
            <van-uploader
              v-model="formData.file"
              preview-size="140"
              max-count="1"
              max-size="500 * 1024"
              class="uploader"/>
          </template>
        </div>
      </template>
      <van-cell v-show="isDefaultShow" :title="$t('my.channelOption.setAsDefalut')" :border="false">
        <template #default>
          <van-switch v-model="formData.isDefault" active-color="#009A40" inactive-color="#A8A8B3" class="default-switch"/>
        </template>
      </van-cell>
      <van-button :disabled="noClick" class="save" @click="save">{{ $t('my.channelOption.save') }}</van-button>
    </div>
    <van-overlay :show="show">
    </van-overlay>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import VueQrcode from 'vue-qrcode'
  import { mapGetters } from 'vuex'
  import { Button, Field, Overlay, Uploader, Switch, Cell } from 'vant'
  import { createChannel, deleteChannelById, updateChannel } from '@/api'
  import isURL from 'is-url'

  export default {
    name: 'ChannelOption',
    components: {
      myHead,
      VueQrcode,
      [Field.name]: Field,
      [Uploader.name]: Uploader,
      [Button.name]: Button,
      [Overlay.name]: Overlay,
      [Switch.name]: Switch,
      [Cell.name]: Cell,
    },
    data() {
      return {
        methods: {
          Bank: 'bank',
          Alipay: 'zfb',
          Wechat: 'wexin',
        },
        formData: {
          name: null,
          bank: null,
          account: null,
          address: null,
          file: [],
          qrcodeURL: null,
          isDefault: false,
        },
        errorMsg: {
          name: null,
          bank: null,
          account: null,
          address: null,
        },
        fields: [
          {
            field: 'my.payAccount.name',
            placeholder: 'my.payAccount.placeholder_1',
            params: 'name',
            required: true,
            disabled: false, // 2021.09.11 這邊（姓名欄位）不知道為什麼原本要下disabled，先把它打開，有問題再調
          },
          {
            opt: 'Bank',
            field: 'my.payAccount.bank_name',
            placeholder: 'my.payAccount.placeholder_2',
            params: 'bank',
            required: true,
          },
          {
            opt: 'Bank',
            field: 'my.payAccount.account_number',
            placeholder: 'my.payAccount.placeholder_4',
            params: 'account', required: true,
          },
          {
            opt: 'Bank',
            field: 'my.payAccount.bank_address',
            placeholder: 'my.payAccount.placeholder_3',
            params: 'address',
            required: false,
          },
          { opt: 'Other', field: 'register.title_2', placeholder: 'login.input_1', params: 'account', required: true },
          { opt: 'Other', field: 'my.channelOption.qrcode', uploader: true },
        ],
        frame: null,
        show: false,
      }
    },
    computed: {
      ...mapGetters(['VG__userChannel', 'VG__userInfo']),
      editChannel() {
        if (this.$route.query.edit) {
          const channel = this.VG__userChannel.find(item => item.id === this.$route.query.edit)
          return channel
        }
      },
      opt() {
        return this.$route.params.opt
      },
      noClick() {
        const opt = this.$route.params.opt
        const keys = Object.keys(this.formData)
        const exceptionKeys = {
          Bank: ['address', 'file', 'qrcodeURL'],
          Alipay: ['bank', 'address', 'file', 'qrcodeURL'],
          Wechat: ['bank', 'address', 'file', 'qrcodeURL'],
        }
        let result = false
        keys.forEach(key => {
          // console.log('this.formData[key]', this.formData[key])
          if (!exceptionKeys[opt].includes(key) && !String(this.formData[key])) {
            result = true
          }
        })
        return result
      },
      isEdit() {
        return Boolean(this.$route.query.edit)
      },
      isDefaultShow() {
        return this.isEdit || this.opt === 'Bank'
      },
    },
    watch: {
      '$route.query.edit': {
        handler(newv) {
          const channel = this.editChannel
          if (newv && !channel) this.$router.replace('/otcPayment')
          else if (channel) {
            this.formData = {
              name: channel.account_name,
              bank: channel.bank_name,
              account: channel.account_number,
              address: channel.bank_address,
              file: channel.qr_code ? [{ url: channel.qr_code }] : [],
              isDefault: channel.is_default,
            }
          }
        },
        immediate: true,
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.createFrame()
        this.qrReader.init()
        // 2021.11.01 這裡會把後端回傳的帳戶姓名蓋掉，所以先註解掉
        // if (this.VG__userInfo && this.VG__userInfo.certification) {
        //   this.formData.name = [this.VG__userInfo.certification.kyc_last_name,
        //     this.VG__userInfo.certification.kyc_mid_name, this.VG__userInfo.certification.kyc_first_name].join('')
        // }
        if (!this.VG__userInfo.certification || !this.VG__userInfo.certification.base_certification) {
          this.show = true
          this.$toast(this.$t('my.advanceAuth.tip6'))
          setTimeout(() => {
            this.$router.push('/my/kyc')
          }, 1000)
        }
      })
    },
    beforeDestroy() {
      this.qrReader.decoder.terminate()
    },
    methods: {
      deleteChannel() {
        this.$dialog
          .confirm({
            message: this.$t('my.payAccount.dialog_1'),
            className: 'dialog',
            confirmButtonText: this.$t('my.payAccount.remove'),
            cancelButtonText: this.$t('beePal.deal.cancel'),
          })
          .then(() => {
            deleteChannelById(this.$route.query.edit).then(res => {
              if (res.code === 0) {
                this.$notify({
                  message: this.$t('my.payAccount.removeSuccess'),
                  className: 'success',
                  color: '#ffffff',
                  background: '#2A2C38CC',
                  duration: '1000',
                })
                setTimeout(() => {
                  this.$router.replace('/otcPayment')
                }, 1000)
              } else if (res.code === 20404) {
                this.$dialog
                .confirm({
                  message: this.$t('my.channelOption.needChangeDefault'),
                  className: 'dialog',
                  confirmButtonText: this.$t('base.goChange'),
                  cancelButtonText: this.$t('base.cancel'),
                })
                .then(() => {
                  this.$router.push('/otcPayment')
                })
              } else if (this.$t(`errorCode.${res.code}`)) {
                  this.$toast(this.$t(`errorCode.${res.code}`))
              } else {
                this.$toast(this.$t('base.unknownErr'))
              }
            }).catch(err => {
              console.log('deleteChannel-err', err)
              this.$toast(this.$t('base.unknownErr'))
            })
          })
      },
      myFocus(item) {
        this.errorMsg[item.params] = ''
      },
      createFrame() {
        this.frame = document.createElement('img')
        this.frame.src = ''
        this.frame.id = 'frame'
        document.querySelector('.channelOption').appendChild(this.frame)
      },
      scan(forSelectedPhotos = false) {
        this.qrReader.scan(result => {
          try {
            if (isURL(result)) {
              this.formData.qrcodeURL = result
              this.addChannel()
            } else {
              this.$toast(this.$t('my.channelOption.Invalid'))
              this.formData.file[0].status = 'failed'
              return
            }
          } catch (e) {
            console.log(e)
          }
        }, forSelectedPhotos)
      },
      checkInput() {
        const isBank = (this.opt === 'Bank')
        const formData = this.formData
        const fields = this.fields
        let flag = true
        Object.keys(formData).forEach(key => {
          const value = formData[key]
          const fieldIn = fields.some(field => {
            if (field.params === key &&
              ((isBank && field.opt === 'Bank') || (!isBank && field.opt === 'Other') || !field.opt) &&
              field.required) {
              return true
            }
          })
          if (!value && fieldIn) {
            this.errorMsg[key] = this.$t('my.channelOption.notNull')
            flag = false
          }
        })
        return flag
      },
      addChannel() {
        let type = null
        switch (this.opt) {
          case 'Bank':
            type = 0
            break
          case 'Alipay':
            type = 1
            break
          case 'Wechat':
            type = 2
            break
        }
        let params = {}
        let optParams = {}
        if (type === 0) {
          optParams = {
            account_name: this.formData.name,
            account_number: this.formData.account,
            bank_name: this.formData.bank,
            bank_address: this.formData.address,
            is_default: this.formData.isDefault,
          }
        } else {
          if (this.formData.qrcodeURL) {
            optParams = {
              account_name: this.formData.name,
              account_number: this.formData.account,
              bank_name: this.formData.bank,
              qr_code: this.formData.file[0].file,
              is_default: this.isEdit ? this.formData.isDefault : true, // 2021.09.14 目前支付寶/微信只能有一個，所以預設"創建時"就是默認
            }
          } else {
            optParams = {
              account_name: this.formData.name,
              account_number: this.formData.account,
              bank_name: this.formData.bank,
              qr_code: new File([], ""),
              is_default: this.isEdit ? this.formData.isDefault : true, // 2021.09.14 目前支付寶/微信只能有一個，所以預設"創建時"就是默認
            }
          }
        }
        params = { type, ...optParams }

        // 轉換成FormData格式
        const form_data = new FormData()
        for (const key in params) {
            form_data.append(key, params[key]);
        }

        if (this.$route.query.edit) {
          updateChannel(this.$route.query.edit, form_data).then(res => {
            if (res.code === 0) {
              this.$notify({
                message: this.$t('tip.savesuccess'),
                className: 'success',
                color: '#ffffff',
                background: '#2A2C38CC',
                duration: '1000',
              })
              if (this.formData.file.length) {
                this.formData.file[0].status = ''
              }
              this.$router.push('/otcPayment')
            } else if (this.$t(`errorCode.${res.code}`)) {
                this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('base.unknownErr'))
            }
          }).catch(err => {
            console.log('updateChannel-err', err)
            this.$toast(this.$t('tip.savefail'))
          })
        } else {
          createChannel(form_data).then(res => {
            if (res.code === 0) {
              this.$notify({
                message: this.$t('tip.savesuccess'),
                className: 'success',
                color: '#ffffff',
                background: '#2A2C38CC',
                duration: '1000',
              })
              Object.assign(this.$data, this.$options.data())
              this.$router.push('/otcPayment')
            } else if (res.code === 20402) {
              this.$toast(this.$t('my.channelOption.addFail'))
              if (this.formData.file.length) {
                this.formData.file[0].status = 'failed'
              }
            } else if (this.$t(`errorCode.${res.code}`)) {
                this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.$toast(this.$t('base.unknownErr'))
            }
          }).catch(err => {
            console.log('createChannel-err', err)
            this.$toast(this.$t('my.tip.addFail'))
          })
        }
      },
      save() {
        if (!this.checkInput()) return
        if (this.formData.file[0] && this.formData.file[0].file) {
          this.formData.file[0].status = 'uploading'
          document.querySelector('#frame').src = URL.createObjectURL(this.formData.file[0].file)
          setTimeout(() => {
            this.scan(true)
          })
        } else {
          this.addChannel()
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "@/styles/variable.scss";

  .channelOption {
    height: 100%;

    ::v-deep #frame {
      display: none;
    }

    .delete {
      font-size: 14px;
      white-space: nowrap;
      transform: translateY(1px);
    }
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    background: $pageBgColor;
    display: flex;
    flex-direction: column;

    .field {
      padding: 0 15px;

      &:first-child {
        margin-top: 10px;
      }

      &:not(:first-child) {
        margin-top: 25px;
      }

      .van-field {
        padding: 10px 0px;

        ::v-deep .van-field__control {
          color: $labelColor1;
          font-size: 16px;
        }

        ::v-deep input::placeholder {
          font-size: 16px;
          color: $labelColor21;
        }
      }

      .title {
        color: $labelColor1;
        font-size: 12px;
      }

      .uploader {
        margin-top: 15px;
      }
    }

    .default-switch {
      width: 54px;
      height: 24px;

      ::v-deep .van-switch__node {
        width: 24px;
        height: 24px;
      }
    }

    .save {
      position: fixed;
      bottom: 6%;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      font-size: 16px;
      border: none;
      background: $linearBgColor-02;
      border-radius: 8px;
      color: $cardColor
    }

    .van-button--disabled {
      background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
    }
  }
</style>
