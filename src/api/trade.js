import request from '@/utils/request'

// 出售出價/買入出價 廣告列表
export function getTradeList(obj) {
  return request({
    url: '/market/trade/',
    method: 'get',
    params: obj,
  })
}

// 發布廣告
export function createTrade(data) {
  return request({
    url: '/market/trade/',
    method: 'post',
    data
  })
}

// 編輯廣告
export function editTrade(id, data) {
  return request({
    url: `/market/trade/${id}/`,
    method: 'patch',
    data,
  })
}

// 關閉廣告（刪除廣告）
export function closeTrade(id, data) {
  return request({
    url: `/market/trade/${id}/close/`,
    method: 'post',
    data,
  })
}

// 查詢訂單列表
export function getOrderList(params) {
  return request({
    url: '/bill/',
    method: 'get',
    params,
  })
}

// 查詢交易率
export function getDealRate(params) {
  return request({
    url: '/bill/statistics/',
    method: 'get',
    params,
  })
}

// 查詢最成功/最失敗的交易
export function getSpecialTrade(params) {
  return request({
    url: '/market/trade/',
    method: 'get',
    params,
  })
}

// 查詢廣告費
export function getTradeFee(params) {
  return request({
    url: '/config/1/',
    method: 'get',
    params,
  })
}
