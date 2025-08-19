// list, kf, kt, val, _default
import { getKtFromListByKf } from '@/utils'
import storage from '@/utils/storage'
import beePalGetters from './modules/BeePal/getters'
// import myConsole from '@/utils/console'

let getters = {
  footerbarVisible: state => state.app.footerbarVisible,
  thirdPartyList: state => state.app.thirdPartyList,
  isResetPasswordValidation: state => state.app.isResetPasswordValidation,
  coolDownTime: state => state.app.coolDownTime,
  isCoolDown: state => state.app.isCoolDown,
  isTimeout: state => state.app.isTimeout,
  VG__userInfo: state => state.user.userInfo || storage.getLocal('userInfo'),
  VG__userChannel: state => state.user.userChannel,
  VG__coinList: state => storage.getLocal('coinList') || state.data.coinList,
  supportCoin: state => {
    const coinList = storage.getLocal('coinList') || state.data.coinList
    const list = coinList.filter(item => item.isCrypto && item.active)
    const supportCoin = list.map(item => {
      return {
        id: item.id,
        name: item.name,
        code: item.code,
      }
    })
    return supportCoin
  },
  VG__crypto_coinList: state => state.data.coinList.filter(o => o.isCrypto),
  VG__show_coinList: state => state.data.coinList.filter(o => o.is_show && o.isCrypto),
  VG__coinListWithoutCny: state => state.data.coinList.filter(o => o.id !== 1), // 1是cny的id
  VG__getCoinLabelById: state => val =>
    getKtFromListByKf(state.data.coinList, 'id', 'label', val, ''),
  VG__getCoinInfoById: state => val => {
    const coinList = storage.getLocal('coinList') || state.data.coinList
    const coin = coinList.find(o => o.id === val)
    return coin
  },
  VG__getCoinInfoByCode: state => val => {
    const coinList = storage.getLocal('coinList') || state.data.coinList
    const coin = coinList.find(o => o.code === val)
    return coin
  },
  VG__getCoinIdByLabel: state => val =>
    getKtFromListByKf(state.data.coinList, 'label', 'id', val, -1),
  VG__getUSDTId: state =>
    getKtFromListByKf(state.data.coinList, 'label', 'id', 'USDT', -1),
  VG__getCoinDecimalPlacesById: state => val =>
    getKtFromListByKf(state.data.coinList, 'id', 'decimalPlaces', val, 4),
  VG__getCoinDecimalPlacesByLabel: state => val =>
    getKtFromListByKf(state.data.coinList, 'label', 'decimalPlaces', val, 4),
  VG__getCoinDecimalPlacesByCode: state => val =>
    getKtFromListByKf(state.data.coinList, 'label', 'code', val, 4),

  VG__userWallet: state => state.user.userWallet,
  VG__getWalletById: state => val =>
    getKtFromListByKf(state.user.userWallet, 'coin', 'address', val, ''),
  VG__getWalletByCode: state => val => {
    // myConsole.info('val', val)
    // myConsole.info('user.userWallet', state.user.userWallet)
    return state.user.userWallet.find(o => o.coin_code === val)
  },
  VG__getWalletByCoin: state => val =>
    state.user.userWallet.find(o => o.coin === val),
  VG__getTIM: state => state.timweb.TIM,

  // tpay 中的功能
  TPG__getFriends: state => val => {
    // myConsole.info('state.tpay', state.tpay)
    return state.tpay.friends.find(o => o.friend.id === val)
  },

  // 以下为腾讯IM的getters内容
  TG__getConversations: state => state.timweb.conversations,
  TG__haveConversations: state => val => state.timweb.conversations.find(o => o.conversationID === val),
  TG__get_one_msg: state => (val) => state.timweb.to_user_msg[val],
  TG__msgChange: state => state.timweb.msgChange,
  TG__status: state => state.timweb.login && state.timweb.ready,
}

getters = Object.assign(getters, beePalGetters)
export default getters
