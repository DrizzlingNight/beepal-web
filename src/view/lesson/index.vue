<template>
  <div class="trade">
    <my-head :title="$t('home.lesson')" goBackPath="/home" @onRefresh="onRefresh"></my-head>
    <keep-alive>
      <component
        ref="component"
        :is="component"
        v-bind="params.attrs"
        v-on="params.listeners"
      />
    </keep-alive>
  </div>
</template>

<script>
import myHead from './components/head'
import CardList from './components/cardList'
import { getLessonList } from '@/api'
import { Divider, Icon, Popover } from 'vant'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Trade',
  components: {
    myHead,
    CardList,
    [Popover.name]: Popover,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
  },
  data() {
    return {
      isMounted: false,
      state: {
        // 下拉刷新和上拉加载的状态
        loading: false,
        finished: false,
        refreshing: false,
      },
      lessonList: [], // 課程列表
      page: 1,
      page_size: 10, // 每列顯示單數
      count: 0, // 列表总数
      component: CardList, // 当前选区更改子组件
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    params() {
      switch (this.component.name) {
        case 'CardList':
          return {
            attrs: {
              state: this.state,
              'lesson-list': this.lessonList,
            },
            listeners: {
              onRefresh: this.onRefresh,
              onChange: this.onChange,
              onLoad: this.onLoad,
            },
          }
      }
    },
  },
  created() {
    this.onRefresh()
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    ...mapActions('BeePal', ['AC_ORDERLIST', 'AC_SELLORDERLIST', 'AC_INITORDERLIST']), // 暫時放著備用
    init() {
      this.lessonList = []
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
        // 加载状态结束
        this.state.loading = false
        // 数据全部加载完成
        if (this.lessonList.length >= this.count) {
          this.state.finished = true
        }
      })
    },
    async onLoad() {
      console.log('lesson index onLoad')
      // 如果是刷新觸發，就把數據清空，刷新狀態重置
      if (this.state.refreshing) {
        this.lessonList = []
        this.state.refreshing = false
      }

      const params = {
        page: this.page,
        page_size: this.page_size,
        ordering: '-created_time', // ordering表示排序方式   created_time是排序的字段   '-'号表示从大到小
      }
      await getLessonList(params).then(res => {
        // this.$myConsole.log('getLessonList res', res)
        if (res.code === 0) {
          this.lessonList.push(...res.data.results)
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
        console.log('getLessonList-err', err)
        this.init()
        this.end()
        this.$toast(this.$t('base.unknownErr'))
      })
    },
    beforeChange(index) {
      this.component = CardList
      return true
    },
  }
}
</script>
