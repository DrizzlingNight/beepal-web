<template>
  <div class="pay-wrap">
    <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('trade.pay.text_1') }}</div>
    </div>
    <div class="pay page-top-safe-area page-module">
      <div class="buy-token line-wrap">
        <span>{{ $t('trade.pay.text_2') }} BTC</span>
        <div class="pay-status">
          <div class="status">{{ $t('trade.pay.text_1') }}</div>
          <div class="time">14 分 58 秒</div>
        </div>
      </div>
      <div class="pay-type line-wrap">
        <div class="line-wrap">
          <svg-icon icon-class="alipay"/>
          支付宝
        </div>
        <span class="tick tick-success"></span>
      </div>
      <ul class="order-info">
        <li class="line-wrap">
          <span class="label">{{ $t('trade.pay.label_1') }}</span>
          <span>username</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.pay.label_2') }}</span>
          <span>10000.00 CNY</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.pay.label_3') }}</span>
          <span>10000.00 CNY/BTC</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.pay.label_4') }}</span>
          <span>0.12345</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.pay.label_5') }}</span>
          <span>12435</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.pay.label_6') }}</span>
          <span>#124356789</span>
        </li>
      </ul>
    </div>
    <div class="btn-wrap line-wrap">
      <div class="cancel-btn line-btn" @click="onTrading(0)">{{ $t('trade.pay.button_1') }}</div>
      <div class="buy-btn line-btn line-btn__unactive" @click="onTrading(1)">{{ $t('trade.pay.button_2') }}</div>
    </div>
  </div>
</template>

<script>
import LineWrapWithCopy from '@/components/line-wrap-with-copy/LineWrapWithCopy'
export default {
  name: 'Pay',
  components: {
    LineWrapWithCopy,
  },
  data() {
    return {
      payAmount: '100 CNY',
      payee: '高渐离',
      bankName: '中国银行',
      toAccount: '1234567890',
    }
  },
  methods: {
    onTrading(status) {
      this.$router.push({ path: 'orderStatus', query: { status }})
    }
  }
}
</script>

<style lang="scss" scoped>
.pay{
  color: #fff;
  padding-top: 70px;
  padding-bottom: 200px;
}
.buy-token{
  align-items: normal;
  span{ color: #FFC100; font-size: 25px;}
  .pay-status{ padding-top: 6px; line-height: 25px; text-align: end;}
  .status{
    color: #CA4A56;
    font-size: 16px;
  }
}
.pay-type{
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
  background-color: #222;
  .svg-icon{
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .tick {
    $size: 25px;
    $line: 3px;
    $space: 20%;
    $success: #FFC100;
    $sign: #000;
    display: inline-block;
    position: relative;
    width: $size; height: $size;
    border-radius: $size/2;
    &:before, &:after {
      background: $sign;
      position: absolute;
      content: ' ';
      left: $space*1.5;
      right: $space*1.5;
      top: 50%;
      height: $line;
      bottom: auto;
    }
    &-success{
      background: $success;
      transform: rotate(45deg);

      &:after{
        height: $line; bottom: 25%;
        left: 30%; right: 45%;
        top: auto;
      }
      &:before{
        width: $line; height: auto; bottom: 25%;
        top: $space; left: 55%; right:auto;
      }
    }
  }
}
.order-info{
  font-size: 16px;
  li{ margin-bottom: 12px;}
  .label{ color: #B7B7B7; }
}
.btn-wrap{
  position: absolute;
  bottom: 5%;
  width: calc(100vw - 40px);
  padding: 0 20px;
}
.btn-wrap .line-btn{
  flex: 1;
}
.cancel-btn{
  margin-right: 20px;
  background-color: #3E3E3E;
  color: #FFDE00;
}
.buy-btn{
  background-color: #FFC100;
}
</style>
