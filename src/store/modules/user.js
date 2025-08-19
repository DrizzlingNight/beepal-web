import { logout, getChannelList, getUserInfo } from '@/api'
import Storage from '@/utils/storage'
import { removeCaches } from '@/utils/logout'
import { Toast } from "vant"

const state = {
  userInfo: null,
  userWallet: [],
  userChannel: []
}

const mutations = {
  SET_USER_INFO: (state, val) => {
    state.userInfo = val
  },
  UPDATE_USER_INFO: (state, val) => {
    const userInfo = { ...state.userInfo }
    state.userInfo = { ...userInfo, ...val }
    Storage.setLocal('userInfo', { ...userInfo, ...val })
  },
  SET_USER_CERTIFICATION: (state, val) => {
    state.userInfo.certification = val
  },
  SET_USER_WALLET: (state, val) => {
    state.userWallet = val
  },
  PUSH_USER_WALLET: (state, val) => {
    state.userWallet.push(val)
    Storage.setLocal('userWallet', state.userWallet)
  },
  SET_USER_CHANNEL: (state, val) => {
    state.userChannel = val
  },
  SET_USER_PROFILE: (state, val) => {
    state.userInfo = val
    Storage.setLocal('userInfo', state.userInfo)
  },
}

const actions = {
  VA__setUserInfo({ commit }, val) {
    commit('SET_USER_INFO', val)
  },
  VA__setUserCertification({ commit }, val) {
    commit('SET_USER_CERTIFICATION', val)
  },
  VA__updateUserInfo({ commit, state }) {
    const token = Storage.getLocal('token')
    getUserInfo(token)
    .then(async res => {
      const userInfo = res.data
      commit('UPDATE_USER_INFO', userInfo)
    })
    .catch(err => {
      console.log('getUserInfo-err', err)
      removeCaches() // 有錯誤的話就清除Storage
    })
  },
  VA__updateUserProfile({ commit }, val) {
    commit('SET_USER_PROFILE', val)
  },
  VA__setUserWallet({ commit }, val) {
    commit('SET_USER_WALLET', val)
  },
  VA__getUserChannel({ commit }) {
    return getChannelList().then(res => {
      commit('SET_USER_CHANNEL', res.data.results) // 2021.08.16 配合新API，資料放res.data裡
    }).catch(err => {
      console.log(err);
    })
  },
  VA__logout({ commit }, activeToast = true) {
    commit('SET_USER_INFO', {})
    commit('SET_USER_WALLET', [])
    // Object.keys(Storage.ls).forEach(i => {
    //   Storage.removeLocal(i)
    // })
    Storage.clearLocal()
    logout()
      .then(res => {
        window.location.reload() // 刷新浏览器
      })
      .catch(err => {
        console.log('logout-err', err)
        if (activeToast) {
          Toast({
            message: '退出成功',
            type: 'fail',
            duration: 3 * 1000,
            onClose() {
              window.location.reload() // 刷新浏览器
            }
          })
          var d = new Date();
          d.setTime(d.getTime() + (-1 * 24 * 60 * 60 * 1000));
          var expires = "expires=" + d.toUTCString();
          document.cookie = 'csrftoken' + "=; " + expires;
        } else {
          window.location.reload() // 刷新浏览器
        }
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
