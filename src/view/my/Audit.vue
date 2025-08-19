<template>
  <div class="audit">
    <my-head :title="$t('my.audit.title')" border @goback="$router.replace('/my/kyc')"></my-head>
    <div class="main-content">
      <div class="title">{{ $t('my.audit.tip') }}</div>
      <div class="tip">{{ $t('my.audit.tip2') }}</div>
      <van-button class="submit-btn" @click="$router.push('/my/kyc')">{{ $t('my.dialog_3') }}</van-button>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { Button } from 'vant'

  export default {
    name: 'Audit',
    components: {
      myHead,
      [Button.name]: Button,
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .audit {
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    background: $pageBgColor;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;

    .title {
      color: $gathering;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
    }

    .tip {
      color: $labelColor20;
      font-size: 14px;
      margin-top: 5px;
      margin-bottom: 50px;
      text-align: center;
    }
  }

  .submit-btn {
    position: absolute;
    bottom: 20px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background: $linearBgColor-02;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    width: 85%;

    &:active {
      background-color: #1174dd;
    }
  }
</style>
