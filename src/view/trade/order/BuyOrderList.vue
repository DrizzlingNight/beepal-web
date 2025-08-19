<template>
  <div>
    <van-loading v-if="loading" size="48px" style="margin-top: 50px" vertical>
      {{ $t('base.loading') }}
    </van-loading>

    <template v-else>
      <van-list
        v-if="orderList.length"
        v-model="isListLoading"
        :finished="isAllList"
        class="list-container"
        finished-text="没有更多了"
        @load="getNewList"
      >
        <order-item v-for="i in orderList" :item="i" :key="i.id" />
      </van-list>

      <div v-else class="data-empty">{{ $t('trade.order.text_1') }}</div>
    </template>
  </div>
</template>

<script>
import { Loading, List } from 'vant';
import OrderItem from './OrderItem'
import { getBillList } from '@/api';

export default {
  name: "BuyOrderList",
  components: {
    [Loading.name]: Loading,
    [List.name]: List,
    OrderItem
  },
  data() {
    return {
      orderList: [],
      loading: true,
      pageNum: 1,
      listTotal: 0,
      isListLoading: false,
      isAllList: false,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getNewList() {
      if (this.pageNum * 10 >= this.listTotal) {
        this.isAllList = true
        return
      }
      this.pageNum++
      this.fetchData()
    },
    fetchData() {
      getBillList(this.pageNum)
        .then(res => {
          this.loading = false;
          console.log('getBillList-res:', res);
          this.isListLoading = false
          this.listTotal ? undefined : this.listTotal = res.count

          this.orderList.length === 0
            // 2021.08.16 配合新API，資料放res.data裡
            ? this.orderList = res.data.results
            : this.orderList = [...this.orderList, ...res.data.results]
        })
        .catch(err => {
          this.loading = false;
          console.error('getBillList-err:', err);
        });
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
