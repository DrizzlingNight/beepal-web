<template>
  <div class="Info">
    <van-pull-refresh
      v-model="state.refreshing"
      :loading-text="$t('beePal.tokenDetail.loading')"
      :loosing-text="$t('beePal.tokenDetail.loosingText')"
      :pulling-text="$t('beePal.tokenDetail.pullingText')"
      @refresh="onRefresh"
    >
      <van-list
        v-model="state.loading"
        :finished="state.finished"
        :finished-text="finishedText"
        :loading-text="$t('beePal.tokenDetail.loading')"
        @load="onLoad"
      >
        <template v-for="(item,index) in info_list">
          <div :key="index" class="card">
            <div class="card-head">
              <div class="publisher">
                <div>{{ item.publisher }}</div>
                <div class="time">{{ item.createdTime }}</div>
              </div>
              <div class="share" @click="share(item)">
                <van-icon name="share-o"/>
                <span>{{ $t('find.share') }}</span>
              </div>
            </div>
            <div v-if="item.type === '1'" class="exhibition">
              <img :src="item.img"/>
            </div>
            <div class="card-content">
              <div class="title">
                {{ item.title }}
              </div>
              <div v-show="item.spread" class="content" v-html="item.content">
                <!-- {{ item.content }} -->
              </div>
              <div v-if="item.spread != null" class="spread" @click="item.spread = !item.spread">
                {{ item.spread ? $t('find.pack_up') : $t('find.read_more') }}
              </div>
            </div>
          </div>
        </template>
      </van-list>
      <div v-show="!info_list.length && !state.loading" class="noRecord">
        {{ $t('beePal.deal.noRecord') }}
      </div>
    </van-pull-refresh>
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
  import { Icon, List, PullRefresh, ShareSheet } from 'vant'
  import { getInfo } from '@/api/beePal'
  import openApp from '@/utils/openApp'
  import { dateFormat } from '@/utils/dateFormat'

  export default {
    name: 'Info',
    components: {
      [Icon.name]: Icon,
      [ShareSheet.name]: ShareSheet,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
    },
    data() {
      return {
        info_list: [],
        state: {
          // 下拉刷新和上拉加载的状态
          loading: false,
          finished: false,
          refreshing: false,
        },
        page: 1,
        count: 0,
        showShare: false,
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
          // 2021.11.25 暫時先把Instagram分享功能隱藏起來
          // {
          //   id: 3,
          //   name: 'Instagram',
          //   icon: require('@/assets/img/Instagram.png'),
          // },
        ],
        shareItem: null,
      }
    },
    computed: {
      finishedText() {
        if (this.info_list.length) return this.$t('beePal.tokenDetail.noMore')
        else return ''
      },
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      onLoad() {
        if (this.state.refreshing) {
          this.info_list = []
          this.state.refreshing = false
        }
        const params = {
          page: this.page,
        }
        getInfo(params, this.id).then(res => {
           // 2021.08.20 配合新API，資料放res.data裡
          this.count = res.data.count || 0
          const results = res.data.results ? res.data.results : [{ ...res.data }]

          results.forEach(item => {
            const obj = {
              id: item.id,
              publisher: item.cate.cat_name,
              img: item.thumb,
              title: item.title,
              content: item.content,
              createdTime: dateFormat(item.created_at, 'MM-dd hh:mm'),
              spread: false,
              type: item.type,
            }
            this.info_list.push(obj)
          })
          if (this.$route.query.id) this.$router.replace({ query: null })
          this.end()
          this.page = this.page + 1
        }).catch(err => {
          console.log('getInfo-err', err)
          this.info_list = []
          this.end()
        })
      },
      onRefresh() {
        // 清空列表数据
        this.state.finished = false
        this.page = 1
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.state.loading = true
        this.onLoad()
      },
      end() {
        setTimeout(() => {
          // 加载状态结束
          this.state.loading = false
          // 数据全部加载完成
          if (this.info_list.length >= this.count) {
            this.state.finished = true
          }
        })
      },
      share(item) {
        this.shareItem = item

        // 2021.11.25 把分享功能都改成調用手機原生分享（不管Android還是IOS）
        const originUrl = '/#/find' + `?id=${this.shareItem.id}`
        window.navigator.share({
          url: originUrl
        })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.log('Sharing failed', error))

        // // iOS分享
        // if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)) {
        //   const originUrl = '/#/find' + `?id=${this.shareItem.id}`
        //   window.navigator.share({
        //     url: originUrl
        //   })
        //   .then(() => console.log('Share was successful.'))
        //   .catch((error) => console.log('Sharing failed', error))
        // } else {
        //   this.showShare = true
        // }
      },
      onSelect(item) {
        const href = encodeURIComponent(location.href + '?id=' + this.shareItem.id)
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
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .Info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .van-pull-refresh {
    flex: 1
  }

  .card {
    margin-top: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-left: 10px;
    margin-right: 10px;

    .card-head {
      padding: 10px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .publisher {
        font-size: 14px;
        color: $labelColor1;
        font-weight: bold;

        .time {
          font-weight: normal;
          font-size: 12px;
          color: $labelColor27;
        }
      }

      .share {
        display: flex;
        white-space: nowrap;
        align-items: center;
        font-size: 12px;
        color: $labelColor13;
        padding: 3px 10px;
        border: 1px solid $labelColor13;
        border-radius: 50px;

        .van-icon {
          margin-right: 2px;
          font-size: 16px;
        }
      }
    }

    .exhibition {
      width: 100%;

      img {
        width: 100%;
        height: 150px;
        display: block;
      }
    }

    .card-content {
      padding: 10px 10px;

      .title {
        font-weight: bold;
        color: $labelColor1;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .content {
        color: $labelColor27;
        font-size: 12px;
      }

      .spread {
        color: $labelColor13;
        font-size: 12px;
        margin-top: 14px;

        &:active {
          color: rgba($labelColor13, 0.5)
        }
      }
    }
  }

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
      justify-content: space-around; // 2021.11.25 因應「暫時先把Instagram分享功能隱藏起來」的改動
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

  .noRecord {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: $completeColor;
  }
</style>
