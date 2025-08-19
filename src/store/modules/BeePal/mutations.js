export default {
  // setRealCoin: (state, val) => {
  //   state.realCurrency = val;
  // },
  initOrderList: (state, val) => {
    state.userOrderList = []
    state.sellOrderList = []
  },
  setUserOrderList: (state, val) => {
    state.userOrderList = val
  },
  setSellOrderList: (state, val) => {
    state.sellOrderList = val
  },
  setWallet: (state, val) => {
    state.wallet = val
  },
  pushUserOrderList: (state, val) => {
    state.userOrderList.push(val)
  },
  pushSellOrderList: (state, val) => {
    state.sellOrderList.push(val)
  },
  updateCancelOrder: (state, val) => {
    state.cancelOrderList.splice(val.index, 1, val.datas)
  },
  updateUserOrderList: (state, val) => {
    val.datas.method = state.userOrderList[val.index].method
    state.userOrderList.splice(val.index, 1, val.datas)
  },
  removeUserOrderList: (state, val) => {
    val.forEach(index => {
      state.userOrderList.splice(index, 1)
    })
  },
  updateSellOrderList: (state, val) => {
    state.sellOrderList.splice(val.index, 1, val.datas)
  },
  removeSellOrderList: (state, val) => {
    val.forEach(index => {
      state.sellOrderList.splice(index, 1)
    })
  },
  setCoinRate: (state, val) => {
    state.coinRate = val
  },
  pushCancelOrder: (state, val) => {
    state.cancelOrderList.push(val)
  },
}
