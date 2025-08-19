export function download(picurl) {
  return new Promise((resolve, reject) => {
    var blob = new Blob([''], { type: 'application/octet-stream' })
    var url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.download = picurl.replace(/(.*\/)*([^.]+.*)/gi, '$2').split('?')[0]
    var e = document.createEvent('MouseEvents')
    a.href = picurl
    e.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    )
    a.dispatchEvent(e)
    URL.revokeObjectURL(url)
    resolve();
  })
}
