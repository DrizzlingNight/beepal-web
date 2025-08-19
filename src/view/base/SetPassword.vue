<template>
  <div class="set-password">
    <!-- <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('setPassword.title') }}</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
          icon-class="livechat"
          class-name="livechat"
          @click.stop="handleRouter('livechat')"
        >
        </svg-icon>
      </div>
    </div> -->
    <my-head :title="$t('setPassword.title')"></my-head>

    <div class="main-content">
      <van-cell-group class="input__wrap">
        <van-field
          :label="$t('setPassword.old_password')"
          v-model.trim="data.old_password"
          :error-message="errorMsg.old_password"
          :placeholder="$t('setPassword.placeholder_1')"
        />
        <van-field
          :label="$t('setPassword.new_password')"
          v-model.trim="data.new_password"
          :error-message="errorMsg.new_password"
          :placeholder="$t('setPassword.placeholder_2')"
        />
        <van-field
          :label="$t('setPassword.confirm_password')"
          v-model.trim="data.confirm_password"
          :error-message="errorMsg.confirm_password"
          :placeholder="$t('setPassword.placeholder_3')"
        />
      </van-cell-group>

      <div class="flex row-h-c">
        <button class="confirm-btn line-btn" @click="onSetPassword">
          {{ $t('setPassword.button_1') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { setPassword } from '@/api'
  import { CellGroup, Field, Loading } from 'vant'
  import FormValidatorMixin from '@/mixins/form-validator'
  import { mapActions } from 'vuex'
  import { settings } from '@/config'
  import myHead from '@/components/head/Normal_head'

  export default {
    name: 'SetPassword',
    components: {
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Loading.name]: Loading,
      myHead,
    },
    mixins: [FormValidatorMixin],
    data() {
      return {
        livechat: settings.customerService,
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
          old_password: [
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
    methods: {
      ...mapActions('user', ['VA__logout']),
      onSetPassword() {
        if (this.$__validate()) {
          this.$toast.loading({ forbidClick: true, duration: 0 })

          setPassword({
            old_password: this.data.old_password,
            new_password: this.data.new_password,
          })
            .then(() => {
              this.data.old_password = ''
              this.data.new_password = ''
              this.data.confirm_password = ''

              const vm = this
              this.$toast({
                message: this.$t('setPassword.toast_1'),
                duration: 3 * 1000,
                onClose() {
                  vm.$router.push({ name: 'login' })
                  vm.VA__logout(false)
                },
              })
            })
            .catch(err => {
              this.$toast(this.$t('setPassword.toast_2'))
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
