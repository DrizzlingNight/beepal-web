export const supportCoin = [
  {
    id: 6,
    name: 'UDST',
    code: 'ETH_USDT',
  },
  {
    id: 7,
    name: 'BAP',
    code: 'EOS_BAP',
  },
  {
    id: 9,
    name: 'TRON_USDT',
    code: 'TRON_USDT',
  },
  {
    id: 5,
    name: 'TRX',
    code: 'TRON',
  },
  {
    id: 8,
    name: 'ETH',
    code: 'ETH',
  },
  {
    id: 4,
    name: 'EOS',
    code: 'EOS_EOS',
  },
]

export const supportMethod = [
  'bank',
  'zfb',
  'wexin',
]

export const methodMap = {
  0: 'bank',
  1: 'zfb',
  2: 'wexin',
  'bank': 0,
  'zfb': 1,
  'wexin': 2,
}

export const paymentIdMap = {
  'bank': 1,
  'zfb': 2,
  'wexin': 3,
}

export const offerType = [
  'sell',
  'buy',
]

export const typeMap = {
  0: 'sell',
  1: 'buy',
  'sell': 0,
  'buy': 1,
}

export const supportRate = [
  'fixedPrice',
  'marketPrice',
]

export const rateMap = {
  0: 'fixedPrice',
  1: 'marketPrice',
  'fixedPrice': 0,
  'marketPrice': 1,
}

export const orderStatusList = [
  1,
  2,
  3,
  5
]

export const supportTrans = {
  0: 'bank',
  1: 'zfb',
  2: 'wexin',
  'bank': 0,
  'zfb': 1,
  'wexin': 2,
}

export default { supportCoin, supportMethod, methodMap, paymentIdMap, offerType, typeMap, supportRate, rateMap, orderStatusList, supportTrans }

