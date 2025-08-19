import axios from 'axios'
// import getDomValue from './xmlHandler'

const baseUrl = 'https://kryptocoin.space/'
const api = {
  url: '',
  method: 'post',
  params: {},
  timeout: 10000,
  cancel: true
}

const signature = '1d03274710'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000 // timeout 時間暫定為10秒
})

/**
 * item參數
 * @param {string} url  要縮短的網址
 * @param {string} title  短網址標題
 * @param {string} description  短網址描述
 * @param {string} image  短網址圖片（絕對路徑）
 */
async function getShortUrl(item) {
  const { url, method, params, timeout, cancel } = api

  const form_data = new FormData();

  const data = {
    url: item.url,
    signature: signature,
    action: 'shorturl',
    title: item.title,
    description: item.description,
    image: item.image,
    format: 'json',
  }

  for (const key in data) {
      form_data.append(key, data[key]);
  }

  return new Promise((resolve, reject) => {
      axiosInstance(
        {
          url,
          method,
          data: form_data,
          params,
          timeout,
          cancel
        }
      ).then(res => {
        // 回應是XML格式時用的
        // const shortUrl = getDomValue(res.data, 'shorturl')
        // resolve(shortUrl)
        const result = res.data.shorturl
        resolve(result)
      }).catch(err => {
        console.log(err)
      })
  })
}

export { getShortUrl }
