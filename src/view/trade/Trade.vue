<!--
 * @Author: your name
 * @Date: 2019-11-18 10:43:52
 * @LastEditTime: 2019-11-18 11:00:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/trade/index.vue
 -->
<template>
  <div :class="{ 'dark-bg': isSelfChoise }" class="trade">
    <div class="page-top-safe-area__has-page-title trade-title-wrap">
      <div :class="[isSelfChoise ? 'self-choise-buy' : 'quick-buy']" class="trade-switch">
        <div class="switch-item quick-buy" @click="isSelfChoise = false">{{ $t('trade.title_1') }}</div>
        <!-- <div class="switch-item self-choise-buy" @click="isSelfChoise = true">自选区</div> -->
      </div>
      <div
        v-if="livechat"
        class="page-title-cs"
        style="margin-top:2px; position: absolute; right: 0px;"
      >
        <svg-icon
          icon-class="livechat" class-name="livechat"
          @click.stop="
           handleRouter('livechat')
        "
        ></svg-icon>
      </div>
    </div>

    <div class="main-content">
      <div :class="[isSelfChoise ? 'self-choise-buy' : 'quick-buy']" class="line-wrap">
        <div class="title-tab">
          <h2 :class="{unactive: isSell}" class="title" @click="isSell = false">{{ $t('trade.tab_1') }}</h2>
          <h2 :class="{unactive: !isSell}" class="title" @click="isSell = true">{{ $t('trade.tab_2') }}</h2>
        </div>
        <h3 class="order-details" @click="$router.push({name: 'order', params: {isSell: Number(isSell)}})">{{ $t('trade.details') }}</h3>
      </div>
      <keep-alive>
        <component :is="currentComponent" class="component"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import QuickBuy from './quick-buy/index'
import QuickSell from './quick-sell/index'
import SelfChoiseBuy from './self-choise-buy/index'
import SelfChoiseSell from './self-choise-sell/index'
import { settings } from '@/config'

export default {
  name: 'Trade',
  data() {
    return {
      isSelfChoise: false,
      isSell: this.$route.params.isSell,
      livechat: settings.customerService,
    }
  },
  computed: {
    currentComponent() {
      if (!this.isSell) {
        return this.isSelfChoise ? SelfChoiseBuy : QuickBuy
      } else {
        return this.isSelfChoise ? SelfChoiseSell : QuickSell
      }
    },
  },
  methods: {
    handleRouter(router) {
      if (this.$route.path.includes(router)) {
        return
      } else {
        this.$router.push(`/${router}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.svg-icon {
  margin-bottom: 0px;
  color: #d1d1d1;
  width: 22px;
  height: 24px;
  font-size: 24px;
}
.trade {
  background-color: $topBgColor;
  &.dark-bg {
    background-color: #24262b;
  }
}
.trade-title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.trade-switch {
  margin: auto;
  width: 140px;
  height: 28px;
  line-height: 28px;
  border-radius: 5vw;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &.quick-buy {
    padding: 2px;
    background-color: #000000;
    .switch-item.quick-buy {
      background-color: $yellow;
      color: #1b2945;
    }
    .switch-item.self-choise-buy {
      background-color: transparent;
      color: #ffffff;
    }
  }

  &.self-choise-buy {
    padding: 2px;
    background-color: #000000;
    .switch-item.quick-buy {
      background-color: transparent;
      color: #ffffff;
    }
    .switch-item.self-choise-buy {
      background-color: $yellow;
      color: #1b2945;
    }
  }

  .switch-item {
    font-size: 12px;
    font-weight: 800;
    color: rgba(27, 41, 69, 1);
    border-radius: 28px;
    width: 166px;
    text-align: center;
  }
}

.line-wrap {
  margin-top: 9px;
  padding: 20px 18px;
  background-color: $bodyBgColor;
}
.title,
.order-details {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  // .quick-buy & {
  //   color: #191919;
  // }
  // .self-choise-buy & {
  //   color: #ffffff;
  // }
}
.order-details {
  font-size: 14px;
  display: flex;
  align-items: center;
  &::before {
    margin-top: 2px;
    margin-right: 2px;
    content: '';
    display: inline-block;
    width: 18px;
    height: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    // background-image: url(~./order__on.png);
    background-image: url(~./order__off.png);
    // .self-choise-buy & {
    // }
  }
}
.title-tab {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 170px;

  .title {
    position: relative;

    &::after {
      display: block;
      content: '';
      width: 30px;
      height: 4px;
      border-radius: 2px;
      background-color: #39b167;
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:first-child::after {
      background-color: #ffc100;
    }

    &.unactive {
      font-size: 16px;
      color: #747474;

      &::after {
        background-color: transparent;
      }
    }
  }
}
</style>
