<template>
  <div class="addfriend">
    <div class="search flex row-v-c row-between">
      <van-search v-model="value" :placeholder="$t('scan.placeholder_1')" @keydown.enter="getitem()"/>
      <span class="mr12 ft14" @click="operation">{{ flag ? $t('tip.search') : $t('tip.cancel') }}</span>
    </div>
    <div :class="shownull ? '' : 'mt10'" class="flex row-v-c col">
      <van-loading :class="[{'disnone':!show},'mt10']" type="spinner" size="24px"/>
      <!-- <span :class="[{'disnone':!shownull},'mt10','findnull']">{{ $t('scan.text_2') }}</span> -->
      <default-page v-if="shownull" :status="2" />
      <van-cell v-for="item in arr" :key="item.id" class="mclick" @click="gotopage(item)">
        <div class="flex row-v-c">
          <!--            <svg-icon class-name="notice-svg" icon-class="notice"></svg-icon>-->
          <div class="left avatar shrink">
            <img :src="item.avatar | avatar"/>
          </div>
          <div class="flex grow row-between row-v-c ml10">
            <div>
              <div class="title ft16">{{ item.nickname || $t('base.noNicknameUser') }}</div>
              <div class="chat-content ft12">ID:{{ item.id }}</div>
            </div>
          </div>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import DefaultPage from '@/components/defaultPage'
import { Cell, Icon, Loading, Search } from 'vant'
import { getUserList } from '@/api'

export default {
  name: 'Addfriend',
  components: {
    DefaultPage,
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [Loading.name]: Loading,
  },
  filters: {
    avatar(item) {
      return item || require('../../my/avatar.png')
    }
  },
  data() {
    return {
      value: '',
      timer: '',
      show: false,
      arr: [],
      shownull: false,
      flag: false,
      finished: true,
    }
  },
  watch: {
    value(newval, oldval) {
      if (newval.trim() !== '' && newval) {
        this.flag = true
      } else {
        this.flag = false
      }
    },
  },
  methods: {
    init() {
      this.arr = []
      this.show = true
      this.shownull = false
    },
    operation() {
      if (this.flag) {
        if (this.finished) this.getitem()
      } else {
        this.$router.go(-1)
      }
    },
    gotopage(item) {
      console.log(item)
      this.$router.push({
        name: 'scanresult',
        params: {
          userid: item.id,
          nickname: item.nickname || this.$t('base.noNicknameUser'),
          avatar: item.avatar || require('../../my/avatar.png'),
          username: item.username
        },
        query: {
          userid: item.id
        }
      })
    },
    getitem() {
      var newval = this.value
      if (newval === '') return
      clearTimeout(this.timer)
      this.finished = false
      // let flag = false;
      var temp = []
      this.init()
      this.timer = setTimeout(async() => {
        const params = {
          search: newval,
        }
        await getUserList(params).then(res => {
          // this.$myConsole.log('getUserList res', res)
          const results = res.data.results;
          if (res.data.count > 0) {
            results.forEach(item => {
              temp.push(item)
            })
          }
        }).catch(err => {
          console.log('getUserList-err', err)
        })

        if (temp.length === 0) {
          this.shownull = true
        }
        this.arr = temp
        this.show = false
        this.finished = true
      }, 1000)
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';

.search {
  //padding: 8px;
  border-bottom: 1px solid #e6e6e6;
}

::v-deep .van-search {
  width: 330px;
  background-color: inherit !important;
}

::v-deep .van-search__content {
  background-color: $pageBgColor;
}

.disnone {
  display: none;
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

.title {
  font-weight: bold;
  color: $labelColor4;
}

.chat-content {
  color: $my-goLogin;
}

.findnull {
  color: $labelColor9;
}

.mclick {
  &:active {
    background-color: $listActiveBgColor;
  }
}
</style>
