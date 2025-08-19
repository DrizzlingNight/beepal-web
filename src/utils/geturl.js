export function getQueryVariable(url) {
  var query = url.substring(url.indexOf('?'));
  return (query);
}

export function addUrlPara(url, name, value) {
  var currentUrl = url
  if (!value && value !== 0) return url
	if (/\?/g.test(currentUrl)) {
		if (/name=[-\w]{4,25}/g.test(currentUrl)) {
			currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
		} else {
			currentUrl += "&" + name + "=" + value;
		}
	} else {
		currentUrl += "?" + name + "=" + value;
  }
  return currentUrl
}
