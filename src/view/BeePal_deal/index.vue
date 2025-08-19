<template>
  <div class="deal">
    <my-head :tabs="tabs"></my-head>
    <div class="content">
      <div class="dealChange">
        <div
          :class="{ active: dealActive == 0 }"
          class="label ml5"
          @click="changeDeal(0)"
        >
          {{ $t('beePal.deal.buy') }}
        </div>
        <div
          :class="{ active: dealActive == 1 }"
          class="label ml40"
          @click="changeDeal(1)"
        >
          {{ $t('beePal.deal.sell') }}
        </div>
        <svg-icon
          icon-class="clock"
          class-name="clock"
          @click="$router.push('/otcHistory')"
        ></svg-icon>
        <van-popover
          v-model="showPopover"
          theme="dark"
          trigger="click"
          placement="bottom-end"
        >
          <div v-for="(item, index) in actions" :key="item.icon">
            <div class="flex row-v-c actionItem" @click="actionClick(item)">
              <svg-icon
                :class-name="item.icon"
                :icon-class="item.icon"
              ></svg-icon>
              <span>{{ $t(item.text) }}</span>
            </div>
            <van-divider v-if="index !== actions.length - 1"/>
          </div>
          <template #reference>
            <svg-icon icon-class="other" class-name="other"></svg-icon>
          </template>
        </van-popover>
      </div>
      <keep-alive>
        <component
          ref="component"
          :is="component"
          v-bind="params.attrs"
          v-on="params.listeners"
        />
      </keep-alive>
    </div>
    <!-- 购买弹窗 -->
    <buy-modal
      v-model="buyModal.show"
      :refer="buyModal.item"
      :forms="buyModal.forms"
      @toPay="openSecurityCodeModal"
    ></buy-modal>
    <!-- 出售弹窗 -->
    <sell-modal
      v-model="sellModal.show"
      :refer="sellModal.item"
      :forms="sellModal.forms"
      @toSell="openSecurityCodeModal"
    >
    </sell-modal>
    <!-- 安全驗證碼彈窗 -->
    <security-code-modal
      v-if="securityCodeModal.show"
      v-model="securityCodeModal.show"
      @securityCodeChange="securityCodeChange"
      @confrim="confirmOrder"
    />
    <!-- 交易小浮窗提示 -->
    <floating-ball v-if="isBuyFloatingBallShow" @gotoDetail="gotoDetail(G_oneBuyOrder, 'buy')">
      <template #head>
        <img
          :src="`/static/img/coins/BeePal/${G_oneBuyOrder.crypto_currency_code}.png`"
          width="44"
        />
      </template>
      <template slot-scope="{ direction }" slot="content">
        <div class="flex row-v-c row-between">
          <div>
            <div class="status">
              <span class="title">{{
                $t(buyerStatus[G_oneBuyOrder.myStatus].name)
              }}</span>
              <span class="time"
              >({{ G_oneBuyOrder.time | dateFormat('mm:ss') }})</span
              >
            </div>
            <div class="tip">
              {{ $t('beePal.deal.buyCoin', [G_oneBuyOrder.crypto_currency]) }}
            </div>
          </div>
          <van-icon :name="direction === 'right' ? 'arrow' : 'arrow-left'"/>
        </div>
      </template>
    </floating-ball>
    <!-- 卖币小浮窗 -->
    <floating-ball v-if="isSellFloatingBallShow" class="sellBall" @gotoDetail="gotoDetail(G_oneSellOrder, 'sell')">
      <template #head>
        <img
          :src="`/static/img/coins/BeePal/${G_oneSellOrder.crypto_currency_code}.png`"
          width="44"
        />
      </template>
      <template slot-scope="{ direction }" slot="content">
        <div class="flex row-v-c row-between">
          <div>
            <div class="status">
              <span class="title">{{
                $t(sellerStatus[G_oneSellOrder.myStatus].name)
              }}</span>
              <span class="time"
              >({{ G_oneSellOrder.time | dateFormat('mm:ss') }})</span
              >
            </div>
            <div class="tip">
              {{ $t('beePal.deal.sellCoin', [G_oneSellOrder.crypto_currency]) }}
            </div>
          </div>
          <van-icon :name="direction === 'right' ? 'arrow' : 'arrow-left'"/>
        </div>
      </template>
    </floating-ball>
  </div>
