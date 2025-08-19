<template>
  <div class="lesson-detail">
    <my-head :title="$t('lesson.lessonCatalog')" goBackPath="/lesson" @onRefresh="onRefresh"></my-head>
    <keep-alive>
      <component
        v-if="!isEmpty"
        ref="component"
        :is="component"
        v-bind="params.attrs"
        v-on="params.listeners"
      />
      <default-page v-else :status="1" />
    </keep-alive>
    <!-- 購買弹窗 -->
    <buy-modal
      v-if="buyModal.show"
      v-model="buyModal.show"
      :refer="lessonDetail"
      @toSecurityValidation="toSecurityValidation"
    />
    <!-- 安全驗證碼彈窗 -->
    <security-code-modal
      v-if="securityCodeModal.show"
      v-model="securityCodeModal.show"
      @securityCodeChange="securityCodeChange"
      @toPay="toPay"
    />
    <!-- 成功弹窗 -->
    <success-modal
      v-model="isSuccessModalShow"
      @closeSuccessModal="closeSuccessModal"
     />
  </div>
</template>

<script>
import myHead from '../components/head'
import SectionList from '../components/sectionList'
import BuyModal from '../components/buyModal'
import SecurityCodeModal from '../components/securityCodeModal'
import SuccessModal from '../components/successModal'
import Storage from '@/utils/storage.js'
import DefaultPage from '@/components/defaultPage'
import { getLessonDetail, getSectionList, buyLesson } from '@/api'
import { Divider, Icon, Popover } from 'vant'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Trade',
  components: {
    myHead,
    SectionList,
    BuyModal,
    SecurityCodeModal,
    SuccessModal,
    DefaultPage,
    [Popover.name]: Popover,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
  },
  data() {
    return {
      isMounted: false,
      isEmpty: false, // 課程是否為空
      state: {
        // 下拉刷新和上拉加载的状态
        loading: false,
        finished: false,
        refreshing: false,
      },
      urlParams: {}, // path裡帶的參數
      lessonDetail: {}, // 課程詳情
      sectionList: [], // 章節列表
      // 購買拉起彈窗
      buyModal: {
        show: false,
        refer: {},
      },
      // 安全驗證碼彈窗
      securityCodeModal: {
        show: false,
        securityCode: '',
      },
      isSuccessModalShow: false,
      page: 1,
      page_size: 10, // 每列顯示單數
      count: 0, // 列表总数
      component: SectionList, // 当前选区更改子组件
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    lessonId() {
      // console.log('this.$route.params.lessonId', this.$route.params.lessonId)
      return this.$route.params.lessonId || Storage.getSession('lessonId')
    },
    params() {
      switch (this.component.name) {
        case 'SectionList':
          return {
            attrs: {
              state: this.state,
              'lesson-detail': this.lessonDetail,
              'section-list': this.sectionList,
              'is-bought': this.lessonDetail.is_bought,
              'is-buy-button-show': this.lessonDetail.id ? !this.lessonDetail.is_bought : false,
            },
            listeners: {
              onRefresh: this.onRefresh,
              onChange: this.onChange,
              onLoad: this.onLoad,
              sectionListChange: this.sectionListChange,
              buyConfirm: this.buyConfirm,
            },
          }
      }
    },
  },
  watch: {
    // 'buyModal.show'(newV, oldV) {
    //   if (newV === false) {
    //     setTimeout(() => {
    //       Object.assign(this.$data.buyModal, this.$options.data().buyModal)
    //     }, 290)
    //   }
    // },
  },
  created() {
    // this.$myConsole.log('window.location.href', window.location.href)
    this.urlParams = this.urlParamsHandler(window.location.href.split('?')) // 把url帶的參數做處理
    // this.$myConsole.log('urlParams', this.urlParams)

    this.onRefresh()
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    ...mapActions('BeePal', ['AC_ORDERLIST', 'AC_SELLORDERLIST', 'AC_INITORDERLIST']), // 暫時放著備用
    init() {
      this.sectionList = []
      this.count = 0
      this.page = 1
    },
    onRefresh() {
      // 清空列表数据
      this.state.finished = false
      this.state.refreshing = true
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.page = 1
      this.state.loading = true
      this.onLoad()
    },
    onChange() {
      this.state.refreshing = true
      this.onRefresh()
    },
    end() {
      setTimeout(() => {
        if (!this.sectionList[0]) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        // 加载状态结束
        this.state.loading = false
        // 数据全部加载完成
        if (this.sectionList.length >= this.count) {
          this.state.finished = true
        }
      })
    },
    async onLoad() {
      console.log('lessonDetail onLoad')
      this.getLessonDetail(this.urlParams.lessonId || this.lessonId) // 先取得課程詳情資訊
      Storage.setSession('lessonId', this.urlParams.lessonId || this.lessonId) // 把課程id存到session Storage

      // 如果是刷新觸發，就把數據清空，刷新狀態重置
      if (this.state.refreshing) {
        this.sectionList = []
        this.state.refreshing = false
      }

      const params = {
        subject: this.urlParams.lessonId || this.lessonId,
        page: this.page,
        page_size: this.page_size,
        ordering: '-created_time', // ordering表示排序方式   created_time是排序的字段   '-'号表示从大到小
      }
      await getSectionList(params).then(res => {
        // this.$myConsole.log('getLessonList res', res)
        if (res.code === 0) {
          this.sectionList.push(...res.data.results)
          this.count = res.data.count
          this.page = this.page + 1
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.init()
          this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.init()
          this.$toast(this.$t('base.unknownErr'))
        }
        this.end()
      }).catch(err => {
        console.log('getSectionList-err', err)
        this.init()
        this.end()
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    // url參數處理
    urlParamsHandler(params) {
      if (params[1]) {
        params = params[1].split('&')
        const lessonId = params[0].split('=')
        const result = {
          lessonId: Number(lessonId[1])
        }
        return result
      } else {
        const result = {
          lessonId: ''
        }
        return result
      }
    },
    async getLessonDetail(id) {
      await getLessonDetail(id).then(res => {
        if (res.code === 0) {
          this.lessonDetail = { ...res.data }
        } else {
          this.$toast(this.$t('base.unknownErr'))
          setTimeout(() => {
            this.$router.push('/lesson')
          })
        }
      }).catch(err => {
        console.log('getLessonDetail-err', err)
        this.$toast(this.$t('base.unknownErr'))
        setTimeout(() => {
          this.$router.push('/lesson')
        })
      })
    },
    sectionListChange(list) {
      this.sectionList = [...list]
    },
    buyConfirm() {
      // console.log('buyConfirm')
      this.buyModal.refer = { ...this.lessonDetail }
      // this.$myConsole.log('this.buyModal.refer', this.buyModal.refer)
      this.buyModal.show = true
    },
    securityCodeChange(code) {
      // console.log('securityCodeChange', code)
      this.securityCodeModal.securityCode = code
    },
    toSecurityValidation() {
      this.buyModal.show = false
      this.securityCodeModal.show = true
    },
    async toPay() {
      // console.log('toPay')
      const params = {
        id: this.lessonDetail.id,
        security_code: this.securityCodeModal.securityCode,
      }
      buyLesson(params).then(res => {
        if (res.code === 0) {
          this.securityCodeModal.show = false
          this.isSuccessModalShow = true
        } else if (this.$t(`errorCode.${res.code}`)) {
          this.securityCodeModal.show = false
          this.$toast(this.$t(`errorCode.${res.code}`))
        } else {
          this.securityCodeModal.show = false
          this.$toast(this.$t('base.unknownErr'))
        }
      }).catch(err => {
        console.log('buyLesson-err', err)
        this.securityCodeModal.show = false
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    closeSuccessModal() {
      this.isSuccessModalShow = false
      this.onRefresh()
    },
    beforeChange(index) {
      this.component = SectionList
      return true
    },
  }
}
</script>
