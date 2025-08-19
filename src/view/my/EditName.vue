<template>
  <div class="edit">
    <page-head>
      <template v-slot:left>
        <span class="ft14 cancel" @click="$router.back(-1)">
          {{ $t('tip.cancel') }}
        </span>
      </template>
      <template v-slot:title>{{ $t('my.editInfo.editNickName') }}</template>
      <template v-slot:right>
        <span class="ft14 complete" @click="complete">
          {{ $t('tip.complete') }}
        </span>
      </template>
    </page-head>
    <div class="main-content">
      <div class="mt15">
        <van-field v-model="value" :placeholder="$t('my.editInfo.placeholder_1')" :clearable="true" :autofocus="true"
                   :autosize="true" show-word-limit maxlength="10"/>
      </div>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/index'
  import { Field } from 'vant'
  import { mapActions, mapGetters } from 'vuex'
  import { setNickName } from '@/api/dgc/assets'

  export default {
    name: 'EditName',
    components: {
      pageHead,
      [Field.name]: Field,
    },
    data() {
      return {
        value: '',
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
    },
    watch: {
      VG__userInfo: {
        handler(newV, oldV) {
          this.value = newV.nickname
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo']),
      complete() {
        console.log('设置昵称进行中')
        const data = {
          id: this.VG__userInfo.id,
          nickname: this.value,
        }
        setNickName(data).then(res => {
          this.VA__updateUserInfo()
          console.log('设置昵称已完成', data)
          this.$toast(this.$t('tip.setSuccess'))
          setTimeout(() => {
            this.$router.push('/editInfo')
          }, 1000)
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .cancel {
    color: $labelColor4;
    white-space: nowrap;
    margin-left: 15px;
  }

  .complete {
    color: $yellow;
    white-space: nowrap;
    margin-right: 15px;
  }
</style>
