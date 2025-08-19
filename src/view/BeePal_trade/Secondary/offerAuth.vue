<template>
  <div class="offerAuth">
    <my-head :title="isEditMode ? $t('beePal.trade.updateTrade') : $t('beePal.trade.createOffer')" :goBackPath="'/createOffer/offerPrice'" border></my-head>
    <div class="main-content">
      <div class="title">
        <van-cell :title="$t('beePal.trade.offerAuth_title')" />
      </div>
      <div class="content">
        <van-cell-group class="input__wrap">
          <van-cell
            :title="$t('beePal.trade.needAdvanceAuth')"
            :is-link="false"
            class="needAdvanceAuth"
            @click="myDatas.needAdvanceAuth = !myDatas.needAdvanceAuth"
          >
            <template #default>
              <div class="box flex row-v-c">
                <div class="mr8">
                  <div v-if="myDatas.needAdvanceAuth" class="checked">
                    <van-icon name="success"/>
                  </div>
                </div>
              </div>
            </template>
          </van-cell>
          <!-- 2021.10.26 新設計把「交易次數要求」拿掉 -->
          <!-- <van-field
            v-model.trim="myDatas.count"
            :border="false"
            :label="$t('beePal.trade.dealCount')"
            :error-message="errorMsg.count"
            :placeholder="$t('beePal.trade.placeholder_dealCount')"
            :formatter="val => positiveIntegerNumberFormatter(val)"
            type="number"
            class="count"
          /> -->
          <!-- 2021.09.01 設計說暫時先把「新用戶限額」拿掉 -->
          <!-- <van-field
            v-model.trim="myDatas.newUserLimit"
            :border="false"
            :label="$t('beePal.trade.newUserLimit')"
            :error-message="errorMsg.newUserLimit"
            :placeholder="$t('beePal.trade.placeholder_newUserLimit')"
            :formatter="val => positiveNumberFormatter(val)"
            type="number"
            class="newUserLimit"
          /> -->
        </van-cell-group>
      </div>
      <div class="btnGroup">
        <van-button :disabled="noClick" class="nextStep" @click="nextStep">
          {{ $t('beePal.trade.nextStep') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/head/Normal_head'
import FormValidatorMixin from '@/mixins/form-validator'
import { positiveIntegerNumberFormatter } from '@/utils/formatter'
// import config from '../config'
// import { settings } from '@/config'
import { Row, Col, Button, Field, Cell, CellGroup, Checkbox, Circle, Loading, Overlay, ActionSheet, Icon } from 'vant'

export default {
  name: 'OfferAuth',
  components: {
    myHead,
    [Row.name]: Row,
    [Col.name]: Col,
    [Circle.name]: Circle,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
  },
  mixins: [FormValidatorMixin],
  data() {
    return {
      positiveIntegerNumberFormatter,
      myDatas: {
        needAdvanceAuth: false,
        count: '',
        newUserLimit: '',
      },
      step: 3,
      errorMsg: {
        count: '',
        newUserLimit: '',
      },
      rules: {
        // 2021.10.26 新設計把「交易次數要求」拿掉
        // count: [
        //   {
        //     validator: (rule, value, callback) => {
        //       value = this.myDatas.count
        //       if (!value && value !== 0) {
        //         callback(`${this.$t('beePal.trade.dealCount')}${this.$t('base.noEmpty')}`)
        //       } else if (Number(value) <= 0) {
        //         callback(`${this.$t('beePal.trade.dealCount')}${this.$t('base.noZero')}`)
        //       } else {
        //         callback()
        //       }
        //     },
        //   },
        // ],
        // 2021.09.01 設計說暫時先把「新用戶限額」拿掉
        // newUserLimit: [
        //   {
        //     validator: (rule, value, callback) => {
        //       value = this.myDatas.newUserLimit
        //       if (!value && value !== 0) {
        //         callback(`${this.$t('beePal.trade.newUserLimit')}${this.$t('base.noEmpty')}`)
        //       } else if (Number(value) <= 0) {
        //         callback(`${this.$t('beePal.trade.newUserLimit')}${this.$t('base.noZero')}`)
        //       } else {
        //         callback()
        //       }
        //     },
        //   },
        // ],
      }
    }
  },
  computed: {
    datas() {
      return this.$Storage.getSession('createOfferDatas')
    },
    noClick() {
      const keys = Object.keys(this.myDatas)
      const needKeys = [] // 2021.10.26 新設計把「交易次數要求」拿掉
      let result = false
      keys.forEach(key => {
        if (needKeys.includes(key)) {
          // console.log('this.myDatas[key]', key, this.myDatas[key])
          if (Array.isArray(this.myDatas[key]) && !this.myDatas[key][0]) {
            result = true
          } else if (!String(this.myDatas[key])) {
            result = true
          }
        }
      })
      return result
    },
    isEditMode() {
      const createOfferDatas = this.$Storage.getSession('createOfferDatas')
      return createOfferDatas ? createOfferDatas.isEditMode : false
    }
  },
  created() {
    if (!this.datas) {
      this.$router.push({
        name: 'offerDetail',
        params: {
          step: 1,
        }
      })
    } else {
      this.myDatas = {
        ...this.datas
      }
    }
  },
  mounted() {
  },
  methods: {
    nextStep() {
      if (this.$__validate()) {
        this.setStorage()
        setTimeout(() => {
          this.$router.push({
            name: 'offerConfirm',
            params: {
              step: 4,
            },
          })
        })
      }
    },
    setStorage() {
      this.$Storage.setSession('createOfferDatas', this.myDatas)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

$radius: 6px;

.offerAuth {
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

    .title {
      .van-cell {
        padding: 15px 0;
        font-size: 24px;
        font-weight: bold;
      }
    }

    .content {
      .needAdvanceAuth,
      .count,
      .newUserLimit {
        border-bottom: 0.5px solid $BorderColor4;
        .checked {
          position: absolute;
          right: 15px;
          top: calc(50% - 10px);
          background: $cardBgColor;
          padding: 3px;
          border-radius: 100%;

          .van-icon {
            display: block;
          }
        }
      }

      .van-cell {
        padding: 15px 0;
        font-size: 14px;

        .van-cell__title {
          font-weight: 500;
        }

        .van-cell__value {
          color: $labelColor1;

          .box {
            width: fit-content;
            margin-left: auto;
          }
        }
      }
    }

    .btnGroup {
      display: flex;
      justify-content: center;

      .nextStep {
        background: #FFCA00;
        border-radius: $radius;
        color: #fff;
        font-size: 16px;
        width: 80%;
        line-height: 44px;
        margin-top: 60px;
        margin-bottom: 60px;
      }
    }

    .van-button--disabled {
      background: linear-gradient(to right, #CACACA, #EEEEEE) !important;
    }
  }
}

</style>
