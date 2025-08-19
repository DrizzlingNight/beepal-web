<template>
  <li class="list-item h129"
    @click="$router.push({name: 'orderStatus', query: {type:item.type, id: item.id}})"
  >
    <div class="flex row-v-c h56 border-bottom">
      <div class="avatar"></div>
      <div class="username">
        {{ (item.handler && item.handler.username) || $t('trade.order.text_2') }}
      </div>
      <div class="date">
        {{ item.created_time | dateFormat('yyyy/MM/dd hh:mm:ss') }}
      </div>
    </div>
    <div class="list-item-inner">
      <div :class="{buy: item.type === 0, sell: item.type === 1 }" class="action-token">
        {{ item.type === 0 ? $t('trade.order.text_3') : $t('trade.order.text_4') }}
        <span>
          {{ item.crypto_currency }}
        </span>
      </div>
      <div class="amount-currency">
        <span v-if="item.type === 0">{{ (parseInt(item.amount * 100) / 100).toFixed(2) }} {{ item.currency }}</span>
        <span v-else>{{ (parseInt(item.amount * 10000) / 10000).toFixed(4) }} {{ item.crypto_currency }}</span>
      </div>
      <div v-if="item.type === 0" class="line-wrap">
        <div v-if="item.crypto_amount_after_fee" class="rate"> ≈ {{ (parseInt(item.crypto_amount_after_fee * 10000) / 10000).toFixed(4) }} {{ item.crypto_currency }}</div>
        <div v-else class="warning"> ≈ <span>{{ $t('trade.order.warning') }}</span> </div>
        <div
          :style="{color: statusColorHanlder(item.status)}"
          class="status">
          <!-- {{ o.status | status2name }} -->
          {{ status2name_lang(item.status) }}
        </div>
      </div>
      <div v-else class="line-wrap">
        <div v-if="item.currency_amount_after_fee" class="rate"> ≈ {{ (parseInt(item.currency_amount_after_fee * 100) / 100).toFixed(2) }} {{ item.currency }}</div>
        <div v-else class="warning"> ≈ <span>{{ $t('trade.order.warning') }}</span> </div>
        <div
          :style="{color: statusColorHanlder(item.status)}"
          class="status">
          <!-- {{ o.status | status2name }} -->
          {{ status2name_lang(item.status) }}
        </div>
      </div>
    </div>
    <div class="id">{{ $t('trade.order.text_5') }}{{ item.id }}</div>
  </li>
</template>

<script>
export default {
  name: "OrderItem",
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    status2name_lang(v) {
      switch (v) {
        case 0:
          return this.$t('trade.order.status_0');
        case 1:
          return this.$t('trade.order.status_1');
        case 2:
          return this.$t('trade.order.status_2');
        case 3:
          return this.$t('trade.order.status_3');
        case 4:
          return this.$t('trade.order.status_4');
        case 5:
          // return "待审核";
          // 审核时，用已完成作为表示
          return this.$t('trade.order.status_2');
      }
    },
    statusColorHanlder(status) {
      switch (status) {
        case 0:
          return '#FFC100';
        case 1:
          return '#FFC100';
        case 2:
          return '#1EA77A';
        case 3:
          return '#B5B5B5';
        case 4:
          return '#B5B5B5';
        case 5:
          return '#1EA77A';
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.list-item {
  margin-top: 12px;
  padding: 0 18px;
  background: #222222;
  height: 100%;
  list-style: none;
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
    font-size: 14px;
    font-weight: normal;
    color: rgba(173, 173, 173, 1);
    width: 44%;
    text-align: end;
  }
  .action-token {
    // margin: 13px 0 5px;
    font-size: 14px;
    // font-weight: bold;
    &.buy{ color: #f58500; }
    &.sell{ color: #39B167; }

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
