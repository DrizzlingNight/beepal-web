const autoprefixer = require('autoprefixer')
const pxtoviewport = require('postcss-px-to-viewport')
const port = process.env.port || process.env.npm_config_port || 8888 // dev port

const path = require('path')

function resolve(dir) {
  // 路径可能与你的项目不同
  return path.join(__dirname, dir)
}

module.exports = {
  // lintOnSave: false,
  publicPath: '/',
  devServer: {
    disableHostCheck: true,
    https: true,
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://127.0.0.1:${port}/mock`,
        // target: `https://holiday-uat.marbleio.tech`,
        // target: `http://www.beex.vip/api`,
        // target: `https://pay.admin888.me/`,
        // target: 'http://dic-holiday-prod.ap-northeast-1.elasticbeanstalk.com',
        // target: 'https://api.dicex.one',
        // target: `https://holiday-uat.marbleio.tech`,
        // target: `http://holiday-uat1.ap-northeast-1.elasticbeanstalk.com`,
        // target: `http://tpay-backend-prod.eba-5gtp7uer.ap-northeast-1.elasticbeanstalk.com/`, tpay后台
        // target: `http://192.168.50.90:8000`,
        // target: `https://beexuat.marbleio.tech/`,
        target: `http://beepal-dev-api-2.ap-northeast-1.elasticbeanstalk.com/`, // 最新的beepal接口
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
      '/okexApi': {
        // target: `http://127.0.0.1:${port}/mock`,
        target: `https://www.okex.me/v2/futures/pc/market/marketOverview.do`,
        // target: `http://192.168.1.171:8000/`,
        changeOrigin: true,
        pathRewrite: {
          '^/okexApi': '',
        },
      },
      '/huobidf': {
        // target: `http://127.0.0.1:${port}/mock`,
        target: `https://api.huobi.pro/market/detail`,
        // target: `http://192.168.1.171:8000/`,
        changeOrigin: true,
        pathRewrite: {
          '^/huobidf': '',
        },
      },
      '/bole': {
        target: `http://192.168.1.174:8000/`,
        // target: `http://192.168.1.171:8000/`,
        changeOrigin: true,
        pathRewrite: {
          '^/bole': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375,
          }),
        ],
      },
    },
  },
  chainWebpack: config => {
    config.module.rule('svg').uses.clear()
    config.module
      .rule('svg1')
      .test(/\.svg$/)
      .use('svg-sprite')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
      .include.add(resolve('src/svg'))
      .end()
  },
}
