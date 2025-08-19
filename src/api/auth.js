import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login/',
    method: 'post',
    data,
  })
}

export function getUserInfo(data) {
  return request({
    url: '/user/me/',
    method: 'get',
    data,
  })
}

export function signup(data) {
  return request({
    url: '/user/signup/',
    method: 'post',
    data,
  })
}

export function logout() {
  return request({
    url: '/user/logout/',
    method: 'post',
    timeout: 10000, // request timeout
  })
}

export function identityAuth(userId, data, is_active = false) {
  return request({
    url: `/user/${userId}/`,
    method: 'put',
    data: { profile: data, is_active },
  })
}

// 添加身份認證
export function createAuth(data, method, id) {
  let url = '/user/certification/'
  if (id && method !== 'post') url = url + id + '/'
  return request({
    url,
    method: method,
    data,
  })
}

// 添加傳送驗證碼
export function sendValidationCode(data) {
  return request({
    url: '/common/sms/send_code/',
    method: 'post',
    data,
  })
}
