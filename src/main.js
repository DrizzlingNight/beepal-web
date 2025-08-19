import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import '@/styles/index.less'
import '@/styles/index.scss'
import * as filters from './filters'
import echarts from 'echarts'
import i18n from './lang/i18n'
import VueBus from './utils/bus'
import QRReader from '@/utils/scan/qrscan'
import myConsole from '@/utils/console'
import Storage from '@/utils/storage'
import { sleep } from '@/utils/customMethod'
import VueWorker from 'vue-worker'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.prototype.qrReader = QRReader;
Vue.prototype.$myConsole = myConsole;
Vue.prototype.$Storage = Storage;
Vue.prototype.$sleep = sleep;
Vue.use(VueBus)

Vue.use(VueWorker)
Vue.use(VueQrcodeReader)

import { Toast, Dialog, Notify } from 'vant'

Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Notify)

import './svg'

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  echarts,
  i18n,
  render: h => h(App),
})
