export const Trade = [
  {
    path: '/trade',
    name: 'trade',
    component: () => import('@/view/BeePal_trade/index'),
    meta: {
      title: '廣告商',
      keepAlive: true,
      // requiredLogin: true,
    },
  },
  {
    path: '/createOffer',
    name: 'createOffer',
    component: () => import('@/view/BeePal_trade/Secondary/createOffer'),
    meta: {
      title: '創建出價',
    },
    children: [
      {
        path: 'offerDetail',
        name: 'offerDetail',
        component: () => import('@/view/BeePal_trade/Secondary/offerDetail'),
        meta: {
          title: '填寫支付信息',
        },
      },
      {
        path: 'offerPrice',
        name: 'offerPrice',
        component: () => import('@/view/BeePal_trade/Secondary/offerPrice'),
        meta: {
          title: '填寫交易價格',
        },
      },
      {
        path: 'offerAuth',
        name: 'offerAuth',
        component: () => import('@/view/BeePal_trade/Secondary/offerAuth'),
        meta: {
          title: '填寫驗證信息',
        },
      },
      {
        path: 'offerConfirm',
        name: 'offerConfirm',
        component: () => import('@/view/BeePal_trade/Secondary/offerConfirm'),
        meta: {
          title: '確認信息',
        },
      },
      {
        path: 'offerSuccess',
        name: 'offerSuccess',
        component: () => import('@/view/BeePal_trade/Secondary/offerSuccess'),
        meta: {
          title: '創建成功',
        },
      },
    ]
  },
]
