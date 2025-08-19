import Storage from '@/utils/storage'

const ignoreLocal = ['locale', 'tpay_notices_read_date', 'coinList']

export function loginOut(activeToast = 0) {
  removeCaches()
  location.reload()
  // logout().then(res => {
  //   location.reload();
  // }).catch(() => {
  //   if (activeToast === 1) {
  //     Toast({
  //       message: i18n.t('tip.logoutSuccess'),
  //       type: 'fail',
  //       duration: 3 * 1000,
  //       onClose() {
  //         window.location.reload() // 刷新浏览器
  //       }
  //     })
  //   } else if (activeToast === 2) {
  //     Toast({
  //       message: i18n.t('tip.sessionExpire'),
  //       type: 'fail',
  //       duration: 3 * 1000,
  //       onClose() {
  //         window.location.reload() // 刷新浏览器
  //       }
  //     })
  //   } else {
  //     window.location.reload()
  //   }
  // })
  // router.push('loginRegister')
}

export function removeCaches() {
  clearLocal_overwrite()
  // Storage.clearLocal()
  Storage.removeCookie('csrftoken')
  Storage.removeCookie('sessionid')
}

export function clearLocal_overwrite() {
  const localStorage = window.localStorage;
  Object.keys(localStorage).forEach(key => {
    if (ignoreLocal.indexOf(key) === -1) {
      localStorage.removeItem(key);
    }
  })
}
