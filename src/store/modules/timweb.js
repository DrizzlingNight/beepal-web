// 从v2.11.0起，SDK 支持了 WebSocket，推荐接入
import TIM from 'tim-js-sdk-ws'
// import TIM from 'tim-js-sdk'; // HTTP 版本
import TIMUploadPlugin from 'tim-upload-plugin'
import { settings } from '@/config'
// import { getUserSig } from '@/api/beePal'
import Storage from '@/utils/storage'
// import myConsole from '@/utils/console'

// 2021.11.29 porcess.env 新增不了變數，所以暫時用NDOE_ENV來判斷是測試還是正式
const TM_APP_ID = process.env.NODE_ENV === 'production' ? '1400602353' : '1400532091'

console.log('process.env', process.env)

function structural_treatment({ rootGetters }, array) {
  const userInfo = rootGetters.VG__userInfo
  array.forEach(o => {
    o.from_me = (o.from === settings.MAIN_THEME + '_' + userInfo.id)
    try {
      o.payload = o.change || JSON.parse(o.payload.text)
    } catch (err) {
      console.log('structural_treatment err', err)
    }
    o.change = o.payload
  })
  return array
}

let user = Storage.getLocal('userInfo') || {}

if (user) {
  user.userID = 'BeePal_' + user.id
}

const state = {
  Tim: null,
  conversations: Storage.getLocal(`TIM_${TM_APP_ID}_` + user.userID + '_conversationMap') || [],
  to_user_msg: Storage.getLocal(`TIM_${TM_APP_ID}_` + user.userID + '_userMsg') || {},
  login: false,
  ready: false,
  msgChange: 0,
}

const mutations = {
  init: state => {
    state.Tim = TIM.create({
      SDKAppID: TM_APP_ID,
      oversea: true,
    })
    state.Tim.setLogLevel(1)
    state.Tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
  },
  push_msg: (state, payload) => {
    // payload = { array, conversations }
    const array = payload.array.reverse()
    let conversations = null
    array.forEach(o => {
      conversations = o.conversationID
      const resultObj = state.to_user_msg[conversations]
      const obj = o
      const flag = resultObj.results.some(k => k.ID === o.ID)
      if (!flag) {
        if (payload.type === 0) {
          resultObj.results.push(obj)
        } else {
          resultObj.results.unshift(obj)
        }
      }
    })
    state.msgChange += 1
    Storage.setLocal(`TIM_${TM_APP_ID}_` + user.userID + '_userMsg', state.to_user_msg)
  },
  add_msg_detail: (state, payload) => {
    if (!state.to_user_msg[payload.conversations]) state.to_user_msg[payload.conversations] = {}
    state.to_user_msg[payload.conversations].nextReqMessageID = payload.nextReqMessageID
    state.to_user_msg[payload.conversations].isCompleted = payload.isCompleted
    state.to_user_msg[payload.conversations].results = state.to_user_msg[payload.conversations].results || []
  },
  loginConfirm: state => {
    state.login = true
  },
}

