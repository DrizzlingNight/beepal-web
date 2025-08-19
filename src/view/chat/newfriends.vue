<template>
  <div class="newfriends">
    <page-head :title="$t('chat.title_3')" border></page-head>
    <div class="main-content flex col h100">
      <van-pull-refresh v-model="upLoading" class="grow pt10" style="overflow: auto" @refresh="onRefresh">
        <van-list
            v-model="isLoading"
            :finished="finished"
            :immediate-check="false"
            :finished-text="$t('loading.end')"
            :loading-text="$t('loading.text_1')"
            @load="onLoad"
        >
          <van-cell>
            <div class="flex row-v-c">
              <!--            <svg-icon class-name="notice-svg" icon-class="notice"></svg-icon>-->
              <div class="left avatar shrink"></div>
              <div class="flex grow row-between row-v-c ml10">
                <div>
                  <div class="title ft16">Allo</div>
                  <div class="chat-content ft14">你好，我是Allo</div>
                </div>
                <div v-if="check == false" class="flex">
                  <div class="ignore mr7">{{ $t('chat.text_5') }}</div>
                  <div class="agree">{{ $t('chat.text_6') }}</div>
                </div>
                <div v-if="check == true" class="label ft12">
                  {{ $t('chat.text_7') }}
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  import { Cell, Icon, List, PullRefresh } from 'vant'

  export default {
  name: 'SendDeal3',
  components: {
    pageHead,
    [Cell.name]: Cell,
    [List.name]: List,
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
  },
  data() {
    return {
      finished: false,
      isLoading: false,
      upLoading: false,
      check: false,
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.upLoading = false
      }, 1000)
    },
    onLoad() {
      setTimeout(() => {
        this.isLoading = false
        this.finished = true
      }, 1000)
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';

.newfriends{
  height: calc(100% - #{$topHeight});
}
.title {
  font-weight: bold;
  color: $labelColor4;
}
.left {
  height: 45px;
  width: 45px;
  border-radius: 5px;
}

.chat-content {
  color: $my-goLogin;
  width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}

.ignore{
  padding: 3px 15px;
  font-size: 12px;
  color: $labelColor11;
  border: 0.5px solid $labelColor8;
  border-radius: 5px;
}

.agree{
  padding: 3px 15px;
  font-size: 12px;
  color: $cardColor;
  background-color: $cardBgColor;
  border-radius: 5px;
}

.h100{
  height: 100%;
}

.label{
  color: $labelColor11;
}
</style>
