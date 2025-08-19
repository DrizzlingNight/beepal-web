<!--
 * @Author: your name
 * @Date: 2019-11-18 10:58:06
 * @LastEditTime: 2019-11-18 11:00:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/trade/self-choise-sell/index.vue
 -->
<template>
  <div class="self-choise-sell">
    <div class="token-container">
      <div
        v-for="(o, i) in tokenList"
        :key="i"
        :class="{ 'token-item__active': curIdx == i }"
        class="token-item"
        @click="curIdx = i"
      >
        {{ o.token }}
      </div>
    </div>

    <div class="content-container">
      <ul class="traders-list">
        <li v-for="(item, index) in traders " :key="index">
          <div class="trader line-wrap">
            <div class="user line-wrap">
              <div class="avatar"></div>
              <span class="username">username</span>
              <svg-icon icon-class="badge" />
            </div>
            <div class="info">交易 1234 | 成交率 100%</div>
          </div>
          <div class="goods">
            <div class="currency">12345678 CNY</div>
            <div class="range">限额 1000 - 12345678 CNY</div>
            <div class="amount">0.1234 BTC</div>
          </div>
          <div class="pay line-wrap">
            <div class="pay-option line-wrap">
              <svg-icon
                v-for="(item, index) in ['alipay', 'wechatpay', 'bank']"
                :key="index"
                :icon-class="item"
              />
            </div>
            <div class="sell-btn" @click="popupVisible = true">出售</div>
          </div>
        </li>
      </ul>
      <van-popup v-model="popupVisible" closeable>
        <div class="pay-confirm">
          <div class="goods-info line-wrap">
            <div>
              <div class="token">出售 {{ tokenList[curIdx].token }}</div>
              <div class="currency">12345678 CNY</div>
              <div class="range">限额 1000 - 12345678 CNY</div>
            </div>
            <svg-icon icon-class="bit" />
          </div>

          <div class="pay-type">
            <svg-icon icon-class="alipay"></svg-icon>
            支付宝
          </div>
          <div class="buy-input-container">
            <span>*您输入的金额小于最小交易金额</span>
            <div class="buy-input-main">
              <div class="input_wrap">
                <van-field
                  :value="inputAmount"
                  readonly
                  clickable
                  class="input"
                  placeholder="输入出售金额"
                  @touchstart.native.stop="showKeyboard = true"
                />
                <div class="input-action line-wrap">
                  <span class="token">CNY</span>
                  <div class="all-in">全部出售</div>
                </div>
                <van-number-keyboard
                  v-model="inputAmount"
                  :show="showKeyboard"
                  safe-area-inset-bottom
                  extra-key="."
                  close-button-text="完成"
                  @blur="showKeyboard = false"
                />
              </div>
              <div class="buy-result-amount line-wrap">
                <span>{{ inputAmount / tokenList[curIdx].cnyRate }}</span>
                <span>{{ tokenList[curIdx].token }}</span>
              </div>
            </div>
            <div class="action">
              <p>该订单需要您在15分钟之内支付</p>
              <div class="btn-wrap line-wrap">
                <div class="cancel-btn line-btn" @click="popupVisible = false">取消</div>
                <div class="sell-btn line-btn line-btn__unactive" @click="sell">出售</div>
              </div>
            </div>
          </div>
          <div class="tips">
            <span>卖家备注：</span>
            <p>如因备注敏感词汇导致资金冻结无法放币或退款！务必使用实名打款！非实名付款，拒绝成交不放行！</p>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  Popup,
  Field,
  NumberKeyboard,
} from 'vant';
export default {
  name: 'SelfChoiseBuy',
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
  },
  data() {
    return {
      curIdx: 0, // 切换币种
      tokenList: [
        {
          token: 'BTC',
          cnyRate: 50000,
        },
        {
          token: 'ETH',
          cnyRate: 1200,
        },
        {
          token: 'EOS',
          cnyRate: 22,
        },
        {
          token: 'USDT',
          cnyRate: 7,
        },
      ],
      inputAmount: '',
      showKeyboard: false,
      traders: [1, 2, 3],
      popupVisible: false
    }
  },
  methods: {
    sell() {
      if (this.inputAmount <= 0) {
        this.$toast('输入出售金额');
      } else {
        this.$router.push('pay')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.self-choise-sell {
  background: $bodyBgColor;
  padding: 16px 0;
  height: 70vh;
}

.token-container {
  display: flex;
  overflow: auto;
  padding: 0 20px;

  .token-item {
    font-size: 14px;
    font-weight: 800;
    color: #adadad;
    text-align: center;
    position: relative;
    line-height: 2.4;
    width: 40px;

    & + .token-item {
      margin-left: 2em;
    }

    &__active {
      color: #39B167;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        height: 3px;
        left: 0;
        right: 0;
        background: #39B167;
      }
    }
  }
}

.content-container {
  margin-top: 2em;
  padding-bottom: 100px;
}

.traders-list {
  background-color: #222124;
  padding: 0 20px;
  li {
    color: #fff;
    padding: 20px 0;
    min-height: 100px;
    border-bottom: 1px solid #000;
  }
  .trader{
    .avatar{
      border-radius: 100%;
      height: 30px;
      width: 30px;
      background-color: #ffc100;
    }
    .username{
      margin: 0 10px;
      font-size: 18px;
    }
    .info{
      font-size: 14px;
      color: #929292;
    }
    .svg-icon{
      width: 16px;
      height: 16px;
    }
  }
  .goods{
    margin: 20px 0;
    color: #929292;
    font-size: 14px;

    .currency{
      font-size: 20px;
      color: #fff;
      line-height: 25px;
      font-weight: 600;
    }
  }
  .pay{
    .svg-icon{
      width: 28px;
      height: 28px;
    }

    .pay-option{
      width: 110px;
    }

    .sell-btn{
      font-size: 16px;
      width: 100px;
      text-align: center;
      color: #fff;
      line-height: 30px;
      display: inline-block;
      border-radius: 15px;
      background-color: #39B167;
    }
  }
}
.pay-confirm{
  width: 100vw; height: calc(100vh - 50px);
  color: #fff;
  background-color: #111111;
  padding-top: 50px;

  .goods-info{
    align-items: normal;
    padding: 0 20px;

    .token{ color: #39B167; font-size: 20px; }
    .currency{ font-size: 22px; font-weight: 600;}
    .range{ color: #929292; font-size: 12px; }
    .svg-icon{ width: 40px; height: 40px; margin: 8px; }
  }

  .pay-type{ margin: 20px; }

  .buy-input-container{
    background-color: #222;
    padding: 20px;

    > span{
      color: #FF253A;
      font-size: 14px;
    }

    .buy-input-main{
      border: 1px solid #979797;
      margin: 10px 0;
      padding: 0 10px 10px;
      border-radius: 4px;
    }
    .input_wrap{
      display: flex;
      align-items: center;
      height: 50px;
      border-bottom: 1px solid #979797;
    }
    .input-action{
      width: 200px;
      position: relative;
      font-size: 16px;

      .all-in{
        color: #FFDE00;
        border-left: 1px solid #979797;
        padding-left: 7px;
      }
    }
    .buy-result-amount{
      margin-top: 10px;
      padding: 5px 20px;
    }
    .action{
      p{
        margin-bottom: 20px;
        font-size: 14px;
        color: #979797;
      }
      .btn-wrap .line-btn{
        flex: 1;
      }
      .cancel-btn{
        margin-right: 20px;
        background-color: #3E3E3E;
        color: #FFDE00;
      }
      .sell-btn{
        background-color: #39B167;
        color: #fff;
      }
    }
  }

  .tips{
    padding: 20px;
    color: #B7B7B7;
    p{ margin-top: 10px; font-size: 14px; }
  }
}

::v-deep .van-tabs__nav {
  background: $bodyBgColor;
}
::v-deep .van-cell.van-field {
  background-color: $topBgColor;
  border-radius: 10px;
}
::v-deep .van-field__control {
  color: #fff;
  font-size: 16px;
}
::v-deep .van-hairline{
  color: #000;
}
::v-deep .van-cell:not(:last-child)::after {
  border: none;
}
</style>
