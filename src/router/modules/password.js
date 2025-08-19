export const ResetPassword = [
  {
    name: 'resetPassword',
    path: '/resetPassword',
    component: () => import('@/view/base/ResetPassword'),
    meta: {
      title: '重置密碼',
    },
  },
  {
    name: 'securityValidation',
    path: '/securityValidation',
    component: () => import('@/view/base/SecurityValidation'),
    meta: {
      title: '安全驗證',
    },
  },
]
