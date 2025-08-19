import { getCoinList } from '@/api'
import { getBeePalWallet, getOneUWallet } from '@/api/beePal'
import Storage from '@/utils/storage'

export default {
  // AC_REALCOIN({ commit }, val) {
  //   commit('setRealCoin', val)
  // },
  AC_INITORDERLIST({ commit }, val) {
    commit('initOrderList', val)
  },
  AC_ORDERLIST({ commit }, val) {
    commit('setUserOrderList', val)
  },
  AC_SELLORDERLIST({ commit }, val) {
    commit('setSellOrderList', val)
  },
  AC_UPDATEORDER({ commit, rootGetters, dispatch }, datas) {
    const buyOrderList = rootGetters.G_userOrderList.findIndex(
      o => o.id === datas.id,
    )
    const sellOrderList = rootGetters.G_sellOrderList.findIndex(
      o => o.id === datas.id,
    )
    if (datas.status === 2) {
      const cancelOrderList = rootGetters.G_cancelOrderList.findIndex(
        o => o.id === datas.id,
      )
      datas.myStatus = 3
      if (cancelOrderList !== -1) {
        if (!isObjectValueEqual(datas, rootGetters.G_cancelOrderList[cancelOrderList])) {
          commit('updateCancelOrder', {
            datas,
            index: cancelOrderList,
          })
        }
      } else commit('pushCancelOrder', datas)
      return
    }
    let buy = false
    const buyIn = datas.buyIn
    buyOrderList !== -1 || buyIn ? (buy = true) : (buy = false)
    if (buy) {
      if (buyOrderList !== -1) {
        if (!isObjectValueEqual(datas, rootGetters.G_userOrderList[buyOrderList])) {
          commit('updateUserOrderList', {
            datas,
            index: buyOrderList,
          })
        }
      } else {
        commit('pushUserOrderList', datas)
      }
    } else {
      if (sellOrderList !== -1) {
        if (!isObjectValueEqual(datas, rootGetters.G_sellOrderList[sellOrderList])) {
          commit('updateSellOrderList', {
            datas,
            index: sellOrderList,
          })
        }
      } else {
        commit('pushSellOrderList', datas)
      }
    }
  },
  AC_REMOVEORDER({ commit, rootGetters }, orderid) {
    const buyOrderList = rootGetters.G_userOrderList
    const sellOrderList = rootGetters.G_sellOrderList
    let buy = false
    let sell = false
    let temp = null
    const removeBuy = []
    const removeSell = []
    buyOrderList.forEach((item, index) => {
      temp = item
      if (item.id === orderid) {
        buy = true
        if (temp.status !== 2) {
          temp.status = 3
        }
        temp.myStatus = 4
        removeBuy.push(index)
        return
      }
    })
    if (buy) {
      commit('pushCancelOrder', temp)
      commit('removeUserOrderList', removeBuy)
    } else {
      sellOrderList.forEach((item, index) => {
        temp = item
        if (item.id === orderid) {
          sell = true
          if (temp.status !== 2) {
            temp.status = 3
          }
          temp.myStatus = 4
          removeSell.push(index)
          return
        }
      })
      if (sell) {
        commit('pushCancelOrder', temp)
        commit('removeSellOrderList', removeSell)
      }
    }
  },
  // AC_WALLET({ commit }, val) {
  //   commit('setWallet', val);
  // },
  AC_COINRATE({ commit }, val) {
    commit('setCoinRate', val)
  },
  async AC_UPDATEWALLET({ dispatch, commit }) {
    const params = {
      page_size: 100,
    }
    const list = []
    await getCoinList(params).then(async res => {
      res.data.results.forEach(item => {
        if (item.is_crypto && item.is_show) {
          list.push(
            {
              coin: item.id,
              amount: '',
              coin_code: item.code
            }
          )
        }
      })
    })
    .catch(error => {
      console.error('getCoinList-err', error)
    })

    console.log('AC_UPDATEWALLET list', list)

    await getBeePalWallet()
      .then(async res => {
        const balance = res.data.results // 2021.08.11 配合新API，資料放res.data.results裡
        list.forEach(item => {
          const coin = balance.find(coin => coin.coin === item.coin)
          if (coin) item.amount = coin.amount
        })
        const temp = {
          list: list,
          obj: {},
        }
        for (const i in list) {
          temp.obj[list[i].coin_code] = list[i]
        }
        commit('setWallet', temp)
        Storage.setLocal('G_wallet', temp)
      })
      .catch(error => {
        console.error('getBeePalWallet-err', error)
        // 2021.10.25 為了防止API出錯後無限發請求，暫時先拔掉
        // setTimeout(() => {
        //   dispatch('AC_UPDATEWALLET')
        // }, 1000)
      })
  },
  AC_ADDWALLET({ commit, rootGetters }, params) {
    const wallet = rootGetters.VG__getWalletByCoin(params.id)
    if (!wallet) {
      getOneUWallet({ user: params.userid, coin: params.id }).then(res => {
        commit('user/PUSH_USER_WALLET', res.data, { root: true }) // 2021.08.10 配合新API，資料放res.data裡
      })
    }
  },
}

function isObjectValueEqual(a, b) {
  let aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  aProps = aProps.filter(prop => {
    return bProps.indexOf(prop) > -1
  })

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    if (typeof a[propName] !== 'object' && a[propName] !== b[propName]) {
      return false
    }
  }

  return true
}
