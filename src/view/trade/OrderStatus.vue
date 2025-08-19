<template>
  <div class="order-status">
    <div class="order-status-header page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
          icon-class="livechat"
          class-name="livechat" @click.stop="handleRouter('livechat')">
        </svg-icon>
      </div>
    </div>

    <van-loading v-if="loading" size="48px" vertical class="order-loading">
      {{ $t('base.loading') }}
    </van-loading>

    <template v-else>
      <div class="status">
        <svg-icon :icon-class="currentStatusIcon" class="status-icon" />
        <div :style="currentStatusColor">
          {{ $t('trade.orderStatus.text_1') }}{{ currentStatusText }}
        </div>
      </div>

      <ul v-if="type == 0" class="order-info">
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_1') }}</span>
          <span>{{ detail.merchant && detail.merchant.username || detail.merchant_bill_number }}</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_2') }}</span>
          <div style="width: 40%; text-align: end; align-items: normal;">{{ detail.amount }} {{ detail.currency }}</div>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_3') }}</span>
          <span>
            <svg-icon :icon-class="currentChannel.icon" /> {{ currentChannel.name }}
          </span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_4') }}</span>
          <span>{{ detail.rate }} {{ detail.currency }}/{{ detail.crypto_currency }}</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_5') }}</span>
          <span>{{ detail.crypto_amount_after_fee }} {{ detail.crypto_currency }}</span>
        </li>
        <!-- <li v-show="status !== 1" class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_6') }}</span>
          <span>12345</span>
        </li> -->
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_7') }}</span>
          <span style="text-align: end;">{{ detail.id }}</span>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_8') }}</span>
          <span>{{ detail.created_time | dateFormatHandler }}</span>
        </li>
      </ul>

      <ul v-else class="order-info">
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_5') }}</span>
          <span>{{ detail.amount_after_fee }} {{ detail.crypto_currency }}</span>
        </li>
        <!-- <li class="line-wrap">
          <span class="label"> {{ $t('trade.orderStatus.label_9') }} </span>
          <span>{{
            (detail.amount_after_fee * (Number(detail.team_channel_range_platform_profit) +
            Number(detail.team_channel_range_pool) +
            Number(detail.team_channel_range_assurer_profit) +
            Number(detail.team_channel_range_proxy_profit))).toFixed(4)
          }} {{ detail.crypto_currency }}</span>
        </li> -->
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_3') }}</span>
          <span>
            <svg-icon :icon-class="currentChannel.icon" /> {{ currentChannel.name }}
          </span>
        </li>
        <!-- <li v-show="status == 1" class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_3') }}</span>
          <span>
            <svg-icon icon-class="alipay" /> 支付宝
          </span>
        </li> -->
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_4') }}</span>
          <span>{{ detail.rate }} {{ detail.currency }}/{{ detail.crypto_currency }}</span>
        </li>
        <!-- <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_5') }}</span>
          <span>0.12345</span>
        </li>
        <li v-show="status !== 1" class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_6') }}</span>
          <span>12345</span>
        </li> -->
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_2') }}</span>
          <div style="width: 40%; text-align: end; align-items: normal;">{{ detail.currency_amount_after_fee }} {{ detail.currency }}</div>
        </li>
        <li class="line-wrap">
          <span class="label">{{ $t('trade.orderStatus.label_7') }}</span>
          <span style="text-align: end;">{{ detail.id }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { Loading } from 'vant';
import { settings } from '@/config';
import { getBillInfo, getBillOutInfo } from '@/api'
import { dateFormat } from '@/utils/dateFormat'
import { Decimal } from 'decimal.js';
import Storage from '@/utils/storage'

export default {
  name: 'OrderStatus',
  components: {
    [Loading.name]: Loading,
  },
  filters: {
    dateFormatHandler(time) {
      return dateFormat(time)
    }
  },
  data() {
    return {
      livechat: settings.customerService,
      loading: true,

      type: this.$route.query.type,
      id: this.$route.query.id,
      detail: {
        status: 0
      }
    }
  },
  computed: {
    // Inited = 0
    // InProcess = 1
    // Completed = 2
    // Failed = 3
    // Expired = 4
    // Auditing = 5
    currentStatusIcon() {
      const icons = {
        '0': 'order-pending',
        '1': 'order-pending',
        '2': 'order-success',
        '3': 'order-fail',
        '4': 'order-fail',
        '5': 'order-pending',
      }
      return icons[this.detail.status]
    },
    currentStatusColor() {
      const colors = {
        '0': '#fff',
        '1': '#fff',
        '2': '#21C48F',
        '3': '#FF3F53',
        '4': '#FF3F53',
        '5': '#fff',
      }
      return { color: colors[this.detail.status] }
    },
    currentStatusText() {
      const allText = {
        // '0': '进行中',
        // '1': '进行中',
        // '2': '已完成',
        // '3': '失败',
        // '4': '失败',
        // '5': '进行中',
        '0': this.$t('trade.orderStatus.status_3'),
        '1': this.$t('trade.orderStatus.status_3'),
        '2': this.$t('trade.orderStatus.status_1'),
        '3': this.$t('trade.orderStatus.status_4'),
        '4': this.$t('trade.orderStatus.status_4'),
        '5': this.$t('trade.orderStatus.status_3'),
      }
      return allText[this.detail.status]
    },
    currentChannel() {
      const channels = {
        '0': { icon: 'bank', name: '银行' },
        '1': { icon: 'alipay', name: '支付宝' },
        '2': { icon: 'wechatpay', name: '微信' },
        '3': { icon: 'alipay', name: '支付宝' },
        '5': { icon: 'alipay', name: '支付宝' },
        '6': { icon: 'alipay', name: '支付宝' },
        '7': { icon: '', name: '第三方通道' },
      }
      return channels[this.detail.channel]
    }
  },
  mounted() {
    this.type == 0 ? this.fetchBillInfo() : this.fetchBillOutInfo()
  },
  methods: {
    handleRouter(router) {
      if (this.$route.path.includes(router)) {
        return
      } else {
        this.$router.push(`/${router}`)
      }
    },
    fetchBillInfo() {
      const id = this.id ? this.id : Storage.getLocal('returnOrderId')
      getBillInfo(id).then(res => {
        console.log('bill', res, dateFormat(res.created_time));
        this.detail = res
        this.detail.amount = res.amount
          ? new Decimal(res.amount).toFixed(2, Decimal.ROUND_DOWN).toString()
          : null
        this.detail.currency_amount_after_fee = res.currency_amount_after_fee
          ? new Decimal(res.currency_amount_after_fee).toFixed(2, Decimal.ROUND_DOWN).toString()
          : null
        this.detail.crypto_amount_after_fee = res.crypto_amount_after_fee
          ? new Decimal(res.crypto_amount_after_fee).toFixed(4, Decimal.ROUND_DOWN).toString()
          : null
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err);
      })
    },
    fetchBillOutInfo() {
      getBillOutInfo(this.id).then(res => {
        console.log('bill out', res);
        this.detail = res
        this.detail.amount = res.amount
          ? new Decimal(res.amount).toFixed(2, Decimal.ROUND_DOWN).toString()
          : null
        this.detail.currency_amount_after_fee = res.currency_amount_after_fee
          ? new Decimal(res.currency_amount_after_fee).toFixed(2, Decimal.ROUND_DOWN).toString()
          : null
        this.detail.crypto_amount_after_fee = res.crypto_amount_after_fee
          ? new Decimal(res.crypto_amount_after_fee).toFixed(4, Decimal.ROUND_DOWN).toString()
          : null
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.svg-icon {
  margin-bottom: 0px;
  color: #d1d1d1;
  width: 22px;
  height: 24px;
  font-size: 24px;
}
.order-status{
  color: #fff;
}
.order-status-header{
  background-color: transparent;
}
.status{
  padding: 70px 0;
  text-align: center;

  .status-icon{
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
}
.order-info{
  padding: 0 20px;
  font-size: 16px;
  li{ margin-bottom: 12px;}
  .label{ color: #B7B7B7; }
}
.label{
  width: 100px
}
.order-loading{
  position: fixed; top: 20%; left: 50%;
  transform: translateX(-50%);
}

</style>
