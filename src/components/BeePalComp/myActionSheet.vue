<template>
  <van-action-sheet
    :value="show"
    :title="title"
    class="actions"
    @click-overlay="$emit('changeShow', false)"
    @cancel="$emit('changeShow', false)"
  >
    <div class="content">
      <div
        v-for="(item, index) in list"
        :key="index"
        :class="{active: select === index}"
        class="item"
        @click="
          changeType(index)
          $emit('changeShow', false)
        "
      >
        <div class="borderBox">
          <div class="box">
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
  import { ActionSheet } from 'vant'

  export default {
    components: {
      [ActionSheet.name]: ActionSheet,
    },
    model: {
      prop: 'show',
      event: 'changeShow',
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      list: {
        type: Array,
        default: () => [],
      },
      select: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      changeType(index) {
        this.$emit('update:select', index)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .actions {
    .van-action-sheet__header {
      padding: 3px 0;
      font-weight: bold;
    }
  }

  .content {
    border-top: 0.5px solid $BorderColor4;

    .item {
      font-size: 14px;
      padding: 0 15px;

      &:not(:last-child) {
        .borderBox {
          border-bottom: 0.5px solid $BorderColor4;
        }
      }

      .borderBox {
        padding: 15px 0;
        position: relative;
      }

      .box {
        margin: 0 auto;
        width: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .active {
      color: #FFC107;
    }
  }
</style>
