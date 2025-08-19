export function boxScroll(scrollHeight) {
  // console.log(o.scrollTop, o.scrollHeight)
  this.$nextTick(() => {
    const controllers = document.documentElement
    controllers.scrollTop = scrollHeight || controllers.scrollHeight
  })
}
