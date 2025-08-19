<template>
  <div class="newfriends">
    <page-head :title="$t('chat.title_4')" border></page-head>
    <div class="main-content">
      <div class="mpd" @click="$router.push('/addfriend_2')">
        <div class="mbtn flex row-v-c row-h-c">
          <van-icon class="ft20 mr4" name="search"/>
          <span class="ft14 label">{{ $t('scan.placeholder_1') }}</span></div>
      </div>
      <van-cell is-link class="flex row-v-c" @click="$router.push('/scan')">
        <div class="flex row-v-c">
          <svg-icon :icon-class="styles.buttonTheme+'scanicon'" class="mr14 ft34" class-name="scanicon"></svg-icon>
          <div class="ft16">
            {{ $t('scan.text_1') }}
          </div>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Cell, Field, Icon } from 'vant'
  import styles from '@/styles/variable.scss'

  export default {
    name: 'Addfriend',
    components: {
      pageHead,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [Cell.name]: Cell,
    },
    data() {
      return {
        value: '',
        styles,
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .mpd {
    padding: 15px;
  }

  .mbtn {
    background-color: $pageBgColor;
    padding: 10px 0;
    border-radius: 5px;
  }

  .label {
    color: $labelColor5
  }

  ::v-deep .van-cell {
    padding: 15px 15px;

    &:active {
      background-color: $listActiveBgColor;
    }
  }
</style>
