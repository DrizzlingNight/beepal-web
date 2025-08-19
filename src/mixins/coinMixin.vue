<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['G_singleCoin']),
    token() {
      return this.G_singleCoin(this.$route.params.token || (this.coin && this.coin.coin_code))
    },
  },
  watch: {
    token: {
      handler(newv, oldv) {
        if (newv.have !== false) {
          if (this.func && this.onLoad) {
            this.onLoad(this.func)
          }
        } else {
          if (this.$route.params.address) return
          this.$router.replace('/')
        }
      },
      immediate: true,
    },
  },
  async created() {
    // this.$myConsole.log('this.token', this.token)
    await this.AC_UPDATEWALLET() // 每次创建页面时更新余额
  },
  methods: {
    ...mapActions('BeePal', ['AC_UPDATEWALLET'])
  }
}
</script>
