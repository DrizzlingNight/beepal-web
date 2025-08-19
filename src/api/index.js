export { login, getUserInfo, signup, logout, identityAuth, createAuth, sendValidationCode } from './auth'
export {
  dgc_transaction,
  dgc_balance,
  dgc_monthbill,
  // dgc_billDetail
  dgc_findUser,
  // dgc_signup,
  dgc_addfriend,
  dgc_adressList,
  dgc_senddeal,
  dgc_findUserByNickname,
  dgc_sendmessage,
  dgc_userchatmessage,
  dgc_getConversation,
  dgc_init,
  dgc_onMsgReceive,
  dgc_onSyncConversation,
  getNoticeById,
  getNotices,
  dgc_initstatus,
  dgc_loginstatus,
} from './dgc/assets'
export {
  getBillList,
  getBillInfo,
  getBillOutList,
  getBillOutInfo,
  createBill,
  cancelBill,
  createBillOut,
  cancelBillOut,
  transaction,
  getTransactionList,
} from './bill'
export {
  getChannelList,
  createChannel,
  updateChannel,
  deleteChannelById,
  getUserChannelList,
  createUserChannel,
  getUserChannelInfo,
  updateUserChannel,
  deleteUserChannelById,
  getTeamChannelList,
  createTeamChannel,
  getTeamChannelInfo,
  updateTeamChannel,
  deleteTeamChannelById,
} from './channel'
export { getLevelList, createLevel, deleteLevel, updateLevel } from './level'
export { getRecordsList, getRecordsInfo } from './records'
export {
  getSecretList,
  getSecretInfo,
  createSecret,
  deleteScript,
} from './secret'
export {
  getTeamList,
  getTeamInfo,
  updateTeam,
  createTeam,
  deleteTeam,
  getProfitRate,
} from './team'
export { getUserList, getUserById, updateUser, getUserInfoById, setPassword, setSecurityPassword, getUserCertification, getFriendList, addFriend, deleteFriend, sendMessage } from './user'

export {
  getThirdPartyList,
  getBannerList,
  getBannerDetail,
  thirdPartyLogin,
  getThirdPartyBillList,
  transferThirdParty,
  getFavoriteList,
  setFavoriteDapp,
} from './thirdParty'

export { getCoinList, getCoinRateList, getCoinRateListMock, getCoinWalletList } from './coin'
export { getUserWallet } from './wallet'

export { getLessonList, getLessonDetail, buyLesson, getSectionList, getSectionDetail, learnSection } from './lesson'

export { getTradeList, createTrade, editTrade, closeTrade, getOrderList, getDealRate, getSpecialTrade, getTradeFee } from './trade'
