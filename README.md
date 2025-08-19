## Beex 项目 （BeePal内容）

#### 1、settings配置

|    settings     |                         作用                          |                             子项                             |
| :-------------: | :---------------------------------------------------: | :----------------------------------------------------------: |
|   MAIN_THEME    |  当前项目主题，控制scss颜色配置 项目名称以及项目图标  |                              /                               |
|  defaultRouter  |       当前默认路由，控制登录后进入的第一个页面        |                              /                               |
|    GETWALLET    |         获取用户钱包，登录后立刻获取用户钱包          |                              /                               |
|      lang       |                 打开与关闭某国多语言                  |               ch  中文    en  英文    tw  繁体               |
|   BOTTOM_NAV    |                   底部导航栏的开关                    | MARKET_SHOW 市场<br /> FIND_SHOW 发现频道<br /> PROPERTY_SHOW 资产<br /> MY_SHOW 我的<br /> CHAT_SHOW 聊天<br /> DEAL_SHOW 交易<br /> BUY_SHOW tpay首页<br />BeePal_HOME_SHOW BeePal首页<br />BeePal_DEAL_SHOW BeePal交易页面 |
|     MY_PAGE     |         控制我的页面导航单个按钮的开启与关闭          | IS_WALLET 资产<br /> IS_IDENTITY 身份认证<br /> IS_BIND 绑定账户<br /> IS_INVITE 我的邀请码<br /> IS_NOTICE 公告管理<br /> IS_LANG 语言管理<br /> IS_MODIFY_PWD 修改密码<br /> IS_DOWNLOAD 下载<br />APP IS_HELP 帮助<br /> IS_ABOUT 关于我们 |
|   spot_deals    | 是否路由在进入BeePal_Deal页面时打开轮询订单加入Vuex中 |                              /                               |
|    mainCoin     |    mainCoinSymbol对应的虚拟币（USD => TRON_USDT）     |                              /                               |
| mainCoinSymbol  |               主要法币币种（默认“USD”）               |                              /                               |
|    thirdPart    |                发现频道第三方接口开关                 |                              /                               |
|     showID      |             控制我的邀请码页面是否显示ID              |                              /                               |
|    needLogin    |           控制是否需要登录才能执行内部操作            |                              /                               |
|   invitation    |                控制注册是否需要邀请码                 |                              /                               |
| registerRequire |                 控制注册字段哪些必填                  | username 用户名<br /> password 密码<br /> password_confirm 确认密码<br /> phone 电话<br /> email 邮箱 |

#### 2、项目目录

- src
  - api    接口位置
  - assets   资源位置
  - components   共用组件位置
  - config    settings配置文件目录
  - filters    过滤器
  - lang    多语言（vue-i18n）
  - layout    基础布局位置（通常在vue-router里面用到）
  - mixins    页面混入
  - router   路由位置（vue-router）
  - store    仓库位置（vuex）
  - styles    SCSS/CSS存放位置
  - svg    图标
  - utils    工具包
  - view    视图位置
  - APP.vue    入口文件
  - main.js    VUE全局配置及挂载
- vue.config.js    内置Webpack配置和项目配置
- package.json    插件以及依赖
- babel.config.js    babel转换插件配置

#### 3、BeePal的内容



<u>**src/mixins/BeePalApp.vue**</u>     BeePal的入口混入，在App.vue里面混入（mixins官方文档  https://v3.vuejs.org/guide/mixins.html#basics）

BeePalApp入口主要功能（登陆后及刷新页面后第一时间调用的功能）

```
VG__userInfo(val, oldVal) {
  if (val && val.id !== (oldVal && oldVal.id)) {
    this.AC_UPDATEWALLET() // 获取beePal钱包（余额）的接口
    this.getCoinRate() // 获取币种汇率
    this.getOnProgressOrder() // 获取正在进行的订单
    this.T__init() // 腾讯IM初始化
    this.T__Login() // 腾讯IM登录

    // 获取公告 （tpay的功能）
    const params = {
      page: 1,
      page_size: 10,
      search: lang[this.$i18n.locale],
    }
    this.VA__GetNotices(params)
    this.VA__setAdressList() // 获取通讯录 （tpay的功能）
  }
},
```

Vuex：

<u>**src/store/modules/BeePal/***</u>         BeePal 中 getters.js \ state.js \ mutations.js \ actions.js

<u>**src/store/modules/BeePal.js**</u>         BeePal 的 Store 导出

<u>**src/store/getters.js**</u>           全Vuex的总getters



Api：

<u>**src/api/beePal.js**</u>      BeePal主要接口

**<u>src/api/channel.js</u>**    channel支付方式的接口

**<u>src/api/coin.js</u>**    币种的接口

**<u>src/api/user.js</u>**    用户的接口

<u>**src/api/auth.js**</u>    认证的接口

...



View：

<u>**src/view/BeePal_deal/***</u>     BeePal的交易页面

<u>**src/view/BeePal_home/***</u>     BeePal的主页

<u>**src/view/BeePal_scan/***</u>       BeePal的扫一扫

<u>**src/view/chat/***</u>     Tpay/BeePal的聊天

<u>**src/view/demo/scan/***</u>     Tpay/BeePal中加好友的扫一扫

<u>**src/view/my/***</u>     我的页面

<u>**src/view/base/***</u>      注册和登录



SCSS：

<u>**src/styles/layout.js**</u>    专写布局的scss

<u>**src/styles/mixin.js**</u>    适配手机、PC、iOS的scss工具

<u>**src/styles/util.scss**</u>    常见css的工具

<u>**src/styles/utils.scss**</u>    常见宽距css的工具

<u>**src/styles/variable.scss**</u>    页面的控件颜色抽取scss

<u>**src/styles/variable_custom.js**</u>    所有基本颜色的scss