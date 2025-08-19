import request from '@/utils/request'

// get 使用params，其他用data

export function getTeamList(queryObj) {
  return request({
    url: '/team/',
    method: 'get',
    params: queryObj,
  })
}
export function getTeamInfo(id) {
  return request({
    url: `/team/${id}/`,
    method: 'get',
  })
}
export function updateTeam(id, data) {
  return request({
    url: `/team/${id}/`,
    method: 'patch',
    data,
  })
}
export function createTeam(data) {
  return request({
    url: `/team/`,
    method: 'post',
    data,
  })
}
export function deleteTeam(id) {
  return request({
    url: `/team/${id}/`,
    method: 'delete',
  })
}
/**
 * @param {Number} type 0是兌入，1是兌出
 * @param {Number} channel 渠道
 */
export function getProfitRate(type, channel) {
  return request({
    url: `team/profit/?bill_type=${type}&channel=${channel}`,
    method: 'get',
  })
}
