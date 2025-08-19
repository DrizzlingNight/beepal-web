<template>
  <div class="fg-dropdown">
    <div
      class="fg-dropdown__display"
      @click.stop="
        toggleShow()
        closeOtherDropdown()
      "
    >
      <div class="left">{{ currentItem && currentItem.name }}</div>
      <div v-if="dataListC.length > 1" class="right arrow-down">
        <slot name="displayText"></slot>
      </div>
    </div>
    <ul
      v-if="dataListC.length > 1"
      :class="{ open: isShow }"
      class="fg-dropdown__body"
    >
      <li
        v-for="(item, idx) in dataListC"
        :key="idx"
        :class="{ 'fg-dropdown-item__selected': curIdx === idx }"
        class="fg-dropdown-item"
        @click.stop="
          selectItem(item, idx)
          curIdx = idx
          closeShow()
        "
      >
        <span class="text">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Dropdown from './mixin/Dropdown.js'
import guid from '@/utils/guid.js'
import Storage from '@/utils/storage.js'

export default {
  name: 'Dropdown',
  components: {},
  mixins: [Dropdown],
  props: {
    // 下拉框名字，唯一
    NAME: {
      type: String,
      default: () => 'dropdown__' + guid(),
    },
    // 是否要默認選擇第一個
    isAutoSlectedFirstItem: {
      type: Boolean,
      default: true,
    },
    dataList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentItem: null,
      curIdx: 0,
    }
  },
  computed: {
    dataListC() {
      if (!this.dataList.length) {
        return []
      } else {
        return this.dataList.map(o => ({
          ...o,
          selected: false,
        }))
      }
    },
  },
  watch: {
    dataList: {
      immediate: true,
      handler(list) {
        // 只有isAutoSlectedFirstItem才需要
        if (list.length && this.isAutoSlectedFirstItem) {
          // 會默認選擇一次
          console.log('默認選擇一次...')
          const selectToken = Storage.getLocal('selectToken')
          this.selectItem(selectToken || this.dataListC[0])
        }
      },
    },
  },
  methods: {
    selectItem(item) {
      this.dataListC.forEach(o => (o.selected = false))
      item.selected = true
      this.currentItem = item
      this.curIdx = this.dataListC.findIndex(o => o.value === item.value)
      this.$emit('selectItem', item)
    },
  },
}
</script>

<style scoped lang="scss">
@import './Dropdown.scss';
</style>
