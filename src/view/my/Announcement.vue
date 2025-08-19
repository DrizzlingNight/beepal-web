<template>
  <div class="my-invitation-code">
    <!-- <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('my.Announcement.title') }}</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
            icon-class="livechat"
            class-name="livechat" @click.stop="
          handleRouter('livechat')
        ">
        </svg-icon>
      </div>
    </div> -->
    <my-head :title="$t('my.Announcement.title')"></my-head>
    <div class="main-content h100 flex">
      <ul class="announcement-list grow flex">
        <van-pull-refresh :pulling-text="$t('loading.text_3')" :loosing-text="$t('loading.text_4')"
                          :loading-text="$t('loading.text_1')" v-model="refreshing" class="grow" @refresh="onRefresh">
          <van-list
              v-model="loading"
              :finished="finished"
              :immediate-check="false"
              :loading-text="$t('loading.text_1')"
              :finished-text="$t('loading.end')"
              :offset="10"
              @load="onLoad"
          >
            <template v-if="notices.length > 0">
              <router-link v-for="(item, index) in notices" :key="index" :to="'/AnnouncementDetail?id=' + item.id" tag="li"
                           class="announcement-item">
                <div class="date ft12 mt5">{{ item.date }}</div>
                <div class="announcement-content">
                  <div class="title">{{ item.title }}</div>
                  <div class="content"
                       v-html="item.content.length > 100 ? item.content.slice(0,100) + ' ...' : item.content">
                    <!--                {{  }}-->
                  </div>
                  <div class="link line-wrap">
                    <span>{{ $t('my.Announcement.text_1') }}</span>
                    <van-icon name="arrow" color="#ADADAD" size="22"/>
                  </div>
                </div>
              </router-link>
            </template>
          </van-list>
        </van-pull-refresh>
      </ul>
    </div>
  </div>
</template>

<script>
import { Icon, List, PullRefresh } from 'vant'
import { settings } from '@/config'
import myHead from '@/components/head/Normal_head'
import { lang } from '@/config/mayfly/dgc'
import { mapActions, mapState } from 'vuex'
import Storage from '@/utils/storage'

export default {
  name: 'Announcement',
  components: {
    [Icon.name]: Icon,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    myHead
  },
  data() {
    return {
      livechat: settings.customerService,
      // list: [],
      loading: false,
      finished: false,
      refreshing: false,
      count: 0,
      queryObj: {
        page: 1,
        page_size: 10,
        search: null,
      },
      lang,
    }
  },
  computed: {
    ...mapState('tpay', ['notices']),
  },
  watch: {
    notices: {
      handler(newV, oldV) {
        if (newV.length > 0) {
          Storage.setLocal('tpay_notices_read_date', new Date())
        }
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    const locale = this.$i18n.locale
    this.queryObj.search = this.lang[locale]
    this.getLists()
  },
  methods: {
    ...mapActions('tpay', ['VA__GetNotices']),
    async onLoad() {
      if (this.notices.length >= this.count && !this.refreshing) {
        this.finished = true
        return
      }
      await this.getLists()
      this.refreshing = false
      this.loading = false
    },
    onRefresh() {
      this.finished = false
      // 重新加载数据
      this.queryObj.page = 1
      // 将 loading 设置为 true，表示处于加载状态
      this.onLoad()
    },
    async getLists() {
      const params = this.queryObj
      const back = await this.VA__GetNotices(params);
      this.count = back.count
      this.queryObj = back.queryObj
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.announcement-list {
  padding: 0px 20px 0px;
}

.announcement-item {
  color: $labelColor4;
  margin-bottom: 10px;

  .date {
    text-align: center;
    line-height: 35px;
  }

  .announcement-content {
    background-color: $pageBgColor;
    border-radius: 8px;
    padding: 10px 18px;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: $labelColor16;
    }

    .content {
      padding: 10px 0;
      font-size: 14px;
      white-space: normal;
      overflow: hidden;
      word-break: break-all;
      color: $labelColor16;
    }

    .link {
      font-size: 14px;
      color: $yellow;
      border-top: 1px solid $BorderColor;
      padding-top: 10px;
    }
  }
}
.my-invitation-code {
  height: 100%;
}

.h100 {
  height: calc(100% - #{$topHeight});
}
</style>
