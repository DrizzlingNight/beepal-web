// 第三方應用登錄註冊主題配置： src/mixins/theme-config.js
// 整合 Beex 和 第三方應用 的 登錄註冊： src/view/base/login-register/index.vue

const loginRegisterTheme = {
  'login_sports': 'baaxbet',
  'login_planet': 'baaxplanet',
  'login_sg': 'igksg',
  'login_3rd': 'BAAXVIDEO',
  'login_jimusg': 'jimusg',

  'register_sports': 'baaxbet',
  'register_planet': 'baaxplanet',
  'register_sg': 'igksg',
  'register_3rd': 'BAAXVIDEO',
  'register_jimusg': 'jimusg',
}

export const Login = [
  {
    name: 'LoginRegister',
    path: '/loginRegister',
    component: () => import('@/view/base/login-register'),
    meta: {
      title: '登錄註冊',
    },
  },
  ...['login', 'login_3rd', 'login_sports', 'login_planet', 'login_sg', 'login_jimusg'].map(path => {
    return {
      name: `${path}`,
      path: `/${path}`,
      redirect: {
        name: 'LoginRegister',
        params: {
          theme: loginRegisterTheme[path],
        }
      }
    }
  })
  // {
  //   name: 'login',
  //   component: () => import('@/view/base/Login'),
  //   meta: {
  //     title: '登錄',
  //   },
  // },
  // {
  //   name: 'login_3rd',
  //   component: () => import('@/view/base/Login_3rd'),
  //   meta: {
  //     title: '第三方登錄',
  //   },
  // },
  // {
  //   name: 'login_sports',
  //   component: () => import('@/view/base/Login_sports'),
  //   meta: {
  //     title: '第三方登錄',
  //   },
  // },
  // {
  //   name: 'login_planet',
  //   component: () => import('@/view/base/Login_planet'),
  //   meta: {
  //     title: '第三方登錄',
  //   },
  // },
  // {
  //   name: 'login_sg',
  //   component: () => import('@/view/base/Login_sg'),
  //   meta: {
  //     title: '第三方登錄',
  //   },
  // },
]

export const Register = [
  ...['register', 'register_3rd', 'register_sports', 'register_planet', 'register_sg', 'register_jimusg'].map(path => {
    return {
      path: `/${path}`,
      redirect: {
        name: 'LoginRegister',
        params: {
          type: 'register',
          theme: loginRegisterTheme[path],
        }
      }
    }
  })
  // {
  //   name: 'register',
  //   component: () => import('@/view/base/Register'),
  //   meta: {
  //     title: '註冊',
  //   },
  // },
  // {
  //   name: 'register_3rd',
  //   component: () => import('@/view/base/Register_3rd'),
  //   meta: {
  //     title: '第三方註冊',
  //   },
  // },
  // {
  //   name: 'register_sports',
  //   component: () => import('@/view/base/Register_sports'),
  //   meta: {
  //     title: '第三方註冊',
  //   },
  // },
  // {
  //   name: 'register_planet',
  //   component: () => import('@/view/base/Register_planet'),
  //   meta: {
  //     title: '第三方註冊',
  //   },
  // },
  // {
  //   name: 'register_sg',
  //   component: () => import('@/view/base/Register_sg'),
  //   meta: {
  //     title: '第三方註冊',
  //   },
  // },
]
