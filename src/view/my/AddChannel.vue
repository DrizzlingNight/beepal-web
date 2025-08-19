<template>
  <div class="addChannel">
    <my-head :title="$t('my.addChannel.title')" border @goback="$router.push('/otcPayment')"></my-head>
    <div class="main-content">
      <van-cell v-for="item in methods" :key="item.type" :url="item.path" is-link>
        <template #title>
          <div class="flex row-v-c">
            <img :src="require('@/assets/img/' + item.name + '.png')"/>
            <div>{{ $t(`beePal.payment.${item.name}`) }}</div>
          </div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { Cell } from 'vant'

  export default {
    name: 'AddChannel',
    components: {
      myHead,
      [Cell.name]: Cell,
    },
    data() {
      return {
        methods: [
          { type: 0, name: 'bank', path: '#/channelOption/Bank' },
          { type: 1, name: 'zfb', path: '#/channelOption/Alipay' },
          { type: 2, name: 'wexin', path: '#/channelOption/Wechat' },
        ],
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .addChannel {
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    background: $pageBgColor;
    display: flex;
    flex-direction: column;

    .van-cell {
      display: flex;
      align-items: center;
      padding: 15px 15px;
      color: $labelColor1;
      font-size: 14px;

      .van-cell__title {
        img {
          max-height: 100%;
          max-width: 26px;
          height: auto;
          width: auto;

          &:not(:last-child) {
            margin-right: 15px;
          }
        }
      }
    }
  }
</style>
