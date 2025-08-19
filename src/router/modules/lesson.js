export const Lesson = [
  {
    path: '/lesson',
    name: 'lesson',
    component: () => import('@/view/lesson/index'),
    meta: {
      title: '課程',
      keepAlive: true,
      // requiredLogin: true,
    },
  },
  {
    path: '/lessonDetail',
    name: 'lessonDetail',
    component: () => import('@/view/lesson/Secondary/lessonDetail'),
    meta: {
      title: '課程目錄',
    },
  },
]
