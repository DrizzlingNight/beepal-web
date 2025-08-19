export const Chat = [
  {
    path: '/senddeal',
    name: 'senddeal',
    component: () => import('@/view/deal/senddeal'),
    meta: {
      title: '發送點數',
      // requiredLogin: true,
    },
  },
  {
    path: '/senddeal_2',
    name: 'senddeal_2',
    component: () => import('@/view/deal/senddeal_2'),
    meta: {
      title: '發送點數',
      // requiredLogin: true,
    },
  },
  {
    path: '/senddeal_3',
    name: 'senddeal_3',
    component: () => import('@/view/deal/senddeal_3'),
    meta: {
      title: '確認發送',
      // requiredLogin: true,
    },
  },
  {
    path: '/addfriend',
    name: 'addfriend',
    component: () => import('@/view/demo/scan/addfriend'),
    meta: {
      title: '添加好友',
      // requiredLogin: true,
    },
  },
  {
    path: '/addfriend_2',
    name: 'addfriend_2',
    component: () => import('@/view/demo/scan/addfriend_2'),
    meta: {
      title: '添加好友',
      // requiredLogin: true,
    },
  },
  {
    path: '/addresslist',
    name: 'addresslist',
    component: () => import('@/view/chat/addressList'),
    meta: {
      title: '通訊錄',
      // requiredLogin: true,
    },
  },
  {
    path: '/scanresult',
    name: 'scanresult',
    component: () => import('@/view/demo/scan/scanresult'),
    meta: {
      title: '搜索結果',
      // requiredLogin: true,
    },
  },
  {
    path: '/chatdetail',
    name: 'chatdetail',
    component: () => import('@/view/chat/chatdetail'),
    meta: { title: '消息詳情' },
  },
]
