import Vue from 'vue'
import Router from 'vue-router'
import routes from './modules/index'
import { getUserInfo } from '@/api'
// import { getOTCHistory } from '@/api/beePal'
// import { setOrder } from '@/view/BeePal_deal/config'
// import store from '@/store'
import Storage from '@/utils/storage'
import { Toast } from 'vant'
import { settings } from '@/config'
import { removeCaches } from '@/utils/logout'
import myConsole from '@/utils/console'

Vue.use(Router)

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '')
})

const router = new Router({
  routes,
  // 2021.12.17 Router加上每次進入頁面都會滾到頂部的代碼
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

// const interval = null
const exceptionPath = ['/resetPassword', '/securityValidation']

router.beforeEach((to, from, next) => {
  // 2021.08.02 這邊因為"sessionid"沒東西，暫時先註解掉
  // store.user.VA__logout(null);
  // const sessionid = Storage.getCookie('sessionid')
  // console.log(sessionid,userInfo);
  // if (!sessionid || !userInfo) {
  //   removeCaches()
  // }
  const token = Storage.getLocal('token')
  // console.log('token', token)

  // 2021.09.28 因為會導致用戶刷新網頁被清空快取，所以暫時先拔掉
  // if (store.getters.VG__userInfo) {
  //   const certification = store.getters.VG__userInfo.certification ? store.getters.VG__userInfo.certification : null
  //   if (!certification) {
  //     removeCaches() // 如果沒有驗證資料就讓使用者退出重登
  //   }
  // }
  const title = to.meta && to.meta.title
  if (token) {
    __getUserInfo(token) // 如果有token就去驗證有沒有過期
  }
  if (title) {
    document.title = title
  }

  // Storage.setSession('isTimeout', true) // 這個只是測試缺省頁用

  // 设备为 移动端 则跳转 PC 主页
  if (['find', 'my', 'assets', 'currency', 'home'].some(path => to.path.includes(path))) {
    const flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    )
    // console.log('is-mobile?', !!flag)

    if (process.env.NODE_ENV === 'production' && !flag) {
      settings.web && settings.web.pc ? window.location.href = settings.web.pc : undefined
    }
  } else {
    // console.log('不检测设备');
  }

  // TODO: 2021.08.02 認證方式改成token，所以重寫判斷
  if (settings.needLogin && token) {
    next()
  } else if (settings.needLogin && !token) {
    if (to.path === '/loginRegister') {
      next()
    } else if (exceptionPath.includes(to.path)) {
      next()
    } else {
      next('/loginRegister')
    }
  } else {
    next()
  }

  // 2021.08.02 認證方式改成token，所以這段全註解掉
  // const cookie = Storage.getCookie('csrftoken') // 过期后得到 null
  // if (settings.needLogin && cookie) {
  //   // if (to.path !== '/loginRegister') {
  //   next()
  //   // }
  // } else if (settings.needLogin && !cookie) {
  //   console.log('else if needLogin cookie', cookie)
  //   if (to.path === '/loginRegister') {
  //     next()
  //   } else {
  //     next('/loginRegister')
  //   }
  // } else {
  //   next()
  // }
  // next()

  // 2021.08.19 先把設定訂單這一塊從router.beforeEach拿掉，在進入頁面時做就好
  // if (settings.spot_deals) {
  //   if (
  //     [
  //       'deal', 'payment', 'payfor', 'lastLap', 'appeal', 'waiting',
  //     ].some(path => to.path.includes(path))
  //   ) {
  //     // const orderid = to.query.orderid;
  //     // const order = store.getters.G_singleOrderById(orderid)
  //     // if (!order && orderid) next('/deal')
  //     if (interval !== null) return
  //     interval = setInterval(() => {
  //       const params = {
  //         // 2021.08.04 新的API沒有必帶參數，所以先註解掉
  //         // type: 4,
  //         // do: true,
  //       }
  //       getOTCHistory(params).then(res => {
  //         // console.log('router → getOTCHistory: res.data.results', res.data.results)
  //         res = res.data.results
  //         if (res.length === 0) return
  //         // 2021.07.29 這個filter有問題，暫時註解掉
  //         // res = res.filter(item => {
  //         //   return item.status === 1 || item.status === 6 || item.status === 2
  //         // })
  //         // console.log('res:', res)
  //         const arr = []
  //         const userOrderList = store.getters.G_userOrderList
  //         const sellOrderList = store.getters.G_sellOrderList
  //         const array2 = userOrderList.concat(sellOrderList)
  //         new Promise(resolve => {
  //           res.forEach((item, index) => {
  //             setOrder(item, res2 => {
  //               store.dispatch('BeePal/AC_UPDATEORDER', res2)
  //               // this.AC_UPDATEORDER(res)
  //               if (res2.status !== 2) {
  //                 arr.push(res2)
  //               }
  //             })
  //           })
  //           setTimeout(() => {
  //             resolve()
  //           }, 2000)
  //         }).then(res => {
  //           // console.log('concat ALL:', array2)
  //           array2.forEach(item => {
  //             const id = item.id
  //             let flag = true
  //             arr.forEach(temp => {
  //               if (id === temp.id) {
  //                 flag = false
  //               }
  //             })
  //             // console.log('flag:', flag)
  //             if (flag) {
  //               store.dispatch('BeePal/AC_REMOVEORDER', item.id)
  //               // this.AC_REMOVEORDER(item.id)
  //             }
  //           })
  //         })
  //         // const result = []
  //       })
  //     }, 5000)
  //   } else {
  //     clearInterval(interval)
  //     interval = null
  //   }
  // }
})
router.afterEach(() => {
  Toast.clear()
})

async function __getUserInfo(token) {
  await getUserInfo(token)
    .then(async res => {
    })
    .catch(err => {
      myConsole.error('getUserInfo-err', err)
      removeCaches()
      window.location.reload() // 刷新頁面讓它跳轉
    })
}
export default router
