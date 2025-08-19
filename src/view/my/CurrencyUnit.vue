<template>
  <div class="currencyUnit">
    <my-head :title="$t('my.currencyUnit.title')"></my-head>
    <div class="main-content">
      <van-cell-group class="">
        <van-cell
          v-for="(item, index) in currencyList"
          :key="index"
          :title="`${$t(`my.currencyUnit.${item.code}`)} (${item.name})`"
          :border="true"
          :clickable="!isLoading"
          @click="isLoading ? '' : setCurrency(item)"
        >
          <template #right-icon>
            <van-icon v-if="currency === item.id" class="success" name="success"/>
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
  import { getCoinList, updateUser } from '@/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'CurrencyUnit',
    components: {
      myHead,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Icon.name]: Icon,
    },
    data() {
      return {
        isLoading: false,
        currencyList: [],
        currencyShow: settings.currency,
        currency: 0,
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
    },
    created() {
      this.getCoinList()
      if (!this.VG__userInfo.currency) {
        // 這裡配合「默認法幣」去做更改
        this.setCurrency({
          id: 3,
          name: 'TWD',
          code: 'TWD',
        })
      } else {
        this.currency = this.VG__userInfo.currency
      }
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo']),
      async getCoinList() {
        const params = {
          page_size: 100,
        }
        await getCoinList(params).then(res => {
          const currency = res.data.results.filter(item => !item.is_crypto && item.active && item.code !== 'CNY') // 2021.12.08 因應營運需求,BeePal移除關於大陸的相關顯示
          this.$myConsole.log('currency', currency)
          this.currencyList = currency.map(item => {
            return {
              id: item.id,
              name: item.name,
              code: item.code,
            }
          })
        })
      },
      async setCurrency(item) {
        this.isLoading = true
        const params = {
          currency: item.id
        }
        await updateUser(this.VG__userInfo.id, params).then(async res => {
          if (res.code === 0) {
            console.log('setCurrency-success')
            this.currency = item.id
            Storage.setLocal('mainCoinSymbol', item.code)
            await this.VA__updateUserInfo()
          } else {
            console.log('setCurrency-err')
          }
          this.isLoading = false
        }).catch(err => {
          console.log('setCurrency-err', err)
          this.isLoading = false
        })
      },
    },
  }
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';

.currencyUnit {
  margin-top: 12px;

  .van-cell {
    padding: 20px 24px;
    font-size: 14px;
    font-weight: bold;
  }

  .success {
    color: #00D054;
    font-size: 18px;
    margin-top: 5px;
  }
}
</style>
