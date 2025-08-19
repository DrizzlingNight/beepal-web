import request from '@/utils/request'
import { getCoin } from '@/config/mayfly/dgc'

// 轉賬查詢
export function dgc_transaction(id, next) {
  if (!id) id = '?coin=' + getCoin();
  else id += '/'
  if (next) {
    return request({
      url: `/record/${next}`,
      method: 'get',
    })
  } else {
 return request({
    url: `/record/${id}`,
    method: 'get',
  })
}
}

export function dgc_monthbill(next) {
  if (next) {
    return request({
      url: `/record/month/${next}`,
      method: 'get',
    })
  }
  return request({
    url: `/record/month/?coin=` + getCoin(),
    // url: `/record/month/?created_time_after=${date}&created_time_before=${end}&coin=${settings.MAIN_COIN}`,
    method: 'get',
  })
}

// export function dgc_billDetail(id){
//   return request({
//     url: `/record/${id}/`,
//     method: 'get'
//   })
// }

// 餘額查詢
export function dgc_balance() {
  return request({
    url: '/user/balance/',
    method: 'get',
  })
}

// 根據id查找用戶
export function dgc_findUser(id) {
  return request({
    url: `/user/?id=${id}`,
    method: 'get',
  })
}

// 根據名稱查找用戶
export function dgc_findUserByNickname(nickname) {
  return request({
    url: `/user/?profile__nickname=` + nickname,
    method: 'get',
  })
}

// 初始化註冊極光
// export function dgc_signup(){
//   return request({
//     url: '/chat/signup/',
//     method: 'post',
//   })
// }

// 加好友
export function dgc_addfriend(friend) {
  // dgc_signup().then().catch();
  return request({
    url: '/user/friend/add_friend/',
    method: 'post',
    data: {
      friend
    }
  })
}

// 通訊錄
export function dgc_adressList() {
  // dgc_signup().then().catch();
  return request({
    url: '/user/friend/',
    method: 'get',
  })
}

// 轉賬
export function dgc_senddeal(data) {
  return request({
    url: '/transaction/',
    method: 'post',
    data
  })
}

// 發送消息
export function dgc_sendmessage(data) {
  return request({
    url: '/chat/send/',
    method: 'post',
    data
  })
}

// 拉取消息列表
export function dgc_userchatmessage(userid, page) {
  return request({
    url: '/chat/message/?target_id=' + userid + '&page=' + page,
    method: 'get',
  })
}

// 極光獲取初始化狀態
export function dgc_initstatus(JIM) {
  return JIM.isInit()
}

// 極光獲取登陸狀態
export function dgc_loginstatus(JIM) {
  return JIM.isLogin()
}

// 極光初始化登陸
export function dgc_init() {
  return request({
    url: '/chat/jim_init/',
    method: 'post',
  })
}

// 獲取會話列表
export function dgc_getConversation(JIM) {
  return JIM.getConversation();
}

// 獲取消息實時監聽
export function dgc_onMsgReceive(JIM, func) {
  return JIM.onMsgReceive(func)
}

// 獲取離線消息同步監聽
export function dgc_onSyncConversation(JIM, func) {
  return JIM.onSyncConversation(func)
}

// 上傳頭像
export function uploadHead(data) {
  return request({
    url: '/user/profile/avatar/',
    method: 'post',
    headers: { 'content-type': 'multipart/form-data;charset=UTF-8' },
    data
  })
}

// 設置暱稱
export function setNickName(data) {
  return request({
    url: `/user/${data.id}/`,
    method: 'patch',
    data
  })
}

// 公告消息
export function getNotices(data) {
  const page = data.page
  const page_size = data.page_size
  const search = data.search
  return request({
    url: '/notice/?page=' + page + '&page_size=' + page_size + '&search=' + search,
    method: 'get',
  })
}

// 公告消息明細
export function getNoticeById(id) {
  return request({
    url: `/notice/${id}/`,
    method: 'get'
  })
}
