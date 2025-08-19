<template>
  <div class="otcPayment">
    <my-head :title="$t('my.otcPayment.title')" border @goback="goBack"></my-head>
    <div class="main-content">
      <template v-if="VG__userChannel && VG__userChannel.length">
        <template v-for="item in VG__userChannel">
          <div :key="item.id" class="paymentCard" @click="editChannel(item)">
            <div class="method flex row-v-c">
              <img :src="require('@/assets/img/' + methods[item.type].name + '.png')"/>
              <div>{{ item.type === 0 ? item.bank_name : $t(`beePal.payment.${methods[item.type].name}`) }}</div>
              <div v-show="item.is_default" class="default-tag">
                <p>{{ $t('my.otcPayment.default') }}</p>
              </div>
            </div>
            <div class="name">{{ item.account_name }}</div> <!-- 认证姓名 -->
            <div class="number flex row-v-c row-between">
              <div>{{ item.account_number }}</div>
              <svg-icon v-if="item.type != 0 && item.qr_code" icon-class="qrcode" class-name="qrcode"></svg-icon>
            </div>
          </div>
        </template>
        <div class="clickTip">{{ $t('my.addChannel.clickTip') }}</div>
      </template>
      <div v-else class="tip">{{ $t('my.otcPayment.tip') }}</div>
      <van-button class="add" @click="$router.push('addChannel')">{{ $t('my.otcPayment.add') }}</van-button>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { mapActions, mapGetters } from 'vuex'
  import { Button } from 'vant'
  import Storage from '@/utils/storage'

  export default {
    name: 'OTCPayment',
    components: {
      myHead,
      [Button.name]: Button,
    },
    data() {
      return {
        methods: [{ name: 'bank', path: 'Bank' }, { name: 'zfb', path: 'Alipay' }, { name: 'wexin', path: 'Wechat' }],
      }
    },
    computed: {
      ...mapGetters(['VG__userChannel']),
    },
    created() {
      this.VA__getUserChannel()
    },
    methods: {
      ...mapActions('user', ['VA__getUserChannel']),
      editChannel(item) {
        const opt = this.methods[item.type].path
        this.$router.push({
          name: 'channelOption',
          params: {
            opt,
          },
          query: {
            edit: item.id,
          },
        })
      },
      goBack() {
        const goBackPath = Storage.getSession('goBackPath')
        if (goBackPath) {
          this.$router.push(goBackPath)
        } else {
          this.$router.push('/my')
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .otcPayment {
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    background: #FBFBFB;
    display: flex;
    flex-direction: column;

    .tip {
      margin: auto;
      transform: translateY(-50px);
      text-align: center;
      font-size: 16px;
      color: $labelColor20;

    }

    .add {
      position: fixed;
      bottom: 6%;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      font-size: 16px;
      border: none;
      background: $linearBgColor-02;
      border-radius: 8px;
      color: $cardColor
    }

    .paymentCard {
      background: $pageBgColor;
      color: $labelColor1;
      margin: 15px 20px 0 20px;
      border-radius: 8px;
      padding: 20px;

      &:active {
        background: rgba(#000000, 0.02);
      }
      .method {
        font-size: 14px;

        .default-tag {
          // margin-top: 5px;
          // color: $labelColor21;
          // border-color: $BorderColor4;
          overflow: hidden;
          width: 50px;
          height: 60px;
          position: absolute;
          right: 20px;
          text-align: center;
          background-color: #20A763;
          color: white;
          border: none;
          padding: 1px 6px;
          clip-path: polygon(0 0, 50% 0, 100% 50%, 100% 100%);
          // transform: rotate(0.13turn) translateX(-8px) translateY(-10px);

          p {
            padding-top: 2px;
            transform: rotate(0.13turn) translateX(15px);
          }
        }

        img {
          max-height: 100%;
          max-width: 26px;
          height: auto;
          width: auto;

          &:not(:last-child) {
            margin-right: 15px;
          }
        }
      }

      .name {
        font-size: 12px;
        margin-top: 6px;
        color: $labelColor20;
      }

      .number {
        font-size: 16px;
      }
    }

    .clickTip {
      color: $labelColor21;
      text-align: center;
      margin-top: 25px;
      font-size: 14px;
      margin-bottom: 100px;
    }
  }
</style>
