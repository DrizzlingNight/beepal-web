/**
 *  使用方法：
 *  1. 引入当前文件
 *  2. 调用 window.SwalButton.init({id: 'button_id'}), id 请自定义
 */

/**
 *  参数
 *  window.SwalButton.init({
 *    id,               // 绑定可以激活弹框的按钮 id
 *    theme,            // String, 可选默认: ['igk', 'bapbet', 'baax', 'baaxplanet', 'baaxbet']
 *    setColor: {       // Object, 自定义 背景颜色 和 按钮颜色
 *      bg: '#fff',
 *      btn: '#000'
 *    },
 *  })
 *
 */

class SwalButton {
  constructor() {
    this.buttonId = null
    this.HomeUrl = "https://www.beex.vip"
    this.frameOrigin = this.HomeUrl + '/#/jumpThirdParty'
    this.sweetalertCDN = 'https://cdn.jsdelivr.net/npm/sweetalert2@9'

    this.appListData = []
    this.appFrameDom = null

    // config
    this.theme = 'igk'
    this.setColor = { bg: '', btn: '' }
    this.themeColor = {
      igk: { bg: '#131B2D', btn: '#303752' },
      bapbet: { bg: '#131B2D', btn: '#303752' },
      baax: { bg: '#131B2D', btn: '#303752' },
      baaxplanet: { bg: '#5E30B9', btn: '#9663FC' },
      baaxbet: { bg: '#242424', btn: '#3B3B3B' }
    }
  }

  init({ id, theme, setColor }) {
    const script = document.createElement('script')
    script.src = this.sweetalertCDN
    script.onload = () => {
      this.buttonId = id
      this.theme = theme || this.theme
      this.setColor = Object.assign({}, this.setColor, setColor)
      this.createIframeDom()

      this.handleSwal()
    }
    document.body.appendChild(script)
  }

  // Swal 弹框样式
  handleSwal() {
    const btn = document.querySelector(`#${this.buttonId}`)
    if (!btn) return alert('未获取 button')
    btn.addEventListener('click', () => {
      Swal.fire({
        title: 'Beex 应用中心',
        background: this.setColor.bg || this.themeColor[this.theme].bg,
        confirmButtonText: '返回 Beex app',
        showCancelButton: true,
        focusConfirm: true,
        width: '320px',
        html: this.appFrameDom,
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup',
          header: 'swal-header',
          actions: 'swal-actions',
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        }
      }).then((result) => {
        if (result.value) {
          window.location.href = this.HomeUrl
        }
      })

      document.querySelector('.swal-cancel-button').innerText = ''
      const closeImg = document.createElement('img')
      const logoImg = document.createElement('img')
      closeImg.className = 'swal-close-img'
      logoImg.className = 'swal-logo-img'
      closeImg.src = '/Public/xin_mobile/static/js/jumpThirdPartyUtils/swalClose.svg'
      logoImg.src = '/Public/xin_mobile/static/js/jumpThirdPartyUtils/swalBeex.svg'
      document.querySelector('.swal-cancel-button').append(closeImg)
      document.querySelector('.swal-confirm-button').append(logoImg)

      this.setStyle('#swal2-title', 'color', '#fff')
      this.setStyle('#swal2-title', 'font-size', '16px')
      this.setStyle('.swal2-content', 'padding', '0')
      this.setStyle('.swal-popup', 'border-radius', '20px')
      this.setStyle('.swal-popup', 'padding', '20px 12px')
      this.setStyle('.swal-confirm-button', 'background', this.setColor.btn || this.themeColor[this.theme].btn)
      this.setStyle('.swal-confirm-button', 'border', 'none')
      this.setStyle('.swal-confirm-button', 'font-size', '14px')
      this.setStyle('.swal-confirm-button', 'display', 'flex')
      this.setStyle('.swal-confirm-button', 'align-items', 'center')
      this.setStyle('.swal-actions', 'position', 'relative')
      this.setStyle('.swal-actions', 'margin', '8px auto 0')
      this.setStyle('.swal-cancel-button', 'position', 'absolute')
      this.setStyle('.swal-cancel-button', 'top', '80px')
      this.setStyle('.swal-cancel-button', 'padding', '0')
      this.setStyle('.swal-cancel-button', 'background', '0')
      this.setStyle('.swal-close-img', 'width', '50px')
      this.setStyle('.swal-logo-img', 'width', '30px')
      this.setStyle('.swal-logo-img', 'margin-left', '8px')
      this.setStyle('#frame', 'width', '250px')
      this.setStyle('#frame', 'height', '320px')
    })
  }

  createIframeDom() {
    const frame = document.createElement('iframe')
    frame.id = 'frame'
    frame.src = this.frameOrigin
    frame.frameBorder = 0
    this.appFrameDom = frame
  }

  setStyle(element, key, value) {
    document.querySelector(element).style.setProperty(key, value, 'important');
  }
}

window.addEventListener("message", (e) => {
  if (e.data.type === 'beex-jump-third-party') {
    window.location.href = e.data.url
  }
}, false);

window.SwalButton = new SwalButton()
