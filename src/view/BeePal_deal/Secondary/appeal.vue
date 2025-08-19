<template>
  <div class="appeal">
    <my-head :title="$t('beePal.lastLap.appeal')" border></my-head>
    <div class="main-content">
      <div class="condition">
        <div class="title">{{ $t('beePal.appeal.reason') }}</div>
        <van-radio-group v-model="checked">
          <van-radio name="1">{{ $t('beePal.appeal.one') }}</van-radio>
          <van-radio name="2">{{ $t('beePal.appeal.two') }}</van-radio>
          <van-radio name="3">{{ $t('beePal.appeal.three') }}</van-radio>
        </van-radio-group>
        <van-field
          v-show="checked === '3'"
          v-model="message"
          :border="false"
          :placeholder="$t('beePal.appeal.placeholder')"
          rows="2"
          autosize
          type="textarea"
          maxlength="100"
          show-word-limit
        />
        <div class="remind">
          <div class="title">{{ $t('beePal.appeal.remind') }}</div>
          <div class="content">{{ $t('beePal.appeal.content') }}</div>
        </div>
        <div class="btn">
          <van-button :class="{canClick: checked }" :disabled="!checked" @click="confirm">{{ $t('beePal.appeal.confirm')
            }}
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { Button, Field, Radio, RadioGroup } from 'vant'

  export default {
    name: 'Appeal',
    components: {
      myHead,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Field.name]: Field,
      [Button.name]: Button,
    },
    data() {
      return {
        checked: null,
        message: null,
      }
    },
    methods: {
      confirm() {
        this.$toast(this.$t('tip.submitSuccess'))
        setTimeout(() => {
          this.$router.push({ name: 'deal' })
        }, 1000)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .appeal {
    height: 100%;
  }

  .main-content {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: $pageBgColor;
    color: $labelColor1;
    padding-left: 15px;
    padding-right: 15px;
  }

  .condition {
    padding-top: 30px;
    padding-bottom: 30px;
    box-sizing: border-box;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    color: $labelColor1;

    > .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .van-radio-group {
      ::v-deep .van-radio {
        font-size: 14px;
        margin-top: 10px;

        .van-radio__icon {
          font-size: 17px;
        }

        .van-radio__icon--checked {
          .van-icon {
            background-color: $cardBgColor;
            border-color: $cardBgColor;
          }
        }
      }
    }

    .van-field {
      background-color: $tintBg;
      border: 1px solid $BorderColor4;
      border-radius: 6px;
      margin-top: 10px;
    }

    .remind {
      margin-top: 20px;
      padding: 5px 15px;
      background-color: $tipsBg;
      border: 1px solid $tipsColor;
      margin-bottom: 30px;
      border-radius: 6px;

      .title {
        font-size: 14px;
        color: $tipsColor;
        font-weight: bold;
      }

      .content {
        margin: 5px 0;
        font-size: 12px;
        color: $labelColor26;
      }
    }

    .btn {
      margin-top: auto;
      padding: 0 15px;

      .van-button {
        background: $linearBgColor-05;
        font-size: 16px;
        border-radius: 6px;
        border: none;
        height: 48px;
        color: $cardColor;
        width: 100%;
        opacity: 1;
      }

      .canClick {
        background: $linearBgColor-02;
      }
    }
  }
</style>
