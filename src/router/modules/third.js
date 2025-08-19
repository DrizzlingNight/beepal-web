export const Third = [
  {
    path: '/thirdWithdrawCheck',
    name: 'thirdWithdrawCheck',
    component: () => import('@/view/my/thirdWithdrawCheck'),
    meta: { title: '第三方提款審覈' }
  },
  {
    path: '/thirdCurrency',
    name: 'thirdCurrency',
    component: () => import('@/view/trade/ThirdTrade'),
    meta: { title: '法幣' }
  },
  {
    path: '/thirdWithdraw',
    name: 'thirdWithdraw',
    component: () => import('@/view/my/deposit-withdraw/ThirdWithdraw'),
    meta: { title: '第三方提幣' }
  },
  {
    path: '/thirdPayAccount',
    name: 'thirdPayAccount',
    component: () => import('@/view/my/thirdPayAccount/index.vue'),
    meta: { title: '第三方綁定賬戶' }
  },
  {
    path: '/thirdSetAccount',
    name: 'thirdSetAccount',
    component: () => import('@/view/my/payAccount/AddBankCard.vue'),
    meta: {
      title: '第三方添加銀行卡',
    },
  },
  {
    path: '/thirdAccountInfo',
    name: 'thirdAccountInfo',
    component: () => import('@/view/my/payAccount/BankCardInfo.vue'),
    meta: {
      title: '第三方收款方式',
    },
  }
]
