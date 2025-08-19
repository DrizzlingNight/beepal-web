# 第三方划转审核

相关路由： src/router/modules/third.js

## 查询参数

https://www.beex.vip/#/thirdWithdrawCheck?app_id=baaxbet&coinName=ETH_USDT&to=CNY

- app_id：对接第三方应用的 app_id。（ getThirdPartyList ）
- coinName：匹配第三方应用账号的币种。（ thirdPartyLogin ）
- to：选择汇率转换的币种。汇率从 getThirdPartyList 中获取，参数为 rate_dict。