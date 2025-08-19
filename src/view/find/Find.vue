<template>
  <div class="find">
    <my-head ref="head" :tabs="tabs">
      <!--      <template #right>-->
      <div v-if="livechat" slot="right" class="page-title-cs">
        <svg-icon
          icon-class="livechat"
          class-name="livechat" @click.stop="
          handleRouter('livechat')
        ">
        </svg-icon>
      </div>
      <!--      </template>-->
    </my-head>

    <gif-loading :visible="gifLoadingVisible"/>

    <div class="main-content">
      <component :is="component"/>
    </div>
  </div>
</template>

<script>
  import GifLoading from '@/components/gif-loading'
  import { settings } from '@/config'
  import myHead from '@/view/find/head'
  import Storage from '@/utils/storage'
  import Dapp from './Dapp'
  import Info from './Info'
  import MyDapp from './MyDapp'

  export default {
    name: 'Find',
    components: {
      GifLoading,
      myHead,
    },
    data() {
      return {
        gifLoadingVisible: false,
        livechat: settings.customerService,
        tabs: [
          this.$t('find.tabs_1'),
          this.$t('find.tabs_2'),
          this.$t('find.tabs_3'),
        ],
        component: Dapp,
        isMounted: false,
      }
    },
    computed: {
      active() {
        if (!this.isMounted) return null
        return this.$refs.head.active
      },
    },
    watch: {
      active(newv, oldv) {
        Storage.setSession('find_active', newv)
        switch (newv) {
          case 0:
            this.component = Dapp
            // this.$router.replace({ query: null }) // 2021.11.04 意義不明，會導致路由重複Error，先註解掉
            break
          case 1:
            this.component = Info
            break
          case 2:
            this.component = MyDapp
            break
        }
      },
    },
    created() {
      if (this.$route.query.id) Storage.setSession('find_active', 1)
    },
    mounted() {
      this.isMounted = true
    },
    methods: {
      handleRouter(router) {
        if (this.$route.path.includes(router)) {
          return
        } else {
          this.$router.push(`/${router}`)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .find {
    background: $pageBg;
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom: 70px;
    display: flex;
    flex-direction: column;
    background-color: $pageBgColor;
  }

  // 解決在Safari tabs切換時灰色外框會失去border-radius屬性的問題（因為用了transform動畫，導致safari的顯示bug）
  ::v-deep .van-tabs {
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
  }
</style>
