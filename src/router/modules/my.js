import Layout from '@/layout/default'

export const My = [
  {
    path: '/my',
    component: Layout,
    children: [
      {
        path: 'kyc',
        name: 'kyc',
        component: () => import('@/view/my/Kyc'),
        meta: {
          title: '身份驗證',
        },
      },
      {
        path: 'myInvitationCode',
        name: 'myInvitationCode',
        component: () => import('@/view/my/MyInvitationCode'),
        meta: {
          title: '我的邀請碼',
        },
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import('@/view/my/Auth'),
        meta: {
          title: '基本認證',
        },
      },
      {
        path: '/langChange',
        name: 'langChange',
        component: () => import('@/view/my/Lang'),
        meta: {
          title: '收款',
        },
      },
      {
        name: 'setPassword',
        path: 'setPassword',
        component: () => import('@/view/base/SetPassword'),
        meta: {
          title: '修改密碼',
        },
      },
      {
        name: 'securityPassword',
        path: 'securityPassword',
        component: () => import('@/view/my/SecurityPassword'),
        meta: {
          title: '設置安全密碼',
        },
      },
    ],
  },
  {
    path: '/advanceAuth',
    name: 'advanceAuth',
    component: () => import('@/view/my/AdvanceAuth'),
    meta: {
      title: '高級認證',
    },
  },
  {
    path: '/onprogress',
    name: 'onprogress',
    component: () => import('@/view/my/Audit'),
    meta: {
      title: '審覈中',
    },
  },
  {
    path: '/uploadAuth/:type',
    name: 'uploadAuth',
    component: () => import('@/view/my/UploadAuth'),
    meta: {
      title: '上傳證件',
    },
  },
  {
    path: '/announcement',
    name: 'announcement',
    component: () => import('@/view/my/Announcement'),
    meta: {
      title: '公告消息',
    },
  },
  {
    path: '/announcementDetail',
    name: 'announcementDetail',
    component: () => import('@/view/my/AnnouncementDetail'),
    meta: {
      title: '公告詳情',
    },
  },
  {
    path: '/otcHistory',
    name: 'otcHistory',
    component: () => import('@/view/my/orderHistory'),
    meta: {
      title: 'otc交易記錄',
    },
  },
  {
    path: '/otcPayment',
    name: 'otcPayment',
    component: () => import('@/view/my/OTCPayment'),
    meta: {
      title: 'otc收款方式',
    },
  },
  {
    path: '/addChannel',
    name: 'addChannel',
    component: () => import('@/view/my/AddChannel'),
    meta: {
      title: '添加收款方式',
    },
  },
  {
    path: '/channelOption/:opt',
    name: 'channelOption',
    component: () => import('@/view/my/ChannelOption'),
    meta: {
      title: '收款方式操作',
    },
  },
  {
    path: '/editInfo',
    name: 'editInfo',
    component: () => import('@/view/my/EditInfo'),
    meta: {
      title: '編輯資料',
    },
  },
  {
    path: '/editName',
    name: 'editName',
    component: () => import('@/view/my/EditName'),
    meta: {
      title: '編輯暱稱',
    },
  },
  {
    path: '/myInvitationCode',
    name: 'myInvitationCode',
    component: () => import('@/view/my/MyInvitationCode'),
    meta: {
      title: '我的邀請碼',
    },
  },
  {
    path: '/currencyUnit',
    name: 'currencyUnit',
    component: () => import('@/view/my/CurrencyUnit'),
    meta: {
      title: '貨幣單位',
    },
  },
]
