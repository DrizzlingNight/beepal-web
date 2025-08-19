import axios from 'axios'
// import { settings } from '@/config'
// import { loginOut } from '@/utils/logout'
import Storage from '@/utils/storage'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout // FIXME:2021.08.17 暫時先把timeout設10秒，有問題再改回50秒
})

const pending = []
const CancelToken = axios.CancelToken

export const removePending = ever => {
  for (const p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) {
      // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}

// 为请求 https://www.okex.me/v2/futures/pc/market/marketOverview.do?symbol=f_usd_all&t=1575439009675
export const requestOkex = axios.create({
  baseURL: '/okexApi', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    const regex = /.*csrftoken=([^;.]*).*$/ // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] =
      document.cookie.match(regex) === null
        ? null
        : document.cookie.match(regex)[1]
    config.headers['Authorization'] = `Bearer ${Storage.getLocal('token')}` // 設置Authorization
    if (config.params && !config.params.do) {
      removePending(config) // 在一个ajax发送前执行一下取消操作
      config.cancelToken = new CancelToken(c => {
        // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        pending.push({
          u: config.url + '&' + config.method,
          f: c,
        })
      })
    }
    return config
  },
  error => {
    // do something with request error
    console.log('请求错误-error:', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log('响应拦截器-response：', response)
    // console.log('响应拦截器-response-status：', response.status)

    Storage.setSession('isTimeout', false) // 如果requset發送成功則timeout設成false

    // 如果不是2、3开头，那就表示出错了
    if (response.status < 200 || response.status >= 400) {
      // Toast({
      //   message: res.message || 'Error',
      //   type: 'fail',
      //   duration: 5 * 1000,
      // })
      console.error('返回的不是2、3开头的状态码')

      return Promise.reject(
        new Error(res.message || 'service.interceptors.response------Error')
      )
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      // console.log('响应拦截器-error.response.status:', error.response.status)
      switch (error.response.status) {
        case 400:
          console.log('-----------400----------')
          Storage.setSession('isTimeout', false) // 如果requset發送成功則timeout設成false
          return Promise.reject(error.response)
        case 401:
          // logout时返回401，且没有额外信息返回
          console.log('-----------401 Unauthorized----------')
          Storage.setSession('isTimeout', false) // 如果requset發送成功則timeout設成false
          return Promise.reject(error.response)
        case 403:
          // 登录失败时返回403，无权访问某些接口也返回403
          console.log('-----------403 Fobidden----------')
          // if (settings.needLogin) {
          //   loginOut(2)
          // }
          Storage.setSession('isTimeout', false) // 如果requset發送成功則timeout設成false
          return Promise.reject(error.response)
        default:
          console.error('request-default-error!')
          Storage.setSession('isTimeout', true)
          // Toast({
          //   message: error.message,
          //   type: 'fail',
          //   duration: 5 * 1000,
          //   className: 'response-error',
          // })
          return Promise.reject(error.response)
      }
    } else {
      // Toast({
      //   message: '请求失败！',
      //   type: 'fail',
      //   duration: 4 * 1000,
      // })
      // window.location.reload() // 如果timeout就讓網頁重整
      return Promise.reject(error.response)
    }
  }
)

async function request({ url, method, data, params, timeout, cancel = true }) {
  return await service({ url, method, data, params, timeout, cancel })
}
//
// export default service
export default request
