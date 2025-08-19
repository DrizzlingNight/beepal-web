export const validateUsername = (rule, value, callback) => {
  if (!value || !value.length) {
    callback(new Error('请输入账号'))
  } else if (value.length < 3) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}
export const validatePassword = (rule, value, callback) => {
  if (value.length < 2) {
    callback(new Error('密码长度不少于6位'))
  } else {
    callback()
  }
}
export const validatePhone = (rule, value, callback) => {
  if (value.length < 11) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
export const validateEmail = (rule, value, callback) => {
  var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (!myreg.test(value)) {
    callback(new Error('请输入正确的email'))
  } else {
    callback()
  }
}
export const validateCode = (rule, value, callback) => {
  if (value.length < 1) {
    callback(new Error('请输入正确的邀请码'))
  } else {
    callback()
  }
}
