
/**
 * item參數
 * @param {string} text  XML Text
 * @param {string} tag  要獲取value的Dom tag
 */
function getDomValue(text, tag) {
  const xmlDoc = xmlParser(text)
  const shortUrl = xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
  return shortUrl
}

function xmlParser(text) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml")
  return xmlDoc
}

export { getDomValue }
