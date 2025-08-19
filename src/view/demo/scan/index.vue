<template>
  <div class="scan">
    <page-head :title="$t('scan.title')"></page-head>
    <div class="app__layout">
      <!-- Header -->
      <!-- <header class="app__header">
           <span class="app__header-icon" onclick="window.open('https://github.com/code-kotis/qr-code-scanner', '_blank', 'toolbar=0,location=0,menubar=0');">
             <svg fill="#FFFFFF" height="27" viewBox="0 0 24 24" width="27" xmlns="http://www.w3.org/2000/svg">
               <path d="M0 0h24v24H0z" fill="none" />
               <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" />
             </svg>
           </span>
         </header> -->
      <van-overlay :show="show">
        <van-loading type="spinner" size="24px" class="loading"/>
      </van-overlay>
      <main class="app__layout-content">
        <video id="myvideo" autoplay width="300px" height="300px"></video>

        <!-- Dialog  -->
        <div class="app__dialog app__dialog--hide">
          <div class="app__dialog-content">
            <h5>QR Code</h5>
            <input id="result" type="text"/>
          </div>
          <div class="app__dialog-actions">
            <button type="button" class="app__dialog-open">Open</button>
            <button type="button" class="app__dialog-close">Close</button>
          </div>
        </div>

        <div class="app__dialog-overlay app__dialog--hide"></div>

        <!-- Snackbar -->
        <div class="app__snackbar"></div>
      </main>
    </div>

    <div class="app__overlay">
      <div class="lt"></div>
      <div class="rt"></div>
      <div class="rb"></div>
      <div class="lb"></div>
      <div class="app__overlay-frame"></div>
      <!-- Scanner animation -->
      <!--      <div class="custom-scanner"></div>-->
      <div class="app__help-text"></div>
    </div>
    <div class="app__select-photos"></div>
  </div>
</template>

