<template>
  <div class="deal">
    <pageHead :title="$t('deal.title')" border>
      <template v-slot:left><span></span></template>
    </pageHead>
    <div class="main-content flex col h100">
      <div class="myList grow flex">
        <van-pull-refresh v-model="upLoading" :pulling-text="$t('loading.text_3')" :loosing-text="$t('loading.text_4')"
                          :loading-text="$t('loading.text_1')" class="grow" style="overflow: auto" @refresh="onRefresh">
          <van-list
            v-show="!upLoading"
            v-model="isLoading"
            :finished="finished"
            :immediate-check="false"
            :finished-text="$t('loading.end')"
            :loading-text="$t('loading.text_1')"
            @load="onLoad"
          >
            <template v-for="item in deallist">
              <van-cell v-if="deallist.length!=0" :key="item.id" class="flex row-v-c"
                        @click="$router.push({path:'/detail',query:{id:item.id}})">
                <!-- 使用 title 插槽来自定义标题 -->
                <div class="flex row-between mt5 mb4">
                  <div class="flex row-between col">
                    <div class="userID mb5">
                      ID:{{ item.id }}
                    </div>
                    <div class="label1">
                      T pay {{ item.itemtype }}
                    </div>
                    <div class="time">
                      {{ item.time }}
                    </div>
                  </div>
                  <div class="flex row-between col">
                    <div :class="['price',{'up':item.amount >= 0},{'down':item.amount < 0}]">
                      {{ item.amount | money_filter }}
                    </div>
                    <div class="residue">
                      {{ $t('deal.text_1') }}: {{ item.current | money_filter }}
                    </div>
                  </div>
                </div>
              </van-cell>
            </template>
            <div v-if="deallist.length == 0 && !firstLoad" class="tips">{{ $t('loading.noRecord') }}</div>
            <div v-if="deallist.length == 0 && firstLoad" class="tips">{{ $t('loading.text_2') }}</div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Cell, List, PullRefresh } from 'vant'
  import { money_filter } from '@/filters'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'Index',
    components: {
      pageHead,
      [Cell.name]: Cell,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
    },
    filters: {
      money_filter,
    },
    data() {
      return {
        navActive: 0,
        finished: false,
        isLoading: false,
        upLoading: false,
        firstLoad: true,
      }
    },
    computed: {
      ...mapState('tpay', ['dealNext', 'deallist']),
    },
    created() {
      this.getItemList(null)
    },
    methods: {
      ...mapActions('tpay', ['VA__GetDealList']),
      async getItemList(next) {
        await this.VA__GetDealList(next)
        if (this.dealNext === 'null' && this.deallist.length !== 0) {
          this.finished = true
        } else {
          this.finished = false
        }
        if (this.firstLoad) this.firstLoad = false
      },
      async onRefresh() {
        this.itemList = []
        this.finished = false
        await this.getItemList(null)
        this.upLoading = false
      },
      async onLoad() {
        if (this.dealNext && this.dealNext !== 'null') {
          await this.getItemList(this.dealNext)
        }
        setTimeout(() => {
          this.isLoading = false
        }, 0)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .deal {
    height: calc(100% - #{$topHeight} - #{$topPadding});
  }

  .h100 {
    height: 100%;
  }

  .myList {
    overflow: auto;
    background-color: $pageBgColor;
    margin-bottom: $footerHeight;
    width: 100%;
  }

  .userID {
    font-size: 16px;
    //font-weight: bold;
    color: $labelColor1;
  }

  .label1, .time {
    color: $labelColor2;
    font-size: 12px;
    line-height: 16px;
  }

  .price {
    color: $Color;
    font-weight: bold;
    font-size: 21px;
    line-height: 35px;
    text-align: right;
  }

  .residue {
    font-size: 14px;
    color: $labelColor3;
    text-align: right;
  }

  ::v-deep .van-cell:active {
    background-color: $listActiveBgColor;
  }

  .up {
    color: $labelColor13
  }

  .down {
    color: $labelColor14
  }

  .tips {
    text-align: center;
    margin-top: 40px;
    color: $my-goLogin;
  }
</style>
