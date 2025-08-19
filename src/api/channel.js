import request from '@/utils/request'

// 支付通道------------------------------------------
export function getChannelList(queryObj) {
  return request({
    url: '/user/payment/',
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

export function createChannel(queryObj) {
  return request({
    url: '/user/payment/',
    method: 'post',
    data: queryObj, // get 使用params，其他用data
  })
}
export function updateChannel(id, queryObj) {
  return request({
    url: `/user/payment/${id}/`,
    method: 'patch',
    data: queryObj, // get 使用params，其他用data
  })
}
export function deleteChannelById(id) {
  return request({
    url: `/user/payment/${id}/`,
    method: 'delete',
  })
}
// 下面是單個用戶的支付通道-----------------------------
export function getUserChannelList(userId, queryObj) {
  return request({
    url: `/user/${userId}/channel/`,
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

export function createUserChannel(userId, queryObj) {
  return request({
    url: `/user/${userId}/channel/`,
    method: 'post',
    data: queryObj, // get 使用params，其他用data
  })
}

export function getUserChannelInfo(userId, id, queryObj) {
  return request({
    url: `/user/${userId}/channel/${id}/`,
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}
export function updateUserChannel(userId, id, queryObj) {
  return request({
    url: `/user/${userId}/channel/${id}/`,
    method: 'patch',
    data: queryObj, // get 使用params，其他用data
  })
}
export function deleteUserChannelById(userId, id) {
  return request({
    url: `/user/${userId}/channel/${id}/`,
    method: 'delete',
  })
}
// 下面是單個羣組的支付通道-----------------------------
export function getTeamChannelList(teamId, queryObj) {
  return request({
    url: `/team/${teamId}/channel/`,
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

export function createTeamChannel(teamId, queryObj) {
  return request({
    url: `/team/${teamId}/channel/`,
    method: 'post',
    data: queryObj, // get 使用params，其他用data
  })
}

export function getTeamChannelInfo(teamId, id, queryObj) {
  return request({
    url: `/team/${teamId}/channel/${id}/`,
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}
export function updateTeamChannel(teamId, id, queryObj) {
  return request({
    url: `/team/${teamId}/channel/${id}/`,
    method: 'patch',
    data: queryObj, // get 使用params，其他用data
  })
}
export function deleteTeamChannelById(teamId, id) {
  return request({
    url: `/team/${teamId}/channel/${id}/`,
    method: 'delete',
  })
}
