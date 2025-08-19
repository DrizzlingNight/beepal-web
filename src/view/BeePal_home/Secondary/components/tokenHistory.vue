<template>
  <div class="tokenHistory">
    <van-tabs
      v-model="active"
      :border="false"
      background="inherit"
      line-height="5"
      line-width="20"
    >
      <van-tab :title="$t('beePal.tokenDetail.all')"></van-tab>
      <van-tab :title="$t('beePal.tokenDetail.transfer')"></van-tab>
      <van-tab :title="$t('beePal.tokenDetail.gathering')"></van-tab>
    </van-tabs>
    <token-list
      :state="state"
      :list="list"
      @onRefresh="onRefresh"
      @goPage="goPage"
      @onLoad="onLoad"
    ></token-list>
    <div class="btnGroup">
      <van-button class="gathering_btn" @click="goGathering">
        {{ $t('beePal.tokenDetail.gathering') }}
      </van-button>
      <van-button class="transfer_btn" @click="goTransfer">
        {{ $t('beePal.tokenDetail.transfer') }}
      </van-button>
    </div>
  </div>
</template>

<script>
  import tokenList from './tokenList'
  import { Button, Cell, List, PullRefresh, Tab, Tabs } from 'vant'
  import { mapGetters } from 'vuex'

  export default {
    name: 'TokenHistory',
    components: {
      tokenList,
      [Tabs.name]: Tabs,
      [Tab.name]: Tab,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
      [Cell.name]: Cell,
      [Button.name]: Button,
    },
    model: {
      prop: 'list',
      event: 'update:list',
    },
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      total: {
        type: Number,
        default: 0,
      },
      token: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        active: 0,
        state: {
          loading: false,
          finished: false,
          refreshing: false,
        },
      }
    },
    computed: {
      ...mapGetters(['VG__getCoinInfoById']),
    },
    watch: {
      active() {
        this.state.refreshing = true
        this.$parent.page = 1
        this.onRefresh()
      },
    },
    mounted() {
      // this.$myConsole.log('tokenHistory.vue list', this.list)
    },
    methods: {
      goPage(item) {
        if (item.lightning || !item.tx_id) {
          return
        }
        // 2021.11.22 先把外部轉帳地址的跳轉拔掉
        // const coin = this.VG__getCoinInfoById(this.token.coin)
        // const chain_tx_check = coin.chain_tx_check
        // const url = chain_tx_check + item.tx_id
        // window.open(url)
      },
      onRefresh() {
        this.$parent.page = 1
        // 清空列表数据
        this.state.finished = false
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.state.loading = true
        this.onLoad()
      },
      onLoad() {
        if (this.state.refreshing) {
          this.$emit('update:list', [])
          this.state.refreshing = false
        }
        this.$emit('onLoad', () => {
          setTimeout(() => {
            // 加载状态结束
            this.state.loading = false
            // 数据全部加载完成
            if (this.list.length >= this.total) {
              this.state.finished = true
            }
          })
        })
      },
      goTransfer() {
        this.$router.push({
          name: 'transfer',
          params: {
            token: this.$route.params.token,
          },
        })
      },
      goGathering() {
        this.$router.push({
          name: 'gathering',
          params: {
            token: this.$route.params.token,
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  ::v-deep .van-tabs {
    border-bottom: 1px solid $BorderColor3;

    .van-tabs__line {
      background: $tabsActiveBorderBg;
    }

    .van-tab {
      color: $tabsInactiveColor;
      width: 90px;
      flex: inherit;
      font-size: 14px;

      &.van-tab--active {
        color: $labelColor1;
      }
    }
  }

  .tokenHistory {
    background: $pageBgColor;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .btnGroup {
      height: fit-content;
      box-sizing: border-box;
      padding: 10px 15px 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        width: 46%;
        height: 44px;
        border-radius: 8px;
        font-size: 15px;
        color: $cardColor;
        border: none;

        &.gathering_btn {
          background: $gatheringBtn;
        }

        &.transfer_btn {
          background: $transferBtn;
        }
      }
    }
  }
</style>
