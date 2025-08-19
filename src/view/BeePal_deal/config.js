import { getAd } from '@/api/beePal'
import { dateFormat } from '@/utils/dateFormat'
import store from '@/store'

export const supportTrans = {
  0: 'bank',
  1: 'zfb',
  2: 'wexin',
  'bank': 0,
  'zfb': 1,
  'wexin': 2,
}

export const orderStatus = {
  1: 'onprogress',
  2: 'complete',
  3: 'error',
  4: 'past',
  5: 'paid',
  6: 'onprogress',
}

export const buyerStatus = {
  0: { name: 'beePal.payment.pay', path: 'payment' },
  1: { name: 'beePal.lastLap.waitConfirm', path: 'lastLap' },
  2: { name: 'beePal.payfor.payfor', path: 'payfor' },
  3: { name: 'beePal.lastLap.success', path: 'lastLap', params: { success: true }},
  4: { name: 'beePal.payment.dealCanceled', path: 'payment', params: { cancel: true }},
}

export const sellerStatus = {
  0: { name: 'beePal.waiting.title1', path: 'waiting', params: {}},
  1: { name: 'beePal.waiting.title2', path: 'waiting', params: { received: true }},
  2: { name: 'beePal.waiting.title2', path: 'waiting', params: { received: true }},
  3: { name: 'beePal.lastLap.success', path: 'waiting', params: { haveReceived: true }},
  4: { name: 'beePal.payment.dealCanceled', path: 'waiting', params: { cancel: true }},
}

export function setOrder(res, callback) {
  res.time = res.tempTime =
    new Date(res.expired_time) - new Date() < 0
      ? 0
      : new Date(res.expired_time) - new Date()
  // res.myStatus = res.status === 6 ? 1 : 0 // 2021.07.29 這個判斷有問題，暫時註解掉
  // myStatus要依據status對照上面的「buyerStatus/sellerStatus」
  if (res.status === 1) {
    // 如果status為1代表交易在進行中
    // console.log(`訂單ID：${res.id}，status為1，交易進行中`)
    res.myStatus = 0
  } else if (res.status === 5) {
    // status為5代表訂單已付款（待賣家確認）
    // console.log(`訂單ID：${res.id}，status為5，交易進行中`)
    res.myStatus = 1
  } else {
    // status為2代表成功，為3代表失敗
    // console.log(`訂單ID：${res.id}，status為${res.status}，交易${res.status === 2 ? '成功' : '失敗'}`)
    res.myStatus = res.status === 2 ? 3 : 4
  }
  const buyIn = getThisType(res)
  res.buyIn = buyIn
  if (res.time !== 0) {
    res.timer = setInterval(() => {
      if (res.time <= 1000) {
        // if (res.status !== 6 && res.type === 4) {
        //   cancelBill(res.id)
        //     .then(res => {
        //       store.dispatch('BeePal/AC_REMOVEORDER', res.id)
        //     })
        //     .catch(() => {
        //       store.dispatch('BeePal/AC_REMOVEORDER', res.id)
        //     })
        // }
        clearInterval(res.timer)
        res.timer = null
      }
      res.time -= 1000
    }, 1000)
  }
  res.created_time = dateFormat(res.created_time, 'MM-dd hh:mm')
  res.amount = Number(res.amount)
  res.price = Number(res.amount) * Number(res.rate)
  res.payment = res.payment ? res.payment : null
  if (res.status === 2) {
    if (callback) {
      callback(res)
    }
    return
  }
  getAd(res.trade).then(res2 => {
    const supportedTrans = []
    // 2021.08.13 新API channels換成payment
    res2 = res2.data // 2021.08.10 配合新API，資料放res.data裡
    res2.payment.forEach(item => {
      supportedTrans.push(supportTrans[item.type])
    })
    res.supportedTrans = supportedTrans // 支持支付方式
    res.trade = res2
    if (callback) {
      callback(res)
    }
  })
}

function getThisType(item) {
  const userid = store.getters.VG__userInfo && store.getters.VG__userInfo.id
  // if (item.merchant.id === userid) return true
  // else if (item.handler.id === userid) return false
  // 2021.08.13 新API merchant換成buyer handler換成seller
  if (item.buyer.id === userid && item.seller.id === userid) {
    return 2
  } else if (item.buyer.id === userid) {
    return 1
  } else if (item.seller.id === userid) {
    return 0
  } else return -1
}
