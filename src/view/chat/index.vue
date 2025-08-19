<template>
  <div class="chat">
    <page-head class="box-border">
      <template v-slot:left>
        <span></span>
      </template>
      <template v-slot:title>{{ $t('chat.title') }}</template>
      <template v-slot:right="inner">
        <div class="flex row-v-c mt7">
          <svg-icon class-name="Plus" icon-class="Plus" class="ft32 plus" @click="inner.inner"></svg-icon>
          <svg-icon icon-class="friends" class-name="friends" class="ft24 mr6"
                    @click="$router.push('addresslist')"></svg-icon>
        </div>
      </template>
    </page-head>
    <div class="main-content flex col h100 scroll">
      <van-cell class="notice" @click="$router.push('/announcement')">
        <div class="flex row-v-c">
          <svg-icon :badge="haveBadge" :icon-class="styles.buttonTheme + 'notice'" class-name="notice-svg"></svg-icon>
          <div class="flex col grow ml10">
            <div class="flex row-between">
              <span class="title ft14">{{ $t('chat.text_1') }}</span>
            </div>
            <div v-if="notices.length > 0" class="chat-content ft12" v-html="notices[0].content.slice(0,80)">
            </div>
          </div>
        </div>
      </van-cell>
      <div v-if="TG__getConversations[0]">
        <van-cell v-for="item in TG__getConversations" :key="item.key" @click="gotoDetail(item)">
          <div class="flex row-v-c">
            <div class="left avatar shrink">
              <img :src="item.userProfile.avatar || require('../my/avatar.png')"/>
              <div v-if="item.unreadCount" class="badge">
                {{ item.unreadCount }}
              </div>
            </div>
            <div class="flex col grow ml10">
              <div class="flex row-between">
                <span class="title ft16">{{ item.userProfile.nick }}</span>
                <span class="time ft12">{{ new Date(item.lastMessage.lastTime * 1000) | dateFormat }}</span>
              </div>
              <div class="chat-content ft13">
                <!-- {{ $t('chat.text_2') }}234.89 -->
                <div v-if="item.lastMessage.payload.type == 'trans' &&
                item.lastMessage.fromAccount === settings.MAIN_THEME + '_' + VG__userInfo.id">
                  {{ $t('chat.text_2') }}
                  {{ item.lastMessage.payload.amount | money_filter }}
                </div>
                <div v-else-if="item.lastMessage.payload.type == 'trans'">[{{
                  $t('deal.text_12')
                  }}]
                </div>
                <div v-else>{{ item.lastMessage.payload.text || item.lastMessage.payload }}</div>
              </div>
            </div>
          </div>
        </van-cell>
      </div>
      <default-page v-else :status="3" />
    </div>

  </div>
</template>

<script>
  import pageHead from '@/components/head/index'
  import { Cell, Icon } from 'vant'
  import { mapActions, mapGetters } from 'vuex'
  import { dateFormat } from '@/utils/dateFormat'
  import { money_filter } from '@/filters'
  import notices from '@/mixins/notices'
  import styles from '@/styles/variable.scss'
  import { settings } from '@/config'
  import DefaultPage from '@/components/defaultPage'

  export default {
    name: 'Index',
    filters: {
      dateFormat,
      money_filter,
    },
    components: {
      pageHead,
      DefaultPage,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
    },
    mixins: [notices],
    data() {
      return {
        getConversationCount: 0, // 當前call「獲取對話」的API的次數
        getConversationTimes: 5, // 要在mounted時去call幾次「獲取對話」的API
        finished: false,
        isLoading: false,
        upLoading: false,
        styles,
        settings,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo', 'TG__getConversations']),
    },
    async created() {
      await this.T__init() // 腾讯IM初始化
      await this.T__Login() // 腾讯IM登录
      await this.VA__setAdressList() // 获取通讯录 （tpay的功能）
    },
    mounted() {
        var getConversation = setInterval(() => {
          this.T_getConversationList()
          this.getConversationCount++
          if (this.getConversationCount === this.getConversationTimes) {
            clearInterval(getConversation)
          }
        }, 500)
    },
    methods: {
      ...mapActions('timweb', ['T__init', 'T__Login', 'T_getConversationList']),
      ...mapActions('tpay', ['VA__setAdressList']),
      gotoDetail(item) {
        // this.$myConsole.log('gotoDetail item', item)
        this.$router.push({
          name: 'chatdetail',
          query: {
            type: item.type,
            user: item.userProfile.userID,
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .chat {
    height: calc(100% - #{$topHeight});
  }

  .plus {
    color: #0fa94a;
  }

  .h100 {
    height: calc(100% - #{$footerHeight});
  }

  .page-title-cs {
    height: fit-content;
    padding-right: 15px;
    font-size: 28px;
    font-weight: bold;
    color: $topColor;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(0, 6px);
  }

  .notice {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .notice > div {
    font-size: 45px;
  }

  .notice-svg {
    width: 45px;
    height: 45px;
  }

  .title {
    font-weight: bold;
    color: $labelColor4;
  }

  .time,
  .chat-content {
    //transform: scale(0.9,0.9);
    color: $labelColor5;
    height: 20px;
  }

  .chat-content {
    width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .left {
    position: relative;
    height: 45px;
    width: 45px;
    border-radius: 5px;

    img {
      border-radius: 5px;
      width: 100%;
      height: 100%;
    }
  }

  ::v-deep .van-cell {
    min-height: 70px;

    &:active {
      background-color: $listActiveBgColor;
    }
  }

  .badge {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%) scale(0.9, 0.9);
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
    background-color: red;
    color: white;
    font-size: 12px;
  }

  ::v-deep .van-cell__value {
    overflow: visible;
  }

  .scroll {
    overflow-y: auto;
  }

  // 缺省頁
  .default-page {
    background: #F5F5F5;
    height: 100%;
    // padding-top: 146.5px;
  }
</style>
