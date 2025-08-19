export default {
  data() {
    return {
      [this.NAME + '_isShow']: false,
    }
  },
  computed: {
    isShow: {
      get() {
        return this[this.NAME + '_isShow']
      },
      set(v) {
        this[this.NAME + '_isShow'] = v
      },
    },
  },

  methods: {
    toggleShow() {
      this[this.NAME + '_isShow'] = !this[this.NAME + '_isShow']
    },
    closeShow() {
      this.isShow = false
      // this.$emit('closeModal') // 對多級的組件進行傳遞，主要是用在移動端的下拉框組合
    },
    closeOtherDropdown() {
      // 通過中央總線的方式發送當前的dropdown的名字
      this.$bus.emit('closeOtherDropdown', this.NAME)
      this.$bus.emit('closeMenuModal')
    },
  },
  mounted() {
    // 監聽點擊事件，如果點擊了頁面則關閉彈窗，但是如果點擊區域是下拉框區域則不關閉（點擊下拉框區域時有另外的邏輯，這個通過click.stop可以直接實現）
    document.addEventListener('click', e => {
      this.isShow && (this.isShow = false)
    })
    // 通過中央總線的方式監聽收到的dropdown的名字，如果不一樣那就關閉自己的dropdown
    this.$bus.on('closeOtherDropdown', name => {
      if (name !== this.NAME) {
        this.isShow && (this.isShow = false)
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off('closeOtherDropdown')
    this.$bus.$off('closeMenuModal')
  },
}
