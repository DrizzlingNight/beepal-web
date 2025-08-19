<template>
  <div class="transfer">
    <my-head
      :title="$t('beePal.transfer.title', [token.coin_name])"
      :border="true"
      @goback="
        $router.push({
          name: 'tokenDetail',
          params: {
            token: token.coin_code,
          },
        })
      "
    >
      <template #right>
        <svg-icon
          icon-class="black_scan"
          class-name="scan"
          @click="$router.push({
            name: 'transferScan',
            params: {
              token: token.coin_code,
            },
          })"
        >
        </svg-icon>
      </template>
    </my-head>
    <div class="main-content">
      <van-form @submit="onSubmit">
        <!-- 收款账号 -->
        <my-field
          :title="$t('beePal.transfer.field1')"
          :placeholder="$t('beePal.transfer.payee')"
          v-model="formData.payee"
          class="mt10 mb10"
          @blur="checkAccount"
        >
          <template #right>
            <svg-icon
              icon-class="new_addresslist"
              class-name="addresslist ml15"
              style="font-size: 22px"
              @click="goRecent"
            >
            </svg-icon>
          </template>
        </my-field>
        <!-- 转出数量 -->
        <div class="transferAmount">
          <div class="flex row-v-c row-between">
            <div class="title">{{ $t('beePal.transfer.field2') }}</div>
            <div class="token">{{ token.coin_name }}</div>
          </div>
          <div class="amountField">
            <van-field
              :border="false"
              :placeholder="$t('beePal.transfer.amount')"
              v-model="formData.amount"
              :disabled="JSON.stringify(token) === '{}'"
              :formatter="(val) => val < 0 ? -val
                            : val.toString().indexOf('.') === val.toString().length - 1 ? val
                            : Number(val)"
              type="number"
            ></van-field>
            <div v-show="formData.amount" class="rate mb10">
              <span class="mr3">{{ coinRate }}</span>
              <span class="ft12">{{ realCurrency }}</span>
            </div>
          </div>
        </div>
        <!-- 余额 -->
        <div class="balance">
          <div class="title">
            {{ $t('beePal.transfer.field3') }}
          </div>
          <div class="flex col row-v-e">
            <div class="walletHave">
              <span class="mr3">{{ balance }}</span>
              <span>{{ token.coin_name }}</span>
            </div>
            <van-tag
              class="tag"
              round
              plain
              @click="formData.amount = (balance - token.withdrawFee) <=0 ? 0 : (balance - token.withdrawFee)"
            >{{ $t('beePal.tokenDetail.all') }}
            </van-tag
            >
          </div>
        </div>
        <!-- 收幣者姓名 -->
        <my-field
          :title="$t('beePal.transfer.name')"
          :placeholder="$t('beePal.transfer.placeholder_name')"
          :tmb="5"
          v-model="formData.name"
          class="name mt10"
        >
        </my-field>
        <!-- 收幣地址資訊 -->
        <my-field
          :title="$t('beePal.transfer.address')"
          :placeholder="$t('beePal.transfer.placeholder_address')"
          v-model="formData.address"
          class="address mt10"
        >
        </my-field>
        <!-- 收幣地址類型 -->
        <my-field
          :title="$t('beePal.transfer.addressType')"
          :readonly="true"
          v-model="addressTypeList[formData.address_type]"
          class="addressType"
          @click="addressTypeShow = true"
        >
        </my-field>
        <!-- 收幣地址類型彈窗 -->
        <my-action-sheet
          v-model="addressTypeShow"
          :title="$t('beePal.transfer.addressType')"
          :list="addressTypeList"
          :select.sync="formData.address_type"
        >
        </my-action-sheet>
        <!-- 提幣用途 -->
        <my-field
          :title="$t('beePal.transfer.purpose')"
          :placeholder="$t('beePal.transfer.placeholder_purpose')"
          :tmb="5"
          v-model="formData.purpose"
          class="purpose mt10"
        >
        </my-field>
        <!-- 备注 -->
        <my-field
          v-if="isEOS"
          :title="$t('beePal.transfer.field4')"
          :placeholder="$t('beePal.transfer.memo')"
          :tips="$t('beePal.transfer.tips')"
          :tmb="5"
          v-model="formData.memo"
          class="memo mt10"
          @blur="checkAccount"
        >
        </my-field>
        <!-- 手续费 -->
        <div v-if="!Lightning" class="serviceCharge mt10">
          <div class="chargeBox">
            <div class="title">{{ $t('beePal.transfer.field5') }}</div>
            <div class="flex col row-v-e">
              <div class="fee">
                <span class="mr3">{{ token.withdrawFee }}</span>
                <span>{{ token.coin_name }}</span>
              </div>
              <div class="rate">
                <span class="mr3">{{ token.withdrawPrice }}</span>
                <span class="ft12">{{ realCurrency }}</span>
              </div>
            </div>
          </div>
          <!-- 到账数量 -->
          <div class="arrivalAmount">
            <div class="title">{{ $t('beePal.transfer.field6') }}</div>
            <div class="amount">
              <span class="mr3">{{ arrivalAmount }}</span>
              <span>{{ token.coin_name }}</span>
            </div>
          </div>
        </div>
        <div class="submitBtn">
          <van-button
            :class="{ canClick: canClick }"
            :disabled="!canClick"
            block
            native-type="submit"
          >
            <svg-icon
              v-if="Lightning"
              class-name="lightning"
              icon-class="lightning"
            ></svg-icon>
            <span>{{
              Lightning
                ? $t('beePal.transfer.lightingTransfer')
                : $t('beePal.transfer.confirm')
            }}</span>
          </van-button>
        </div>
        <div class="announcement">
          <van-checkbox v-model="isRead">
            {{ $t('beePal.transfer.alreadyRead') }}
            <span @click.stop="showAnnouncement">{{ `《${$t('beePal.transfer.announcement')}》` }}</span>
          </van-checkbox>
        </div>
      </van-form>
    </div>
    <van-overlay
      v-if="JSON.stringify(token) === '{}' || onprogress"
      :show="true"
    >
      <van-loading/>
    </van-overlay>
    <transfer-confirm
      v-model="confirmShow"
      :form-data="formData"
      :token="token"
      @toPay="toPay"
    ></transfer-confirm>
    <!-- <security v-model="securityShow" @toPay="toPay"></security> -->
    <!-- <van-overlay v-if="onprogress" :show="true">
      <van-loading />
    </van-overlay> -->
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import myField from '@/components/BeePalComp/myField'
  import myActionSheet from '@/components/BeePalComp/myActionSheet'
  import { Button, Field, Form, Loading, Overlay, Tag, Checkbox } from 'vant'
  import { money_filter } from '@/utils/money'
  import { verifyAccount, coinTransfer } from '@/api/beePal'
  import { settings } from '@/config'
  import TransferConfirm from './components/transferConfirm'
  import Security from '../../BeePal_deal/components/security'
  import coinMixin from '@/mixins/coinMixin'
  import { mapActions, mapGetters } from 'vuex'
  import Storage from '@/utils/storage'

  export default {
    name: 'Transfer',
    components: {
      myHead,
      myField,
      myActionSheet,
      TransferConfirm,
      Security,
      [Form.name]: Form,
      [Field.name]: Field,
      [Tag.name]: Tag,
      [Button.name]: Button,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
      [Checkbox.name]: Checkbox,
    },
    mixins: [coinMixin],
    data() {
      return {
        // 表单数据
        formData: {
          // 收款方
          payee: this.$route.params.payee || this.$route.params.address || '',
          // 转出金额
          amount: '',
          // 备注
          memo: this.$route.params.memo || '',
          // 收幣者姓名
          name: '',
          // 收幣地址資訊
          address: '',
          // 收幣地址類型
          address_type: 0,
          // 提幣用途
          purpose: '',
        },
        // 当前法币
        realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
        // 扫一扫地址
        scanAddress: this.$route.params.address,
        // 根据地址判断币种
        coin: null,
        // worker
        worker: null,
        // 闪电转账
        Lightning: false,
        // 正在进行中
        onprogress: false,
        // 转账二次确认窗口展示
        confirmShow: false,
        // 安全确认窗口展示
        securityShow: false,
        ethChain: ['EOS_EOS', 'EOS_BAP'], // 備用，之後後端有改的話可以用
        addressTypeShow: false,
        addressTypeList: [
          this.$t('beePal.transfer.exchange'),
          this.$t('beePal.transfer.wallet'),
          this.$t('beePal.transfer.other'),
        ],
        isRead: false,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      // 余额
      balance() {
        return this.token.amount
      },
      // 到账数量
      arrivalAmount() {
        if (!this.formData.amount) return '--'
        // return this.formData.amount - this.token.withdrawFee
        return this.formData.amount
      },
      // 转账按钮开启
      canClick() {
        return (
          this.formData.payee && Number(this.formData.amount) && !this.onprogress && this.formData.name && this.formData.address && this.formData.purpose && this.isRead
        )
      },
      // 根据转出数量计算汇率
      coinRate() {
        const amount = this.formData.amount
        const rate = this.token.rate
        if (rate === '--') return rate
        return money_filter(amount * rate, 2)
      },
      isEOS() {
        // console.log('this.token', this.token)
        const coin = this.token.coin_code.split('_')
        const coinChain = coin[0] || ''
        return coinChain === 'EOS'
      },
    },
    watch: {
      'formData.amount': {
        handler(newV, oldV) {
          if (newV === '-') {
            this.formData.amount = 0
          }
          const digit = newV.toString().split('.')
          if (digit.length === 2) {
            const r = digit[1].length
            if (r > this.token.decimal) {
              this.formData.amount = oldV
            }
          }
        },
      },
      'formData.payee': {
        handler(newV, oldV) {
          if (newV) {
            this.Lightning = false
          }
        },
      },
    },
    created() {
      this.AC_ADDWALLET({ userid: this.VG__userInfo.id, id: this.token.coin })
      this.worker = this.$worker.create([
        {
          message: 'msg',
          func(data) {
            const ajax = new XMLHttpRequest()
            ajax.onreadystatechange = () => {
              if (ajax.readyState === 4) {
                this.postMessage(ajax.responseText)
              }
            }
            ajax.open(
              'GET',
              location.origin +
              process.env.VUE_APP_BASE_API +
              '/coin/wallet_exist/' +
              data.address +
              '/',
              false,
            )
            ajax.send(null)
          },
        },
      ])
      if (this.scanAddress) {
        this.worker
          .postMessage('msg', [{ address: this.scanAddress }])
          .then(res => {
            res = JSON.parse(res)
            this.coin = res
          })
      }
    },
    mounted() {
      if (this.$route.params.payee || this.$route.params.address) {
        const payee = this.formData.payee.split('|')
        if (payee.length > 1) {
          this.formData.payee = payee[0]
          this.formData.memo = payee[1]
        }
        this.checkAccount()
      }
    },
    beforeDestroy() {
      this.worker = null
    },
    methods: {
      ...mapActions('BeePal', ['AC_UPDATEWALLET', 'AC_ADDWALLET']),
      onSubmit() {
        console.log(this.token.address, !this.token.address)
        if (this.arrivalAmount < 0) {
          this.$toast(this.$t('beePal.transfer.errorTip'))
          return
        }
        if (!this.token.address) {
          this.AC_ADDWALLET({ userid: this.VG__userInfo.id, id: this.token.coin })
          this.$toast(this.$t('beePal.otcHistory.error'))
          return
        }
        if (Number(this.formData.amount) + Number(this.token.withdrawFee) > Number(this.balance)) {
          this.$toast(this.$t('beePal.transfer.outAmountWarning'))
          return
        }
        this.confirmShow = true
      },
      toPay() {
        this.onprogress = true
        this.securityShow = false
        const data = {
          coin: this.token.coin,
          amount: String(this.formData.amount),
          target_address: this.formData.payee, // 2021.08.11 新API address改成target_address
          memo: this.formData.memo,
          // 額外資訊，前端隨便帶，後端不驗證
          extra_info: {
            name: this.formData.name,
            address: this.formData.address,
            address_type: this.addressTypeList[this.formData.address_type],
            purpose: this.formData.purpose,
          }
        }
        coinTransfer(data) // 2021.08.11 舊API transaction()換成新API coinTransfer()
          .then(res => {
            if (res.code === 0) {
              this.AC_UPDATEWALLET()
              this.$notify({
                message: this.$t('beePal.transfer.success'),
                className: 'success',
                color: '#ffffff',
                background: '#2A2C38CC',
                duration: '1000',
              })
              this.$router.push({
                name: 'tokenDetail',
                params: {
                  token: this.token.coin_code,
                },
              })
            } else if (this.$t(`errorCode.${res.code}`)) {
              this.onprogress = false
              this.$toast(this.$t(`errorCode.${res.code}`))
            } else {
              this.onprogress = false
              this.$toast(this.$t('base.unknownErr'))
            }
          })
          .catch(err => {
            console.log('err', err)
            this.onprogress = false
            this.$toast(this.$t('base.unknownErr'))
          })
      },
      checkAccount() {
        let address = this.formData.payee
        if (this.formData.memo) {
          address += '|' + this.formData.memo
        }
        if (!address) return
        const param = {
          address
        }
        // 2021.08.11 配合新API，新的驗證address寫法
        verifyAccount(param).then(res => {
          try {
            const isAddressExists = res.data.exists
            if (isAddressExists) {
              this.Lightning = true
            } else {
              this.Lightning = false
            }
          } catch (err) {
            this.Lightning = false
          }
        })
      },
      goRecent() {
        this.$router.push({
          name: 'recentTrans',
          params: {
            token: this.token.coin_code,
          },
        })
      },
      showAnnouncement() {
        this.$dialog.alert({
          title: this.$t('beePal.transfer.announcement'),
          message: this.$t('beePal.transfer.announcement_content'),
          className: 'transfer-announcement-dialog',
          showConfirmButton: false, // 	是否展示確認按鈕
          closeOnClickOverlay: true, // 是否在點擊遮罩層後關閉彈窗
        })
      },
    },
  }
</script>

<style lang="scss">
.transfer-announcement-dialog {
  .van-dialog__header {
    font-weight: bold;
  }

  .van-dialog__content {
    margin-top: 30px;

    .van-dialog__message {
      font-size: 12px;
      text-align: left;
    }
  }

  .beepal-text {
    color: #FFC107;
  }
}
</style>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .transfer {
    min-height: 100%;
    background: $background;
  }

  .main-content {
    height: 100%;
    box-sizing: border-box;
  }

  .van-form {
    color: $labelColor1;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .van-field {
    background-color: inherit;
    padding: 0;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .transferAmount {
    //border-bottom: 1px solid $BorderColor4;
    background-color: $pageBgColor;
    padding: 10px 15px 8px 15px;

    ::v-deep .van-field {
      font-size: 30px;

      input {
        &::placeholder {
          font-size: 16px;
        }

        line-height: 52px;
      }

      font-weight: 100;
    }

    .amountField {
      border-bottom: 1px solid $BorderColor4;
      height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .rate {
        color: $labelColor20;
        font-size: 14px;
      }
    }

    .token {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .balance {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px 15px 15px;
    background-color: $pageBgColor;

    .walletHave {
      font-size: 14px;
      color: $labelColor20;
    }

    .tag {
      margin-top: 5px;
      // color: $labelColor21;
      // border-color: $BorderColor4;
      color: $labelColor13;
      border-color: $labelColor13;
      padding: 1px 6px;
    }
  }

  .memo {
    ::v-deep .van-field {
      font-size: 16px;
    }
  }

  .serviceCharge {
    padding-left: 15px;
    padding-right: 15px;
    background-color: $pageBgColor;

    .chargeBox {
      border-bottom: 1px solid $BorderColor4;
      padding: 15px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .fee {
        font-size: 16px;
      }

      .rate {
        margin-top: 3px;
        font-size: 14px;
        color: $labelColor21;
      }
    }
  }

  .arrivalAmount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    color: rgba($color: $labelColor1, $alpha: 0.7);
  }

  .submitBtn {
    display: flex;
    align-items: center;
    margin: 100px 35px 10px;

    .van-button {
      font-size: 16px;
      opacity: 1;
      color: $cardColor;
      background: $linearBgColor-05;
      border-radius: 6px;

      &.canClick {
        background: $linearBgColor-02;
      }

      .van-button__text {
        display: flex;
        align-items: center;

        .lightning {
          font-size: 24px;
          display: inline;
          margin-right: 5px;
        }
      }
    }
  }

  .announcement {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-bottom: 35px;

    span {
      color: #FFC107;
    }

    ::v-deep .van-checkbox__icon--checked .van-icon {
      background-color: #FFC107;
      border-color: #FFC107;
    }
  }
</style>
