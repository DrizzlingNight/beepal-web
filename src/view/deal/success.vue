<template>
  <div class="success">
    <page-head>
      <template v-slot:left><span></span></template>
      <template v-slot:right><span></span></template>
    </page-head>
    <div class="main-content h100 flex col">
      <div class="grow content flex row-v-c col">
        <div class="badge mt73">
          <van-icon name="success"/>
        </div>
        <div class="ft16 mt30 label-success">{{ $t('tip.sendsuccess') }}</div>
        <div class="mbtn" @click="gotoRedirect">{{ $t('tip.complete') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/index'
  import { Icon } from 'vant'

  export default {
    name: 'SendSuccess',
    components: {
      pageHead,
      [Icon.name]: Icon,
    },
    data() {
      return {
        value: '',
      }
    },
    methods: {
      gotoRedirect() {
        const redirect = this.$route.params.redirect ? this.$route.params.redirect : '/buy'
        // console.log(redirect);
        this.$router.push(redirect)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .success {
    height: calc(100% - #{$topHeight});
  }

  .h100 {
    height: 100%;
  }

  .content {
    width: 100%;
    background-color: $pageBgColor;
  }

  .badge {
    border-radius: 50%;
    background-color: $cardBgColor;
    width: 70px;
    height: 70px;
    text-align: center;
    line-height: 82px;
    font-size: 35px;
    color: $cardColor;
  }

  .label-success {
    color: $labelColor4;
  }

  .mbtn {
    width: calc(100% - 80px);
    text-align: center;
    color: $cardColor;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    background-color: $cardBgColor;
    margin: 110px 40px 0;
    border-radius: 4px;
  }
</style>
