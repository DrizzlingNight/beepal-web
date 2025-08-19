<template>
  <div class="pay-account-wrap">
    <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('my.payAccount.title_1') }}</div>
    </div>
    <div class="main-content">
      <template v-if="!isloading">
        <div
          v-for="item in VG__userChannel"
          :key="item.id"
          class="bank-item"
          @click="$router.push({name: 'thirdAccountInfo', params: item})"
        >
          <div class="bank-name">
            <svg-icon icon-class="bank" style="width: 2em; height: 2em"></svg-icon>
            <span>{{ item.bank_name }}</span>
          </div>
          <div class="card">{{ item.account_number }}</div>
        </div>
        <div v-if="VG__userChannel.length === 0" class="add-bank-account" @click="$router.push({name: 'thirdSetAccount'})">
          <div class="plus icon"></div>
          <span>{{ $t('my.payAccount.title_2') }}</span>
        </div>
      </template>

      <van-loading
        v-else
        color="#1989fa"
        style="position: fixed; left: 50%; top: 40%; transform: translate(-50%)"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Loading } from 'vant'

export default {
  name: "PayAccount",
  components: {
    [Loading.name]: Loading,
  },
  data() {
    return {
      isloading: true
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo', 'VG__userChannel'])
  },
  watch: {
    VG__userInfo: {
      immediate: true,
      async handler(val) {
        if (val) {
          await this.VA__getUserChannel()
          this.isloading = false
        }
      }
    }
  },
  methods: {
    ...mapActions('user', ['VA__getUserChannel']),
  }
}
</script>

<style lang="scss" scoped>
.pay-account-wrap{
  color: #fff;;
}
.add-bank-account{
  width: 90%;
  margin: 20px auto;
  background-color: #222;
  display: flex;
  align-items: center;
  padding: 20px 0;

  > span{
    margin-left: 20px;
    font-size: 18px;
  }

  &:active{
    background-color: lighten($color: #222, $amount: 4%);
  }
}
.bank-item{
  box-sizing: border-box;
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  background-color: #222;
  .bank-name{
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .svg-icon{
      margin-right: 14px;;
    }
  }
  .card{
    margin-left: calc(2em + 14px);
  }
}
.plus.icon {
  color: #000;
  position: relative;
  height: 40px;
  width: 40px;
  user-select: none;
  margin-left: 40px;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 4px;
    border-radius: 2px;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
  }
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 4px;
    border-radius: 2px;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%) rotate(90deg);
  }
}
</style>
