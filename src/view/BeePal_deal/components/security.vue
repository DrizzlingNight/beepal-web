<template>
  <van-popup
    :value="show"
    :close-on-click-overlay="false"
    position="bottom"
    class="security"
  >
    <div class="content">
      <div class="head">
        <div class="title">{{ $t('beePal.deal.security') }}</div>
        <div class="cancel" @click="$emit('changeShow', false)">
          {{ $t('beePal.deal.cancel') }}
        </div>
      </div>
      <div class="password">
        <van-field
          ref="password"
          v-model="password"
          :placeholder="$t('beePal.deal.passwordTip')"
          :error-message="errorTip"
          type="password"
        ></van-field>
        <div class="forget">{{ $t('beePal.deal.forget') }}</div>
        <van-button :class="{ canClick: password }" :disabled="!password" @click="type === 'sell' ? $emit('toSell') : $emit('toPay')">{{
          $t('beePal.transfer.confirm')
        }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Field, Button, Form } from 'vant'
export default {
  name: 'Security',
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
  },
  data() {
    return {
      password: '',
      errorTip: ''
    }
  },
  computed: {
    type() {
      return this.$parent.type
    }
  },
  watch: {
    show(newV) {
      if (newV) {
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      } else {
        this.$data.password = this.$options.data().password
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.security {
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
    border-bottom: 1px solid $BorderColor4;
    .title {
      color: $labelColor1;
      font-size: 16px;
    }
    .cancel {
      color: $labelColor20;
      font-size: 14px;
    }
  }
  .password {
    .van-field {
      padding: 5px;
      margin-top: 30px;
      &::after {
        border-color: $BorderColor4;
        left: 0;
        width: 100%;
      }
      ::v-deep .van-field__body {
        float: left;
        .van-field__control {
          font-size: 16px;
          &::placeholder {
            color: $BorderColor4;
          }
        }
      }
      ::v-deep .van-field__error-message {
        float: right;
      }
    }
    .forget {
      margin-left: 5px;
      color: $labelColor13;
      font-size: 13px;
      margin-top: 6px;
    }
    .van-button {
      width: 100%;
      margin-top: 20px;
      background: $linearBgColor-05;
      color: $cardColor;
      opacity: 1;
      border-radius: 8px;
      font-size: 16px;
      border: none;
      margin-bottom: 30px;
      &.canClick {
        background: $linearBgColor-02;
      }
    }
  }
}
</style>
