<template>
  <div class="third-withdraw-check">
    <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">提币</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
        icon-class="livechat"
        class-name="livechat" @click.stop="handleRouter('livechat')">
        </svg-icon>
      </div>
    </div>

    <div class="main-content" style="padding-left: 20px; padding-right: 20px;">
      <withdraw />
    </div>
  </div>
</template>

<script>
import { settings } from '@/config'
import Withdraw from './Withdraw'

export default {
  name: "ThirdWithdraw",
  components: {
    Withdraw
  },
  data() {
    return {
      livechat: settings.customerService,
    }
  }
}
</script>
