<template>
  <div>
    <van-loading v-if="transfer_loading" size="32px" color="#1989fa" vertical style="height: 100%; margin-top: 34px" />
    <div v-if="transfer_dataList.length===0 && !transfer_loading" class="tips">{{ $t('trade.order.text_1') }}</div>
    <van-list
      v-if="transfer_dataList.length"
      v-model="isHistoryLoading"
      :finished="historyFinished"
      class="history-list"
      finished-text="没有更多了"
      @load="getNewHistory"
    >
      <li v-for="(o, i) in transfer_dataList" :key="i" class="history-item">
        <div class="info date"> {{ o.created_time | dateFormat }} </div>
        <div class="info status">{{ getTransferTypeDetail(o.type) }}</div>
        <div :class="['status-' + o.status]" class="info amount">{{ o | statusFormat }} {{ o.status === 2 ? token : '' }}</div>
      </li>
    </van-list>
  </div>
</template>

<script>
import { getThirdPartyBillList } from '@/api'
import { List, Loading } from 'vant'
import { dateFormat } from '@/utils/dateFormat'
import { Decimal } from 'decimal.js'

const statusList = [
  {
    id: 0,
    name: '新建',
  },
  {
    id: 1,
    name: '进行中',
  },
  {
    id: 2,
    name: '完成',
  },
  {
    id: 3,
    name: '失败',
  },
]
export default {
  name: "HistoryList",
  components: {
    [Loading.name]: Loading,
    [List.name]: List,
  },
  filters: {
    dateFormat,
    statusFormat(item) {
      if (!item.status) return '--'
      const obj = statusList.find(o => o.id === item.status)
      if (obj && item.status === 2) {
        return item.amount && Decimal(item.amount).toFixed(4, Decimal.ROUND_DOWN).toString()
      } else {
        return (obj && obj.name) || '-'
      }
    },
  },
  props: {
    thirdPartyApp: {
      type: Object,
      default: function() {
        return {}
      }
    },
    token: {
      type: String,
      default: 'USDT'
    },
  },
  data() {
    return {
      statusList,
      pageNum: 1,
      historyTotal: 0,
      transfer_loading: true,
      historyFinished: false,
      isHistoryLoading: false,

      transfer_dataList: [],
    }
  },
  watch: {
    thirdPartyApp: {
      immediate: true,
      handler(val, oldVal) {
        if (val.id && val.balances.amount) {
          this.fetchTransferDataList()
        }
      }
    }
  },
  methods: {
    getNewHistory() {
      if (this.pageNum * 10 >= this.historyTotal) {
        this.historyFinished = true
        return
      }
      this.pageNum++
      this.fetchTransferDataList(this.pageNum)
    },
    fetchTransferDataList(page = 1) {
      getThirdPartyBillList(page)
        .then(res => {
          this.transfer_loading = false
          this.isHistoryLoading = false
          this.historyTotal ? undefined : this.historyTotal = res.count
          this.transfer_dataList.length === 0
            // 2021.08.16 配合新API，資料放res.data裡
            ? this.transfer_dataList = res.data.results
            : this.transfer_dataList = [...this.transfer_dataList, ...res.data.results]
          this.transfer_dataList = this.transfer_dataList.filter(i => i.third_party === this.thirdPartyApp.id && i.type === 1)
        })
        .catch(err => {
          console.log(err)
          this.transfer_loading = false
        })
    },
    // 由type:0/1得到类似“钱包账户 划至 DICbet账户”的文案
    // 0: 充币； 1:提币， 相对平台而言
    getTransferTypeDetail(type) {
      if (this.thirdPartyApp && this.thirdPartyApp.name) {
        const app = this.thirdPartyApp
        switch (type) {
          case 0:
            return `钱包账户 划至 ${app.name}`
          case 1:
            return `${app.name} 划至  钱包账户`
          default:
            return 'Error'
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.tips{
  margin-top: 80px;
  text-align: center;
  color: #ffffffb0;
}
.history-item{
  padding: 12px;
  background-color: #222;
  border-radius: 6px;
  margin-top: 12px;
  color: #ffffffb0;
  list-style: none;
  font-size: 14px;
}
.status-0 { color: #0fa94a; }
.status-1 { color: #44bdf9; }
.status-2 { color: #0fa94a; }
.status-3 { color: #ef3d5e; }
</style>
