<template>
  <div class="announcement-detail">
    <my-head :title="$t('my.Announcement.detail')">
      <template #right>
        <div v-if="livechat" class="page-title-cs">
          <svg-icon
            :icon-class="livechat"
            :class-name="livechat" @click.stop="
          handleRouter('livechat')
        ">
          </svg-icon>
        </div>
      </template>
    </my-head>

    <div class="main-content">
      <div class="detail">
        <h1 class="title">{{ data.title }}</h1>
        <div class="inner" v-html="data.content">
        </div>
        <div class="date ft12">{{ data.updated_at | dateFormat }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { settings } from '@/config'
  import { getNoticeById } from '@/api/dgc/assets'
  import { dateFormat } from '@/utils/dateFormat'
  import myHead from '@/components/head/Normal_head'

  export default {
    name: 'AnnouncementDetail',
    filters: {
      dateFormat(item) {
        if (item) {
          return dateFormat(item)
        } else {
          return ''
        }
      },
    },
    components: {
      myHead,
    },
    data() {
      return {
        livechat: settings.customerService,
        data: {
          content: '',
          title: '',
          update_time: null,
        },
      }
    },
    created() {
      const id = this.$route.query.id
      getNoticeById(id).then(res => {
        this.data = res.data
      })
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .detail {
    color: $Color;
    padding: 20px;

    .title {
      text-align: center;
      font-size: 16px;
    }

    .inner {
      color: $labelColor9;
      font-size: 14px;
      white-space: normal;
      overflow: hidden;
      word-break: break-all;
      padding: 20px 0;
    }

    .date {
      color: $labelColor9
    }
  }
</style>
