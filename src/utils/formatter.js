export function positiveNumberFormatter(value) {
  if (value < 0) {
    return -value
  } else {
    if (value.toString().indexOf('.') === value.toString().length - 1) {
      return value
    } else {
      return Number(value)
    }
  }
}

export function positiveIntegerNumberFormatter(value) {
  if (value < 0) {
    return -value
  } else {
    if (value.toString().indexOf('.') === value.toString().length - 1) {
      return parseInt(value) || ''
    } else {
      return Number(value)
    }
  }
}
