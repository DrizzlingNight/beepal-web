<template>
  <div class="newfriends">
    <page-head></page-head>
    <div class="main-content">
      <van-cell class="mt10 mb10">
        <div class="flex row-v-c">
          <!--            <svg-icon class-name="notice-svg" icon-class="notice"></svg-icon>-->
          <div class="left avatar shrink">
            <img :src="user.avatar"/>
          </div>
          <div class="flex grow row-between row-v-c ml10">
            <div>
              <div class="title ft16">{{ user.nickname || $t('base.noNicknameUser') }}</div>
              <div class="chat-content ft12">ID:{{ user.id }}</div>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell v-if="!isfriend" class="clicker" @click="addfriend">
        <div class="flex row-h-c mColor">
          <div class="ft16 mr10">
            <svg-icon
              icon-class="addfriend2"
              class-name="addfriend2"
            ></svg-icon>
          </div>
          <span class="ft16">{{ $t('scan.text_3') }}</span>
        </div>
      </van-cell>
      <van-cell v-if="isfriend" class="clicker" @click="chat">
        <div class="flex row-h-c row-v-c mColor">
          <div class="ft16 mr10">
            <svg-icon icon-class="chat" class-name="chat"></svg-icon>
          </div>
          <span class="ft16">{{ $t('scan.text_14') }}</span>
        </div>
      </van-cell>
      <van-cell v-if="isfriend" class="delete-friend" @click="deleteFriendConfirm">
        <div class="flex row-h-c row-v-c mColor">
          <div class="ft16 mr10">
            <svg-icon icon-class="delete-red" class-name="delete-red"></svg-icon>
          </div>
          <span class="ft16">{{ $t('scan.deleteFriend') }}</span>
        </div>
      </van-cell>
      <!--<van-cell class="clicker" @click="senddeal">
        <div class="flex row-h-c row-v-c mColor">
          <div class="ft16 mr10">
            <svg-icon icon-class="senddeal" class-name="senddeal"></svg-icon>
          </div>
          <span class="ft16">{{ $t('deal.text_12') }}</span>
        </div>
      </van-cell>-->
    </div>
    <van-overlay :show="show">
      <van-loading type="spinner" size="24px" class="loading"/>
    </van-overlay>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import DefaultPage from '@/components/defaultPage'
  import { Cell, Field, Icon, Loading, Overlay } from 'vant'
  import { addFriend, getUserById, deleteFriend } from '@/api'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { settings } from '@/config'

  export default {
    name: 'Addfriend',
    components: {
      pageHead,
      DefaultPage,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [Cell.name]: Cell,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
    },
    data() {
      return {
        value: '',
        user: {
          username: '--',
          nickname: '--',
          id: '--',
          avatar: require('../../my/avatar.png'),
        },
        show: false,
        isme: false,
        isfriend: false,
        addfriendflag: false,
      }
    },
    computed: {
      query() {
        return this.$route.params.userid || this.$route.query.userid
      },
      nickname() {
        return this.$route.params.nickname || this.$t('base.noNicknameUser')
      },
      username() {
        return this.$route.params.username
      },
      avatar() {
        return this.$route.params.avatar
      },
      ...mapGetters(['VG__userInfo']),
      ...mapState('tpay', ['friends']),
    },
    watch: {
      user: {
        handler(newv, oldv) {
          if (newv.id === this.VG__userInfo.id) {
            this.isme = true
          } else if (newv.id) {
            this.get_isfriend()
          }
        },
        deep: true,
      },
      friends: {
        handler(newv, oldv) {
          this.get_isfriend()
        },
        deep: true,
      },
    },
    created() {
      this.show = true
      if (this.query && this.nickname) {
        this.user = {
          id: this.query,
          nickname: this.nickname,
          username: this.username,
        }
        this.show = false
      }
      if (this.query) {
        getUserById(this.query).then(res => {
          // this.$myConsole.log('getUserList res', res)
          this.show = false
          const result = res.data
          const userid = result.id
          const nickname = result.nickname || this.$t('base.noNicknameUser')
          const avatar = result.avatar
          const username = result.username
          this.user = {
            id: userid,
            nickname,
            avatar,
            username,
          }
        }).catch(err => {
          console.log('getUserList-err', err)
        })
      } else {
        this.$router.go(-1)
      }
    },
    methods: {
      ...mapActions('tpay', ['VA__setAdressList']),
      get_isfriend() {
        this.friends.some(item => {
          if (item.friend.id === this.user.id) {
            this.isfriend = true
            return true
          }
        })
      },
      addfriend() {
        if (this.isme) {
          this.$toast({
            message: this.$t('scan.text_5'),
            type: 'fail',
          })
          return
        }
        if (this.isfriend) {
          this.$toast({
            message: this.$t('scan.text_6'),
            type: 'fail',
          })
          return
        }
        if (this.addfriendflag) {
          this.$toast({
            message: this.$t('scan.text_8'),
            type: 'fail',
          })
          return
        }
        this.addfriendflag = true
        const params = {
          friend: this.query
        }
        addFriend(params)
          .then(res => {
            this.addfriendflag = false
            if (res.code === 0) {
              this.$toast({
                message: this.$t('scan.text_9'),
                type: 'success',
              })
              this.VA__setAdressList()
            }
          })
          .catch(err => {
            console.log(err)
            this.$toast({
              message: this.$t('scan.text_10'),
              type: 'fail',
            })
          })
      },
      deleteFriendConfirm() {
        this.$dialog
        .confirm({
          message: this.$t('scan.deleteFriend_confirmText'),
          className: 'dialog',
          confirmButtonText: this.$t('base.delete'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          this.deleteFriend()
        })
      },
      async deleteFriend() {
        const params = {
          friend: this.query
        }
        await deleteFriend(params).then(res => {
          if (res.code === 0) {
            this.$toast(this.$t('tip.deleteSuccess'))
            setTimeout(() => {
              this.$router.push('/addresslist')
            }, 1000)
          } else if (this.$t(`errorCode.${res.code}`)) {
            this.$toast(this.$t(`errorCode.${res.code}`))
          } else {
            this.$toast(this.$t('tip.deleteFail'))
          }
        }).catch(err => {
          console.log('deleteFriend-err', err)
          this.$toast(this.$t('tip.deleteFail'))
        })
      },
      senddeal() {
        if (this.isme) {
          this.$toast({
            message: '不能给自己转账',
            type: 'fail',
          })
        } else {
          this.$router.push({
            name: 'senddeal_2',
            params: {
              userid: this.query,
              nickname: this.user.nickname || this.$t('base.noNicknameUser'),
              avatar: this.user.avatar,
              redirect: '/scanresult',
            },
            query: {
              userid: this.query,
            },
          })
        }
      },
      chat() {
        this.$router.push({
          name: 'chatdetail',
          params: {
            userid: this.query,
            nickname: this.user.nickname || this.$t('base.noNicknameUser'),
          },
          query: {
            type: 'C2C',
            user: settings.MAIN_THEME + '_' + this.query,
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .title {
    font-weight: bold;
    color: $labelColor4;
  }

  .left {
    height: 45px;
    width: 45px;
    border-radius: 5px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .chat-content {
    color: $my-goLogin;
  }

  .mColor {
    color: $Color;
  }

  ::v-deep .van-cell {
    padding: 15px 15px;

    &.clicker:active {
      background-color: $listActiveBgColor;
    }
  }

  .delete-friend {
    cursor: pointer;
    span {
      color: #ED0000;
    }
  }

  .loading {
    left: 50%;
    top: 50%;
    transform: translate(-12px, -50%);
  }
</style>
