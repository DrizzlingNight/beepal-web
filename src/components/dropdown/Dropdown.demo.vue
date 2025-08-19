<template>
  <div class="fg-demo fg-dropdown">
    <fg-dropdown :data-list="dataList" @selectItem="selectItem1"></fg-dropdown>
    {{ selectedItem1 }}
    <fg-dropdown :data-list="dataList" @selectItem="selectItem2"></fg-dropdown>
    {{ selectedItem2 }}
  </div>
</template>

<script>
import Dropdown from './Dropdown'

export default {
  name: 'DropdownDemo',
  components: {
    FgDropdown: Dropdown,
  },
  data() {
    return {
      selectedItem1: '',
      selectedItem2: '',
      dataList: [
        { name: 'USDT', value: 0 },
        { name: 'BTC', value: 1 },
        { name: 'ETH', value: 2 },
        { name: 'EOS', value: 3 },
      ],
    }
  },
  methods: {
    selectItem1(o) {
      this.selectedItem1 = o.name
    },
    selectItem2(o) {
      this.selectedItem2 = o.name
    },
  },
}
</script>
