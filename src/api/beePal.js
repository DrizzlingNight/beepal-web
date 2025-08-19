import request from '@/utils/request'

// beePal 個人錢包
export function getBeePalWallet() {
  return request({
    url: `/user/balance/`,
    method: 'get',
  })
}

// beePal 匯率
export function getCoinRate() {
  return request({
    url: `/coin/rate/`,
    method: 'get',
  })
}

// beePal 單個幣種訂單詳情
export function coinTransaction(data) {
  return request({
    url: '/bill/trans/',
    method: 'get',
    params: data,
  })
}

// beePal 單個幣種轉帳
export function coinTransfer(data) {
  return request({
    url: '/bill/trans/',
    method: 'post',
    data,
  })
}

// beePal 驗證收款賬戶是否爲內部賬戶
export function verifyAccount(data) {
  return request({
    url: `/user/wallet/exists/`,
    method: 'get',
    params: data,
  })
}

// 交易頁面的交易列表
export function getDealList(obj) {
  return request({
    url: '/market/trade/',
    method: 'get',
    params: obj,
  })
}

// 獲得單個用戶錢包
export function getOneUWallet(params) {
  return request({
    url: '/user/wallet/get_user_wallet/',
    method: 'get',
    params,
  })
}

// 單個廣告
export function getAd(id, params) {
  return request({
    url: `/market/trade/${id}/`,
    method: 'get',
    params,
  })
}

// 創建掛單訂單
export function pendBill(data) {
  return request({
    url: '/bill/',
    method: 'post',
    data,
  })
}

// 取消訂單
export function cancelBill(id) {
  return request({
    url: `/bill/${id}/cancel/`,
    method: 'post',
  })
}

// 我已支付
export function havePaid(id, data) {
  return request({
    url: `/bill/${id}/state_paid/`,
    method: 'post',
    data,
  })
}

// 掛單訂單完成
export function finishBill(id) {
  return request({
    url: `/bill/${id}/finish/`,
    method: 'post',
  })
}

// 查看otc交易記錄
export function getOTCHistory(params) {
  return request({
    url: '/bill/',
    method: 'get',
    params,
  })
}

// 獲取用戶簽名
export function getUserSig() {
  return request({
    url: '/chat/usersig/',
    method: 'get',
  })
}

// 獲取資訊列表
export function getInfo(params, id) {
  return request({
    url: id ? `/news/${id}/` : '/news/',
    method: 'get',
    params,
  })
}
