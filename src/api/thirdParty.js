import request from '@/utils/request'

export function getThirdPartyList(params) {
  return request({
    url: '/third_party/',
    method: 'get',
    params
  })
}

// Banner列表
export function getBannerList(params) {
  return request({
    url: '/third_party/banner/',
    method: 'get',
    params
  })
}

// Banner詳情
export function getBannerDetail(id) {
  return request({
    url: `/third_party/banner/${id}/`,
    method: 'get'
  })
}

// 返回
// login_token: ""
// sign: "b0cf85bfc99221826fe236de216a0f73"
// timestamp: "1579068709664"
// balances: [{amount: "", id: "ETH_USDT", name: "USDT"}]

export function thirdPartyLogin(data) {
  return request({
    url: `/third_party/login/`,
    method: 'post',
    data,
  })
}
export function getThirdPartyBillList(page = 1) {
  return request({
    url: `/third_party/bill/?page=${page}`,
    method: 'get',
  })
}

// Amount： 金額
// Type： 0-deposit， 1-withdraw
// Third party:  第三方的id
// coin:  幣種，1-CNY,2-USDT
export function transferThirdParty(obj) {
  return request({
    url: `/third_party/bill/`,
    method: 'post',
    data: obj,
  })
}

export function getFavoriteList() {
  return request({
    url: `/user/app/`,
    method: 'get',
  })
}

export function setFavoriteDapp(id) {
  return request({
    url: `/third_party/${id}/collect/`,
    method: 'post',
  })
}
