<template>
  <div class="lang">
    <my-head :title="$t('my.lang')"></my-head>
    <div class="main-content">
      <van-cell-group class="mt10">
        <van-cell v-for="(key, item) in langShow" v-show="key" :title="lang[item]" :key="item" clickable
                  @click="setLocale(item)">
          <template #right-icon>
            <van-icon v-if="locale === item" class="success" name="success"/>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { Cell, CellGroup, Icon } from 'vant'
  import { settings } from '@/config'
  import Storage from '@/utils/storage'

  export default {
    name: 'Lang',
    components: {
      myHead,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Icon.name]: Icon,
    },
    data() {
      return {
        lang: {
          cn: '简体',
          tw: '繁體',
          en: 'English',
          my: 'Malay',
        },
        langShow: settings.lang,
        locale: this.$i18n.locale,
      }
    },
    methods: {
      setLocale(item) {
        this.locale = item
        this.$i18n.locale = this.locale
        Storage.setLocal('locale', this.$i18n.locale)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .success {
    color: #00D054;
    font-size: 18px;
    margin-top: 5px;
  }
</style>
