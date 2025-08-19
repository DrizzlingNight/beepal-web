<template>
  <div class="sectionList">
    <div class="content">
      <!-- 2021.09.22 因為會有手機上拉觸發刷新的問題，所以先把pull-refresh拔掉 -->
      <!-- <van-pull-refresh
        v-model="state.refreshing"
        :loading-text="$t('beePal.tokenDetail.loading')"
        :loosing-text="$t('beePal.tokenDetail.loosingText')"
        :pulling-text="$t('beePal.tokenDetail.pullingText')"
        @refresh="$emit('onRefresh')"
      > -->
        <van-list
          v-model="state.loading"
          :finished="state.finished"
          :finished-text="finishedText"
          :loading-text="$t('beePal.tokenDetail.loading')"
          :class="isBuyButtonShow ? 'notBuy' : ''"
          @load="$emit('onLoad')"
        >
          <template v-for="(item,index) in sectionList">
            <div :id="`section${item.id}`" :key="index" class="lesson-list" @click="clickSection(item)">
              <!-- 視頻播放器 -->
              <div v-show="item.type === 2 && isSectionDeatailShow[item.id]" class="video-section">
                <video-player :section="item" @updateCurrentDuration="updateCurrentDuration" @share="share" />
              </div>
              <div v-show="item.type === 1 ? !isSectionDeatailShow[item.id] : true" class="content">
                <div class="image">
                  <img :src="typeImgMap[item.type]" />
                </div>
                <div class="right">
                  <div class="title">
                    <p>{{ `${$t('lesson.card_title')}: ${titleFormate(item.title)}` }}</p>
                  </div>
                  <!-- 已學習的tag -->
                  <div v-show="item.learn_progress.status === 2" class="already-learn-tag">
                    <p>{{ $t('lesson.alreadyLearn') }}</p>
                  </div>
                  <div v-if="item.type !== 1" class="time">
                    <p>{{ `${$t('lesson.lessonTime')}： ${timeFormate(item.duration)}` }}</p>
                  </div>
                </div>
              </div>
              <!-- 文本 -->
              <div v-show="item.type === 1 && isSectionDeatailShow[item.id]" class="text-content" @click.stop="()=>{}">
                <div class="title">
                  <p>{{ `${$t('lesson.card_title')}: ${item.title}` }}</p>
                </div>
                <div class="content">
                  <p>{{ item.content }}</p>
                </div>
                <div class="text-content-button">
                  <p class="pack-up-button" @click.stop="clickSection(item)">{{ $t('lesson.packUp') }}</p>
                  <van-button class="share-button" @click.stop="share(item, 'section')">
                    <svg-icon icon-class="share-icon-yellow" class-name="share-icon-yellow"/>
                  </van-button>
                </div>
              </div>
              <!-- 音頻播放器 -->
              <div v-show="item.type === 3 && isSectionDeatailShow[item.id]" class="audio-section">
                <audio-player :section="item" @updateCurrentDuration="updateCurrentDuration" @share="share" />
              </div>
            </div>
          </template>
        </van-list>
      <!-- </van-pull-refresh> -->
    </div>
    <div v-if="isBuyButtonShow" class="button">
      <van-button class="share" @click="share(lessonDetail)">{{ $t('lesson.share') }}</van-button>
      <van-button class="buy" @click="$emit('buyConfirm')">{{ $t('lesson.buy') }}</van-button>
    </div>
    <!-- 「分享」彈窗 -->
    <van-share-sheet v-model="showShare" :options="options" cancel-text="" @select="onSelect">
      <template #title>
        <div class="flex row-v-c row-between">
          <div class="title">{{ $t('find.share') }}</div>
          <div class="cancel" @click="showShare = false">{{ $t('tip.cancel') }}</div>
        </div>
      </template>
    </van-share-sheet>
  </div>
</template>

<script>
import { Button, Cell, Icon, List, PullRefresh, ShareSheet } from 'vant'
import { money_filter } from '@/utils/money'
import openApp from '@/utils/openApp'
import { settings } from '@/config'
import VideoPlayer from './videoPlayer'
import AudioPlayer from './audioPlayer'
import config from '../config'
import { supportCoin } from '../../BeePal_trade/config'
import { learnSection } from '@/api'
// import { getShortUrl } from '@/utils/openGraphHandler'
import Storage from '@/utils/storage'

