import request from '@/utils/request'

export function getRecordsList(queryObj) {
  return request({
    url: '/record/',
    method: 'get',
    params: queryObj, // get 使用params，其他用data
  })
}

export function getRecordsInfo(id) {
  return request({
    url: `/record/${id}/`,
    method: 'get',
  })
}
