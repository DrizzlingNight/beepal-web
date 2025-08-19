import request from '@/utils/request'

// get 使用params，其他用data

export function getBillList(page = 1) {
  return request({
    url: `/bill/?page=${page}`,
    method: 'get',
  })
}
export function getBillInfo(id) {
  return request({
    url: `/bill/${id}/`,
    method: 'get',
  })
}
export function getBillOutList(page = 1) {
  return request({
    url: `/bill/out/?page=${page}`,
    method: 'get',
  })
}
export function getBillOutInfo(id) {
  return request({
    url: `/bill/out/${id}/`,
    method: 'get',
  })
}

// https://api.usdt.com.co/redoc/#operation/bill_create
// 輸入
// {
//   "expired": 300, // 過期時間，單位爲秒 【300-1800之間】
//   "amount": "string", // 金額數量 【required】
//   "channel": 0, // 0爲銀行，1爲支付寶，2爲微信，3爲支付寶代付，4爲寶轉卡，5爲支付寶(手輸金額)，6爲支付寶(金額可編輯)，空則爲選擇任意渠道
//   "type": 0, // 0爲兌入，1爲兌出
//   "name": "string", // 姓名
//   "bank": "string", // 銀行名稱
//   "bank_card": "string", // 銀行卡號
//   "memo": "string", // 備註
//   "merchant_bill_number": "string", // 第三方訂單號 【required】用userId@timestamp
//   "notify_url": "string"
// }

// 輸出
// {
//   "Location": "string" // 支付頁面跳轉鏈接地址
// }
export function createBill(data) {
  return request({
    url: `/bill/`,
    method: 'post',
    data,
  })
}

export function cancelBill(id) {
  return request({
    url: `/bill/${id}/cancel/`,
    method: 'post',
  })
}

export function createBillOut(data) {
  return request({
    url: `/bill/out/`,
    method: 'post',
    data,
  })
}

export function cancelBillOut(id) {
  return request({
    url: `/bill/out/${id}/cancel/`,
    method: 'post',
  })
}

export function transaction(data) {
  return request({
    url: `/transaction/`,
    method: 'post',
    data,
  })
}

export function getTransactionList() {
  return request({
    url: `/transaction/`,
    method: 'get',
  })
}
