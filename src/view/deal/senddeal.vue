<template>
  <div class="senddeal">
    <page-head :title="$t('deal.title_3')" border @goback="$router.replace('/buy')">
    </page-head>
    <div class="main-content mpd flex col row-between h100">
      <div class="card mt15">
        <div class="title">
          {{ $t('deal.placeholder_1') }}
        </div>
        <van-field v-model="value" :placeholder="$t('deal.placeholder_2')" maxlength="15">
          <template #right-icon>
            <svg-icon class-name="black_scan" icon-class="black_scan" class="ft18"
                      @click="$router.push('/scan')"></svg-icon>
            <div class="divline"></div>
            <svg-icon class-name="addresslist" icon-class="addresslist" class="ft19"
                      @click="$router.push('/addresslist?type=senddeal')"></svg-icon>
          </template>
        </van-field>
      </div>
      <div :class="['mbtn',{'disbtn':value.length===0}]" @click="gonext">
        {{ $t('tip.next') }}
      </div>
    </div>
    <van-overlay :show="show">
      <van-loading type="spinner" size="24px" class="loading"/>
    </van-overlay>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Field, Icon, Loading, Overlay } from 'vant'
  import { dgc_findUser } from '@/api'

  export default {
    name: 'Senddeal',
    components: {
      pageHead,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [Overlay.name]: Overlay,
      [Loading.name]: Loading,
    },
    data() {
      return {
        value: '',
        show: false,
      }
    },
    created() {

    },
    methods: {
      async gonext() {
        this.show = true
        var userid = null
        await dgc_findUser(this.value).then(async res => {
          if (res.count === 0) userid = null
          else userid = res.data.results[0].id // 2021.08.16 配合新API，資料放res.data裡
        }).catch(err => {
          console.log(err)
        })
        this.show = false
        if (this.value.length !== 0 && userid) {
          this.$router.push({
            name: 'senddeal_2',
            params: {
              redirect: '/senddeal',
            },
            query: {
              userid: userid,
            },
          })
        } else {
          this.$toast({
            message: 'The user does not exist',
            type: 'fail',
          })
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .mpd {
    padding-left: 15px;
    padding-right: 15px;
  }

  .disbtn {
    background-color: $diableBtnColor !important;
  }

  .card {
    background-color: $pageBgColor;
    border-radius: 4px;
    padding: 15px;
    color: $labelColor7;
    font-size: 14px;
  }

  .divline {
    margin: 0 10px;
    height: 10px;
    width: 0.5px;
    background-color: #979797;
  }

  .senddeal {
    height: calc(100% - #{$topHeight});
  }

  .h100 {
    height: 100%;
  }

  ::v-deep .van-field {
    padding-left: 0;
    border-bottom: 0.5px solid $cardBgColor;

    input {
      &::-webkit-input-placeholder {
        color: $labelColor8;
      }

      &::-ms-input-placeholder {
        color: $labelColor8;
      }
    }
  }

  ::v-deep .van-field__right-icon {
    display: flex;
    align-items: center;
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
    border-radius: 5px;
  }

  .loading {
    left: 50%;
    top: 50%;
    transform: translate(-12px, -50%);
  }
</style>
