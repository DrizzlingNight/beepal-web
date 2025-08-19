function fnResize() {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth // 浏览器宽度

  if (deviceWidth <= 640) {
    var fontsize = (deviceWidth / 6) + 'px'
    document.getElementsByTagName('html')[0].style.fontSize = fontsize
  } else {
    document.getElementsByTagName('html')[0].style.fontSize = '100px'
  }
}

fnResize()

window.onresize = function() {
  fnResize()
}

