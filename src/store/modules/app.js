const state = {
  footerbarVisible: false,
  isResetPasswordValidation: false,
  isCoolDown: false,
  isTimeout: false,
  coolDownTime: 60,
  thirdPartyList: []
};

const mutations = {
  SET_FOOTERBAR_VISIBLE: (state, visible) => {
    state.footerbarVisible = visible;
  },
  SET_THIRD_PARTY_LIST(state, list) {
    state.thirdPartyList = list;
  },
  SET_RESET_PASSWORD_VALIDATION(state, isValidation) {
    state.isResetPasswordValidation = isValidation;
  },
  SET_COOL_DOWN_TIME(state, coolDownTime) {
    state.coolDownTime = coolDownTime;
  },
  SET_IS_COOL_DOWN(state, isCoolDown) {
    state.isCoolDown = isCoolDown;
  },
  SET_IS_TIMEOUT(state, isTimeout) {
    state.isTimeout = isTimeout;
  },
};

const actions = {
  setFooterbarVisible({ commit }, visible) {
    commit('SET_FOOTERBAR_VISIBLE', visible);
  },
  setThirdPartyList({ commit }, list) {
    commit('SET_THIRD_PARTY_LIST', list);
  },
  setResetPasswordValidation({ commit }, isValidation) {
    commit('SET_RESET_PASSWORD_VALIDATION', isValidation);
  },
  setCoolDownTime({ commit }, coolDownTime) {
    commit('SET_COOL_DOWN_TIME', coolDownTime);
  },
  setIsCoolDown({ commit }, isCoolDown) {
    commit('SET_IS_COOL_DOWN', isCoolDown);
  },
  setIsTimeout({ commit }, isTimeout) {
    commit('SET_IS_TIMEOUT', isTimeout);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
