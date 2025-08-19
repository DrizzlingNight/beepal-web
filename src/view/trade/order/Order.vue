<template>
  <div class="order">
    <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.push('currency')"></div>
      <div class="page-title">{{ $t('trade.order.title') }}</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
        icon-class="livechat"
        class-name="livechat" @click.stop="handleRouter('livechat')">
        </svg-icon>
      </div>
    </div>
    <div class="main-content">
      <div class="line-wrap order-options">
          <div
            v-for="item in components"
            :class="{ 'item__active': curIdx === item.id }"
            :key="item.id"
            class="order-item"
            @click="curIdx = item.id"
          >{{ item.name }}</div>
      </div>

      <keep-alive>
        <component :is="curComp" class="components" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { Loading } from 'vant';
// import { getBillList, getBillOutList } from '@/api';
import { settings } from '@/config';
import BuyOrderList from "./BuyOrderList"
import SellOrderList from "./SellOrderList"

export default {
  name: 'Order',
  components: {
    [Loading.name]: Loading,
  },
  filters: {
    // Inited = 0
    // InProcess = 1
    // Completed = 2
    // Failed = 3
    // Expired = 4
    status2name(v) {
      switch (v) {
        case 0:
          return '订单初始化';
        case 1:
          return '订单待支付...';
        case 2:
          return '订单已完成';
        case 3:
          return '订单失败';
        case 4:
          return '订单已过期';
      }
    },
  },
  data() {
    return {
      loading: true,
      orderList: [],
      livechat: settings.customerService,

      curIdx: Number(this.$route.params.isSell) || 0,
      components: [
        {
          id: 0,
          name: this.$t('trade.order.text_3'),
          comp: BuyOrderList,

        },
        {
          id: 1,
          name: this.$t('trade.order.text_4'),
          comp: SellOrderList,
        }
      ]
    };
  },
  computed: {
    curComp() {
      return this.components[this.curIdx].comp
    },
  },
  methods: {
    handleRouter(router) {
      if (this.$route.path.includes(router)) {
        return
      } else {
        this.$router.push(`/${router}`)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  margin-bottom: 0px;
  color: #d1d1d1;
  width: 22px;
  height: 24px;
  font-size: 24px;
}
.order {
  background: #111;
}
.order-options{
  color: #fff;
  margin: 20px auto;
  width: 90%;
  background-color: #343434;
  border-radius: 4px;

  .order-item {
    flex: 1;
    text-align: center;
    padding: 4px 0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 250ms;

    &.item__active{
      background-color: #FFC100;
      color: #000;
    }
  }
}

.list-container {
  margin-top: 12px;
}
.list-item {
  margin-top: 12px;
  padding: 0 18px;
  background: #222222;
  height: 100%;
  .avatar {
    margin-right: 12px;
    width: 30px;
    height: 30px;
    background: rgba(219, 219, 219, 1);
    border-radius: 50%;
    background-image: url(~@/assets/img/avatar.png);
    background-size: contain;
  }
  .id{
    font-size: 14px;
    line-height: 30px;
    color: #5c5c5c;
    border-top: 1px solid #484848;
  }
  .username {
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
  }
  .date {
    margin-left: auto;
    font-size: 16px;
    font-weight: normal;
    color: rgba(173, 173, 173, 1);
  }
  .action-token {
    // margin: 13px 0 5px;
    font-size: 14px;
    // font-weight: bold;
    color: #f58500;

    span{color: #fff;}
  }
  .amount-currency {
    font-size: 16px;
    // font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
  .status {
    font-size: 14px;
    // font-weight: bold;
    color: rgba(181, 181, 181, 1);
  }

  .border-bottom {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background-color: #484848;
    }
  }
  .line-wrap{
    color: #C2C2C2;
    font-size: 14px;
  }
  .list-item-inner{
    padding: 10px 0;
    line-height: 25px;
    .warning > span{
      color: #d10f49;
    }
  }
}
</style>
