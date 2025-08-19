<template>
  <div class="security-password">
    <my-head :title="$t('setPassword.setSecurityPassword')"></my-head>

    <div class="main-content">
      <van-cell-group class="input__wrap">
        <!-- 2021.10.12 後端要求先把確認舊密碼欄位拿掉 -->
        <van-field
          v-if="isOldPassswordShow"
          :label="$t('setPassword.old_password')"
          v-model.trim="data.old_password"
          :error-message="errorMsg.old_password"
          :placeholder="$t('setPassword.placeholder_1')"
          :formatter="value => positiveIntegerNumberFormatter(value)"
          type="number"
        />
        <van-field
          :label="$t('setPassword.new_password')"
          v-model.trim="data.new_password"
          :error-message="errorMsg.new_password"
          :placeholder="$t('setPassword.placeholder_2')"
          :formatter="value => positiveIntegerNumberFormatter(value)"
          type="number"
        />
        <van-field
          :label="$t('setPassword.confirm_password')"
          v-model.trim="data.confirm_password"
          :error-message="errorMsg.confirm_password"
          :placeholder="$t('setPassword.placeholder_3')"
          :formatter="value => positiveIntegerNumberFormatter(value)"
          type="number"
        />
      </van-cell-group>

      <div class="flex row-h-c">
        <button class="confirm-btn line-btn" @click="onSetPassword">
          {{ isOldPassswordShow ? $t('setPassword.button_1') : $t('base.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { setSecurityPassword } from '@/api'
  import { CellGroup, Field, Loading } from 'vant'
  import FormValidatorMixin from '@/mixins/form-validator'
  import { mapGetters, mapActions } from 'vuex'
  import myHead from '@/components/head/Normal_head'
  import { positiveIntegerNumberFormatter } from '@/utils/formatter'

  export default {
    name: 'SecurityPassword',
    components: {
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Loading.name]: Loading,
      myHead,
    },
    mixins: [FormValidatorMixin],
    data() {
      return {
        positiveIntegerNumberFormatter,
        data: {
          old_password: '',
          new_password: '',
          confirm_password: '',
        },
        errorMsg: {
          old_password: '',
          new_password: '',
          confirm_password: '',
        },
        rules: {
          // 2021.10.12 後端要求先把確認舊密碼欄位拿掉
          old_password: [
            {
              validator: (rule, value, callback) => {
                if (!this.isOldPassswordShow) {
                  callback()
                } else if (!value) {
                  callback(this.$t('setPassword.rule_1'))
                } else if (value.length < 6 || value.length > 14) {
                  callback(this.$t('setPassword.rule_2'))
                } else {
                  callback()
                }
              },
            },
          ],
          new_password: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(this.$t('setPassword.rule_1'))
                } else if (value.length < 6 || value.length > 14) {
                  callback(this.$t('setPassword.rule_2'))
                } else {
                  callback()
                }
              },
            },
          ],
          confirm_password: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(this.$t('setPassword.rule_1'))
                } else if (value !== this.data.new_password) {
                  callback(this.$t('setPassword.rule_3'))
                } else {
                  callback()
                }
              },
            },
          ],
        },
      }
    },
    computed: {
    ...mapGetters(['VG__userInfo']),
    isOldPassswordShow() {
      return this.VG__userInfo.isset_security_code
    }
    },
    mounted() {
      this.VA__updateUserInfo()
      // this.$myConsole.log('VG__userInfo', this.VG__userInfo)
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo']),
      onSetPassword() {
        if (this.$__validate()) {
          this.$toast.loading({ forbidClick: true, duration: 0 })

          const params = {
            id: this.VG__userInfo.id,
            security_code: this.data.new_password,
          }

          if (this.isOldPassswordShow) {
            params.old_security_code = this.data.old_password
          }

          setSecurityPassword(params)
            .then(res => {
              if (res.code === 0) {
                this.data.old_password = ''
                this.data.new_password = ''
                this.data.confirm_password = ''

                const vm = this
                this.$toast({
                  message: this.$t('tip.setSuccess'),
                  duration: 1 * 1000,
                  onClose() {
                    vm.$router.push({ path: '/my' })
                  },
                })
              } else if (this.$t(`errorCode.${res.code}`)) {
                this.$toast(this.$t(`errorCode.${res.code}`))
              } else {
                this.$toast(this.$t('tip.setFail'))
              }
            })
            .catch(err => {
              this.$toast(this.$t('tip.setFail'))
              console.error(err)
            })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/variable.scss';

  .input__wrap {
    margin: 10px 0 20px;
    padding: 0 20px;
  }

  .confirm-btn {
    background-color: $cardBgColor;
    font-size: 16px;
    border: none;
    width: 300px;
    color: $cardColor;
    border-radius: 6px;

    &:active {
      background-color: lighten(#ffc100, 10%);
    }
  }

  ::v-deep .van-cell-group {
    background-color: $pageBgColor;
  }

  ::v-deep .van-cell {
    // line-height: 8vw;
    padding: 15px;
    background-color: $pageBgColor;
    font-weight: bold;
    color: $Color;
    border-bottom: 1px solid $BorderColor;

    &:last-child {
      border: none;
    }
  }

  ::v-deep .van-field__label {
    width: 23vw;
    margin-right: 15px;
  }

  // ::v-deep .van-field__control {
  //   color: #fff;
  // }
  ::v-deep .van-cell:not(:last-child)::after {
    display: none;
  }

  ::v-deep [class*='van-hairline']::after {
    border: none;
  }
</style>
