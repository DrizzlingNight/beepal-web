<template>
  <div class="cardList">
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
          @load="$emit('onLoad')"
        >
          <template v-for="(item,index) in lessonList">
            <div :key="index" class="lesson-list" @click="goToLessonDetail(item.id)">
              <div class="image">
                <img :src="item.cover" />
              </div>
              <div class="title">
                <p>{{ `${$t('lesson.card_title')}: ${item.title}` }}</p>
              </div>
              <div class="describe">
                <p class="type">{{ `${$t('lesson.lesson_type')}: ${$t('lesson.lesson_type_' + lessonTypeMap[item.type])}` }}</p>
                <p class="tag">{{ `${item.tags}` }}</p>
              </div>
              <div class="bottom">
                <div class="time">
                  <span class="section-nubmer">{{ item.sections }}</span>
                  <span class="section-text">{{ $t('lesson.sectionTime') }}</span>
                  <span class="hour-nubmer">{{ `  ${hourFormate(item.duration)}` }}</span>
                  <span class="hour-text">{{ $t('lesson.hour') }}</span>
                </div>
                <div class="price">
                  <p>{{ `${money_filter(item.price,3)} ${getCoinName(item.coin)}` }}</p>
                </div>
              </div>
            </div>
          </template>
        </van-list>
      <!-- </van-pull-refresh> -->
    </div>
  </div>
</template>

<script>
import { Button, Cell, Icon, List, PullRefresh, } from 'vant'
import { money_filter } from '@/utils/money'
import { settings } from '@/config'
import config from '../config'
import Storage from '@/utils/storage'

export default {
  name: 'CardList',
  components: {
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
  },
  props: {
    state: {
      type: Object,
      default: () => {
        return {}
      },
    },
    lessonList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      money_filter,
      isMounted: false,
      lessonTypeMap: config.lessonTypeMap,
      supportCoin: config.supportCoin,
      realCurrency: Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
    }
  },
  computed: {
    finishedText() {
      return '' // 2021.09.16 先把"沒有更多了"拿掉，有需要再打開
      // if (this.lessonList.length) return this.$t('beePal.tokenDetail.noMore')
      // else return ''
    },
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    beforeChange(index) {
      return true
    },
    onChange() {
      this.$emit('onChange')
    },
    getCoinName(id) {
      const coin = this.supportCoin.find(item => item.id === id)
      return coin.name
    },
    hourFormate(sec, digits = 1) {
      const hour = (sec / 60) / 60
      if (hour % 1 === 0) {
        return hour
      } else {
        return hour.toFixed(digits)
      }
    },
    goToLessonDetail(id) {
      this.$router.push({
        name: 'lessonDetail',
        params: {
          lessonId: id,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.cardList {
  flex-grow: 1;
  background-color: $pageBgColor; // 白色
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .content {
    // flex: 1;
    height: calc(100% - 58px);
    display: flex;
    padding: 10px 12px 10px 12px;

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
      background: #F7F7F7;
      height: 278px;
      overflow: hidden;
      border-radius: 7px;
      margin-top: 10px;

      .image {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;

        img {
          object-fit: cover;
          width: 100%;
          height: 167px;
        }
      }

      .title {
        margin-top: 18px;
        padding-left: 12px;
        border-left: 3px solid #FFC100;

        p {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .describe {
        display: flex;
        flex-direction: row;
        margin-top: 7px;

        p {
          color: #868891;
          font-size: 12px;
        }

        .type {
          margin-left: 12px;
        }

        .tag {
          margin-left: 20px;
        }
      }

      .bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 7px;

        .time {
          margin-left: 12px;

          span {
            color: #868891;
            font-size: 12px;
          }

          .section-nubmer,.hour-nubmer {
            color: #FFC100;
          }
        }

        .price {

          p {
            color: #ED0000;
            font-size: 12px;
            line-height: 20px;
            font-weight: bold;
            margin-right: 14px;
          }
        }
      }
    }
  }
}
</style>
