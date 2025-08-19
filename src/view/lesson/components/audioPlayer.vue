<template>
  <div min-height="100" flat outlined class="audio-container">
    <!-- 隱藏播放器 -->
    <audio :id="`audio${section.id}`" controls preload="auto" class="audio">
      <source :src="section.resource" type="audio/ogg" />
      <source :src="section.resource" type="audio/mp3" />
      <source :src="section.resource" type="audio/mp4" />
    </audio>
    <!-- 撥放器介面 -->
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
        <svg-icon icon-class="share-icon" class-name="share-icon"/>
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button, Slider, } from 'vant'

export default {
  name: 'AudioPlayer',
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
      isPaused: true,
      currentDuration: this.section.learn_progress.duration || 0
    }
  },
  mounted() {
    const audio = document.querySelector(`#audio${this.section.id}`)

    // 把audio的currentTime和當前學習進度同步
    if (this.section.learn_progress.duration) audio.currentTime = this.section.learn_progress.duration

    // 動態同步內鍵撥放器進度條
    audio.addEventListener('timeupdate', () => {
      this.currentDuration = Math.floor(audio.currentTime)
    })
    // 監聽撥放器暫停(結束時暫停事件)
    audio.addEventListener('pause', () => {
      this.isPaused = true
      // 更新章節學習進度
      this.$emit('updateCurrentDuration', this.section.id, this.currentDuration)
    })

    // // 監聽媒體可以播放時的狀態
    // audio.addEventListener('canplay', () => {
    //   this.isPaused = true
    // })

    // // 監聽媒體加載時的狀態
    // audio.addEventListener('loadeddata', () => {
    //   this.isPaused = true
    // })
  },
  methods: {
    // 按下播放鍵
    playButtonOnclick() {
      const audio = document.querySelector(`#audio${this.section.id}`)

      if (this.isPaused) {
        audio.play()
        this.isPaused = false
      } else {
        audio.pause()
        this.isPaused = true
      }
    },
    // 從 audio 轉換當前時間到 progress bar
    sliderOnchange() {
      const audio = document.querySelector(`#audio${this.section.id}`)

      audio.currentTime = this.currentDuration
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.audio-container {
  padding-right: 12px;
  padding-bottom: 20px;

  .audio {
    display: none;
  }
}

.controls {
  display: flex;
  flex-direction: row;
  align-items: center;

  .play-button {
    width: 26px;
    height: 26px;
    margin-left: 18px;
    margin-right: 12px;
  }
  .play-icon, .pause-icon {
    width: 22px;
    height: 22px;
  }

  .share-button {
    background: none;
    width: 20px;
    height: 20px;
    border: none;
    margin-left: 10px;
  }
  .share-icon {
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