<script>
  // import '@/utils/scan/main'
  import pageHead from '@/components/head/Normal_head'
  import { Icon, Loading, Overlay } from 'vant'
  import isURL from 'is-url'

  export default {
    components: {
      [Icon.name]: Icon,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
      pageHead,
    },
    data() {
      return {
        thisVideo: null,
        show: false,
      }
    },
    created() {
      // window.DOMContentLoaded();
    },
    mounted() {
      // To check the device and add iOS support
      window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0
      window.isMediaStreamAPISupported =
        navigator &&
        navigator.mediaDevices &&
        'enumerateDevices' in navigator.mediaDevices
      // alert('是否支持多媒体:' + window.isMediaStreamAPISupported);
      window.noCameraPermission = false
      var copiedText = null
      var frame = null
      var selectPhotoBtn = document.querySelector('.app__select-photos')
      var dialogElement = document.querySelector('.app__dialog')
      var dialogOverlayElement = document.querySelector('.app__dialog-overlay')
      var dialogOpenBtnElement = document.querySelector('.app__dialog-open')
      var dialogCloseBtnElement = document.querySelector('.app__dialog-close')
      // var scanningEle = document.querySelector('.custom-scanner');
      var textBoxEle = document.querySelector('#result')
      // var helpTextEle = document.querySelector('.app__help-text')
      // var infoSvg = document.querySelector('.app__header-icon svg')
      // var videoElement = document.querySelector('video')
      var _this = this
      window.appOverlay = document.querySelector('.app__overlay')
      // Initializing qr scanner
      this.$nextTick(() => {
        // window.addEventListener('load', event => {
        console.log('onloading')
        _this.qrReader.init() // To initialize QR Scanner
        // Set camera overlay size
        setTimeout(() => {
          setCameraOverlay()
          console.log(
            'is the media stream api supported? ' +
            (window.isMediaStreamAPISupported || false),
          )
          // if (window.isMediaStreamAPISupported) {
          try {
            scan()
          } catch (e) {
            alert(e)
          }

          // }
        }, 1000)

        // To support other browsers who dont have mediaStreamAPI
        selectFromPhoto()
      })

      function setCameraOverlay() {
        window.appOverlay.style.borderStyle = 'solid'
      }

      function createFrame() {
        frame = document.createElement('img')
        frame.src = ''
        frame.id = 'frame'
      }

      // Dialog close btn event
      dialogCloseBtnElement.addEventListener('click', hideDialog, false)
      dialogOpenBtnElement.addEventListener('click', openInBrowser, false)

      // To open result in browser
      function openInBrowser() {
        console.log('Result: ', copiedText)
        window.open(copiedText, '_blank', 'toolbar=0,location=0,menubar=0')
        copiedText = null
        hideDialog()
      }

      // Scan
      let timer

      function scan(forSelectedPhotos = false) {
        // if (window.isMediaStreamAPISupported && !window.noCameraPermission) {
        //   scanningEle.style.display = 'block';
        // }
        if (_this.show) {
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            alert(_this.$t('scan.text_16'))
            _this.show = false
            frame.className = ''
            frame.src = ''
            scan()
          }, 8000)
        }
        // if (forSelectedPhotos) {
        //   scanningEle.style.display = 'block';
        // }
        let first = 0
        _this.qrReader.scan(result => {
          first = 0
          copiedText = result
          textBoxEle.value = result
          textBoxEle.select()
          // scanningEle.style.display = 'none';
          if (isURL(result)) {
            // dialogOpenBtnElement.style.display = 'inline-block'
            if (first === 0) {
              alert(_this.$t('scan.text_15'))
            }
            first = 1
            frame.className = ''
            frame.src = ''
            clearTimeout(timer)
            setTimeout(() => {
              scan()
            }, 1000)
            if (_this.show) {
              _this.show = false
            }
          } else {
            let type = null
            let userid = null
            try {
              type = JSON.parse(result).type
              userid = JSON.parse(result).userid
              _this.$router.push({
                name: type,
                query: {
                  userid,
                },
              })
            } catch (e) {
              alert(_this.$t('scan.text_15'))
              setTimeout(() => {
                scan()
              }, 1000)
              if (_this.show) {
                _this.show = false
              }
            }
            // const username = JSON.parse(result).username
            // _this.$router.push('/' + type + '?userid='+userid + '&username='+username);
          }
          // dialogElement.classList.remove('app__dialog--hide')
          // dialogOverlayElement.classList.remove('app__dialog--hide')
          // const frame = document.querySelector('#frame')
          // if (forSelectedPhotos && frame) frame.remove();
        }, forSelectedPhotos)
      }

      // Hide dialog
      function hideDialog() {
        copiedText = null
        textBoxEle.value = ''

        if (!window.isMediaStreamAPISupported) {
          frame.src = ''
          frame.className = ''
        }

        dialogElement.classList.add('app__dialog--hide')
        dialogOverlayElement.classList.add('app__dialog--hide')
        scan()
      }

      function selectFromPhoto() {
        // Creating the camera element
        var camera = document.createElement('input')
        camera.setAttribute('type', 'file')
        // camera.setAttribute('capture', 'microphone')
        // camera.setAttribute('accept', 'audio/*')
        camera.id = 'camera'
        window.appOverlay.style.borderStyle = ''
        selectPhotoBtn.style.display = 'block'
        createFrame()

        // Add the camera and img element to DOM
        var pageContentElement = document.querySelector('.app__layout-content')
        pageContentElement.appendChild(camera)
        pageContentElement.appendChild(frame)

        // Click of camera fab icon
        selectPhotoBtn.addEventListener('click', () => {
          // scanningEle.style.display = 'none';
          document.querySelector('#camera').click()
        })

        // On camera change
        camera.addEventListener('change', event => {
          if (event.target && event.target.files.length > 0) {
            frame.className = 'app__overlay'
            frame.src = URL.createObjectURL(event.target.files[0])
            _this.show = true
            // if (!window.noCameraPermission) scanningEle.style.display = 'block';
            // window.appOverlay.style.borderColor = 'rgb(62, 78, 184)'
            scan(true)
          }
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';
  @import '@/utils/scan/styles.scss';

  .page-top-safe-area__has-page-title {
    background-color: rgba(0, 0, 0, 0);
    color: $cardColor;
  }
</style>
