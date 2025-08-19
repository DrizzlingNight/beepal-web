function log(...datas) {
  printLogMessage(datas, 'log')
}
function info(...datas) {
  printLogMessage(datas, 'info')
}
function warn(...datas) {
  printLogMessage(datas, 'warn')
}
function error(...datas) {
  printLogMessage(datas, 'error')
}

function printLogMessage(datas, logType) {
  const result = []
  for (let i = 0; i < datas.length; i++) {
    if (typeof datas[i] === 'object') {
      result.push(JSON.parse(JSON.stringify(datas[i])))
    } else {
      result.push(datas[i])
    }
  }
  if (result) console[logType](...result)
}

export default { log, info, warn, error };
