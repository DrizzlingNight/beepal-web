import Storage from '@/utils/storage'
import { settings } from '@/config'

/**
 *  appThemeList[key], key 值对应 third_party api 获取数据中应用对象的 app_id
 */
const appThemeList = {
  beex: {
    bgColor: '#111',
    btnColor: '#FFCA00',
    active_label: '#fff',
    inactive_label: '#F9F9F9',
    logo: require('@/assets/img/logo_beex.png'),
    bgImg: '',
    goBack: true,
  },
  igksg: {
    bgColor: '#1A1C34',
    btnColor: '#E85A2B',
    active_label: '#fff',
    inactive_label: '#F9F9F9',
    logo: require('@/assets/img/logo_igk.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: true,
  },
  BAAXVIDEO: {
    bgColor: '#333',
    btnColor: '#1ABC9B',
    active_label: '#fff',
    inactive_label: '#F9F9F9',
    logo: '',
    bgImg: '',
    textColor: '#fff',
    goBack: true,
  },
  baaxplanet: {
    bgColor: '#333',
    btnColor: '#1ABC9B',
    active_label: '#fff',
    inactive_label: '#F9F9F9',
    logo: require('@/assets/img/logo_BAAX.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: true,
  },
  baaxbet: {
    bgColor: '#111',
    btnColor: '#FFCA00',
    active_label: '#fff',
    inactive_label: '#F9F9F9',
    logo: require('@/assets/img/logo_BAAXBET.png'),
    bgImg: require('@/assets/img/bg_BAAXBET.png'),
    goBack: true,
  },
  bapbet: {
    bgColor: '#1A1C34',
    btnColor: '#7B4CF6',
    active_label: '#fff',
    inactive_label: '#F9F9F9',
    logo: require('@/assets/img/logo_bapbet.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: true,
  },
  jimusg: {
    bgColor: '#fff',
    btnColor: '#3472FF',
    active_label: '#3472FF',
    inactive_label: '#000000',
    logo: require('@/assets/img/logo_jimu.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: true,
  },
  dgc: {
    bgColor: '#fff',
    btnColor: '#1B88FF',
    btnlinear: 'linear-gradient(to right,#05A7FF,#0C5CF7)',
    active_label: '#1B88FF',
    inactive_label: 'rgb(127,127,127)',
    logo: require('@/assets/img/logo_dgc.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: false,
  },
  gd: {
    bgColor: '#fff',
    btnColor: '#20DDC1',
    btnlinear: 'linear-gradient(to right,#04F2CF,#00A0A1)',
    active_label: '#20DDC1',
    inactive_label: 'rgb(127,127,127)',
    logo: require('@/assets/img/logo_gd.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: false,
  },
  BeePal: {
    bgColor: '#fff',
    btnColor: '#FFC100',
    btnlinear: 'linear-gradient(to right,#FFBC00,#FFD92A)',
    active_label: '#FFC100',
    inactive_label: 'rgb(123,123,123)',
    logo: require('@/assets/img/logo_BeePal.png'),
    bgImg: '',
    textColor: '#fff',
    goBack: false,
    compony: 'beePal.compony',
    tip: 'beePal.tip',
    userAgreement: true
  },
}

export default {
  data() {
    return {
      currentTheme:
        this.$route.params.theme ||
        this.$route.query.urlname ||
        Storage.getLocal('current_theme'),
    }
  },
  computed: {
    appTheme() {
      return this.currentTheme
        ? appThemeList[this.currentTheme]
        : appThemeList[settings.MAIN_THEME]
    },
  },
}
