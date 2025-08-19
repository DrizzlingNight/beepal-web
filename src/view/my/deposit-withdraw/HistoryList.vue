<template>
  <div class="depositWithdrawHistory-wrap">
    <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('my.depositWithdrawHistory.title') }}</div>
    </div>
    <div class="main-content">
      <div class="btn-container">
        <div
          :class="{ 'btn--active': curIdx === 0 }"
          class="btn"
          @click="curIdx = 0"
        >
          {{ $t('my.depositWithdrawHistory.tab_1') }}
        </div>
        <div
          :class="{ 'btn--active': curIdx === 1 }"
          class="btn"
          @click="curIdx = 1"
        >
          {{ $t('my.depositWithdrawHistory.tab_2') }}
        </div>
      </div>

      <template v-if="curIdx === 0">
        <van-loading
          v-if="deposit_withdraw_loading"
          size="48px"
          color="#1989fa"
          class="loading-data"
          vertical
          >{{ $t('base.loading') }}</van-loading
        >
        <template v-else>
          <ul v-if="deposit_withdraw_dataList.length" class="data-list">
            <li
              v-for="(o, i) in deposit_withdraw_dataList"
              :key="i"
              class="list-item"
            >
              <div class="title-line line">
                <div class="label">
                  {{ o.type | txTypeFormat('yyyy-MM-dd hh:mm:ss') }}
                </div>
                <div class="value">
                  {{ o.created_time | dateFormat }}
                </div>
              </div>
              <div class="devider"></div>
              <div class="option-line line">
                <div class="label">{{ $t('my.depositWithdrawHistory.label_1') }}</div>
                <div class="value">{{ o.coin | coinFormat }}</div>
              </div>
              <div class="option-line line">
                <div class="label">{{ $t('my.depositWithdrawHistory.label_2') }}</div>
                <div class="value">{{ (parseInt(o.amount * 10000) / 10000).toFixed(4) }}</div>
              </div>
              <div class="option-line line">
                <div class="label">{{ $t('my.depositWithdrawHistory.label_3') }}</div>
                <div class="value">{{ (parseInt(o.fee_amount * 10000) / 10000).toFixed(4) || 0 }}</div>
              </div>
              <div class="option-line line">
                <div class="label">{{ $t('my.depositWithdrawHistory.label_4') }}</div>
                <div class="value address">{{ o.address === 'internal' ? '内部转账' : o.address }}</div>
              </div>
              <div class="option-line line">
                <div class="label">{{ $t('my.depositWithdrawHistory.label_5') }}</div>
                <div :class="['status-' + o.status]" class="value">
                  {{ o.status | statusFormat }}
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="empty">
            {{ $t('my.depositWithdrawHistory.text_1') }}
          </div>
        </template>
      </template>

      <template v-if="curIdx === 1">
        <van-loading
          v-if="transfer_loading"
          size="48px"
          color="#1989fa"
          class="loading-data"
          vertical
          >{{ $t('base.loading') }}</van-loading
        >
        <template v-else>
          <van-list
            v-if="transfer_dataList.length"
            v-model="isHistoryLoading"
            :finished="historyFinished"
            class="data-list"
            finished-text="没有更多了"
            @load="getNewHistory"
          >
              <li v-for="(o, i) in transfer_dataList" :key="i" class="list-item">
                <div class="title-line line">
                  <div class="label">{{ $t('my.depositWithdrawHistory.tab_2') }}</div>
                  <div class="value">
                    {{ o.created_time | dateFormat('yyyy-MM-dd hh:mm:ss') }}
                  </div>
                </div>
                <div class="devider"></div>
                <div class="option-line line">
                  <div class="label">{{ $t('my.depositWithdrawHistory.label_1') }}</div>
                  <div class="value">{{ o.coin | coinFormat }}</div>
                </div>
                <div class="option-line line">
                  <div class="label">{{ $t('my.depositWithdrawHistory.label_2') }}</div>
                  <div class="value">{{ (parseInt(o.amount * 10000) / 10000).toFixed(4) }}</div>
                </div>
                <!-- <div class="option-line line">
                  <div class="label">Memo</div>
                  <div class="value">{{ o.memo }}</div>
                </div> -->
                <div class="option-line line">
                  <div class="label">{{ $t('my.depositWithdrawHistory.label_6') }}</div>
                  <div class="value address">
                    {{ getTransferTypeDetail(o.type, o.third_party) }}
                  </div>
                </div>
                <div class="option-line line">
                  <div class="label">{{ $t('my.depositWithdrawHistory.label_5') }}</div>
                  <div :class="['status-' + o.status]" class="value">
                    {{ o.status | statusFormat }}
                  </div>
                </div>
              </li>
          </van-list>

          <div v-else class="empty">
            {{ $t('my.depositWithdrawHistory.text_1') }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import FgDropdown from '@/components/dropdown/Dropdown'
import { getThirdPartyBillList, getTransactionList } from '@/api'
import { List, Loading } from 'vant'
import { mapGetters } from 'vuex'
import Storage from '@/utils/storage'
import { dateFormat } from '@/utils/dateFormat'

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

const typeList = [
  {
    id: 0,
    name: '充币',
  },
  {
    id: 1,
    name: '提币',
  },
]

const dataList = [
  {
    type: '1',
    time: '2020/02/18 13:20:24',
    coin: '0',
    amount: '1',
    fee: '1.000',
    status: '1',
    actionLabel: '提币地址',
    actionValue: 'jdskdjaskjdasjdlsajdlsa783278e787e8789237',
  },
  {
    type: '2',
    time: '2020/02/18 13:20:24',
    coin: '0',
    amount: '1',
    fee: '1.000',
    status: '2',
    actionLabel: '转入地址',
    actionValue: 'jdskdjaskjdasjdlsajdlsa783278e787e8789237',
  },
  {
    type: '2',
    time: '2020/02/18 13:20:24',
    coin: '0',
    amount: '1',
    fee: '1.000',
    status: '3',
    actionLabel: '划转类型',
    actionValue: '钱包账户 划至 DICBET庄户',
  },
]

export default {
  name: 'DepositWithdrawHistory',
  components: {
    FgDropdown,
    [Loading.name]: Loading,
    [List.name]: List,
  },
  filters: {
    dateFormat,
    statusFormat(id) {
      const obj = statusList.find(o => o.id === id)
      return (obj && obj.name) || '-'
    },
    coinFormat(id) {
      const obj = Storage.getLocal('coinList').find(o => o.id === id)
      return (obj && obj.name) || '-'
    },
    txTypeFormat(id) {
      const obj = typeList.find(o => o.id === id)
      return (obj && obj.name) || '-'
    },
  },
  data() {
    return {
      curIdx: 1,
      deposit_withdraw_loading: true,
      transfer_loading: true,
      typeList: typeList,
      deposit_withdraw_dataList: dataList,
      transfer_dataList: [],
      statusList: statusList,
      pageNum: 1,
      historyTotal: 0,
      historyFinished: false,
      isHistoryLoading: false
    }
  },
  computed: {
    ...mapGetters(['VG__coinList']),
  },
  created() {
    this.fetchDepositWithdrawDataList()
    this.fetchTransferDataList()
  },
  methods: {
    __txTypeFormat(id) {
      const typeList = [
        {
          id: 0,
          name: this.$t('my.depositWithdrawHistory.type_0'),
        },
        {
          id: 1,
          name: this.$t('my.depositWithdrawHistory.type_1'),
        },
      ]
      const obj = typeList.find(o => o.id === id)
      return (obj && obj.name) || '-'
    },
    getNewHistory() {
      if (this.pageNum * 10 > this.historyTotal) {
        this.historyFinished = true
        return
      }
      this.pageNum++
      this.fetchTransferDataList(this.pageNum)
    },
    fetchDepositWithdrawDataList() {
      getTransactionList()
        .then(res => {
          console.log(res)
          this.deposit_withdraw_loading = false
          this.deposit_withdraw_dataList = res.data.results.sort( // 2021.08.16 配合新API，資料放res.data裡
            (a, b) => b.id - a.id
          )
        })
        .catch(err => {
          console.log(err)
          this.deposit_withdraw_loading = false
        })
    },
    fetchTransferDataList(page = 1) {
      getThirdPartyBillList(page)
        .then(res => {
          console.log(res)
          this.transfer_loading = false
          this.isHistoryLoading = false
          this.historyTotal ? undefined : this.historyTotal = res.count
          this.transfer_dataList.length === 0
            // 2021.08.16 配合新API，資料放res.data裡
            ? this.transfer_dataList = res.data.results
            : this.transfer_dataList = [...this.transfer_dataList, ...res.data.results]
        })
        .catch(err => {
          console.log(err)
          this.transfer_loading = false
        })
    },
    // 由type:0/1得到类似“钱包账户 划至 DICbet账户”的文案
    // 0: 充币； 1:提币， 相对平台而言
    getTransferTypeDetail(type, thirdPartyId) {
      if (thirdPartyId === null) {
        return ''
      }
      const ThirdPartyList = Storage.getLocal('thirdPartyBalances')

      const obj = ThirdPartyList.find(o => o.id === thirdPartyId)
      if (!obj) {
        console.error(
          `can not find third_party_id:${thirdPartyId} in ThirdPartyList:${ThirdPartyList}`
        )
        return 'Error'
      }
      switch (type) {
        case 0:
          return `钱包账户 划至 ${obj.name}`
        case 1:
          return `${obj.name} 划至  钱包账户`
        default:
          return 'Error'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-container {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px 14px;
  box-sizing: border-box;
  .btn {
    width: 160px;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    background: rgba(34, 34, 34, 1);
    border-radius: 6px;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    &--active {
      color: rgba(0, 0, 0, 1);
      background: rgba(255, 193, 0, 1);
    }
  }
}

.empty {
  height: 400px;
  line-height: 400px;
  text-align: center;
  background: rgba(34, 34, 34, 1);
  color: azure;
}
.data-list {
  .list-item {
    padding: 20px 15px 14px;
    background: rgba(34, 34, 34, 1);
    list-style: none;
    & + .list-item {
      margin-top: 15px;
    }
  }
}
[class~='line'] {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-line {
  line-height: 1.8;
  position: relative;
  .label {
    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
  .value {
    font-size: 16px;
    font-weight: 600;
    color: rgba(173, 173, 173, 1);
  }
}
.devider {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: -6px;
  margin-right: -6px;
  height: 1px;
  background-color: #484848;
  transform: scaleY(0.5);
}
.option-line {
  font-size: 14px;
  line-height: 1.6;
  .label {
    color: rgba(181, 181, 181, 1);
  }
  .value {
    color: rgba(255, 255, 255, 1);
  }
  .address {
    width: 190px;
    text-align: right;
    word-break: break-all;
  }

  //  {
  //   id: 0,
  //   name: '新建',
  // },
  // {
  //   id: 1,
  //   name: '进行中',
  // },
  // {
  //   id: 2,
  //   name: '完成',
  // },
  // {
  //   id: 3,
  //   name: '失败',
  // },
  .status-0 {
    color: #0fa94a;
  }
  .status-1 {
    color: #44bdf9;
  }
  .status-2 {
    color: #0fa94a;
  }
  .status-3 {
    color: #ef3d5e;
  }
}
</style>