const actions = {
  // 初始化
  T__init({ state, commit, rootGetters }) {
    if (!state.Tim) {
      commit('init')
      state.Tim.on(TIM.EVENT.SDK_READY, sdk_ready)
      state.Tim.on(TIM.EVENT.MESSAGE_RECEIVED, message_received)
      state.Tim.on(TIM.EVENT.MESSAGE_REVOKED, message_revoked)
      state.Tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, message_read_by_peer)
      state.Tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, conversation_list_updated)
      state.Tim.on(TIM.EVENT.SDK_NOT_READY, sdk_not_ready)
      state.Tim.on(TIM.EVENT.KICKED_OUT, kicked_out)
      state.Tim.on(TIM.EVENT.NET_STATE_CHANGE, net_state_change)
    }

    function sdk_ready(event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
      console.log('1.SDK_READY ====>', event)
      state.ready = true
    }

    function message_received(event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log('2.MESSAGE_RECEIVED ====>', event)
      const array = structural_treatment({ state, rootGetters }, event.data)
      commit('push_msg', { array, type: 0 })
    }

    function message_revoked(event) {
      // 收到消息被撤回的通知。使用前需要将SDK版本升级至v2.4.0或更高版本。
      // event.name - TIM.EVENT.MESSAGE_REVOKED
      // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
      console.log('3.MESSAGE_REVOKED ====>', event)
    }

    function message_read_by_peer(event) {
      // SDK 收到对端已读消息的通知，即已读回执。使用前需要将SDK版本升级至v2.7.0或更高版本。仅支持单聊会话。
      // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
      // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
      console.log('4.MESSAGE_READ_BY_PEER ====>', event)
    }

    function conversation_list_updated(event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
      console.log('5.CONVERSATION_LIST_UPDATED ====>', event)
      const list = event.data
      list.forEach(item => {
        try {
          item.lastMessage.payload = JSON.parse(item.lastMessage.payload.text)
        } catch (err) {
          // console.log('conversation_list_updated err', err) // 2021.12.09 避免console一直跳錯誤訊息，先註解掉
        }
      })
      state.conversations = list
      Storage.setLocal(`TIM_${TM_APP_ID}_` + user.userID + '_conversationMap', list)
    }

    function sdk_not_ready(event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
      console.log('6.EVENT.SDK_NOT_READY ====>', event)
    }

    function kicked_out(event) {
      // 收到被踢下线通知
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如 :
      //   - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //   - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //   - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢（v2.4.0起支持）。
      console.log('7.KICKED_OUT ====>', event)
    }

    function net_state_change(event) {
      // 网络状态发生改变（v2.5.0 起支持）。
      // event.name - TIM.EVENT.NET_STATE_CHANGE
      // event.data.state 当前网络状态，枚举值及说明如下：
      //   - TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
      //   - TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
      //   - TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
      console.log('8.NET_STATE_CHANGE ====>', event)
    }
  },
  // 登录
  T__Login({ state, rootGetters, dispatch, commit }) {
    const userInfo = rootGetters.VG__userInfo
    login(userInfo.im_usersig) // 2021.08.20 新API，usersig直接從userInfo取
    // // console.log(userInfo)
    // if (!userInfo.tx_usersig) {
    //   getUserSig().then(res => {
    //     login(res.tx_usersig)
    //     dispatch('user/VA__updateUserInfo', null, { root: true })
    //   })
    // } else {
    //   login()
    // }

    function login(usersig) {
      const params = {
        userID: settings.MAIN_THEME + '_' + userInfo.id,
        userSig: usersig || userInfo.im_usersig,
      }
      const promise = state.Tim.login(params)
      user = params
      promise.then((imResponse) => {
        commit('loginConfirm')
        console.log(imResponse.data)
        if (imResponse.data.repeatLogin === true) {
          // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
          console.log(imResponse.data.errorInfo)
        }
      }).catch(function(imError) {
        console.warn('login error:', imError) // 登录失败的相关信息
      })
    }
  },
  // 设置为已读
  T__setMessageRead({ state }, conversationID) {
    const promise = state.Tim.setMessageRead({ conversationID })
    promise.then(function(imResponse) {
      // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
      console.log('im read ====>', imResponse)
    }).catch(function(imError) {
      // 已读上报失败
      console.warn('setMessageRead error:', imError)
    })
  },
  // 獲取對話列表
  T_getConversationList() {
    const promise = state.Tim.getConversationList();
    promise.then(function(imResponse) {
      const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
      conversationList.forEach(item => {
        try {
          item.lastMessage.payload = JSON.parse(item.lastMessage.payload.text)
        } catch (err) {
          // console.log('conversation_list_updated err', err) // 2021.12.09 避免console一直跳錯誤訊息，先註解掉
        }
      })
      state.conversations = conversationList
    }).catch(function(imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    })
    return promise
  },
  // 獲取對話資訊
  T_getConversationProfile(conversationID) {
    const promise = state.Tim.getConversationProfile(conversationID);
    promise.then(function(imResponse) {
      const conversationProfile = imResponse.data.conversation; // 会话列表，用该列表覆盖原有的会话列表
      conversationProfile.forEach(item => {
        try {
          item.lastMessage.payload = JSON.parse(item.lastMessage.payload.text)
        } catch (err) {
          // console.log('conversation_list_updated err', err) // 2021.12.09 避免console一直跳錯誤訊息，先註解掉
        }
      })
      state.conversationsProfile = conversationProfile
    }).catch(function(imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    })
    return promise
  },
  // 刪除對話
  T_deleteConversation(conversationID) {
    const promise = state.Tim.deleteConversation(conversationID);
    promise.then(function(imResponse) {
      const { conversationID } = imResponse.data; // 被删除的会话 ID
      console.log(`${conversationID} is deleted`)
    }).catch(function(imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    })
    return promise
  },
  // 获取消息列表
  T__getMessageList({ state, commit, rootGetters }, params) {
    const promise = state.Tim.getMessageList(params)
    promise.then((imResponse) => {
      const list = structural_treatment({ rootGetters }, imResponse.data.messageList)
      commit('add_msg_detail', {
        conversations: params.conversationID,
        nextReqMessageID: imResponse.data.nextReqMessageID,
        isCompleted: imResponse.data.isCompleted,
      })
      commit('push_msg', { array: list, type: 1 })
    })
    return promise
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
