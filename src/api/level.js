import request from '@/utils/request'

// 只有是‘系統管理員’和‘承兌商管理員’纔有權限訪問level接口
export function getLevelList() {
  return request({
    url: '/level/',
    method: 'get',
  })
}
export function createLevel(obj) {
  return request({
    url: '/level/',
    method: 'post',
    data: obj,
  })
}
export function deleteLevel(id) {
  return request({
    url: `/level/${id}/`,
    method: 'delete',
  })
}
export function updateLevel(id, obj) {
  return request({
    url: `/level/${id}/`,
    method: 'patch',
    data: obj,
  })
}
