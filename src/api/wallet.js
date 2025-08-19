import request from '@/utils/request'

export function getUserWallet() {
  return request({
    url: `/user/wallet/`,
    method: 'get',
  })
}

