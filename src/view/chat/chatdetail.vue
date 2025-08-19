<template>
  <div :class="{ focus: focus }" class="chatdetail">
    <page-head :title="friend && (friend.friend.nickname.toString() || $t('base.noNicknameUser'))" class="box-border"
               @goback="goback">
      <template #right>
        <div class="" @click="goScanResult(friend.friend.id, friend.friend.nickname, friend.friend.avatar)">
          <svg-icon icon-class="three-point" class-name="three-point"></svg-icon>
        </div>
      </template>
    </page-head>
    <div class="main-content pb110">
      <van-loading v-show="loading"></van-loading>
      <ul v-if="msgList">
        <li v-for="(item1,index) in _msgList" :key="index">
          <div v-show="item1.showTime" class="time">{{ item1.time * 1000 |
            dateFormat('MM-dd hh:mm') }}
          </div>
          <div :class="['flex','row-v-s',{'row-reverse':item1.from_me}]">
            <div class="avatar">
              <img :src="item1.avatar"/>
            </div>
            <div :class="['flex','col',item1.from_me?'row-v-e':'row-v-s']">
              <div v-if="item1.payload.type == 'text'"
                   :class="['chatBox','text','ft14', item1.from_me ? 'chatBox-right' : 'chatBox-left']">
                <div>{{ item1.payload.text }}</div>
              </div>
              <div v-else-if="item1.payload.type == 'trans'" class="transaction">
                <div class="card-head">
                  <div class="flex">
                    <svg-icon class="ft25" icon-class="white_property" class-name="white_property"></svg-icon>
                    <div class="ml10 head-label">
                      <div class="ft18">{{ item1.payload.amount | money_filter }}</div>
                      <div class="ft12">{{ $t('deal.text_22') }} {{ item1.from_me ? $t('chat.text_9') : item1.nick }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex row-between ft12">
                  <span>{{ $t('deal.text_12') }}</span>
                  <span>{{ settings.MAIN_THEME }}</span>
                </div>
              </div>
              <!--                      <div v-else-if="item2.type == 'load'"-->
              <!--                           :class="['chatBox','my-load','text','ft14', index2==0?checkisMe(item1):'']"></div>-->
              <div v-else :class="['chatBox','text','ft14', item1.from_me ? 'chatBox-right' : 'chatBox-left']">{{
                item1.payload.text
                }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <footer class="footer-class">
      <!--      <div class="icon_bar flex col row-v-c ml10 mt10 mr10" @click="senddeal">-->
      <!--                <svg-icon :icon-class="styles.buttonTheme+'property'" class="ft32" class-name="active_property"></svg-icon>-->
      <!--                <div class="ft12 NoWrap">{{ $t('chat.text_8') }}</div>-->
      <!--      </div>-->
      <van-field v-model="text" :placeholder="$t('chat.placeholder_1')" @focus="onFocus" @blur="onBlur" @keyup.enter="sendMessage"/>
      <div class="divline ml10 mr10"></div>
      <span class="ft16" @click="sendMessage">{{ $t('tip.send') }}</span>
    </footer>
    <van-overlay :show="show"></van-overlay>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Cell, Field, Icon, Loading, Overlay, Skeleton } from 'vant'
  import Footer from '@/layout/footer/Footer'
  import { sendMessage } from '@/api'
  import { mapActions, mapGetters } from 'vuex'
  import { dateFormat } from '@/utils/dateFormat'
  import { money_filter } from '@/filters'
  import { boxScroll } from '@/utils/scroll'
  import styles from '@/styles/variable.scss'
  import { settings } from '@/config'

  export default {
    name: 'ChatDetail',
    filters: {
      dateFormat,
      money_filter,
    },
    components: {
      Footer,
      pageHead,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [Cell.name]: Cell,
      [Skeleton.name]: Skeleton,
      [Loading.name]: Loading,
      [Overlay.name]: Overlay,
    },
    data() {
      return {
        text: '',
        pageSize: 15,
        styles,
        msgList: [],
        conversations: {},
        friend: null,
        type: this.$route.query.type,
        user: this.$route.query.user,
        settings,
        loading: false,
        finished: false,
        scrollTop: null,
        focus: false,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo', 'TPG__getFriends', 'TG__get_one_msg', 'TG__status', 'TG__haveConversations', 'TG__msgChange']),
      _msgList() {
        const array = this.msgList.results || []
        let lastTime = null
        array.forEach((item, index) => {
          // item.avatar = this.VG__userInfo.avatar
          if (index === 0) {
            lastTime = item.time
            item.showTime = true
          } else {
            if (item.time < lastTime - 5 * 60) {
              lastTime = item.time
              item.showTime = true
            }
          }
        })
        return array
      },
      show() {
        return !this.friend
      },
    },
    watch: {
      TG__status: {
        handler(newv, oldv) {
          // this.$myConsole.log('TG__status newv', newv)
          if (newv) {
            let friend = null
            const userid = Number(this.user.split('_')[1])
            try {
              friend = this.TPG__getFriends(userid)
            } catch (e) {
              friend = null
            }
            // this.$myConsole.log('friend', friend)
            // console.log(this.user)
            if (!friend) {
              this.$toast(this.$t('chat.tips'))
              setTimeout(() => {
                this.$router.push(`/scanresult?userid=${userid}`)
              }, 2000)
            } else {
              this.friend = friend
            }
            this.boxScroll()
            this.msgList = this.TG__get_one_msg(this.type + this.user)
            const to = this.type + this.user
            const conversations = this.TG__haveConversations(to)
            if (!to) {
              this.$router.push('/chat')
            }
            if (conversations) {
              this.conversations = conversations
            }
            if (this.msgList && this.msgList.isCompleted) {
              this.finished = true
              return
            }
            this.T__getMessageList({ conversationID: to, count: this.pageSize })
          }
        },
        immediate: true,
      },
      TG__msgChange(newv) {
        this.msgList = this.TG__get_one_msg(this.type + this.user)
        const scrollTop = this.scrollTop
        this.scrollTop = document.documentElement.scrollHeight
        if (this.loading) {
          this.loading = false
          this.boxScroll(this.scrollTop - scrollTop)
        } else {
          this.boxScroll()
        }
      },
    },
    async created() {
      await this.T__init() // 腾讯IM初始化
      await this.T__Login() // 腾讯IM登录
    },
    mounted() {
      window.addEventListener('scroll', this.scroll)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.scroll)
      this.T__setMessageRead(this.type + this.user)
    },
    methods: {
      ...mapActions('timweb', ['T__init', 'T__Login', 'T__getMessageList', 'T__setMessageRead']),
      sendMessage() {
        // this.$myConsole.log('_msgList', this._msgList)
        if (this.text === '' || !this.text) return
        const content = this.text
        const params = {
          target_id: this.user.split('_')[1],
          content,
        }
        this.text = ''
        sendMessage(params).catch(err => {
          console.log('err', err)
          this.$toast(this.$t('tip.sendfail'))
        })
      },
      scroll() {
        if (window.scrollY === 0) {
          if (this.msgList.isCompleted) {
            this.finished = true
            return
          }
          this.loading = true
          this.T__getMessageList({
            conversationID: this.type + this.user,
            nextReqMessageID: this.msgList.nextReqMessageID,
            count: this.pageSize,
          })
        }
      },
      boxScroll,
      goback() {
        this.$router.push('chat')
      },
      goScanResult(id, nickname, avatar) {
        const avatar_temp = avatar || require('../my/avatar.png');
        this.$router.push({
          name: 'scanresult',
          params: {
            userid: id,
            nickname,
            avatar: avatar_temp
          },
          query: {
            userid: id,
          },
        })
      },
      onFocus() {
        this.focus = true
        // document.querySelector('html').setAttribute('style', 'height: 45vh')
        // document.querySelector('body').setAttribute('style', 'height: 45vh')
        // document.querySelector('#app').setAttribute('style', 'overflow: hidden')
        // this.$toast(`window.innerHight: ${window.innerHeight}, time: 1116}`)
      },
      onBlur() {
        this.focus = false
        // document.querySelector('html').setAttribute('style', 'height: 100%')
        // document.querySelector('body').setAttribute('style', 'height: 100%')
        // this.$toast(`window.innerHight: ${window.innerHeight}, time: 0422}`)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .time {
    color: $labelColor5;
    font-size: 12px;
    margin: 8px 20px 3px;
    text-align: center;
  }

  .avatar {
    width: 45px;
    height: 45px;
    margin: 12px;
  }

  .avatar img {
    width: 45px;
    height: 45px;
    border-radius: 5px;
  }

  .chatBox {
    position: relative;
    padding: 5px 8px;
    word-break: break-all;
    background: $pageBgColor;
    color: $Color;
    border-radius: 5px;
    max-width: 240px;
  }

  .chatBox-left, .chatBox-right {
    margin-top: 26px;
  }

  .chatBox:not(.chatBox-left):not(.chatBox-right) {
    margin-top: 5px;
  }

  .chatBox-left::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: -16px;
    top: 1px;
    border: 8px solid;
    transform: scaleY(0.5);
    border-color: transparent $pageBgColor transparent transparent;
  }

  .chatBox-right::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    right: -16px;
    top: 1px;
    border: 8px solid;
    transform: scaleY(0.5);
    border-color: transparent transparent transparent $pageBgColor;
  }

  .card-head {
    background-image: $componentlinear;

    .head-label {
      & div:nth-child(1) {
        font-weight: bold;
        color: $cardColor;
      }

      & div:nth-child(2) {
        margin-top: 4px;
        color: $labelColor12;
      }
    }
  }

  .transaction {
    width: 240px;
    margin-top: 10px;
    overflow: hidden;
    background-color: $pageBgColor;
    border-radius: 5px;
  }

  .transaction > div {
    padding: 12px 14px;
  }

  .card-head {
    text-align: left;
  }

  .footer-class {
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: $pageBgColor;
    height: 80px;
    width: 100%;
    padding: 0 20px;
    font-weight: bold;
    box-sizing: border-box;
  }

  .divline {
    width: 0.5px;
    height: 40px;
    background-color: $cellBorderColor;
  }

  ::v-deep .van-cell {
    flex: 1;
    border: 1px solid $cellBorderColor;
    font-size: 14px;
    border-radius: 30px;
  }

  .my-load {
    width: 100px;
    background: $pageBgColor;
    height: 28px;
    -webkit-animation: van-skeleton-blink 1.2s ease-in-out infinite;
    animation: van-skeleton-blink 1.2s ease-in-out infinite;
  }

  .text {
    min-height: 14px;
  }

  .NoWrap {
    white-space: nowrap;
  }

  .icon_bar {
    width: 50px;
  }

  ::v-deep .van-loading {
    text-align: center;
    margin-top: 10px;
  }

  // IOS Fixed屬性沒作用解決測試
  // .chatdetail,.main-content {
  //   // position: relative;
  //   padding: 0px;
  //   width: 100%;
  //   height: calc(90vh);
  //   // padding-top: 50px;
  //   //
  //   // left: 0;
  //   // right: 0;
  //   // top: 0;
  //   // bottom: 0;

  //   &.focus {
  //     // height: calc(45vh);
  //   }
  // }

  // .page-top-safe-area__has-page-title {
  //   position: absolute;
  // }

  // .main-content {
  //   overflow-y: scroll;
  //   -webkit-overflow-scrolling: touch;/* 解決ios滑動不流暢問題 */
  //   padding-top: 50px;
  //   padding-bottom: 100px;
  // }

  // .footer-class {
  //   position: absolute;
  // }
</style>
