import request from '@/utils/request'

// get 使用params，其他用data

export function getSecretList(queryObj) {
  return request({
    url: '/secret/',
    method: 'get',
    params: queryObj,
  })
}
export function getSecretInfo(id) {
  return request({
    url: `/secret/${id}/`,
    method: 'get',
  })
}
export function createSecret(queryObj) {
  return request({
    url: `/secret/`,
    method: 'post',
    data: queryObj,
  })
}
export function deleteScript(id) {
  return request({
    url: `/secret/${id}/`,
    method: 'delete',
  })
}
