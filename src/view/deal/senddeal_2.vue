<template>
  <div class="senddeal">
    <page-head :title="$t('deal.title_3')"></page-head>
    <div class="main-content flex col row-between h100">
      <div class="card-content grow flex col mt15">
        <div class="avatar-head mt4 flex row-v-c row-between mpd">
          <div>
            <div class="name ft19">
              {{ !isfriend ? name_filter(user.nickname) : (user.nickname || $t('base.noNicknameUser')) }}
            </div>
            <div v-if="isfriend" class="id ft12 mt4">ID:{{ user.id }}</div>
          </div>
          <div class="left avatar shrink">
            <img :src="user.avatar"/>
          </div>
        </div>
        <div class="card mt15 grow">
          <div class="title ft13">
            <span>{{ $t('deal.text_12') }}</span>
            <!--<span class="ft12">{{ $t('deal.text_13') }}： {{ balance }}</span>-->
          </div>
          <van-field
            ref="field"
            v-model="value"
            :placeholder="$t('deal.placeholder_3')"
            class="ft28 mt10"
          >
            <template #button>
              <span class="ft16">{{ $t('deal.text_18') }}</span>
            </template>
          </van-field>
          <div class="mt10 ft12 tip">{{ $t('deal.text_23') }} :</div>
          <div class="mt5 ft18">{{ balance }} {{ $t('deal.text_18') }}</div>
        </div>
      </div>
      <keyboard
        :confirm="$t('deal.text_15')"
        :disbtn="value.length === 0"
        @gonext="gonext"
        @input="input"
        @del="del"
      ></keyboard>
      <!--<div :class="['mbtn', { disbtn: value.length === 0 }]" @click="gonext">
      </div>-->
    </div>
    <van-overlay :show="show">
      <van-loading type="spinner" size="24px" class="loading"/>
    </van-overlay>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Field, Icon, Loading, Overlay } from 'vant'
  import { money_filter } from '@/filters'
  import { dgc_findUser } from '@/api'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import keyboard from '@/components/keyboard/index'

  export default {
    name: 'Senddeal2',
    filters: {
      money_filter,
    },
    components: {
      pageHead,
      keyboard,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
    },
    data() {
      return {
        value: '',
        cost: 0.0,
        user: {
          id: '',
          nickname: '',
          avatar: require('../my/avatar.png'),
        },
        isfriend: false,
        show: false,
      }
    },
    computed: {
      userid() {
        return this.$route.params.userid || this.$route.query.userid
      },
      nickname() {
        return this.$route.params.nickname || this.$t('base.noNicknameUser')
      },
      avatar() {
        return this.$route.params.avatar
      },
      ...mapGetters(['VG__userInfo']),
      ...mapState('tpay', ['balance', 'friends']),
    },
    watch: {
      value(newv, oldv) {
        if (newv.split('.')[1] && newv.split('.')[1].length > 2) {
          this.value = oldv
        }
        if (newv.split('.')[0].length >= 10) {
          this.value = oldv
        }
      },
      friends: {
        handler(newv, oldv) {
          this.get_isfriend()
        },
        immediate: true,
        deep: true,
      },
    },
    async mounted() {
      this.show = true
      this.VA__setBalance()
      if (this.VG__userInfo.id === this.userid) {
        this.$router.go(-1)
      }
      if (this.userid) {
        await dgc_findUser(this.userid).then(res => {
          this.show = false
          // 2021.08.16 配合新API，資料放res.data裡
          const userid = res.data.results[0].id
          const nickname = res.data.results[0].nickname || this.$t('base.noNicknameUser')
          const avatar = res.data.results[0].avatar
          this.user = {
            id: userid,
            nickname,
            avatar,
          }
        })
        this.get_isfriend()
      } else {
        this.$router.go(-1)
      }
    },
    methods: {
      ...mapActions('tpay', ['VA__setBalance']),
      gonext() {
        if (this.value.length !== 0) {
          if (this.value > this.balance) {
            this.$toast({
              message: this.$t('deal.tip_1'),
              type: 'fail',
            })
          } else {
            this.$router.push({
              name: 'senddeal_3',
              params: {
                userid: this.userid,
                amount: this.value,
                cost: this.cost,
                nickname: this.user.nickname || this.$t('base.noNicknameUser'),
                remark: '发送点数',
                redirect: this.$route.params.redirect,
              },
            })
          }
        }
      },
      get_isfriend() {
        this.friends.some(item => {
          if (item.friend.id === this.user.id) {
            this.isfriend = true
            return true
          }
        })
      },
      name_filter(name) {
        name = name.toString()
        if (name.length === 0) {
          return '--'
        } else if (name.length < 3) {
          return '***' + name
        } else {
          return '***' + name.substring(name.length - 3, name.length)
        }
      },
      input(item) {
        if (item === '.' && this.value.indexOf('.') === -1) {
          this.value += item
        } else if (item === '.' && this.value.indexOf('.') !== -1) {
          return
        } else {
          this.value += item + ''
        }
      },
      del() {
        // const last = this.value.charAt(this.value.length - 2)
        // if (last === '.') {
        //   this.value = this.value.slice(0, this.value.length - 1)
        // }
        this.value = this.value.slice(0, this.value.length - 1)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .mpd {
    padding-left: 15px;
    padding-right: 15px;
  }

  .page-top-safe-area__has-page-title {
    background-color: rgba(0, 0, 0, 0);
  }

  .disbtn {
    background-color: $diableBtnColor !important;
  }

  .card {
    background-color: $pageBgColor;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 15px;
    color: $Color;
    font-size: 14px;
  }

  .title {
    color: $labelColor2;
  }

  .divline {
    margin: 0 10px;
    height: 10px;
    width: 0.5px;
    background-color: #979797;
  }

  .senddeal {
    height: calc(100% - #{$topHeight});
  }

  .h100 {
    height: 100%;
  }

  ::v-deep .van-field {
    padding-left: 10px;
    border-bottom: 0.5px solid $BorderColor2;
    pointer-events: none;

    input {
      &::-webkit-input-placeholder {
        font-size: 14px;
        color: $labelColor8;
      }

      &::-ms-input-placeholder {
        font-size: 14px;
        color: $labelColor8;
      }
    }
  }

  ::v-deep .van-field__right-icon {
    display: flex;
    align-items: center;
  }

  .mbtn {
    width: calc(100% - 30px);
    text-align: center;
    color: $cardColor;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    background-color: $cardBgColor;
    margin: 20px 15px 78px;
    border-radius: 5px;
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

  .name {
    font-weight: bold;
    color: $labelColor4;
  }

  .id {
    color: $my-goLogin;
  }

  .tip {
    color: $labelColor17;
  }

  .van-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
