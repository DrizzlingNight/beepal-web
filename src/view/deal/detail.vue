<template>
  <div class="detail">
    <page-head :title="$t('deal.title_2')" border>
    </page-head>
    <div class="main-content">
      <div v-if="JSON.stringify(list) != '{}'" class="box-card">
        <div>
          <span>{{ $t('deal.text_2') }}</span>
          <span>{{ list.memo.to_user_id || list.memo.from_user_id || 'admin' }}</span>
        </div>
        <div>
          <span>{{ $t('deal.text_8') }}</span>
          <span>{{ list.memo.to_user || list.memo.from_user || 'admin' }}</span>
        </div>
        <div>
          <span>{{ $t('deal.text_3') }}</span>
          <span>{{ $t('coin_type.' + getCoinType(list.type).name) }}</span>
        </div>
        <div>
          <span>{{ $t('deal.text_4') }}</span>
          <span>{{ list.created_time | dateFormat('yyyy/MM/dd hh:mm') }}</span>
        </div>
        <div>
          <span>{{ $t('deal.text_5') }}</span>
          <span>{{ list.created_time | dateFormat('yyyy/MM/dd hh:mm') }}</span>
        </div>
        <div>
          <span>{{ $t('deal.text_6') }}</span>
          <span>{{ $t('tip.success') }}</span>
        </div>
        <div>
          <span>{{ $t('deal.text_7') }}</span>
          <span>T pay</span>
        </div>
        <div>
          <span>{{ $t('deal.text_10') }}</span>
          <span>{{ list.changed | money_filter }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Cell, Icon, List } from 'vant'
  import { money_filter } from '@/filters'
  import { dateFormat } from '@/utils/time'
  import { dgc_transaction } from '@/api'
  // import { settings } from '@/config'
  import { getCoinType } from '@/config/mayfly/dgc'

  export default {
    name: 'Detail',
    filters: {
      money_filter,
      dateFormat,
    },
    components: {
      pageHead,
      [Cell.name]: Cell,
      [List.name]: List,
      [Icon.name]: Icon,
    },
    data() {
      return {
        list: {},
        coin_type: getCoinType(),
      }
    },
    mounted() {
      var querys = this.$route.query.id
      dgc_transaction(querys).then(res => {
        this.list = res
      })
    },
    methods: {
      getCoinType,
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .box-card {
    margin: 13px;
    background-color: $pageBgColor;
    border-radius: 5px;
    min-height: 100px;
    padding: 20px 18px;
    font-size: 14px;
    color: $labelColor4;
  }

  .box-card div {
    display: flex;
    justify-content: space-between;

    &:nth-of-type(1) {
      font-size: 16px;
      //font-weight: bold;
    }

    &:not(:nth-of-type(1)) {
      margin-top: 20px;
    }
  }
</style>
