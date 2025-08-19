import {
  getFriendList,
  dgc_balance,
  dgc_getConversation,
  dgc_init,
  dgc_initstatus,
  dgc_loginstatus,
  dgc_monthbill,
  dgc_onMsgReceive,
  dgc_onSyncConversation,
  dgc_transaction,
  getNotices,
} from '@/api'
import Storage from '@/utils/storage'
import { getQueryVariable } from '@/utils/geturl'
import i18n from '@/lang/i18n'
import user from '@/store/modules/user'
import { Toast } from 'vant'
import { dateFormat } from '@/utils/dateFormat'
import { loginOut } from '@/utils/logout'
import { getCoin, getCoinType } from '@/config/mayfly/dgc'

function getYearAndMonth(str) {
  const date = new Date(str)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return {
    year,
    month,
  }
}

function judgeFiveMinutes(time1, time2) {
  // console.log(dateFormat(new Date(time1).getTime(),'yyyy-MM-dd hh:mm'),new Date(time1))
  // console.log(dateFormat(new Date(time2),'yyyy-MM-dd hh:mm'),new Date(time2))
  // console.log(time2 - time1);
  const time = time2 - time1
  if (time > 300000) return true
}

const state = {
  balance: 0,
  monthBill: [],
  finished: false,
  next: null,
  friends: Storage.getLocal('friends') || [],
  init_status: false,
  deallist: Storage.getLocal('deallist') || [],
  nowMonth: {
    month: new Date().getMonth() + 1,
    results: null,
    total: 0,
  },
  conversations: Storage.getLocal('conversations') || [],
  Msg: Storage.getLocal('msg') || [],
  haveBadge: false,
  dealNext: null,
  notices: Storage.getLocal('notices') || [],
  // eslint-disable-next-line no-undef
  JIM: null,
}

const mutations = {
  SET_BALANCE: (state, val) => {
    state.balance = val
  },
  Set_MonthBill: (state, payload) => {
    if (payload.type === 0) {
      state.monthBill = payload.val
    } else if (payload.type === 1) {
      state.monthBill.push(...payload.val)
    }
  },
  Set_NowMonth: (state, val) => {
    state.nowMonth = val
  },
  Set_Finished: (state, val) => {
    state.finished = val
  },
  Set_Count: (state, val) => {
    state.count = val
  },
  // Push_Arr: (state, val) => {
  //   state.arr = val
  // },
  Set_Next: (state, val) => {
    state.next = val
  },
  Set_Init_Status: (state, val) => {
    state.init_status = val
  },
  Set_Conversations: (state, val) => {
    state.conversations = val
  },
  Set_friends: (state, val) => {
    state.friends = val
  },
  Set_Msg: (state, val) => {
    state.Msg = val
  },
  Set_Deallist: (state, payload) => {
    if (payload.type === 0) {
      state.deallist = payload.val
    } else if (payload.type === 1) {
      state.deallist.push(...payload.val)
    }
  },
  Set_dealNext: (state, val) => {
    state.dealNext = val
  },
  Set_haveBadge: (state, val) => {
    state.haveBadge = val
  },
  Set_notices: (state, payload) => {
    if (payload.type === 0) {
      state.notices = payload.val
    } else if (payload.type === 1) {
      state.notices.push(...payload.val)
    }
  },
  Push_Msg: (state, payload) => {
    const content = state.Msg
    const messages = payload.val.messages
    messages.forEach(temp => {
      const from_username = temp.from_username
      const target_id = temp.content.target_id
      const time = temp.ctime_ms
      let text = temp.content.msg_body.text
      text = JSON.parse(text)
      text.msg_id = temp.msg_id
      let isme = false
      let other = null
      const id = 'tpay_' + user.state.userInfo.id
      if (from_username === id) {
        isme = true
        other = target_id
      } else other = from_username
      const flag = content.some(item => {
        if (item.from_username === from_username || item.from_username === target_id) {
          if (item.from_username === from_username) item.unread_msg_count += 1
          const msgs = item.msgs
          let result = msgs[msgs.length - 1]
          if (judgeFiveMinutes(result.lastTime, time)) {
            const obj = {
              result: [{ content: [text], isMe: isme }],
              time,
            }
            msgs.push(obj)
          } else {
            result = result.result
            const last = result[result.length - 1]
            if (last.isMe === isme) {
              last.content.push(text)
            } else {
              const obj = {
                content: [text],
                isMe: isme,
              }
              result.push(obj)
            }
          }
          return true
        }
      })
      if (!flag) {
        const obj = {
          from_username: other,
          msgs: [{ result: [{ content: [text], isMe: isme }], time }],
          unread_msg_count: isme ? 0 : 1,
          receipt_msgs: [],
        }
        content.push(obj)
      }
    })
    if (payload.type === true) {
      Storage.setLocal('msg', content)
    }
  },
}

