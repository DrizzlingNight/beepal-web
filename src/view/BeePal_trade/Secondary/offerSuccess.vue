<template>
  <div class="offerSuccess">
    <my-head :title="isEditMode ? $t('beePal.trade.updateTrade') : $t('beePal.trade.createOffer')" :goBackPath="'/trade'" border></my-head>
    <div class="main-content">
      <div class="detail">
        <div class="icon">
          <svg-icon :icon-class="offerSuccessIcon"/>
        </div>
        <div class="title">
          <p>{{ $t('beePal.trade.offerSuccess_title') }}</p>
        </div>
        <div class="content">
          <p>{{ isEditMode ? $t('beePal.trade.offerSuccess_edit_content') : $t('beePal.trade.offerSuccess_content') }}</p>
        </div>
      </div>
      <div class="btnGroup">
        <van-button class="continueOffer" @click="continueOffer">
          {{ $t('beePal.trade.continueOffer') }}
        </van-button>
        <van-button class="backToHome" @click="backToHome">
          {{ $t('beePal.trade.backToHome') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
// import config from '../config'
import { Row, Col, Button, Cell, Checkbox, Circle, Loading, Overlay, ActionSheet, Icon } from 'vant'

export default {
  name: 'OfferConfirm',
  components: {
    myHead,
    [Row.name]: Row,
    [Col.name]: Col,
    [Circle.name]: Circle,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
  },
  data() {
    return {
      isEditMode: false,
      step: 5,
      offerSuccessIcon: 'offerSuccess'
    }
  },
  computed: {
  },
  created() {
    const createOfferDatas = this.$Storage.getSession('createOfferDatas')
    this.isEditMode = createOfferDatas ? createOfferDatas.isEditMode : false
    this.$Storage.setSession('createOfferDatas', null)
  },
  mounted() {
  },
  methods: {
    continueOffer() {
      this.$router.push({
        name: 'offerDetail',
        params: {
          step: 1,
        }
      })
    },
    backToHome() {
      this.$router.push('/trade')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

$radius: 6px;

.offerSuccess {
  height: 100%;

  .main-content {
    display: flex;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    background: $pageBgColor;
    color: $labelColor1;
    padding-left: 15px;
    padding-right: 15px;

    .detail {
      display: flex;
      text-align: center;
      flex-direction: column;
      align-items: center;

      .icon {
        margin: 20px auto 20px;
        .svg-icon {
          width: 5em;
          height: 5em;
        }
      }

      .title {
        margin: 10px auto 20px;
        p {
          font-size: 32px;
          font-weight: bold;
        }
      }

      .content {
        p {
          font-size: 18px;
          color: #666666;
        }
      }
    }

    .btnGroup {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .continueOffer {
        flex-grow: 1;
        background: #FFCA00;
        border-radius: $radius;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        width: 80%;
        line-height: 44px;
        margin-top: 50px;
        // margin-bottom: 60px;
      }

      .backToHome {
        flex-grow: 1;
        background: #B9B9B9;
        border-radius: $radius;
        color: #000000;
        font-size: 16px;
        font-weight: bold;
        width: 80%;
        line-height: 44px;
        margin-top: 20px;
        // margin-bottom: 60px;
      }
    }
  }
}

</style>
