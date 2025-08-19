<template>
  <div class="jump-third-party">
    <div class="inner">
      <!-- <div class="tips" v-if="appList.length === 0">{{ loadingText }}</div> -->
      <div v-if="appList.length > 0" class="app-list">
        <div v-for="app in appList" :key="app.id" class="app-item" @click="open(app)">
          <img :src="app.background.replace('http://', 'https://')" :alt="app.name">
          <div>{{ app.nameArray[0] }}</div>
          <div>{{ app.nameArray[1] }}</div>
        </div>
      </div>
      <van-loading v-show="isLoading" size="50px" vertical
        style="
          position: absolute;
          left: 50%;
          top: 45%;
          transform: translate(-50%)
        "
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getThirdPartyList, thirdPartyLogin } from '@/api'
import { Loading } from 'vant'

export default {
  name: 'JumpThirdParty',
  components: {
    [Loading.name]: Loading,
  },
  data() {
    return {
      loadingText: '加载中...',
      appList: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo'])
  },
  created() {
    this.getThirdPartyList();
  },
  methods: {
    getThirdPartyList() {
      this.isLoading = true
      getThirdPartyList().then(res => {
        if (!res) {
          return;
        }
        // 2021.08.16 配合新API，資料放res.data裡
        res.data.results.forEach(item => { item.nameArray = item.name.split(/\b */) })
        this.appList = res.data.results;
        this.isLoading = false
      }).catch(err => {
        console.log('err', err)
        this.isLoading = false
        this.loadingText = '应用获取失败'
      })
    },
    open(thirdParty) {
      this.isLoading = true;
      thirdPartyLogin({ third_party: thirdParty.id }).then(res => {
        if (thirdParty.jump_url) {
          window.parent.postMessage({
            type: 'beex-jump-third-party', // 配合 jumpThirdPartyUtils.js
            url: thirdParty.jump_url + res.login_token
          }, '*')
        } else {
          window.parent.postMessage({
            type: 'beex-jump-third-party', // 配合 jumpThirdPartyUtils.js
            url: res.login_token
          }, '*')
        }
      }).catch(err => {
        console.log('err', err)
        this.isLoading = false;
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.jump-third-party{
  color: #fff;
  background-color: transparent;

  .inner{
    // height: 450px;
    padding-top: 20px;
  }

  .tips{
    padding-top: 180px;
    font-size: 7vw;
    font-weight: 600;
    text-align: center;
    color: #b9b8b8;
  }

  .app-list{
    height: 100%;
    display: grid;
    grid-template-columns: 33.3% 33.3% 33.3%;
    // grid-template-rows: 33.3% 33.3% 33.3%;

    .app-item{
      font-size: 5vw;
      text-align: center;
      margin: 0 8px;
      padding-bottom: 12px;
    }
    img{
      width: 70px;
      height: 70px;
    }
  }
}
</style>

<style lang="scss">
body, #app{
  background-color: transparent !important;
  overflow-y: hidden;
}
</style>