const actions = {
  VA__AllStateInit({
                     commit,
                   }) {
    const conversations = []
    const Msg = []
    const balance = 0
    const monthBill = []
    const finished = false
    const next = null
    const friends = []
    const init_status = false
    const deallist = []
    const dealNext = null
    const nowMonth = {
      month: new Date().getMonth() + 1,
      results: null,
      total: 0,
    }
    const notices = []
    commit('SET_BALANCE', balance)
    commit('Set_MonthBill', {
      val: monthBill,
      type: 0,
    })
    commit('Set_dealNext', dealNext)
    commit('Set_Deallist', deallist)
    commit('Set_Finished', finished)
    commit('Set_Next', next)
    commit('Set_friends', friends)
    commit('Set_Init_Status', init_status)
    commit('Set_NowMonth', nowMonth)
    commit('Set_Conversations', conversations)
    commit('Set_Msg', Msg)
    commit('Set_haveBadge', false)
    commit('Set_notices', notices)
  },
  VA__setBalance({
                   commit,
                 }) {
    dgc_balance().then(res => {
      res.data.results.some(item => {
        if (item.coin === getCoin()) {
          commit('SET_BALANCE', Math.trunc(item.amount))
          return true
        }
      })
    })
  },
  VA__setAdressList({
                      commit,
                      state,
                    }) {
    getFriendList({ page: 1, page_size: 200, }).then(res => {
      const friend = res.data.results
      Storage.setLocal('friends', friend)
      commit('Set_friends', friend)
    })
  },
  async VA__setMonthBill({
                           commit,
                           dispatch,
                           state,
                         }, next) {
    await dgc_monthbill(next).then(res => {
      function addAmount(arr, item, month, year) {
        let currentData = arr[arr.length - 1]
        if (!currentData) {
          arr.push({
            month: `${year}/${month}`,
            total: 0,
            m: month,
            y: year,
          })
          currentData = arr[arr.length - 1]
        }
        currentData.total += Math.abs(Number(item.total))
      }

      const resulttemp = res.data.results
      dispatch('VA__getNowMonth', resulttemp)
      if (res.next == null) commit('Set_Next', null)
      else commit('Set_Next', getQueryVariable(res.next))
      if (res.next == null) commit('Set_Finished', true)
      const kdate = new Date()
      const arr = !next ? [] : state.monthBill
      let year = !next ? kdate.getFullYear() : arr[arr.length - 1].y
      let month = !next ? kdate.getMonth() + 1 : arr[arr.length - 1].m
      // let temparr = [];
      resulttemp.forEach(item => {
        const thisDate = getYearAndMonth(item.month)
        if (thisDate.year === year && thisDate.month === month) {
          addAmount(arr, item, month, year)
        } else {
          while (thisDate.year !== year || thisDate.month !== month) {
            month -= 1
            if (month === 0) {
              year -= 1
              month = 12
            }
            const currentData = arr[arr.length - 1]
            if (!currentData || currentData.y !== year || currentData.m !== month) {
              arr.push({
                month: `${year}/${month}`,
                total: 0,
                m: month,
                y: year,
              })
            }
          }
          addAmount(arr, item, month, year)
        }
      })
      commit('Set_MonthBill', {
        val: arr,
        type: 0,
      })
    })
  },
  VA__getNowMonth({
                    commit,
                    state,
                  }, resulttemp) {
    // let resulttemp = res.data.results;
    function mergeType(results) {
      const tempArr = []
      const result = []
      results.forEach(item => {
        if (tempArr.indexOf(item.type) === -1) {
          tempArr.push(item.type)
          result.push(item)
        } else {
          for (let i = 0; i < result.length; i++) {
            if (result[i].type === item.type) {
              result[i].value += item.value
            }
          }
        }
      })
      return result
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const nowMonth = state.nowMonth
    // 只有第一次才执行
    if (state.finished || state.next) return
    let i = 0
    let tempdate = null
    // 第一个值为空退出
    if (resulttemp[0]) tempdate = getYearAndMonth(resulttemp[i].month)
    else return
    // 不等于本月退出
    if (tempdate.year !== year || tempdate.month !== month) return
    // 重新获取滞空
    nowMonth.results = []
    nowMonth.month = month
    let total = 0
    while (tempdate.year === year && tempdate.month === month) {
      let type = resulttemp[i].type
      const mergetype = getCoinType(resulttemp[i].type).mergeType
      if (mergetype != null) type = mergetype.toString()
      total += Math.abs(Number(resulttemp[i].total))
      const value = Math.abs(resulttemp[i].total)
      const name = type
      // const name = i18n.t('coin_type.' + settings.COIN_TYPE[resulttemp[i].type].name)
      const color = getCoinType(resulttemp[i].type).style
      const itemStyle = {
        color,
      }
      nowMonth.results.push({
        type,
        value,
        name,
        itemStyle,
      })
      i++
      if (!resulttemp[i]) break
      tempdate = getYearAndMonth(resulttemp[i].month)
    }
    nowMonth.total = total
    nowMonth.results = mergeType(nowMonth.results)
    commit('Set_NowMonth', nowMonth)
  },
  VA__JIMINIT({
                commit,
                dispatch,
              }, data) {
    const init = dgc_init()
    const JIM = data.JIM
    const nowUser = data.nowUser
    const conversations = Storage.getLocal('conversations')
    if (conversations) {
      commit('Set_Conversations', conversations)
    }
    const initStatus = dgc_initstatus(JIM)
    const loginStatus = dgc_loginstatus(JIM)
    if (!initStatus || !loginStatus) {
      init.then(async res => {
        new Promise((resolve, reject) => {
          if (initStatus === false) {
            JIM.init({
              'appkey': res.appkey,
              'random_str': res.random_str,
              'signature': res.signature,
              'timestamp': res.timestamp,
              'flag': 1,
            }).onSuccess(success => {
              resolve()
            })
          } else {
            resolve()
          }
        }).then(res => {
          if (loginStatus === false) {
            const pwd = nowUser.username + '@tpay'
            JIM.login({
              'username': 'tpay_' + nowUser.id,
              'password': pwd,
              'is_md5': false,
            }).onSuccess(success => {
              JIM.onDisconnect(function() {
                console.log('极光断线了....')
                // dispatch("VA__JIMINIT",data);
              })
              JIM.onEventNotification(function(data) {
                // data.event_id 事件 id
                // data.event_type 事件类型
                // data.ctime_ms 事件生成时间
                // data.extra =0同时登录，=1用户被禁用，=2用户被删除
                if (data.event_type === 1) {
                  const forcedLogOut = i18n.t('tip.forcedLogOut')
                  Toast.fail(forcedLogOut)
                  setTimeout(() => {
                    loginOut()
                  }, 200)
                }
              })
              commit('Set_Init_Status', true)
            }).onFail(fail => {
              console.log(fail)
              commit('Set_Init_Status', false)
            })
          } else commit('Set_Init_Status', true)
        })
      }).catch(err => {
        console.log(err)
        commit('Set_Init_Status', false)
      })
    }
  },
  VA__Conversations({
                      commit,
                      state,
                      dispatch,
                    }, JIM) {
    dgc_getConversation(JIM).onSuccess(data => {
      const Msg = state.Msg
      const conversations = data.conversations.reverse()
      commit('Set_Conversations', conversations)
      Storage.setLocal('conversations', conversations)
      if (Msg.length !== conversations.length) {
        dispatch('VA__Conversations', JIM)
      }
    })
  },
  VA__getMsg({
               commit,
               dispatch,
             }, JIM) {
    dgc_onMsgReceive(JIM, data => {
      commit('Push_Msg', { val: data, type: true })
      dispatch('VA__Conversations', JIM)
    })
    dgc_onSyncConversation(JIM, data => {
      const results = []
      data.forEach(item => {
        const obj = {}
        const from_username = item.from_username
        const unread_msg_count = item.unread_msg_count
        const receipt_msgs = item.receipt_msgs
        obj.from_username = from_username
        obj.unread_msg_count = unread_msg_count
        obj.receipt_msgs = receipt_msgs
        obj.msgs = []
        const msgs = item.msgs
        const msg_result = []
        msgs.forEach(temp => {
          let msg_obj = { time: null, lastTime: null, result: [] }
          const msg_temp = msg_result[msg_result.length - 1]
          let msg_time = null
          const temp_time = temp.ctime_ms
          let flag = true
          let temp_obj = { isMe: false, content: [] }
          let content = temp.content.msg_body.text
          let isme = false
          if (!msg_temp) {
            msg_time = temp_time
            msg_obj.time = msg_time
            msg_obj.lastTime = msg_time
          } else {
            if (judgeFiveMinutes(msg_temp.lastTime, temp_time)) {
              msg_time = temp_time
              msg_obj.time = msg_time
              msg_obj.lastTime = msg_time
              flag = false
            } else {
              msg_obj = msg_temp
              msg_temp.lastTime = temp_time
              temp_obj = msg_obj.result[msg_obj.result.length - 1] ? msg_obj.result[msg_obj.result.length - 1] : temp_obj
            }
          }
          content = JSON.parse(content)
          content.msg_id = temp.msg_id
          const username = 'tpay_' + user.state.userInfo.id
          if (temp.content.from_id === username) {
            isme = true
          }
          if (isme === temp_obj.isMe) {
            temp_obj.content.push(content)
            if (msg_obj.result.length === 0) msg_obj.result.push(temp_obj)
          } else {
            const new_obj = {
              isMe: isme,
              content: [content],
            }
            msg_obj.result.push(new_obj)
          }
          if (!flag || !msg_temp) msg_result.push(msg_obj)
        })
        obj.msgs = msg_result
        results.push(obj)
      })
      commit('Set_Msg', results)
      Storage.setLocal('msg', results)
      // console.log(data);
    })
  },
  VA__ResetUnreadCount({ state, dispatch }, payload) {
    console.log('重置会话未读数', 'tpay_' + payload.userid)
    const username = 'tpay_' + payload.userid
    payload.JIM.resetUnreadCount({
      'username': username,
    })
    // const Msg = state.Msg;
    // Msg.some(item => {
    //   if(item.from_username === username){
    //     item.unread_msg_count = 0;
    //     Storage.setLocal('msg', Msg);
    //     return true;
    //   }
    // })
  },
  async VA__GetDealList({ commit }, next) {
    const itemList = []
    await dgc_transaction(null, next).then(res => {
      const list = res.data.results
      commit('Set_dealNext', res.next ? getQueryVariable(res.next) : 'null')
      for (let i = 0; i < list.length; i++) {
        const id = list[i].id
        const type = list[i].type
        let time = new Date(list[i].created_time)
        time = dateFormat(time, 'yyyy/MM/dd')
        const amount = list[i].changed
        const current = list[i].current
        const itemType = i18n.t('coin_type.' + getCoinType(type).name)
        const userId = list[i].user.id
        itemList.push({ id, type, time, current, itemType, amount, userId })
      }
      if (!next) {
        commit('Set_Deallist', { type: 0, val: itemList })
        Storage.setLocal('deallist', itemList)
      } else commit('Set_Deallist', { type: 1, val: itemList })
    })
  },
  VA__GetHaveBadge({ commit, state }) {
    const msg = state.Msg
    const haveBadge = msg.some(item => {
      if (item.unread_msg_count > 0) {
        return true
      }
    })
    commit('Set_haveBadge', haveBadge)
  },
  async VA__GetNotices({ commit, state }, params) {
    let count = 0
    params = JSON.parse(JSON.stringify(params))
    await getNotices(params).then(res => {
      count = res.data.count
      const results = res.data.results
      const list = []
      const regex = /<\/?.+?>/g
      results.forEach(item => {
        let content = item.content
        content = content.replace(regex, '')
        const obj = {
          id: item.id,
          title: item.title,
          date: dateFormat(item.updated_at),
          content,
        }
        list.push(obj)
      })
      const payload = {
        val: list,
        type: 0,
      }
      if (params.page > 1) {
        payload.type = 1
        commit('Set_notices', payload)
      } else {
        commit('Set_notices', payload)
      }
      Storage.setLocal('notices', state.notices)
      params.page++
    })
    return {
      count,
      queryObj: params,
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
