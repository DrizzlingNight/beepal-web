import { snackbar } from './snackbar.js'

var QRReader = {}

QRReader.active = false
QRReader.webcam = null
QRReader.canvas = null
QRReader.ctx = null
QRReader.decoder = null

QRReader.setCanvas = () => {
  QRReader.canvas = document.createElement('canvas')

  QRReader.ctx = QRReader.canvas.getContext('2d')
}

function setPhotoSourceToScan(forSelectedPhotos) {
  if (!forSelectedPhotos && window.isMediaStreamAPISupported) {
    // console.log('get the video')
    QRReader.webcam = document.querySelector('video')
  } else {
    // console.log('get the img')
    QRReader.webcam = document.querySelector('#frame')
  }
  // console.log('Is the webcam ready? ' + !!QRReader.webcam)
}

QRReader.init = () => {
  // console.log('QRReader init')
  var baseurl = 'static/js/'
  var streaming = false
  // Init Webcam + Canvas
  setPhotoSourceToScan()
  QRReader.setCanvas()
  QRReader.decoder = new Worker(baseurl + 'decoder.js')
  if (window.isMediaStreamAPISupported) {
    // Resize webcam according to input
    QRReader.webcam.addEventListener(
      'play',
      function(ev) {
        if (!streaming) {
          setCanvasProperties()
          streaming = true
        }
      },
      false,
    )
  } else {
    setCanvasProperties()
  }

  function setCanvasProperties() {
    // alert(window.innerHeight + ' ' + window.innerWidth)
    // const test = document.createElement('div')
    // test.style.width = window.innerWidth + 'px';
    // test.style.height = window.innerHeight + 'px';
    // test.style.background = '#000';
    // document.querySelector('.app__layout-content').append(test);
    QRReader.canvas.width = window.innerWidth
    QRReader.canvas.height = window.innerHeight
  }

  function startCapture(constraints) {
    getUserMedia(constraints)
      .then(function(stream) {
        // console.log('the video stream is ' + stream)
        QRReader.webcam.srcObject = stream
        QRReader.webcam.setAttribute('playsinline', true)
        QRReader.webcam.setAttribute('controls', true)
        setTimeout(() => {
          document.querySelector('video').removeAttribute('controls')
        })
        // QRReader.webcam.onloadedmetadata = function (e) {
        //   QRReader.webcam.play()
        // }
      })
      .catch(function(err) {
        alert(err)
        // console.log('Error occurred ', err)
        showErrorMsg()
      })
  }

  function getUserMedia(constraints) {
    if (navigator.mediaDevices.getUserMedia) {
      // 最新标准API、
      return navigator.mediaDevices.getUserMedia(constraints)
    } else if (navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
      // webkit内核浏览器
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser'),
            )
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      return navigator.mediaDevices.getUserMedia(constraints)
    } else if (navigator.getUserMedia) {
      // 旧版API
      return navigator.getUserMedia(constraints)
    }
  }

  if (window.isMediaStreamAPISupported) {
    navigator.mediaDevices
      .enumerateDevices()
      .then(function(devices) {
        // console.log(devices)
        var device = devices.filter(function(device) {
          // var deviceLabel = device.label.split(',')[1];
          if (device.kind === 'videoinput') {
            return device
          }
        })
        var constraints
        if (device.length > 1) {
          constraints = {
            video: {
              deviceId: {
                exact: device[device.length - 1].deviceId
                  ? device[device.length - 1].deviceId
                  : null,
              },
            },
            audio: false,
          }
          if (window.iOS) {
            constraints.video.facingMode = 'environment'
          }
          startCapture(constraints)
        } else if (device.length) {
          constraints = {
            video: {
              deviceId: device[0].deviceId ? device[0].deviceId : null,
            },
            audio: false,
          }
          if (window.iOS) {
            constraints.video.facingMode = 'environment'
          }
          if (!window.iOS && !constraints.video.mandatory.sourceId) {
            startCapture({
              video: true,
            })
          } else {
            startCapture(constraints)
          }
        } else {
          startCapture({
            video: true,
          })
        }
      })
      .catch(function(error) {
        showErrorMsg()
        console.error('Error occurred : ', error)
      })
  }

  function showErrorMsg() {
    window.noCameraPermission = true
    // document.querySelector('.custom-scanner').style.display = 'none';
    snackbar.show('Unable to access the camera', 10000)
  }
}

/**
 * \brief QRReader Scan Action
 * Call this to start scanning for QR codes.
 *
 * \param A function(scan_result)
 */
QRReader.scan = function(callback, forSelectedPhotos) {
  QRReader.active = true
  QRReader.setCanvas()

  let timer = null

  function onDecoderMessage(event) {
    if (forSelectedPhotos) {
      if (!timer) {
        timer = setTimeout(() => {
          QRReader.active = false
          callback()
        }, 3000)
      }
    }
    if (event.data.length > 0) {
      var qrid = event.data[0][2]
      clearTimeout(timer)
      timer = null
      QRReader.active = false
      callback(qrid)
    }
    setTimeout(newDecoderFrame, 0)
  }

  QRReader.decoder.onmessage = onDecoderMessage

  setTimeout(() => {
    setPhotoSourceToScan(forSelectedPhotos)
  })

  // Start QR-decoder
  function newDecoderFrame() {
    if (!QRReader.active) return
    try {
      QRReader.ctx.drawImage(
        QRReader.webcam,
        0,
        0,
        QRReader.canvas.width,
        QRReader.canvas.height,
      )
      var imgData = QRReader.ctx.getImageData(
        0,
        0,
        QRReader.canvas.width,
        QRReader.canvas.height,
      )
      // console.log(QRReader.decoder);
      if (imgData.data) {
        QRReader.decoder.postMessage(imgData)
      }
    } catch (e) {
      // Try-Catch to circumvent Firefox Bug #879717
      if (e.name === 'NS_ERROR_NOT_AVAILABLE') setTimeout(newDecoderFrame, 0)
    }
  }

  newDecoderFrame()
}

export default QRReader
