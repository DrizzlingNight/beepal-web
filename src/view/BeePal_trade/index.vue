<template>
  <div :class="{ tradeList: active !==0 }" class="trade">
    <my-head goBackPath="/home"></my-head>
    <my-tabs ref="tabs" :tabs="tabs" :before-change="beforeChange" :default-active="0" @change="onChange"></my-tabs>
    <keep-alive>
      <component
        ref="component"
        :is="component"
        v-bind="params.attrs"
        v-on="params.listeners"
      />
    </keep-alive>
  </div>
</template>

<script>
import myHead from './components/head'
import myTabs from './components/tabs'
import CardList from './components/cardList'
import OverviewCardList from './components/overviewCardList'
import { getTradeList } from '@/api'
import { Divider, Icon, Popover } from 'vant'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Trade',
  components: {
    myHead,
    myTabs,
    CardList,
    OverviewCardList,
    [Popover.name]: Popover,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
  },
  data() {
    return {
      isMounted: false,
      state: {
        // 下拉刷新和上拉加载的状态
        loading: false,
        finished: false,
        refreshing: false,
      },
      tradeList: [], // 掛單列表
      page: 1,
      count: 0, // 列表总数
      component: OverviewCardList, // 当前选区更改子组件
      supportTrans: require('./config').supportMethod, // 支持的支付方式
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    tabs() {
      return [
        this.$t('beePal.trade.overview'),
        this.$t('beePal.trade.sellOffer'),
        this.$t('beePal.trade.buyOffer'),
      ]
    },
    active() {
      if (!this.isMounted) return 0
      return this.$refs.tabs.active
    },
    params() {
      switch (this.component.name) {
        case 'CardList':
          return {
            attrs: {
              state: this.state,
              tabs: this.tabs,
              active: this.active,
              'trade-list': this.tradeList,
            },
            listeners: {
              onRefresh: this.onRefresh,
              onChange: this.onChange,
              onLoad: this.onLoad,
            },
          }
        case 'OverviewCardList':
          return {
            attrs: {
              state: this.state,
              tabs: this.tabs,
            },
            listeners: {
              onRefresh: this.onRefresh,
              onChange: this.onChange,
              onLoad: this.onLoad,
            },
          }
      }
    },
  },
  watch: {
    // 為了讓 出售出價/買入出價 tab在loading完後也能觸發改變active寬度而掛的hook
    'state.loading'(newV, oldV) {
      if (!newV) {
        this.changeWidth(this.active)
      }
    }
  },
  created() {
    if (this.VG__userInfo.certification_level !== 2) {
      this.$dialog
        .confirm({
          message: this.$t('beePal.trade.needAdvancedAuth'),
          className: 'dialog',
          confirmButtonText: this.$t('base.goKyc'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          this.$router.push('/my/kyc')
        })
        .catch(() => {
          this.$router.push('/home')
          window.location.reload()
        })
    } else {
      this.onRefresh()
    }
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    ...mapActions('BeePal', ['AC_ORDERLIST', 'AC_SELLORDERLIST', 'AC_INITORDERLIST']),
    onRefresh() {
      // 清空列表数据
      this.state.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.page = 1
      this.state.loading = true
      this.onLoad()
    },
    onChange() {
      this.state.refreshing = true
      this.onRefresh()
    },
    end() {
      setTimeout(() => {
        // 加载状态结束
        this.state.loading = false
        // 数据全部加载完成
        if (this.tradeList.length >= this.count) {
          this.state.finished = true
        }
      })
    },
    async onLoad() {
      // console.log('trade index onLoad')
      // 如果是刷新觸發，就把數據清空，刷新狀態重置

      // this.changeWidth(this.active)

      if (this.state.refreshing) {
        this.tradeList = []
        this.state.refreshing = false
      }

      await this.getTradeList()

      this.count = this.tradeList.length
      this.end()
    },
    async getTradeList() {
      const status = 1 // status = 1 表示進行中，不展示已關閉的出價
      const params = {
        user: this.VG__userInfo.id,
        type: this.active === 1 ? 0 : 1,
        status
      }
      await getTradeList(params).then(res => {
        if (res.code === 0) {
          const result = res.data.results
          const list = []
          result.forEach(item => {
            // 設置支持的支付方式 Start
            const supportedTrans = []
             item.payment.forEach(item => {
              supportedTrans.push(this.supportTrans[item.type])
            })
            item.supportedTrans = supportedTrans // 支持的支付方式
            item.avatar = item.user.avatar || require('@/assets/img/avatar.png') // 頭像
            // 設置支持的支付方式 End
            list.push(item)
          })
          this.tradeList = [...list]
        } else if (this.$t(`errorCode.${res.code}`)) {
          // this.$toast(this.$t(`errorCode.${res.code}`))
          this.tradeList = []
        } else {
          // this.$toast(this.$t('base.unknownErr'))
          this.tradeList = []
        }
      }).catch(err => {
        console.log('getTradeList-err', err)
        this.tradeList = []
      })
    },
    beforeChange(index) {
      if (index === 0) {
        this.component = OverviewCardList
      } else {
        this.component = CardList
      }
      return true
    },
    changeWidth(active) {
      const width = document.querySelectorAll('.van-tab')[active].clientWidth
      const line = document.querySelector('.van-tabs__line')
      line.style.width = width - 6 + 'px'
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.trade {
  &.tradeList {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
}

</style>
