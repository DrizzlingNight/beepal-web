import { settings } from '@/config'
import { money_filter, supplementZero } from '@/utils/money'
// import myConsole from '@/utils/console'
import Storage from '@/utils/storage'

export default {
  // 我的钱包
  G_wallet: state => {
    const wallet = state.BeePal.wallet[0] ? state.BeePal.wallet : Storage.getLocal('G_wallet') || state.BeePal.wallet
    Storage.setLocal('G_wallet', wallet)
    return wallet
  },
  G_wallet_list: (state, getters) => {
    // myConsole.log('getters.G_wallet', getters.G_wallet)
    const res = getters.G_wallet.list
      ? getters.G_wallet.list.filter(o => {
        const coin = getters.VG__getCoinInfoById(o.coin)
        return coin && coin.isCrypto === true
      })
      : getters.G_wallet.list
    return res
  },
  // G_realCurrency: state => state.BeePal.realCurrency,
  // 用户订单列表
  G_userOrderList: state => state.BeePal.userOrderList,
  // 获取单个购买订单
  G_oneBuyOrder: state => state.BeePal.userOrderList.length > 0
    ? state.BeePal.userOrderList[0]
    : null,
  // 用户订单列表
  G_sellOrderList: state => state.BeePal.sellOrderList,
  G_cancelOrderList: state => state.BeePal.cancelOrderList,
  // 获取单个出售订单
  G_oneSellOrder: state =>
    state.BeePal.sellOrderList.length > 0
      ? state.BeePal.sellOrderList[0]
      : null,
  G_singleOrderById: state => val => {
    const order = state.BeePal.userOrderList.find(o => o.id === val) ||
                  state.BeePal.sellOrderList.find(o => o.id === val) ||
                  state.BeePal.cancelOrderList.find(o => o.id === val)
    return order
  },
  // 汇率表
  G_coinRate: state => state.BeePal.coinRate,
  // 获取单个币种信息
  G_singleCoin: (state, getters) => val => {
    // console.log('G_singleCoin val', val)
    if (!val) return
    const realCurrency = Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol
    const G_coinRate = getters.G_coinRate
    const userWallet = getters.VG__getWalletByCode(val)
    const coinInfo = getters.VG__getCoinInfoByCode(val)

    // 計算貨幣匯率 Start

    let rate = 1

    if (coinInfo.id === 9) {
      rate = 1
    } else {
      rate = G_coinRate[coinInfo.code]
    }

    // 如果法幣不是USD，就要依照匯率表再做一次轉換
    if (realCurrency !== 'USD' && typeof rate !== 'undefined') {
      rate = rate / G_coinRate[realCurrency]
    }
    // 計算貨幣匯率 End

    let token = {}

    token = getters.G_wallet.obj && getters.G_wallet.obj[val]
    // console.log(`${!coinInfo} ${!token} ${!G_coinRate}`)
    if (!coinInfo || !token || !G_coinRate) return { have: false }
    token.amount = supplementZero(
      Number(token.amount).toFixed(coinInfo.decimalPlaces),
      2,
    )
    token.price = rate
      ? money_filter(rate * token.amount, 2)
      : '--'
    token.address = userWallet && userWallet.address
    token.withdrawFee = supplementZero(
      Number(coinInfo.withdrawFee).toFixed(coinInfo.decimalPlaces),
      2,
    )
    token.withdrawPrice = rate
      ? money_filter(rate * token.withdrawFee, 2)
      : '--'
    token.rate = rate || '--'
    token.withdrawFeeInner = coinInfo.withdrawFeeInner
    token.decimal = coinInfo.decimalPlaces
    token.coin_name = coinInfo.name
    token.coin_chain = coinInfo.chain
    return token
  },
  // 返回是否有该币种
  G_haveCoin: (state, getters) => val => {
    // console.log('G_haveCoin val', val)
    const userWallet = getters.VG__getWalletByCode(val)
    if (!userWallet) return false
    else return userWallet
  },
}
