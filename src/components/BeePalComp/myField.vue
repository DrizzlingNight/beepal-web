<template>
    <div class="myField">
        <div class="left">
            <div :class="tmb ? 'mb'+tmb : ''" class="title">
                <span>{{ title }}</span>
                <span class="tips">{{ tips }}</span>
            </div>
            <van-field :readonly="readonly" v-bind="$attrs" v-on="$listeners"></van-field>
        </div>
        <slot name="right"></slot>
    </div>
</template>

<script>
  import { Field } from 'vant';
  export default {
    name: 'MyField',
    components: {
      [Field.name]: Field
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      tips: {
        type: String,
        default: ''
      },
      tmb: {
        type: Number,
        default: 0,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    }
  }
</script>

<style lang="scss" scoped>
    @import '@/styles/variable.scss';
    .van-field {
        background-color: inherit;
        padding: 0;
    }

    .myField {
        background-color: $pageBgColor;
        width: 100%;
        height: auto;
        padding: 10px 15px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: inherit;
        .left {
            flex-grow: 1;
            .title {
                font-weight: bold;
            }
            .tips {
                color: rgba($color: $tipsColor, $alpha: 0.59);
                font-size: 12px;
                margin-left: 10px;
            }
        }
    }
</style>
