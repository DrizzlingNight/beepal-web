<template>
  <div class="advAuth">
    <my-head :title="$t('my.advanceAuth.title')"></my-head>
    <div class="main-content">
      <van-cell :title="$t('my.advanceAuth.address')">
        {{ countryActions[country] }}
      </van-cell>
      <div class="type-change mt30">
        <div class="title">
          {{ $t('my.advanceAuth.type') }}
        </div>
        <div v-for="(item,index) in certificateActions" :key="item.name"
             :class="{ active: formData.type === index + 1 }"
             class="card" @click="formData.type = index + 1">
          {{ item.name }}
          <van-icon v-if="formData.type - 1 === index" name="success" class="checked"/>
        </div>
      </div>
      <van-button :class="{ disabledBtn: !formData.type }"
                  :disabled="!formData.type"
                  class="submit-btn" @click="next">{{ $t('my.advanceAuth.next') }}
      </van-button>
    </div>
  </div>
</template>

<script>
  import myHead from '@/components/head/Normal_head'
  import { ActionSheet, Button, Cell, Icon } from 'vant'
  import { mapGetters } from 'vuex'

  export default {
    name: 'AdvanceAuth',
    components: {
      myHead,
      [ActionSheet.name]: ActionSheet,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
      [Button.name]: Button,
    },
    data() {
      return {
        formData: {
          type: null,
        },
        countryActions: {
          CN: this.$t('my.auth.country_1'),
          TW: this.$t('my.auth.country_2'),
          HK: this.$t('my.auth.country_3'),
        },
        certificateActions: [
          { name: this.$t('my.auth.certificate_1') },
          { name: this.$t('my.auth.certificate_2') },
        ],
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      country() {
        return this.VG__userInfo && this.VG__userInfo.certification.country
      },
    },
    created() {
      if (this.VG__userInfo && this.VG__userInfo.certification) {
        const certificate = this.VG__userInfo.certification
        if (!certificate.base_certification) {
          this.$toast(this.$t('my.advanceAuth.tip6'))
          this.loading = true
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        } else if (!certificate.high_certification && certificate.base_certification && certificate.status === 0) {
          this.loading = true
          this.$router.push('/onprogress')
        } else if (certificate.high_certification) {
          this.$toast(this.$t('my.auth.authSuccess'))
          this.loading = true
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        }
      }
    },
    methods: {
      next() {
        const type = this.formData.type === 1 ? 'IDCard' : 'passport'
        this.$router.push({
          name: 'uploadAuth',
          params: {
            type,
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .advAuth {
    height: 100%;
  }

  .main-content {
    min-height: 100%;
    box-sizing: border-box;
    background: $pageBgColor;
    /*padding-bottom: 60px;*/
    display: flex;
    flex-direction: column;
  }

  .type-change {
    .title {
      font-size: 14px;
      margin-left: 15px;
      color: #323233;
      margin-bottom: 5px;
    }

    .card {
      border: 1px solid $labelColor20;
      color: $labelColor1;
      padding: 38px 25px 38px 50px;
      margin: 0 15px 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.active {
        color: $labelColor13;
        border: 1px solid $labelColor13;
      }

      .checked {
        background-color: $labelColor13;
        border-radius: 100%;
        padding: 2px;
        color: $labelColor1
      }
    }
  }

  .van-action-sheet__content {
    color: $labelColor1;

    .head {
      padding: 20px 20px;
      border-bottom: 1px solid $BorderColor3;
      font-size: 16px;

      .cancel {
        color: $labelColor20;
        font-size: 14px;
      }
    }

    .content {
      padding: 0 20px;

      .action {
        padding: 15px 0;
        border-bottom: 1px solid $BorderColor3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;

        .checked {
          background-color: $labelColor13;
          border-radius: 100%;
          padding: 2px;
        }
      }
    }
  }

  .submit-btn {
    margin: auto 32px 20px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background: $linearBgColor-02;
    border-radius: 6px;
    font-size: 16px;
    opacity: 1;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);

    &:active {
      background-color: #1174dd;
    }

    &.disabledBtn {
      background: $linearBgColor-06;
    }
  }
</style>
