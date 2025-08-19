// 发现频道 图片轮转
import { settings } from '@/config'
import store from '@/store'

export const swiperLists = [
  // beex
  {
    name: '',
    src: require('@/view/find/banner_1.png'),
  },
  {
    name: '',
    src: require('@/view/find/banner_2.jpg'),
  },
  {
    name: '',
    src: require('@/view/find/banner_3.jpg'),
  },
  // {
  //   name: '',
  //   src: require('@/view/find/banner_4.png')
  // }
]

// 发现频道 热门应用
export const hotApp = [
  // {
  //   name: '',
  //   src: require('@/view/find/hot_1.png')
  // },
  // {
  //   name: '',
  //   src: require('@/view/find/hot_2.png')
  // },
]

// 语言映射
export const lang = {
  en: 1,
  cn: 2,
  tw: 3,
}

// 获取主要币种
export function getCoin() {
  const mainCoin = settings.MAIN_COIN
  const coinList = store.getters.VG__coinList
  for (let i = 0; i < coinList.length; i++) {
    if (coinList[i].code === mainCoin) {
      return coinList[i].id
    }
  }
  return null
}

export const coinType = [
  {
    show: true,
    name: 'TransferIn',
    type: 0,
    // "style": "#1B88FF", // 蓝色系
    // "style": "#20DDC1" // 绿
    style: '#FFC100', // 黄
  },
  {
    show: true,
    name: 'TransferOut',
    type: 1,
    //  style: '#004898', // 蓝色系
    // "style": "#024545" // 绿
    style: '#C76300', // 黄
  },
  {
    show: true,
    name: 'BillFreeze',
    type: 2,
    style: '#002656',
  },
  {
    show: true,
    name: 'BillReturn',
    type: 3,
    style: '#002656',
  },
  {
    show: true,
    name: 'BillFinish',
    type: 4,
    style: '#000000',
  },
  {
    show: true,
    name: 'TransferOutReturn',
    type: 5,
    style: '#62acff',
  },
  {
    show: true,
    name: 'PoolUp',
    type: 6,
    style: '#0079ff',
  },
  {
    show: true,
    name: 'PoolDown',
    type: 7,
    style: '#aad2ff',
  },
  {
    show: true,
    name: 'TransactionOutCollection',
    type: 8,
    style: '#00a972',
  },
  {
    show: true,
    name: 'TransactionOutCollectionReturn',
    type: 9,
    style: '#00ffac',
  },
  {
    show: true,
    name: 'TransferOutFee',
    type: 10,
    style: '#9cf3d6',
  },
  {
    show: true,
    name: 'TransferOutFeeReturn',
    type: 11,
    style: '#e3b7f9',
  },
  {
    show: true,
    name: 'CreditCoin',
    type: 12,
    style: '#a27db5',
  },
  {
    show: true,
    name: 'CreditCoinSettle',
    type: 13,
    style: '#9e1da0',
  },
  {
    show: true,
    name: 'TransferIn',
    type: 14,
    style: '#1B88FF',
    mergeType: 0,
  },
  {
    show: true,
    name: 'TelegramGameBet',
    type: 15,
    style: '#4b8288',
  },
  {
    show: true,
    name: 'TelegramGameBetReturn',
    type: 16,
    style: '#7ddee8',
  },
  {
    show: true,
    name: 'TelegramGameWin',
    type: 17,
    style: '#e0fbb6',
  },
  {
    show: true,
    name: 'TranInwardDepositTransfersferIn',
    type: 18,
    style: '#ffffff',
  },
  {
    show: true,
    name: 'InwardWithdrawTransfer',
    type: 19,
    style: '#123123',
  },
]

export function getCoinType(type) {
  if (!type && type !== 0) {
    return coinType
  }
  let obj = {}
  coinType.forEach(item => {
    if (item.type == type) {
      obj = item
    }
  })
  return obj
}
