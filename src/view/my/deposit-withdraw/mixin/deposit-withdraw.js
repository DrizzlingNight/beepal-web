import FgDropdown from '@/components/dropdown/Dropdown'
import { mapGetters } from 'vuex'
import Storage from '@/utils/storage.js'

export default {
  name: 'Deosit',
  components: {
    FgDropdown,
  },
  data() {
    return {
      // curBtnIdx: 0,
      // btnList: [
      //   { name: 'ERC20', value: 0 },
      //   { name: 'TRC20', value: 1 },
      //   { name: 'OMNI', value: 2 },
      // ],
      selectedToken: {}, // 是balances里面的一个对象
    }
  },
  computed: {
    ...mapGetters(['VG__crypto_coinList']),
    SupportedCoinList() {
      return this.VG__crypto_coinList
    },
  },
  mounted() {
    const selectToken = Storage.getLocal('selectToken')
    console.log('selectToken', selectToken)
    this.selectedToken = selectToken || this.SupportedCoinList[0]
  },
  methods: {
    selectToken(o) {
      this.selectedToken = o
      console.log('selectedToken:', o)
    },
  },
}