export default {
  name: 'SectionList',
  components: {
    VideoPlayer,
    AudioPlayer,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [ShareSheet.name]: ShareSheet,
  },
  props: {
    state: {
      type: Object,
      default: () => {
        return {}
      },
    },
    lessonDetail: {
      type: Object,
      default: () => {
        return {}
      },
    },
    sectionList: {
      type: Array,
      default: () => [],
    },
    isBought: {
      type: Boolean,
      default: false
    },
    isBuyButtonShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      money_filter,
      selectSeciton: null, // url觸發的章節選擇
      isMounted: false,
      isSectionDeatailShow: {},
      sectionDetail: {},
      lessonTypeMap: config.lessonTypeMap,
      supportCoin: config.supportCoin,
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
      typeImgMap: {
        1: 'https://i.ibb.co/x2PrkGn/text-icon.png',
        2: 'https://i.ibb.co/x591dF4/video-icon.png',
        3: 'https://i.ibb.co/tBq9ZHX/audio-icon.png',
      },
      // 「分享」相關變數
      showShare: false,
      shareItem: null,
      options: [
        {
          id: 0,
          name: 'Telegram',
          icon: require('@/assets/img/Telegram.png'),
        },
        {
          id: 1,
          name: this.$t('find.friend'),
          icon: require('@/assets/img/line.png'),
        },
        {
          id: 2,
          name: 'Facebook',
          icon: require('@/assets/img/Facebook.png'),
        },
        // 2021.09.30 暫時先把Instagram分享功能隱藏起來
        // {
        //   id: 3,
        //   name: 'Instagram',
        //   icon: require('@/assets/img/Instagram.png'),
        // },
      ],
    }
  },
  computed: {
    finishedText() {
      return '' // 2021.09.16 先把"沒有更多了"拿掉，有需要再打開
      // if (this.sectionList.length) return this.$t('beePal.tokenDetail.noMore')
      // else return ''
    },
  },
  created() {
    this.sectionList.forEach(item => {
      this.isSectionDeatailShow[item.id] = false
      this.sectionDetail[item.id] = {
        sectionId: '',
        currentDuration: '',
      }
    })

    // 章節打開處理
    setTimeout(() => {
      this.selectSeciton = this.urlParamsHandler(window.location.href.split('?')) // 把url帶的參數做處理
      if (this.selectSeciton && this.isBought) {
        this.isSectionDeatailShow[this.selectSeciton] = true // 如果有購買則把章節打開
      }
      // console.log('this.isSectionDeatailShow[this.selectSeciton]', this.isSectionDeatailShow[this.selectSeciton])
    }, 1000)

    // 滾動處理
    setTimeout(() => {
      if (this.selectSeciton) {
       // 滾動到章節位置
        const selectSecitonElement = document.querySelector(`#section${this.selectSeciton}`)
        // console.log(selectSecitonElement)
        this.scrollToElement(selectSecitonElement)
      }
    }, 2000)
    // console.log('isBuyButtonShow', this.isBuyButtonShow)
  },
  mounted() {
    this.isMounted = true
    this.sectionList.forEach(item => {
      if (item.type === 2) {
        const video = document.querySelector(`#video${item.id}`)
        video.pause()
      } else if (item.type === 3) {
        const audio = document.querySelector(`#audio${item.id}`)
        audio.pause()
      }
    })
    // console.log('isBuyButtonShow', this.isBuyButtonShow)
  },
  methods: {
    beforeChange(index) {
      return true
    },
    onChange() {
      this.$emit('onChange')
    },
    getCoinName(id) {
      const coin = supportCoin.find(item => item.id === id)
      return coin.name
    },
    timeFormate(sec) {
      const date = new Date(null)
      date.setSeconds(sec);
      const result = date.toISOString().substr(11, 8)
      return result
    },
    // 限制標題不能超過15個字
    titleFormate(text) {
      const textArray = text.split('')
      let result = ''
      if (textArray.length > 15) {
        result = `${textArray.slice(0, 15).join('')}...`
      } else {
        result = text
      }
      return result
    },
    clickSection(section) {
      if (this.isBought) {
        // 若是視頻則在展開時自動播放、收起時暫停
        if (section.type === 2) {
          const video = document.querySelector(`#video${section.id}`)
          this.isSectionDeatailShow[section.id] ? video.pause() : video.click()
        }

        // 2021.11.08 設計更新，音頻、視頻都要在收起時自動暫停，且同一時間只能有一個章節被打開
        const keys = this.sectionList.map(item => { return item.id })
        keys.forEach(key => {
          const video = document.querySelector(`#video${key}`)
          const audio = document.querySelector(`#audio${key}`)

          // 不管是否為點擊的章節，或是否為展開/收起，都一律把媒體暫停
          video.pause()
          audio.pause()

          if (Number(key) === Number(section.id)) {
            this.isSectionDeatailShow[key] = !this.isSectionDeatailShow[key]
          } else {
            this.isSectionDeatailShow[key] = false
          }
        })

        // 若為文本，則直接觸發已學習
        if (section.type === 1) {
          this.updateCurrentDuration(section.id, section.duration)
        }
        const list = [...this.sectionList]
        this.$emit('sectionListChange', list)
      } else {
        this.$dialog
        .confirm({
          message: this.$t('lesson.needToBuy'),
          className: 'dialog',
          confirmButtonText: this.$t('base.goBuy'),
          cancelButtonText: this.$t('base.cancel'),
        }).then(() => {
          this.$emit('buyConfirm')
        })
      }
    },
    async updateCurrentDuration(id, currentDuration) {
      const params = {
        section: id,
        duration: currentDuration,
      }
      await learnSection(params).then(res => {
        if (res.code === 0) {
          // console.log('章節學習成功')
        } else {
          console.error('章節學習失敗')
        }
      }).catch(err => {
        console.error('learnSection-err', err)
      })
    },
    // 「分享」觸發
    share(item, mode = 'lesson') {
      if (mode === 'lesson') {
        this.shareItem = item
      } else {
        this.shareItem = {
          ...item,
          id: this.lessonDetail.id,
          sectionId: item.id,
          title: item.title,
        }
      }

      // 2021.11.25 把分享功能都改成調用手機原生分享（不管Android還是IOS）
      const originUrl = '/#/lessonDetail' + `?id=${this.shareItem.id}${this.shareItem.sectionId ? `&sectionId=${this.shareItem.sectionId}` : ''}`
      window.navigator.share({
        url: originUrl
      })
      .then(() => console.log('Share was successful.'))
      .catch((error) => console.log('Sharing failed', error))

      // // iOS分享測試
      // if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)) {
      //   const originUrl = '/#/lessonDetail' + `?id=${this.shareItem.id}${this.shareItem.sectionId ? `&sectionId=${this.shareItem.sectionId}` : ''}`
      //   window.navigator.share({
      //     url: originUrl
      //   })
      //   .then(() => console.log('Share was successful.'))
      //   .catch((error) => console.log('Sharing failed', error))
      // } else {
      //   this.showShare = true
      // }
    },
    // 「分享」的選擇
    async onSelect(item) {
      const originUrl = location.href + `?id=${this.shareItem.id}${this.shareItem.sectionId ? `&sectionId=${this.shareItem.sectionId}` : ''}`
      const href = encodeURIComponent(originUrl)

      // let href = encodeURIComponent(originUrl)

      // const shortUrlData = {
      //   url: originUrl,
      //   title: this.shareItem.title,
      //   description: this.shareItem.describe,
      //   image: this.shareItem.cover
      // }
      // const shortUrl = await getShortUrl(shortUrlData)
      // this.$myConsole.log('shortUrl', shortUrl)

      // if (shortUrl) href = shortUrl

      switch (item.id) {
        case 0:
          // openApp('tg://msg?url=' + location.href, () => {
          window.open('https://telegram.me/share/url?url=' + href + '&text=' + this.shareItem.title)
          // })
          break
        case 1:
          openApp('line://msg/text/?' + location.href, () => {
            window.open('https://line.me/R/msg/text/?' + href)
          })
          // window.location = 'https://www.facebook.com'
          break
        case 2:
          window.open('https://m.facebook.com/sharer/sharer.php?u=' + href)
          break
        case 3:
          openApp('instagram://', () => {
            window.open('https://www.instagram.com/')
          })
          break
      }
    },
    // url參數處理
    urlParamsHandler(params) {
      if (params[1]) {
        params = params[1].split('&')
        if (params[1]) {
          const sectionId = params[1].split('=')[1]
          return sectionId
        }
      }
      return null
    },
    // 滾動到指定章節位置
    scrollToElement(element) {
      const positionY = element.getBoundingClientRect().top
      // console.log('positionY: ', positionY)
      window.scroll({
        top: positionY - 100,
        left: 0,
        behavior: 'smooth'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.sectionList {
  flex-grow: 1;
  background-color: $pageBgColor; // 白色
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .content {
    position: relative;
    // flex: 1;
    height: calc(100% - 58px);
    display: flex;
    padding: 10px 12px 18px 12px;

    // 2021.09.22 因為會有手機上拉觸發刷新的問題，所以先把pull-refresh拔掉
    ::v-deep .van-list__finished-text {
      color: $tabsInactiveColor;
      font-size: 14px;
    }

    ::v-deep .van-list {
      overflow: hidden;
      background: $pageBgColor; // 白色
      border-radius: 7px;
      padding-top: 60px;

      &.notBuy {
        padding-bottom: 105px;
      }
    }

    // .van-pull-refresh {
    //   // padding-bottom: 97px;
    //   flex-grow: 1;
    //   overflow: auto;

    //   ::v-deep .van-list__finished-text {
    //     color: $tabsInactiveColor;
    //     font-size: 14px;
    //   }

    //   .noRecord {
    //     padding: 20px;
    //     text-align: center;
    //     font-size: 14px;
    //     color: $completeColor;
    //   }
    // }

    // ::v-deep .van-pull-refresh__track {
    //   // padding-bottom: 97px;
    //   height: 100%;

    //   .van-list {
    //     overflow: hidden;
    //     background: $pageBgColor; // 白色
    //     border-radius: 7px;
    //     padding-top: 60px;
    //   }
    // }

    .lesson-list {
      display: flex;
      flex-direction: column;
      background: #F7F7F7;
      height: auto;
      overflow: hidden;
      border-radius: 7px;
      margin-top: 10px;

      .content {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        .image {
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
          margin-left: 2px;

          img {
            position: relative;
            top: 10%;
            bottom: 90%;
            width: 64px;
            height: 64px;
          }
        }

        .right {
          display: flex;
          flex-direction: column;
          margin-left: 13px;

          .title {
            margin-top: 18px;

            p {
              font-size: 16px;
              font-weight: bold;
            }
          }

          .already-learn-tag {
            overflow: hidden;
            width: 45px;
            height: 45px;
            position: absolute;
            top: 0px;
            right: 0px;
            text-align: center;
            background-color: #20A763;
            color: white;
            border: none;
            padding: 1px 6px;
            clip-path: polygon(0 0, 50% 0, 100% 50%, 100% 100%);

            p {
              font-size: 12px;
              padding-top: 1px;
              transform: rotate(0.12turn) translateX(13px);
            }
          }

          .time {
            margin-top: 8px;

            p {
              color: #868891;
              font-size: 12px;
            }
          }
        }
      }
    }

    .text-content {
      background: #FFFFFF;
      border: 0.5px solid #E2E2E2;

      .title {
        margin-top: 18px;
        padding-left: 18px;

        p {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .content {
        padding: 11px 13px 0px 20px;

        p {
          color: #868891;
          font-size: 12px;
          white-space: pre-line; // 用來合併空格，讓換行符號可以發揮作用，保留自動換行
        }
      }

      .text-content-button {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 16px;
        margin-bottom: 7px;

        .pack-up-button {
          cursor: pointer;
          color: #FFC100;
          font-size: 12px;
          font-weight: bold;
          margin-left: 20px;
        }

        .share-button {
          background: none;
          width: 15px;
          height: 14px;
          border: none;
          margin-right: 12px;
        }
        .share-icon-yellow {
          width: 15px;
          height: 14px;
        }
      }
    }
  }

  .button {
    display: flex;
    position: fixed;
    bottom: 0px;
    background-color: #ffffff;
    width: 100%;
    height: 80px;
    padding: 23px 15px 0px 15px;

    .share {
      color: $labelColor20;
      width: 100px;
      margin-right: 12px;
      border: 1px solid $cellBorderColor;
      border-radius: 5px;
    }

    .buy {
      border: none;
      background: linear-gradient(315deg, #FFBC00 0%, #FFD92A 100%);
      color: $cardColor;
      border-radius: 5px;
      flex-grow: 0.85;
    }
  }

  // 「分享」彈窗
  ::v-deep .van-popup {
    .van-share-sheet__header {
      .title {
        font-size: 17px;
        font-weight: bold;
        color: $labelColor1;
      }

      .cancel {
        color: $labelColor20;
        font-size: 14px;
      }

      padding-bottom: 20px;
      border-bottom: 1px solid $BorderColor4;
    }

    .van-share-sheet__options {
      display: flex;
      // justify-content: space-between;
      justify-content: space-around; // 2021.09.30 因應「暫時先把Instagram分享功能隱藏起來」的改動
      border-bottom: 1px solid $BorderColor4;
      /*margin-bottom: 20px;*/

      img {
        width: 43px;
        height: auto;
      }

      .van-share-sheet__name {
        font-size: 14px;
        color: $userIdColor;
      }
    }
  }
}
</style>
