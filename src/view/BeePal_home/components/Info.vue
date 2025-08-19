<template>
  <div class="Info">
    <div v-for="(item, index) in InfoList" :key="index" class="item" @click="item.func">
      <svg-icon :icon-class="item.svg"/>
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Info',
  data() {
    return {
      InfoList: [
        {
          svg: 'info', name: this.$t('find.tabs_2'), func: () => {
            this.$router.push({
              name: 'find',
              params: {
                active: 1,
              },
            })
          },
        },
        {
          svg: 'service', name: this.$t('home.service'), func: () => {
            this.$notify({ type: 'primary', message: this.$t('beePal.deal.comeSoon') })
          },
        },
        {
          svg: 'lesson', name: this.$t('home.lesson'), func: () => {
            this.$router.push({
              name: 'lesson',
              params: {
              },
            })
          },
        },
        {
          svg: 'trade', name: this.$t('home.trade'), func: () => {
            if (this.VG__userInfo.certification_level !== 2) {
              this.$dialog
                .confirm({
                  message: this.$t('beePal.trade.needAdvancedAuth'),
                  className: 'dialog',
                  confirmButtonText: this.$t('base.goKyc'),
                  cancelButtonText: this.$t('base.cancel'),
                })
                .then(() => {
                  this.$router.push('/my/kyc')
                })
                .catch(() => {
                  window.location.reload()
                })
            } else {
              this.$router.push({
                name: 'trade',
                params: {
                  active: 1,
                },
              })
            }
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
  }
}
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .Info {
    min-height: 85px;
    padding: 10px 30px;
    overflow: visible;
    overflow-x: scroll;
    background: $pageBgColor;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 14px;

      &:active {
        opacity: 0.6;
      }

      &:not(:first-child) {
        margin-left: 50px;
      }

      .svg-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }
    }
  }
</style>
