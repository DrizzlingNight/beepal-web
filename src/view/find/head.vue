<template>
  <my-head class="header" border>
    <template #left><span></span></template>
    <template #title>
      <my-tabs ref="tabs" :tabs="tabs" :before-change="beforeChange" :default-active="defaultActive"
               class="tabs"></my-tabs>
    </template>
    <template #right>
      <span></span>
    </template>
  </my-head>
</template>

<script>
  import myHead from '@/components/head/BeePal_head'
  import myTabs from '@/components/BeePalComp/myTabs'
  import { settings } from '@/config'
  import Storage from '@/utils/storage'

  export default {
    name: 'DealHead',
    components: {
      myHead,
      myTabs,
    },
    props: {
      tabs: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        isMounted: false,
        currencyCoin: settings.mainCoinSymbol,
      }
    },
    computed: {
      active() {
        if (!this.isMounted) return null
        return this.$refs.tabs.active
      },
      defaultActive() {
        return this.$route.params.active || Storage.getSession('find_active')
      },
    },
    mounted() {
      this.isMounted = true
    },
    methods: {
      beforeChange() {
        return true
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .header {
    height: 40px;
    background: $pageBgColor;
    padding-bottom: 3px;
    padding-top: 10px;
  }

  ::v-deep .van-tabs__nav {
    background: rgba($color: #E2E2E2, $alpha: 0.6);
  }
</style>
