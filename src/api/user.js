import request from '@/utils/request'

export function getUserList(queryObj) {
  return request({
    url: '/user/',
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

export function getUserById(id) {
  return request({
    url: `/user/${id}/`,
    method: 'get'
  })
}

export function updateUser(id, obj) {
  return request({
    url: `/user/${id}/`,
    method: 'patch',
    data: obj,
  })
}

export function getUserInfoById(userId) {
  return request({
    url: `/user/${userId}/`,
    method: 'get',
  })
}

export function setPassword(data) {
  return request({
    url: '/user/reset_password/',
    method: 'post',
    data,
  })
}

export function setSecurityPassword(data) {
  return request({
    url: `/user/set_security_code/`,
    method: 'post',
    data,
  })
}

export function getUserCertification(user) {
  return request({
    url: `/user/certification/${user}/`,
    method: 'get',
  })
}

export function getFriendList(params) {
  return request({
    url: `/user/friend/`,
    method: 'get',
    params
  })
}

export function addFriend(data) {
  return request({
    url: `/user/friend/add_friend/`,
    method: 'post',
    data
  })
}

export function deleteFriend(data) {
  return request({
    url: `/user/friend/del_friend/`,
    method: 'post',
    data
  })
}

export function sendMessage(data) {
  return request({
    url: `/user/friend/send_message/`,
    method: 'post',
    data
  })
}

