<script>
import Storage from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'Notices',
  data() {
    return {
      haveBadge: false
    }
  },
  computed: {
    ...mapState('tpay', ['notices']),
  },
  watch: {
    notices: {
      handler(newv, oldv) {
        if (newv.length > 0) {
          const date = Storage.getLocal('tpay_notices_read_date');
          const flag = this.notices.some(item => {
            const temp_date = new Date(item.date)
            if (date < temp_date) {
              return true
            }
          })
          this.haveBadge = flag
        }
      },
      immediate: true,
      deep: true
    }
  },
}
</script>
