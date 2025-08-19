<template>
  <div class="createOffer">
    <router-view />
  </div>
</template>

<script>
// import config from '../config'
// import { settings } from '@/config'
import { Row, Col, Button, Cell, Checkbox, Circle, Loading, Overlay, ActionSheet, Icon } from 'vant'
import { mapGetters } from 'vuex'
// import Storage from '@/utils/storage'

export default {
  name: 'CreateOffer',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Circle.name]: Circle,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
  },
  data() {
    return {
       // ---初始化資料
      initDatas: {
        orderNumber: '',
        coin: 0,
        type: this.$route.params.type || 0,
        method: 0,
        bank: '',
        bankNumber: '',
        currency: null,
        rate: 0,
        fixedPrice: '',
        marketPrice: '',
        minLimit: '',
        maxLimit: '',
        timeLimit: '',
        needAdvanceAuth: false,
        count: '',
        newUserLimit: '',
      },
      // ---初始化資料
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    step() {
      return this.$route.params.step || 1
    },
  },
  watch: {
  },
  created() {
    if (this.VG__userInfo.certification_level !== 2) {
      this.$dialog
        .confirm({
          message: this.$t('beePal.trade.needAdvancedAuth'),
          className: 'dialog',
          confirmButtonText: this.$t('base.goKyc'),
          cancelButtonText: this.$t('base.cancel'),
        })
        .then(() => {
          this.$router.push('/my/kyc')
        })
        .catch(() => {
          this.$router.push('/home')
          window.location.reload()
        })
    } else {
      const createOfferDatas = this.$Storage.getSession('createOfferDatas')
      if (createOfferDatas && !createOfferDatas.isEditMode) {
        this.$Storage.setSession('createOfferDatas', null)
      }
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';

.createOffer {
  height: 100%;
}

</style>
