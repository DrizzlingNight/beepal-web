<template>
  <div class="default-page">
    <!-- 圖片 -->
    <div :style="{
        'background-image':
          'url(' + require(`./img/${statusMap[status].img}.png`) + ')',
      }"
      class="image"
    />
    <!-- 標題 -->
    <p class="title">
      {{ $t(`defaultPage.${statusMap[status].text}.title`) }}
    </p>
    <!-- 描述 -->
    <p class="description">
      {{ $t(`defaultPage.${statusMap[status].text}.description`) }}
    </p>
    <!-- 按鈕 -->
    <div class="btnGroup">
      <van-button v-if="status === 0" class="reload" @click="reload">
        {{ $t('base.clickToReload') }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  name: 'DefaultPage',
  components: {
    [Button.name]: Button,
  },
  props: {
    status: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      statusMap: [
        {
          id: 0,
          text: 'networkError',
          img: 'network_error',
        },
        {
          id: 1,
          text: 'emptyContent',
          img: 'empty_content',
        },
        {
          id: 2,
          text: 'emptyResult',
          img: 'empty_result',
        },
        {
          id: 3,
          text: 'emptyMessage',
          img: 'empty_message',
        },
      ],
    }
  },
  methods: {
    reload() {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

$radius: 10px;

.default-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  height: 100vh;
  margin: 0 auto;

  .image {
    width: 191px;
    height: 189px;
    background-repeat: no-repeat;
    background-size: contain;
    margin-top: 0px;
    margin-bottom: 23px;
  }

  .title {
    color: #666666;
    font-size: 18px;
    line-height: 18px;
    margin-bottom: 14px;
  }

  .description {
    color: #A6A8B3;
    font-size: 14px;
    line-height: 14px;
  }

  .btnGroup {
    display: flex;
    justify-content: center;

    .reload {
      background: #FFC006;
      border-radius: $radius;
      color: #fff;
      font-size: 18px;
      width: 153px;
      line-height: 44px;
      margin-top: 32px;
    }
  }
}
</style>
