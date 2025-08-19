import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from '@/lang/zh-CN'
import tw from '@/lang/zh-TW'
import en from '@/lang/en-US'
import ms from '@/lang/ms-MY'
import Storage from '@/utils/storage'

Vue.use(VueI18n)

const locale = Storage.getLocal('locale') || 'tw';

const i18n = new VueI18n({
  locale,
  messages: {
    cn,
    tw,
    en,
    ms,
  }
})

export default i18n
