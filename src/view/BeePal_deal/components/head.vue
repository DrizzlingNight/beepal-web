<template>
  <my-head class="header">
    <template #left><span></span></template>
    <template #title>
      <my-tabs ref="tabs" :tabs="tabs" :before-change="beforeChange" :default-active="1"></my-tabs>
    </template>
    <template #right>
      <div class="right flex row-v-c ft14">
        <svg-icon class-name="ml6 switch" icon-class="switch" @click="$router.push('/currencyUnit')"></svg-icon>
        <span>{{ currencyCoin }}</span>
      </div>
    </template>
  </my-head>
</template>

<script>
  import myHead from '@/components/head/BeePal_head'
  import myTabs from '@/components/BeePalComp/myTabs'
  import { settings } from '@/config'

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
        currencyCoin: this.$Storage.getLocal('mainCoinSymbol') || settings.mainCoinSymbol,
      }
    },
    computed: {
      active() {
        if (!this.isMounted) return null
        return this.$refs.tabs.active
      },
    },
    mounted() {
      this.isMounted = true
    },
    methods: {
      beforeChange(index) {
        if (index === 0) {
          this.$notify({ type: 'primary', message: this.$t('beePal.deal.comeSoon') })
          return false
        }
        return true
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .header {
    height: 60px;
    background: $cardBgColor;

    .right {
      color: $cardColor;
    }

    .switch {
      cursor: pointer;
    }
  }
</style>
