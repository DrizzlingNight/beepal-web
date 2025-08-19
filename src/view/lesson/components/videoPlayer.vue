<template>
  <div class="video-container">
    <!-- 影片播放器 -->
    <video :id="`video${section.id}`" playsinline preload="auto" class="video" @click.stop="playButtonOnclick" @dblclick.stop="fullscreenButtonOnclick" >
      <source :src="section.resource" type="video/mp4" />
      <source :src="section.resource" type="video/ogg" />
      <source :src="section.resource" type="video/ogv" />
    </video>
    <!-- 撥放器介面 -->
    <div v-show="isControlsShow" class="controls-container">
      <div class="controls">
        <van-button class="play-button" @click.stop="playButtonOnclick">
          <svg-icon v-if="isPaused" icon-class="play-icon" class-name="play-icon"/>
          <svg-icon v-else icon-class="pause-icon" class-name="pause-icon"/>
        </van-button>
        <van-slider
          v-model="currentDuration"
          :max="section.duration"
          active-color="#ffe183"
          inactive-color="#ffffff"
          bar-height="8px"
          button-size="15px"
          class="slider"
          @change="sliderOnchange"
        >
        </van-slider>
        <p class="time">{{ currentDuration | calculateDuration }}</p>
        <van-button class="share-button" @click.stop="$emit('share', section, 'section')">
          <svg-icon icon-class="share-icon-white" class-name="share-icon-white"/>
        </van-button>
        <van-button class="full-screen-button" @click.stop="fullscreenButtonOnclick">
          <svg-icon icon-class="full-screen-icon" class-name="full-screen-icon"/>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Slider, } from 'vant'

export default {
  name: 'VideoPlayer',
  components: {
    [Button.name]: Button,
    [Slider.name]: Slider,
  },
  filters: {
    // 秒 -> "xx(分) : xx(秒)"
    calculateDuration(secs) {
      const minutes = Math.floor(secs / 60)
      const seconds = Math.floor(secs % 60)
      const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

      return `${returnedMinutes}:${returnedSeconds}`
    },
    // 秒 -> x.x小時
    calculateDurationToHours(secs) {
      return secs % 3600 === 0 ? secs / 3600 : (secs / 3600).toFixed(1)
    }
  },
  props: {
    section: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isControlsShow: true,
      isPaused: true,
      controlsHidden: null,
      currentDuration: this.section.learn_progress.duration || 0
    }
  },
  watch: {
  },
  mounted() {
    const video = document.querySelector(`#video${this.section.id}`)

    // 把video的currentTime和當前學習進度同步
    if (this.section.learn_progress.duration) video.currentTime = this.section.learn_progress.duration

    // 動態同步內鍵撥放器進度條
    video.addEventListener('timeupdate', () => {
      this.currentDuration = Math.floor(video.currentTime)
    })

    // 監聽撥放器播放狀態
    video.addEventListener('play', () => {
      this.isPaused = false
      // 設定讓控制面板隱藏
      this.controlsHidden = setTimeout(() => {
        this.isControlsShow = false
      }, 2000)
    })

    // 監聽撥放器暫停(結束時暫停事件)
    video.addEventListener('pause', () => {
      this.isPaused = true
      // 更新章節學習進度
      this.$emit('updateCurrentDuration', this.section.id, this.currentDuration)
    })

    // // 監聽媒體可以播放時的狀態
    // video.addEventListener('canplay', () => {
    //   this.isPaused = true
    // })

    // // 監聽媒體加載時的狀態
    // video.addEventListener('loadeddata', () => {
    //   this.isPaused = true
    // })
},
  beforeDestroy() {
  },
  methods: {
    // 按下播放鍵
    playButtonOnclick() {
      const video = document.querySelector(`#video${this.section.id}`)

      this.isControlsShow = true

      if (this.isPaused) {
        video.play()
        this.isPaused = false
      } else {
        // 清空控制面板隱藏的Timeout
        clearTimeout(this.controlsHidden)
        video.pause()
        this.isPaused = true
        this.$emit('updateCurrentDuration', this.section.id, this.currentDuration)
      }
    },
    // 從 video 轉換當前時間到 progress bar
    sliderOnchange() {
      const video = document.querySelector(`#video${this.section.id}`)

      this.isControlsShow = true
      // 清空控制面板隱藏的Timeout
      clearTimeout(this.controlsHidden)

      video.currentTime = this.currentDuration

      // 設定讓控制面板隱藏
      this.controlsHidden = setTimeout(() => {
        this.isControlsShow = false
      }, 2000)
    },
    // 展開為全螢幕
    fullscreenButtonOnclick() {
      const video = document.querySelector(`#video${this.section.id}`)

      if (video.webkitEnterFullScreen) {
        // IOS 全螢幕
        video.webkitEnterFullScreen();
      } else {
        // 其他瀏覽器
        video.requestFullscreen()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.video-container {
  width: 100%;
  height: auto;
  position: relative;
  margin-bottom: 0px;
  overflow: hidden;

  .video {
    display: flex;
    width: 100%;
    height: auto;
  }
}

.controls-container {
  // position: absolute;
  // bottom: 0px;
  height: 40px;

  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: -40px;
    padding-right: 10px;

    .play-button {
      width: 26px;
      height: 26px;
      margin-left: 18px;
      margin-right: 12px;
    }
    .play-icon, .pause-icon {
      width: 26px;
      height: 26px;
    }

    .share-button {
      position: absolute;
      top: 20px;
      right: 35px;
      background: none;
      width: 20px;
      height: 20px;
      border: none;
      margin-left: 10px;
    }
    .share-icon-white {
      width: 15px;
      height: 14px;
    }

    .full-screen-button {
      position: absolute;
      top: 20px;
      right: 10px;
      background: none;
      width: 20px;
      height: 20px;
      border: none;
      margin-left: 10px;
    }
    .full-screen-icon {
      width: 20px;
      height: 20px;
    }

    .custom-button {
      z-index: 1;
      width: 50px;
      height: 50px;
      color: #ffe183;
      font-size: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #ffe183;
      border-radius: 100px;
    }
  }
}

// ::v-deep .van-slider {
//   // background-color: #ffffff;
//   margin-bottom: 0px;
//   height: 8px;

//   .van-slider__bar {
//     background-color: #ffe183;
//     height: 8px;
//     border-radius: 4px;
//     overflow: hidden;

//     .van-slider__button-wrapper {
//       background-color: #ffe183;
//     }
//     .v-slider__track-background {
//       background-color: #ffffff !important;
//     }
//   }

// }

.time {
  color: #999999;
  font-size: 14px;
  margin-left: 10px;
}

</style>
