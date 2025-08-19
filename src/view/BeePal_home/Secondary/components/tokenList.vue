<template>
  <van-pull-refresh
    v-model="state.refreshing"
    :loading-text="$t('beePal.tokenDetail.loading')"
    :loosing-text="$t('beePal.tokenDetail.loosingText')"
    :pulling-text="$t('beePal.tokenDetail.pullingText')"
    @refresh="$emit('onRefresh')"
  >
    <van-list
      v-model="state.loading"
      :finished="state.finished"
      :finished-text="finishedText"
      :loading-text="$t('beePal.tokenDetail.loading')"
      @load="$emit('onLoad')"
    >
      <template v-for="item in list">
        <!-- 2021.08.12 新API type 1為轉入(收款)、2為轉出 -->
        <div
          :key="item.id"
          :class="[
            item.type == 2 ? '_transfer' : '_gathering',
            { onprogress: item.status === 0 || item.status === 1 },
          ]"
          class="flex cell"
          @click="myClick(item)"
        >
          <svg-icon
            :icon-class="item.type == 2 ? 'send' : 'gathering'"
            class-name="left"
          />
          <van-cell>
            <template #title>
              <div class="account">{{ item.username || item.address }}</div>
              <div class="time">{{ item.time }}</div>
            </template>
            <template #default>
              <div class="amount flex row-v-c">
                <svg-icon v-if="item.lightning" icon-class="lightning" class-name="lightning" />
                <span>{{ item.amount }}</span>
              </div>
              <!-- 2021.11.22 「查看詳情」變成「完成」這段打開 -->
              <div :class="statusMap[item.status]" class="ft12">
                {{ $t('beePal.tokenDetail.' + statusMap[item.status]) }}
              </div>
            </template>
          </van-cell>
        </div>
      </template>
      <div v-show="list.length === 0 && !state.loading" class="noRecord">
        {{ $t('beePal.tokenDetail.noRecord') }}
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { Cell, List, PullRefresh } from 'vant'
export default {
  name: 'TokenList',
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Cell.name]: Cell,
  },
  props: {
    state: {
      type: Object,
      default: () => {
        return {}
      },
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      statusMap: ['onprogress', 'onprogress', 'complete', 'error'],
    }
  },
  computed: {
    finishedText() {
      if (this.list.length) return this.$t('beePal.tokenDetail.noMore')
      else return ''
    },
  },
  mounted() {
    // this.$myConsole.log('tokenList.vue list', this.list)
  },
  methods: {
    myClick(item) {
      if (this.$listeners['goPage']) {
        this.$emit('goPage', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.van-pull-refresh {
  flex-grow: 1;
  overflow: auto;
  ::v-deep .van-list__finished-text {
    color: $tabsInactiveColor;
    font-size: 14px;
  }
}
::v-deep .van-pull-refresh__track {
  height: 100%;
}
.van-list {
  height: auto;
  .cell {
    position: relative;
    align-items: center;
    font-size: 18px;
    .left {
      margin: 0px 15px;
    }
    .van-cell {
      height: 100%;
      align-items: flex-end;
      padding: 15px 15px 15px 0;
      border-bottom: 1px solid $BorderColor3;
      color: $labelColor1;
      .van-cell__value {
        line-height: 18px;
      }
      .van-cell__title {
        line-height: 15px;
      }
      .account {
        font-size: 12px;
        margin-bottom: 3px;
        width: 156px;
        overflow-wrap: break-word;
      }
      .time {
        color: $labelColor19;
        font-size: 12px;
      }
      .amount {
        // margin-bottom: 10px; // 查看詳情拔掉後讓數字置中用
        .lightning {
          font-size: 18px;
          color: $labelColor13;
          margin-right: 5px;
        }
        font-size: 14px;
        justify-content: flex-end;
      }
      .complete {
        color: $completeColor;
      }
      .error {
        color: $errorColor;
      }
    }
    &._transfer {
      &.onprogress {
        &::after {
          content: '';
          background-color: $transfer;
          @extend .cell__onprogress;
        }
      }
      .onprogress,
      .amount {
        color: $transfer;
      }
    }
    &._gathering {
      &.onprogress {
        &::after {
          content: '';
          background-color: $gathering;
          @extend .cell__onprogress;
        }
      }
      .onprogress,
      .amount {
        color: $gathering;
      }
    }
  }
}
::v-deep .noRecord {
  color: $tabsInactiveColor;
  padding-top: 20px;
  text-align: center;
  font-size: 14px;
}

.cell__onprogress {
  width: 150px;
  height: 3px;
  position: absolute;
  border-radius: 3px;
  bottom: 0;
  left: 0;
}
</style>
