import Validator from '@/utils/validator.js'
export default {
  created() {
    if (this.data) {
      this.validator = Validator(this.rules, this.data)
    } else if (this.myDatas) {
      this.validator = Validator(this.rules, this.myDatas)
    }
  },
  methods: {
    /**
     * 清除验证提示
     * @param attrs
     */
    __resetField(attrs) {
      attrs = !attrs ? Object.keys(this.errorMsg) : Array.isArray(attrs) ? attrs : [attrs]
      attrs.forEach(attr => {
        this.errorMsg[attr] = ''
      })
    },
    /**
     * 验证方法
     * @param callback
     * @param data
     */
    __validate(callback, data) {
      this.validator.validate((errors, fields) => {
        this.__resetField()
        if (errors) {
          fields.forEach(item => {
            this.errorMsg[item.field] = item.message
          })
        }
        callback && callback(errors, fields)
      }, data)
    },
    /**
     * 验证结果
     * @return true 表示验证通过；false 表示验证不通过，还有错误
     */
    $__validate() {
      let hasErr = false
      this.__validate((errors, fields) => {
        hasErr = !errors
      })
      return hasErr
    },
  },
}
