<template>
  <!-- 由於vant本身沒辦法支援「下拉選單+輸入框」，所以用原生html硬刻 -->
  <!-- van-field 手機輸入 Start-->
  <div :class="`${requiredClass} ${borderClass}`" class="van-cell van-field">
    <div v-if="label" class="van-cell__title van-field__label">
      <span>{{ label }}</span>
    </div>
    <div :class="label ? '' :'van-cell__value--alone'" class="van-cell__value van-field__value">
      <div class="van-field__body">
        <select v-model.trim="data.countryCode" :class="className">
          <option v-for="(item, index) in countryCodeOption" :key="index" :value="item.value">
            {{ `${item.text} ${item.country}` }}
          </option>
        </select>
        <input v-model.trim="data.phone" :placeholder="placeholder" type="text" oninput="value=value.replace(/[^\d]/g,'')" class="van-field__control">
      </div>
      <div v-show="errorMsg" class="van-field__error-message">{{ errorMsg }}</div>
    </div>
  </div>
  <!-- van-field 手機輸入 End-->
</template>

<script>

export default {
  props: {
    // 動態綁定父元件的data
    data: {
      type: Object,
      require: true,
      default: function() {
        return { countryCode: '+86' }
      }
    },
    countryCodeOption: {
      type: Array,
      require: false,
      default: function() {
        return [
          { text: '+886', country: this.$t('country.taiwan'), value: "886" },
          { text: '+852', country: this.$t('country.hongKong'), value: "852" },
          // { text: '+86', country: this.$t('country.china'), value: "86" }, // 2021.12.08 因應營運需求,BeePal移除關於大陸的相關顯示
        ]
      }
    },
    required: {
      type: Boolean,
      require: false,
      default: true
    },
    border: {
      type: Boolean,
      require: false,
      default: true
    },
    placeholder: {
      type: String,
      require: false,
      default: ''
    },
    // 如果沒有傳入值就不會顯示
    label: {
      type: String,
      require: false,
      default: null
    },
    // 客製化input框的CSS，填入class名稱
    className: {
      type: String,
      require: false,
      default: 'countryCode'
    },
    // 錯誤訊息
    errorMsg: {
      type: String,
      require: false,
      default: ''
    },
  },
  data() {
    return {
    }
  },
  computed: {
    requiredClass() {
      return this.required ? 'van-cell--required' : ''
    },
    borderClass() {
      return this.border ? '' : 'van-cell--borderless'
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
