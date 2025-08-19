<script>
  import { getCoinRate, getOTCHistory } from '@/api/beePal'
  import { mapActions, mapGetters } from 'vuex'
  import { setOrder } from '@/view/BeePal_deal/config'
  import { lang } from '@/config/mayfly/dgc'
  // import { createChannel } from '@/api'
  import Storage from '@/utils/storage'

  export default {
    name: 'BeePalMixin',
    data() {
      return {
        interval: null,
        token: Storage.getLocal('token')
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo', 'G_userOrderList', 'G_sellOrderList']),
    },
    watch: {
      VG__userInfo(val, oldVal) {
        // 2021.08.20 暫時先加判斷，有問題再改
        if (this.token) {
        //   console.log('VG__userInfo change')
          // if (val && val.id !== (oldVal && oldVal.id)) {
            this.__getCoinList() // 獲取幣種
            this.getCoinRate() // 获取币种汇率
            this.AC_UPDATEWALLET() // 获取beePal钱包（余额）的接口
            // this.getOnProgressOrder() // 获取正在进行的订单 //FIXME: 2021.08.13 會導致OTC交易紀錄錯誤，先註解掉
            // 2021.08.03 騰訊相關beepal用不到，先註解掉
            // this.T__init() // 腾讯IM初始化
            // this.T__Login() // 腾讯IM登录

            // 获取公告 （tpay的功能）
            const params = {
              page: 1,
              page_size: 10,
              search: lang[this.$i18n.locale],
            }
            this.VA__GetNotices(params)
            this.VA__setAdressList() // 获取通讯录 （tpay的功能）
          // }
        }
      },
    },
    beforeDestroy() {
      clearInterval(this.interval)
      this.interval = null
    },
    methods: {
      ...mapActions('BeePal', [
        'AC_UPDATEWALLET',
        'AC_COINRATE',
        'AC_ORDERLIST',
        'AC_SELLORDERLIST',
        'AC_REMOVEORDER',
        'AC_UPDATEORDER',
      ]),
      ...mapActions('timweb', ['T__init', 'T__Login']),
      ...mapActions('tpay', ['VA__setAdressList']),
      ...mapActions('user', ['VA__setUserInfo']),
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
       async __getCoinList() {
        // 去请求数据
        try {
          await this.$store.dispatch('data/getCoinList', null, { root: true })
        } catch (err) {
          console.log('getCoinList-err', err)
        }
      },
      getOnProgressOrder(status) {
        const params = {
          // type: 4,
          // status,
          // do: true,
        }
        getOTCHistory(params).then(res => {
          // console.log('getOTCHistory: res.data.results', res.data.results)
          res = res.data // 2021.08.10 配合新API，資料放res.data裡
          const results = res.results
          if (results.length === 0) return
          // 2021.07.29 這個filter有問題，暫時註解掉
          // res = res.filter(item => {
          //   return item.status === 1 || item.status === 6
          // })
          // this.AC_ORDERLIST([])
          // this.AC_SELLORDERLIST([])
          results.forEach(item => {
            setOrder(item, res => {
              if (res.buyIn) {
                const buyList = this.G_userOrderList
                buyList.push(res)
                this.AC_ORDERLIST(buyList)
              } else {
                const sellList = this.G_sellOrderList
                sellList.push(res)
                this.AC_SELLORDERLIST(sellList)
              }
            })
          })
        })
      },
    },
  }
</script>
