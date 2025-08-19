<template>
  <van-popup
    :value="show"
    :close-on-click-overlay="false"
    class="successModal"
    position="top"
  >
    <div class="content">
      <div class="head">
        <div>
          <div class="title">
          </div>
        </div>
        <p class="close" @click="$emit('closeSuccessModal')">{{ $t('lesson.close') }}</p>
      </div>
      <div class="image">
        <img src="https://i.ibb.co/30HYKFL/success-icon.png" />
      </div>
      <div class="success-text">
        {{ $t('lesson.buySuccess') }}
      </div>
      <div class="success-description">
        {{ $t('lesson.buySuccessDescription') }}
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant'
export default {
  name: 'SuccessModal',
  components: {
    [Popup.name]: Popup,
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
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .successModal {
    position: fixed;
    top: 30%;
    left: 15%;
    width: 270px;
    height: auto;
    border-radius: 15px;
    // border-top-right-radius: 15px;
  }

  .content {
    padding: 20px 15px 25px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        color: $labelColor1; // 黑色
        font-size: 16px;
        font-weight: bold;
      }

      .close {
        cursor: pointer;
        color: #A6A8B3;
        font-size: 14px;
      }
    }

    .image {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 50px;

      img {
        width: 64px;
        height: 64px;
      }
    }

    .success-text {
      font-size: 16px;
      font-weight: bold;
      margin-top: 12px;
      text-align: center;
    }

    .success-description {
      font-size: 16px;
      margin-top: 40px;
      text-align: center;
    }

  }
</style>
