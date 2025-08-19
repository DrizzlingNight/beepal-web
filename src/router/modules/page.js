import { Login, Register } from '@/router/modules/login-register'
import { ResetPassword } from '@/router/modules/password'
import Layout from '@/layout/index'
import { My } from './my'
import { Chat } from './chat'
import { Trade } from './trade'
import { Lesson } from './lesson'

export const page = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/home', // 首頁
        name: 'home',
        component: () => import('@/view/BeePal_home/index'),
        meta: {
          title: '錢包',
          keepAlive: true,
          // requiredLogin: true,
        },
      },
      {
        path: '/deal', // 交易
        name: 'deal',
        component: () => import('@/view/BeePal_deal/index'),
        meta: {
          title: '交易',
          keepAlive: true,
          // requiredLogin: true,
        },
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/view/chat'),
        meta: {
          title: '聊天',
          // requiredLogin: true,
        },
      },
      {
        path: 'find',
        name: 'find',
        component: () => import('@/view/find/Find'),
        meta: {
          title: '發現',
        },
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/view/my/My'),
        meta: {
          title: '我的',
          keepAlive: true,
          // requiredLogin: true,
        },
      },
    ],
  },
  {
    path: '/detail/:token',
    name: 'tokenDetail',
    component: () => import('@/view/BeePal_home/Secondary/TokenDetail'),
    meta: {
      title: 'token詳情',
    },
  },
  {
    path: '/transfer/:token',
    name: 'transfer',
    component: () => import('@/view/BeePal_home/Secondary/Transfer'),
    meta: {
      title: '轉賬',
    },
  },
  {
    path: '/transferScan',
    name: 'transferScan',
    component: () => import('@/view/BeePal_home/Secondary/TransferScan'),
    meta: {
      title: '轉帳掃碼',
    },
  },
  {
    path: '/gathering/:token',
    name: 'gathering',
    component: () => import('@/view/BeePal_home/Secondary/Gathering'),
    meta: {
      title: '收款',
    },
  },
  {
    path: '/recent/:token',
    name: 'recentTrans',
    component: () => import('@/view/BeePal_home/Secondary/RecentTrans'),
    meta: {
      title: '最近轉賬',
    },
  },
  {
    path: '/b_scan',
    name: 'scan',
    component: () => import('@/view/BeePal_scan/index'),
    meta: {
      title: '掃一掃',
    },
  },
  {
    path: '/scan',
    name: 'scan',
    component: () => import('@/view/demo/scan/index'),
    meta: {
      title: '掃一掃',
    },
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('@/view/BeePal_deal/Secondary/payment'),
    meta: {
      title: '請付款',
    },
  },
  {
    path: '/payfor',
    name: 'payfor',
    component: () => import('@/view/BeePal_deal/Secondary/payfor'),
    meta: {
      title: '付款',
    },
  },
  {
    path: '/lastLap',
    name: 'lastLap',
    component: () => import('@/view/BeePal_deal/Secondary/lastLap'),
    meta: {
      title: '等待確認',
    },
  },
  {
    path: '/appeal',
    name: 'appeal',
    component: () => import('@/view/BeePal_deal/Secondary/appeal'),
    meta: {
      title: '申訴',
    },
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: () =>
      import('@/view/BeePal_deal/Secondary/buyerPaying.vue'),
    meta: {
      title: '等待付款',
    },
  },
  {
    path: '/allDapp',
    name: 'allDapp',
    component: () => import('@/view/find/AllDapp'),
    meta: {
      title: '所有Dapps',
      // requiredLogin: true,
    },
  },
  ...My,
  ...Chat,
  ...Login,
  ...Register,
  ...ResetPassword,
  ...Trade,
  ...Lesson,
  {
    name: '404',
    component: () => import('@/view/base/Page404'),
    meta: {
      title: '404',
    },
  },
  {
    path: '*',
    redirect: '/404',
  },
]