</template>

<script>
  import myHead from './components/head'
  import CardList from './components/cardList'
  import BuyModal from './components/buyModal'
  import SellModal from './components/sellModal'
  import Security from './components/security'
  import FloatingBall from '@/components/BeePalComp/floatingBall'
  import SecurityCodeModal from '@/components/dialog/SecurityCodeModal'
  import { dateFormat } from '@/utils/dateFormat'
  import { getUserWallet, getUserCertification } from '@/api'
  import { getDealList, pendBill, getOTCHistory, getOneUWallet, getCoinRate } from '@/api/beePal'
  import { setOrder } from './config'
  import { money_filter, supplementZero } from '@/utils/money'
  import { Divider, Icon, Popover } from 'vant'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Deal',
    components: {
      myHead,
      CardList,
      BuyModal,
      SellModal,
      Security,
      SecurityCodeModal,
      FloatingBall,
      [Popover.name]: Popover,
      [Divider.name]: Divider,
      [Icon.name]: Icon,
    },
    filters: {
      dateFormat,
    },
    data() {
      return {
        dealActive: 0, // 选择买卖币
        showPopover: false, // 展开other
        actions: [
          // 通过 actions 属性来定义菜单选项
          { text: 'beePal.deal.collection', icon: 'collection' },
          { text: 'beePal.deal.auth', icon: 'auth' },
        ],
        state: {
          // 下拉刷新和上拉加载的状态
          loading: false,
          finished: false,
          refreshing: false,
        },
        dealList: [], // 交易列表
        buyModal: {
          // 购买拉起弹窗
          show: false,
          item: { coin: {}}, // 对指定交易下单
          forms: {
            amount: null,
            rate: null,
            buyMode: null,
            type: 0, // 0 为按数量购买 1 为按金额购买
          },
        },
        sellModal: {
          // 出售拉起弹窗
          show: false,
          item: { coin: {}},
          forms: {
            amount: null,
            rate: null,
            buyMode: null,
            method: 0,
            channel: null,
            type: 0, // 0 为按数量购买 1 为按金额购买
          },
        },
        // 安全驗證碼彈窗
        securityCodeModal: {
          show: false,
          securityCode: '',
          orderType: '',
        },
        buyerStatus: require('./config').buyerStatus,
        sellerStatus: require('./config').sellerStatus,
        type: '', // sell 为出售 buy 为购买，在security中使用判断跳转为买家付款页面还是卖家付款页面
        subtend: {}, // 最终支付对象
        endForms: {}, // 最终支付表单
        securityShow: false,
        page: 1,
        component: CardList, // 当前选区更改子组件
        supportTrans: require('./config').supportTrans,
        count: 0, // 列表总数
      }
    },
    computed: {
      ...mapGetters([
        'VG__userInfo',
        'G_oneBuyOrder',
        'VG__show_coinList',
        'G_oneSellOrder',
        'G_singleCoin',
        'G_haveCoin',
        'G_singleOrderById',
        'G_userOrderList',
        'G_sellOrderList',
      ]),
      tabs() {
        return [
          this.$t('beePal.deal.shortcut'),
          this.$t('beePal.deal.optional'),
        ]
      },
      params() {
        switch (this.component.name) {
          case 'CardList':
            return {
              attrs: {
                state: this.state,
                dealActive: this.dealActive,
                'deal-list': this.dealList,
                'coin-list': this.VG__show_coinList,
              },
              listeners: {
                onRefresh: this.onRefresh,
                onChange: this.onChange,
                onLoad: this.onLoad,
                buyConfirm: this.buyConfirm,
                sellConfirm: this.sellConfirm,
              },
            }
        }
      },
      isBuyFloatingBallShow() {
        return this.G_oneBuyOrder && (this.G_oneBuyOrder.status === 1 || this.G_oneBuyOrder.status === 5) && this.G_oneBuyOrder.time > 0
      },
      isSellFloatingBallShow() {
        return this.G_oneSellOrder && (this.G_oneSellOrder.status === 1 || this.G_oneSellOrder.status === 5) && this.G_oneSellOrder.time > 0
      },
    },
    watch: {
      'buyModal.show'(newV, oldV) {
        if (newV === false) {
          setTimeout(() => {
            Object.assign(this.$data.buyModal, this.$options.data().buyModal)
          }, 290)
        }
      },
      'sellModal.show'(newV, oldV) {
        if (newV === false) {
          setTimeout(() => {
            Object.assign(this.$data.sellModal, this.$options.data().sellModal)
          }, 290)
        }
      },
      'G_oneBuyOrder.time'(newV, oldV) {
        // console.log(`oldV ${oldV} newV ${newV}`)
        if (this.isBuyFloatingBallShow && newV <= 0) {
          window.location.reload()
        }
      },
      'G_oneSellOrder.time'(newV, oldV) {
        // console.log(`oldV ${oldV} newV ${newV}`)
        if (this.isSellFloatingBallShow && newV <= 0) {
          window.location.reload()
        }
      },
      // 2021.11.23 會觸發無限發request，先拔掉
      // VG__show_coinList(newv) {
      //   if (newv.length) {
      //     this.onLoad()
      //   }
      // },
    },
    async created() {
      await this.getCoinList() // 獲取幣種
      await this.getCoinRate() // 获取币种汇率
      await this.AC_INITORDERLIST() // 初始化當前訂單列表
      await this.onLoad()
    },
    methods: {
      ...mapActions('user', ['VA__setUserWallet', 'VA__setUserInfo']),
      ...mapActions('BeePal', ['AC_ORDERLIST', 'AC_SELLORDERLIST', 'AC_INITORDERLIST', 'AC_COINRATE']),
      changeDeal(type) {
        this.dealActive = type
        this.onChange()
      },
      onRefresh() {
        // 清空列表数据
        this.state.finished = false
        this.page = 1
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
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
          if (this.dealList.length >= this.count) {
            this.state.finished = true
          }
        })
      },
      async onLoad() {
        // console.log('deal index onLoad')
        if (this.state.finished) return // 防止無限發request
        if (this.G_userOrderList.length === 0 && this.G_sellOrderList.length === 0) await this.getOnProgressOrder() // 如果沒有訂單資料就先去獲取前10筆
        // this.$myConsole.log('G_userOrderList', this.G_userOrderList)
        // this.$myConsole.log('G_sellOrderList', this.G_sellOrderList)
        // this.$myConsole.log('G_oneBuyOrder', this.G_oneBuyOrder)
        // this.$myConsole.log('G_oneSellOrder', this.G_oneSellOrder)
        if (this.state.refreshing) {
          this.dealList = []
          this.state.refreshing = false
        }
        if (!this.VG__show_coinList.length) {
          this.end()
          return
        }
        await this.getUserWallet() // 取得用戶錢包
        await this.getUserCertification(this.VG__userInfo.id) // 取得用戶認證等級
        const coin = this.VG__show_coinList[this.$refs.component.active].id
        const type = this.dealActive
        const status = 1 // status = 1 表示進行中，不展示已關閉的出價
        const params = {
          coin,
          type,
          status,
          page: this.page,
        }
        await getDealList(params).then(res => {
          if (
            !this.$refs.component ||
            coin !== this.VG__show_coinList[this.$refs.component.active].id ||
            type !== this.dealActive
          ) {
            return
          }
          res = res.data // 2021.08.10 配合新API，資料放res.data裡
          const result = res.results
          // const coinRate =
          //   res.results.length && this.G_singleCoin(result[0].coin.code)
          result.forEach(item => {
            const rate = Number(item.current_price) // 2021.08.17 新API，跟rate相關的由後端處理，直接對應current_price
            // 2021.08.17 新API，price由後端計算，不需要前端判斷rate_type去算
            // let rate = 0
            // switch (item.rate_type) {
            //   case 0:
            //     rate = Number(coinRate.rate)
            //     break
            //   case 1:
            //     rate = Number(coinRate.rate) + item.rate
            //     break
            //   case 2:
            //     rate = Number(coinRate.rate) - item.rate
            //     break
            // }
            const supportedTrans = []
            item.payment.forEach(item => {
              supportedTrans.push(this.supportTrans[item.type])
            })
            item.supportedTrans = supportedTrans // 支持支付方式
            item.avatar = item.user.avatar || require('@/assets/img/avatar.png') // 头像
            item.nickname = item.user.nickname || this.$t('base.noNicknameUser')
            item.amount = supplementZero(
              Number(item.amount).toFixed(coin.decimalPlaces),
              2,
            ) // 数量
            item.price = money_filter(item.current_price, 2) // 单价 // 2021.08.17 新API，price直接對應current_price
            item.endRate = rate // 2021.08.17 新API，跟rate相關的由後端處理
            item.ratio =
              item.user_bill_count === 0
                ? 0
                : (
                  Math.ceil(
                    (item.user_bill_completed_count / item.user_bill_count) * 10000,
                  ) / 100
                ).toFixed(2)
            item.temp_min = Number.parseFloat(item.min_trade_limit).toFixed(2) // 最小限额
            item.temp_max = Number.parseFloat(item.max_trade_limit).toFixed(2) // 最大限额
            item.max_trade_limit = money_filter(item.max_trade_limit, 2) // 最小限额经过格式化
            item.min_trade_limit = money_filter(item.min_trade_limit, 2) // 最大限额经过格式化
            this.dealList.push(item)
          })
          this.count = res.count
          this.page = this.page + 1
          setTimeout(() => {
            // 加载状态结束
            this.state.loading = false
            // 数据全部加载完成
            // console.log(`${this.dealList.length} ${this.count}`)
            if (this.dealList.length >= this.count) {
              this.state.finished = true
            }
          })
        })
      },
      getOnProgressOrder() {
        const params = {
          page: 1,
          page_size: 1, // 只獲取第一筆（最新那筆）訂單
          ordering: '-created_time', // ordering表示排序方式   created_time是排序的字段   '-'号表示从大到小
        }
        this.state.loading = true
        return getOTCHistory(params).then(async res => {
            res = res.data // 2021.08.10 配合新API，資料放res.data裡
            const results = res.results
            const buyList = []
            const sellList = []
            results.forEach(item => {
            // 更新訂單詳情 Start
            setOrder({ ...item }, res => {
              // this.$myConsole.log('setOrder', res)
              if (res.buyIn) {
                buyList.push(res)
                this.AC_ORDERLIST(buyList)
              } else {
                sellList.push(res)
                this.AC_SELLORDERLIST(sellList)
              }
            })
            // 更新訂單詳情 End
          })
        })
      },
      actionClick(action) {
        if (action.icon === 'collection') {
          this.$router.push('/otcPayment')
        } else if (action.icon === 'auth') {
          this.$router.push('/my/kyc')
        }
      },
      async noWalletTip(coin) {
        if (!this.G_haveCoin(coin.code)) {
          this.$toast(this.$t('beePal.deal.noCoin'))
          await this.getOneUWallet(coin) // 產生對應幣種錢包
          return false
        } else {
          return true
        }
      },
      async buyConfirm(item) {
        // this.$myConsole.log('buyConfirm', item)
        if (!this.noWalletTip(item.coin)) {
          this.onRefresh()
          return
        }

        if (
          this.buyModal.show ||
          this.securityShow
        ) {
          return
        }
        const base_certification = this.VG__userInfo.certification && this.VG__userInfo.certification.base_certification
        if (item.user === this.VG__userInfo.id) {
          this.$toast(this.$t('beePal.deal.isMeBuyTip'))
          return
        }
        if (base_certification) {
          this.buyModal.show = true
          this.buyModal.item = item
        } else {
          this.$dialog
            .confirm({
              message: this.$t('beePal.deal.needAuthTip'),
              className: 'dialog',
              confirmButtonText: this.$t('beePal.deal.authNow'),
              cancelButtonText: this.$t('beePal.deal.cancel'),
            })
            .then(() => {
              this.$router.push('/my/kyc')
            })
        }
      },
      async sellConfirm(item) {
        if (!this.noWalletTip(item.coin)) {
          this.onRefresh()
          return
        }

        if (
          this.sellModal.show ||
          this.securityShow
        ) {
          return
        }
        const base_certification = this.VG__userInfo.certification && this.VG__userInfo.certification.base_certification
        if (item.user === this.VG__userInfo.id) {
          this.$toast(this.$t('beePal.deal.isMeSellTip'))
          return
        }
        if (base_certification) {
          this.sellModal.show = !this.sellModal.show
          this.sellModal.item = item
        } else {
          this.$dialog
            .confirm({
              message: this.$t('beePal.deal.otcAuthTip'),
              className: 'dialog',
              confirmButtonText: this.$t('beePal.deal.authNow'),
              cancelButtonText: this.$t('beePal.deal.cancel'),
            })
            .then(() => {
              this.$router.push('/my/kyc')
            })
        }
      },
      openSecurityCodeModal(orderType) {
        this.securityCodeModal.show = true
        this.securityCodeModal.orderType = orderType
      },
      securityCodeChange(code) {
        // console.log('securityCodeChange', code)
        this.securityCodeModal.securityCode = code
      },
      confirmOrder() {
        this.securityCodeModal.show = false
        this[this.securityCodeModal.orderType]()
      },
      toPay() {
        const params = {
          trade: Number(this.subtend.id),
          amount: Number(this.endForms.type === 0 ? this.endForms.amount : this.endForms.rate),
          security_code: this.securityCodeModal.securityCode,
        }
        pendBill(params).then(res => {
          if (res.code === 0) {
            // 更新訂單詳情 Start
            setOrder(res.data, res2 => { // 2021.08.18 配合新API，資料放res.data裡
              const buyList = this.G_userOrderList
              buyList.unshift(res2) // 將新的訂單插入到G_userOrderList的第一筆
              this.AC_ORDERLIST(buyList)
              this.gotoDetail(res.data, 'buy')
            })
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('beePal.deal.unknownErr'))
          }
          // 更新訂單詳情 End
        }).catch((err) => {
          console.log('toPay-err', err)
          this.$toast(this.$t('beePal.deal.unknownErr'))
        })
      },
      toSell() {
        const params = {
          trade: Number(this.subtend.id),
          amount: Number(this.endForms.type === 0 ? this.endForms.amount : this.endForms.rate),
          // payment: {
          //   id: this.endForms.channel.id,
          //   type: this.endForms.channel.type,
          //   account_name: this.endForms.channel.account_name,
          //   bank_name: this.endForms.channel.bank_name,
          //   bank_address: this.endForms.channel.bank_address,
          //   account_number: this.endForms.channel.account_number,
          // },
          payment_id: this.endForms.channel.id, // 2021.11.05 新的API 下單出售廣告`, payment改成直接帶payment_id
          security_code: this.securityCodeModal.securityCode,
        }
        pendBill(params).then(res => {
          if (res.code === 0) {
            // 更新訂單詳情 Start
            setOrder(res.data, res2 => { // 2021.08.18 配合新API，資料放res.data裡
              const sellList = this.G_sellOrderList
              sellList.unshift(res2) // 將新的訂單插入到G_sellOrderList的第一筆
              this.AC_SELLORDERLIST(sellList)
              this.gotoDetail(res.data, 'sell')
            })
            // 更新訂單詳情 End
            // setOrder(res.data, () => { // 2021.08.18 配合新API，資料放res.data裡
            //   this.gotoDetail(res.data, 'sell')
            // })
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('beePal.deal.unknownErr'))
          }
        }).catch((err) => {
          console.log('toSell-err', err)
          this.$toast(this.$t('beePal.deal.unknownErr'))
        })
      },
      gotoDetail(item, type) {
        let params = {
          orderid: item.id,
        }
        params = Object.assign(params, this.buyerStatus[item.myStatus].params, this.sellerStatus[item.myStatus].params)
        this.$router.push({
          name: type === 'buy'
            ? this.buyerStatus[item.myStatus].path
            : this.sellerStatus[item.myStatus].path,
          params,
        })
      },
      async getUserWallet() {
        await getUserWallet()
        .then(async res => {
          const userWallet = res.data.results
          this.$Storage.setLocal('userWallet', userWallet)
          this.VA__setUserWallet(userWallet)
        })
        .catch(err => {
          console.log('userWallet-err', err)
          // removeCaches() // 有錯誤的話就清除Storage
        })
      },
      async getUserCertification(user) {
        const userInfo = { ...this.VG__userInfo }
        await getUserCertification(user)
          .then(async res => {
            const certification = res.data
            userInfo.certification = certification
            // this.$myConsole.info('userInfo', userInfo)
            this.$Storage.setLocal('userInfo', userInfo)
            this.VA__setUserInfo(userInfo)
          })
          .catch(err => {
            userInfo.certification = {}
            console.log('getUserCertification-err', err)
            // this.$myConsole.info('userInfo', userInfo)
            this.$Storage.setLocal('userInfo', userInfo)
            this.VA__setUserInfo(userInfo)
          })
      },
      async getOneUWallet(coin) {
        const params = {
          user: this.VG__userInfo.id,
          coin: coin.id,
        }

        await getOneUWallet(params).then(res => {
          if (res.code === 0) {
            // do nothing
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('base.unknownErr'))
          }
        }).catch(err => {
          console.log('getOneUWallet-err', err)
          this.$toast(this.$t('base.unknownErr'))
        })
      },
      async getCoinRate() {
        await getCoinRate()
          .then(res => {
            // this.$myConsole.log('getCoinRate res:', res)
            // 以下從getCoinRate獲得的response拼出G_coinRate匯率對應清單
            const coin = res.data
            const temp = {}
            coin.forEach(item => {
              let code = ''
              let rate = 1
              if (item.from_coin.id === 9) {
                code = item.to_coin.code
                rate = Number(1 / item.rate)
              } else {
                code = item.from_coin.code
                rate = Number(item.rate)
              }
              temp[code] = rate
            })
            // this.$myConsole.log('BeePal App temp', temp)
            this.AC_COINRATE(temp)
          })
          .catch(error => {
            console.error(error)
            // this.getCoinRate()
          })
      },
       async getCoinList() {
        // 去请求数据
        try {
          await this.$store.dispatch('data/getCoinList', null, { root: true })
        } catch (err) {
          console.log('getCoinList-err', err)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .deal {
    height: 100%;
    background-color: $cardBgColor;
    position: relative;
    overflow: hidden;
  }

  .content {
    padding-top: 60px;
    padding-bottom: 58px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .dealChange {
    display: flex;
    align-items: center;
    padding: 10px 15px 0;
    color: $cardColor;
    font-size: 20px;
    min-height: 40px;

    .label {
      font-size: 15px;
      font-weight: normal;
      transition: all 0.3s;

      &.active {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .clock {
      margin-left: auto;
      margin-right: 15px;
    }
  }

  .actionItem {
    padding: 12px 15px;

    &:active {
      background-color: rgba($color: $pageBgColor, $alpha: 0.08);
    }

    &:first-child {
      padding-top: 15px;
    }

    &:last-child {
      padding-bottom: 15px;
    }

    font-size: 14px;

    .svg-icon {
      font-size: 20px;
      margin-right: 10px;
    }
  }

  .van-divider {
    margin: 0 auto;
    width: 80%;
    color: #666;
    border-color: inherit;
  }

  ::v-deep .ball {
    position: fixed;
    top: calc(100% - 210px);

    .content {
      width: fit-content;
      margin-left: 5px;
      margin-right: 5px;
      white-space: nowrap;

      .status {
        .title {
          color: $labelColor1;
          font-weight: bold;
        }

        .time {
          margin-right: 3px;
          margin-left: 3px;
          width: 42px;
          color: $labelColor13;
        }

        font-size: 12px;
        display: flex;
      }

      .tip {
        font-size: 12px;
        color: $labelColor20;
      }

      .van-icon {
        font-size: 18px;
        color: $labelColor20;
      }
    }
  }

  ::v-deep .sellBall {
    top: calc(100% - 210px);
  }
</style>
