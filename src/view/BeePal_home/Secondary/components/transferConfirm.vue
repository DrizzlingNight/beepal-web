<template>
  <van-popup :value="show" :close-on-click-overlay="false" class="confirm" position="bottom">
    <div class="content">
      <div class="head">
        <div class="title">{{ $t('beePal.transfer.detailHead') }}</div>
        <div class="cancel" @click="$emit('changeShow', false)">
          {{ $t('beePal.transfer.close') }}
        </div>
      </div>
      <div class="detail">
        <div class="number">{{ formData.amount }}&nbsp;{{ token.coin_name }}</div>
        <div class="field flex row-v-c">
          <span class="left">{{ $t('beePal.transfer.payer') }}</span><span>{{ token.address && token.address.split('|')[0] }}</span>
        </div>
        <div class="field flex row-v-c">
          <span class="left">{{ $t('beePal.transfer.field1') }}</span><span>{{ formData.payee }}</span>
        </div>
        <div class="field flex row-v-c">
          <span class="left">{{ $t('beePal.transfer.field4') }}</span><span>{{ formData.memo || '--' }}</span>
        </div>
      </div>
      <van-button @click="goSecurity">{{
        $t('beePal.transfer.secondConfirm')
        }}
      </van-button>
    </div>
  </van-popup>
</template>

<script>
  import { Button, Field, Form, Popup } from 'vant'

  export default {
    name: 'TransferConfirm',
    components: {
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Button.name]: Button,
      [Form.name]: Form,
    },
    model: {
      prop: 'show',
      event: 'changeShow',
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      formData: {
        type: Object,
        default: () => {
          return {}
        },
      },
      token: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    methods: {
      goSecurity() {
        this.$emit('changeShow', false)
        this.$emit('toPay')
        // this.$parent.securityShow = true
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import '@/styles/variable.scss';

  .confirm {
    min-height: 200px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .content {
    padding: 0 15px;

    .head {
      padding: 23px 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.5px solid $BorderColor4;

      .title {
        color: $labelColor1;
        font-size: 16px;
      }

      .cancel {
        color: $labelColor20;
        font-size: 14px;
      }
    }

    .detail {
      padding: 0 15px;

      .number {
        text-align: center;
        padding: 10px 0;
        font-size: 32px;
        font-weight: bold;
        color: $labelColor1;
        border-bottom: 0.5px solid $BorderColor4;
      }

      .field {
        color: $labelColor1;
        padding: 10px 0;
        font-size: 14px;
        border-bottom: 0.5px solid $BorderColor4;
        word-break: break-all;

        .left {
          min-width: 80px;
          color: $labelColor20;
        }
      }
    }

    .van-button {
      width: 100%;
      margin-top: 20px;
      background: $linearBgColor-02;
      color: $cardColor;
      opacity: 1;
      border-radius: 8px;
      font-size: 16px;
      border: none;
      margin-bottom: 30px;
    }
  }
</style>
