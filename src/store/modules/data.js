import { getCoinList } from '@/api'
import Storage from '@/utils/storage'

const state = {
  // 币种列表
  coinList: [],
}

const mutations = {
  SET_COIN_LIST: (state, coinList) => {
    state.coinList = coinList
  },
}

const actions = {
  async getCoinList({ commit, dispatch }) {
    const params = {
      page_size: 100,
    }
    const res = await getCoinList(params)
    const coinList = res.data.results || [] // 2021.08.03 配合Beepal API重構，改成res.data.result
    await dispatch('data/coinListAction', coinList, { root: true })
  },
  coinListAction({ commit, dispatch }, list) {
    return new Promise((resolve, reject) => {
      const coinList = list.map(o => {
        const obj = {}
        obj.id = o.id
        obj.value = o.id
        obj.label = o.name
        obj.name = o.name
        obj.code = o.code
        obj.huobiCode = o.huobi_code
        obj.active = o.active
        obj.isCrypto = o.is_crypto
        obj.decimalPlaces = o.decimal_places
        obj.withdrawFee = o.withdraw_fee
        obj.withdrawFeeInner = o.withdraw_fee_inner
        obj.chain_tx_check = o.chain_tx_check
        obj.is_show = o.is_show
        obj.chain = o.chain
        return obj
      })
      commit('SET_COIN_LIST', coinList)
      Storage.setLocal('coinList', coinList)
      resolve()
    })
  },
  setCoinList({ commit }, list) {
    commit('SET_COIN_LIST', list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
