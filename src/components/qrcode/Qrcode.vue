<template>
  <div class="qrcode">
    <canvas ref="qrcode" class="qrcode" style="display: none"></canvas>
    <div ref="ewm" class="qrcode"></div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { QRCodeCanvas } from '@cheprasov/qrcode'

export default {
  name: 'FgQrcode',
  props: {
    text: {
      type: String,
      default: 'fg',
    },
  },
  watch: {
    text: {
      immediate: true,
      handler() {
        this.text && this.$nextTick().then(() => this.qrcodeWithLogo(this.text))
      },
    },
  },

  methods: {
    qrcode(text) {
      const dom = this.$refs['qrcode']
      QRCode.toCanvas(dom, text, { errorCorrectionLevel: 'H' }, function(error) {
        if (error) console.error(error)
      })
      var img = this.canvasToImage(dom);
      var ewmImg = this.$refs['ewm'];
      ewmImg.append(img);
    },
    canvasToImage(canvas) {
      var image = new Image();
      // 指定格式 PNG 圖片後綴可自定義
      image.src = canvas.toDataURL("image/png");
      image.style = "height:100%";
      return image;
    },
    // 2021.12.14 為了配合下載下來的QR Code也要有Logo，改成用套件(@cheprasov/qrcode)把Logo壓上去
    qrcodeWithLogo(text) {
      const config = {
          level: 'H', // use high error correction level
          padding: 0, // do not use padding around qr code data,
          image: {
              source: `${require('@/assets/img/logo_BeePal.png')}`, // 要壓上去的Logo
              width: '20%',
              height: '20%',
              x: 'center',
              y: 'center',
          }
      }
      const qrCanvas = new QRCodeCanvas(text, config)
      const promise = qrCanvas.toDataUrl()

      promise.then(dataUrl => {
        console.log(dataUrl);
        var image = new Image()
        var ewmImg = this.$refs['ewm']

        image.src = dataUrl
        image.style = "height:100%";
        ewmImg.append(image)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.qrcode {
  height: 100% !important;
  width: 100% !important;
}
</style>
