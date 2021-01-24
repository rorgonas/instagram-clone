
const routes = [
  {
    path: '/',
    component: () => import('layouts/main-layout'),
    children: [
      { path: '', component: () => import('pages/page-home') },
      { path: '/camera', component: () => import('pages/page-camera') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/error-page/404.vue')
  }
]

export default routes
