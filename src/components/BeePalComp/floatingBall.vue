<template>
  <div ref="oBlock" class="ball" @mouseup="gotoDetail" @resize="resize">
    <slot name="head">
      <img src="@/assets/coins/BeePal/undefined.png" width="44" />
    </slot>
    <div v-show="detailShow" class="content">
      <slot :direction="direction" name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingBall',
  data() {
    return {
      // 計算小球的寬高oBlockWidth、oBlockHeight
      // 計算屏幕的寬高oClientWidth、oClientHeight
      // oToucheWidth，oToucheHeight分別表示觸摸點到小球左邊緣和上邊緣的距離。
      oBlockWidth: null,
      oBlockHeight: null,
      oClientWidth: null,
      oClientHeight: null,
      oToucheWidth: null,
      oToucheHeight: null,
      // 細節顯示
      detailShow: true,
      // 方向
      direction: 'right',
      touches: false,
    }
  },
  created() {
    this.$nextTick(() => {
      const oBlock = this.$refs.oBlock
      this.observer = new ResizeObserver(entries => {
        entries.forEach(item => {
          if (this.touches === false) {
            if (this.direction === 'right') {
              oBlock.style.left = this.oClientWidth - oBlock.offsetWidth + 'px'
            } else {
              oBlock.style.right = this.oClientWidth - oBlock.offsetWidth + 'px'
            }
          }
        })
      })
      this.observer.observe(oBlock)
      this.oBlockWidth = oBlock.offsetWidth
      this.oBlockHeight = oBlock.offsetHeight
      this.oClientWidth = document.documentElement.clientWidth
      this.oClientHeight = document.documentElement.clientHeight
      oBlock.style.left = this.oClientWidth - this.oBlockWidth + 'px'
      window.addEventListener('resize', () => {
        setTimeout(() => {
          this.oBlockWidth = oBlock.offsetWidth
          this.oBlockHeight = oBlock.offsetHeight
          this.oClientWidth = document.documentElement.clientWidth
          this.oClientHeight = document.documentElement.clientHeight
        })
      })
      // TODO: 2021.11.25 暫時性暴力解法，解決拖動元件後會導致畫面無法滑動的問題
      // this.touchStart(oBlock)
      // this.touchMove(oBlock)
      // this.touchEnd(oBlock)
    })
  },
  methods: {
    fnDefaultEvent(e) {
      e.preventDefault()
    },
    resize() {
      console.log(123)
    },
    gotoDetail() {
      this.$emit('gotoDetail')
    },
    touchStart(oBlock) {
      oBlock.addEventListener(
        'touchstart',
        e => {
          this.touches = true
          oBlock.style.transition = ''
          document.addEventListener('touchmove', this.fnDefaultEvent, {
            passive: false,
          })
        },
        { passive: false }
      )
    },
    touchMove(oBlock) {
      oBlock.addEventListener(
        'touchmove',
        e => {
          const touches = e.touches[0]
          this.detailShow = false
          setTimeout(() => {
            this.oBlockWidth = oBlock.offsetWidth
            this.oBlockHeight = oBlock.offsetHeight
            this.oToucheWidth = this.oBlockWidth / 2
            this.oToucheHeight = this.oBlockHeight / 2
          })
          oBlock.style.borderBottomLeftRadius = '100px'
          oBlock.style.borderTopLeftRadius = '100px'
          oBlock.style.borderBottomRightRadius = '100px'
          oBlock.style.borderTopRightRadius = '100px'
          let oLeft = touches.clientX - this.oToucheWidth
          let oRight =
            this.oClientWidth -
            (touches.clientX + this.oBlockWidth - this.oToucheWidth)
          let oTop = touches.clientY - this.oToucheHeight
          if (oLeft < 0) {
            oLeft = 0
          } else if (oLeft > this.oClientWidth - this.oBlockWidth) {
            oLeft = this.oClientWidth - this.oBlockWidth
          }
          if (oRight < 0) {
            oRight = 0
          } else if (oRight > this.oClientWidth - this.oBlockWidth) {
            oRight = this.oClientWidth - this.oBlockWidth
          }
          if (oTop < 60) {
            oTop = 60
          } else if (oTop > this.oClientHeight - this.oBlockHeight - 60) {
            oTop = this.oClientHeight - this.oBlockHeight - 60
          }
          if (
            oBlock.offsetLeft <
            this.oClientWidth / 2 - this.oBlockWidth / 2
          ) {
            oBlock.style.left = ''
            oBlock.style.right = oRight + 'px'
          } else {
            oBlock.style.right = ''
            oBlock.style.left = oLeft + 'px'
          }
          /* 動態設置小球的left，top值*/
          // oBlock.style.left = oLeft + 'px'
          oBlock.style.top = oTop + 'px'
        },
        {
          passive: false,
        }
      )
    },
    touchEnd(oBlock) {
      oBlock.addEventListener(
        'touchend',
        e => {
          // document.removeEventListener('touchmove', this.fnDefaultEvent, {
          //   passive: false,
          // })
          var oLeft = oBlock.offsetLeft
          if (oLeft <= this.oClientWidth / 2 - this.oBlockWidth / 2) {
            oBlock.style.direction = 'rtl'
            this.direction = 'left'
          } else {
            oBlock.style.direction = 'ltr'
            this.direction = 'right'
          }
          this.detailShow = true
          // const touches = e.touches[0]
          setTimeout(() => {
            const oBlockWidth = oBlock.offsetWidth
            // this.oBlockHeight = oBlock.offsetHeight
            oBlock.style.transition = 'all .3s'
            /* 設置小球吸附邊緣效果，小球拖動結束後停在靠近的屏幕邊緣*/
            if (this.direction === 'left') {
              oBlock.style.borderBottomLeftRadius = '0'
              oBlock.style.borderTopLeftRadius = '0'
              oBlock.style.left = ''
              oBlock.style.right = this.oClientWidth - oBlockWidth + 'px'
            } else {
              oBlock.style.borderBottomRightRadius = '0'
              oBlock.style.borderTopRightRadius = '0'
              oBlock.style.right = ''
              oBlock.style.left = this.oClientWidth - oBlockWidth + 'px'
            }
            this.touches = false
          })
        },
        {
          passive: false,
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.ball {
  position: absolute;
  top: calc(100% - 150px);
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  padding: 4px;
  background: $pageBgColor;
}
</style>
