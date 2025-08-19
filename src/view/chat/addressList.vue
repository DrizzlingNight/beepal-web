<template>
  <div class="adressList">
    <page-head :title="$t('chat.title_2')" :goBackPath="'/chat'" border></page-head>
    <div class="main-content">

    </div>
    <div>
      <van-cell v-if="false" class="newfriend" @click="$router.push('/newfriends')">
        <div class="flex row-v-c">
          <svg-icon class-name="newfriend-icon" icon-class="newfriend"></svg-icon>
          <div class="flex col grow ml10">
            <div class="flex row-between">
              <span class="title ft14 weight">{{ $t('chat.text_4') }}</span>
              <!--              <span class="time">2019/06/22 09:00</span>-->
              <span class="badge">
                8
              </span>
            </div>
          </div>
        </div>
      </van-cell>
      <van-index-bar :index-list="list" :sticky-offset-top="top">
        <div v-for="(item,index) in list" v-show="arr[item].length!=0" :key="index">
          <van-index-anchor :index="item" :key="index">
            <b>{{ item }}</b>
          </van-index-anchor>
          <van-cell v-for="temp in arr[item]" :key="temp.friend.id"
                    @click="gonext(temp.friend.id,temp.friend.nickname,temp.friend.avatar)">
            <div class="flex row-v-c">
              <!--            <svg-icon class-name="notice-svg" icon-class="notice"></svg-icon>-->
              <div class="left avatar shrink">
                <img :src="temp.friend.avatar | avatar"/>
              </div>
              <div class="flex grow row-between row-v-c ml10">
                <div class="title ft16">{{ temp.friend.nickname || $t('base.noNicknameUser') }}</div>
              </div>
            </div>
          </van-cell>
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Cell, Icon, IndexAnchor, IndexBar, List } from 'vant'
  import { mapActions, mapState } from 'vuex'
  import { query } from '@/utils/letter'

  export default {
  name: 'AdressList',
  components: {
    pageHead,
    [Cell.name]: Cell,
    [List.name]: List,
    [Icon.name]: Icon,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
  },
  filters: {
    avatar(item) {
      if (item != null) return item
      else return require('../my/avatar.png')
    }
  },
  data() {
    return {
      list: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
      top: 50,
      arr: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],
        '#': [],
      },
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    },
    ...mapState('tpay', ['friends']),
  },
  watch: {
    friends: {
      handler(newVal, oldVal) {
        const arr = {
          A: [],
          B: [],
          C: [],
          D: [],
          E: [],
          F: [],
          G: [],
          H: [],
          I: [],
          J: [],
          K: [],
          L: [],
          M: [],
          N: [],
          O: [],
          P: [],
          Q: [],
          R: [],
          S: [],
          T: [],
          U: [],
          V: [],
          W: [],
          X: [],
          Y: [],
          Z: [],
          '#': [],
        }
        for (let i = 0; i < newVal.length; i++) {
          let nickname = newVal[i].friend.nickname || '-' // 如果沒有nickname就用username擷取
          nickname = nickname.toString()
          const letter = query(nickname).toUpperCase()
          if (arr[letter]) {
            arr[letter].push(newVal[i])
          } else {
            arr['#'].push(newVal[i])
          }
        }
        this.arr = arr
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.VA__setAdressList()
  },
  methods: {
    ...mapActions('tpay', ['VA__setAdressList']),
    gonext(id, nickname, avatar) {
      const type = this.type
      const avatar_temp = avatar || require('../my/avatar.png');
      // this.$myConsole.log('gonext type', type)
      if (type === 'senddeal') {
        this.$router.push({
          name: 'senddeal_2',
          params: {
            userid: id,
            nickname,
            avatar: avatar_temp,
            redirect: '/addresslist'
          },
          query: {
            userid: id,
          },
        })
      } else if (!type) {
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
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';

.newfriend {
  margin-top: 12px;
  margin-bottom: 12px;
}

.title {
  color: $labelColor4;
}

.newfriend-icon {
  width: 45px;
  height: 45px;
}

.badge {
  font-size: 14px;
  color: $cardColor;
  border-radius: 20px;
  background-color: #FF4E4E;
  padding: 0px 8px;
}

::v-deep .van-cell:active {
  background-color: $listActiveBgColor;
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

.weight {
  font-weight: bold;
}

// 以下為右側字母列表樣式寮整
::v-deep .van-index-bar__sidebar {
  position: fixed;
  top: 53%;
}

::v-deep .van-index-bar__index {
  font-size: 14px;
  margin-bottom: 6px;
}

</style>
