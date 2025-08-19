<template>
  <div class="confirm">
    <page-head :title="$t('deal.title_4')" border></page-head>
    <div class="main-content mpd flex col row-between h100">
      <div class="card mt15">
        <div class="head ft14">{{ $t('deal.text_12') }}</div>
        <div class="ft24 pricetitle">{{ amount }} {{ $t('deal.text_16') }}</div>
        <ul>
          <li><span>{{ $t('deal.text_17') }}</span><span>{{ $t('deal.text_12') }}（{{ $t('deal.text_19') }}{{
              nickname
            }}）</span></li>
          <li><span>{{ $t('deal.text_18') }}</span><span>{{ amount }}</span></li>
          <li><span>{{ $t('deal.text_14') }}</span><span>{{ cost | money_filter }}</span></li>
          <li v-if="remark"><span>{{ $t('deal.text_20') }}</span><span>{{ remark }}</span></li>
          <li><span>{{ $t('deal.text_21') }}</span><span>Tpay</span></li>
        </ul>
      </div>
      <div :class="['mbtn',{'disbtn':send_flag}]" @click="senddeal">
        {{ $t('tip.confirm') }}
      </div>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Field, Icon } from 'vant'
  import { dgc_senddeal } from '@/api'
  import { money_filter } from '@/filters'
  import { getCoin } from '@/config/mayfly/dgc'

  export default {
    name: 'SendDeal3',
    components: {
      pageHead,
      [Icon.name]: Icon,
      [Field.name]: Field,
    },
    filters: {
      money_filter,
    },
    data() {
      return {
        value: '',
        MAIN_COIN: getCoin(),
        send_flag: false,
      }
    },
    computed: {
      amount() {
        return this.$route.params.amount
      },
      userid() {
        return this.$route.params.userid || this.$route.query.userid
      },
      cost() {
        return this.$route.params.cost
      },
      remark() {
        return this.$route.params.remark
      },
      nickname() {
        return this.$route.params.nickname || this.$t('base.noNicknameUser')
      },
    },
    created() {
      if (this.amount == null || this.userid == null || this.cost == null || this.remark == null || this.nickname == null) {
        if (this.userid) {
          this.$router.replace('/senddeal_2?userid=' + this.userid)
        } else {
          this.$router.replace('/senddeal')
        }
      }
    },
    methods: {
      async senddeal() {
        if (this.send_flag === true) return
        this.send_flag = true
        var data = {
          coin: this.MAIN_COIN,
          amount: this.amount,
          memo: this.remark,
          user: this.userid,
        }
        await dgc_senddeal(data).then(res => {
          setTimeout(() => {
            this.$router.push({
              name: 'send_success',
              params: {
                redirect: this.$route.params.redirect,
              },
            })
          }, 0)
        }).catch(err => {
          console.log(err)
          this.send_flag = false
          this.$toast({
            message: this.$t('tip.sendfail'),
            type: 'fail',
          })
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .confirm {
    height: calc(100% - #{$topHeight});
  }

  .mpd {
    padding-left: 15px;
    padding-right: 15px;
  }

  .card {
    background-color: $pageBgColor;
    border-radius: 4px;
    padding: 15px;
    color: $Color;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  .card ul li {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;

    &:not(:last-of-type) {
      border-bottom: 0.5px solid #E0E0E0;
    }

    & span {
      font-size: 14px;

      &:nth-of-type(1) {
        color: $labelColor10;
      }

      &:last-of-type {
        font-weight: bold;
      }
    }

  }

  .card ul {
    padding: 15px 0;
  }

  .h100 {
    height: 100%;
  }

  .mbtn {
    width: calc(100% - 30px);
    text-align: center;
    color: $cardColor;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    background-color: $cardBgColor;
    margin: 20px 15px 78px;
    border-radius: 8px;
  }

  .head {
    color: $labelColor9;
  }

  .pricetitle {
    width: 100%;
    border-bottom: 0.5px dashed #979797;
    padding-top: 8px;
    padding-bottom: 18px;
  }

  .disbtn {
    background-color: $diableBtnColor !important;
  }
</style>
