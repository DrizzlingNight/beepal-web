import request from '@/utils/request'
import axios from 'axios'

export function getCoinList(queryObj) {
  return request({
    url: '/coin/',
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

// 返回
// {
//   "count": 0,
//   "next": null,
//   "previous": null,
//   "results": []
// }
export function getCoinRateList(queryObj) {
  return request({
    url: '/coin/rate/',
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

// {
//   ticker: [
//     {
//       buy: 7135.17,
//       changePercent: -1.9842,
//       coinVolume: 0.0,
//       contractId: 201912060000013,
//       contractType: 1,
//       high: 7365.18,
//       holdAmount: 495482.0,
//       last: 7135.17,
//       low: 7101.48,
//       sell: 7136.15,
//       status: 2,
//       symbol: 0,
//       symbolName: 'btc',
//       type: {},
//       unitAmount: 100.0,
//       usdCnyRate: 7.029,
//       volume: 2745375.0,
//     },
//   ],
// }
export function getCoinRateListMock(priceList) {
  // const queryObj = {
  //   symbol: priceList,
  //   t: Date.now(),
  // }
  const fnPromiseList = []
  // console.log('priceList:', priceList)
  for (const i of priceList) {
    fnPromiseList.push(
      new Promise((resolve, reject) => {
        axios.get(
          '/huobidf', {
            params: {
                symbol: i
            }
        }).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    )
  }
  // return fnPromiseList
  return Promise.resolve(fnPromiseList)
  // let promiseList = []
  // Promise.all(fnPromiseList).then(function(values) {
  //   for (let i of values) {
  //     let str = i.data.ch.match(/\.(\S*)\./)[1]
  //     i.data.tick.name = str
  //     promiseList.push(i.data.tick) //永遠是[19,63,54]
  //     return Promise.resolve(promiseList)
  //   }
  // })

  //   console.log('xxxxx:', res)
  //   for (let i of res) {
  //     promiseList.push(i.tick) //永遠是[19,63,54]
  //   }
  // }
  // return requestOkex({
  //   url: ``,
  //   method: 'get',
  //   params: queryObj, // get 使用params，其他用data
  // })
}
export function getCoinWalletList() {
  return request({
    url: '/coin/wallet/',
    method: 'get'
  })
}
